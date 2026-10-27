# KOC Prompt Studio – Hướng Dẫn Sử Dụng

KOC Prompt Studio là bộ công cụ thiết kế câu lệnh AI chuyên sâu dành cho KOC, Creator và E-commerce, gồm 2 công cụ chính:
1. **8-Layer Prompt Builder & Realism Fixer**: Tạo prompt điện ảnh 8K và tự động khử "chất nhựa AI" (da sáp, mắt vô hồn).
2. **JSON Prompt & Collage Layout Generator**: Thiết kế bố cục ảnh ghép đa khung hình (Idol 3x3 Photocard, Vogue Triptych, 4-Photo Streetwear) khóa mặt 100%.

---

## 🚀 Khởi Động Ứng Dụng

Ứng dụng đang chạy tại: **http://localhost:3000**

Nếu muốn khởi động lại từ terminal:
```bash
cd /Users/kawa/Downloads/drive-download-20261025T092134Z-1-001/koc-prompt-studio
npm run dev
```

---

## 🎯 1. Hướng Dẫn Sử Dụng Trình Tạo Prompt 8 Tầng (`/prompt-builder`)

Mô hình hoạt động theo nguyên tắc: **Mô tả tiếng Việt ➔ Biên dịch máy ảnh chuẩn 8K ➔ Bơm công nghệ da thật ➔ Copy dùng ngay.**

### Các bước thao tác:
1. **Tải nhanh mẫu (Presets):**
   - Click chọn 1 trong 4 mẫu có sẵn: *KOC Thời trang đường phố Gen Z*, *KOC Mỹ phẩm Skincare cận mặt*, *KOC Thể thao năng động*, hoặc *KOC Công sở thanh lịch*.
2. **Tùy chỉnh nội dung theo ý bạn:**
   - Mở từng tầng (Tầng 2: Nhân vật, Tầng 3: Khuôn mặt, Tầng 4: Trang phục, Tầng 5: Dáng chụp, Tầng 6: Bối cảnh, Tầng 7: Ánh sáng, Tầng 8: Máy ảnh).
   - Gõ mô tả tiếng Việt giản dị (VD: `cô gái 22 tuổi, áo sơ mi trắng, nhìn nghiêng`).
   - Nhấn **"⚡ Dịch sang EN"** hoặc click vào các thẻ gợi ý (VD: `Sony A7R IV`, `85mm f/1.4`, `butterfly lighting`) để tự động chuyển thành từ khóa điện ảnh chuẩn.
3. **Bật chế độ Khử Nhựa AI (Realism Fixer Pro):**
   - Giữ công tắc bật để tự động tiêm:
     - Lỗ chân lông li ti, vân da tự nhiên, ảnh RAW.
     - Khối mặt 3D với ánh sáng butterfly light trên sống mũi và gò má.
     - Phản quang mắt (catchlights) tự nhiên, tròng mắt trong trẻo.
4. **Kiểm tra Chỉ số chân thực (Realism Score):**
   - Nhìn vào đồng hồ điểm bên phải (0% - 100%). Nếu còn thiếu thông số, nhấn nút **"Khắc phục nhanh"** để bổ sung ngay.
5. **Copy câu lệnh:**
   - Nhấn **"Copy Prompt"** để dán vào Flux, Google Flow, SeaArt.
   - Hoặc nhấn **"Midjourney Format"** để dán vào Discord Midjourney (đã kèm sẵn `--ar 2:3 --style raw --no ...`).
   - Nhấn **"Lưu Lại"** để cất vào thư viện.

---

## 🍱 2. Hướng Dẫn Sử Dụng Trình Tạo Collage Đa Khung Hình (`/collage`)

Giúp bạn tạo ra các bức ảnh ghép nhiều ô mà AI vẫn vẽ **cùng một người, cùng một bộ trang phục, chỉ khác dáng chụp và biểu cảm**.

### Các bước thao tác:
1. **Chọn bố cục lưới (Layout):**
   - **Lưới 3x3 (Tỉ lệ 9:16):** Phong cách Korean Idol Photocard (ô giữa là ảnh chân dung cận cảnh nụ cười ngọt ngào).
   - **Triptych Dọc (Tỉ lệ 9:16):** Bộ 3 ảnh dọc phong cách bìa tạp chí thời trang Vogue.
   - **Lưới 2x2 (Tỉ lệ 1:1):** 4 ảnh thời trang đường phố phong cách camera điện thoại.
2. **Khóa bản sắc nhân vật 100% (Identity Lock):**
   - Giữ công tắc bật để AI cố định khuôn mặt và trang phục xuyên suốt mọi ô ảnh.
3. **Chỉ đạo thần thái từng ô (Panel Emotion Director):**
   - Click vào ô vuông bất kỳ trên màn hình hiển thị lưới.
   - Chọn nhanh góc máy (*Cận cảnh*, *Bán thân*, *Toàn thân*...), biểu cảm (*Cười ngọt ngào*, *Nháy mắt*, *Quyến rũ*...) và hướng nhìn (*Nhìn thẳng*, *Ngoái nhìn qua vai*...).
4. **Copy JSON:**
   - Xem mã JSON đã được chuẩn hóa ở cột bên phải.
   - Nhấn **"📋 Copy JSON (1-Click)"** để dán vào ChatGPT, Midjourney v6, Flux hoặc Google AI Studio.

---

## 📚 3. Hướng Dẫn Quản Lý Thư Viện (`/library`)

- Xem lại toàn bộ prompt 8 tầng và cấu trúc JSON đã lưu.
- Tìm kiếm nhanh theo tên hoặc từ khóa.
- Lọc theo loại prompt (8-Layer hoặc Collage).
- Bấm ⭐ để đánh dấu yêu thích các mẫu hay dùng.
- Bấm **"Copy"** 1 chạm để lấy lại nội dung bất cứ khi nào cần.
