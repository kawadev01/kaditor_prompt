# TÀI LIỆU TOÀN TẬP: CÁC WORKFLOW GOOGLE FLOW LÀM VIDEO AI (VEO 3.1 & OMNI FLASH)

> **Mục đích tài liệu:** Tài liệu này được biên soạn chuyên dụng làm nguồn tri thức (Source Document) cho NotebookLM. Tài liệu chuẩn hóa toàn bộ cấu trúc đồ thị, logic kịch bản, system prompt, và prompt video chi tiết từ 5 workflow Google Flow, loại bỏ các dữ liệu nhị phân base64 không cần thiết.

---

## PHẦN 1: TỔNG QUAN KIẾN TRÚC WORKFLOW & QUY TẮC KỸ THUẬT GOOGLE FLOW

### 1. Kiến trúc luồng làm video (Pipeline Node Architecture)
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
   - Để video AI không bị méo mó, biến dạng phông nền (background morphing) hoặc đổi trang phục giữa các frame, prompt luôn phải có câu thần chú: *"Giữ tĩnh 100% (frozen/static) đối với bối cảnh, trang phục, kiểu tóc, phụ kiện và tư thế cơ thể"*.
   - Khóa chặt bàn tay (ví dụ: tay khoác túi xách, tay đút túi quần, hai tay đặt trên vô lăng...) để tránh AI sinh ra thêm ngón tay hoặc bàn tay quái dị.
2. **Quy tắc Chỉ cử động khối cơ mặt (Facial Muscle Movement Only):**
   - Chỉ cho phép mắt (nhìn thẳng, chớp nhẹ, nháy mắt, đảo mắt), chân mày (nhướn lên, cau mày) và khuôn miệng (mỉm cười, chu môi, nhép theo lời thoại) chuyển động.
3. **Quy tắc Khóa góc máy (Fixed Camera Motion):**
   - Hầu hết các shot đều sử dụng: `Static camera, locked position`, `Absolute fixed camera, no movement`, hoặc `Static eye-level shot` nhằm giữ cho góc nhìn của người xem ổn định, chuyên nghiệp như một video KOC thật quay bằng tripod.
4. **Quy tắc Chống chữ rác (No Subtitle / Watermark):**
   - Luôn kèm chỉ thị: *"Tuyệt đối không chèn phụ đề"* hoặc *"No text appears in the video"* để tránh AI tự động render chữ méo mó lên màn hình.


---

## PHẦN 2: THƯ VIỆN CHI TIẾT 5 WORKFLOW MẪU

### Workflow 1: KOC Gái Nói 1 (Tâm sự / Chia sẻ chuyện yêu đương)
- **Tên file gốc:** `1.kocai_noi_1.json`
- **Giọng đọc (Voice Node):** TuongVi
- **Nhân vật (Character Node):** Chau (Mô tả nhân vật...)
- **Mô hình AI sử dụng (Scene Nodes):** Scene 0: Model=Omni 1.1 Flash, Status=done, Scene 1: Model=Veo 3.1 - Lite, Status=done, Scene 2: Model=Veo 3.1 - Lite, Status=done

#### Kịch bản & Prompt Kỹ thuật (Script Section #1)
- **Loại kịch bản:** `dialogue`
- **Tỉ lệ khung hình:** `9:16`
- **Số lượng phân cảnh (Shots):** `3`

**Cài đặt chung & System Prompt (Topic):**
```text
Cài đặt chung (General Settings)Ảnh đầu vào: CleanShot 2026-09-21 at 11.53.53@2x.jpg   Chuyển động (Motion): Giữ tĩnh 100% (frozen/static) đối với bối cảnh phòng ngủ phía sau gồm giường có tựa lưng bọc nệm và rèm cửa, tư thế cơ thể tĩnh tại, mái tóc uốn lơi, lớp trang điểm, vòng cổ nhiều lớp có mặt hình ngôi sao và mặt trăng khuyết, cùng chiếc áo trễ vai dài tay màu đen. Chỉ duy nhất các khối cơ mặt (mắt, miệng, lông mày) chuyển động nhép môi và biểu đạt cảm xúc.   Cảnh 1: Lời mở đầu đầy tự hàoLời thoại chính xác: "Tính ra chị em phụ nữ của tụi em khôn thiệt chứ."Prompt biểu cảm: Ánh mắt lúng liếng, chớp nhẹ đầy vẻ kiêu kỳ và tự tin. Lông mày hơi dướn lên thể hiện sự tâm đắc. Khẩu hình miệng mở vừa phải, nhép môi theo nhịp điệu tự nhiên, khóe môi khẽ nhếch lên thành một nụ cười nửa miệng (smirk) đắc ý ở cụm từ "khôn thiệt chứ".(Nhắc lại: Thân người, áo trễ vai đen, vòng cổ mặt trăng sao, mái tóc và bối cảnh phòng ngủ hoàn toàn bất động).Cảnh 2: Chuỗi ngày lễ đòi quyền lợiLời thoại chính xác: "14 tháng 2 thì đòi làm công chúa, 8 tháng 3 cái làm phụ nữ, 1 tháng 6 đòi làm thiếu nhi, 15 tháng 8 thì làm chị Hằng."Prompt biểu cảm: Ánh mắt trở nên lém lỉnh, đảo nhẹ theo từng mốc thời gian được liệt kê. Lông mày nhướng lên xuống nhẹ nhàng tạo nhịp điệu hài hước. Nhép môi nhanh, chu môi nhẹ nũng nịu ở những từ "đòi làm", nét mặt mang sự xéo xắt, đỏng đảnh đặc trưng nhưng vẫn rất duyên dáng.(Nhắc lại: Thân người, áo trễ vai đen, vòng cổ mặt trăng sao, mái tóc và bối cảnh phòng ngủ hoàn toàn bất động).Cảnh 3: Cú chốt bất ngờ về tháng cô hồnLời thoại chính xác: "Nhưng mà riêng tháng 7 âm lịch... thì mấy bả làm thinh. Coi xong nhớ share giùm em nha!"Prompt biểu cảm: Mắt khẽ nheo lại, ánh nhìn bỗng trở nên nghiêm trọng giả trân (deadpan) ở cụm từ "tháng 7 âm lịch". Nhép môi chậm lại, cơ mặt hơi tỉnh bơ và đơ ra khi chốt câu "mấy bả làm thinh" để tạo sự tương phản tấu hài. Đến câu cuối, biểu cảm lập tức chuyển sang nụ cười tươi rói, mắt sáng lên đầy rạng rỡ khi kêu gọi "nhớ share giùm em nha".(Nhắc lại: Thân người, áo trễ vai đen, vòng cổ mặt trăng sao, mái tóc và bối cảnh phòng ngủ hoàn toàn bất động).
```

