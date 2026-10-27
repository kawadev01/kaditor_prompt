import { generateText, Output } from "ai";
import { z } from "zod";
import { getModel, isAiConfigured, AiNotConfiguredError } from "@/lib/ai/provider";
import { COMPOSE_SYSTEM } from "@/lib/ai/prompts";
import { LAYER_IDS } from "@/lib/prompt-engine/layers";
import { handleError } from "@/lib/api";

const Body = z.object({
  prompt: z.string().min(1).max(6000),
  segments: z
    .array(z.object({ layer: z.enum(LAYER_IDS), vi: z.string(), en: z.string() }))
    .max(12),
});

const Result = z.object({
  optimized: z.string().describe("Single optimized English prompt"),
  breakdown: z.array(
    z.object({
      layer: z.enum(LAYER_IDS),
      en: z.string(),
      vi: z.string().describe("Giải thích tiếng Việt"),
    }),
  ),
  tips: z.array(z.string()).max(3).describe("Mẹo tiếng Việt"),
});

export async function POST(req: Request) {
  try {
    if (!isAiConfigured()) throw new AiNotConfiguredError();
    const body = Body.parse(await req.json());

    const { output } = await generateText({
      model: getModel(),
      system: COMPOSE_SYSTEM,
      output: Output.object({ schema: Result }),
      prompt: `Assembled prompt:\n${body.prompt}\n\nLayers (JSON):\n${JSON.stringify(body.segments)}`,
    });

    return Response.json(output);
  } catch (e) {
    return handleError(e);
  }
}
