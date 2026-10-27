/**
 * Định nghĩa 8 tầng prompt điện ảnh theo thứ tự ưu tiên của mô hình thị giác.
 * Nguồn: 02_8LAYER_PROMPT_BUILDER.md – mục 3.1
 */

export const LAYER_IDS = [
  "quality",
  "subject",
  "facial",
  "clothing",
  "pose",
  "setting",
  "lighting",
  "camera",
  "realism",
] as const;

export type LayerId = (typeof LAYER_IDS)[number];

export interface LayerDef {
  id: LayerId;
  index: number;
  nameVi: string;
  nameEn: string;
  hintVi: string;
  placeholderVi: string;
  /** Giá trị mặc định (tiếng Anh) khi người dùng để trống – chỉ áp cho tầng 1 & 8 */
  defaultEn?: string;
  icon: string;
}

export const LAYERS: LayerDef[] = [
  {
    id: "quality",
    index: 1,
    nameVi: "Chất lượng & Phong cách",
    nameEn: "Quality & Style Prefix",
    hintVi: "Thông số chất lượng đỉnh cao, phong cách nhiếp ảnh tổng thể.",
    placeholderVi: "VD: ảnh chụp chân thực, điện ảnh, 8K",
    defaultEn:
      "ultra-realistic, photorealistic, masterpiece, best quality, highly detailed, 8k, cinematic, professional photography",
    icon: "✦",
  },
  {
    id: "subject",
    index: 2,
    nameVi: "Chủ thể / Nhân vật",
    nameEn: "Subject / Persona",
    hintVi: "Độ tuổi, giới tính, quốc tịch, thần thái.",
    placeholderVi: "VD: cô gái Việt Nam 22 tuổi, rất xinh đẹp",
    icon: "◉",
  },
  {
    id: "facial",
    index: 3,
    nameVi: "Khuôn mặt & Hình thể",
    nameEn: "Facial & Body Details",
    hintVi: "Cấu trúc mặt, sống mũi, khóe môi, vòng eo, lúm đồng tiền.",
    placeholderVi: "VD: mắt to tròn, sống mũi cao, lúm đồng tiền",
    icon: "◐",
  },
  {
    id: "clothing",
    index: 4,
    nameVi: "Trang phục & Phụ kiện",
    nameEn: "Clothing & Accessories",
    hintVi: "Kiểu áo, chất liệu vải, trang sức.",
    placeholderVi: "VD: đầm lụa voan trắng, hoa tai pha lê",
    icon: "◇",
  },
  {
    id: "pose",
    index: 5,
    nameVi: "Tư thế & Cảm xúc",
    nameEn: "Pose & Emotion",
    hintVi: "Dáng đứng, góc nghiêng đầu, ánh nhìn.",
    placeholderVi: "VD: nghiêng đầu nhẹ, mỉm cười nhìn vào ống kính",
    icon: "◑",
  },
  {
    id: "setting",
    index: 6,
    nameVi: "Bối cảnh & Môi trường",
    nameEn: "Setting & Environment",
    hintVi: "Địa điểm, thời gian, hậu cảnh.",
    placeholderVi: "VD: ban công gỗ lúc hoàng hôn, đèn thành phố mờ",
    icon: "▣",
  },
  {
    id: "lighting",
    index: 7,
    nameVi: "Ánh sáng, Màu sắc & Mood",
    nameEn: "Lighting, Color & Mood",
    hintVi: "Kiểu ánh sáng, tông màu, cảm xúc tổng thể.",
    placeholderVi: "VD: ánh sáng giờ vàng, viền sáng nhẹ",
    icon: "☀",
  },
  {
    id: "camera",
    index: 8,
    nameVi: "Máy ảnh & Kỹ thuật",
    nameEn: "Camera & Technical Details",
    hintVi: "Góc chụp, tiêu cự, khẩu độ, độ sâu trường ảnh.",
    placeholderVi: "VD: cận cảnh trung bình, ống 85mm f/1.4",
    defaultEn:
      "medium shot portrait, sharp focus, shallow depth of field, shot on Sony A7R IV, 85mm lens, f/1.4",
    icon: "◎",
  },
  {
    id: "realism",
    index: 9,
    nameVi: "Khử Nhựa AI & Siêu Thực",
    nameEn: "Realism & Anti-Plastic Fixer",
    hintVi: "Khử sáp AI, bơm kết cấu da thật, lỗ chân lông vi mô, catchlights đáy mắt, khối mặt 3D.",
    placeholderVi: "VD: da thật có lỗ chân lông, mắt sáng có catchlights, má ửng hồng tự nhiên, không nhựa AI",
    icon: "🛡️",
  },
];

export const LAYER_MAP: Record<LayerId, LayerDef> = Object.fromEntries(
  LAYERS.map((l) => [l.id, l]),
) as Record<LayerId, LayerDef>;

/** Giá trị của một tầng: văn bản tiếng Việt người dùng nhập + token tiếng Anh (đã dịch / chọn) */
export interface LayerValue {
  vi: string;
  en: string;
  enabled: boolean;
}

export type LayerState = Record<LayerId, LayerValue>;

export function emptyLayerState(): LayerState {
  return Object.fromEntries(
    LAYER_IDS.map((id) => [id, { vi: "", en: "", enabled: true }]),
  ) as LayerState;
}
