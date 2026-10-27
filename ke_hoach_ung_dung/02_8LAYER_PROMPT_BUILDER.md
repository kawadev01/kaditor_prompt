# KẾ HOẠCH CHI TIẾT: 8-LAYER PROMPT BUILDER & REALISM FIXER
## Studio Thiết Kế Prompt Điện Ảnh 8K & Khử Triệt Để "Chất Nhựa AI" Cho KOC

---

## 1. TỔNG QUAN & ĐỊNH VỊ SẢN PHẨM

* **Tên ứng dụng:** **8-Layer Prompt Builder & Realism Fixer**
* **Slogan:** *"Biến mô tả tiếng Việt giản đơn thành câu lệnh nhiếp ảnh Hollywood 8K chuẩn xác"*
* **Định vị:** Ứng dụng trợ lý thiết kế prompt chuyên nghiệp theo cấu trúc phân tầng điện ảnh kết hợp bộ lọc xử lý tự động chất lượng ảnh, giúp loại bỏ cảm giác giả tạo, da sáp bóng nhẫy ("chất nhựa AI") mà người mới dùng AI thường gặp phải.

---

## 2. NỖI ĐAU THỊ TRƯỜNG & VẤN ĐỀ CẦN GIẢI QUYẾT

1. **Prompt lộn xộn, thiếu cấu trúc:** Người dùng thường gõ prompt tự do như một đoạn văn dài, khiến AI bị loạn thông tin, không biết đâu là tiêu cự máy ảnh, đâu là bối cảnh hay trang phục.
2. **Da nhân vật nhìn giả (Plastic AI Look):** Ảnh tạo ra thường có làn da mịn như tượng sáp, ánh sáng đổ bóng khối cứng (harsh shadow), mắt vô hồn không có phản quang.
3. **Rào cản tiếng Anh chuyên ngành:** Thuật ngữ nhiếp ảnh (shutter speed, f-stop, butterfly lighting, bokeh, rim light, shallow depth of field) gây bối rối cho phần lớn KOC và Marketer tại Việt Nam.

---

## 3. CÔNG THỨC 8 TẦNG & BỘ THUẬT TOÁN XỬ LÝ (CORE ARCHITECTURE)

Ứng dụng chia nhỏ quá trình nhập liệu thành **8 khối Lego độc lập**, sau đó tự động biên dịch và gắn nhãn theo thứ tự ưu tiên của mô hình thị giác:

```text
[Form Nhập Liệu Tiếng Việt / Chọn Mẫu Nhanh]
       ↓
[Bộ Biên Dịch Nhiếp Ảnh & Gợi Ý Từ Khóa Điện Ảnh]
       ↓
[Tầng Khử Nhựa AI: Bơm Lỗ Chân Lông + Butterfly Light + Catchlights]
       ↓
[Tích Hợp Bộ Negative Prompt Kép (Loại Bỏ Lỗi & Khóa Bản Sắc)]
       ↓
[Kết Quả: Phân Tích Song Ngữ + Mã Prompt Tiếng Anh Chuẩn 8K]
```

### 3.1. Chi Tiết 8 Tầng Thông Số Kỹ Thuật
1. **Tầng 1 (Quality & Style Prefix):** Mặc định các thông số đỉnh cao: `ultra-realistic, photorealistic, masterpiece, best quality, highly detailed, 8k, cinematic, professional photography`.
2. **Tầng 2 (Subject / Persona):** Độ tuổi, giới tính, quốc tịch, thần thái (VD: `stunning 22-year-old Vietnamese woman, extremely beautiful`).
3. **Tầng 3 (Facial & Body Details):** Chi tiết cấu trúc mặt, sống mũi, khóe môi, vòng eo, lúm đồng tiền.
4. **Tầng 4 (Clothing & Accessories):** Kiểu áo cổ yếm, đầm bodycon, vải lụa voan mỏng, trang sức bạc, hoa tai pha lê.
5. **Tầng 5 (Pose & Emotion):** Dáng đứng tự tin, góc nghiêng đầu 15 độ, ánh nhìn quyến rũ ngây thơ vào ống kính.
6. **Tầng 6 (Setting & Environment):** Ban công gỗ lúc hoàng hôn, ánh đèn thành phố mờ nhòe (city night lights bokeh).
7. **Tầng 7 (Lighting, Color & Mood):** Bố cục ánh sáng giờ vàng (golden hour) phối với sắc xanh dịu nhẹ, ánh sáng viền (soft rim light).
8. **Tầng 8 (Camera & Technical Details):** Góc chụp cận cảnh trung bình (medium shot portrait), lấy nét cực nét, độ sâu trường ảnh nông, chụp bằng Sony A7R IV, ống kính 85mm f/1.4.

