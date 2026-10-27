/**
 * 3 preset collage độc quyền (05_JSON_PROMPT_COLLAGE_GENERATOR.md mục 3.2)
 */
import type { CollageState } from "@/lib/collage-engine/schema";

export interface CollagePreset {
  slug: string;
  name: string;
  emoji: string;
  descVi: string;
  state: CollageState;
}

export const COLLAGE_PRESETS: CollagePreset[] = [
  {
    slug: "idol-3x3",
    name: "Korean Idol Photocard 3x3",
    emoji: "💖",
    descVi: "9 khung 9:16, ô giữa cận mặt nhìn thẳng",
    state: {
      layoutId: "grid3x3",
      projectName: "Korean Idol Photocard Series",
      aspectRatio: "9:16",
      subject: {
        identity: "Beautiful young Korean-style idol woman, early 20s",
        identityLock: true,
        facialRequirements: ["Same face in all 9 panels", "Consistent facial features and proportions"],
        skin: "Natural glowing skin, visible fine pores, soft dewy finish",
        makeup: "Clean girl makeup, soft peach blush, glossy lips",
        hair: "Long softly wavy dark brown hair",
      },
      wardrobe: {
        style: "Casual idol off-duty",
        outfit: "Oversized crisp white button-up shirt",
        accessories: "Small silver hoop earrings",
      },
      environment: {
        location: "Bright minimalist photo studio",
        background: ["Soft cream seamless backdrop", "Clean and uncluttered"],
      },
      lighting: {
        type: "Soft beauty lighting",
        characteristics: ["Soft diffused key light", "Natural eye catchlights", "No harsh shadows"],
      },
      camera: {
        genre: "K-pop photocard photography",
        aesthetic: ["Pastel bright tones", "Dreamy and fresh"],
        imperfections: ["Subtle analog film grain", "Slight natural lens softness at edges"],
      },
      mood: "Sweet, fresh, innocent and playful",
      panels: {
        top_left: { shot_type: "Medium shot", expression: "playful mischievous grin", gaze: "Looking to the side", pose: "Turning head slightly over the shoulder", notes: "" },
        top_center: { shot_type: "Close-up portrait", expression: "playful wink", gaze: "Direct eye contact", pose: "Peace sign near the cheek", notes: "" },
        top_right: { shot_type: "Half-body shot", expression: "dreamy gaze into the distance", gaze: "Looking off into the distance", pose: "Hand resting under chin", notes: "" },
        center_left: { shot_type: "Half-body shot", expression: "cute surprised expression", gaze: "Direct eye contact", pose: "Hands covering mouth softly", notes: "" },
        center: { shot_type: "Close-up portrait", expression: "sweet gentle smile", gaze: "Direct eye contact", pose: "Facing camera straight on", notes: "Focal panel of the collage" },
        center_right: { shot_type: "Medium shot", expression: "thoughtful pensive look", gaze: "Looking down softly", pose: "Tucking hair behind the ear", notes: "" },
        bottom_left: { shot_type: "Full body shot", expression: "sweet gentle smile", gaze: "Looking to the side", pose: "Sitting relaxed on a stool", notes: "" },
        bottom_center: { shot_type: "Medium shot", expression: "playful mischievous grin", gaze: "Looking back over the shoulder", pose: "Back to camera, looking back", notes: "" },
        bottom_right: { shot_type: "Close-up portrait", expression: "alluring captivating gaze", gaze: "Direct eye contact", pose: "Chin resting on hand", notes: "" },
      },
    },
  },
  {
    slug: "triptych-vogue",
    name: "Triptych High-Fashion Editorial",
    emoji: "🖤",
    descVi: "3 khung dọc phong cách Vogue, Haute Couture",
    state: {
      layoutId: "triptych",
      projectName: "Vertical High-Fashion Editorial Triptych",
      aspectRatio: "9:16",
      subject: {
        identity: "Elegant high-fashion model woman, late 20s",
        identityLock: true,
        facialRequirements: ["Same face in all 3 frames"],
        skin: "Flawless yet realistic skin texture, visible pores",
        makeup: "Sharp editorial makeup, defined brows, nude matte lips",
        hair: "Sleek low bun, polished",
      },
      wardrobe: {
        style: "Minimalist Haute Couture",
        outfit: "Black minimalist structured gown",
        accessories: "Glossy black long nails, statement silver ring",
      },
      environment: {
        location: "Dark luxury studio",
        background: ["Deep charcoal backdrop"],
      },
      lighting: {
        type: "Dramatic editorial lighting",
        characteristics: ["Single soft key light", "Deep controlled shadows", "Specular highlights on skin"],
      },
      camera: {
        genre: "Vogue magazine editorial",
        aesthetic: ["Monochrome-leaning palette", "Luxurious, sophisticated"],
        imperfections: ["Fine film grain"],
      },
      mood: "Calm, poised, luxurious",
      panels: {
        top_frame: { shot_type: "Half-body shot", expression: "calm, poised, luxurious expression", gaze: "Direct eye contact", pose: "Perfectly balanced symmetrical composition", notes: "" },
        middle_frame: { shot_type: "Extreme close-up on the eyes", expression: "alluring captivating gaze", gaze: "Direct eye contact", pose: "Hand lightly covering part of the face, showing glossy black nails", notes: "" },
        bottom_frame: { shot_type: "Three-quarter angle shot", expression: "thoughtful pensive look", gaze: "Looking to the side", pose: "Fingertips lightly touching the lips", notes: "Showcase minimalist black couture" },
      },
    },
  },
  {
    slug: "street-4photo",
    name: "4-Photo Smartphone Street Collage",
    emoji: "📱",
    descVi: "Lưới 2x2 tỉ lệ 1:1, streetwear denim",
    state: {
      layoutId: "grid2x2",
      projectName: "Smartphone Fashion Collage",
      aspectRatio: "1:1",
      subject: {
        identity: "Trendy young Vietnamese woman, early 20s",
        identityLock: true,
        facialRequirements: ["Same face in all 4 photos"],
        skin: "Natural skin texture, visible pores, no beauty filter",
        makeup: "Soft natural makeup",
        hair: "Long straight black hair with curtain bangs",
      },
      wardrobe: {
        style: "Streetwear",
        outfit: "Asymmetric denim camisole top with baggy wide-leg jeans",
        accessories: "White chunky sneakers, small shoulder bag",
      },
      environment: {
        location: "Urban street corner",
        background: ["Concrete wall", "Daylight city street"],
      },
      lighting: {
        type: "Natural daylight",
        characteristics: ["Soft overcast light", "Realistic phone camera exposure"],
      },
      camera: {
        genre: "Smartphone fashion photography",
        aesthetic: ["Casual candid", "Instagram feed style"],
        imperfections: ["Slight phone camera noise", "Natural imperfect framing"],
      },
      mood: "Cool, effortless, candid",
      panels: {
        top_left: { shot_type: "Full body shot", expression: "", gaze: "Direct eye contact", pose: "Standing confidently", notes: "" },
        top_right: { shot_type: "Full body shot", expression: "", gaze: "Looking to the side", pose: "Leaning casually against the wall", notes: "" },
        bottom_left: { shot_type: "Full body shot", expression: "sweet gentle smile", gaze: "Looking down softly", pose: "Sitting naturally on the ground", notes: "" },
        bottom_right: { shot_type: "Half-body shot", expression: "", gaze: "Direct eye contact", pose: "Upper-body close-up showcasing the denim camisole and jeans", notes: "" },
      },
    },
  },
];

export function blankCollageState(): CollageState {
  return structuredClone({
    ...COLLAGE_PRESETS[0].state,
    projectName: "",
    panels: Object.fromEntries(
      Object.keys(COLLAGE_PRESETS[0].state.panels).map((k) => [
        k,
        { shot_type: "", expression: "", gaze: "", pose: "", notes: "" },
      ]),
    ),
  });
}
