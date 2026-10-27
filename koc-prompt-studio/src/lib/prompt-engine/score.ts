/**
 * Real-time Realism Score (0–100) + gợi ý "Khắc phục nhanh".
 */
import type { ComposeInput } from "./compose";
import type { LayerId } from "./layers";
import type { RealismGroupId } from "./realism";

export interface ScoreIssue {
  id: string;
  messageVi: string;
  /** Hành động khắc phục nhanh mà UI có thể áp dụng */
  fix:
    | { kind: "enableRealism"; groups: RealismGroupId[] }
    | { kind: "focusLayer"; layer: LayerId }
    | { kind: "enableNegative"; key: "base" | "identity" | "realism" };
  weight: number;
}

export interface ScoreResult {
  score: number;
  level: "low" | "medium" | "high";
  issues: ScoreIssue[];
}

const has = (text: string, ...needles: string[]) =>
  needles.some((n) => text.toLowerCase().includes(n));

export function realismScore(input: ComposeInput): ScoreResult {
  const L = input.layers;
  const filled = (id: LayerId) => L[id]?.enabled && L[id].en.trim().length > 0;
  const realism = input.realismEnabled ? input.realismGroups : [];
  const lightText = `${L.lighting.en} ${realism.includes("light3d") || realism.includes("diffused") ? "lighting" : ""}`;
  const faceText = `${L.facial.en} ${realism.includes("skin") ? "skin texture pores" : ""}`;

  const issues: ScoreIssue[] = [];

  if (!filled("subject"))
    issues.push({
      id: "subject",
      messageVi: "Chưa mô tả nhân vật (Tầng 2).",
      fix: { kind: "focusLayer", layer: "subject" },
      weight: 15,
    });

  if (!has(faceText, "skin", "pores", "texture"))
    issues.push({
      id: "skin",
      messageVi: "Thiếu kết cấu da thật → dễ bị “da nhựa”.",
      fix: { kind: "enableRealism", groups: ["skin"] },
      weight: 20,
    });

  if (!has(lightText, "light", "golden hour", "softbox", "neon"))
    issues.push({
      id: "lighting",
      messageVi: "Chưa có thông số ánh sáng (Tầng 7).",
      fix: { kind: "enableRealism", groups: ["light3d"] },
      weight: 15,
    });

  if (!realism.includes("eyes") && !has(L.facial.en, "catchlight"))
    issues.push({
      id: "eyes",
      messageVi: "Mắt thiếu phản quang (catchlights) → ánh nhìn vô hồn.",
      fix: { kind: "enableRealism", groups: ["eyes"] },
      weight: 10,
    });

  if (!filled("setting"))
    issues.push({
      id: "setting",
      messageVi: "Chưa có bối cảnh (Tầng 6).",
      fix: { kind: "focusLayer", layer: "setting" },
      weight: 8,
    });

  if (!filled("pose"))
    issues.push({
      id: "pose",
      messageVi: "Chưa có tư thế / cảm xúc (Tầng 5).",
      fix: { kind: "focusLayer", layer: "pose" },
      weight: 6,
    });

  if (!filled("clothing"))
    issues.push({
      id: "clothing",
      messageVi: "Chưa mô tả trang phục (Tầng 4).",
      fix: { kind: "focusLayer", layer: "clothing" },
      weight: 6,
    });

  if (!input.negative.base)
    issues.push({
      id: "neg-base",
      messageVi: "Tắt Negative gốc → dễ lỗi giải phẫu, mờ.",
      fix: { kind: "enableNegative", key: "base" },
      weight: 10,
    });

  if (!input.negative.realism)
    issues.push({
      id: "neg-realism",
      messageVi: "Thiếu Negative chống “nhựa AI”.",
      fix: { kind: "enableNegative", key: "realism" },
      weight: 10,
    });

  const penalty = issues.reduce((s, i) => s + i.weight, 0);
  const score = Math.max(0, Math.min(100, 100 - penalty));
  return {
    score,
    level: score >= 80 ? "high" : score >= 50 ? "medium" : "low",
    issues,
  };
}
