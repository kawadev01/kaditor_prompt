# KẾ HOẠCH CHI TIẾT: JSON PROMPT & COLLAGE LAYOUT GENERATOR
## Nền Tảng Thiết Kế Bố Cục Collage 3x3 Idol, Triptych & Thư Viện JSON Prompt Đa Ngách

---

## 1. TỔNG QUAN & ĐỊNH VỊ SẢN PHẨM

* **Tên ứng dụng:** **JSON Prompt & Collage Layout Generator**
* **Slogan:** *"Cấu trúc hóa trí tuệ nhân tạo – Tạo nên những khung hình tạp chí và Photobook đỉnh cao"*
* **Định vị:** Công cụ chuyên biệt tạo ra các bộ cấu trúc JSON Prompt chặt chẽ phục vụ cho việc sinh ảnh ghép dạng lưới (Collage 4 ảnh thời trang đường phố, Lưới 3x3 Korean Idol Photocard, Bộ 3 ảnh Triptych tạp chí thời trang Vogue). Giúp các nhà thiết kế tạo ra những ấn phẩm truyền thông đa khung hình mà vẫn bảo toàn 100% diện mạo nhân vật.

---

## 2. NỖI ĐAU THỊ TRƯỜNG & VẤN ĐỀ CẦN GIẢI QUYẾT

1. **Khó kiểm soát ảnh ghép đa khung hình (Collage Drift):** Khi yêu cầu AI vẽ 9 ô ảnh của cùng một người trong một bức ảnh 9:16, AI thường vẽ thành 9 người hoàn toàn khác nhau.
2. **Prompt dạng văn bản thông thường quá lộn xộn:** AI rất dễ bỏ sót các yêu cầu chi tiết (như ô giữa phải chụp cận cảnh mắt, ô góc trên phải nhìn nghiêng, ô dưới cùng phải cười).
3. **Nhu cầu cực lớn về phong cách Idol & Tạp chí thời trang:** Giới trẻ, KOC và nhãn hàng thời trang rất chuộng phong cách ảnh Photocard K-Pop (3x3 grid) và phong cách bìa tạp chí Triptych sang trọng nhưng không biết cách viết prompt đúng chuẩn cấu trúc JSON.

---

## 3. CẤU TRÚC KỸ THUẬT CỐT LÕI (JSON SCHEMA ARCHITECTURE)

Hệ thống số hóa toàn bộ yêu cầu nghệ thuật thành các trường dữ liệu tiêu chuẩn:

### 3.1. Cấu Trúc Khung JSON Tiêu Chuẩn
```json
{
  "project_type": { "name": "...", "layout": "...", "aspect_ratio": "...", "panel_count": 9 },
  "subject": { "identity": "...", "facial_consistency": { "requirements": [...] }, "skin": {...}, "makeup": {...}, "hair": {...} },
  "wardrobe": { "style": "...", "outfit": {...}, "consistency": "Same outfit across all frames" },
  "environment": { "location": "...", "background": [...], "priority": "Focus on subject" },
  "lighting": { "type": "...", "characteristics": [...] },
  "camera_style": { "genre": "...", "aesthetic": [...], "imperfections": ["Subtle analog film grain", "..."] },
  "panel_breakdown": {
    "top_row": { "top_left": {...}, "top_center": {...}, "top_right": {...} },
    "middle_row": { "center_left": {...}, "center": { "shot_type": "Close-up portrait", "gaze": "Direct eye contact" }, "center_right": {...} },
    "bottom_row": { "bottom_left": {...}, "bottom_center": {...}, "bottom_right": {...} }
  },
  "quality": { "resolution": "8K Ultra HD", "render_style": "Ultra-realistic photography" }
}
```

### 3.2. Ba Bộ Preset Độc Quyền Được Tích Hợp Sẵn
1. **Preset 1: Lưới 3x3 Korean Idol Photocard Series (9 Khung Hình Tỉ Lệ 9:16):**
   * Ô giữa trung tâm: Chân dung cận cảnh nụ cười ngọt ngào nhìn thẳng vào mắt người xem (Direct eye contact).
   * 8 ô xung quanh: Các chuyển động khoảnh khắc tự nhiên (quay đầu nhẹ qua vai, mắt nhìn xa xăm, nháy mắt tinh nghịch, dáng ngồi thư giãn).
   * Khóa cứng: Cùng một bộ trang phục áo sơ mi trắng oversized, cùng kiểu tóc dài uốn sóng nhẹ, cùng phong cách trang điểm Clean Girl trong trẻo.
