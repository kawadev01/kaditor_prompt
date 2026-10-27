/**
 * Từ điển từ khóa nhiếp ảnh điện ảnh VI ↔ EN chuyên sâu cho từng tầng.
 * Phân loại theo nhóm danh mục chính xác, hỗ trợ gợi ý tương thích logic và dịch offline.
 */
import type { LayerId } from "@/lib/prompt-engine/layers";

export interface Keyword {
  vi: string;
  en: string;
  group: string;
  /** Bối cảnh tương thích logic: 'closeup', 'fullbody', 'sunset', 'night', 'studio', 'vintage', 'skincare', 'street' */
  tags?: string[];
}

export const KEYWORDS: Record<LayerId, Keyword[]> = {
  // -------------------------------------------------------------
  // TẦNG 1: CHẤT LƯỢNG & PHONG CÁCH
  // -------------------------------------------------------------
  quality: [
    // Độ phân giải & Chi tiết
    { vi: "8K UHD siêu sắc nét", en: "8k resolution, highly detailed, sharp focus", group: "Độ phân giải" },
    { vi: "Kiệt tác nhiếp ảnh", en: "masterpiece, best quality, award-winning photography", group: "Độ phân giải" },
    { vi: "Ảnh chụp RAW chân thực", en: "raw photo, authentic unedited look, natural details", group: "Độ phân giải" },
    { vi: "Chi tiết siêu thực", en: "photorealistic, hyper-realistic, extremely detailed textures", group: "Độ phân giải" },
    { vi: "Chất lượng 16K tối thượng", en: "16k ultra-high definition, pristine clarity", group: "Độ phân giải" },

    // Phong cách nghệ thuật
    { vi: "Điện ảnh Hollywood", en: "cinematic film aesthetic, 35mm movie scene", group: "Phong cách", tags: ["cinematic"] },
    { vi: "Tạp chí thời trang Vogue", en: "high-fashion editorial photography, Vogue magazine cover style", group: "Phong cách", tags: ["editorial"] },
    { vi: "Phim analog hạt mịn", en: "analog film photography, subtle nostalgic film grain, Kodak Portra 400", group: "Phong cách", tags: ["vintage"] },
    { vi: "Phong cách Hasselblad Medium Format", en: "shot on Hasselblad medium format camera, stunning dynamic range", group: "Phong cách", tags: ["studio"] },
    { vi: "Phong cách hoài niệm cổ điển", en: "retro vintage aesthetic, muted earthy tones, 90s aesthetic", group: "Phong cách", tags: ["vintage"] },
    { vi: "Nhiếp ảnh đường phố nghệ thuật", en: "candid street photography, authentic urban life vibe", group: "Phong cách", tags: ["street"] },

    // Hiệu ứng quang học
    { vi: "Xóa phông Bokeh tròn mịn", en: "creamy circular bokeh, beautiful background separation", group: "Hiệu ứng quang học", tags: ["closeup"] },
    { vi: "Hiệu ứng lóe sáng Anamorphic", en: "cinematic anamorphic blue lens flare, horizontal streak", group: "Hiệu ứng quang học", tags: ["cinematic"] },
    { vi: "Độ tương phản điện ảnh sâu", en: "rich cinematic contrast, deep expressive shadows", group: "Hiệu ứng quang học", tags: ["cinematic"] },
  ],

  // -------------------------------------------------------------
  // TẦNG 2: CHỦ THỂ / NHÂN VẬT
  // -------------------------------------------------------------
  subject: [
    // Độ tuổi & Quốc tịch
    { vi: "Cô gái Việt 22 tuổi cực xinh", en: "stunning 22-year-old Vietnamese woman, extremely beautiful", group: "Độ tuổi & Quốc tịch" },
    { vi: "Thiếu nữ Việt Nam 20 tuổi", en: "graceful 20-year-old Vietnamese young woman, delicate features", group: "Độ tuổi & Quốc tịch" },
    { vi: "Nữ doanh nhân Việt 26 tuổi", en: "elegant 26-year-old Vietnamese businesswoman, confident professional aura", group: "Độ tuổi & Quốc tịch" },
    { vi: "Chàng trai Việt 24 tuổi lãng tử", en: "handsome 24-year-old Vietnamese man, charismatic modern gentleman", group: "Độ tuổi & Quốc tịch" },
    { vi: "Người mẫu Hàn Quốc thanh thoát", en: "gorgeous young Korean fashion model, refined porcelain features", group: "Độ tuổi & Quốc tịch" },

    // Khí chất & Thần thái
    { vi: "Thần thái KOC cuốn hút", en: "charismatic KOC influencer aura, magnetic screen presence", group: "Thần thái", tags: ["skincare", "street"] },
    { vi: "Ngây thơ trong trẻo", en: "pure innocent aura, fresh dewy youthfulness, gentle charm", group: "Thần thái", tags: ["skincare"] },
    { vi: "Sang chảnh tiểu thư", en: "luxurious rich girl aesthetic, poised elegance, aristocratic grace", group: "Thần thái", tags: ["editorial"] },
    { vi: "Năng động thể thao Gen Z", en: "energetic Gen Z content creator, trendy healthy athletic vibe", group: "Thần thái", tags: ["street"] },
    { vi: "Trầm tư dịu dàng", en: "thoughtful gentle demeanor, poetic subtle gaze", group: "Thần thái", tags: ["vintage"] },
    { vi: "Rạng rỡ tỏa nắng", en: "radiant joyful smile, cheerful warm personality", group: "Thần thái" },

    // Vai trò & Phong cách
    { vi: "KOC Skincare & Mỹ phẩm", en: "beauty skincare creator testing cosmetic products", group: "Vai trò", tags: ["skincare", "closeup"] },
    { vi: "Fashionista dạo phố", en: "stylish fashionista walking in the city", group: "Vai trò", tags: ["street", "fullbody"] },
    { vi: "Nàng thơ áo dài", en: "traditional Vietnamese muse in graceful poise", group: "Vai trò", tags: ["vintage"] },
  ],

  // -------------------------------------------------------------
  // TẦNG 3: KHUÔN MẶT & HÌNH THỂ
  // -------------------------------------------------------------
  facial: [
    // Cấu trúc khuôn mặt
    { vi: "Khuôn mặt trái xoan thanh tú", en: "delicate oval face shape, soft feminine facial contours", group: "Khuôn mặt" },
    { vi: "Sống mũi cao thẳng dọc dừa", en: "high straight defined nose bridge, delicate nose tip", group: "Khuôn mặt" },
    { vi: "Xương quai hàm V-line sắc sảo", en: "softly defined elegant jawline, slim chin", group: "Khuôn mặt" },
    { vi: "Gò má ửng hồng tự nhiên", en: "subtle rosy cheekbones, natural warm flush", group: "Khuôn mặt" },

    // Mắt & Miệng
    { vi: "Mắt to tròn long lanh", en: "large expressive round eyes, bright clear sclera, detailed hazel iris", group: "Mắt & Miệng", tags: ["closeup"] },
    { vi: "Phản quang mắt (Catchlights)", en: "natural eye catchlights, lively bright gaze, moist reflective cornea", group: "Mắt & Miệng", tags: ["closeup"] },
    { vi: "Hàng mi cong dài tự nhiên", en: "long delicate curved eyelashes, natural feathery brows", group: "Mắt & Miệng", tags: ["closeup"] },
    { vi: "Môi căng mọng hồng hào", en: "full plump glossy lips, soft natural pink hue", group: "Mắt & Miệng", tags: ["closeup"] },
    { vi: "Lúm đồng tiền sâu duyên dáng", en: "deep natural dimples visible when smiling gently", group: "Mắt & Miệng" },

    // Làn da (Realism Tokens)
    { vi: "Da căng bóng mọng nước (Dewy)", en: "dewy glass skin, luminous clean skin glow, hydrated finish", group: "Làn da", tags: ["skincare", "closeup"] },
    { vi: "Kết cấu da thật có lỗ chân lông", en: "natural human skin texture, visible microscopic skin pores, strictly no plastic skin", group: "Làn da", tags: ["closeup"] },
    { vi: "Trang điểm trong trẻo (Clean Girl)", en: "clean girl makeup, minimalist natural look, no heavy foundation", group: "Làn da", tags: ["skincare"] },

    // Kiểu tóc & Hình thể
    { vi: "Tóc dài uốn sóng bồng bềnh", en: "long voluminous softly wavy hair, glossy strands catching light", group: "Tóc & Dáng" },
    { vi: "Tóc ngắn layer hiện đại", en: "trendy modern layered bob haircut, playful wispy bangs", group: "Tóc & Dáng" },
    { vi: "Tóc búi cao thanh thoát", en: "elegant high ponytail, stray flyaway hair strands framing the face", group: "Tóc & Dáng" },
    { vi: "Vòng eo thon con kiến", en: "slender defined waistline, well-proportioned graceful silhouette", group: "Tóc & Dáng", tags: ["fullbody"] },
    { vi: "Xương quai xanh gợi cảm", en: "delicate defined collarbones, graceful swan-like neck", group: "Tóc & Dáng" },
  ],

  // -------------------------------------------------------------
  // TẦNG 4: TRANG PHỤC & PHỤ KIỆN
  // -------------------------------------------------------------
  clothing: [
    // Trang phục truyền thống & Duyên dáng
    { vi: "Áo dài lụa trắng truyền thống", en: "traditional Vietnamese white silk ao dai, high collar, flowing hem", group: "Truyền thống", tags: ["vintage"] },
    { vi: "Áo dài cách tân hoa nhí", en: "modern pastel floral ao dai, lightweight chiffon fabric", group: "Truyền thống", tags: ["vintage"] },
    { vi: "Áo yếm lụa tơ tằm cổ điển", en: "traditional Vietnamese silk halter neck yem, exposed graceful shoulders", group: "Truyền thống" },
    { vi: "Đầm dạ hội xẻ tà sang trọng", en: "luxurious evening gown, high side slit, elegant drape", group: "Dạ hội", tags: ["editorial"] },

    // Thời trang dạo phố & Gen Z
    { vi: "Áo croptop ôm & Quần ống rộng", en: "denim fitted crop top, high-waisted baggy wide-leg jeans", group: "Đường phố", tags: ["street", "fullbody"] },
    { vi: "Áo khoác da Biker phóng khoáng", en: "black leather biker jacket, casual edgy street aesthetic", group: "Đường phố", tags: ["street"] },
    { vi: "Áo thun oversized giấu quần", en: "oversized graphic cotton t-shirt, casual youthful aesthetic", group: "Đường phố", tags: ["street"] },
    { vi: "Sneaker chunky trắng tinh tế", en: "chunky white sneakers, stylish streetwear footwear", group: "Đường phố", tags: ["fullbody", "street"] },

    // Thanh lịch & Công sở
    { vi: "Blazer màu be & Sơ mi lụa", en: "tailored beige blazer, crisp white silk blouse, minimalist tailoring", group: "Công sở" },
    { vi: "Đầm bodycon lụa tối giản", en: "minimalist bodycon slip dress, clean silhouettes, premium fabric", group: "Công sở" },
    { vi: "Áo len dệt kim cổ lọ", en: "soft ribbed turtleneck knit sweater, cozy minimalist aesthetic", group: "Công sở" },

    // Homewear & Skincare
    { vi: "Khăn choàng tắm cotton trắng", en: "fluffy white cotton bathrobe, hair wrapped in a matching towel", group: "Skincare / Ở nhà", tags: ["skincare"] },
    { vi: "Áo choàng lụa satin mặc nhà", en: "luxurious champagne satin silk loungewear robe", group: "Skincare / Ở nhà", tags: ["skincare"] },

    // Phụ kiện & Trang sức
    { vi: "Dây chuyền bạc thanh mảnh", en: "delicate sterling silver pendant chain, understated elegance", group: "Phụ kiện" },
    { vi: "Hoa tai ngọc trai giọt nước", en: "dainty pearl drop earrings, subtle luxury touch", group: "Phụ kiện", tags: ["closeup"] },
    { vi: "Kính mắt gọng kim loại thanh lịch", en: "minimalist thin wireframe metallic spectacles", group: "Phụ kiện" },
  ],

  // -------------------------------------------------------------
  // TẦNG 5: TƯ THẾ & CẢM XÚC
  // -------------------------------------------------------------
  pose: [
    // Dáng đứng
    { vi: "Đứng tự tin nhìn thẳng ống kính", en: "confident standing pose, looking directly at the camera with poise", group: "Dáng đứng" },
    { vi: "Đứng tựa tường một chân co nhẹ", en: "casually leaning against a wall, one leg slightly bent, relaxed stance", group: "Dáng đứng", tags: ["street", "fullbody"] },
    { vi: "Nghiêng người 3/4 khoe đường cong", en: "three-quarter angle standing pose, elegant profile, subtle posture curve", group: "Dáng đứng", tags: ["fullbody"] },
    { vi: "Đang sải bước tự nhiên trên phố", en: "walking forward naturally, motion freeze, effortless candid movement", group: "Dáng đứng", tags: ["street", "fullbody"] },
    { vi: "Ngoái đầu nhìn lại qua vai", en: "looking back over the shoulder with a captivating glance", group: "Dáng đứng" },

    // Dáng ngồi
    { vi: "Ngồi thư giãn trên ghế quán cafe", en: "sitting relaxed at a cafe table, hands resting naturally", group: "Dáng ngồi" },
    { vi: "Ngồi tựa cằm vào bàn tay", en: "resting chin on delicate hand, elbow on table, dreamy contemplative pose", group: "Dáng ngồi", tags: ["closeup"] },
    { vi: "Ngồi khoanh chân trên thảm gỗ", en: "sitting cross-legged gracefully on wooden floor, casual lifestyle vibe", group: "Dáng ngồi" },

    // Điểm nhấn bàn tay & Hành động
    { vi: "Tay vén lọn tóc sau vành tai", en: "hand gently tucking a strand of hair behind ear, feminine subtle gesture", group: "Hành động", tags: ["closeup"] },
    { vi: "Tay cầm chai serum cạnh má", en: "holding a cosmetic glass dropper bottle next to her glowing cheek", group: "Hành động", tags: ["skincare", "closeup"] },
    { vi: "Tay cầm tách cà phê ấm áp", en: "both hands gently holding a ceramic coffee cup, fingers naturally positioned", group: "Hành động" },
    { vi: "Ngón tay chạm nhẹ lên môi", en: "index finger lightly touching lower lip, playful inquisitive gesture", group: "Hành động", tags: ["closeup"] },

    // Cảm xúc & Biểu cảm
    { vi: "Nụ cười mỉm dịu dàng e ấp", en: "soft gentle demure smile, warm heartfelt gaze", group: "Cảm xúc" },
    { vi: "Cười tươi rạng rỡ khoe răng", en: "bright joyful laugh, cheerful infectious smile showing teeth", group: "Cảm xúc" },
    { vi: "Thần thái lạnh lùng High-Fashion", en: "fierce high-fashion aloof gaze, parted lips, cool editorial intensity", group: "Cảm xúc", tags: ["editorial"] },
    { vi: "Ánh mắt mơ màng nhìn xa xăm", en: "pensive dreamy eyes looking into the distance, lost in thought", group: "Cảm xúc" },
  ],

  // -------------------------------------------------------------
  // TẦNG 6: BỐI CẢNH & KHÔNG GIAN
  // -------------------------------------------------------------
  setting: [
    // Địa điểm ngoài trời & Du lịch
    { vi: "Phố cổ Hội An đèn lồng hoàng hôn", en: "Hoi An ancient town street, yellow historic walls, glowing lanterns at dusk", group: "Ngoài trời", tags: ["vintage", "sunset"] },
    { vi: "Cầu Rồng Đà Nẵng lúc chiều tà", en: "Dragon Bridge Da Nang waterfront, twilight city skyline reflected on river", group: "Ngoài trời", tags: ["sunset"] },
    { vi: "Hồ Gươm Hà Nội sáng mùa thu", en: "Hanoi Sword Lake morning autumn breeze, weeping willow trees reflection", group: "Ngoài trời", tags: ["vintage"] },
    { vi: "Phố đêm ánh đèn xe bokeh", en: "bustling urban street at night, neon lights, out-of-focus city traffic bokeh", group: "Ngoài trời", tags: ["night", "street"] },
    { vi: "Bãi biển nhiệt đới cát trắng", en: "tropical white sand beach, azure ocean waves, soft coastal breeze", group: "Ngoài trời", tags: ["sunset"] },
    { vi: "Con dốc hoa Đà Lạt mờ sương", en: "romantic misty Da Lat hillside street, pine trees and wild flowers", group: "Ngoài trời", tags: ["vintage"] },

    // Quán cafe & Không gian chill
    { vi: "Quán cà phê Hàn Quốc tối giản", en: "minimalist Seoul-style aesthetic cafe, bright cream walls, warm oak furniture", group: "Cafe & Thư giãn" },
    { vi: "Quán cafe Vintage tông gỗ ấm", en: "cozy vintage cafe interior, retro bookshelf, ambient incandescent lamps", group: "Cafe & Thư giãn", tags: ["vintage"] },
    { vi: "Ban công gỗ tầng thượng ngắm phố", en: "wooden rooftop terrace balcony overlooking panoramic city skyline", group: "Cafe & Thư giãn", tags: ["sunset"] },

    // Studio & Trong nhà
    { vi: "Studio phông xám tối giản", en: "clean photography studio, seamless neutral gray cyclorama backdrop", group: "Studio", tags: ["studio"] },
    { vi: "Phòng tắm Spa tối giản sáng sủa", en: "bright modern luxury bathroom, white marble vanity, clean mirror reflection", group: "Studio", tags: ["skincare"] },
    { vi: "Phòng ngủ ánh sáng tự nhiên", en: "sunlit cozy bedroom, sheer white curtains swaying, soft linen bed", group: "Trong nhà", tags: ["skincare"] },
    { vi: "Văn phòng hiện đại tường kính", en: "high-rise modern corporate office, floor-to-ceiling glass windows", group: "Trong nhà" },
  ],

  // -------------------------------------------------------------
  // TẦNG 7: ÁNH SÁNG, MÀU SẮC & MOOD
  // -------------------------------------------------------------
  lighting: [
    // Ánh sáng tự nhiên
    { vi: "Giờ vàng (Golden Hour) rực rỡ", en: "golden hour sunlight, warm amber glow, soft long shadows, honey radiance", group: "Tự nhiên", tags: ["sunset"] },
    { vi: "Nắng ban mai dịu qua cửa sổ", en: "soft early morning sunlight streaming through sheer window curtains", group: "Tự nhiên", tags: ["skincare"] },
    { vi: "Ánh sáng khuếch tán trời râm", en: "soft overcast diffused daylight, ultra-gentle wrap-around ambient light", group: "Tự nhiên" },
    { vi: "Hoàng hôn tím hồng chiều tà", en: "dreamy pastel sunset twilight, soft pink and lavender gradient sky", group: "Tự nhiên", tags: ["sunset"] },

    // Kỹ thuật chiếu sáng Studio & Điện ảnh
    { vi: "Ánh sáng Butterfly tôn khuôn mặt", en: "soft butterfly lighting on the face, delicate shadow under nose and chin", group: "Kỹ thuật chiếu sáng", tags: ["closeup", "skincare"] },
    { vi: "Ánh sáng viền tóc (Rim Light)", en: "subtle glowing rim light separating subject hair and shoulders from background", group: "Kỹ thuật chiếu sáng", tags: ["cinematic", "night"] },
    { vi: "Ánh sáng Rembrandt cổ điển", en: "Rembrandt studio lighting, triangle highlight on cheek, dramatic painterly mood", group: "Kỹ thuật chiếu sáng", tags: ["cinematic", "editorial"] },
    { vi: "Hộp tản sáng Softbox studio", en: "large studio softbox illumination, perfectly even, strictly no harsh shadows", group: "Kỹ thuật chiếu sáng", tags: ["studio"] },

    // Màu sắc & Mood
    { vi: "Tông màu Teal & Orange điện ảnh", en: "cinematic teal and orange color grading, rich movie palette", group: "Màu sắc & Mood", tags: ["cinematic", "night"] },
    { vi: "Tông màu Pastel Hàn Quốc trong trẻo", en: "airy soft pastel color tones, high-key bright clean atmosphere", group: "Màu sắc & Mood", tags: ["skincare"] },
    { vi: "Ánh đèn Neon Cyberpunk về đêm", en: "vibrant neon cyan and magenta city lighting, moody urban night vibe", group: "Màu sắc & Mood", tags: ["night", "street"] },
    { vi: "Tông ấm nâu be hoài niệm", en: "warm earthy brown and beige color palette, timeless nostalgic atmosphere", group: "Màu sắc & Mood", tags: ["vintage"] },
  ],

  // -------------------------------------------------------------
  // TẦNG 8: MÁY ẢNH & KỸ THUẬT NHIẾP ẢNH
  // -------------------------------------------------------------
  camera: [
    // Góc máy & Cự ly chụp
    { vi: "Cận cảnh trung bình", en: "medium shot portrait", group: "Góc máy & Cự ly" },
    { vi: "Cận cảnh chân dung (Close-up)", en: "close-up beauty portrait, intimate framing from shoulders to top of head", group: "Góc máy & Cự ly", tags: ["closeup"] },
    { vi: "Cực cận mặt (Extreme Macro)", en: "extreme macro close-up, sharp focus on lips and eyelashes", group: "Góc máy & Cự ly", tags: ["closeup"] },
    { vi: "Bán thân từ eo trở lên (Medium Shot)", en: "medium shot portrait from waist up, natural balanced composition", group: "Góc máy & Cự ly" },
    { vi: "Toàn thân (Full-body Shot)", en: "full-length body shot from head to toe, complete outfit in frame", group: "Góc máy & Cự ly", tags: ["fullbody"] },
    { vi: "Góc chụp ngang tầm mắt (Eye-level)", en: "eye-level shot, direct emotional connection, neutral camera perspective", group: "Góc máy & Cự ly" },
    { vi: "Góc máy thấp tôn dáng (Low-angle)", en: "low-angle shot, heroic elongated proportions, confident perspective", group: "Góc máy & Cự ly", tags: ["fullbody", "street"] },

    // Tiêu cự ống kính
    { vi: "Ống 85mm f/1.4", en: "85mm lens, f/1.4", group: "Ống kính", tags: ["closeup"] },
    { vi: "Ống 85mm", en: "85mm lens", group: "Ống kính", tags: ["closeup"] },
    { vi: "Ống kính chân dung 85mm", en: "shot on 85mm prime lens, ideal portrait compression, zero facial distortion", group: "Ống kính", tags: ["closeup"] },
    { vi: "Ống 50mm", en: "50mm lens", group: "Ống kính" },
    { vi: "Ống kính tiêu chuẩn 50mm", en: "shot on 50mm f/1.2 lens, true-to-life human eye perspective", group: "Ống kính" },
    { vi: "Ống 35mm", en: "35mm lens", group: "Ống kính", tags: ["street", "fullbody"] },
    { vi: "Ống kính góc rộng 35mm đường phố", en: "shot on 35mm lens, dynamic environmental storytelling portrait", group: "Ống kính", tags: ["street", "fullbody"] },
    { vi: "Ống kính tele 135mm xóa phông sâu", en: "shot on 135mm lens, intense compression, isolated subject", group: "Ống kính", tags: ["closeup"] },

    // Khẩu độ & Độ nét
    { vi: "Khẩu độ f/1.4 xóa phông mờ mịt", en: "wide open at f/1.4, shallow depth of field, creamy melted background", group: "Khẩu độ & Nét", tags: ["closeup"] },
    { vi: "Khẩu độ f/1.8 sắc nét từng lọn tóc", en: "f/1.8 aperture, tack sharp eye focus, delicate falloff", group: "Khẩu độ & Nét" },
    { vi: "Khẩu độ f/2.8 cân bằng toàn cảnh", en: "f/2.8 aperture, crisp subject detail, readable environment context", group: "Khẩu độ & Nét", tags: ["street"] },
    { vi: "Lấy nét căng tròng mắt (Tack sharp)", en: "pin-sharp focus on iris and eyelashes, crystal-clear definition", group: "Khẩu độ & Nét", tags: ["closeup"] },

    // Thân máy ảnh cao cấp
    { vi: "Thân máy Sony A7R IV chi tiết 61MP", en: "shot on Sony A7R IV, exceptional dynamic range and micro-textures", group: "Thân máy" },
    { vi: "Thân máy Canon EOS R5 da nịnh mắt", en: "shot on Canon EOS R5, beautiful flattering skin tone science", group: "Thân máy", tags: ["skincare"] },
    { vi: "Thân máy Leica M11 màu phim huyền thoại", en: "shot on Leica M11, legendary Leica optics and micro-contrast", group: "Thân máy", tags: ["vintage"] },
  ],

  // -------------------------------------------------------------
  // TẦNG 9: KHỬ NHỰA AI & SIÊU THỰC (REALISM FIXER)
  // -------------------------------------------------------------
  realism: [
    // Lỗ chân lông & Da thật
    { vi: "Lỗ chân lông siêu thực, da thật", en: "ultra-realistic human face, natural skin texture, visible skin pores, raw photo, absent of plastic AI look", group: "Da thật & Pores", tags: ["skincare"] },
    { vi: "Kết cấu da tự nhiên không sáp", en: "natural human skin texture, microscopic pores, authentic skin imperfections, non-airbrushed", group: "Da thật & Pores", tags: ["skincare"] },
    { vi: "Độ bóng da tự nhiên Subsurface", en: "natural skin subsurface scattering, healthy skin glow, realistic epidermal texture", group: "Da thật & Pores", tags: ["skincare"] },
    { vi: "Làn da mịn màng tự nhiên không chỉnh sửa", en: "naturally smooth skin, unretouched, subtle facial peach fuzz", group: "Da thật & Pores" },

    // Khối mặt 3D
    { vi: "Ánh sáng cánh bướm tôn sống mũi", en: "soft butterfly lighting on the face, gentle highlights on the tip of the nose and cheekbones", group: "Khối mặt 3D", tags: ["editorial"] },
    { vi: "Khối sống mũi & gò má tự nhiên", en: "natural three-dimensional facial contouring, soft sculpted cheekbones, subtle bridge highlight", group: "Khối mặt 3D", tags: ["editorial"] },
    { vi: "Đổ bóng khối mềm mại", en: "gentle soft gradient facial shadows, depth separation, realistic dimensional volume", group: "Khối mặt 3D", tags: ["cinematic"] },

    // Ánh mắt & Catchlights
    { vi: "Catchlights mắt to tròn có hồn", en: "large expressive eyes, clear bright sclera, highly detailed iris, natural eye catchlights, not over-sharpened", group: "Ánh mắt & Hồn", tags: ["skincare"] },
    { vi: "Tròng mắt sâu phản quang tự nhiên", en: "expressive deep pupils, realistic cornea reflections, moist and glistening eyes", group: "Ánh mắt & Hồn" },
    { vi: "Độ long lanh chân thực", en: "subtle specular eye highlights, vivid iris patterns, captivating gaze", group: "Ánh mắt & Hồn", tags: ["cinematic"] },

    // Má hồng & Cảm xúc
    { vi: "Má ửng hồng & Lúm đồng tiền", en: "subtle rosy cheeks, natural warm blush, natural skin translucency, deep natural dimples when smiling", group: "Má hồng & Cảm xúc" },
    { vi: "Sắc hồng cam đào tự nhiên", en: "delicate peach blossom flush on cheeks, warm natural undertone, fresh healthy complexion", group: "Má hồng & Cảm xúc", tags: ["skincare"] },
    { vi: "Lúm đồng tiền duyên dáng", en: "charming distinct dimples when smiling, authentic facial muscle movement", group: "Má hồng & Cảm xúc" },

    // Ánh sáng tán xạ
    { vi: "Ánh sáng khuếch tán không bóng gắt", en: "soft diffused lighting, flat ambient light, strictly no harsh shadows", group: "Ánh sáng tán xạ" },
    { vi: "Bao bọc ánh sáng mềm mại", en: "gentle wrap-around ambient light, smooth tonal roll-off, zero harsh 3d render artifacts", group: "Ánh sáng tán xạ", tags: ["cinematic"] },

    // Tone phim & Máy ảnh
    { vi: "Ảnh RAW Hasselblad không qua xử lý", en: "unprocessed raw camera capture, Hasselblad color science, authentic dynamic range", group: "Tone Phim & Cảm biến", tags: ["studio"] },
    { vi: "Hạt phim 35mm mịn chống nhựa", en: "subtle organic 35mm film grain, analog noise, absent of digital CGI smoothness", group: "Tone Phim & Cảm biến", tags: ["vintage"] },
  ],
};

/**
 * Dịch offline dựa trên từ điển: tìm các cụm tiếng Việt khớp (không dấu, không phân biệt hoa thường).
 * Trả về token EN tìm được + phần còn lại chưa dịch.
 */
export function offlineTranslate(layer: LayerId, vi: string): { en: string; unmatched: string } {
  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  let rest = norm(vi);
  const found: string[] = [];
  const dict = [...(KEYWORDS[layer] || [])].sort((a, b) => b.vi.length - a.vi.length);
  for (const k of dict) {
    const key = norm(k.vi);
    if (rest.includes(key)) {
      found.push(k.en);
      rest = rest.replace(key, " ");
    }
  }
  return { en: found.join(", "), unmatched: rest.replace(/[\s,.;]+/g, " ").trim() };
}
