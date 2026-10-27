import { generateText, Output } from "ai";
import { z } from "zod";
import { getModel, isAiConfigured } from "@/lib/ai/provider";
import { DECOMPOSE_SYSTEM } from "@/lib/ai/prompts";
import { LAYER_IDS } from "@/lib/prompt-engine/layers";
import { offlineDecomposeIdea } from "@/lib/prompt-engine/decomposer";
import { handleError } from "@/lib/api";

const Body = z.object({
  idea: z.string().trim().min(1).max(2000),
});

const Result = z.object({
  layers: z.record(
    z.enum(LAYER_IDS),
    z.object({
      vi: z.string().describe("Mô tả ngắn tiếng Việt"),
      en: z.string().describe("English photography tokens"),
    })
  ),
  detectedCount: z.number().optional(),
});

export async function POST(req: Request) {
  let userIdea = "";
  try {
    const rawJson = await req.json();
    const body = Body.parse(rawJson);
    userIdea = body.idea;

    // Nếu chưa cấu hình AI key → Chạy bộ phân tích offline thông minh
    if (!isAiConfigured()) {
      const offline = offlineDecomposeIdea(body.idea);
      const formattedLayers: Record<string, { vi: string; en: string }> = {};
      for (const [k, v] of Object.entries(offline.layers)) {
        formattedLayers[k] = { vi: v.vi, en: v.en };
      }
      return Response.json({
        layers: formattedLayers,
        detectedCount: offline.detectedCount,
        source: "offline",
      });
    }

    const { output } = await generateText({
      model: getModel(),
      system: DECOMPOSE_SYSTEM,
      output: Output.object({ schema: Result }),
      prompt: `Idea in Vietnamese to decompose into 8 layers:\n"""${body.idea}"""`,
    });

    return Response.json({
      layers: output.layers,
      detectedCount: Object.keys(output.layers).length,
      source: "ai",
    });
  } catch (e) {
    // Nếu AI gặp lỗi mạng, quota hay model version, fallback sang offline ngay
    if (userIdea) {
      const offline = offlineDecomposeIdea(userIdea);
      const formattedLayers: Record<string, { vi: string; en: string }> = {};
      for (const [k, v] of Object.entries(offline.layers)) {
        formattedLayers[k] = { vi: v.vi, en: v.en };
      }
      return Response.json({
        layers: formattedLayers,
        detectedCount: offline.detectedCount,
        source: "offline-fallback",
      });
    }
    return handleError(e);
  }
}
