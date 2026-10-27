/**
 * Zod schema cho state chỉnh sửa và JSON prompt đầu ra.
 * Cấu trúc theo 05_JSON_PROMPT_COLLAGE_GENERATOR.md mục 3.1
 */
import { z } from "zod";

export const PanelSchema = z.object({
  shot_type: z.string().default(""),
  expression: z.string().default(""),
  gaze: z.string().default(""),
  pose: z.string().default(""),
  notes: z.string().default(""),
});
export type Panel = z.infer<typeof PanelSchema>;

export const CollageStateSchema = z.object({
  layoutId: z.enum(["grid2x2", "grid3x3", "triptych", "magazine"]),
  projectName: z.string(),
  aspectRatio: z.string(),
  subject: z.object({
    identity: z.string(),
    identityLock: z.boolean(),
    facialRequirements: z.array(z.string()),
    skin: z.string(),
    makeup: z.string(),
    hair: z.string(),
  }),
  wardrobe: z.object({
    style: z.string(),
    outfit: z.string(),
    accessories: z.string(),
  }),
  environment: z.object({
    location: z.string(),
    background: z.array(z.string()),
  }),
  lighting: z.object({
    type: z.string(),
    characteristics: z.array(z.string()),
  }),
  camera: z.object({
    genre: z.string(),
    aesthetic: z.array(z.string()),
    imperfections: z.array(z.string()),
  }),
  mood: z.string(),
  panels: z.record(z.string(), PanelSchema),
});
export type CollageState = z.infer<typeof CollageStateSchema>;

const nonEmpty = z.string().min(1);

/** Schema JSON đầu ra – dùng cho validator realtime */
export const CollageJsonSchema = z.object({
  project_type: z.object({
    name: nonEmpty,
    layout: nonEmpty,
    aspect_ratio: z.string().regex(/^\d+:\d+$/, "aspect_ratio phải dạng W:H"),
    panel_count: z.number().int().positive(),
  }),
  subject: z.object({
    identity: nonEmpty,
    identity_lock: z.boolean().optional(),
    facial_consistency: z.object({ requirements: z.array(nonEmpty).min(1) }),
    skin: z.record(z.string(), z.unknown()).or(z.string()),
    makeup: z.record(z.string(), z.unknown()).or(z.string()),
    hair: z.record(z.string(), z.unknown()).or(z.string()),
  }),
  wardrobe: z.object({
    style: z.string(),
    outfit: z.record(z.string(), z.unknown()).or(z.string()),
    consistency: nonEmpty,
  }),
  environment: z.object({
    location: z.string(),
    background: z.array(z.string()),
    priority: z.string(),
  }),
  lighting: z.object({ type: z.string(), characteristics: z.array(z.string()) }),
  camera_style: z.object({
    genre: z.string(),
    aesthetic: z.array(z.string()),
    imperfections: z.array(z.string()),
  }),
  panel_breakdown: z.record(
    z.string(),
    z.record(
      z.string(),
      z.object({ shot_type: nonEmpty }).catchall(z.unknown()),
    ),
  ),
  mood_and_style: z.string().optional(),
  quality: z.object({ resolution: nonEmpty, render_style: nonEmpty }),
});
export type CollageJson = z.infer<typeof CollageJsonSchema>;

export interface ValidationIssue {
  path: string;
  message: string;
}

/** Validate chuỗi JSON (người dùng có thể sửa tay) → danh sách lỗi dễ đọc */
export function validateCollageJson(text: string): {
  ok: boolean;
  issues: ValidationIssue[];
  data?: CollageJson;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return {
      ok: false,
      issues: [{ path: "(cú pháp)", message: (e as Error).message }],
    };
  }
  const r = CollageJsonSchema.safeParse(parsed);
  if (r.success) return { ok: true, issues: [], data: r.data };
  return {
    ok: false,
    issues: r.error.issues.map((i) => ({
      path: i.path.join(".") || "(gốc)",
      message: i.message,
    })),
  };
}
