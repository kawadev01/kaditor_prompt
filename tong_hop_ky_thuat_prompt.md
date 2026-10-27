# Tổng hợp kỹ thuật prompt – Notebook "GoogleFlow Workflow"

> Truy vấn qua NotebookLM MCP (8/15 nguồn được trích dẫn). Mỗi mục ghi rõ nguồn.

## 1. Cấu trúc prompt 8 tầng (tạo hình KOC AI)
Thứ tự: `[1 Quality & Style] → [2 Subject] → [3 Facial & Body] → [4 Clothing & Accessories] → [5 Pose] → [6 Setting] → [7 Lighting/Color/Mood] → [8 Camera & Technical]` + Negative Prompt.

- Prefix mẫu: `ultra-realistic, photorealistic, masterpiece, best quality, highly detailed, 8k, cinematic, professional photography`
- Camera mẫu: `medium shot portrait, sharp focus, shallow depth of field, shot on Sony A7R IV, 85mm lens, f/1.4`
- Negative gốc: `blurry, low quality, deformed, ugly, bad anatomy, extra limbs, watermark`
- Negative duy trì bản sắc: `changed face, different face, different makeup, different lighting, different background, distorted face, distorted body, added person, changed clothes, fake image, overly strong filter`
- Mẹo: yêu cầu AI trả về *phân tích song ngữ Anh–Việt + prompt tiếng Anh để copy*; nhân vật luôn ở trung tâm, full body, không có người khác trong khung.
- Nguồn: `100 KOC AI [Workflow]_Premium.pdf`, `HƯỚNG DẪN KỸ THUẬT: CẤU TRÚC PROMPT CHUYÊN SÂU...`

## 2. Khử "chất nhựa AI" (Realism)
| Mục tiêu | Câu lệnh |
|---|---|
| Da thật | `ultra-realistic human face, natural skin texture, visible skin pores, raw photo, absent of plastic AI look` |
| Ánh sáng | `soft diffused lighting, flat ambient light, strictly no harsh shadows` |
| Khối mặt 3D | `Soft butterfly lighting on the face, gentle highlights on the tip of the nose and cheekbones` |
| Mắt có hồn | `large expressive eyes, clear bright sclera, highly detailed iris, natural eye catchlights, not over-sharpened` |
| Má/lúm đồng tiền | `subtle rosy cheeks, natural warm blush, deep natural dimples when smiling` |
| Negative persona | `ai generated, plastic skin, smooth skin, harsh shadows, overexposed, heavy makeup, 3d render, cartoon, doll` |
- Nguồn: `Update quan trọng .pdf`

## 3. Nhiếp ảnh sản phẩm e-commerce 8K
**System prompt 2 bước (lưới 2x3):**
1. `Describe the product in the image in detail. Provide the description of the product only, no other text is required.`
2. `You are a product photographer... Come up with 6 product shot ideas ... clean studio background... Generate a set of 6 images in a 2x3 grid using the details below. 1. [shot detail] ...`

**Node trích xuất:** `Extract image 1, top left` · `Extract Image 3, bottom left` · `Extract Image 4, top right` · `Extract Image 5, middle right` · `Extract image 6, bottom right`

**Góc máy:** Hero 45°, Top-Down/Flat-lay, Macro Detail, Lower-Angle, Minimal Studio, Surreal Scene, Wide Story, Product Spotlight Studio.
- Nguồn: `HƯỚNG DẪN KỸ THUẬT: CẤU TRÚC PROMPT CHUYÊN SÂU...`

## 4. JSON Prompt
- Phân rã thông số thành trường: `project_type`, `subject`, `wardrobe`, `environment`, `lighting`, `camera_style`, `panel_breakdown`, `mood_and_style`, `quality`.
- Mẫu: 4-photo grid collage (smartphone fashion), 3x3 Korean Idol collage (khóa mặt 100%), triptych editorial, prompt quay sản phẩm (dép da) khóa form: giữ nguyên hình dáng/màu/quai, camera cố định.
- Nguồn: `Json Prompt`

## 5. Prompt video (Veo 3.1 / Omni Flash)
**3 quy tắc vàng:**
1. `100% frozen/static background, body and clothing` – chống méo phông nền.
2. `Only facial muscles move (eyes blinking, eyebrows moving, mouth lip-syncing)`.
3. `Static camera, locked position, eye-level shot`.

**Cấu trúc shot:** `[General Settings]` + từng shot gồm Visual Prompt / Dialogue / Camera Motion / Action; shot sau ghi "Continuation of previous shot".

**Preservation prompt:** `Maintain the original face, facial features, makeup, hairstyle, and skin color... Do not change the face, lighting, background, do not distort the body.`

**Camera:** xoay 360° (`camera very slowly rotates around... light positions are fixed, only the camera is moving`), pan out + xoay lưng (`Camera pans slowly out as the model very slowly turns around... standing still for the last 2 seconds`).
- Nguồn: `google_flow_workflows_knowledge_base.md`, `HƯỚNG DẪN KỸ THUẬT...`

## 6. Nhất quán nhân vật
- **Identity lock (JSON):** `identity_lock: true`, `identity_consistency: 100%`, "ALWAYS use the uploaded image as the ONLY facial identity reference", "DO NOT redesign, beautify, stylize, or modify proportions"; khớp chính xác face_shape/eyes/nose/lips/skin.
- **3D Turnaround Sheet:** trái 3 góc toàn thân; phải trên 6 góc cận mặt; phải dưới 6 ô chi tiết (vải, quần, hông, da, mắt, giày).
- Nguồn: `Update quan trọng .pdf`

## 7. Prompt dựng tool trên Google Flow (công thức 3 lớp)
1. **Tool làm gì:** `Build a [tool type] for [target user/niche]`
2. **Giao diện UI/UX:** vùng upload, sidebar, preview, nút Regenerate/Download
3. **Luồng xử lý:** input → xử lý → output (MP4/PNG, tỷ lệ 1:1, 4:5, 9:16)
- Mẫu: "AI Video Prompt Studio Pro – Director's Command Center" (Character Manager, AI Scripting Engine, Storyboard, Video Production).
- Nguồn: `huong_dan_build_tool_google_flow.docx.pdf`

## 8. Lỗi thường gặp & cách xử lý
| Vấn đề | Cách xử lý |
|---|---|
| Méo phông nền/đổi quần áo | Frozen/static + facial muscles only + static camera |
| Bị chặn kiểm duyệt | Chuyển prompt sang Flux/Midjourney/Stable Diffusion |
| JSON workflow tràn token (Base64) | Lọc Base64, chuyển sang Markdown |
| Rate limit API | Bật Pay-as-you-go trên Google AI Studio |
| Mất tiếng trên macOS | Cài Homebrew + FFmpeg trước `npm run dev` |
- Nguồn: `HƯỚNG DẪN KỸ THUẬT...`, `INSTRUCTIONS FOR INSTALLING...`, `TÀI LIỆU HƯỚNG DẪN CÀI ĐẶT...`
