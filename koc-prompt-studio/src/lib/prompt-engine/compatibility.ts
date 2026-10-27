/**
 * Logic Compatibility Engine: Phân tích độ tương thích logic giữa 8 tầng prompt điện ảnh.
 * Giúp người dùng phối hợp thông số hài hòa, tránh mâu thuẫn quang học & bối cảnh.
 */
import type { LayerId, LayerState } from "./layers";
import type { Keyword } from "@/data/keywords";

export interface LogicContradiction {
  id: string;
  messageVi: string;
  suggestionVi: string;
  involvedLayers: LayerId[];
}

export interface LogicRecommendation {
  layer: LayerId;
  titleVi: string;
  reasonVi: string;
  recommendedKeywords: { vi: string; en: string }[];
}

export interface CompatibilityAnalysis {
  activeContexts: string[];
  contextLabels: string[];
  contradictions: LogicContradiction[];
  recommendations: LogicRecommendation[];
}

export function analyzeLogicCompatibility(layers: LayerState): CompatibilityAnalysis {
  const activeContexts = new Set<string>();
  const contradictions: LogicContradiction[] = [];
  const recommendations: LogicRecommendation[] = [];

  const textOf = (id: LayerId) =>
    `${layers[id]?.vi || ""} ${layers[id]?.en || ""}`.toLowerCase();

  const camText = textOf("camera");
  const setText = textOf("setting");
  const lightText = textOf("lighting");
  const subText = textOf("subject");
  const faceText = textOf("facial");
  const clothText = textOf("clothing");

  // 1. Nhận diện ngữ cảnh CỰ LY GÓC MÁY (Camera Framing)
  const isCloseup =
    camText.includes("cận") ||
    camText.includes("close-up") ||
    camText.includes("macro") ||
    camText.includes("85mm") ||
    camText.includes("135mm") ||
    camText.includes("chân dung");

  const isFullBody =
    camText.includes("toàn thân") ||
    camText.includes("full-body") ||
    camText.includes("full length") ||
    camText.includes("35mm");

  if (isCloseup) activeContexts.add("closeup");
  if (isFullBody) activeContexts.add("fullbody");

  // 2. Nhận diện ngữ cảnh THỜI GIAN & KHÔNG GIAN (Setting & Time)
  const isSunset =
    setText.includes("hoàng hôn") ||
    setText.includes("chiều tà") ||
    setText.includes("sunset") ||
    setText.includes("giờ vàng") ||
    setText.includes("golden hour") ||
    lightText.includes("hoàng hôn") ||
    lightText.includes("golden hour");

  const isNight =
    setText.includes("đêm") ||
    setText.includes("tối") ||
    setText.includes("night") ||
    setText.includes("neon") ||
    lightText.includes("neon") ||
    lightText.includes("đêm");

  const isSkincare =
    subText.includes("skincare") ||
    subText.includes("mỹ phẩm") ||
    setText.includes("phòng tắm") ||
    setText.includes("spa") ||
    clothText.includes("khăn choàng tắm") ||
    faceText.includes("dewy") ||
    faceText.includes("căng bóng");

  const isVintage =
    setText.includes("hội an") ||
    setText.includes("cổ") ||
    clothText.includes("áo dài") ||
    subText.includes("nàng thơ");

  const isStreet =
    setText.includes("phố") ||
    setText.includes("đường") ||
    subText.includes("gen z") ||
    subText.includes("street");

  if (isSunset) activeContexts.add("sunset");
  if (isNight) activeContexts.add("night");
  if (isSkincare) activeContexts.add("skincare");
  if (isVintage) activeContexts.add("vintage");
  if (isStreet) activeContexts.add("street");

  // 3. Kiểm tra MÂU THUẪN LOGIC (Contradictions)
  // Mâu thuẫn 1: Cận cảnh mặt nhưng mô tả chi tiết quần/giày
  if (
    isCloseup &&
    (clothText.includes("giày") ||
      clothText.includes("sneaker") ||
      clothText.includes("quần jean") ||
      clothText.includes("quần tây") ||
      clothText.includes("ống rộng"))
  ) {
    contradictions.push({
      id: "closeup-vs-shoes",
      messageVi:
        "Góc máy là 'Cận cảnh chân dung' nhưng trang phục lại có giày / quần ống rộng (sẽ không thấy trong khung hình).",
      suggestionVi:
        "Nên chuyển góc máy sang 'Toàn thân (Full-body)' hoặc tập trung mô tả cổ áo, khuyên tai, dây chuyền.",
      involvedLayers: ["camera", "clothing"],
    });
  }

  // Mâu thuẫn 2: Bối cảnh phố đêm nhưng ánh sáng là nắng ban mai/giờ vàng
  if (isNight && (lightText.includes("nắng sớm") || lightText.includes("ban mai"))) {
    contradictions.push({
      id: "night-vs-morning-light",
      messageVi:
        "Bối cảnh là đường phố về đêm nhưng ánh sáng lại chọn 'Nắng sớm ban mai'.",
      suggestionVi:
        "Nên đổi ánh sáng sang 'Đèn neon điện ảnh' hoặc 'Ánh đèn xe mờ nhòe (Bokeh)'.",
      involvedLayers: ["setting", "lighting"],
    });
  }

  // Mâu thuẫn 3: Hoàng hôn nhưng ánh sáng lại chọn neon ban đêm
  if (isSunset && lightText.includes("neon")) {
    contradictions.push({
      id: "sunset-vs-neon",
      messageVi:
        "Bối cảnh là hoàng hôn chiều tà nhưng ánh sáng chọn đèn neon rực rỡ (gây loãng màu trời).",
      suggestionVi:
        "Nên dùng 'Ánh sáng giờ vàng (Golden Hour)' hoặc 'Ánh sáng viền tóc (Rim Light)'.",
      involvedLayers: ["setting", "lighting"],
    });
  }

  // 4. GỢI Ý PHỐI HỢP LOGIC TỰ ĐỘNG (Recommendations)
  if (isCloseup && !lightText.includes("butterfly") && !lightText.includes("rim")) {
    recommendations.push({
      layer: "lighting",
      titleVi: "Phối hợp hoàn hảo với góc Cận cảnh",
      reasonVi: "Góc chụp chân dung cận mặt cần ánh sáng tôn khối mũi & gò má.",
      recommendedKeywords: [
        { vi: "Ánh sáng Butterfly tôn khuôn mặt", en: "soft butterfly lighting on the face" },
        { vi: "Ánh sáng viền tóc (Rim light)", en: "soft glowing rim light" },
      ],
    });
  }

  if (isSunset && !lightText.includes("golden hour") && !lightText.includes("giờ vàng")) {
    recommendations.push({
      layer: "lighting",
      titleVi: "Phối hợp với bối cảnh Hoàng hôn",
      reasonVi: "Khung cảnh chiều tà tương thích tuyệt đối với sắc vàng hổ phách rực rỡ.",
      recommendedKeywords: [
        { vi: "Giờ vàng (Golden Hour) rực rỡ", en: "golden hour sunlight, warm amber glow" },
        { vi: "Tông ấm nâu be hoài niệm", en: "warm earthy brown and beige color palette" },
      ],
    });
  }

  if (isSkincare && !faceText.includes("dewy") && !faceText.includes("căng bóng")) {
    recommendations.push({
      layer: "facial",
      titleVi: "Chuẩn phong cách KOC Skincare",
      reasonVi: "Ảnh mỹ phẩm cận mặt cần hiệu ứng da căng bóng mọng nước để tăng uy tín.",
      recommendedKeywords: [
        { vi: "Da căng bóng mọng nước (Dewy)", en: "dewy glass skin, luminous clean skin glow" },
        { vi: "Kết cấu da thật có lỗ chân lông", en: "natural human skin texture, visible skin pores" },
      ],
    });
  }

  if (isVintage && !clothText.includes("áo dài")) {
    recommendations.push({
      layer: "clothing",
      titleVi: "Gợi ý trang phục hoài niệm Hội An",
      reasonVi: "Phố cổ Hội An đẹp nhất khi phối cùng lụa truyền thống thướt tha.",
      recommendedKeywords: [
        { vi: "Áo dài lụa trắng truyền thống", en: "traditional Vietnamese white silk ao dai" },
        { vi: "Áo dài cách tân hoa nhí", en: "modern pastel floral ao dai" },
      ],
    });
  }

  // Nhãn ngữ cảnh hiển thị trên UI
  const contextLabels: string[] = [];
  if (isCloseup) contextLabels.push("🔍 Góc Cận Cảnh (Close-up)");
  if (isFullBody) contextLabels.push("🧍 Toàn Thân (Full-body)");
  if (isSunset) contextLabels.push("🌅 Hoàng Hôn (Golden Hour)");
  if (isNight) contextLabels.push("🌃 Phố Đêm (Night)");
  if (isSkincare) contextLabels.push("🧴 KOC Skincare & Beauty");
  if (isVintage) contextLabels.push("🏮 Hoài Niệm Phố Cổ");
  if (isStreet) contextLabels.push("🛹 Năng Động Đường Phố");

  return {
    activeContexts: Array.from(activeContexts),
    contextLabels,
    contradictions,
    recommendations,
  };
}

/** Kiểm tra xem 1 từ khóa có tương thích với ngữ cảnh đang kích hoạt hay không */
export function isKeywordLogicMatched(keyword: Keyword, activeContexts: string[]): boolean {
  if (!keyword.tags || keyword.tags.length === 0) return false;
  return keyword.tags.some((t) => activeContexts.includes(t));
}
