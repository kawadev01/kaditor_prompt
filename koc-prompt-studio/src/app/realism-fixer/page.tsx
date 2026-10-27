"use client";

import React, { useState, useMemo } from "react";
import {
  REALISM_GROUPS,
  type RealismGroupId,
  diagnosePromptRealism,
  fixRawPromptWithRealism,
} from "@/lib/prompt-engine/realism";
import { saveLocalPrompt } from "@/lib/storage";

const ASPECT_RATIOS = [
  { id: "16:9", label: "16:9", desc: "YouTube / Video ngang" },
  { id: "9:16", label: "9:16", desc: "TikTok / Reels / Story" },
  { id: "4:5", label: "4:5", desc: "Instagram Portrait" },
  { id: "1:1", label: "1:1", desc: "Vuông / Facebook" },
];

const PRESET_PROFILES: {
  id: string;
  name: string;
  desc: string;
  groups: RealismGroupId[];
}[] = [
  {
    id: "beauty",
    name: "🌸 KOC Skincare & Da Thật",
    desc: "Bơm lỗ chân lông siêu nhỏ, mắt có hồn, má hồng tự nhiên, ánh sáng butterfly",
    groups: ["skin", "eyes", "cheeks", "light3d"],
  },
  {
    id: "cinematic",
    name: "🎬 Điện Ảnh Hollywood 35mm",
    desc: "Khối mặt 3D, ánh sáng khuếch tán không bóng gắt, cảm biến máy ảnh cơ 85mm f/1.4",
    groups: ["skin", "light3d", "diffused", "camera_raw"],
  },
  {
    id: "editorial",
    name: "📸 Lookbook Tạp Chí Vogue",
    desc: "Chất ảnh RAW nguyên bản, phản quang mống mắt sâu, khối mặt sắc nét",
    groups: ["skin", "light3d", "eyes", "camera_raw"],
  },
  {
    id: "maximum",
    name: "⭐ Khử Nhựa Toàn Diện (Max 100%)",
    desc: "Kích hoạt trọn vẹn cả 6 lớp công nghệ khử nhựa tiên tiến nhất",
    groups: ["skin", "light3d", "eyes", "cheeks", "diffused", "camera_raw"],
  },
];

const SAMPLE_PROMPTS = [
  {
    label: "⚠️ Prompt dễ dính 'da nhựa' (Cần khử)",
    text: "A beautiful 22-year-old Vietnamese girl in a modern cafe, smooth skin, flawless face, smiling, 8k resolution",
  },
  {
    label: "🧴 KOC Skincare thử mỹ phẩm",
    text: "A 24-year-old Vietnamese woman holding a glass serum dropper bottle next to her cheek in a bright minimalist bathroom",
  },
  {
    label: "🏮 Áo dài thiếu nữ Hội An",
    text: "A stunning Vietnamese young woman wearing traditional white silk ao dai standing in Hoi An ancient town at sunset",
  },
  {
    label: "🛹 Gen Z Streetwear phố đêm",
    text: "A trendy Vietnamese Gen Z female creator wearing denim crop top and baggy jeans standing against city night lights",
  },
];