**Phân cảnh chi tiết từng Shot (Shots Breakdown):**

##### Shot 1
- **Lời thoại (Dialogue tiếng Việt):** "Tính ra chị em phụ nữ của tụi em khôn thiệt chứ."
- **Góc máy (Camera Motion):** `Static, fixed shot with 100% frozen background and body.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Only facial muscles move. Chau has a proud and confident expression. Her eyes sparkle and blink slightly with a touch of arrogance. Her eyebrows lift slightly to show satisfaction. Lip-syncing is natural, ending with a subtle, smug smirk on the phrase 'khôn thiệt chứ'.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > A medium close-up of Chau in a cinematic bedroom setting with an upholstered headboard and elegant curtains. Chau is wearing a long-sleeved black off-shoulder top and layered necklaces featuring star and crescent moon pendants. Her wavy hair, body, and the background are completely frozen and static. The lighting is soft and cinematic, highlighting her facial features. High quality, 4k resolution.

##### Shot 2
- **Lời thoại (Dialogue tiếng Việt):** "14 tháng 2 thì đòi làm công chúa, 8 tháng 3 cái làm phụ nữ, 1 tháng 6 đòi làm thiếu nhi, 15 tháng 8 thì làm chị Hằng."
- **Góc máy (Camera Motion):** `Static, fixed shot with 100% frozen background and body.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Playful and sassy facial animation. Her eyes move rhythmically as if listing items. Eyebrows dance slightly to match the cadence of the speech. Rapid lip-syncing with a slight pout on 'đòi làm'. The expression is flirtatious and charmingly demanding.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > No text appear in video. The exact same medium close-up framing as shot 1. Chau remains in her black off-shoulder top and celestial necklaces. The bedroom background, her hair, and her torso are entirely immobile. Focus remains solely on the animated facial expressions. Kiểu tóc không được thay đổi

##### Shot 3
- **Lời thoại (Dialogue tiếng Việt):** "Nhưng mà riêng tháng 7 âm lịch... thì mấy bả làm thinh. Coi xong nhớ share giùm em nha!"
- **Góc máy (Camera Motion):** `Static, fixed shot with 100% frozen background and body.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Eyes narrow into a mock-serious deadpan look during the first sentence. The lip-syncing slows down, and the face goes intentionally blank on 'mấy bả làm thinh' for comedic effect. Suddenly, her expression transforms into a bright, radiant smile with wide, sparkling eyes for the final call to action.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > The exact same medium close-up framing as previous shots. The background, hair, and clothing are locked and static. The lighting remains consistent. The focus is entirely on the transition of her facial expressions from serious to joyful.


---

### Workflow 2: KOC Gái Nói 2 (Nghệ thuật cãi lộn với bạn trai)
- **Tên file gốc:** `2.kocai_noi_2.json`
- **Giọng đọc (Voice Node):** TuongVi
- **Nhân vật (Character Node):** Chau (Tham chiếu theo ảnh gốc)
- **Mô hình AI sử dụng (Scene Nodes):** Scene 0: Model=Veo 3.1 - Lite, Status=done, Scene 2: Model=Veo 3.1 - Lite, Status=done, Scene 1: Model=Veo 3.1 - Lite, Status=done, Scene 3: Model=Veo 3.1 - Lite, Status=done, Scene 4: Model=Veo 3.1 - Lite, Status=done

#### Kịch bản & Prompt Kỹ thuật (Script Section #1)
- **Loại kịch bản:** `dialogue`
- **Tỉ lệ khung hình:** `9:16`
- **Số lượng phân cảnh (Shots):** `5`

**Cài đặt chung & System Prompt (Topic):**
```text
Cài đặt chung (General Settings)
Giữ tĩnh 100% (frozen/static) đối với bối cảnh, ánh nắng, trang phục voan mỏng, phụ kiện cài tóc và đặc biệt là cánh tay vươn ra cầm camera selfie. Lệnh ưu tiên: Khẩu hình miệng nhép liên tục, rõ ràng, khớp 100% với đoạn thoại tự biên. Mắt duy trì giao tiếp trực diện (eye contact) với ống kính. Tuyệt đối không chèn phụ đề.

Cảnh 1: Tiên nữ hạ phàm dạy đời (0:00 - 0:09)

Thoại reaction: "Ê mấy bà nha, chế nói mấy bà nghe nè. Muốn cãi lộn với bạn trai cho khỏi mang cục tức á, mấy bà phải hiểu cái hệ điều hành của con trai nó 'đơn giản' lắm. Nói một lúc nhiều thứ nó lú luôn á."

Prompt biểu cảm & Khẩu hình: Mở đầu với vẻ mặt lơ đãng, mộng mơ và ánh mắt dịu dàng y hệt ảnh gốc. Ngay khi cất tiếng "Ê mấy bà nha", đột ngột thoát vai, hai mắt mở to linh hoạt, nhép miệng dồn dập kiểu buôn dưa lê. Đầu khẽ nghiêng qua nghiêng lại. Tới chữ "lú luôn á", nhếch mép cười nửa miệng (smirk) đầy thâm hiểm.
Cảnh 2: Bắt chước điệu bộ ngơ ngác (0:10 - 0:15)

Thoại reaction: "Tui ví dụ nha, mấy bà đang khát mà kêu 'Em khát nước rồi', là y như rằng nó sẽ ngớ mặt ra hỏi lại 'Hả? Cái gì?'. Nó không có hiểu cái 'hint' của mấy bà đâu!"

