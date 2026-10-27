/**
 * Định nghĩa bố cục collage: vị trí ô trên lưới (để render) + nhóm hàng (để sinh panel_breakdown).
 */

export type LayoutId = "grid2x2" | "grid3x3" | "triptych" | "magazine";

export interface SlotDef {
  key: string;
  labelVi: string;
  /** Nhóm hàng trong JSON panel_breakdown */
  group: string;
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface LayoutDef {
  id: LayoutId;
  nameVi: string;
  nameEn: string;
  descVi: string;
  aspectRatio: string;
  cols: number;
  rows: number;
  slots: SlotDef[];
}

export const LAYOUTS: Record<LayoutId, LayoutDef> = {
  grid2x2: {
    id: "grid2x2",
    nameVi: "Lưới 2x2",
    nameEn: "4-photo grid collage",
    descVi: "4 ảnh smartphone, thời trang đường phố",
    aspectRatio: "1:1",
    cols: 2,
    rows: 2,
    slots: [
      { key: "top_left", labelVi: "Trên trái", group: "top_row", col: 1, row: 1 },
      { key: "top_right", labelVi: "Trên phải", group: "top_row", col: 2, row: 1 },
      { key: "bottom_left", labelVi: "Dưới trái", group: "bottom_row", col: 1, row: 2 },
      { key: "bottom_right", labelVi: "Dưới phải", group: "bottom_row", col: 2, row: 2 },
    ],
  },
  grid3x3: {
    id: "grid3x3",
    nameVi: "Lưới 3x3",
    nameEn: "3x3 photocard grid collage",
    descVi: "9 khung Idol Photocard, ô giữa là tâm điểm",
    aspectRatio: "9:16",
    cols: 3,
    rows: 3,
    slots: [
      { key: "top_left", labelVi: "Trên trái", group: "top_row", col: 1, row: 1 },
      { key: "top_center", labelVi: "Trên giữa", group: "top_row", col: 2, row: 1 },
      { key: "top_right", labelVi: "Trên phải", group: "top_row", col: 3, row: 1 },
      { key: "center_left", labelVi: "Giữa trái", group: "middle_row", col: 1, row: 2 },
      { key: "center", labelVi: "Trung tâm", group: "middle_row", col: 2, row: 2 },
      { key: "center_right", labelVi: "Giữa phải", group: "middle_row", col: 3, row: 2 },
      { key: "bottom_left", labelVi: "Dưới trái", group: "bottom_row", col: 1, row: 3 },
      { key: "bottom_center", labelVi: "Dưới giữa", group: "bottom_row", col: 2, row: 3 },
      { key: "bottom_right", labelVi: "Dưới phải", group: "bottom_row", col: 3, row: 3 },
    ],
  },
  triptych: {
    id: "triptych",
    nameVi: "Triptych dọc",
    nameEn: "vertical triptych editorial",
    descVi: "3 khung dọc phong cách tạp chí Vogue",
    aspectRatio: "9:16",
    cols: 1,
    rows: 3,
    slots: [
      { key: "top_frame", labelVi: "Khung trên", group: "frames", col: 1, row: 1 },
      { key: "middle_frame", labelVi: "Khung giữa", group: "frames", col: 1, row: 2 },
      { key: "bottom_frame", labelVi: "Khung dưới", group: "frames", col: 1, row: 3 },
    ],
  },
  magazine: {
    id: "magazine",
    nameVi: "Tạp chí bất đối xứng",
    nameEn: "asymmetric magazine layout",
    descVi: "1 ảnh hero lớn + 3 ảnh phụ",
    aspectRatio: "4:5",
    cols: 3,
    rows: 3,
    slots: [
      { key: "hero", labelVi: "Hero", group: "main", col: 1, row: 1, colSpan: 2, rowSpan: 2 },
      { key: "side_top", labelVi: "Phụ trên", group: "side", col: 3, row: 1 },
      { key: "side_bottom", labelVi: "Phụ dưới", group: "side", col: 3, row: 2 },
      { key: "bottom_strip", labelVi: "Dải dưới", group: "bottom", col: 1, row: 3, colSpan: 3 },
    ],
  },
};

export const LAYOUT_LIST = Object.values(LAYOUTS);

/** Lựa chọn nhanh cho Panel Emotion Director */
export const SHOT_TYPES = [
  "Close-up portrait",
  "Extreme close-up on the eyes",
  "Medium shot",
  "Half-body shot",
  "Full body shot",
  "Three-quarter angle shot",
  "Over-the-shoulder shot",
  "Detail shot",
];

export const EXPRESSIONS: { vi: string; en: string }[] = [
  { vi: "Cười ngọt ngào", en: "sweet gentle smile" },
  { vi: "Cười tinh nghịch", en: "playful mischievous grin" },
  { vi: "Nháy mắt", en: "playful wink" },
  { vi: "Ánh nhìn quyến rũ", en: "alluring captivating gaze" },
  { vi: "Điềm tĩnh sang trọng", en: "calm, poised, luxurious expression" },
  { vi: "Mơ màng nhìn xa", en: "dreamy gaze into the distance" },
  { vi: "Bất ngờ đáng yêu", en: "cute surprised expression" },
  { vi: "Trầm tư", en: "thoughtful pensive look" },
];

export const GAZES: { vi: string; en: string }[] = [
  { vi: "Nhìn thẳng", en: "Direct eye contact" },
  { vi: "Nhìn nghiêng", en: "Looking to the side" },
  { vi: "Ngoái qua vai", en: "Looking back over the shoulder" },
  { vi: "Nhìn xuống", en: "Looking down softly" },
  { vi: "Nhìn xa xăm", en: "Looking off into the distance" },
  { vi: "Nhắm mắt", en: "Eyes gently closed" },
];
