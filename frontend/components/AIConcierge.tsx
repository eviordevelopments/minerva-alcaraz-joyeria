"use client";

import React, {
  useState, useRef, useEffect, useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, Send, ChevronRight, Gem,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, type Product } from "../constants/products";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "user" | "assistant";
interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  streaming: boolean;
}

// ─── Initial welcome message ─────────────────────────────────────────────────
const WELCOME: ChatMessage = {
  id: "init",
  role: "assistant",
  streaming: false,
  content:
    "Hola, soy tu asistente de joyería Minerva Alcaraz. Estoy aquí para ayudarte a encontrar la pieza ideal, responder tus dudas o guiarte en un diseño personalizado. ¿En qué puedo ayudarte hoy?",
};

const QUICK_PROMPTS = [
  "Busco un regalo especial",
  "¿Qué anillos tienen?",
  "Quiero algo personalizado",
  "¿Cuáles son los precios?",
];

// ─── Knowledge base ───────────────────────────────────────────────────────────
interface KBEntry {
  pattern: RegExp;
  response: string;
  filter: (p: Product) => boolean;
}

const KB: KBEntry[] = [
  {
    pattern: /\b(hola|hello|hi|buenos|buenas|buen\s*d[íi]a)\b/i,
    response:
      "¡Hola! Bienvenida/o. Puedo ayudarte a explorar nuestras colecciones, consultar materiales, precios o iniciar un diseño personalizado. ¿Qué tienes en mente?",
    filter: (p) => !!p.featured,
  },
  {
    pattern: /anillos?/i,
    response:
      "Nuestros anillos están elaborados a mano en plata .950 y oro. Puedes elegir del catálogo o personalizarlos: piedra, metal, dimensión y grabado. Aquí algunas opciones disponibles:",
    filter: (p) => p.category === "Anillos",
  },
  {
    pattern: /pendientes?|aretes?/i,
    response:
      "Nuestros pendientes van desde diseños minimalistas para el día a día hasta piezas de autor para ocasiones especiales, todos elaborados artesanalmente:",
    filter: (p) => p.category === "Pendientes",
  },
  {
    pattern: /collares?|cadena/i,
    response:
      "Los collares de Minerva Alcaraz combinan materiales naturales con técnica artesanal. Podemos ajustar el largo y los elementos según tu preferencia:",
    filter: (p) => p.category === "Collares",
  },
  {
    pattern: /pulseras?|brazalete/i,
    response:
      "Nuestras pulseras están disponibles en plata y oro, con opción a piedras o grabados personalizados:",
    filter: (p) => p.category === "Pulseras",
  },
  {
    pattern: /sets?|conjunto/i,
    response:
      "Los Sets de Minerva Alcaraz son colecciones coordinadas para lucir piezas que se complementan entre sí. Perfectos para regalar o para un look completo:",
    filter: (p) => p.category === "Sets",
  },
  {
    pattern: /serpientes?/i,
    response:
      "La colección Serpientes es una de las más expresivas de la marca. Cada pieza captura el movimiento del símbolo en plata con acabados únicos:",
    filter: (p) => p.collection === "Serpientes",
  },
  {
    pattern: /e[sc]encia|esencia/i,
    response:
      "Escencia es nuestra colección más íntima. Piezas minimalistas con gran carga simbólica para representar tu identidad:",
    filter: (p) => p.collection === "Escencia",
  },
  {
    pattern: /et[eé]re[ao]/i,
    response:
      "La colección Etérea traduce lo ligero y delicado en formas únicas. Perfecta para quienes buscan presencia suave pero poderosa:",
    filter: (p) => p.collection === "Etérea",
  },
  {
    pattern: /amatista/i,
    response:
      "La colección Amatista incorpora esta piedra natural en piezas diseñadas para transmitir calma y claridad:",
    filter: (p) => p.collection === "Amatista",
  },
  {
    pattern: /chai/i,
    response:
      "La colección Chai es versátil y cotidiana, con piezas elegantes para usar en cualquier momento del día:",
    filter: (p) => p.collection === "Chai",
  },
  {
    pattern: /regalo|obsequio|cumplea|aniversario|boda|presente/i,
    response:
      "¡Qué bonito gesto! Te muestro nuestras piezas más apreciadas, todas con empaque premium y posibilidad de mensaje personalizado. ¿Sabes qué tipo de pieza prefiere quien lo recibirá?",
    filter: (p) => !!p.featured,
  },
  {
    pattern: /personal|dise[ñn]|medida|crea[cr]|co[-\u2010]?crea/i,
    response:
      "La co-creación es parte esencial de Minerva Alcaraz. Trabajamos contigo desde el boceto: eliges el tipo de pieza, metal, piedras y detalles. Para iniciar, agenda una consulta en el Atelier. Aquí algunas piezas que pueden inspirarte:",
    filter: (p) => !!p.featured || !!p.tags?.includes("Atelier"),
  },
  {
    pattern: /precio|costo|cu[aá]nto|vale|valor/i,
    response:
      "Los precios varían según el material y complejidad. Las piezas de catálogo en plata comienzan desde $1,200 MXN; en oro o con piedras naturales, desde $3,500 MXN. Para diseños personalizados el costo se define en consulta. ¿Tienes en mente algún tipo de pieza?",
    filter: (p) => !!p.featured,
  },
  {
    pattern: /plata|oro|material|piedra|turquesa|perla|obsidiana|cuarzo|diamante/i,
    response:
      "Trabajamos en Plata Ley .950 y Oro de 10k, 14k y 18k, con piedras naturales seleccionadas: turquesa, perla, obsidiana, cuarzo y más. ¿Tienes preferencia por algún material?",
    filter: (p) => !!p.featured,
  },
  {
    pattern: /gracias|thank/i,
    response:
      "¡Con mucho gusto! Es un placer acompañarte. Si tienes alguna otra duda o deseas ver más piezas, aquí estaré. ¿Puedo ayudarte con algo más?",
    filter: (p) => !!p.featured,
  },
];