Trạng thái bắt đầu: Khớp 100% với điểm nối Cảnh 1.

Prompt biểu cảm & Khẩu hình: Khẩu hình nhép chữ "Em khát nước rồi" cực kỳ nũng nịu. Nhưng ngay sau đó lập tức trợn ngược mắt lên, nhíu mày, há hốc miệng để nhái lại vẻ mặt ngơ ngác "Hả? Cái gì?" của mấy ông con trai. Cuối câu khẽ bĩu môi chê bai.
Cảnh 3: Triển chiêu "Anh ơi" ngọt xớt (0:15 - 0:25)

Thoại reaction: "Bởi vậy, mấy bà muốn gì á, đừng có vòng vo tam quốc. Phải gọi 'Anh ơi', rồi từ từ nói ra 'Em khát nước'. Là tự động nó đi lấy nước liền, y như được lập trình vậy đó."

Trạng thái bắt đầu: Khớp 100% với điểm nối Cảnh 2.

Prompt biểu cảm & Khẩu hình: Dẹp bỏ nét chán nản, khôi phục lại vẻ "thần tiên tỷ tỷ". Khi nhép chữ "Anh ơi", khẩu hình mở tròn, ánh mắt chớp chớp ướt át, nụ cười ngọt ngào thả thính vạn người mê. Sau đó lập tức đổi tông, gật gù liên tục đắc ý với bí kíp của mình.
Cảnh 4: Nhăn nhó vì lỗi "treo máy" (0:26 - 0:34)

Thoại reaction: "Chứ mấy bà mà kêu 'Lấy giùm em cái tô cái chén đi', là nó lại 'Hả?'. Nó 'hả' là mấy bà mất thời gian thêm mấy giây để giải thích nữa, mệt mỏi lắm."

Trạng thái bắt đầu: Khớp 100% với điểm nối Cảnh 3.

Prompt biểu cảm & Khẩu hình: Đang tươi cười bỗng hai lông mày xô lại vào nhau, mặt nhăn nhó cực kỳ bực dọc. Khẩu hình nhép dồn dập, gắt gỏng. Khi nhép chữ "Hả?", cơ hàm giật lên bộc lộ sự bất lực.
ảnh 5: Chốt hạ uy tín (0:35 - Hết)

Thoại reaction: "Nên túm lại, bí quyết là cứ gọi 'Anh ơi', rồi cho cái hệ điều hành của nó load 3 giây, xong hẵng ra lệnh. Chế nói không có sai đâu, cứ làm y vậy đi, cãi chế làm chi!"

Trạng thái bắt đầu: Khớp 100% với điểm nối Cảnh 4.

Prompt biểu cảm & Khẩu hình: Khuôn mặt giãn ra rạng rỡ trở lại. Tới đoạn "cho hệ điều hành nó load 3 giây", nháy mắt trái một cái thật điệu đà. Kết thúc câu cuối cùng, từ từ khép miệng lại, ánh mắt rũ xuống mơ màng, trở về đúng trạng thái tĩnh lặng, thoát tục (frozen) y chang như bức ảnh ban đầu để tạo thành một vòng lặp (loop) hoàn hảo!
```

**Phân cảnh chi tiết từng Shot (Shots Breakdown):**

##### Shot 1
- **Lời thoại (Dialogue tiếng Việt):** "Ê mấy bà nha, chế nói mấy bà nghe nè. Muốn cãi lộn với bạn trai cho khỏi mang cục tức á, mấy bà phải hiểu cái hệ điều hành của con trai nó 'đơn giản' lắm. Nói một lúc nhiều thứ nó lú luôn á."
- **Góc máy (Camera Motion):** `Static selfie position, no movement.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Begins with a distant, poetic look. Suddenly snaps into character with wide, expressive eyes. Mouth movements are rapid and precise, matching the rhythmic 'gossiping' tone. Tilts her head slightly left and right. Ends the shot with a knowing smirk.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > A close-up selfie angle of Chau, a fairy-like woman in delicate chiffon attire with ornate hair accessories. The background, clothing, and her outstretched arm holding the camera are 100% frozen and static. The only movement is her face and mouth. She starts with a dreamy, ethereal gaze and then transitions into a lively, gossipy expression.

##### Shot 2
- **Lời thoại (Dialogue tiếng Việt):** "Tui ví dụ nha, mấy bà đang khát mà kêu 'Em khát nước rồi', là y như rằng nó sẽ ngớ mặt ra hỏi lại 'Hả? Cái gì?'. Nó không có hiểu cái 'ý' của mấy bà đâu!"
- **Góc máy (Camera Motion):** `Static selfie position, no movement.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Mouths 'Em khát nước rồi' with a coquettish, pouty expression. Instantly shifts to a confused, blank stare with eyes wide and mouth agape to mimic a clueless boyfriend. Concludes the shot with a judgmental lip curl.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Continuation from Shot 1. Chau remains in the same static selfie pose. The chiffon fabric and hair ornaments are perfectly still. Her facial expressions become theatrical as she mimics different personas.No text appears in the video.

##### Shot 3
- **Lời thoại (Dialogue tiếng Việt):** "Bởi vậy, mấy bà muốn gì á, đừng có vòng vo tam quốc. Phải gọi 'Anh ơi', rồi từ từ nói ra 'Em khát nước'. Là tự động nó đi lấy nước liền, y như được lập trình vậy đó."
- **Góc máy (Camera Motion):** `Static selfie position, no movement.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Drops the annoyed look and adopts a sweet, alluring 'fairy' persona. When mouthing 'Anh ơi', her eyes sparkle and blink softly. Shifts to a confident, instructional nod, looking satisfied with her own advice.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > No text appears in the video.Continuation from Shot 2. Chau maintains the high-angle selfie frame. Lighting and environment are frozen. Her face softens back into a 'goddess' aesthetic but with a playful, instructive vibe.No text appears in the video.

