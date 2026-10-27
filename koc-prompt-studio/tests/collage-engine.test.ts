import { describe, expect, it } from "vitest";
import { buildCollageJson, stringifyCollage, switchLayout } from "@/lib/collage-engine/build";
import { validateCollageJson } from "@/lib/collage-engine/schema";
import { LAYOUTS } from "@/lib/collage-engine/layouts";
import { COLLAGE_PRESETS, blankCollageState } from "@/data/collage-presets";

describe("collage presets", () => {
  for (const p of COLLAGE_PRESETS) {
    it(`${p.slug} sinh JSON hợp lệ, đủ số ô`, () => {
      const json = buildCollageJson(p.state);
      const v = validateCollageJson(stringifyCollage(json));
      expect(v.issues).toEqual([]);
      expect(json.project_type.panel_count).toBe(LAYOUTS[p.state.layoutId].slots.length);
      const count = Object.values(json.panel_breakdown).reduce(
        (n, row) => n + Object.keys(row).length,
        0,
      );
      expect(count).toBe(json.project_type.panel_count);
    });
  }

  it("idol 3x3: ô trung tâm nhìn thẳng", () => {
    const json = buildCollageJson(COLLAGE_PRESETS[0].state);
    expect(json.panel_breakdown.middle_row.center.gaze).toBe("Direct eye contact");
    expect(json.subject.identity_lock).toBe(true);
  });
});

describe("switchLayout", () => {
  it("giữ panel trùng key, tạo ô mới", () => {
    const s = switchLayout(COLLAGE_PRESETS[0].state, "grid2x2");
    expect(Object.keys(s.panels)).toEqual(["top_left", "top_right", "bottom_left", "bottom_right"]);
    expect(s.panels.top_left.shot_type).toBe("Medium shot");
    expect(s.aspectRatio).toBe("1:1");
  });

  it("state trống vẫn sinh JSON hợp lệ", () => {
    const v = validateCollageJson(stringifyCollage(buildCollageJson(blankCollageState())));
    expect(v.ok).toBe(true);
  });
});

describe("validateCollageJson", () => {
  it("báo lỗi cú pháp", () => {
    expect(validateCollageJson("{ bad").ok).toBe(false);
  });
  it("báo thiếu trường", () => {
    const v = validateCollageJson(JSON.stringify({ project_type: { name: "x" } }));
    expect(v.ok).toBe(false);
    expect(v.issues.length).toBeGreaterThan(0);
  });
});
