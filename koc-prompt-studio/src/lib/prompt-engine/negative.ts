/**
 * Bộ Negative Prompt kép.
 * Nguồn: 02_8LAYER_PROMPT_BUILDER.md mục 3.3
 */
import { REALISM_NEGATIVE } from "./realism";

export const NEGATIVE_BASE =
  "blurry, low quality, deformed, ugly, bad anatomy, extra limbs, watermark";

export const NEGATIVE_IDENTITY =
  "changed face, different face, different makeup, different lighting, different background, distorted face, distorted body, added person, changed clothes, fake image, overly strong filter";

export interface NegativeOptions {
  base: boolean;
  identity: boolean;
  realism: boolean;
  custom?: string;
}

export const DEFAULT_NEGATIVE: NegativeOptions = {
  base: true,
  identity: true,
  realism: true,
  custom: "",
};

/** Ghép negative, loại bỏ token trùng lặp (không phân biệt hoa thường) */
export function buildNegative(opts: NegativeOptions): string {
  const parts: string[] = [];
  if (opts.base) parts.push(NEGATIVE_BASE);
  if (opts.identity) parts.push(NEGATIVE_IDENTITY);
  if (opts.realism) parts.push(REALISM_NEGATIVE);
  if (opts.custom?.trim()) parts.push(opts.custom);
  return dedupeTokens(parts.join(", "));
}

export function dedupeTokens(text: string): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.split(",")) {
    const t = raw.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out.join(", ");
}
