"use client";

/**
 * FontSelectorPanel — Herramienta temporal de selección tipográfica
 * Propósito: Facilitar al cliente elegir la fuente para los títulos.
 * NO debe llegar a producción.
 */

import { useState, useEffect, useRef } from "react";

const FONTS = [
  {
    id: "butler-stencil",
    label: "Butler Stencil",
    value: "'Butler Stencil', serif",
    preview: "MINERVA",
    description: "Actual — Identidad original",
  },
  {
    id: "butler",
    label: "Butler",
    value: "'Butler', serif",
    preview: "MINERVA",
    description: "Clásico — Elegancia directa",
  },
  {
    id: "dm-serif",
    label: "DM Serif Display",
    value: "'DM Serif Display', serif",
    preview: "Minerva",
    description: "Moderno — Serif editorial",
  },
  {
    id: "gloock",
    label: "Gloock",
    value: "'Gloock', serif",
    preview: "Minerva",
    description: "Literario — Alta legibilidad",
  },
  {
    id: "vollkorn",
    label: "Vollkorn",
    value: "'Vollkorn', serif",
    preview: "Minerva",
    description: "Clásico — Elegancia variable",
  },
] as const;

type FontId = (typeof FONTS)[number]["id"];

const STORAGE_KEY = "minerva_font_selector_active";

export function FontSelectorPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFont, setActiveFont] = useState<FontId>("butler-stencil");
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Restore from session
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY) as FontId | null;
    if (saved) applyFont(saved);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  function applyFont(id: FontId) {
    const font = FONTS.find((f) => f.id === id);
    if (!font) return;
    // Inject / update a <style> tag in <head>
    const styleId = "font-selector-override";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      h1, h2, h3, h4, h5, h6,
      [class*="font-display"],
      .font-display {
        font-family: ${font.value} !important;
      }
    `;
    setActiveFont(id);
    sessionStorage.setItem(STORAGE_KEY, id);
  }

  function resetFont() {
    const styleEl = document.getElementById("font-selector-override");
    if (styleEl) styleEl.remove();
    setActiveFont("butler-stencil");
    sessionStorage.removeItem(STORAGE_KEY);
  }

  function copySelection() {
    const font = FONTS.find((f) => f.id === activeFont);
    if (!font) return;
    navigator.clipboard.writeText(`${font.label} — ${font.value}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const activeFontData = FONTS.find((f) => f.id === activeFont)!;

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: "1.25rem",
        bottom: "1.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.5rem",
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      {/* Floating Panel */}
      {isOpen && (
        <div
          style={{
            background: "rgba(44, 55, 41, 0.97)",
            border: "1px solid rgba(203, 182, 123, 0.3)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            width: "280px",
            padding: "1.25rem",
            animation: "fontPanelIn 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid rgba(203,182,123,0.2)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  color: "rgba(203,182,123,0.7)",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Herramienta Temporal
              </p>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  color: "#CBB67B",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Selector de Tipografía
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(229,219,214,0.4)",
                cursor: "pointer",
                padding: "4px",
                lineHeight: 1,
                fontSize: "18px",
              }}
              aria-label="Cerrar panel"
            >
              ×
            </button>
          </div>

          {/* Font Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {FONTS.map((font) => {
              const isActive = activeFont === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => applyFont(font.id)}
                  style={{
                    background: isActive
                      ? "rgba(203,182,123,0.12)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(203,182,123,0.5)"
                      : "1px solid rgba(229,219,214,0.08)",
                    padding: "10px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    transition: "all 0.2s ease",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(229,219,214,0.05)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(229,219,214,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(229,219,214,0.08)";
                    }
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Preview in actual font */}
                    <p
                      style={{
                        fontFamily: font.value,
                        fontSize: "20px",
                        color: isActive ? "#CBB67B" : "#E5DBD6",
                        letterSpacing: "0.05em",
                        lineHeight: 1,
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {font.preview}
                    </p>
                    <p
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        color: isActive
                          ? "rgba(203,182,123,0.8)"
                          : "rgba(229,219,214,0.4)",
                        textTransform: "uppercase",
                      }}
                    >
                      {font.label}
                    </p>
                    <p
                      style={{
                        fontSize: "8px",
                        color: "rgba(229,219,214,0.3)",
                        marginTop: "2px",
                      }}
                    >
                      {font.description}
                    </p>
                  </div>
                  {/* Active indicator */}
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: isActive ? "#CBB67B" : "transparent",
                      border: isActive
                        ? "none"
                        : "1px solid rgba(229,219,214,0.2)",
                      flexShrink: 0,
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "1rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid rgba(203,182,123,0.15)",
            }}
          >
            <button
              onClick={copySelection}
              style={{
                flex: 1,
                background: "rgba(203,182,123,0.1)",
                border: "1px solid rgba(203,182,123,0.3)",
                color: "#CBB67B",
                fontSize: "9px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              title="Copiar fuente activa"
            >
              {copied ? "✓ Copiado" : "Copiar"}
            </button>
            <button
              onClick={resetFont}
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid rgba(229,219,214,0.15)",
                color: "rgba(229,219,214,0.5)",
                fontSize: "9px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              title="Restaurar fuente original"
            >
              Restaurar
            </button>
          </div>

          {/* Active font hint */}
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "8px",
              color: "rgba(229,219,214,0.3)",
              textAlign: "center",
              letterSpacing: "0.05em",
            }}
          >
            Activa: <strong style={{ color: "rgba(203,182,123,0.6)" }}>{activeFontData.label}</strong>
          </p>
        </div>
      )}

      {/* FAB Trigger Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        title="Selector de Tipografía"
        style={{
          width: "48px",
          height: "48px",
          background: isOpen
            ? "rgba(203,182,123,0.95)"
            : "rgba(44, 55, 41, 0.95)",
          border: "1px solid rgba(203,182,123,0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
          backdropFilter: "blur(12px)",
        }}
        onMouseEnter={(e) => {
          if (!isOpen)
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(203,182,123,0.15)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen)
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(44, 55, 41, 0.95)";
        }}
        aria-label="Abrir selector de tipografía"
      >
        {/* Aa icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOpen ? "#2C3729" : "#CBB67B"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      </button>

      {/* Keyframe animation injected inline */}
      <style>{`
        @keyframes fontPanelIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
