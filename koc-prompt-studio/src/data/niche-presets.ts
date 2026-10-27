/**
 * 4 preset theo ngách KOC (02_8LAYER_PROMPT_BUILDER.md mục 4.4)
 */
import type { LayerId } from "@/lib/prompt-engine/layers";

export interface NichePreset {
  slug: string;
  name: string;
  niche: string;
  emoji: string;
  descVi: string;
  layers: Partial<Record<LayerId, { vi: string; en: string }>>;
}

export const NICHE_PRESETS: NichePreset[] = [
  {
    slug: "genz-street",
    name: "KOC Thời trang đường phố Gen Z",
    niche: "Thời trang",
    emoji: "🛹",
    descVi: "Năng động, cá tính, phố thị về đêm",
    layers: {
      subject: { vi: "Cô gái Việt 21 tuổi, KOC Gen Z cá tính", en: "stunning 21-year-old Vietnamese woman, trendy Gen Z content creator, confident aura" },
      facial: { vi: "Mắt to, tóc dài uốn sóng", en: "large round expressive eyes, long softly wavy hair" },
      clothing: { vi: "Áo camisole denim, quần jean ống rộng, sneaker trắng", en: "asymmetric denim camisole top, baggy wide-leg jeans, white chunky sneakers, silver chain necklace" },
      pose: { vi: "Đứng tựa tường, nhìn thẳng ống kính", en: "leaning casually against a graffiti wall, looking directly at the camera, playful smirk" },
      setting: { vi: "Phố đêm, đèn thành phố mờ nhòe", en: "urban street at night, city night lights bokeh" },
      lighting: { vi: "Neon điện ảnh", en: "cinematic neon lighting, teal and magenta accents, soft rim light" },
      camera: { vi: "Toàn thân, ống 35mm", en: "full body shot, sharp focus, shot on Sony A7R IV, 35mm lens, f/1.8" },
    },
  },
  {
    slug: "skincare-closeup",
    name: "KOC Mỹ phẩm Skincare cận mặt",
    niche: "Mỹ phẩm",
    emoji: "🧴",
    descVi: "Cận mặt, da căng bóng tự nhiên, ánh sáng mềm",
    layers: {
      subject: { vi: "Cô gái Việt 24 tuổi, rất xinh đẹp", en: "stunning 24-year-old Vietnamese woman, extremely beautiful, fresh and pure look" },
      facial: { vi: "Da căng bóng, trang điểm trong trẻo", en: "dewy glass skin, clean girl makeup, natural glowing skin" },
      clothing: { vi: "Khăn choàng tắm trắng", en: "white fluffy bathrobe, hair wrapped in a towel" },
      pose: { vi: "Cầm chai serum cạnh má, mỉm cười", en: "holding a glass serum bottle next to her cheek, gentle soft smile, looking at the camera" },
      setting: { vi: "Phòng tắm sáng sủa tối giản", en: "bright minimalist bathroom, clean white tiles" },
      lighting: { vi: "Ánh sáng cửa sổ mềm", en: "soft natural window light, airy bright tones" },
      camera: { vi: "Cận mặt, ống 85mm", en: "close-up beauty portrait, sharp focus, shallow depth of field, 85mm lens, f/1.8" },
    },
  },
  {
    slug: "sport-active",
    name: "KOC Đời sống thể thao năng động",
    niche: "Thể thao",
    emoji: "🏃‍♀️",
    descVi: "Khỏe khoắn, ánh sáng tự nhiên, phòng gym",
    layers: {
      subject: { vi: "Cô gái Việt 23 tuổi, khỏe khoắn", en: "athletic 23-year-old Vietnamese woman, healthy energetic vibe" },
      facial: { vi: "Tóc buộc cao, má ửng hồng", en: "high ponytail, light natural sweat sheen" },
      clothing: { vi: "Đồ thể thao", en: "pastel athleisure sportswear set, sports bra and leggings, running shoes" },
      pose: { vi: "Đang nghỉ giữa giờ tập, cười tươi", en: "resting between workout sets, holding a water bottle, bright joyful smile" },
      setting: { vi: "Phòng gym hiện đại", en: "modern gym interior with large windows" },
      lighting: { vi: "Nắng sớm", en: "morning sunlight streaming through windows, warm color palette" },
      camera: { vi: "Trung cảnh, 50mm", en: "medium shot, sharp focus, 50mm lens, f/2.0" },
    },
  },
  {
    slug: "office-elegant",
    name: "KOC Công sở thanh lịch",
    niche: "Công sở",
    emoji: "💼",
    descVi: "Thanh lịch, chuyên nghiệp, văn phòng hiện đại",
    layers: {
      subject: { vi: "Nữ công sở Việt 27 tuổi", en: "elegant 27-year-old Vietnamese office lady, confident professional aura" },
      facial: { vi: "Tóc ngang vai, trang điểm nhẹ", en: "shoulder-length sleek hair, soft natural makeup" },
      clothing: { vi: "Blazer be, sơ mi lụa trắng", en: "tailored beige blazer, white silk blouse, delicate gold jewelry" },
      pose: { vi: "Cầm cốc cà phê, nghiêng đầu nhẹ", en: "holding a coffee cup, head tilted slightly, warm confident smile" },
      setting: { vi: "Văn phòng hiện đại", en: "modern office interior, glass walls, city view" },
      lighting: { vi: "Ánh sáng tự nhiên dịu", en: "soft diffused daylight, neutral warm tones" },
      camera: { vi: "Bán thân, 85mm", en: "medium shot portrait, sharp focus, shallow depth of field, 85mm lens, f/1.4" },
    },
  },
];
