/**
 * Realism Fixer Pro Engine: Chẩn đoán & Khử triệt để "chất nhựa AI" cho mọi prompt.
 * Nguồn: 02_8LAYER_PROMPT_BUILDER.md mục 3.2 & tong_hop_ky_thuat_prompt.md mục 2
 */
import type { LayerId } from "./layers";
import { dedupeTokens } from "./negative";

export type RealismGroupId = "skin" | "light3d" | "eyes" | "cheeks" | "diffused" | "camera_raw";

export interface RealismGroup {
  id: RealismGroupId;
  nameVi: string;
  descVi: string;
  layer: LayerId;
  tokens: string;
}

export const REALISM_GROUPS: RealismGroup[] = [
  {
    id: "skin",
    nameVi: "Kết cấu da thật & Lỗ chân lông",
    descVi: "Lỗ chân lông li ti, vân da tự nhiên, chất ảnh thô RAW, không mịn sáp",
    layer: "facial",
    tokens:
      "ultra-realistic human face, natural skin texture, visible skin pores, raw photo, absent of plastic AI look",
  },
  {
    id: "light3d",
    nameVi: "Khối mặt 3D & Butterfly Light",
    descVi: "Ánh sáng cánh bướm kinh điển tôn sống mũi & gò má, tách khối tự nhiên",
    layer: "lighting",
    tokens:
      "soft butterfly lighting on the face, gentle highlights on the tip of the nose and cheekbones",
  },
  {
    id: "eyes",
    nameVi: "Mắt sống động & Phản quang (Catchlights)",
    descVi: "Phản quang giác mạc tự nhiên, tròng mắt sâu có hồn, mống mắt chi tiết",
    layer: "facial",
    tokens:
      "large expressive eyes, clear bright sclera, highly detailed iris, natural eye catchlights, not over-sharpened",
  },
  {
    id: "cheeks",
    nameVi: "Má ửng hồng & Lúm đồng tiền",
    descVi: "Hiệu ứng tán xạ dưới da (Subsurface scattering), ửng hồng tự nhiên khi cười",
    layer: "facial",
    tokens:
      "subtle rosy cheeks, natural warm blush, natural skin translucency, deep natural dimples when smiling",
  },
  {
    id: "diffused",
    nameVi: "Ánh sáng khuếch tán không bóng gắt",
    descVi: "Ánh sáng mềm mại bao quanh, xóa bỏ hoàn toàn bóng đổ khối cứng 3D render",
    layer: "lighting",
    tokens:
      "soft diffused lighting, flat ambient light, strictly no harsh shadows",
  },
  {
    id: "camera_raw",
    nameVi: "Cảm biến máy ảnh cơ & Hạt phim mịn",
    descVi: "Chất màu cảm biến 61MP Sony A7R IV, hạt phim analog mịn hoài cổ",
    layer: "camera",
    tokens:
      "shot on Sony A7R IV 85mm f/1.4 lens, shallow depth of field, subtle film grain",
  },
];

export const DEFAULT_REALISM: RealismGroupId[] = ["skin", "light3d", "eyes", "cheeks", "diffused"];

export const REALISM_NEGATIVE =
  "ai generated, plastic skin, smooth skin, doll, 3d render, cartoon, airbrushed, wax figure, mannequin, overly soft, heavy makeup, fake look, overexposed, harsh shadows";

export interface RealismDiagnosis {
  score: number;
  level: "plastic" | "moderate" | "photorealistic";
  levelNameVi: string;
  detectedIssues: {
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
  }[];
  missingInjections: RealismGroupId[];
}

