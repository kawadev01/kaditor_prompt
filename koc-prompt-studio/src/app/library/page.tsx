"use client";

import React, { useState, useEffect } from "react";
import { getLocalSaved, deleteLocalPrompt, updateLocalPrompt, type SavedItem } from "@/lib/storage";

export default function LibraryPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "layer8" | "collage">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load from API + localStorage
  useEffect(() => {
    let ignore = false;
    async function init() {
      const local = getLocalSaved();
      let combined = local;
      try {
        const res = await fetch("/api/prompts");
        if (res.ok) {
          const data = (await res.json()) as { items?: Array<{ _id?: string; id?: string }> };
          const serverItems: SavedItem[] = (data.items || []).map((x) => ({
            ...(x as unknown as SavedItem),
            id: x._id || x.id || String(Math.random()),
          }));
          const serverIds = new Set(serverItems.map((s) => s.id));
          combined = [...serverItems, ...local.filter((l) => !serverIds.has(l.id))];
        }
      } catch {
        combined = local;
      }
      if (!ignore) {
        setItems(combined);
        setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa prompt này?")) return;

    if (id.startsWith("local_")) {
      deleteLocalPrompt(id);
    } else {
      try {
        await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      } catch {
        deleteLocalPrompt(id);
      }
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const handleToggleFavorite = async (id: string, current: boolean | undefined) => {
    const nextVal = !current;
    if (id.startsWith("local_")) {
      updateLocalPrompt(id, { favorite: nextVal });
    } else {
      try {
        await fetch(`/api/prompts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ favorite: nextVal }),
        });
      } catch {
        updateLocalPrompt(id, { favorite: nextVal });
      }
    }
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, favorite: nextVal } : x))
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = items.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchEn = item.outputEn?.toLowerCase().includes(q);
      const matchJson = item.json?.toLowerCase().includes(q);
      return matchTitle || matchEn || matchJson;
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: 800 }}>Thư Viện Prompt Đã Lưu</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Quản lý toàn bộ công thức prompt 8 tầng và cấu trúc JSON Collage của bạn.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="card" style={{ padding: "16px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setFilterType("all")}
            className={`btn btn-sm ${filterType === "all" ? "btn-primary" : "btn-secondary"}`}
          >
            Tất cả ({items.length})
          </button>
          <button
            onClick={() => setFilterType("layer8")}
            className={`btn btn-sm ${filterType === "layer8" ? "btn-primary" : "btn-secondary"}`}
          >
            🎯 8-Layer ({items.filter((x) => x.type === "layer8").length})
          </button>
          <button
            onClick={() => setFilterType("collage")}
            className={`btn btn-sm ${filterType === "collage" ? "btn-primary" : "btn-secondary"}`}
          >
            🍱 Collage JSON ({items.filter((x) => x.type === "collage").length})
          </button>
        </div>

        <div style={{ width: "280px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên hoặc nội dung..."
            className="input"
            style={{ padding: "8px 12px", fontSize: "13px" }}
          />
        </div>
      </div>

      {/* Items list */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          Đang tải dữ liệu...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: "40px", textAlign: "center" }}>
          <span style={{ fontSize: "36px", display: "block", marginBottom: "12px" }}>📭</span>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>Chưa có prompt nào</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Hãy tạo prompt ở Module 02 hoặc Module 05 rồi nhấn &quot;Lưu Lại&quot; để quản lý tại đây.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "16px" }}>
          {filtered.map((item) => {
            const isLayer8 = item.type === "layer8";
            const content = isLayer8 ? item.outputEn : item.json;

            return (
              <div key={item.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="nav-badge" style={{ background: isLayer8 ? "rgba(139, 92, 246, 0.2)" : "rgba(6, 182, 212, 0.2)", color: isLayer8 ? "#c4b5fd" : "#67e8f9" }}>
                        {isLayer8 ? "8-Layer" : "Collage JSON"}
                      </span>
                      {item.realismScore != null && (
                        <span style={{ fontSize: "11px", color: "#34d399", fontWeight: 700 }}>
                          {item.realismScore}% Score
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(item.id, item.favorite)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}
                      title="Yêu thích"
                    >
                      {item.favorite ? "⭐" : "☆"}
                    </button>
                  </div>

                  <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                    {item.title}
                  </h3>

                  <div className="code-box" style={{ maxHeight: "120px", fontSize: "11.5px", padding: "10px" }}>
                    {content}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </span>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleCopy(content || "", item.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {copiedId === item.id ? "✓ Đã Copy" : "📋 Copy"}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: "#fb7185" }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
