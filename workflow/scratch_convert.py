import json
import os

files = [
    ("/Users/kawa/Downloads/drive-download-20261025T092134Z-1-001/1.kocai_noi_1.json", "Workflow 1: KOC Gái Nói 1 (Tâm sự / Chia sẻ chuyện yêu đương)"),
    ("/Users/kawa/Downloads/drive-download-20261025T092134Z-1-001/2.kocai_noi_2.json", "Workflow 2: KOC Gái Nói 2 (Nghệ thuật cãi lộn với bạn trai)"),
    ("/Users/kawa/Downloads/drive-download-20261025T092134Z-1-001/3.kocai_reaction_1.json", "Workflow 3: KOC Reaction 1 (Bình luận video chó chăn cừu)"),
    ("/Users/kawa/Downloads/drive-download-20261025T092134Z-1-001/4.kocai-reaction_2.json", "Workflow 4: KOC Reaction 2 (Phản ánh anh bán bánh mì tốc độ trong xe hơi)"),
    ("/Users/kawa/Downloads/drive-download-20261025T092134Z-1-001/5.cosplay_nami.json", "Workflow 5: Cosplay Nami One Piece (Biến hình nhà sách & kêu gọi tương tác)")
]

out_md = []
out_md.append("# TÀI LIỆU TOÀN TẬP: CÁC WORKFLOW GOOGLE FLOW LÀM VIDEO AI (VEO 3.1 & OMNI FLASH)")
out_md.append("\n> **Mục đích tài liệu:** Tài liệu này được biên soạn chuyên dụng làm nguồn tri thức (Source Document) cho NotebookLM. Tài liệu chuẩn hóa toàn bộ cấu trúc đồ thị, logic kịch bản, system prompt, và prompt video chi tiết từ 5 workflow Google Flow, loại bỏ các dữ liệu nhị phân base64 không cần thiết.\n")
out_md.append("---\n")

out_md.append("## PHẦN 1: TỔNG QUAN KIẾN TRÚC WORKFLOW & QUY TẮC KỸ THUẬT GOOGLE FLOW\n")
out_md.append("""### 1. Kiến trúc luồng làm video (Pipeline Node Architecture)
Mỗi dự án video trong Google Flow được thiết kế theo mô hình Node-Edge nối tiếp liên hoàn:
- **Node Voice (Âm thanh gốc):** Khởi tạo giọng đọc (ví dụ: Giọng đọc `TuongVi`). Node này cung cấp file audio mẫu (định dạng wav/mp3) để chuẩn hóa ngữ điệu và làm cơ sở đồng bộ khẩu hình (lip-sync).
- **Node Character (Nhân vật ảo):** Xác định danh tính, phong cách, và ảnh chân dung tham chiếu gốc (Input Face/Image Persona - ví dụ: nhân vật `Chau`). Node này kết nối với Node Script để giữ gương mặt cố định xuyên suốt.
- **Node Script (Kịch bản & Prompt Kỹ thuật):**
  - **General Settings (Topic / System Prompt):** Thiết lập các quy tắc nền tảng khắt khe cho mô hình video (khóa phông nền, khóa tư thế cơ thể, chống ảo giác biến dạng).
  - **Shot Breakdown:** Chia kịch bản thành từng shot ngắn (3 đến 5 shots), mỗi shot gồm 4 trường dữ liệu cốt lõi: `Visual Prompt`, `Dialogue`, `Camera Motion`, và `Action & Biểu cảm cơ mặt`.
- **Node Scene (Mô hình tạo video AI):** Nhận prompt từ Script để render video tương ứng với từng shot thông qua các engine như `Veo 3.1 - Lite` hoặc `Omni 1.1 Flash`.
- **Node Export (Kết xuất Master):** Tổng hợp và kết xuất video dọc chuẩn (tỉ lệ 9:16) sẵn sàng đăng tải lên TikTok, YouTube Shorts, Reels.

### 2. Các quy tắc vàng khi thiết lập Prompt cho Veo 3.1 và Omni Flash
1. **Quy tắc Giữ tĩnh tuyệt đối (100% Frozen/Static Background & Body):**
   - Để video AI không bị méo mó, biến dạng phông nền (background morphing) hoặc đổi trang phục giữa các frame, prompt luôn phải có câu thần chú: *\"Giữ tĩnh 100% (frozen/static) đối với bối cảnh, trang phục, kiểu tóc, phụ kiện và tư thế cơ thể\"*.
   - Khóa chặt bàn tay (ví dụ: tay khoác túi xách, tay đút túi quần, hai tay đặt trên vô lăng...) để tránh AI sinh ra thêm ngón tay hoặc bàn tay quái dị.
2. **Quy tắc Chỉ cử động khối cơ mặt (Facial Muscle Movement Only):**
   - Chỉ cho phép mắt (nhìn thẳng, chớp nhẹ, nháy mắt, đảo mắt), chân mày (nhướn lên, cau mày) và khuôn miệng (mỉm cười, chu môi, nhép theo lời thoại) chuyển động.
3. **Quy tắc Khóa góc máy (Fixed Camera Motion):**
   - Hầu hết các shot đều sử dụng: `Static camera, locked position`, `Absolute fixed camera, no movement`, hoặc `Static eye-level shot` nhằm giữ cho góc nhìn của người xem ổn định, chuyên nghiệp như một video KOC thật quay bằng tripod.
4. **Quy tắc Chống chữ rác (No Subtitle / Watermark):**
   - Luôn kèm chỉ thị: *\"Tuyệt đối không chèn phụ đề\"* hoặc *\"No text appears in the video\"* để tránh AI tự động render chữ méo mó lên màn hình.
""")