2. **Preset 2: Triptych Vertical High-Fashion Editorial (Bộ 3 Khung Ảnh Dọc Tạp Chí Vogue):**
   * Khung trên: Chân dung bán thân bố cục cân đối hoàn hảo, thần thái điềm tĩnh, sang trọng.
   * Khung giữa: Cực cận đôi mắt (Extreme close-up), bàn tay che nhẹ khuôn mặt làm nổi bật bộ móng tay đen bóng sắc sảo.
   * Khung dưới: Góc chụp nghiêng 3/4, bàn tay chạm nhẹ môi, tôn vinh trang phục đen tối giản và phong cách Haute Couture.
3. **Preset 3: 4-Photo Smartphone Fashion Collage (Thời Trang Đường Phố 1:1):**
   * 4 góc: Dáng đứng toàn thân ➔ Tựa tường phóng khoáng ➔ Ngồi tự nhiên trên sàn ➔ Cận cảnh nửa thân trên khoe áo camisole denim bất đối xứng và quần jean thụng.

---

## 4. TÍNH NĂNG CỐT LÕI (CORE FEATURES)

1. **Visual Collage Builder:** Chọn kiểu bố cục trên màn hình (Lưới 2x2, Lưới 3x3, Cột dọc 3 tầng Triptych, Bố cục tạp chí bất đối xứng) ➔ Tự động sinh mã JSON tương ứng.
2. **Panel Emotion Director:** Cho phép click vào từng ô vuông trên màn hình để chọn biểu cảm mong muốn (Cười tinh nghịch, ánh nhìn quyến rũ, mắt nhìn nghiêng, quay lưng nhìn lại qua vai).
3. **JSON Code View & Copy 1-Click:** Xuất ra đoạn mã JSON tinh gọn, chuẩn cú pháp để copy thẳng vào ChatGPT, Midjourney v6, Flux hoặc Google AI Studio.
4. **Niche Template Store:** Kho template JSON phong phú theo từng ngành nghề: Mỹ phẩm, Trang sức xa xỉ, Quần áo dạo phố, Giày dép thể thao.

---

## 5. CÔNG NGHỆ & TECH STACK ĐỀ XUẤT

* **Frontend:** SvelteKit hoặc React với thư viện kéo thả Grid Layout (`react-grid-layout`).
* **JSON Schema Validator:** Kiểm tra tính hợp lệ của mã JSON theo thời gian thực (real-time validation).
* **AI Generation Preview:** Tích hợp API Gemini 1.5 Flash để sinh ảnh demo xem trước bố cục.

---

## 6. LỘ TRÌNH TRIỂN KHAI (ROADMAP)

* **Giai đoạn 1 (Tuần 1):** Xây dựng giao diện chỉnh sửa ma trận 3x3 và bộ sinh JSON Prompt cho phong cách Korean Idol Photobook.
* **Giai đoạn 2 (Tuần 2):** Bổ sung layout Triptych tạp chí và bố cục 4 ảnh smartphone streetwear.
* **Giai đoạn 3 (Tuần 3 - 4):** Xây dựng thư viện lưu trữ cá nhân (User Cloud Library) để người dùng lưu và chia sẻ các công thức JSON của mình.

---

## 7. MÔ HÌNH KINH DOANH & THƯƠNG MẠI HÓA

* **Bản Miễn Phí:** Sử dụng mẫu 4-photo grid cơ bản.
* **Gói Template Pack ($15 - $25 mua trọn đời):** Sở hữu trọn bộ 50+ file JSON Prompt cao cấp (Idol 3x3, Triptych, Lookbook Look, E-commerce layout).
* **SaaS Subscription ($9.99/tháng):** Truy cập không giới hạn kho template cập nhật hàng tuần và tính năng tùy biến ma trận chuyên sâu.
