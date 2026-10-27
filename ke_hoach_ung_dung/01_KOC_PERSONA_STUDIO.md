# KẾ HOẠCH CHI TIẾT: KOC PERSONA STUDIO
## Nền Tảng Định Danh & Khóa Nhân Vật KOC AI Toàn Diện (Identity Lock 100% & 3D Reference Sheet)

---

## 1. TỔNG QUAN & ĐỊNH VỊ SẢN PHẨM

* **Tên ứng dụng:** **KOC Persona Studio**
* **Slogan:** *"Một ảnh chân dung – Khóa trọn danh tính cho hàng ngàn video AI"*
* **Định vị:** Ứng dụng quản trị và nhân bản nhân dạng KOC ảo (Virtual Influencer/KOC) dành riêng cho các nhà sáng tạo nội dung, Agency quảng cáo và chủ shop E-commerce. Giải quyết bài toán nhức nhối nhất trong AI Video hiện nay: **hiện tượng trôi mặt (Identity Drift)** giữa các phân cảnh và góc máy.

---

## 2. NỖI ĐAU THỊ TRƯỜNG & VẤN ĐỀ CẦN GIẢI QUYẾT

1. **Khuôn mặt biến dạng qua mỗi lần render:** Mỗi lần sinh ảnh hoặc video mới qua Midjourney, Flux hay Veo, nhân vật lại có khuôn mặt, sống mũi hoặc độ tuổi khác nhau, khiến thương hiệu không thể xây dựng nhân vật đại diện dài hạn.
2. **Thiếu góc nhìn đồng bộ:** Khi làm video, nhân vật cần quay nghiêng 3/4, nhìn xuống, nhìn sau lưng nhưng AI không có dữ liệu đối chiếu chuẩn của góc đó.
3. **Mất thời gian prompt lại từ đầu:** Người dùng phải liên tục mô tả lại thông số khuôn mặt, mắt, mũi, làn da và trang phục trong mọi câu lệnh.

---

## 3. KIẾN TRÚC HỆ THỐNG & CƠ CHẾ KỸ THUẬT CỐT LÕI

Hệ thống hoạt động dựa trên 2 kỹ thuật độc quyền được trích xuất từ tài liệu kỹ thuật:

### 3.1. Cơ Chế JSON Identity Lock 100% (Khóa cứng bản sắc)
Khi người dùng tải lên 1 ảnh chân dung gốc, hệ thống tự động bóc tách và tạo ra một khối dữ liệu ràng buộc tuyệt đối:

```json
{
  "reference": {
    "source": "Uploaded input image",
    "identity_lock": true,
    "identity_consistency": "100%",
    "reference_priority": "ALWAYS use the uploaded image as the ONLY facial identity reference."
  },
  "facial_extraction_details": {
    "instructions": "Extract strictly from the uploaded source image. DO NOT redesign, beautify, stylize, or modify proportions. Preserve exact identity, facial geometry, age, and skin texture.",
    "features": {
      "face_shape": "Exact match to uploaded reference",
      "eyes": "Exact match including eye shape, size, spacing, and eye color",
      "nose": "Exact match to high natural bridge",
      "lips": "Exact match to natural glossy lip contours",
      "skin": "Exact match including visible natural pores and micro-imperfections"
    }
  }
}
```

### 3.2. Bộ Tạo Bảng Mẫu Thiết Kế 15 Góc (3D Turnaround Reference Sheet)
Hệ thống tự động sinh ra một bức ảnh tổng hợp chia làm 3 phân khu chuẩn kỹ xảo điện ảnh:
* **Phân khu Trái (Left Section):** 3 góc đứng toàn thân (Front view, Side profile, Back view) để định hình chiều cao, vóc dáng, tỉ lệ cơ thể.
* **Phân khu Phải - Trên (Right Upper Section):** 6 góc cận mặt (Chính diện, nhìn thẳng, nhìn xuống, nghiêng 45° trái, nghiêng 45° phải, mặt sau đầu).
* **Phân khu Phải - Dưới (Right Lower Section):** 6 góc lưới đặc tả chi tiết (Kết cấu lỗ chân lông da mặt, chi tiết con ngươi/catchlights, chất liệu tóc, đường viền cổ/xương quai xanh, chi tiết trang phục, giày dép).

---

## 4. TÍNH NĂNG CỐT LÕI (CORE FEATURES)

1. **One-Click Character Onboarding:** Tải lên 1 ảnh chân dung duy nhất ➔ Hệ thống chấm điểm chất lượng ảnh (độ nét, ánh sáng, góc nhìn).
2. **Auto Face Mesh & Feature Extraction:** Tự động trích xuất các đặc tính nhận dạng: màu tóc, kiểu tóc, dáng mắt, màu mắt, đặc điểm nốt ruồi/lúm đồng tiền.
3. **Voice Persona Binding:** Gán ID giọng đọc (Voice MediaID từ bộ sưu tập TuongVi, BanMai,...) đồng bộ trực tiếp với nhân vật để sẵn sàng đưa vào luồng kịch bản.
4. **Persona Portfolio Export:** Xuất hồ sơ nhân vật dạng file cấu hình JSON, kèm bộ ảnh 3D Turnaround Sheet chuẩn 4K/8K.
5. **Direct Integration Plugin:** Tự động đẩy hồ sơ nhân vật vào các Node của Google Flow hoặc ứng dụng dựng video bên ngoài.

---

## 5. CÔNG NGHỆ & TECH STACK ĐỀ XUẤT

* **Frontend:** Next.js 14 / React với TailwindCSS và Canvas Editor (cho phép xem và zoom 15 góc nhân vật).
* **Backend:** FastAPI (Python) hoặc Node.js để quản lý hồ sơ và xử lý đa luồng.
* **AI Computer Vision:** InsightFace / Face Recognition để tính điểm tương đồng (Cosine Similarity > 0.85).
* **Image Generation:** Tích hợp API Imagen 3 / Gemini Nano Banana Pro / Flux Dev để sinh bảng 3D Turnaround Sheet.
* **Database:** PostgreSQL (lưu thông tin persona) + Supabase Storage / Cloudflare R2 (lưu trữ ảnh 4K/8K).

---

## 6. LỘ TRÌNH TRIỂN KHAI (ROADMAP)

* **Giai đoạn 1 (Tuần 1 - 2):** Xây dựng module nhận diện khuôn mặt và bộ sinh JSON Identity Lock. Tạo giao diện UI upload và xuất file JSON.
* **Giai đoạn 2 (Tuần 3 - 4):** Tích hợp pipeline sinh ảnh 3D Turnaround Sheet 15 góc. Kiểm tra độ ổn định trên Flux và Gemini.
* **Giai đoạn 3 (Tuần 5 - 6):** Bổ sung tính năng liên kết Voice Model (Gắn kèm sample audio WAV) và xuất trực tiếp thành Node Character cho Google Flow.

---

## 7. MÔ HÌNH KINH DOANH & THƯƠNG MẠI HÓA

* **Freemium:** Miễn phí tạo 1 KOC Persona (độ phân giải 1080p, xuất JSON cơ bản).
* **Pro Tier ($19/tháng):** Quản lý không giới hạn 5 KOC, xuất 3D Sheet chuẩn 4K, hỗ trợ tạo 15 góc chi tiết cao.
* **Agency Tier ($49/tháng):** Quản lý 20 KOC, API tích hợp trực tiếp vào hệ thống dựng video tự động, bảo mật khuôn mặt độc quyền cho nhãn hàng.
