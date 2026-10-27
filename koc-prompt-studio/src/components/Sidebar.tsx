"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Hướng Dẫn Sử Dụng",
      icon: "📖",
      desc: "Tổng quan & cách dùng",
    },
    {
      href: "/prompt-builder",
      label: "Master Prompt Studio",
      icon: "🎯",
      desc: "Kiến trúc 9 tầng điện ảnh",
      badge: "HOT",
    },
    {
      href: "/collage",
      label: "Tạo Bố Cục Collage",
      icon: "🍱",
      desc: "Idol 3x3, Vogue Triptych",
    },
    {
      href: "/library",
      label: "Thư Viện Đã Lưu",
      icon: "📚",
      desc: "Kho prompt cá nhân",
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-header">
        <Link href="/" className="mobile-brand">
          <div className="brand-logo">⚡</div>
          <span style={{ fontWeight: 800, fontSize: "16px" }}>KOC Prompt Studio</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn btn-secondary btn-sm"
          style={{ padding: "6px 12px" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕ Đóng" : "☰ Menu"}
        </button>
      </div>

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <Link href="/" className="brand" onClick={() => setMobileOpen(false)}>
          <div className="brand-logo">⚡</div>
          <div className="brand-text">
            <h1>KOC Prompt Studio</h1>
            <span>Thiết kế Prompt &amp; Collage</span>
          </div>
        </Link>

        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: isActive ? 700 : 500, fontSize: "14px" }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "1px 6px",
                          borderRadius: "999px",
                          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                          color: "#fff",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "1px" }}>
                    {item.desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Tools & Tips Box */}
        <div
          style={{
            marginTop: "auto",
            padding: "14px",
            borderRadius: "var(--radius-md)",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-color)",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px #10b981",
              }}
            ></span>
            <span style={{ color: "#f3f4f6", fontWeight: 700, fontSize: "12px" }}>
              Hệ thống hoạt động
            </span>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "11px", lineHeight: "1.5" }}>
            Midjourney • Flux • Google Flow
            <br />
            Khử nhựa AI tự động 100%.
          </p>
        </div>
      </aside>
    </>
  );
}
