/**
 * Smart Idea Decomposer: Phân tích câu ý tưởng tự do tiếng Việt thành 8 tầng prompt.
 * Hoạt động offline 100% bằng keyword matching + heuristics, và làm fallback hoàn hảo cho AI.
 */
import { LAYERS, type LayerId, type LayerState, emptyLayerState } from "./layers";
import { KEYWORDS, offlineTranslate } from "@/data/keywords";

export interface DecomposeResult {
  layers: LayerState;
  detectedCount: number;
  unmatched: string[];
}

export function offlineDecomposeIdea(userPrompt: string): DecomposeResult {
  const state = emptyLayerState();
  if (!userPrompt || !userPrompt.trim()) {
    return { layers: state, detectedCount: 0, unmatched: [] };
  }

  const raw = userPrompt.trim();
  let detected = 0;

  // 1. Phân loại theo regex / từ khóa thông minh
  const patterns: Record<LayerId, RegExp[]> = {
    quality: [
      /(?:siêu chân thực|chân thực|photorealistic|ultra realistic|8k|kiệt tác|masterpiece|điện ảnh|cinematic|raw photo|ảnh raw|nhiếp ảnh chuyên nghiệp)/gi,
    ],
    subject: [
      /(?:(?:cô gái|chàng trai|bạn nữ|bạn nam|thiếu nữ|nữ sinh|người mẫu|koc|creator|content creator|nữ doanh nhân|doanh nhân)\s*(?:việt nam|việt|hàn quốc|hàn)?\s*(?:\d{2}\s*tuổi)?)/gi,
      /(?:gen z|thanh lịch|dân công sở|tiểu thư|năng động|quyến rũ|dễ thương|xinh đẹp)/gi,
    ],
    facial: [
      /(?:mắt to\s*(?:tròn)?|sống mũi\s*(?:cao)?|môi\s*(?:căng mọng|đỏ|hồng)?|lúm đồng tiền|mặt trái xoan|vòng eo\s*(?:thon)?|da căng bóng|má hồng|tóc\s*(?:dài|ngắn|uốn|xoăn|thẳng|đen|nâu|sóng)?)/gi,
    ],
    clothing: [
      /(?:áo dài(?:\s*truyền thống|\s*cách tân)?|đầm\s*(?:bodycon|dạ hội|suông|lụa)?|váy\s*(?:ngắn|dài|xòe)?|áo\s*(?:sơ mi|thun|croptop|cổ yếm|len|blazer|khoác|camisole)?|quần\s*(?:jean|ống rộng|tây|short)?|đồ thể thao|bikini|khăn choàng|hoa tai|vòng cổ|trang sức)/gi,
    ],
    pose: [
      /(?:nhìn thẳng(?:\s*ống kính)?|mỉm cười(?:\s*dịu dàng)?|cười tươi|nghiêng đầu|đứng(?:\s*tựa tường|\s*tự tin)?|ngồi(?:\s*thư giãn|\s*quán)?|tay vén tóc|ngoái lại|tạo dáng|pose)/gi,
    ],
    setting: [
      /(?:phố cổ hội an|hội an|quán c[àa] ph[eê]|quán cafe|cafe|ban công|bãi biển|biển|phòng ngủ|phòng khách|studio|phòng gym|văn phòng|đường phố|cầu rồng|hồ gươm|đà lạt|sân thượng)/gi,
    ],
    lighting: [
      /(?:hoàng hôn|sunset|bình minh|sunrise|giờ vàng|golden hour|ánh sáng\s*(?:tự nhiên|mềm|cửa sổ|studio|softbox|neon|ngược sáng|viền)|nắng sớm|chiều tà)/gi,
    ],
    camera: [
      /(?:sony\s*a7\w*|canon\s*eos\s*\w*|nikon|leica|fuji\w*|ống\s*\d{2,3}mm|\d{2,3}mm|f\/?1\.[248]|cận cảnh|góc cận|cận mặt|toàn thân|bán thân|chân dung|xóa phông|bokeh|góc\s*(?:thấp|cao|ngang))/gi,
    ],
    realism: [
      /(?:khử nhựa|da thật|lỗ chân lông|catchlight|catchlights|khối mặt 3d|không nhựa|không bóng sáp|búp bê sáp|natural skin pores|skin texture)/gi,
    ],
  };

  // Trích xuất qua regex toàn cục trước
  const layerMatched: Record<LayerId, string[]> = {
    quality: [],
    subject: [],
    facial: [],
    clothing: [],
    pose: [],
    setting: [],
    lighting: [],
    camera: [],
    realism: [],
  };

  // Tách câu thành các cụm nhỏ hơn bằng dấu phẩy, chấm, và các giới từ thông dụng
  const rawSegments = raw
    .split(/[,;\n\.\+]+|\s+(?:ở|tại|lúc|vào lúc|bằng|chụp|mặc)\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const seg of rawSegments) {
    let matched = false;
    for (const layer of LAYERS) {
      const regList = patterns[layer.id];
      for (const reg of regList) {
        reg.lastIndex = 0;
        const m = reg.exec(seg);
        if (m) {
          layerMatched[layer.id].push(seg);
          matched = true;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      // Dò từ điển keyword
      for (const layer of LAYERS) {
        const off = offlineTranslate(layer.id, seg);
        if (off.en) {
          layerMatched[layer.id].push(seg);
          matched = true;
          break;
        }
      }
    }
  }

  // Điền vào state và sinh mã EN tương ứng
  for (const layer of LAYERS) {
    const matchedParts = Array.from(new Set(layerMatched[layer.id]));
    if (matchedParts.length > 0) {
      const viStr = matchedParts.join(", ");
      const off = offlineTranslate(layer.id, viStr);
      state[layer.id] = {
        vi: viStr,
        en: off.en || viStr,
        enabled: true,
      };
      detected++;
    } else if (layer.defaultEn) {
      state[layer.id] = {
        vi: layer.id === "quality" ? "Siêu chân thực, điện ảnh 8K" : "Chụp bán thân máy Sony 85mm",
        en: layer.defaultEn,
        enabled: true,
      };
    }
  }

  return {
    layers: state,
    detectedCount: detected,
    unmatched: [],
  };
}
