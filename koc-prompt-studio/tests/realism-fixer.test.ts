import { describe, it, expect } from "vitest";
import {
  diagnosePromptRealism,
  fixRawPromptWithRealism,
} from "@/lib/prompt-engine/realism";

describe("Realism Fixer Pro Engine", () => {
  it("diagnoses plastic prompt and detects missing pores and catchlights", () => {
    const raw = "A girl in a room, smooth skin, smiling";
    const diag = diagnosePromptRealism(raw);

    expect(diag.score).toBeLessThan(60);
    expect(diag.level).toBe("plastic");
    expect(diag.missingInjections).toContain("skin");
    expect(diag.missingInjections).toContain("eyes");
  });

  it("fixes raw prompt by injecting realism tokens and anti-plastic negative", () => {
    const raw = "A beautiful Vietnamese woman in a cafe";
    const res = fixRawPromptWithRealism(raw, {
      enabledGroups: ["skin", "eyes", "light3d"],
      negativePersona: true,
      aspectRatio: "16:9",
    });

    expect(res.fixedPrompt).toContain("visible skin pores");
    expect(res.fixedPrompt).toContain("natural eye catchlights");
    expect(res.fixedPrompt).toContain("butterfly lighting");
    expect(res.negativePrompt).toContain("plastic skin");
    expect(res.midjourneyPrompt).toContain("--ar 16:9");
    expect(res.midjourneyPrompt).toContain("--style raw");
  });
});
