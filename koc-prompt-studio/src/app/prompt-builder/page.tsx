"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { LAYERS, type LayerId, type LayerState, emptyLayerState } from "@/lib/prompt-engine/layers";
import { DEFAULT_REALISM, REALISM_GROUPS, type RealismGroupId } from "@/lib/prompt-engine/realism";
import { DEFAULT_NEGATIVE, type NegativeOptions } from "@/lib/prompt-engine/negative";
import { composePrompt, toMidjourney } from "@/lib/prompt-engine/compose";
import { realismScore } from "@/lib/prompt-engine/score";
import {
  analyzeLogicCompatibility,
  isKeywordLogicMatched,
} from "@/lib/prompt-engine/compatibility";
import { KEYWORDS, offlineTranslate, type Keyword } from "@/data/keywords";
import { NICHE_PRESETS } from "@/data/niche-presets";
import { saveLocalPrompt } from "@/lib/storage";

const ASPECT_RATIOS = [
  { id: "16:9", label: "16:9", desc: "YouTube / Cinematic" },
  { id: "9:16", label: "9:16", desc: "TikTok / Reels / Story" },
  { id: "4:5", label: "4:5", desc: "Instagram Portrait" },
  { id: "1:1", label: "1:1", desc: "Vuông / Feed" },
];

const REALISM_PROFILES: {
  id: string;
  name: string;
  desc: string;
  groups: RealismGroupId[];
}[] = [
  {
    id: "beauty",
    name: "🌸 KOC Beauty / Da Thật",
    desc: "Lỗ chân lông thật, mắt có hồn, má hồng, butterfly lighting",
    groups: ["skin", "eyes", "cheeks", "light3d"],
  },
  {
    id: "cinematic",
    name: "🎬 Điện Ảnh Movie",
    desc: "Khối mặt 3D, ánh sáng khuếch tán mềm, da thật, phim 35mm",
    groups: ["skin", "light3d", "diffused", "camera_raw"],
  },
  {
    id: "editorial",
    name: "💎 Vogue Fashion",
    desc: "Chi tiết chân thực cao độ, khối gò má, ống kính 85mm",
    groups: ["skin", "light3d", "camera_raw"],
  },
  {
    id: "maximum",
    name: "⭐ Tối Đa 100%",
    desc: "Kích hoạt trọn vẹn cả 6 module khử nhựa AI cao cấp",
    groups: ["skin", "light3d", "eyes", "cheeks", "diffused", "camera_raw"],
  },
];