##### Shot 4
- **Lời thoại (Dialogue tiếng Việt):** "Chứ mấy bà mà kêu 'Lấy giùm em cái tô cái chén đi', là nó lại 'Hả?'. Nó 'hả' là mấy bà mất thời gian thêm mấy giây để giải thích nữa, mệt mỏi lắm."
- **Góc máy (Camera Motion):** `Static selfie position, no movement.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Eyebrows knit together in a frown of frustration. Mouth movements are sharp and aggressive. When mouthing 'Hả?', her jaw tenses slightly to show exasperation.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > No text appears in the video..Continuation from Shot 3. Total freeze on the environment and clothing. Chau's facial expressions shift to intense frustration to emphasize her point.
No text appears in the video.

##### Shot 5
- **Lời thoại (Dialogue tiếng Việt):** "Nên túm lại, bí quyết là cứ gọi 'Anh ơi', rồi cho cái hệ điều hành của nó load 3 giây, xong hẵng ra lệnh. Chế nói không có sai đâu, cứ làm y vậy đi, cãi chế làm chi!"
- **Góc máy (Camera Motion):** `Static selfie position, no movement.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Face relaxes into a bright, confident smile. Winks her left eye playfully during the 'load 3 giây' phrase. After the final word, she slowly closes her mouth and softens her gaze, returning to the exact dreamy, frozen state from the beginning for a seamless loop.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > No text appears in the video..Continuation from Shot 3. Total freeze on the environment and clothing. Chau's facial expressions shift to intense frustration to emphasize her point.
No text appears in the video.


---

### Workflow 3: KOC Reaction 1 (Bình luận video chó chăn cừu)
- **Tên file gốc:** `3.kocai_reaction_1.json`
- **Giọng đọc (Voice Node):** TuongVi
- **Nhân vật (Character Node):** Chau (Tham chiếu theo ảnh gốc)
- **Mô hình AI sử dụng (Scene Nodes):** Scene 0: Model=Veo 3.1 - Lite, Status=done, Scene 1: Model=Veo 3.1 - Lite, Status=done, Scene 2: Model=Veo 3.1 - Lite, Status=done, Scene 0: Model=Veo 3.1 - Lite, Status=idle

#### Kịch bản & Prompt Kỹ thuật (Script Section #1)
- **Loại kịch bản:** `dialogue`
- **Tỉ lệ khung hình:** `9:16`
- **Số lượng phân cảnh (Shots):** `3`

**Cài đặt chung & System Prompt (Topic):**
```text
Cài đặt chung (General Settings)
Giữ tĩnh 100% (frozen/static) đối với bối cảnh view thành phố về đêm, ghế gaming hồng, micro, mắt kính, tai nghe, áo thun đen và đặc biệt là tư thế bàn tay phải đang giơ lên giải thích. Lệnh ưu tiên: Khẩu hình miệng phải nhép liên tục, cường độ cao, khớp 100% với từng âm tiết trong file audio. Mắt và đầu phối hợp linh hoạt kiểu một bình luận viên đang cực kỳ phấn khích. Tuyệt đối không chèn phụ đề.

Cảnh 1: Bình luận viên phân tích chiến thuật (0:00 - 0:10)

Thoại (Nhép 100% audio): "Chó này là chuyên chăn cừu đó nghe! Tại sao chuyên là nhìn cái cách bả làm việc là thấy nè hiểu liền luôn đó. Nguyên một bầy cừu, một đống một dề vầy đó là kẹt, đâu có đi được đâu, kẹt nãy giờ ta."

Prompt biểu cảm & Khẩu hình: Mở đầu với ánh mắt sắc sảo, tự tin nhìn thẳng vào ống kính (webcam) hệt như ảnh gốc. Khẩu hình miệng nhép dứt khoát, kết hợp với bàn tay đang giơ lên trông như một chuyên gia thực thụ đang "lên lớp". Tới cụm "một đống một dề", hai lông mày cau chặt lại, mắt hơi liếc xuống tỏ vẻ bế tắc thay cho bầy cừu.

Điểm nối (Seamless): Mắt liếc xuống, trán hơi nhăn, mím môi.

Cảnh 2: Vỡ òa thán phục (0:10 - 0:20)

Thoại (Nhép 100% audio): "Mình ên bả à, tả xung hữu đột, la một cái là điều phối giao thông cái thấy chưa? Mấy bà cừu bả đi là gọn khô luôn đó, đó... lăng xăng lăng xăng chạy chạy chạy chạy vậy đó."

Trạng thái bắt đầu: Khớp 100% với điểm nối Cảnh 1.

Prompt biểu cảm & Khẩu hình: Khuôn mặt căng thẳng bỗng giãn ra, hai mắt sáng rực, trợn tròn lên vì quá ấn tượng. Khẩu hình miệng mở to nhép chữ "la một cái", trông cực kỳ sung mãn. Tới đoạn "lăng xăng lăng xăng", đầu gật gù liên tục và hơi lắc lư qua lại nhanh nhẹn theo nhịp chạy của chú chó, miệng cười toét toát lên sự khoái chí.

Điểm nối (Seamless): Đầu gật gù, nụ cười tươi rói nhe răng.

Cảnh 3: Chốt hạ chân lý "có nghề là có tiền" (0:21 - Hết)

Thoại (Nhép 100% audio): "Trời đất ơi ta nói đúng thiệt chứ có một cái nghề là sống khỏe ru luôn đó, chuyên luôn nghe, chuyên môn luôn đó!"

Trạng thái bắt đầu: Khớp 100% với điểm nối Cảnh 2.

Prompt biểu cảm & Khẩu hình: Vẫn giữ nụ cười tươi, ánh mắt chuyển sang vẻ đắc ý, thán phục. Khẩu hình miệng mở rộng lố hơn một chút ở chữ "khỏe ru". Khi nhấn mạnh cụm "chuyên môn luôn đó!", cằm hất mạnh lên một nhịp kết hợp với cái tay đang giơ sẵn tạo ra một cú chốt hạ cực kỳ uy tín. Sau đó, giữ tĩnh (frozen) với nụ cười tự tin để kết thúc buổi "livestream".
```

**Phân cảnh chi tiết từng Shot (Shots Breakdown):**

