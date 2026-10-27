"use client";

import React, { useState, useMemo } from "react";
import {
  LAYOUTS,
  LAYOUT_LIST,
  type LayoutId,
  SHOT_TYPES,
  EXPRESSIONS,
  GAZES,
} from "@/lib/collage-engine/layouts";
import {
  type CollageState,
  validateCollageJson,
} from "@/lib/collage-engine/schema";
import {
  buildCollageJson,
  stringifyCollage,
  switchLayout,
} from "@/lib/collage-engine/build";
import { COLLAGE_PRESETS } from "@/data/collage-presets";
import { saveLocalPrompt } from "@/lib/storage";

export default function CollagePage() {
  const [state, setState] = useState<CollageState>(() => COLLAGE_PRESETS[0].state);
  const [activeSlotKey, setActiveSlotKey] = useState<string>("center");
  const [selectedPresetSlug, setSelectedPresetSlug] = useState<string | null>(COLLAGE_PRESETS[0].slug);
  const [copyStatus, setCopyStatus] = useState(false);
  const [copyCompactStatus, setCopyCompactStatus] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiBrief, setAiBrief] = useState("");

  const currentLayout = LAYOUTS[state.layoutId];

  // Generated JSON & Realtime Validation
  const jsonString = useMemo(() => {
    try {
      const json = buildCollageJson(state);
      return stringifyCollage(json);
    } catch {
      return "{}";
    }
  }, [state]);

  const compactJsonString = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(jsonString));
    } catch {
      return jsonString;
    }
  }, [jsonString]);

  const validation = useMemo(() => {
    return validateCollageJson(jsonString);
  }, [jsonString]);

  // Load Preset
  const handleLoadPreset = (slug: string) => {
    const p = COLLAGE_PRESETS.find((x) => x.slug === slug);
    if (!p) return;
    setState(structuredClone(p.state));
    setSelectedPresetSlug(slug);
    const firstKey = LAYOUTS[p.state.layoutId].slots[0]?.key || "center";
    setActiveSlotKey(firstKey);
  };

  // Change Layout
  const handleChangeLayout = (layoutId: LayoutId) => {
    const next = switchLayout(state, layoutId);
    setState(next);
    setSelectedPresetSlug(null);
    const firstKey = LAYOUTS[layoutId].slots[0]?.key || "";
    setActiveSlotKey(firstKey);
  };

  // Panel field updater
  const updateActivePanel = (field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      panels: {
        ...prev.panels,
        [activeSlotKey]: {
          ...prev.panels[activeSlotKey],
          [field]: value,
        },
      },
    }));
  };

  // 1-Click Copy Pretty JSON
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  // 1-Click Copy Compact JSON
  const handleCopyCompactJson = () => {
    navigator.clipboard.writeText(compactJsonString);
    setCopyCompactStatus(true);
    setTimeout(() => setCopyCompactStatus(false), 2000);
  };

  // Save to Library
  const handleSave = async () => {
    const title =
      state.projectName.trim() ||
      `${currentLayout.nameVi} - ${new Date().toLocaleDateString("vi-VN")}`;

    const payload = {
      type: "collage" as const,
      title,
      input: state,
      json: jsonString,
      tags: ["collage", state.layoutId],
      favorite: false,
    };

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) saveLocalPrompt(payload);
    } catch {
      saveLocalPrompt(payload);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // AI Fill-in
  const handleAiFill = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/collage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: aiBrief, state }),
      });
      const data = await res.json();
      if (res.ok && data.panels) {
        // Merge AI output
        setState((prev) => {
          const nextPanels = { ...prev.panels };
          for (const p of data.panels) {
            nextPanels[p.key] = {
              shot_type: p.shot_type || "",
              expression: p.expression || "",
              gaze: p.gaze || "",
              pose: p.pose || "",
              notes: p.notes || "",
            };
          }
          return {
            ...prev,
            subject: {
              ...prev.subject,
              identity: data.identity || prev.subject.identity,
              skin: data.skin || prev.subject.skin,
              makeup: data.makeup || prev.subject.makeup,
              hair: data.hair || prev.subject.hair,
            },
            wardrobe: {
              ...prev.wardrobe,
              style: data.wardrobeStyle || prev.wardrobe.style,
              outfit: data.outfit || prev.wardrobe.outfit,
              accessories: data.accessories || prev.wardrobe.accessories,
            },
            environment: {
              ...prev.environment,
              location: data.location || prev.environment.location,
              background: data.background || prev.environment.background,
            },
            lighting: {
              ...prev.lighting,
              type: data.lightingType || prev.lighting.type,
              characteristics: data.lightingCharacteristics || prev.lighting.characteristics,
            },
            mood: data.mood || prev.mood,
            panels: nextPanels,
          };
        });
      } else {
        alert(data.error || "Chưa cấu hình API Key AI (Gemini).");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert("Lỗi AI: " + msg);
    } finally {
      setAiLoading(false);
    }
  };

  const activePanel = state.panels[activeSlotKey] || {
    shot_type: "",
    expression: "",
    gaze: "",
    pose: "",
    notes: "",
  };

  const [showGuide, setShowGuide] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header and Preset Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800 }}>JSON Prompt &amp; Collage Layout Generator</h1>
            <button
              onClick={() => setShowGuide((prev) => !prev)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "12px", padding: "4px 10px" }}
            >
              {showGuide ? "✕ Đóng hướng dẫn" : "💡 Hướng dẫn nhanh"}
            </button>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Cấu trúc hóa JSON Prompt sinh ảnh ghép đa khung hình – Khóa mặt &amp; phong cách 100%.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "var(--text-dim)", fontWeight: 700 }}>PRESET ĐỘC QUYỀN:</span>
          {COLLAGE_PRESETS.map((p) => {
            const isSelected = selectedPresetSlug === p.slug;
            return (
              <button
                key={p.slug}
                onClick={() => handleLoadPreset(p.slug)}
                className={`chip ${isSelected ? "active" : ""}`}
                style={{
                  borderColor: isSelected ? "var(--accent-secondary)" : undefined,
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {p.emoji} {p.name} {isSelected && "✓"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsible Quick Guide */}
      {showGuide && (
        <div className="card" style={{ background: "rgba(18, 20, 32, 0.95)", borderColor: "var(--accent-secondary)", padding: "18px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px", color: "#67e8f9" }}>
            📖 Cách sử dụng Trình Tạo JSON Collage:
          </h3>
          <ol style={{ paddingLeft: "20px", fontSize: "13px", lineHeight: "1.6", color: "var(--text-muted)" }}>
            <li><strong>Chọn bố cục lưới:</strong> Chọn Lưới 3x3 (Idol Photocard 9:16), Triptych (3 ảnh dọc Vogue) hoặc Lưới 2x2.</li>
            <li><strong>Khóa bản sắc nhân vật:</strong> Giữ công tắc <em>&quot;Khóa Bản Sắc Nhân Vật&quot;</em> bật để cùng 1 người &amp; cùng trang phục trên mọi ô.</li>
            <li><strong>Chỉ đạo từng ô ảnh:</strong> Click trực tiếp vào ô vuông trên mô hình lưới, sau đó chọn góc máy, biểu cảm và hướng nhìn.</li>
            <li><strong>Copy mã JSON:</strong> Nhấn <em>&quot;Copy JSON&quot;</em> hoặc <em>&quot;Copy 1 dòng&quot;</em> ở cột bên phải để dán vào ChatGPT / Midjourney v6 / Flux.</li>
          </ol>
        </div>
      )}

      {/* Layout Selector Bar */}
      <div className="card" style={{ padding: "16px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-dim)", marginBottom: "10px" }}>
          CHỌN BỐ CỤC LƯỚI KHUNG HÌNH (GRID LAYOUT):
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {LAYOUT_LIST.map((l) => {
            const isSelected = state.layoutId === l.id;
            return (
              <div
                key={l.id}
                onClick={() => handleChangeLayout(l.id)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid",
                  borderColor: isSelected ? "var(--accent-secondary)" : "var(--border-color)",
                  background: isSelected ? "rgba(6, 182, 212, 0.12)" : "rgba(255, 255, 255, 0.02)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: isSelected ? "#fff" : "var(--text-main)" }}>
                    {l.nameVi} {isSelected && "✓"}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--accent-secondary)", fontFamily: "var(--font-mono)" }}>
                    {l.aspectRatio}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{l.descVi}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Area: Left (Interactive Visual Grid + Slot Director) & Right (JSON Inspector) */}
      <div className="studio-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Identity Lock Settings */}
          <div className="card" style={{ background: "rgba(18, 20, 32, 0.8)", borderColor: "rgba(6, 182, 212, 0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>🔒</span>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Khóa Bản Sắc Nhân Vật (Identity Lock 100%)</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Đảm bảo cùng một người và cùng trang phục xuyên suốt mọi ô ảnh
                  </p>
                </div>
              </div>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={state.subject.identityLock}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      subject: { ...prev.subject, identityLock: e.target.checked },
                    }))
                  }
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  Mô tả nhân vật (Subject):
                </label>
                <input
                  type="text"
                  value={state.subject.identity}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      subject: { ...prev.subject, identity: e.target.value },
                    }))
                  }
                  className="input"
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  Trang phục chung (Wardrobe):
                </label>
                <input
                  type="text"
                  value={state.wardrobe.outfit}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      wardrobe: { ...prev.wardrobe, outfit: e.target.value },
                    }))
                  }
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Interactive Visual Grid Selector */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>
                Trực Quan Bố Cục Lưới (Click Ô Để Chỉ Đạo Thần Thái)
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                Ô đang chọn: <strong style={{ color: "var(--accent-secondary)" }}>{activeSlotKey}</strong>
              </span>
            </div>

            {/* Visual Canvas Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${currentLayout.cols}, 1fr)`,
                gridTemplateRows: `repeat(${currentLayout.rows}, 1fr)`,
                gap: "8px",
                padding: "16px",
                background: "#08090d",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                aspectRatio:
                  currentLayout.aspectRatio === "9:16"
                    ? "9/12"
                    : currentLayout.aspectRatio === "1:1"
                    ? "1/1"
                    : "4/4",
                maxHeight: "360px",
                margin: "0 auto",
                width: "100%",
              }}
            >
              {currentLayout.slots.map((slot) => {
                const isActive = activeSlotKey === slot.key;
                const panel = state.panels[slot.key];
                const isCenter = slot.key === "center";

                return (
                  <div
                    key={slot.key}
                    onClick={() => setActiveSlotKey(slot.key)}
                    style={{
                      gridColumn: slot.colSpan ? `span ${slot.colSpan}` : undefined,
                      gridRow: slot.rowSpan ? `span ${slot.rowSpan}` : undefined,
                      borderRadius: "var(--radius-sm)",
                      border: "2px solid",
                      borderColor: isActive
                        ? "var(--accent-secondary)"
                        : isCenter
                        ? "rgba(139, 92, 246, 0.6)"
                        : "var(--border-color)",
                      background: isActive
                        ? "rgba(6, 182, 212, 0.15)"
                        : isCenter
                        ? "rgba(139, 92, 246, 0.08)"
                        : "rgba(255, 255, 255, 0.03)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: "8px",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 700, color: isActive ? "#fff" : "var(--text-muted)" }}>
                      {slot.labelVi}
                    </span>
                    <span style={{ fontSize: "10px", color: isCenter ? "#c4b5fd" : "var(--text-dim)", marginTop: "2px" }}>
                      {panel?.shot_type || "(Shot type)"}
                    </span>
                    {panel?.expression && (
                      <span style={{ fontSize: "9px", color: "var(--accent-emerald)", marginTop: "2px", maxWidth: "90%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {panel.expression}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Emotion Director Form for Selected Slot */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
                🎭 Panel Emotion Director: Ô [{activeSlotKey}]
              </h3>
              <span className="nav-badge" style={{ background: "rgba(6, 182, 212, 0.2)", color: "#67e8f9" }}>
                Tùy chỉnh góc máy & biểu cảm
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Shot type */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  Kiểu góc máy (Shot Type):
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
                  {SHOT_TYPES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateActivePanel("shot_type", st)}
                      className={`chip ${activePanel.shot_type === st ? "active" : ""}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={activePanel.shot_type}
                  onChange={(e) => updateActivePanel("shot_type", e.target.value)}
                  className="input"
                  placeholder="Hoặc tự nhập góc máy..."
                />
              </div>

              {/* Expression */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  Thần thái & Biểu cảm (Expression):
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
                  {EXPRESSIONS.map((ex) => (
                    <button
                      key={ex.en}
                      type="button"
                      onClick={() => updateActivePanel("expression", ex.en)}
                      className={`chip ${activePanel.expression === ex.en ? "active" : ""}`}
                    >
                      {ex.vi}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={activePanel.expression}
                  onChange={(e) => updateActivePanel("expression", e.target.value)}
                  className="input"
                />
              </div>

              {/* Gaze */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  Hướng nhìn (Gaze):
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
                  {GAZES.map((gz) => (
                    <button
                      key={gz.en}
                      type="button"
                      onClick={() => updateActivePanel("gaze", gz.en)}
                      className={`chip ${activePanel.gaze === gz.en ? "active" : ""}`}
                    >
                      {gz.vi}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={activePanel.gaze}
                  onChange={(e) => updateActivePanel("gaze", e.target.value)}
                  className="input"
                />
              </div>

              {/* Pose & Action */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  Dáng chụp & Hành động (Pose):
                </label>
                <input
                  type="text"
                  value={activePanel.pose}
                  onChange={(e) => updateActivePanel("pose", e.target.value)}
                  placeholder="VD: Turning head slightly over the shoulder, peace sign..."
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Realtime JSON Inspector & Copier */}
        <div className="sticky-panel">
          {/* AI Fill-in Prompt Bar */}
          <div className="card" style={{ background: "rgba(16, 24, 38, 0.85)", borderColor: "rgba(139, 92, 246, 0.3)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px", color: "#c4b5fd" }}>
              ✨ AI Art Director (Gợi Ý &amp; Hoàn Thiện Tự Động)
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px" }}>
              Nhập ý tưởng ngắn gọn, AI sẽ tự phân bổ thần thái và góc máy cho từng ô trong lưới:
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={aiBrief}
                onChange={(e) => setAiBrief(e.target.value)}
                placeholder="VD: Lookbook cô gái dạo phố mùa thu tại Paris..."
                className="input"
              />
              <button
                onClick={handleAiFill}
                disabled={aiLoading}
                className="btn btn-outline-accent"
                style={{ whiteSpace: "nowrap" }}
              >
                {aiLoading ? "Đang tạo..." : "Phân Bổ AI"}
              </button>
            </div>
          </div>

          {/* JSON Output Viewer */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Mã JSON Chuẩn Hóa</h3>
                <span style={{ fontSize: "11px", color: validation.ok ? "#34d399" : "#fb7185", fontWeight: 600 }}>
                  {validation.ok ? "✓ JSON Hợp Lệ Theo Schema" : `⚠ ${validation.issues.length} lỗi schema`}
                </span>
              </div>

              <button onClick={handleSave} className="btn btn-secondary btn-sm">
                {saveSuccess ? "✓ Đã Lưu!" : "💾 Lưu Thư Viện"}
              </button>
            </div>

            {/* Copy Action Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
              <button onClick={handleCopyJson} className="btn btn-primary btn-sm" style={{ justifyContent: "center" }}>
                {copyStatus ? "✓ Đã Copy JSON!" : "📋 Copy JSON Đẹp"}
              </button>
              <button onClick={handleCopyCompactJson} className="btn btn-outline-accent btn-sm" style={{ justifyContent: "center" }}>
                {copyCompactStatus ? "✓ Đã Copy 1 Dòng!" : "⚡ Copy 1 Dòng (Compact)"}
              </button>
            </div>

            <div className="code-box" style={{ maxHeight: "420px", overflowY: "auto" }}>
              {jsonString}
            </div>

            {/* Validation issues if any */}
            {!validation.ok && (
              <div style={{ marginTop: "12px", padding: "10px", borderRadius: "var(--radius-sm)", background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.3)", fontSize: "12px", color: "#fb7185" }}>
                <div style={{ fontWeight: 700, marginBottom: "4px" }}>Cần bổ sung các trường:</div>
                <ul style={{ paddingLeft: "16px" }}>
                  {validation.issues.slice(0, 4).map((err, i) => (
                    <li key={i}>
                      <code>{err.path}</code>: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
