/**
 * Sinh JSON prompt từ CollageState.
 */
import { LAYOUTS, type LayoutId } from "./layouts";
import type { CollageJson, CollageState, Panel } from "./schema";

export const IDENTITY_LOCK_RULES = [
  "ALWAYS use the uploaded image as the ONLY facial identity reference",
  "Same person in every panel – identity consistency 100%",
  "DO NOT redesign, beautify, stylize, or modify facial proportions",
  "Exactly match face shape, eyes, nose, lips and skin tone across all frames",
];

const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);

function panelToJson(p: Panel | undefined): { shot_type: string; [x: string]: unknown } {
  const out: { shot_type: string; [x: string]: unknown } = {
    shot_type: p?.shot_type?.trim() || "Medium shot",
  };
  if (p?.expression?.trim()) out.expression = p.expression.trim();
  if (p?.gaze?.trim()) out.gaze = p.gaze.trim();
  if (p?.pose?.trim()) out.pose = p.pose.trim();
  if (p?.notes?.trim()) out.notes = p.notes.trim();
  return out;
}

export function buildCollageJson(state: CollageState): CollageJson {
  const layout = LAYOUTS[state.layoutId];

  const breakdown: Record<string, Record<string, { shot_type: string; [x: string]: unknown }>> = {};
  for (const slot of layout.slots) {
    (breakdown[slot.group] ??= {})[slot.key] = panelToJson(state.panels[slot.key]);
  }

  const requirements = clean([
    ...(state.subject.identityLock ? IDENTITY_LOCK_RULES : []),
    ...state.subject.facialRequirements,
  ]);
  if (!requirements.length) requirements.push("Same face in every panel");

  return {
    project_type: {
      name: state.projectName.trim() || layout.nameEn,
      layout: layout.nameEn,
      aspect_ratio: state.aspectRatio || layout.aspectRatio,
      panel_count: layout.slots.length,
    },
    subject: {
      identity: state.subject.identity.trim() || "young woman",
      ...(state.subject.identityLock ? { identity_lock: true } : {}),
      facial_consistency: { requirements },
      skin: { texture: state.subject.skin.trim() || "natural skin texture, visible pores" },
      makeup: { style: state.subject.makeup.trim() || "natural makeup", consistency: "Same makeup across all frames" },
      hair: { style: state.subject.hair.trim() || "natural hair", consistency: "Same hairstyle across all frames" },
    },
    wardrobe: {
      style: state.wardrobe.style.trim(),
      outfit: {
        main: state.wardrobe.outfit.trim(),
        ...(state.wardrobe.accessories.trim() ? { accessories: state.wardrobe.accessories.trim() } : {}),
      },
      consistency: "Same outfit across all frames",
    },
    environment: {
      location: state.environment.location.trim(),
      background: clean(state.environment.background),
      priority: "Focus on subject",
    },
    lighting: {
      type: state.lighting.type.trim(),
      characteristics: clean(state.lighting.characteristics),
    },
    camera_style: {
      genre: state.camera.genre.trim(),
      aesthetic: clean(state.camera.aesthetic),
      imperfections: clean(state.camera.imperfections),
    },
    panel_breakdown: breakdown,
    ...(state.mood.trim() ? { mood_and_style: state.mood.trim() } : {}),
    quality: { resolution: "8K Ultra HD", render_style: "Ultra-realistic photography" },
  };
}

export function stringifyCollage(json: CollageJson): string {
  return JSON.stringify(json, null, 2);
}

/** Khi đổi layout: giữ panel có cùng key, tạo panel trống cho ô mới */
export function switchLayout(state: CollageState, layoutId: LayoutId): CollageState {
  const layout = LAYOUTS[layoutId];
  const panels: Record<string, Panel> = {};
  for (const s of layout.slots) {
    panels[s.key] = state.panels[s.key] ?? emptyPanel();
  }
  return { ...state, layoutId, aspectRatio: layout.aspectRatio, panels };
}

export function emptyPanel(): Panel {
  return { shot_type: "", expression: "", gaze: "", pose: "", notes: "" };
}
