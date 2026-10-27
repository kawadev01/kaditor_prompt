/**
 * Biên dịch 8 tầng → prompt tiếng Anh hoàn chỉnh + bảng phân tích song ngữ.
 * Logic thuần, không gọi AI → chạy được offline & có unit test.
 */
import { LAYER_IDS, LAYER_MAP, type LayerId, type LayerState } from "./layers";
import { realismInjections, type RealismGroupId } from "./realism";
import { buildNegative, dedupeTokens, type NegativeOptions } from "./negative";

export interface ComposeInput {
  layers: LayerState;
  /** Thứ tự tầng (người dùng có thể kéo thả). Mặc định 1 → 8 */
  order?: LayerId[];
  realismEnabled: boolean;
  realismGroups: RealismGroupId[];
  negative: NegativeOptions;
  /** Thêm câu "nhân vật ở trung tâm, không có người khác" */
  soloSubject?: boolean;
}

export interface ComposedSegment {
  layer: LayerId;
  index: number;
  nameVi: string;
  vi: string;
  en: string;
  /** Token được thêm tự động (mặc định / realism) */
  autoEn: string[];
  usedDefault: boolean;
}

export interface ComposeResult {
  prompt: string;
  negative: string;
  segments: ComposedSegment[];
}

export const SOLO_SUBJECT_TOKENS =
  "single subject centered in frame, no other people in the frame";

export function composePrompt(input: ComposeInput): ComposeResult {
  const order = normalizeOrder(input.order);
  const inject = input.realismEnabled ? realismInjections(input.realismGroups) : {};
  const segments: ComposedSegment[] = [];

  for (const id of order) {
    const def = LAYER_MAP[id];
    const val = input.layers[id];
    if (!val || !val.enabled) continue;

    const userEn = val.en.trim();
    const autoEn: string[] = [];
    let usedDefault = false;

    if (!userEn && def.defaultEn) {
      autoEn.push(def.defaultEn);
      usedDefault = true;
    }
    if (id === "subject" && input.soloSubject) autoEn.push(SOLO_SUBJECT_TOKENS);
    for (const t of inject[id] ?? []) autoEn.push(t);

    const en = dedupeTokens([userEn, ...autoEn].filter(Boolean).join(", "));
    if (!en) continue;

    segments.push({
      layer: id,
      index: def.index,
      nameVi: def.nameVi,
      vi: val.vi.trim(),
      en,
      autoEn,
      usedDefault,
    });
  }

  return {
    prompt: segments.map((s) => s.en).join(", "),
    negative: buildNegative(input.negative),
    segments,
  };
}

/** Đảm bảo thứ tự chứa đủ 8 tầng, không trùng */
export function normalizeOrder(order?: LayerId[]): LayerId[] {
  if (!order?.length) return [...LAYER_IDS];
  const seen = new Set<LayerId>();
  const out: LayerId[] = [];
  for (const id of order) {
    if (LAYER_IDS.includes(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  for (const id of LAYER_IDS) if (!seen.has(id)) out.push(id);
  return out;
}

/** Định dạng xuất khẩu cho Midjourney: prompt + --no negative */
export function toMidjourney(result: ComposeResult, aspect = "2:3"): string {
  return `${result.prompt} --ar ${aspect} --style raw --no ${result.negative}`;
}