##### Shot 1
- **Lời thoại (Dialogue tiếng Việt):** "Chó này là chuyên chăn cừu đó nghe! Tại sao chuyên là nhìn cái cách bả làm việc là thấy nè hiểu liền luôn đó. Nguyên một bầy cừu, một đống một dề vầy đó là kẹt, đâu có đi được đâu, kẹt nãy giờ ta."
- **Góc máy (Camera Motion):** `Static eye-level shot`
- **Hành động & Diễn hoạt cơ mặt (Action):** Chau looks directly into the camera with sharp, confident eyes. The mouth moves decisively, matching every syllable. At the phrase 'một đống một dề', the eyebrows knit together and the eyes glance down momentarily to convey the sheep's deadlock. Ends with a slight frown and pressed lips.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > A high-quality close-up of a commentator named Chau wearing glasses, headphones, and a black t-shirt, sitting in a pink gaming chair. The background is a static, frozen city night view. Chau's right hand is raised in a fixed explanatory gesture. The microphone is static. Only the mouth, eyes, and head move. The mouth must sync with 100% precision to the Vietnamese audio with high intensity.

##### Shot 2
- **Lời thoại (Dialogue tiếng Việt):** "Mình ên bả à, tả xung hữu đột, la một cái là điều phối giao thông cái thấy chưa? Mấy bà cừu bả đi là gọn khô luôn đó, đó... lăng xăng lăng xăng chạy chạy chạy chạy vậy đó."
- **Góc máy (Camera Motion):** `Static eye-level shot`
- **Hành động & Diễn hoạt cơ mặt (Action):** The facial expression shifts from tension to wonder. Eyes widen and brighten significantly. The mouth opens wide with high energy on 'la một cái'. As the dialogue hits 'lăng xăng lăng xăng', the head nods and sways quickly side-to-side, mimicking the agile movement of the dog. Ends with a wide, joyful grin showing teeth.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Continuation of the scene with Chau in the same frozen environment and posture. The lighting remains consistent. The focus is on the transition from frustration to intense admiration. Head and eye movements are fluid and energetic while the torso and hand remain completely still.

##### Shot 3
- **Lời thoại (Dialogue tiếng Việt):** "Trời đất ơi ta nói đúng thiệt chứ có một cái nghề là sống khỏe ru luôn đó, chuyên luôn nghe, chuyên môn luôn đó!"
- **Góc máy (Camera Motion):** `Static eye-level shot`
- **Hành động & Diễn hoạt cơ mặt (Action):** Maintains a bright, proud smile. The mouth opens wider for emphasis on 'khỏe ru'. When saying 'chuyên môn luôn đó!', the chin flicks upward sharply to punctuate the point, coordinating with the frozen hand gesture. The clip ends by freezing the entire frame into a static image of Chau's confident, smiling face.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > The final shot of Chau in the pink gaming chair with the frozen city background. The right hand remains in the same raised position. The mouth continues high-intensity lip-syncing. The expression evolves into one of extreme satisfaction and professional validation.


---

### Workflow 4: KOC Reaction 2 (Phản ánh anh bán bánh mì tốc độ trong xe hơi)
- **Tên file gốc:** `4.kocai-reaction_2.json`
- **Giọng đọc (Voice Node):** TuongVi
- **Nhân vật (Character Node):** Chau (Tham chiếu theo ảnh gốc)
- **Mô hình AI sử dụng (Scene Nodes):** Scene 0: Model=Veo 3.1 - Lite, Status=done, Scene 1: Model=Veo 3.1 - Lite, Status=done, Scene 2: Model=Veo 3.1 - Lite, Status=done

#### Kịch bản & Prompt Kỹ thuật (Script Section #1)
- **Loại kịch bản:** `dialogue`
- **Tỉ lệ khung hình:** `9:16`
- **Số lượng phân cảnh (Shots):** `3`

**Cài đặt chung & System Prompt (Topic):**
```text
Cài đặt chung (General Settings)
Ảnh đầu vào: image_ca78c9.jpg (Cô gái mặc áo đen chữ V, đeo dây an toàn, ngồi trong xe hơi).

Chuyển động (Motion): Giữ tĩnh 100% (frozen/static) đối với bối cảnh phong cảnh ngoài cửa sổ xe, nội thất xe, tư thế cơ thể, bờ vai và phần dây an toàn vắt ngang người. Chỉ duy nhất các khối cơ mặt (mắt, miệng, lông mày) chuyển động nhép môi và biểu đạt cảm xúc theo lời thoại.

Cảnh 1: Bức xúc kiểu phụng phịu
Lời thoại chính xác: "Đề nghị cơ quan chức năng bắn tốc độ mấy anh bán bánh mì giùm tui cái. Cái gì mà vừa nghe bánh mì nóng giòn đây, chạy ra mất tiêu."

Prompt biểu cảm: Hai lông mày hơi chau lại nhẹ nhàng kiểu phụng phịu. Ánh mắt mở to tròn tỏ vẻ oan ức, hụt hẫng vì lỡ mất ổ bánh mì. Ở câu "chạy ra mất tiêu", khẩu hình miệng hơi chu ra hờn dỗi. (Nhắc lại: Thân người, bờ vai, dây an toàn và bối cảnh hoàn toàn bất động).

Cảnh 2: Lườm nguýt, mỉa mai xéo xắt
Lời thoại chính xác: "Anh bán mà anh sợ người ta mua. Anh bán mà anh sợ hết, thôi anh ở nhà đi. Tự nhiên mới bánh mì nóng giòn đây chạy ra ổng đi đâu mất tiêu."

Prompt biểu cảm: Ánh mắt chuyển sang liếc xéo sắc sảo, lườm nguýt sang một bên. Khóe miệng hơi nhếch lên, bĩu môi chê bai cực kỳ "thái độ" ở câu "thôi anh ở nhà đi". Sau đó quay lại nhìn thẳng ống kính với vẻ mặt ngơ ngác, bất lực xen lẫn khó hiểu. (Nhắc lại: Thân người, bờ vai, dây an toàn và bối cảnh hoàn toàn bất động).

Cảnh 3: Dặn dò kiểu "công chúa"
Lời thoại chính xác: "Ông đi thì ông đi từ từ, ông đi chậm rãi ông đợi coi có ai ăn người ta ra người ta mua người ta ủng hộ. Chạy gì mà quá chạy à. Thiệt tình luôn á. Lần này thôi nha, lần sau đi từ từ giùm tui."

Prompt biểu cảm: Nét mặt ra vẻ nhẫn nhịn, hai mắt nhắm tịt lại một giây phối hợp với khẩu hình miệng thở dài ở câu "Thiệt tình luôn á". Đến câu chốt "Lần này thôi nha", mở to mắt, trừng mắt lườm cảnh cáo nhẹ một cái nhưng biểu cảm vẫn toát lên vẻ đáng yêu, hài hước. (Nhắc lại: Thân người, bờ vai, dây an toàn và bối cảnh hoàn toàn bất động).
```

