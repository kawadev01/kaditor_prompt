import { describe, expect, it } from "vitest";
import { composePrompt, normalizeOrder } from "@/lib/prompt-engine/compose";
import { emptyLayerState, LAYER_IDS } from "@/lib/prompt-engine/layers";
import { buildNegative, NEGATIVE_BASE, NEGATIVE_IDENTITY, DEFAULT_NEGATIVE } from "@/lib/prompt-engine/negative";
import { DEFAULT_REALISM } from "@/lib/prompt-engine/realism";
import { realismScore } from "@/lib/prompt-engine/score";
import { offlineTranslate } from "@/data/keywords";

const base = () => ({
  layers: emptyLayerState(),
  realismEnabled: false,
  realismGroups: DEFAULT_REALISM,
  negative: { ...DEFAULT_NEGATIVE },
});

describe("composePrompt", () => {
  it("dùng mặc định cho tầng 1 và 8 khi trống, đúng thứ tự", () => {
    const r = composePrompt(base());
    expect(r.segments.map((s) => s.layer)).toEqual(["quality", "camera"]);
    expect(r.prompt.startsWith("ultra-realistic")).toBe(true);
    expect(r.prompt).toContain("85mm lens");
  });

  it("giữ thứ tự 1→8 và ghép token người dùng", () => {
    const input = base();
    input.layers.subject.en = "stunning 22-year-old Vietnamese woman";
    input.layers.setting.en = "wooden balcony at sunset";
    const r = composePrompt(input);
    const iSub = r.prompt.indexOf("Vietnamese");
    const iSet = r.prompt.indexOf("balcony");
    const iCam = r.prompt.indexOf("85mm");
    expect(iSub).toBeLessThan(iSet);
    expect(iSet).toBeLessThan(iCam);
  });

  it("tôn trọng thứ tự kéo thả và tầng bị tắt", () => {
    const input = base();
    input.layers.subject.en = "woman";
    input.layers.quality.enabled = false;
    const r = composePrompt({ ...input, order: ["camera", "subject"] });
    expect(r.segments.map((s) => s.layer)).toEqual(["camera", "subject"]);
  });

  it("Realism Fixer chèn token vào đúng tầng", () => {
    const r = composePrompt({ ...base(), realismEnabled: true });
    const facial = r.segments.find((s) => s.layer === "facial");
    const lighting = r.segments.find((s) => s.layer === "lighting");
    expect(facial?.en).toContain("visible skin pores");
    expect(facial?.en).toContain("natural eye catchlights");
    expect(lighting?.en).toContain("butterfly lighting");
  });

  it("loại token trùng lặp", () => {
    const input = { ...base(), realismEnabled: true };
    input.layers.facial.en = "visible skin pores";
    const facial = composePrompt(input).segments.find((s) => s.layer === "facial")!;
    expect(facial.en.match(/visible skin pores/g)?.length).toBe(1);
  });
});

describe("normalizeOrder", () => {
  it("bổ sung tầng thiếu và bỏ trùng", () => {
    expect(normalizeOrder(["camera", "camera", "subject"])).toHaveLength(LAYER_IDS.length);
    expect(normalizeOrder()).toEqual([...LAYER_IDS]);
  });
});

describe("buildNegative", () => {
  it("ghép negative kép", () => {
    const n = buildNegative({ base: true, identity: true, realism: false });
    expect(n).toContain(NEGATIVE_BASE.split(",")[0]);
    expect(n).toContain(NEGATIVE_IDENTITY.split(",")[0]);
    expect(n).not.toContain("plastic skin");
  });
});

describe("realismScore", () => {
  it("điểm thấp khi trống, cao khi đầy đủ + realism", () => {
    const empty = realismScore(base());
    expect(empty.level).toBe("low");

    const full = { ...base(), realismEnabled: true };
    for (const id of LAYER_IDS) full.layers[id].en = "x";
    full.layers.lighting.en = "golden hour lighting";
    const r = realismScore(full);
    expect(r.score).toBe(100);
    expect(r.issues).toHaveLength(0);
  });
});

describe("offlineTranslate", () => {
  it("khớp cụm tiếng Việt kể cả không dấu", () => {
    const r = offlineTranslate("camera", "can canh trung binh, ống 85mm f/1.4");
    expect(r.en).toContain("medium shot portrait");
    expect(r.en).toContain("85mm lens");
  });
});