### 3.2. Thuật Toán "Realism Fixer" Khử Nhựa AI
Một nút gạt bật duy nhất: **"Bật Chế Độ Da Thật (Human Skin Mode)"**, hệ thống tự động tiêm các token kỹ thuật:
* **Da thật:** `ultra-realistic human face, natural skin texture, visible skin pores, raw photo, absent of plastic AI look`.
* **Ánh sáng Studio 3D:** `soft butterfly lighting on the face, gentle highlights on the tip of the nose and cheekbones`.
* **Phản quang có hồn cho mắt:** `large expressive eyes, clear bright sclera, highly detailed iris, natural eye catchlights, not over-sharpened`.
* **Má hồng tự nhiên:** `subtle rosy cheeks, natural warm blush, deep natural dimples when smiling`.

### 3.3. Bộ Negative Prompt Kép
Tự động đính kèm 2 tầng bảo vệ:
* **Negative gốc:** `blurry, low quality, deformed, ugly, bad anatomy, extra limbs, watermark`.
* **Negative giữ bản sắc:** `changed face, different face, different makeup, different lighting, different background, distorted face, distorted body, added person, changed clothes, fake image, overly strong filter`.

---

## 4. TÍNH NĂNG CỐT LÕI (CORE FEATURES)

1. **Visual Drag & Drop Prompt Canvas:** Giao diện kéo thả trực quan theo 8 khối tầng, người dùng có thể gõ tiếng Việt hoặc click vào kho từ điển mẫu (ví dụ: kho ống kính 35mm, 50mm, 85mm; kho ánh sáng Golden Hour, Cinematic Neon, Studio Softbox).
2. **Real-time Realism Score:** Đồng hồ đo "Độ chân thực dự kiến" (0% - 100%). Nếu người dùng quên thêm thông số ánh sáng hoặc kết cấu da, hệ thống sẽ hiện cảnh báo và gợi ý nút "Khắc phục nhanh".
3. **Song Ngữ Tự Động:** Hiển thị 2 cột song song: Cột giải nghĩa tiếng Việt chi tiết từng thành phần để người dùng học hỏi, và Cột tiếng Anh tối ưu hóa cho AI với nút **"Copy Prompt"** 1 chạm.
4. **Preset Theo Ngách:** Các bộ preset sẵn: KOC Thời trang đường phố Gen Z, KOC Mỹ phẩm Skincare cận mặt, KOC Đời sống thể thao năng động, KOC Công sở thanh lịch.

---

## 5. CÔNG NGHỆ & TECH STACK ĐỀ XUẤT

* **Frontend:** Vue.js 3 hoặc React/Next.js với giao diện Dark Mode cao cấp chuẩn Studio (#0e0e0e).
* **AI NLP Translation Engine:** Tích hợp Gemini 1.5 Flash / Claude 3.5 Sonnet với System Prompt chuyên sâu về kỹ thuật nhiếp ảnh để dịch ngữ nghĩa chính xác từ tiếng Việt sang từ khóa máy ảnh tiếng Anh.
* **Hosting:** Vercel hoặc Cloudflare Pages (tối ưu tốc độ tải tức thì).

---

## 6. LỘ TRÌNH TRIỂN KHAI (ROADMAP)

* **Giai đoạn 1 (Tuần 1):** Xây dựng bộ công cụ dịch và ghép chuỗi 8 tầng, hoàn thiện danh mục 100 preset từ tài liệu `100 KOC AI [Workflow]_Premium.pdf`.
* **Giai đoạn 2 (Tuần 2):** Tích hợp bộ thuật toán "Realism Fixer" và Negative Prompt chuyên sâu.
* **Giai đoạn 3 (Tuần 3):** Ra mắt phiên bản Extension Chrome (cho phép điền nhanh vào web Midjourney, SeaArt, hoặc Google Flow).

---

## 7. MÔ HÌNH KINH DOANH & THƯƠNG MẠI HÓA

* **Bản Web Miễn Phí:** Sử dụng 8 tầng cơ bản, giới hạn 10 prompt/ngày.
* **Gói VIP Thành Viên (99.000 VNĐ/tháng hoặc 499.000 VNĐ trọn đời):** Mở khóa toàn bộ 100+ Preset KOC đỉnh cao, tính năng Realism Fixer Pro, xuất file cấu hình cho Midjourney và Google Flow.
* **Bán Gói Bundle:** Bán kèm cùng tài liệu hướng dẫn và kho prompt KOC độc quyền.