**Phân cảnh chi tiết từng Shot (Shots Breakdown):**

##### Shot 1
- **Lời thoại (Dialogue tiếng Việt):** "Đề nghị cơ quan chức năng bắn tốc độ mấy anh bán bánh mì giùm tui cái. Cái gì mà vừa nghe bánh mì nóng giòn đây, chạy ra mất tiêu."
- **Góc máy (Camera Motion):** `Static`
- **Hành động & Diễn hoạt cơ mặt (Action):** Lip-syncing to the dialogue with expressive facial movements while the body and environment remain completely motionless.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Cinematic close-up of a young woman in a black V-neck shirt wearing a seatbelt inside a car, based on image_ca78c9.jpg. The entire background, car interior, her torso, shoulders, and seatbelt are 100% frozen and static. Only facial muscles move. Her eyebrows are slightly furrowed in a cute pout. Her eyes are wide with a sense of disappointment and hangups. At the end of the line, her mouth pouts petulantly.

##### Shot 2
- **Lời thoại (Dialogue tiếng Việt):** "Anh bán mà anh sợ người ta mua. Anh bán mà anh sợ hết, thôi anh ở nhà đi. Tự nhiên mới bánh mì nóng giòn đây chạy ra ổng đi đâu mất tiêu."
- **Góc máy (Camera Motion):** `Static`
- **Hành động & Diễn hoạt cơ mặt (Action):** Lip-syncing with sharp, sassy facial expressions and eye rolls; torso and background are perfectly still.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Same static setting as shot 1 with the body and car interior completely frozen. The woman's expression shifts to a sharp side-eye and a sarcastic glare. She curls the corner of her mouth and performs a cynical pout during the middle of the line. She then returns to looking directly at the camera with a confused and helpless expression.

##### Shot 3
- **Lời thoại (Dialogue tiếng Việt):** "Ông đi thì ông đi từ từ, ông đi chậm rãi ông đợi coi có ai ăn người ta ra người ta mua người ta ủng hộ. Chạy gì mà quá chạy à. Thiệt tình luôn á. Lần này thôi nha, lần sau đi từ từ giùm tui."
- **Góc máy (Camera Motion):** `Static`
- **Hành động & Diễn hoạt cơ mặt (Action):** Lip-syncing with dramatic facial expressions including closing eyes and a playful warning glare; body remains frozen.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Same static setting as shot 1. The woman adopts a patient, 'princess-like' lecturing tone. She closes her eyes tightly for a second and sighs with her mouth. For the final warning, she opens her eyes wide and gives a light, humorous glare toward the camera. Her body, shoulders, and the seatbelt remain entirely immobilized.


---

### Workflow 5: Cosplay Nami One Piece (Biến hình nhà sách & kêu gọi tương tác)
- **Tên file gốc:** `5.cosplay_nami.json`
- **Giọng đọc (Voice Node):** TuongVi
- **Nhân vật (Character Node):** Chau (Mô tả nhân vật...), Chau (Tham chiếu theo ảnh gốc)
- **Mô hình AI sử dụng (Scene Nodes):** Scene 0: Model=Omni 1.1 Flash, Status=done, Scene 1: Model=Veo 3.1 - Lite, Status=done, Scene 2: Model=Veo 3.1 - Lite, Status=done

#### Kịch bản & Prompt Kỹ thuật (Script Section #1)
- **Loại kịch bản:** `dialogue`
- **Tỉ lệ khung hình:** `9:16`
- **Số lượng phân cảnh (Shots):** `3`

