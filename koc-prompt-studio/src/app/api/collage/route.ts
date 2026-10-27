import { generateText, Output } from "ai";
import { z } from "zod";
import { getModel, isAiConfigured, AiNotConfiguredError } from "@/lib/ai/provider";
import { COLLAGE_SYSTEM } from "@/lib/ai/prompts";
import { CollageStateSchema, PanelSchema } from "@/lib/collage-engine/schema";
import { LAYOUTS } from "@/lib/collage-engine/layouts";
import { handleError } from "@/lib/api";

const Body = z.object({
  brief: z.string().max(2000).default(""),
  state: CollageStateSchema,
});

const Result = z.object({
  identity: z.string(),
  skin: z.string(),
  makeup: z.string(),
  hair: z.string(),
  wardrobeStyle: z.string(),
  outfit: z.string(),
  accessories: z.string(),
  location: z.string(),
  background: z.array(z.string()),
  lightingType: z.string(),
  lightingCharacteristics: z.array(z.string()),
  cameraGenre: z.string(),
  aesthetic: z.array(z.string()),
  mood: z.string(),
  panels: z.array(PanelSchema.extend({ key: z.string() })),
});

export async function POST(req: Request) {
  try {
    if (!isAiConfigured()) throw new AiNotConfiguredError();
    const { brief, state } = Body.parse(await req.json());
    const layout = LAYOUTS[state.layoutId];

    const { output } = await generateText({
      model: getModel(),
      system: COLLAGE_SYSTEM,
      output: Output.object({ schema: Result }),
      prompt: [
        `Layout: ${layout.nameEn}, aspect ratio ${state.aspectRatio}.`,
        `Panel keys (return exactly these, in order): ${layout.slots.map((s) => s.key).join(", ")}`,
        `Brief (Vietnamese): """${brief || "(none – improve current state)"}"""`,
        `Current state (keep non-empty user values unless the brief asks to change):`,
        JSON.stringify(state),
      ].join("\n"),
    });

    return Response.json(output);
  } catch (e) {
    return handleError(e);
  }
}