function getResponse(input: string): { text: string; filter: (p: Product) => boolean } {
  for (const entry of KB) {
    if (entry.pattern.test(input)) {
      return { text: entry.response, filter: entry.filter };
    }
  }
  return {
    text: "Gracias por tu mensaje. Cuéntame más sobre lo que buscas: el tipo de pieza, la ocasión o el material preferido. Con gusto te ayudo a encontrar la opción ideal.",
    filter: (p) => !!p.featured,
  };
}

function getInitialProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, 6);
}

// ─── Streaming Bubble ─────────────────────────────────────────────────────────
const StreamingBubble = React.memo(function StreamingBubble({
  content,
  streaming,
  onDone,
}: {
  content: string;
  streaming: boolean;
  onDone: () => void;
}) {
  const [displayed, setDisplayed] = useState(streaming ? "" : content);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!streaming) {
      setDisplayed(content);
      return;
    }
    idxRef.current = 0;
    setDisplayed("");
    timerRef.current = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(content.slice(0, idxRef.current));
      if (idxRef.current >= content.length) {
        clearInterval(timerRef.current!);
        onDoneRef.current();
      }
    }, 13);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [content, streaming]);

  return (
    <>
      {displayed}
      {streaming && displayed.length < content.length && (
        <motion.span
          className="inline-block w-[2px] h-3 bg-oro-antiguo ml-0.5 align-text-bottom"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </>
  );
});

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 6 }}
    className="flex items-center gap-1.5 bg-hueso-seda/8 border border-hueso-seda/10 px-4 py-3 w-fit"
    style={{ background: "rgba(229,219,214,0.06)" }}
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-oro-antiguo block"
        animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
        transition={{ duration: 0.9, delay: i * 0.16, repeat: Infinity }}
      />
    ))}
  </motion.div>
);

