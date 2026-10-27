import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "1100px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Hướng Dẫn Sử Dụng KOC Prompt Studio
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6" }}>
          Bộ công cụ giúp bạn tạo prompt điện ảnh chuẩn 8K, loại bỏ triệt để &quot;chất nhựa AI&quot; (da sáp, mắt vô hồn) và thiết kế bố cục ảnh ghép đa khung hình (Idol Photocard, Vogue Triptych) khóa mặt nhân vật 100%.
        </p>
      </div>

      {/* Quick Access Action Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>🎯</div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>Master Prompt Studio (9 Tầng)</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13.5px", lineHeight: "1.5", marginBottom: "16px" }}>
              Kiến tạo Master Prompt 9 tầng chuẩn Hollywood, tích hợp sẵn Khử Nhựa AI ở tầng 9, ngân hàng từ khóa sâu và phân tích tương thích quang học.
            </p>
          </div>
          <Link href="/prompt-builder" className="btn btn-primary" style={{ width: "100%", textAlign: "center" }}>
            Vào Master Prompt Studio →
          </Link>
        </div>


        <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>🍱</div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>Tạo Bố Cục Ghép Ảnh (JSON Collage)</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13.5px", lineHeight: "1.5", marginBottom: "16px" }}>
              Tạo cấu trúc JSON sinh ảnh lưới 9 ô Idol Photocard, 3 khung dọc Vogue hoặc 4 ảnh streetwear. Đảm bảo cùng 1 người và trang phục trên mọi khung hình.
            </p>
          </div>
          <Link href="/collage" className="btn btn-secondary" style={{ width: "100%", textAlign: "center" }}>
            Vào Trình Tạo Collage →
          </Link>
        </div>
      </div>

      {/* Detailed User Guides */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800 }}>📖 Hướng Dẫn Từng Bước Sử Dụng Ứng Dụng</h2>

        {/* Section 1: 8-Layer Prompt Builder */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>🎯</span>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>1. Cách Tạo Prompt 8 Tầng &amp; Khử &quot;Chất Nhựa AI&quot;</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", lineHeight: "1.6" }}>
            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                1
              </div>
              <div>
                <strong>Chọn Mẫu Có Sẵn hoặc Nhập Mô Tả:</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Tại thanh trên cùng, bạn có thể click chọn nhanh 1 trong 4 phong cách: <em>Thời trang đường phố Gen Z</em>, <em>Mỹ phẩm Skincare</em>, <em>Thể thao năng động</em> hoặc <em>Nữ công sở</em>.
                  Bạn cũng có thể tự gõ mô tả tiếng Việt vào từng tầng (Nhân vật, Khuôn mặt, Trang phục, Dáng chụp, Bối cảnh, Ánh sáng, Góc máy).
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                2
              </div>
              <div>
                <strong>Dịch Thuật &amp; Thêm Từ Khóa Nhiếp Ảnh:</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Bấm nút <strong>&quot;⚡ Dịch sang EN&quot;</strong> hoặc click vào các thẻ từ khóa gợi ý (như <em>Cận cảnh trung bình</em>, <em>Ống kính 85mm f/1.4</em>, <em>Ánh sáng giờ vàng</em>).
                  Hệ thống tự động biên dịch sang thuật ngữ máy ảnh chuyên nghiệp mà mô hình AI hiểu tốt nhất.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                3
              </div>
              <div>
                <strong>Bật Chế Độ Khử Nhựa AI (Realism Fixer Pro):</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Gạt bật công tắc <strong>&quot;Khử Nhựa AI&quot;</strong>. Hệ thống sẽ tự động chèn các thông số:
                  <br />• <em>Da thật:</em> Lỗ chân lông li ti, vân da tự nhiên, chất ảnh RAW.
                  <br />• <em>Khối mặt 3D:</em> Ánh sáng butterfly lighting và highlight trên sống mũi, gò má.
                  <br />• <em>Mắt có hồn:</em> Phản quang (catchlights) tự nhiên, tròng mắt rõ nét.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                4
              </div>
              <div>
                <strong>Theo Dõi Chỉ Số Chân Thực (Realism Score):</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Đồng hồ đo bên phải sẽ chấm điểm từ 0% đến 100%. Nếu phát hiện thiếu tầng ánh sáng hoặc kết cấu da, bạn chỉ cần bấm nút <strong>&quot;Khắc phục nhanh&quot;</strong> để tối ưu ngay lập tức.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>
                5
              </div>
              <div>
                <strong>Copy Câu Lệnh Sử Dụng:</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Nhấn <strong>&quot;Copy Prompt&quot;</strong> để dán vào Flux/Google Flow/SeaArt, hoặc nhấn <strong>&quot;Midjourney Format&quot;</strong> để nhận câu lệnh kèm tham số chuẩn (<code>--ar 2:3 --style raw --no ...</code>).
                  Nhấn <strong>&quot;Lưu Lại&quot;</strong> để cất vào thư viện cá nhân.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: JSON Collage Generator */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>🍱</span>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>2. Cách Tạo Bố Cục Ghép Ảnh Đa Khung Hình (JSON Collage)</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", lineHeight: "1.6" }}>
            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, color: "#000" }}>
                1
              </div>
              <div>
                <strong>Chọn Kiểu Lưới &amp; Mẫu Thiết Kế:</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Chọn bố cục mong muốn: <em>Lưới 3x3</em> (Idol Photocard 9 ô dọc), <em>Triptych</em> (Bộ 3 ảnh dọc tạp chí thời trang) hoặc <em>Lưới 2x2</em> (4 ảnh thời trang đường phố).
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, color: "#000" }}>
                2
              </div>
              <div>
                <strong>Bật Khóa Bản Sắc Nhân Vật (Identity Lock 100%):</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Giữ công tắc khóa bật sáng để bắt buộc mô hình AI giữ nguyên 100% diện mạo khuôn mặt, màu da, kiểu tóc và cùng 1 bộ trang phục xuyên suốt mọi ô ảnh, tránh hiện tượng mỗi ô là một người khác nhau.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, color: "#000" }}>
                3
              </div>
              <div>
                <strong>Chỉ Đạo Từng Ô Ảnh (Panel Director):</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Click trực tiếp vào ô bất kỳ trên mô hình lưới. Bạn có thể chọn nhanh góc máy (Cận cảnh mắt, Nửa thân, Toàn thân...), thần thái (Cười ngọt ngào, Nháy mắt, Quyến rũ...) và hướng nhìn (Nhìn thẳng, Ngoái nhìn qua vai...).
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, color: "#000" }}>
                4
              </div>
              <div>
                <strong>Copy Mã JSON Chuẩn Xác:</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                  Cột bên phải hiển thị mã JSON đã được kiểm tra tính hợp lệ. Nhấn nút <strong>&quot;📋 Copy JSON (1-Click)&quot;</strong> để copy và dán thẳng vào ChatGPT, Midjourney v6, Flux hoặc Google AI Studio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Library & Storage */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>📚</span>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>3. Quản Lý Trong Thư Viện Cá Nhân</h3>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
            Mọi prompt và mẫu JSON sau khi nhấn &quot;Lưu Lại&quot; sẽ nằm trong mục <strong>&quot;Thư Viện Đã Lưu&quot;</strong>. Bạn có thể tìm kiếm theo từ khóa, lọc theo danh mục, đánh dấu yêu thích (⭐) để dùng lại nhiều lần, hoặc copy nhanh chỉ với một cú nhấp chuột.
          </p>
        </div>
      </div>
    </div>
  );
}