**Cài đặt chung & System Prompt (Topic):**
```text
Cài đặt chung (General Settings)
Giữ tĩnh 100% (frozen/static) đối với bối cảnh nhà sách, áo thun trắng, quần jean và khóa chặt tuyệt đối tư thế tay trái đút túi quần, tay phải giữ quai túi xách (áp dụng cho ảnh gốc 2026-09-07_16-10-28.jpg). Để tạo cú "biến hình" mượt mà, anh cần chuẩn bị thêm một bức ảnh đã được AI chuyển đổi sang phong cách Nami (tóc cam, trang phục đặc trưng) nhưng bắt buộc phải giữ khớp 100% dáng pose và bối cảnh của ảnh gốc. Lệnh ưu tiên: Khẩu hình miệng nhép liên tục, lém lỉnh, lật mặt tấu hài. Tuyệt đối không chèn phụ đề.

Cảnh 1: Lên cơn "vã" idol (0:00 - 0:06) - Dùng ảnh gốc

Thoại tự biên: "Ê mấy bà, tự nhiên dạo này cày One Piece xong cái tôi bị u mê bà Nami không lối thoát luôn á! Xinh mà mỏ hỗn y chang tôi."

Prompt biểu cảm & Khẩu hình: Mở đầu với ánh mắt lơ đãng nhìn sang hướng khác y hệt ảnh gốc. Vừa cất tiếng "Ê mấy bà", ánh mắt lập tức giật bắn, liếc sắc lẹm nhìn thẳng vào ống kính. Hai lông mày nhướn lên hóng hớt. Tới cụm "u mê", hai má phồng nhẹ, mỏ chu ra nũng nịu (cute pout). Chữ chốt "y chang tôi", nhếch mép cười khẩy (smirk) vô cùng tự luyến.

Hiệu ứng chuyển cảnh (Transition): Mắt nhìn thẳng, khóe môi giữ nụ cười tự mãn. Sử dụng hiệu ứng chớp lóa (Flash) hoặc Glitch nhanh để chuyển sang Cảnh 2.

Cảnh 2: Biến hình "Hoa tiêu Mũ Rơm" (0:07 - 0:13) - Dùng ảnh Cosplay Nami

Thoại tự biên: "Nên là nay tôi quyết định chơi lớn, biến hình cosplay 'chị đẹp' cho mấy bà lác mắt chơi! Tèn ten... sao? Tóc cam, eo thon chuẩn hoa tiêu chưa?"

Trạng thái bắt đầu: Xuất hiện trong diện mạo Nami với nụ cười đắc ý.

Prompt biểu cảm & Khẩu hình: Vừa xuất hiện đã cười toe toét khoe răng rạng rỡ. Tới cụm "lác mắt chơi", chun mũi (scrunch nose) lém lỉnh tấu hài. Ở câu hỏi "chuẩn hoa tiêu chưa", cằm hất nhẹ lên kiêu kỳ, hai mắt chớp chớp liên tục thả thính lố lăng.

Điểm nối (Seamless): Đầu hất nhẹ, nụ cười tự tin lúng liếng.

Cảnh 3: Đòi điểm trắng trợn (0:14 - Hết) - Tiếp tục dùng ảnh Cosplay Nami

Thoại tự biên: "Nhìn mlem mlem uy tín cỡ này thì xứng đáng mấy điểm đây hả? Đánh giá công tâm coi, không được 10 điểm là dỗi ngang á nha, bình luận lẹ lên!"

Trạng thái bắt đầu: Khớp 100% với điểm nối Cảnh 2.

Prompt biểu cảm & Khẩu hình: Miệng nhép điệu đà chữ "mlem mlem". Nghe tới vụ "mấy điểm", hai lông mày xô lại giả vờ đe dọa, mắt trợn tròn lên. Đến chữ "dỗi ngang", môi dưới trề ra thật dài ăn vạ. Câu chốt "bình luận lẹ lên", cơ mặt giãn ra, nháy mắt (wink) một cái cực ngọt kết hợp nụ cười tươi rói. Giữ nguyên trạng thái tĩnh (frozen) với cái nháy mắt quyến rũ này (hai tay vẫn khóa chặt tư thế ban đầu) để khép lại video.
```

**Phân cảnh chi tiết từng Shot (Shots Breakdown):**

##### Shot 1
- **Lời thoại (Dialogue tiếng Việt):** "Ê mấy bà, tự nhiên dạo này cày One Piece xong cái tôi bị u mê bà Nami không lối thoát luôn á! Xinh mà mỏ hỗn y chang tôi."
- **Góc máy (Camera Motion):** `Static camera, locked position.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Start with eyes looking away from the camera. At the first word, eyes snap sharply to look directly at the lens. Eyebrows lift in a gossiping manner. At the word 'u mê', perform a cute pout with slightly puffed cheeks. End the sentence with a self-satisfied smirk and a slight tilt of the chin.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Cinematic portrait of a young woman named Chau in a bookstore. She is wearing a plain white T-shirt and blue jeans. Her left hand is tucked firmly into her pants pocket, and her right hand is holding the strap of her handbag. The bookstore background is warm and static. High-quality textures, 8k resolution, realistic lighting. The body and arms remain 100% frozen in this pose.

##### Shot 2
- **Lời thoại (Dialogue tiếng Việt):** "Nên là nay tôi quyết định chơi lớn, biến hình cosplay 'chị đẹp' cho mấy bà lác mắt chơi! Tèn ten... sao? Tóc cam, eo thon chuẩn hoa tiêu chưa?"
- **Góc máy (Camera Motion):** `Static camera, locked position.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Begins with a wide, radiant smile showing teeth. When saying 'lác mắt chơi', she performs a mischievous nose scrunch. For the final question, she tilts her head slightly, blinking her eyes repeatedly in a playful, flirtatious manner while keeping her body frozen.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Seamless transition using a flash/glitch effect. The character Chau is now transformed into Nami from One Piece. She has long vibrant orange hair and wears a signature bikini top with jeans. The bookstore background, the pose (left hand in pocket, right hand on bag strap), and her position remain 100% identical to the previous shot. Static background, cinematic lighting.

