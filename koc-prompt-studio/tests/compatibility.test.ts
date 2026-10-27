import { describe, it, expect } from "vitest";
import { analyzeLogicCompatibility } from "@/lib/prompt-engine/compatibility";
import { emptyLayerState } from "@/lib/prompt-engine/layers";

describe("analyzeLogicCompatibility", () => {
  it("detects closeup context and warns on fullbody clothing contradiction", () => {
    const layers = emptyLayerState();
    layers.camera.vi = "Cận cảnh chân dung, ống 85mm f/1.4";
    layers.clothing.vi = "Quần jean ống rộng và sneaker trắng";

    const res = analyzeLogicCompatibility(layers);
    expect(res.activeContexts).toContain("closeup");
    expect(res.contradictions.some((c) => c.id === "closeup-vs-shoes")).toBe(true);
  });

  it("detects sunset context and recommends golden hour lighting", () => {
    const layers = emptyLayerState();
    layers.setting.vi = "Phố cổ Hội An lúc hoàng hôn chiều tà";

    const res = analyzeLogicCompatibility(layers);
    expect(res.activeContexts).toContain("sunset");
    expect(res.activeContexts).toContain("vintage");
    expect(res.recommendations.some((r) => r.layer === "lighting")).toBe(true);
  });
});
