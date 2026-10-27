import { generateText, Output } from "ai";
import { z } from "zod";
import { getModel, isAiConfigured, AiNotConfiguredError } from "@/lib/ai/provider";
import { TRANSLATE_SYSTEM } from "@/lib/ai/prompts";
import { LAYER_IDS, LAYER_MAP } from "@/lib/prompt-engine/layers";
import { offlineTranslate } from "@/data/keywords";
import { handleError } from "@/lib/api";

const Body = z.object({
  layer: z.enum(LAYER_IDS),
  vi: z.string().trim().min(1).max(1000),
  /** Bối cảnh các tầng khác (EN) giúp AI dịch nhất quán */
  context: z.string().max(3000).optional(),
});

const Result = z.object({
  en: z.string().describe("Comma-separated English keywords for this layer"),
  terms: z
    .array(z.object({ en: z.string(), vi: z.string().describe("Giải thích ngắn bằng tiếng Việt") }))
    .describe("Each phrase with a Vietnamese explanation"),
});

export async function POST(req: Request) {
  let body: z.infer<typeof Body> | null = null;
  try {
    body = Body.parse(await req.json());

    // Không có API key → dịch offline bằng từ điển
    if (!isAiConfigured()) {
      const off = offlineTranslate(body.layer, body.vi);
      if (!off.en) throw new AiNotConfiguredError();
      return Response.json({ en: off.en, terms: [], source: "offline", unmatched: off.unmatched });
    }

    const def = LAYER_MAP[body.layer];
    const { output } = await generateText({
      model: getModel(),
      system: TRANSLATE_SYSTEM,
      output: Output.object({ schema: Result }),
      prompt: [
        `Layer ${def.index} (${body.layer}) – ${def.nameEn}.`,
        body.context ? `Other layers for context (do not repeat): ${body.context}` : "",
        `Vietnamese input: """${body.vi}"""`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return Response.json({ ...output, source: "ai" });
  } catch (e) {
    // Nếu AI gặp lỗi tạm thời (quota, rate-limit), tự động fallback sang từ điển offline
    if (body) {
      const off = offlineTranslate(body.layer, body.vi);
      return Response.json({
        en: off.en || body.vi,
        terms: [],
        source: "offline-fallback",
        unmatched: off.unmatched,
      });
    }
    return handleError(e);
  }
}