out_md.append("\n---\n")
out_md.append("## PHẦN 2: THƯ VIỆN CHI TIẾT 5 WORKFLOW MẪU\n")

for fpath, title in files:
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    fname = os.path.basename(fpath)
    out_md.append(f"### {title}")
    out_md.append(f"- **Tên file gốc:** `{fname}`")
    
    voices = []
    characters = []
    scripts = []
    scenes = []
    
    for n in data.get("nodes", []):
        t = n.get("type")
        d = n.get("data", {})
        if t == "voice":
            v_name = d.get("name") or "TuongVi"
            voices.append(v_name)
        elif t == "character":
            c_name = d.get("name") or "Chau"
            c_desc = d.get("description") or "Tham chiếu theo ảnh gốc"
            characters.append(f"{c_name} ({c_desc})")
        elif t == "script":
            scripts.append(d)
        elif t == "scene":
            scenes.append(f"Scene {d.get('sceneIndex')}: Model={d.get('model', 'Veo 3.1 - Lite')}, Status={d.get('status')}")
            
    out_md.append(f"- **Giọng đọc (Voice Node):** {', '.join(set(voices)) if voices else 'TuongVi'}")
    out_md.append(f"- **Nhân vật (Character Node):** {', '.join(characters) if characters else 'Chau'}")
    out_md.append(f"- **Mô hình AI sử dụng (Scene Nodes):** {', '.join(scenes) if scenes else 'Veo 3.1 - Lite / Omni 1.1 Flash'}")
    out_md.append("")
    
    for idx, s in enumerate(scripts):
        if not s.get("shots") and not s.get("topic"):
            continue
        out_md.append(f"#### Kịch bản & Prompt Kỹ thuật (Script Section #{idx+1})")
        out_md.append(f"- **Loại kịch bản:** `{s.get('scriptType', 'dialogue')}`")
        out_md.append(f"- **Tỉ lệ khung hình:** `{s.get('aspectRatio', '9:16')}`")
        out_md.append(f"- **Số lượng phân cảnh (Shots):** `{s.get('shotCount', len(s.get('shots', [])))}`")
        
        topic = s.get("topic")
        if topic:
            out_md.append("\n**Cài đặt chung & System Prompt (Topic):**")
            out_md.append("```text\n" + topic.strip() + "\n```\n")
        
        shots = s.get("shots", [])
        if shots:
            out_md.append("**Phân cảnh chi tiết từng Shot (Shots Breakdown):**\n")
            for shot in shots:
                s_num = shot.get("shot")
                out_md.append(f"##### Shot {s_num}")
                out_md.append(f"- **Lời thoại (Dialogue tiếng Việt):** \"{shot.get('dialogue', '')}\"")
                out_md.append(f"- **Góc máy (Camera Motion):** `{shot.get('cameraMotion', 'Static')}`")
                out_md.append(f"- **Hành động & Diễn hoạt cơ mặt (Action):** {shot.get('action', '')}")
                out_md.append(f"- **Visual Prompt (Prompt tiếng Anh cho AI Video):**\n  > {shot.get('visualPrompt', '')}\n")
    out_md.append("\n---\n")

