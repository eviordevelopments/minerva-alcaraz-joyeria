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
  {
    id: "manrope",
    label: "Manrope",
    value: "'Manrope', sans-serif",
    preview: "Minerva",
    description: "Moderno — Minimalismo técnico",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    value: "'Montserrat', sans-serif",
    preview: "Minerva",
    description: "Urbano — Claridad geométrica",
  },
  {
    id: "raleway",
    label: "Raleway",
    value: "'Raleway', sans-serif",
    preview: "Minerva",
    description: "Elegante — Neogrotesco fino",
  },
  {
    id: "outfit",
    label: "Outfit",
    value: "'Outfit', sans-serif",
    preview: "Minerva",
    description: "Premium — Lujo contemporáneo",
  },
] as const;

const LOGO_COLORS = [
  { id: "default", label: "Default", filter: "none" },
  { id: "verde", label: "Verde", filter: "brightness(0) saturate(100%) invert(18%) sepia(14%) saturate(762%) hue-rotate(58deg) brightness(95%) contrast(91%)" },
  { id: "dorado", label: "Dorado", filter: "brightness(0) saturate(100%) invert(80%) sepia(21%) saturate(740%) hue-rotate(351deg) brightness(90%) contrast(85%)" },
  { id: "blanco", label: "Blanco", filter: "invert(100%)" },
] as const;

type FontId = (typeof FONTS)[number]["id"];
type LogoColorId = (typeof LOGO_COLORS)[number]["id"];

const TITLE_FONT_KEY = "minerva_title_font_active";
const TEXT_FONT_KEY = "minerva_text_font_active";
const LOGO_STORAGE_KEY = "minerva_logo_color_active";

export function FontSelectorPanel() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [target, setTarget] = useState<"both" | "titles" | "texts">("both");
  const [activeTitleFont, setActiveTitleFont] = useState<FontId>("butler-stencil");
  const [activeTextFont, setActiveTextFont] = useState<FontId>("butler-stencil");
  const [activeLogoColor, setActiveLogoColor] = useState<LogoColorId>("default");
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Restore from session
  useEffect(() => {
    if (!mounted) return;
    const savedTitleFont = sessionStorage.getItem(TITLE_FONT_KEY) as FontId | null;
    const savedTextFont = sessionStorage.getItem(TEXT_FONT_KEY) as FontId | null;
    const savedLogo = sessionStorage.getItem(LOGO_STORAGE_KEY) as LogoColorId | null;
    
    if (savedTitleFont || savedTextFont) {
      applyFonts(savedTitleFont || "butler-stencil", savedTextFont || "butler-stencil");
    }
    if (savedLogo) applyLogoColor(savedLogo);
  }, [mounted]);



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

  function applyFonts(titleId: FontId, textId: FontId) {
    const titleFont = FONTS.find((f) => f.id === titleId);
    const textFont = FONTS.find((f) => f.id === textId);
    if (!titleFont || !textFont) return;

    const styleId = "font-selector-override";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      body, p, span, a, button, input, textarea, li, label {
        font-family: ${textFont.value} !important;
      }
      
      h1, h2, h3, h4, h5, h6,
      .font-display,
      [class*="font-display"],
      h1 *, h2 *, h3 *, h4 *, h5 *, h6 *,
      .font-display * {
        font-family: ${titleFont.value} !important;
      }
    `;
    setActiveTitleFont(titleId);
    setActiveTextFont(textId);
    sessionStorage.setItem(TITLE_FONT_KEY, titleId);
    sessionStorage.setItem(TEXT_FONT_KEY, textId);
  }

  function handleFontClick(id: FontId) {
    if (target === "both") {
      applyFonts(id, id);
    } else if (target === "titles") {
      applyFonts(id, activeTextFont);
    } else {
      applyFonts(activeTitleFont, id);
    }
  }

  function applyLogoColor(id: LogoColorId) {
    const color = LOGO_COLORS.find(c => c.id === id);
    if (!color) return;
    
    document.documentElement.style.setProperty('--logo-filter-override', color.filter);
    setActiveLogoColor(id);
    sessionStorage.setItem(LOGO_STORAGE_KEY, id);
  }

  function resetFont() {
    const styleEl = document.getElementById("font-selector-override");
    if (styleEl) styleEl.remove();
    document.documentElement.style.setProperty('--logo-filter-override', 'none');
    setActiveTitleFont("butler-stencil");
    setActiveTextFont("butler-stencil");
    setActiveLogoColor("default");
    sessionStorage.removeItem(TITLE_FONT_KEY);
    sessionStorage.removeItem(TEXT_FONT_KEY);
    sessionStorage.removeItem(LOGO_STORAGE_KEY);
  }

  function copySelection() {
    const titleFont = FONTS.find((f) => f.id === activeTitleFont);
    const textFont = FONTS.find((f) => f.id === activeTextFont);
    if (!titleFont || !textFont) return;
    navigator.clipboard.writeText(`Títulos: ${titleFont.label} — ${titleFont.value}\nTextos: ${textFont.label} — ${textFont.value}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const activeFontData = FONTS.find((f) => f.id === activeTitleFont)!;

  if (!mounted) return null;

  return (
    <div
      ref={panelRef}
      className="fixed z-[10000] flex flex-col items-start gap-2 bottom-4 left-4 md:bottom-6 md:left-20"
      style={{
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      {/* Floating Panel */}
      {isOpen && (
        <div
          className="overflow-y-auto"
          style={{
            background: "rgba(44, 55, 41, 0.97)",
            border: "1px solid rgba(203, 182, 123, 0.3)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
            width: "280px",
            maxHeight: "75vh",
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

          {/* Target Selector */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "rgba(0,0,0,0.2)", padding: "4px", borderRadius: "4px" }}>
            {[
              { id: "both", label: "Ambos" },
              { id: "titles", label: "Títulos" },
              { id: "texts", label: "Textos" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTarget(t.id as any)}
                style={{
                  flex: 1,
                  padding: "6px",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  border: "none",
                  borderRadius: "2px",
                  cursor: "pointer",
                  background: target === t.id ? "rgba(203,182,123,0.2)" : "transparent",
                  color: target === t.id ? "#CBB67B" : "rgba(229,219,214,0.5)",
                  transition: "all 0.2s"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Font Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {FONTS.map((font) => {
              const isActive = (target === "titles" && activeTitleFont === font.id) ||
                               (target === "texts" && activeTextFont === font.id) ||
                               (target === "both" && activeTitleFont === font.id && activeTextFont === font.id);
              return (
                <button
                  key={font.id}
                  onClick={() => handleFontClick(font.id)}
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

          {/* Logo Color Selection */}
          <div style={{ marginTop: "1.25rem" }}>
            <p
              style={{
                fontSize: "8px",
                letterSpacing: "0.2em",
                color: "rgba(203,182,123,0.5)",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
                borderBottom: "1px solid rgba(203,182,123,0.1)",
                paddingBottom: "4px"
              }}
            >
              Logo Color (Scroll)
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
              {LOGO_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => applyLogoColor(color.id)}
                  style={{
                    background: activeLogoColor === color.id ? "#CBB67B" : "rgba(229,219,214,0.05)",
                    border: "1px solid rgba(229,219,214,0.1)",
                    color: activeLogoColor === color.id ? "#2C3729" : "#E5DBD6",
                    fontSize: "8px",
                    padding: "6px 0",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    transition: "all 0.2s"
                  }}
                >
                  {color.label}
                </button>
              ))}
            </div>
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
