import { describe, it, expect } from "vitest";
import { offlineDecomposeIdea } from "@/lib/prompt-engine/decomposer";

describe("offlineDecomposeIdea", () => {
  it("handles empty input safely", () => {
    const res = offlineDecomposeIdea("");
    expect(res.detectedCount).toBe(0);
    expect(res.layers.subject.vi).toBe("");
  });

  it("decomposes a Vietnamese KOC prompt into layers", () => {
    const prompt =
      "Cô gái Việt Nam 22 tuổi rất xinh đẹp, áo dài trắng, đứng mỉm cười ở phố cổ Hội An lúc hoàng hôn, chụp góc cận 85mm f/1.4";
    const res = offlineDecomposeIdea(prompt);

    expect(res.detectedCount).toBeGreaterThan(0);
    expect(res.layers.subject.vi).toContain("Cô gái");
    expect(res.layers.clothing.vi).toContain("áo dài");
    expect(res.layers.setting.vi).toContain("Hội An");
    expect(res.layers.lighting.vi).toContain("hoàng hôn");
    expect(res.layers.camera.vi).toContain("85mm");
  });
});