// ─── Product Card ─────────────────────────────────────────────────────────────
const SidebarProduct = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: 14 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.06, duration: 0.35 }}
  >
    <Link
      href={`/product/${product.id}`}
      className="group flex gap-3 px-4 py-3.5 border-b border-hueso-seda/8 hover:bg-hueso-seda/5 transition-all duration-300 block"
      style={{ borderColor: "rgba(229,219,214,0.08)" }}
    >
      {/* Image */}
      <div className="w-14 flex-shrink-0 relative overflow-hidden bg-hueso-seda/5" style={{ height: "4.5rem" }}>
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="56px"
            className="object-cover group-hover:scale-110 transition-transform duration-600"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gem size={16} className="text-hueso-seda/20" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-hueso-seda font-medium group-hover:text-oro-antiguo transition-colors leading-snug line-clamp-2">
            {product.name}
          </p>
          {product.collection && (
            <p className="text-[8px] uppercase tracking-widest text-oro-antiguo/50 mt-0.5">
              {product.collection}
            </p>
          )}
        </div>
        <p className="text-[10px] text-oro-antiguo font-medium mt-1">
          ${product.price.toLocaleString("es-MX")} MXN
        </p>
      </div>

      {/* Arrow */}
      <div className="self-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={12} className="text-oro-antiguo" />
      </div>
    </Link>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const AIConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "products">("chat");
  const [recommended, setRecommended] = useState<Product[]>(getInitialProducts);
  const [streamingDone, setStreamingDone] = useState<Set<string>>(new Set(["init"]));
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 60);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Core send logic
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setHasInteracted(true);

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
        streaming: false,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      const delay = 900 + Math.random() * 600;
      setTimeout(() => {
        const { text: responseText, filter } = getResponse(trimmed);
        const filtered = PRODUCTS.filter(filter).slice(0, 6);
        setRecommended(filtered.length >= 2 ? filtered : getInitialProducts());

        const assistantId = `a-${Date.now()}`;
        const assistantMsg: ChatMessage = {
          id: assistantId,
          role: "assistant",
          content: responseText,
          streaming: true,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, delay);
    },
    [isTyping]
  );

  const handleSend = useCallback(() => {
    sendMessage(input);
    setInput("");
  }, [input, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const markDone = useCallback((id: string) => {
    setStreamingDone((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed z-[100] bottom-20 right-4 md:bottom-8 md:right-28">

      {/* ── Panel ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            key="concierge-panel"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={[
              /* mobile: full screen */
              "fixed inset-0",
              /* desktop: floating panel */
              "md:inset-auto md:bottom-24 md:right-8",
              "md:w-[740px] lg:w-[860px]",
              "md:h-[620px] lg:h-[700px]",
              /* shared */
              "bg-verde-ebano",
              "shadow-[0_32px_80px_rgba(0,0,0,0.5)]",
              "border border-oro-antiguo/15",
              "flex flex-col overflow-hidden",
            ].join(" ")}
          >

            {/* ── TOP BAR (shared) ────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-oro-antiguo/10 flex-shrink-0 relative">
              {/* glow line */}
              <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-oro-antiguo/25 to-transparent" />

              {/* Identity */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border border-oro-antiguo/30 flex items-center justify-center">
                    <Sparkles size={13} className="text-oro-antiguo" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-verde-ebano" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.45em] text-hueso-seda font-medium">
                    Concierge Digital
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-hueso-seda/35">
                    En línea · Minerva Alcaraz
                  </span>
                </div>
              </div>

              {/* Mobile tabs */}
              <div className="flex items-center gap-1 md:hidden">
                {(["chat", "products"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={[
                      "px-3 py-1.5 text-[8px] uppercase tracking-widest transition-colors",
                      activeTab === tab
                        ? "bg-oro-antiguo text-verde-ebano font-semibold"
                        : "text-hueso-seda/40 hover:text-hueso-seda",
                    ].join(" ")}
                  >
                    {tab === "chat" ? "Chat" : "Piezas"}
                  </button>
                ))}
              </div>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-hueso-seda/30 hover:text-hueso-seda transition-colors ml-2 md:ml-0"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* ── BODY ────────────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

              {/* ── LEFT: CHAT ──────────────────────────────────────────── */}
              <div
                className={[
                  "flex flex-col",
                  /* mobile visibility controlled by tab */
                  activeTab === "products" ? "hidden" : "flex",
                  "md:flex",
                  /* desktop split */
                  "w-full md:w-[56%] md:border-r md:border-oro-antiguo/10",
                ].join(" ")}
              >
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto concierge-scroll px-4 md:px-5 py-5 space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {/* Assistant avatar */}
                        {msg.role === "assistant" && (
                          <div className="w-5 h-5 rounded-full border border-oro-antiguo/30 flex items-center justify-center flex-shrink-0 mb-0.5">
                            <Sparkles size={8} className="text-oro-antiguo" />
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className={[
                            "max-w-[82%] px-4 py-3 text-[11px] leading-relaxed",
                            msg.role === "user"
                              ? "bg-oro-antiguo text-verde-ebano font-medium"
                              : "border border-hueso-seda/12 text-hueso-seda font-light",
                          ].join(" ")}
                          style={
                            msg.role === "assistant"
                              ? { background: "rgba(229,219,214,0.07)", borderColor: "rgba(229,219,214,0.10)" }
                              : undefined
                          }
                        >
                          {msg.role === "assistant" ? (
                            <StreamingBubble
                              content={msg.content}
                              streaming={msg.streaming && !streamingDone.has(msg.id)}
                              onDone={() => markDone(msg.id)}
                            />
                          ) : (
                            msg.content
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <div className="flex items-end gap-2 justify-start">
                        <div className="w-5 h-5 rounded-full border border-oro-antiguo/30 flex items-center justify-center flex-shrink-0">
                          <Sparkles size={8} className="text-oro-antiguo" />
                        </div>
                        <TypingIndicator />
                      </div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick prompts — only before first interaction */}
                <AnimatePresence>
                  {!hasInteracted && (
                    <motion.div
                      initial={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 md:px-5 pb-2 flex gap-2 flex-wrap overflow-hidden flex-shrink-0"
                    >
                      {QUICK_PROMPTS.map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setInput("");
                            sendMessage(q);
                          }}
                          className="flex-shrink-0 px-3 py-1.5 border border-hueso-seda/15 text-[8px] uppercase tracking-wider text-hueso-seda/50 hover:border-oro-antiguo hover:text-oro-antiguo transition-all duration-300 whitespace-nowrap"
                        >
                          {q}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input row */}
                <div
                  className="px-4 md:px-5 py-3.5 border-t border-oro-antiguo/10 flex-shrink-0"
                  style={{ borderColor: "rgba(203,182,123,0.10)" }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe tu consulta..."
                      disabled={isTyping}
                      className="flex-1 px-4 py-3 text-[11px] text-hueso-seda placeholder:text-hueso-seda/25 outline-none border border-hueso-seda/10 focus:border-oro-antiguo/40 transition-colors disabled:opacity-40"
                      style={{ background: "rgba(229,219,214,0.04)" }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="w-11 h-11 flex items-center justify-center bg-oro-antiguo text-verde-ebano disabled:opacity-25 hover:bg-hueso-seda transition-colors flex-shrink-0"
                    >
                      <Send size={14} strokeWidth={2} />
                    </motion.button>
                  </div>
                  <p className="text-[7px] text-hueso-seda/20 mt-1.5 tracking-[0.25em] uppercase text-center">
                    Enter para enviar
                  </p>
                </div>
              </div>

              {/* ── RIGHT: PRODUCTS ─────────────────────────────────────── */}
              <div
                className={[
                  "flex flex-col",
                  activeTab === "chat" ? "hidden" : "flex",
                  "md:flex md:w-[44%]",
                  "bg-verde-ebano",
                ].join(" ")}
                style={{ background: "rgba(44,55,41,0.97)" }}
              >
                {/* Panel header */}
                <div className="px-5 py-4 border-b border-oro-antiguo/10 flex-shrink-0">
                  <p className="text-[8px] uppercase tracking-[0.7em] text-oro-antiguo">
                    Recomendaciones
                  </p>
                  <p className="text-[10px] text-hueso-seda/40 mt-0.5 font-light">
                    Basadas en tu consulta
                  </p>
                </div>

                {/* Product list */}
                <div className="flex-1 overflow-y-auto concierge-scroll">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={recommended.map((p) => p.id).join("-")}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {recommended.map((product, i) => (
                        <SidebarProduct key={product.id} product={product} index={i} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* CTA footer */}
                <div className="px-5 py-4 border-t border-oro-antiguo/10 flex-shrink-0">
                  <Link
                    href="/shop"
                    className="group flex items-center justify-center gap-2 w-full py-3 border border-hueso-seda/15 text-[9px] uppercase tracking-[0.4em] text-hueso-seda/40 hover:border-oro-antiguo hover:text-oro-antiguo transition-all duration-400"
                  >
                    Ver catálogo completo
                    <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>{/* /BODY */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Toggle Button ──────────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.91 }}
        onClick={() => setIsOpen((o) => !o)}
        className={[
          "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl border transition-all duration-500",
          isOpen
            ? "bg-oro-antiguo text-verde-ebano border-oro-antiguo"
            : "bg-verde-ebano text-oro-antiguo border-oro-antiguo/30 hover:border-oro-antiguo/60",
        ].join(" ")}
        aria-label={isOpen ? "Cerrar Concierge" : "Abrir Concierge Digital"}
      >
        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.span
            className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full border border-oro-antiguo/20"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div
              key="spark"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