##### Shot 3
- **Lời thoại (Dialogue tiếng Việt):** "Nhìn mlem mlem uy tín cỡ này thì xứng đáng mấy điểm đây hả? Đánh giá công tâm coi, không được 10 điểm là dỗi ngang á nha, bình luận lẹ lên!"
- **Góc máy (Camera Motion):** `Static camera, locked position.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Exaggerated lip-sync for 'mlem mlem'. On the words 'mấy điểm', eyebrows furrow into a mock-threatening glare with widened eyes. On 'dỗi ngang', the bottom lip protrudes significantly in a childish pout. Finishes with a bright, charming wink and a big smile. The video freezes on this final wink.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Continuation of the Nami cosplay shot in the bookstore. Static environment, frozen body pose with left hand in pocket and right hand on bag strap. Focus on facial expressions and exaggerated lip-syncing. Professional color grading, sharp focus on facial features.

#### Kịch bản & Prompt Kỹ thuật (Script Section #2)
- **Loại kịch bản:** `dialogue`
- **Tỉ lệ khung hình:** `9:16`
- **Số lượng phân cảnh (Shots):** `3`

**Cài đặt chung & System Prompt (Topic):**
```text
Cài đặt chung (General Settings)Ảnh đầu vào: image_f48cbd.jpg   Chuyển động (Motion): Giữ tĩnh 100% (frozen/static) đối với bối cảnh nhà sách có các kệ sách bằng gỗ phía sau, mái tóc màu cam nổi bật, áo croptop sọc ngang xanh trắng, quần jeans, thắt lưng da, móc khóa và hình xăm trên vai trái. Khóa chặt tuyệt đối (Absolute freeze): Cánh tay phải đang khoác túi xách da màu nâu, bàn tay trái đang móc hờ vào túi quần. Chỉ duy nhất các khối cơ mặt (mắt, miệng, lông mày) chuyển động nhép môi và biểu đạt cảm xúc một cách tự nhiên, rạng rỡ, thu hút. Tuyệt đối không chèn phụ đề.   Cảnh 1: Lời chào sân nhẹ nhàng (0:00 - 0:06)Lời thoại chính xác: "Mấy bà dạo này hay chê tui ngoan hiền, bánh bèo quá đúng không? Nhìn lộn người rồi nha!"Prompt biểu cảm: Ánh mắt nhìn thẳng trực diện một cách tự nhiên, chớp nhẹ nhàng. Lông mày giữ ở mức ổn định, chỉ dướn lên một chút xíu khi hỏi "đúng không?". Khẩu hình miệng nhép chữ rõ ràng, từ tốn. Khóe môi mỉm cười nhẹ đầy tự tin và thân thiện ở câu chốt (không lườm nguýt hay nhếch mép).(Nhắc lại: Thân người, tay phải khoác túi xách, tay trái móc túi quần, tóc cam, áo sọc, hình xăm và bối cảnh nhà sách hoàn toàn bất động).Cảnh 2: Trình làng diện mạo "Hoa tiêu" (0:07 - 0:13)Lời thoại chính xác: "Nên là nay tôi quyết định chơi lớn, biến hình cosplay 'chị đẹp' cho mấy bà lác mắt chơi! Tèn ten... sao? Tóc cam, eo thon chuẩn hoa tiêu chưa?"Prompt biểu cảm: Ánh mắt mở to hơn một chút thể hiện sự hào hứng và vui vẻ. Nhịp nhép môi đều đặn, tươi tắn. Khi đọc cụm "Tèn ten... sao?", nụ cười nở rộng hơn một cách tự nhiên, ánh mắt lấp lánh duyên dáng, truyền tải sự quyến rũ nhẹ nhàng (không chu môi hay biểu cảm lố).(Nhắc lại: Thân người, tay phải khoác túi xách, tay trái móc túi quần, tóc cam, áo sọc, hình xăm và bối cảnh nhà sách hoàn toàn bất động).Cảnh 3: Kêu gọi tương tác duyên dáng (0:14 - Hết)Lời thoại chính xác: "Nhìn mlem mlem uy tín cỡ này thì xứng đáng mấy điểm đây hả? Đánh giá công tâm coi, không được 10 điểm là dỗi ngang á nha, bình luận lẹ lên!"Prompt biểu cảm: Trạng thái ánh mắt mang chút trêu đùa nhẹ nhàng. Khi nói từ "dỗi ngang", môi hơi mím lại hoặc trề ra một xíu thôi để tạo sự đáng yêu, chớp mắt từ tốn. Đến câu chốt "bình luận lẹ lên", cơ mặt giãn ra hoàn toàn, nở một nụ cười rạng rỡ, trong sáng. Giữ nguyên nụ cười tĩnh (frozen) thân thiện này để khép lại video.(Nhắc lại: Thân người, tay phải khoác túi xách, tay trái móc túi quần, tóc cam, áo sọc, hình xăm và bối cảnh nhà sách hoàn toàn bất động).
```

**Phân cảnh chi tiết từng Shot (Shots Breakdown):**

##### Shot 1
- **Lời thoại (Dialogue tiếng Việt):** "Mấy bà dạo này hay chê tui ngoan hiền, bánh bèo quá đúng không? Nhìn lộn người rồi nha!"
- **Góc máy (Camera Motion):** `Absolute fixed camera, no movement.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Chau looks directly at the lens with a natural gaze and gentle blinks. Eyebrows remain stable, only slightly arching when asking the question. Lips move precisely to the dialogue. She ends the shot with a confident, friendly, and subtle smile without any head movement.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Cinematic medium shot of Chau in a bookstore. She has vibrant orange hair, wearing a blue and white horizontal striped crop top, blue jeans, a leather belt, and a visible tattoo on her left shoulder. The background features static wooden bookshelves with soft cinematic lighting. Her right arm is carrying a brown leather bag, and her left hand is hooked into her pants pocket. The entire body, clothing, hair, and background are 100% frozen and static. Only the facial muscles move.

##### Shot 2
- **Lời thoại (Dialogue tiếng Việt):** "Nên là nay tôi quyết định chơi lớn, biến hình cosplay 'chị đẹp' cho mấy bà lác mắt chơi! Tèn ten... sao? Tóc cam, eo thon chuẩn hoa tiêu chưa?"
- **Góc máy (Camera Motion):** `Absolute fixed camera, no movement.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Chau's eyes widen slightly to express excitement and joy. Lip-syncing is rhythmic and bright. During the phrase 'Tèn ten... sao?', her smile widens naturally and her eyes sparkle with charm and elegance. The rest of her body remains perfectly still.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Continuation of the previous scene in the bookstore. Chau's posture remains identical: orange hair, striped crop top, right arm with bag, left hand in pocket. The wooden bookshelves and her body are completely locked and frozen. High-quality lighting highlights the orange hair and facial features. Facial animation only.

##### Shot 3
- **Lời thoại (Dialogue tiếng Việt):** "Nhìn mlem mlem uy tín cỡ này thì xứng đáng mấy điểm đây hả? Đánh giá công tâm coi, không được 10 điểm là dỗi ngang á nha, bình luận lẹ lên!"
- **Góc máy (Camera Motion):** `Absolute fixed camera, no movement.`
- **Hành động & Diễn hoạt cơ mặt (Action):** Chau displays a playful and teasing expression. She pouts very slightly on the words 'dỗi ngang' for a cute effect while blinking slowly. For the final sentence, her facial muscles relax into a radiant, pure smile. The video concludes on this frozen, friendly smiling expression.
- **Visual Prompt (Prompt tiếng Anh cho AI Video):**
  > Final cinematic shot of Chau in the same frozen bookstore setting. The character's pose, the leather bag, the tattoo, and the environment are entirely static. The focus is exclusively on the expressive movement of the eyes, eyebrows, and mouth for the call to action.


---

## PHẦN 3: HƯỚNG DẪN ĐƯA VÀO VÀ KHAI THÁC TRÊN NOTEBOOKLM

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