export default function PromptBuilderPage() {
  const [layers, setLayers] = useState<LayerState>(() => {
    const init = emptyLayerState();
    // Default preset: Skincare KOC
    const p = NICHE_PRESETS[1];
    for (const [id, val] of Object.entries(p.layers)) {
      if (init[id as LayerId]) {
        init[id as LayerId].vi = val.vi;
        init[id as LayerId].en = val.en;
        init[id as LayerId].enabled = true;
      }
    }
    // Default Layer 9 Realism state
    if (init.realism) {
      init.realism.vi = "Khử sáp AI, da thật có lỗ chân lông, ánh mắt có catchlights, khối mặt 3D tự nhiên";
      init.realism.en = "ultra-realistic human face, natural skin texture, visible skin pores, natural eye catchlights, absent of plastic AI look";
      init.realism.enabled = true;
    }
    return init;
  });

  const [realismEnabled, setRealismEnabled] = useState(true);
  const [realismProfile, setRealismProfile] = useState<string>("beauty");
  const [realismGroups, setRealismGroups] = useState<RealismGroupId[]>(DEFAULT_REALISM);
  const [negative, setNegative] = useState<NegativeOptions>(DEFAULT_NEGATIVE);
  const [soloSubject, setSoloSubject] = useState(true);

  const [selectedAspect, setSelectedAspect] = useState<string>("16:9");
  const [selectedPreset, setSelectedPreset] = useState<string | null>("skincare-closeup");
  const [translatingLayer, setTranslatingLayer] = useState<LayerId | null>(null);
  const [translatingAll, setTranslatingAll] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active category tab for each layer's keywords
  const [activeKeywordTabs, setActiveKeywordTabs] = useState<Record<LayerId, string>>({
    quality: "Tất cả",
    subject: "Tất cả",
    facial: "Tất cả",
    clothing: "Tất cả",
    pose: "Tất cả",
    setting: "Tất cả",
    lighting: "Tất cả",
    camera: "Tất cả",
    realism: "Tất cả",
  });

  // Realtime compose prompt and realism score
  const composed = useMemo(() => {
    return composePrompt({
      layers,
      realismEnabled,
      realismGroups,
      negative,
      soloSubject,
    });
  }, [layers, realismEnabled, realismGroups, negative, soloSubject]);

  const score = useMemo(() => {
    return realismScore({
      layers,
      realismEnabled,
      realismGroups,
      negative,
      soloSubject,
    });
  }, [layers, realismEnabled, realismGroups, negative, soloSubject]);

  // Logic compatibility analysis
  const compatibility = useMemo(() => {
    return analyzeLogicCompatibility(layers);
  }, [layers]);

  // Load preset
  const handleLoadPreset = (slug: string) => {
    const p = NICHE_PRESETS.find((x) => x.slug === slug);
    if (!p) return;
    const next = emptyLayerState();
    for (const [id, val] of Object.entries(p.layers)) {
      if (next[id as LayerId]) {
        next[id as LayerId].vi = val.vi;
        next[id as LayerId].en = val.en;
        next[id as LayerId].enabled = true;
      }
    }
    // Keep or set realistic layer 9 for preset
    if (next.realism) {
      next.realism.vi = "Khử sáp AI, da thật có lỗ chân lông, ánh mắt có catchlights, má hồng tự nhiên";
      next.realism.en = "ultra-realistic human face, natural skin texture, visible skin pores, natural eye catchlights, absent of plastic AI look";
      next.realism.enabled = true;
    }
    setLayers(next);
    setSelectedPreset(slug);
  };

  // Change Realism profile
  const handleSelectRealismProfile = (profId: string) => {
    setRealismProfile(profId);
    if (profId === "off") {
      setRealismEnabled(false);
      setLayers((prev) => ({
        ...prev,
        realism: { ...prev.realism, enabled: false },
      }));
      return;
    }
    setRealismEnabled(true);
    const prof = REALISM_PROFILES.find((p) => p.id === profId);
    if (prof) {
      setRealismGroups(prof.groups);
      setLayers((prev) => {
        const curVi = prev.realism?.vi?.trim();
        const curEn = prev.realism?.en?.trim();
        if (curVi && curEn) return { ...prev, realism: { ...prev.realism, enabled: true } };
        return {
          ...prev,
          realism: {
            ...prev.realism,
            vi: "Khử sáp AI, da thật có lỗ chân lông, ánh mắt có catchlights, khối mặt 3D tự nhiên",
            en: "ultra-realistic human face, natural skin texture, visible skin pores, natural eye catchlights, absent of plastic AI look",
            enabled: true,
          },
        };
      });
    }
  };

  // Toggle individual Realism module (skin, light3d, eyes, cheeks, diffused, camera_raw)
  const handleToggleRealismGroup = (groupId: RealismGroupId) => {
    const next = realismGroups.includes(groupId)
      ? realismGroups.filter((g) => g !== groupId)
      : [...realismGroups, groupId];
    setRealismGroups(next);
    if (next.length === 0) {
      setRealismEnabled(false);
      setLayers((prev) => ({
        ...prev,
        realism: { ...prev.realism, enabled: false },
      }));
    } else {
      setRealismEnabled(true);
      setLayers((prev) => ({
        ...prev,
        realism: { ...prev.realism, enabled: true },
      }));
    }
  };

  // Update text in a layer's rich textbox
  const updateLayerVi = (id: LayerId, text: string) => {
    setLayers((prev) => {
      const off = offlineTranslate(id, text);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          vi: text,
          en: off.en || prev[id].en || text,
          enabled: true,
        },
      };
    });
  };

  // Append a keyword into the layer's rich textbox
  const appendKeyword = (id: LayerId, k: Keyword) => {
    setLayers((prev) => {
      const curVi = prev[id]?.vi?.trim() || "";
      const curEn = prev[id]?.en?.trim() || "";

      // Check if keyword is already in text to prevent accidental duplicate clicks
      if (curVi.includes(k.vi)) return prev;

      const nextVi = curVi ? `${curVi}, ${k.vi}` : k.vi;
      const nextEn = curEn ? `${curEn}, ${k.en}` : k.en;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          vi: nextVi,
          en: nextEn,
          enabled: true,
        },
      };
    });
  };

  // Clear single layer
  const handleClearLayer = (id: LayerId) => {
    setLayers((prev) => ({
      ...prev,
      [id]: { vi: "", en: "", enabled: true },
    }));
  };

  // Reset all 9 layers
  const handleResetAll = () => {
    if (confirm("Bạn có muốn làm mới lại toàn bộ 9 tầng prompt không?")) {
      setLayers(emptyLayerState());
      setSelectedPreset(null);
    }
  };

  // Translate single layer with AI or offline dictionary
  const handleTranslateLayer = async (id: LayerId) => {
    const text = layers[id]?.vi?.trim();
    if (!text) return;
    setTranslatingLayer(id);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layer: id, vi: text }),
      });
      const data = await res.json();
      if (res.ok && data.en) {
        setLayers((prev) => ({
          ...prev,
          [id]: { ...prev[id], en: data.en },
        }));
      } else {
        const off = offlineTranslate(id, text);
        setLayers((prev) => ({
          ...prev,
          [id]: { ...prev[id], en: off.en || text },
        }));
      }
    } catch {
      const off = offlineTranslate(id, text);
      setLayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], en: off.en || text },
      }));
    } finally {
      setTranslatingLayer(null);
    }
  };

  // Translate all layers
  const handleTranslateAll = async () => {
    const layersToTranslate = LAYERS.filter((l) => layers[l.id]?.vi?.trim());
    if (layersToTranslate.length === 0) {
      alert("Chưa có tầng nào có nội dung để dịch.");
      return;
    }
    setTranslatingAll(true);
    try {
      const next = { ...layers };
      for (const def of layersToTranslate) {
        const viText = layers[def.id].vi.trim();
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ layer: def.id, vi: viText }),
          });
          const data = await res.json();
          if (res.ok && data.en) {
            next[def.id] = { ...next[def.id], en: data.en };
          } else {
            const off = offlineTranslate(def.id, viText);
            next[def.id] = { ...next[def.id], en: off.en || viText };
          }
        } catch {
          const off = offlineTranslate(def.id, viText);
          next[def.id] = { ...next[def.id], en: off.en || viText };
        }
      }
      setLayers(next);
    } finally {
      setTranslatingAll(false);
    }
  };

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(key);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  // Full Midjourney & Flux Prompts
  const midjourneyPrompt = useMemo(() => {
    return toMidjourney(composed, selectedAspect);
  }, [composed, selectedAspect]);

  const fluxPrompt = useMemo(() => {
    return `${composed.prompt}\n\nNegative prompt: ${composed.negative}`;
  }, [composed]);

  // Save to local library
  const handleSave = () => {
    const subjectName = layers.subject.vi.trim() || "Chân dung KOC Điện Ảnh";
    saveLocalPrompt({
      type: "layer8",
      title: `${subjectName} (${selectedAspect})`,
      outputEn: midjourneyPrompt,
      outputVi: layers.subject.vi || "Master Prompt 9 Tầng",
      negative: composed.negative,
      input: {
        layers,
        realismEnabled,
        realismGroups,
        negative,
        soloSubject,
        aspect: selectedAspect,
        breakdown: composed.segments.map((s) => ({
          layer: s.layer,
          nameVi: s.nameVi,
          en: s.en,
          vi: s.vi,
        })),
      },
      realismScore: score.score,
      tags: ["master-prompt", "9-layer", selectedAspect],
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Studio Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Master Prompt Studio
            </h1>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: "12px",
                background: "rgba(139, 92, 246, 0.2)",
                color: "#c4b5fd",
                border: "1px solid rgba(139, 92, 246, 0.4)",
              }}
            >
              9 TẦNG ĐIỆN ẢNH
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "13.5px", marginTop: "4px" }}>
            Hệ thống kiến tạo Master Prompt 9 tầng chuẩn Hollywood • Tích hợp Khử Nhựa AI • Tương thích logic quang học
          </p>
        </div>

        {/* Global Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={handleTranslateAll}
            disabled={translatingAll}
            className="btn btn-outline-accent btn-sm"
            style={{ fontSize: "12px", padding: "6px 14px", fontWeight: 700 }}
          >
            {translatingAll ? "⏳ Đang dịch 9 tầng..." : "⚡ Dịch Tất Cả Sang EN"}
          </button>
          <button
            onClick={handleResetAll}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "12px", padding: "6px 12px", color: "#fb7185" }}
          >
            🔄 Làm Mới (Reset)
          </button>
        </div>
      </div>

      {/* Control Bar: Niche Presets + Aspect Ratio + Solo Subject */}
      <div
        className="card"
        style={{
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          background: "rgba(18, 20, 29, 0.85)",
          borderColor: "rgba(139, 92, 246, 0.3)",
        }}
      >
        {/* Presets */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "var(--text-dim)", fontWeight: 700 }}>NẠP MẪU NHANH:</span>
          {NICHE_PRESETS.map((p) => {
            const active = selectedPreset === p.slug;
            return (
              <button
                key={p.slug}
                onClick={() => handleLoadPreset(p.slug)}
                className={`chip ${active ? "active" : ""}`}
                style={{ fontSize: "12px", padding: "4px 10px", fontWeight: active ? 700 : 500 }}
              >
                {p.emoji} {p.name.replace("KOC ", "")}
              </button>
            );
          })}
        </div>

        {/* Aspect Ratio & Solo Subject */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-dim)", fontWeight: 700 }}>TỶ LỆ:</span>
            {ASPECT_RATIOS.map((ar) => (
              <button
                key={ar.id}
                onClick={() => setSelectedAspect(ar.id)}
                className={`clean-aspect-btn ${selectedAspect === ar.id ? "active" : ""}`}
                style={{ padding: "4px 9px", fontSize: "12px" }}
                title={ar.desc}
              >
                {ar.label}
              </button>
            ))}
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              cursor: "pointer",
              color: soloSubject ? "#c4b5fd" : "var(--text-dim)",
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: "6px",
              background: soloSubject ? "rgba(139, 92, 246, 0.12)" : "transparent",
            }}
          >
            <input
              type="checkbox"
              checked={soloSubject}
              onChange={(e) => setSoloSubject(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            👤 Solo Subject (1 người trung tâm)
          </label>
        </div>
      </div>

      {/* Logic Compatibility Alerts & Active Context Badges */}
      {(compatibility.contextLabels.length > 0 || compatibility.contradictions.length > 0) && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Active Context Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#34d399" }}>
              🎯 QUANG HỌC PHÁT HIỆN:
            </span>
            {compatibility.contextLabels.map((lbl, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#6ee7b7",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  fontWeight: 600,
                }}
              >
                {lbl}
              </span>
            ))}
          </div>

          {/* Logic Contradiction Warning */}
          {compatibility.contradictions.map((c) => (
            <div key={c.id} className="logic-alert-box">
              <span style={{ fontSize: "18px" }}>⚠️</span>
              <div>
                <strong style={{ color: "#fef08a" }}>Cảnh báo mâu thuẫn logic: </strong>
                {c.messageVi}
                <div style={{ marginTop: "2px", color: "#fde047", fontSize: "11.5px" }}>
                  💡 <em>Gợi ý khắc phục: {c.suggestionVi}</em>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= 9-LAYER MASTER PROMPT WORKSPACE ================= */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {LAYERS.map((def) => {
          const val = layers[def.id] || { vi: "", en: "", enabled: true };
          const allKeywords = KEYWORDS[def.id] || [];

          // Group categories for this layer
          const categories = ["Tất cả", ...Array.from(new Set(allKeywords.map((k) => k.group)))];
          const activeTab = activeKeywordTabs[def.id] || "Tất cả";

          // Filtered keywords by active sub-category
          const filteredKeywords =
            activeTab === "Tất cả"
              ? allKeywords
              : allKeywords.filter((k) => k.group === activeTab);

          // Word and char count for rich textbox
          const wordCount = val.vi.trim() ? val.vi.trim().split(/\s+/).length : 0;
          const charCount = val.vi.length;

          // Logic recommendation for this specific layer
          const layerRec = compatibility.recommendations.find((r) => r.layer === def.id);

          return (
            <div
              key={def.id}
              className="layer-card-pro"
              style={{
                borderColor: def.id === "realism" ? "rgba(99, 102, 241, 0.45)" : undefined,
                boxShadow: def.id === "realism" ? "0 4px 20px rgba(99, 102, 241, 0.08)" : undefined,
              }}
            >
              {/* Layer Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    className="layer-badge-num"
                    style={{
                      background: def.id === "realism" ? "linear-gradient(135deg, #6366f1, #a855f7)" : undefined,
                      color: "#fff",
                    }}
                  >
                    {def.index}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 700, fontSize: "14.5px" }}>{def.nameVi}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>({def.nameEn})</span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{def.hintVi}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {val.vi.trim() && (
                    <button
                      type="button"
                      onClick={() => handleClearLayer(def.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "3px 8px", fontSize: "11px", color: "#fb7185" }}
                      title="Xóa nội dung tầng này"
                    >
                      🗑️ Xóa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleTranslateLayer(def.id)}
                    disabled={translatingLayer === def.id || !val.vi.trim()}
                    className="btn btn-outline-accent btn-sm"
                    style={{ padding: "3px 10px", fontSize: "11.5px" }}
                  >
                    {translatingLayer === def.id ? "Đang dịch..." : "⚡ Dịch Tầng Này"}
                  </button>
                </div>
              </div>

              {/* SPECIAL SECTION FOR LAYER 9: REALISM FIXER CONTROLS */}
              {def.id === "realism" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "12px 14px",
                    background: "rgba(99, 102, 241, 0.06)",
                    borderRadius: "8px",
                    border: "1px solid rgba(99, 102, 241, 0.22)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-primary)" }}>
                        HỒ SƠ KHỬ NHỰA NHANH:
                      </span>
                      {REALISM_PROFILES.map((prof) => {
                        const active = realismEnabled && realismProfile === prof.id;
                        return (
                          <button
                            key={prof.id}
                            type="button"
                            onClick={() => handleSelectRealismProfile(prof.id)}
                            className={`chip ${active ? "active" : ""}`}
                            style={{
                              fontSize: "11.5px",
                              padding: "3px 10px",
                              borderColor: active ? "var(--accent-primary)" : undefined,
                              fontWeight: active ? 700 : 500,
                            }}
                            title={prof.desc}
                          >
                            {prof.name}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => handleSelectRealismProfile("off")}
                        className={`chip ${!realismEnabled ? "active" : ""}`}
                        style={{ fontSize: "11.5px", padding: "3px 10px" }}
                      >
                        Tắt Khử Nhựa
                      </button>
                    </div>
                  </div>

                  {/* 6 Modular Toggles */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", borderTop: "1px dashed rgba(255, 255, 255, 0.08)", paddingTop: "8px" }}>
                    <span style={{ fontSize: "11.5px", color: "var(--text-dim)", fontWeight: 600 }}>
                      6 MODULE QUANG HỌC:
                    </span>
                    {REALISM_GROUPS.map((g) => {
                      const isGroupActive = realismEnabled && realismGroups.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => handleToggleRealismGroup(g.id)}
                          className={`chip ${isGroupActive ? "active" : ""}`}
                          style={{
                            fontSize: "11px",
                            padding: "2px 9px",
                            borderColor: isGroupActive ? "rgba(16, 185, 129, 0.5)" : undefined,
                            color: isGroupActive ? "#34d399" : undefined,
                            background: isGroupActive ? "rgba(16, 185, 129, 0.12)" : undefined,
                          }}
                          title={g.descVi}
                        >
                          {isGroupActive ? "✓ " : "+ "}
                          {g.nameVi}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Logic Recommendation Banner for this layer if active */}
              {layerRec && (
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px dashed rgba(16, 185, 129, 0.4)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#34d399" }}>
                    ⭐ <strong>{layerRec.titleVi}:</strong> {layerRec.reasonVi}
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {layerRec.recommendedKeywords.map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => appendKeyword(def.id, { vi: kw.vi, en: kw.en, group: "Logic" })}
                        className="logic-badge-recommended"
                      >
                        + {kw.vi}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Textbox Area */}
              <div className="richtext-container">
                <textarea
                  value={val.vi}
                  onChange={(e) => updateLayerVi(def.id, e.target.value)}
                  placeholder={`Nhập chi tiết ${def.nameVi.toLowerCase()} bằng tiếng Việt... (VD: ${def.placeholderVi})`}
                  className="richtext-area"
                />

                {/* Richtext Toolbar: Counter & Live English Token Preview */}
                <div className="richtext-toolbar">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 600, color: "var(--accent-secondary)" }}>MÃ EN DÙNG CHO AI:</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "#e2e8f0", fontSize: "11.5px" }}>
                      {val.en.trim() || def.defaultEn || "(Chưa có token tiếng Anh)"}
                    </span>
                  </div>

                  <div style={{ whiteSpace: "nowrap", flexShrink: 0, marginLeft: "12px" }}>
                    {wordCount} từ • {charCount} ký tự
                  </div>
                </div>
              </div>

              {/* Plentiful Categorized Keyword Suggestions */}
              {allKeywords.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* Category Tabs */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <div className="keyword-category-tabs">
                      {categories.map((cat) => {
                        const isTabActive = activeTab === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() =>
                              setActiveKeywordTabs((prev) => ({ ...prev, [def.id]: cat }))
                            }
                            className={`keyword-category-btn ${isTabActive ? "active" : ""}`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                      Click để thêm vào Rich Textbox
                    </span>
                  </div>

                  {/* Chips Bank with Logic-Matched Highlight */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {filteredKeywords.map((k, idx) => {
                      const isMatched = isKeywordLogicMatched(k, compatibility.activeContexts);
                      const isAlreadyInText = val.vi.includes(k.vi);

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => appendKeyword(def.id, k)}
                          className={`chip ${isAlreadyInText ? "active" : ""}`}
                          style={{
                            fontSize: "11.5px",
                            padding: "3px 9px",
                            borderColor: isMatched ? "rgba(16, 185, 129, 0.5)" : undefined,
                            background: isMatched ? "rgba(16, 185, 129, 0.12)" : undefined,
                            color: isMatched ? "#34d399" : undefined,
                          }}
                          title={`EN: "${k.en}" (Nhóm: ${k.group})`}
                        >
                          {isAlreadyInText ? "✓ " : isMatched ? "⭐ " : "+ "}
                          {k.vi}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= BẢNG PHÂN RÃ SONG NGỮ ANH - VIỆT (LUÔN HIỂN THỊ, PHÍA TRÊN PROMPT) ================= */}
      <div
        className="card"
        style={{
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          background: "rgba(18, 20, 29, 0.95)",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>📖</span>
            <h3 style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em" }}>
              BẢNG PHÂN RÃ SONG NGỮ ANH - VIỆT CHI TIẾT THEO 9 TẦNG ĐIỆN ẢNH
            </h3>
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
            Đối chiếu chi tiết từng tầng ghép thành câu lệnh • Luôn đồng bộ thời gian thực
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "12px" }}>
          {composed.segments.map((seg) => (
            <div
              key={seg.layer}
              style={{
                padding: "12px 14px",
                background: "rgba(255, 255, 255, 0.025)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#c4b5fd", fontWeight: 700, fontSize: "12.5px" }}>
                  T{seg.index}. {seg.nameVi}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                  [{seg.layer}]
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", color: "#f3f4f6", fontSize: "12px", lineHeight: "1.5" }}>
                {seg.en}
              </div>
              {seg.vi && (
                <div style={{ color: "#9ca3af", fontSize: "11.5px", lineHeight: "1.4", borderTop: "1px dashed rgba(255, 255, 255, 0.06)", paddingTop: "5px" }}>
                  ↳ <em>{seg.vi}</em>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= CÂU LỆNH ĐIỆN ẢNH HOÀN CHỈNH (KHÔNG DÙNG SCROLL, HIỂN THỊ ĐẦY ĐỦ NỘI DUNG) ================= */}
      <div
        className="card"
        style={{
          padding: "22px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          background: "rgba(15, 17, 26, 0.95)",
          border: "1px solid rgba(139, 92, 246, 0.45)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Câu Lệnh Điện Ảnh Hoàn Chỉnh (Master Prompt)</h3>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.35)",
              }}
            >
              {score.score}% Chân thực điện ảnh
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              className="btn btn-secondary btn-sm"
              style={{ padding: "6px 14px", fontSize: "12.5px" }}
            >
              {saveSuccess ? "✓ Đã Lưu Thư Viện!" : "💾 Lưu Prompt"}
            </button>
            <button
              onClick={() => copyToClipboard(fluxPrompt, "flux")}
              className="btn btn-secondary btn-sm"
              style={{ padding: "6px 14px", fontSize: "12.5px" }}
            >
              {copyStatus === "flux" ? "✓ Đã Copy Flux!" : "Copy Flux / SD"}
            </button>
            <button
              onClick={() => copyToClipboard(midjourneyPrompt, "mj")}
              className="btn btn-primary"
              style={{ padding: "8px 22px", fontSize: "14px", fontWeight: 700 }}
            >
              {copyStatus === "mj" ? "✓ Đã Copy Midjourney!" : `🎨 Copy Midjourney (${selectedAspect})`}
            </button>
          </div>
        </div>

        {/* Positive Master Prompt Box - FULL TEXT, NO SCROLLBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-secondary)" }}>
              🎨 PROMPT DƯƠNG TÍNH (POSITIVE PROMPT + MIDJOURNEY PARAMETERS):
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
              {midjourneyPrompt.length} ký tự • {midjourneyPrompt.split(/\s+/).length} từ
            </span>
          </div>
          <div
            className="code-box"
            style={{
              fontSize: "13.5px",
              lineHeight: "1.7",
              background: "#08090d",
              borderColor: "rgba(255, 255, 255, 0.14)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: "none",
              overflow: "visible",
              padding: "16px",
            }}
          >
            {midjourneyPrompt}
          </div>
        </div>

        {/* Negative Prompt Box - FULL TEXT, ALWAYS SHOWN, NO SCROLLBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#fb7185" }}>
              🛡️ NEGATIVE PROMPT (CHỐNG NHỰA, BÚP BÊ SÁP, DỊ TẬT):
            </span>
            <button
              onClick={() => copyToClipboard(composed.negative, "neg")}
              className="btn btn-secondary btn-sm"
              style={{ padding: "3px 10px", fontSize: "11.5px" }}
            >
              {copyStatus === "neg" ? "✓ Đã Copy Negative" : "📋 Copy Negative"}
            </button>
          </div>
          <div
            className="code-box"
            style={{
              fontSize: "12.5px",
              lineHeight: "1.65",
              background: "rgba(239, 68, 68, 0.04)",
              borderColor: "rgba(239, 68, 68, 0.25)",
              color: "#fca5a5",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: "none",
              overflow: "visible",
              padding: "14px 16px",
            }}
          >
            {composed.negative}
          </div>
        </div>
      </div>
    </div>
  );
}
