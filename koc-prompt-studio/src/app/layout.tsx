import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "KOC Prompt Studio – Thiết Kế Prompt Điện Ảnh & Bố Cục Collage",
  description:
    "Công cụ thiết kế prompt 8 tầng khử nhựa AI và tạo bố cục JSON Collage Korean Idol, Vogue Triptych chuyên nghiệp cho KOC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <div className="app-container">
          <Sidebar />

          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