/** Chẩn đoán bất kỳ prompt nào xem có nguy cơ dính "chất nhựa AI" không */
export function diagnosePromptRealism(promptText: string): RealismDiagnosis {
  const p = promptText.toLowerCase();
  const issues: RealismDiagnosis["detectedIssues"] = [];
  const missing: RealismGroupId[] = [];

  let score = 30; // Điểm cơ bản ban đầu

  // 1. Kiểm tra kết cấu da
  if (p.includes("skin pores") || p.includes("skin texture") || p.includes("raw photo")) {
    score += 25;
  } else {
    issues.push({
      title: "Nguy cơ 'Da sáp tượng ma-nơ-canh'",
      description: "Prompt chưa có token mô tả biểu bì (skin pores, skin texture) → AI sẽ làm mịn da quá mức.",
      severity: "high",
    });
    missing.push("skin");
  }

  // 2. Kiểm tra phản quang mắt
  if (p.includes("catchlight") || p.includes("detailed iris") || p.includes("expressive eyes")) {
    score += 15;
  } else {
    issues.push({
      title: "Nguy cơ 'Ánh mắt vô hồn'",
      description: "Thiếu phản quang giác mạc (catchlights) → đôi mắt nhìn đục và thiếu sức sống.",
      severity: "medium",
    });
    missing.push("eyes");
  }

  // 3. Kiểm tra ánh sáng tạo khối mặt
  if (p.includes("butterfly light") || p.includes("soft rim light") || p.includes("rembrandt")) {
    score += 15;
  } else {
    issues.push({
      title: "Thiếu ánh sáng tạo khối mặt 3D",
      description: "Chưa có bố cục butterfly light → ánh sáng dễ bị phẳng hoặc đổ bóng cứng giả tạo.",
      severity: "medium",
    });
    missing.push("light3d");
  }

  // 4. Kiểm tra sắc hồng da
  if (p.includes("rosy cheeks") || p.includes("natural blush") || p.includes("translucency")) {
    score += 10;
  } else {
    missing.push("cheeks");
  }

  // 5. Kiểm tra thông số máy ảnh cơ
  if (p.includes("sony") || p.includes("canon") || p.includes("85mm") || p.includes("f/1.4")) {
    score += 15;
  } else {
    issues.push({
      title: "Thiếu tiêu cự & cảm biến quang học",
      description: "Chưa chỉ định tiêu cự máy ảnh cơ (85mm f/1.4) → AI sẽ sinh ảnh theo góc render hoạt họa.",
      severity: "low",
    });
    missing.push("camera_raw");
  }

  // Phạt điểm nếu có từ khóa gây nhựa AI
  if (p.includes("smooth") || p.includes("flawless") || p.includes("porcelain") || p.includes("doll")) {
    score = Math.max(10, score - 20);
    issues.unshift({
      title: "Phát hiện từ khóa nguy hiểm gây da nhựa",
      description: "Từ khóa 'smooth', 'flawless' kích hoạt thuật toán xóa lỗ chân lông của mô hình.",
      severity: "high",
    });
  }

  score = Math.min(100, score);

  return {
    score,
    level: score >= 80 ? "photorealistic" : score >= 50 ? "moderate" : "plastic",
    levelNameVi:
      score >= 80
        ? "Đạt chuẩn Hollywood 8K (Không dính nhựa)"
        : score >= 50
        ? "Mức độ trung bình (Vẫn có nguy cơ da mịn giả)"
        : "Nguy cơ dính chất nhựa AI cao (Cần tiêm khử nhựa)",
    detectedIssues: issues,
    missingInjections: missing,
  };
}

export interface RealismFixOptions {
  enabledGroups: RealismGroupId[];
  negativePersona: boolean;
  aspectRatio: string;
  customTokens?: string;
}

/** Tiêm trực tiếp các token khử nhựa vào prompt bất kỳ */
export function fixRawPromptWithRealism(
  rawPrompt: string,
  options: RealismFixOptions
): {
  fixedPrompt: string;
  negativePrompt: string;
  midjourneyPrompt: string;
  fluxPrompt: string;
  injectedCount: number;
} {
  const cleanInput = rawPrompt.trim();
  const injectedTokens: string[] = [];

  for (const g of REALISM_GROUPS) {
    if (options.enabledGroups.includes(g.id)) {
      // Chỉ chèn nếu prompt chưa có token tương tự
      const firstCheckWord = g.tokens.split(" ")[0].toLowerCase();
      if (!cleanInput.toLowerCase().includes(firstCheckWord)) {
        injectedTokens.push(g.tokens);
      }
    }
  }

  if (options.customTokens?.trim()) {
    injectedTokens.push(options.customTokens.trim());
  }

  // Ghép nối mượt mà
  const fixedPrompt = dedupeTokens([cleanInput, ...injectedTokens].filter(Boolean).join(", "));
  const negativePrompt = options.negativePersona
    ? REALISM_NEGATIVE
    : "blurry, low quality, deformed, 3d render";

  const midjourneyPrompt = `${fixedPrompt} --ar ${options.aspectRatio} --style raw --no ${negativePrompt}`;
  const fluxPrompt = `[POSITIVE PROMPT]:\n${fixedPrompt}\n\n[NEGATIVE PROMPT]:\n${negativePrompt}`;

  return {
    fixedPrompt,
    negativePrompt,
    midjourneyPrompt,
    fluxPrompt,
    injectedCount: injectedTokens.length,
  };
}

/** Trả về map tầng → danh sách token realism cần chèn cho 8 tầng */
export function realismInjections(
  groups: RealismGroupId[],
): Partial<Record<LayerId, string[]>> {
  const out: Partial<Record<LayerId, string[]>> = {};
  for (const g of REALISM_GROUPS) {
    if (!groups.includes(g.id)) continue;
    (out[g.layer] ??= []).push(g.tokens);
  }
  return out;
}