out_md.append("""## PHẦN 3: HƯỚNG DẪN ĐƯA VÀO VÀ KHAI THÁC TRÊN NOTEBOOKLM

### 1. Tại sao không thể nạp trực tiếp file .json thô vào NotebookLM?
- **Rác Base64 cực lớn:** Mỗi file JSON này nặng từ 4 - 5MB do chứa trực tiếp mã hóa base64 của video mp4 và âm thanh wav. Nếu nạp vào, NotebookLM sẽ bị tràn token ngữ cảnh vào hàng triệu ký tự nhị phân vô nghĩa.
- **Cấu trúc JSON rời rạc:** NotebookLM là công cụ đọc hiểu tài liệu dạng văn bản tự nhiên (Natural Language Document). File JSON chứa cấu trúc node đồ thị (nodes, edges, targetHandle...) khiến AI khó nắm bắt toàn diện bức tranh kịch bản.
- **Giải pháp:** Chuyển đổi thành file Markdown (`google_flow_workflows_knowledge_base.md`) hoặc file Text/PDF chuẩn này.

### 2. Các bước nạp vào NotebookLM
1. Truy cập [notebooklm.google.com](https://notebooklm.google.com).
2. Nhấn nút **Tạo Notebook mới (New Notebook)**.
3. Trong cửa sổ **Thêm nguồn (Add Sources)**:
   - Chọn **Upload File** và chọn file `google_flow_workflows_knowledge_base.md` (hoặc copy toàn bộ nội dung dán vào tùy chọn **Copied text**).
4. NotebookLM sẽ tự động phân tích và tạo mục lục tri thức (Study Guide, Briefing Doc) cho bạn chỉ sau 10 - 20 giây!

### 3. Bộ câu hỏi mẫu (Prompts) gợi ý để khai thác tối đa NotebookLM:
- **Câu hỏi 1 (Tóm tắt quy chuẩn):** *"Hãy đúc kết các quy tắc viết Visual Prompt và Camera Motion trong Google Flow để video tạo ra bởi Veo 3.1 không bị méo hình và giữ nguyên được nhân vật."*
- **Câu hỏi 2 (Tạo kịch bản mới):** *"Dựa vào cấu trúc của Workflow 2 (Nghệ thuật cãi lộn với người yêu), hãy viết cho tôi 1 kịch bản mới 4 shot theo chủ đề 'Con gái giận dỗi khi người yêu quên ngày kỷ niệm', đầy đủ Dialogue tiếng Việt, Visual Prompt tiếng Anh, Camera Motion và Action cơ mặt."*
- **Câu hỏi 3 (Tạo kịch bản Reaction):** *"Dựa vào Workflow 4 (Reaction xe hơi), hãy tạo một kịch bản reaction 3 shot cho một bạn KOC ngồi trong quán cafe ngạc nhiên trước một trend TikTok hài hước."*
- **Câu hỏi 4 (Audio Overview / Podcast):** *"Hãy tạo bản tóm tắt Audio Overview (Deep Dive) thảo luận về cách tối ưu hóa quy trình làm video ngắn triệu view bằng Google Flow và Veo 3.1."*
""")

final_content = "\n".join(out_md)
target_file = "/Users/kawa/Downloads/drive-download-20261025T092134Z-1-001/google_flow_workflows_knowledge_base.md"
with open(target_file, "w", encoding="utf-8") as f:
    f.write(final_content)
print(f"DONE! Wrote {len(final_content)} characters to {target_file}")