export default function RealismFixerPage() {
  const [inputPrompt, setInputPrompt] = useState<string>(
    "A beautiful 22-year-old Vietnamese girl in a modern cafe, smooth skin, flawless face, smiling, 8k resolution"
  );
  const [enabledGroups, setEnabledGroups] = useState<RealismGroupId[]>([
    "skin",
    "light3d",
    "eyes",
    "cheeks",
    "diffused",
    "camera_raw",
  ]);
  const [activeProfile, setActiveProfile] = useState<string>("maximum");
  const [negativePersona, setNegativePersona] = useState(true);
  const [selectedAspect, setSelectedAspect] = useState("16:9");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Realtime Diagnosis of input prompt
  const diagnosis = useMemo(() => {
    return diagnosePromptRealism(inputPrompt);
  }, [inputPrompt]);

  // Realtime Fixed Output
  const fixed = useMemo(() => {
    return fixRawPromptWithRealism(inputPrompt, {
      enabledGroups,
      negativePersona,
      aspectRatio: selectedAspect,
    });
  }, [inputPrompt, enabledGroups, negativePersona, selectedAspect]);

  // Apply a profile
  const handleSelectProfile = (profId: string) => {
    setActiveProfile(profId);
    const prof = PRESET_PROFILES.find((p) => p.id === profId);
    if (prof) setEnabledGroups(prof.groups);
  };

  // Toggle single realism group
  const handleToggleGroup = (id: RealismGroupId) => {
    setActiveProfile("custom");
    setEnabledGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 1-Click Fix All Issues
  const handleAutoFix = () => {
    setEnabledGroups(["skin", "light3d", "eyes", "cheeks", "diffused", "camera_raw"]);
    setActiveProfile("maximum");
    setNegativePersona(true);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  // Save to Library
  const handleSave = () => {
    saveLocalPrompt({
      type: "layer8",
      title: `Realism Fixed: ${inputPrompt.slice(0, 35)}...`,
      input: {
        rawInput: inputPrompt,
        enabledGroups,
        negativePersona,
      },
      outputEn: fixed.fixedPrompt,
      outputVi: "Đã khử nhựa AI bằng Realism Fixer Pro",
      negative: fixed.negativePrompt,
      realismScore: 98,
      tags: ["realism-fixer", "anti-plastic"],
      favorite: false,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Studio Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>🛡️</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Khử Nhựa AI Studio (Realism Fixer Pro)
              </h1>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10b981, #06b6d4)",
                  color: "#fff",
                }}
              >
                CHUYÊN DỤNG
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "13.5px", marginTop: "2px" }}>
              Chẩn đoán và tiêm token khử sạch &quot;da sáp, mắt vô hồn, đổ bóng giả&quot; cho mọi câu lệnh Midjourney, Flux và Stable Diffusion.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Input & Diagnostic on Left, Output & Controls on Right */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "22px", alignItems: "start" }}>
        {/* ================= LEFT COLUMN: INPUT & DIAGNOSTIC ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Prompt Input Box */}
          <div className="card" style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                📥 Nhập hoặc Dán Prompt Cần Khử Nhựa:
              </label>
              <button
                type="button"
                onClick={() => setInputPrompt("")}
                className="btn btn-secondary btn-sm"
                style={{ padding: "2px 8px", fontSize: "11px", color: "#fb7185" }}
              >
                Xóa trắng
              </button>
            </div>

            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Dán bất kỳ prompt nào bạn tạo từ Midjourney, ChatGPT hoặc gõ mô tả vào đây..."
              className="textarea"
              style={{ minHeight: "100px", fontSize: "13px", lineHeight: "1.6" }}
            />

            {/* Quick Sample Prompts */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", paddingTop: "4px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 700 }}>THỬ MẪU:</span>
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputPrompt(sample.text)}
                  className="clean-quick-tag"
                  style={{ fontSize: "11px" }}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Inspector Card */}
          <div
            className="card"
            style={{
              padding: "18px",
              background: "rgba(18, 20, 30, 0.9)",
              border: `1px solid ${
                diagnosis.score >= 80
                  ? "rgba(16, 185, 129, 0.4)"
                  : diagnosis.score >= 50
                  ? "rgba(245, 158, 11, 0.4)"
                  : "rgba(244, 63, 94, 0.4)"
              }`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Báo Cáo Chẩn Đoán &quot;Độ Nhựa AI&quot;</h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {diagnosis.levelNameVi}
                </span>
              </div>

              <div
                className={`score-badge ${
                  diagnosis.score >= 80
                    ? "score-high"
                    : diagnosis.score >= 50
                    ? "score-medium"
                    : "score-low"
                }`}
              >
                {diagnosis.score}% Chân thực
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden", marginBottom: "14px" }}>
              <div
                style={{
                  height: "100%",
                  width: `${diagnosis.score}%`,
                  background:
                    diagnosis.score >= 80
                      ? "linear-gradient(90deg, #10b981, #34d399)"
                      : diagnosis.score >= 50
                      ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                      : "linear-gradient(90deg, #f43f5e, #fb7185)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Detected Issues */}
            {diagnosis.detectedIssues.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11.5px", color: "var(--text-dim)", fontWeight: 700 }}>
                    {diagnosis.detectedIssues.length} NGUY CƠ GÂY DA NHỰA ĐƯỢC PHÁT HIỆN:
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFix}
                    className="btn btn-outline-accent btn-sm"
                    style={{ padding: "2px 8px", fontSize: "11px", fontWeight: 700 }}
                  >
                    ⚡ Khử sạch tất cả (1-Click)
                  </button>
                </div>

                {diagnosis.detectedIssues.map((issue, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ color: issue.severity === "high" ? "#fb7185" : "#fbbf24", fontWeight: 700 }}>
                      • {issue.title}
                    </div>
                    <div style={{ color: "var(--text-muted)", marginTop: "2px", fontSize: "11.5px" }}>
                      {issue.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "#34d399", fontSize: "12.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>✓</span>
                <span>Tuyệt vời! Prompt này đã có đầy đủ các thông số da thật, mắt sống động và ánh sáng chuẩn điện ảnh.</span>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: FIXER INJECTIONS & OUTPUT ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Fixer Configuration Control Center */}
          <div className="card" style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#c4b5fd" }}>
              ⚙️ Cấu Hình Bộ Tiêm Khử Nhựa Đa Tầng
            </h3>

            {/* Profile Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-dim)", fontWeight: 700 }}>
                CHỌN PROFILE KHỬ NHỰA NHANH:
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {PRESET_PROFILES.map((prof) => {
                  const active = activeProfile === prof.id;
                  return (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => handleSelectProfile(prof.id)}
                      className={`chip ${active ? "active" : ""}`}
                      style={{
                        padding: "8px 10px",
                        fontSize: "11.5px",
                        fontWeight: active ? 700 : 500,
                        justifyContent: "flex-start",
                        borderRadius: "8px",
                      }}
                    >
                      {prof.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Injections Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "6px", borderTop: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "11.5px", color: "var(--text-dim)", fontWeight: 700 }}>
                CÁC TẦNG TOKEN ĐƯỢC TIÊM VÀO ({enabledGroups.length}/6):
              </span>

              {REALISM_GROUPS.map((g) => {
                const isChecked = enabledGroups.includes(g.id);
                return (
                  <label
                    key={g.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "6px 8px",
                      borderRadius: "6px",
                      background: isChecked ? "rgba(139, 92, 246, 0.08)" : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleGroup(g.id)}
                      style={{ marginTop: "2px" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: isChecked ? "#fff" : "var(--text-muted)" }}>
                        {g.nameVi}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                        {g.descVi}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Extra Controls: Negative & Aspect Ratio */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", paddingTop: "8px", borderTop: "1px solid var(--border-color)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={negativePersona}
                  onChange={(e) => setNegativePersona(e.target.checked)}
                />
                <span><strong>Negative chống tượng sáp</strong> (chống 3D, búp bê, cartoon)</span>
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "11.5px", color: "var(--text-dim)", fontWeight: 600 }}>Tỷ lệ:</span>
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setSelectedAspect(ar.id)}
                    className={`clean-aspect-btn ${selectedAspect === ar.id ? "active" : ""}`}
                    style={{ padding: "2px 7px", fontSize: "11px" }}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= CRISP OUTPUT STUDIO ================= */}
          <div
            className="card"
            style={{
              padding: "18px",
              background: "rgba(15, 17, 26, 0.95)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Prompt Sau Khi Khử Nhựa AI</h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#34d399",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  +{fixed.injectedCount} token điện ảnh
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "4px 10px", fontSize: "11.5px" }}
                >
                  {saveSuccess ? "✓ Đã Lưu!" : "💾 Lưu"}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(fixed.fluxPrompt, "flux")}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "4px 10px", fontSize: "11.5px" }}
                >
                  {copyStatus === "flux" ? "✓ Đã Copy Flux" : "Copy Flux/SD"}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(fixed.midjourneyPrompt, "mj")}
                  className="btn btn-primary btn-sm"
                  style={{ padding: "6px 14px", fontSize: "12.5px", fontWeight: 700 }}
                >
                  {copyStatus === "mj" ? "✓ Đã Copy Midjourney!" : `🎨 Copy Midjourney (${selectedAspect})`}
                </button>
              </div>
            </div>

            {/* Prompt Code View */}
            <div
              className="code-box"
              style={{
                maxHeight: "130px",
                fontSize: "12.5px",
                lineHeight: "1.6",
                background: "#08090d",
              }}
            >
              {fixed.midjourneyPrompt}
            </div>

            {/* Negative Prompt display */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "11px", color: "var(--text-dim)" }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <strong>Negative:</strong> {fixed.negativePrompt}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(fixed.negativePrompt, "neg")}
                className="btn btn-secondary btn-sm"
                style={{ padding: "2px 7px", fontSize: "10.5px", flexShrink: 0 }}
              >
                {copyStatus === "neg" ? "✓ Đã Copy" : "Copy Neg"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
