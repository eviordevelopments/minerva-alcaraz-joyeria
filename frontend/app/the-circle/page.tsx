"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
  Crown, Star, Package, Heart, MessageCircle, Gem, ArrowRight,
  Palette, RotateCcw, Truck, Album, ShieldCheck, Sparkles, Layers,
  ChevronDown
} from "lucide-react";

/* ─────────────────────────────────────────
   Benefit Tier Data
───────────────────────────────────────── */
const benefits = [
  {
    icon: Crown,
    title: "Concierge Dedicado",
    description: "Un artesano asignado a usted. Responde en menos de 4 horas. Disponible por WhatsApp, correo y cita presencial en el atelier.",
    accent: "Exclusivo para Miembros"
  },
  {
    icon: Star,
    title: "Acceso Prioritario",
    description: "Cada nueva colección llega a usted 72 horas antes de su presentación pública. Las piezas de edición limitada son reservadas con su nombre.",
    accent: "72h de ventaja"
  },
  {
    icon: Gem,
    title: "Colecciones Reservadas",
    description: "Acceso a piezas que nunca se publicarán en el catálogo general. Un universo paralelo, diseñado exclusivamente para The Circle.",
    accent: "Solo aquí"
  },
  {
    icon: Album,
    title: "Álbumes de Legado",
    description: "Su colección personal documentada fotográficamente. Historia, cuidado y certificado de autenticidad de cada pieza que ha custodiado.",
    accent: "Memoria eterna"
  },
  {
    icon: Heart,
    title: "Listas de Deseos Curadas",
    description: "Su lista de deseos es analizada por nuestro equipo. Recibe alertas personalizadas cuando una pieza afín a su gusto está disponible.",
    accent: "Curaduría humana"
  },
  {
    icon: Truck,
    title: "Envíos Prioritarios y Gratuitos",
    description: "Cada envío es una experiencia. Caja de cedro, papel tisú satinado, sello de lacre. Gratuito y entregado en 48h.",
    accent: "Siempre incluido"
  },
  {
    icon: RotateCcw,
    title: "Devoluciones Extendidas",
    description: "90 días para reflexionar. Si una pieza no vibra con su esencia, la devuelve sin preguntas. Garantía vitalicia contra defectos.",
    accent: "90 días + vitalicia"
  },
  {
    icon: Palette,
    title: "Personalización Total",
    description: "Modifique cualquier pieza del catálogo: piedras, metales, grabados, dimensiones. Su visión, materializada por manos maestras.",
    accent: "Sin límite creativo"
  },
  {
    icon: Layers,
    title: "Co-Creación",
    description: "Diseñe desde cero con Minerva Alcaraz. Un proceso íntimo de cuatro sesiones de diseño para crear la pieza que solo usted existirá.",
    accent: "Una pieza en el mundo"
  },
  {
    icon: ShieldCheck,
    title: "Garantía de Autenticidad",
    description: "Certificado NFT y físico de autenticidad para cada pieza. Valor de reventa documentado y asesoría en herencia de joyería.",
    accent: "Certificación oficial"
  },
];

/* ─────────────────────────────────────────
   Gallery Pieces
───────────────────────────────────────── */
const galleryPieces = [
  { src: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-51.JPG", label: "Diseño de Autor" },
  { src: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778279752/minerva_joyeria/products/escencia/s5lcje72gpht7y1eh2nw.jpg", label: "Escencia" },
  { src: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-100.jpg", label: "Serpientes" },
  { src: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-3.JPG", label: "Etérea" },
  { src: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-52.jpg", label: "Pieza Única" },
];

/* ─────────────────────────────────────────
   FAQ Accordion
───────────────────────────────────────── */
const faqs = [
  {
    q: "¿Cuál es el costo de la membresía The Circle?",
    a: "La membresía The Circle es completamente gratuita. Está disponible por invitación o al realizar su primera adquisición. Los privilegios se activan de forma inmediata."
  },
  {
    q: "¿Cómo funciona el servicio de Co-Creación?",
    a: "Es un proceso de cuatro sesiones: Consulta de inspiración, Presentación de bocetos, Refinamiento en taller y Entrega ceremonial. Disponible con agenda previa vía Concierge."
  },
  {
    q: "¿Los envíos prioritarios aplican en todo México?",
    a: "Sí. Ciudad de México en 24h, resto del país en 48–72h. Para envíos internacionales, coordinamos con servicios de valija diplomática en casos especiales."
  },
  {
    q: "¿Cómo accedo a las Colecciones Reservadas?",
    a: "Una vez dentro de The Circle, encontrará una sección exclusiva en su panel de miembro. También recibe notificaciones directas de su Concierge cuando llegan nuevas piezas."
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-hueso-seda/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-start gap-6 py-7 text-left"
      >
        <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-hueso-seda font-light leading-relaxed">{q}</span>
        <ChevronDown
          size={14}
          strokeWidth={1}
          className={`text-oro-antiguo flex-shrink-0 mt-0.5 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-[11px] md:text-xs text-hueso-seda/50 font-light leading-loose italic pb-7 max-w-2xl">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function TheCirclePage() {
  return (
    <main className="min-h-screen bg-verde-ebano">
      <Header theme="dark" />

      {/* HERO — Full Bleed Invitation */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Background collage */}
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 gap-0">
          {galleryPieces.map((piece, i) => (
            <div key={i} className={`relative overflow-hidden ${i === 2 ? "col-span-1 brightness-[0.35]" : "brightness-[0.25]"}`}>
              <Image src={piece.src} alt={piece.label} fill className="object-cover" />
            </div>
          ))}
          {/* Overall dark overlay */}
          <div className="absolute inset-0 bg-verde-ebano/60" />
          {/* Gradient to bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-verde-ebano via-verde-ebano/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 luxury-container pb-24 md:pb-32 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col gap-6 max-w-3xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-oro-antiguo/40 flex items-center justify-center">
                <Crown size={16} className="text-oro-antiguo" strokeWidth={1} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] uppercase tracking-[0.8em] text-oro-antiguo">Membresía de Élite</span>
              </div>
            </div>

            <h1 className="font-display text-hueso-seda text-6xl md:text-8xl lg:text-[120px] leading-none uppercase tracking-wider">
              The<br />Circle
            </h1>

            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-oro-antiguo/40" />
              <p className="text-hueso-seda/70 text-xs md:text-sm uppercase tracking-[0.4em] font-light italic">
                "La cofradía de quienes habitan en la eternidad"
              </p>
            </div>

            <p className="text-hueso-seda/60 text-sm md:text-base font-light leading-loose max-w-xl">
              Una membresía que no se solicita, se concede. Acceso a un universo paralelo donde cada joya tiene nombre y cada experiencia se diseña exclusivamente para usted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                href="/auth"
                className="flex items-center justify-center gap-3 bg-oro-antiguo text-verde-ebano text-[10px] uppercase tracking-[0.5em] py-4 px-10 hover:bg-hueso-seda transition-colors duration-500 font-medium group"
              >
                Solicitar Invitación
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => document.getElementById("beneficios")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-center gap-3 border border-hueso-seda/20 text-hueso-seda text-[10px] uppercase tracking-[0.4em] py-4 px-8 hover:border-oro-antiguo hover:text-oro-antiguo transition-colors duration-500"
              >
                Descubrir Beneficios
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-bounce">
          <div className="w-[1px] h-10 bg-oro-antiguo/30" />
          <ChevronDown size={12} className="text-oro-antiguo/40" strokeWidth={1} />
        </div>
      </section>

      {/* LEGACY BADGE STRIP */}
      <div className="w-full border-y border-oro-antiguo/10 bg-verde-ebano py-5 overflow-hidden">
        <div className="flex items-center gap-16 luxury-container">
          <span className="px-4 py-1.5 border border-oro-antiguo/30 text-[8px] uppercase tracking-[0.6em] text-oro-antiguo font-medium whitespace-nowrap flex items-center gap-2">
            <Crown size={10} /> Miembro Legacy
          </span>
          <div className="flex items-center gap-10 overflow-x-auto no-scrollbar">
            {["Concierge Dedicado", "Envíos Gratuitos", "90 Días de Devolución", "Co-Creación", "Acceso Reservado"].map((t) => (
              <span key={t} className="text-[9px] uppercase tracking-[0.4em] text-hueso-seda/30 whitespace-nowrap">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFITS GRID */}
      <section id="beneficios" className="py-24 md:py-40 luxury-container">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-5 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-oro-antiguo/50" />
              <span className="text-[9px] uppercase tracking-[0.8em] text-oro-antiguo">Privilegios</span>
            </div>
            <h2 className="font-display text-hueso-seda text-4xl md:text-6xl uppercase leading-tight">
              Lo Que Recibe<br />Como Miembro
            </h2>
            <p className="text-hueso-seda/50 text-sm font-light leading-loose italic">
              "Cada privilegio fue diseñado para honrar la relación entre quienes crean belleza y quienes la custodian."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 border-t border-l border-oro-antiguo/10">
            {benefits.map(({ icon: Icon, title, description, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
                className="flex flex-col gap-5 p-8 md:p-10 border-b border-r border-oro-antiguo/10 group hover:bg-hueso-seda/3 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 border border-oro-antiguo/20 flex items-center justify-center group-hover:border-oro-antiguo/50 transition-colors">
                    <Icon size={16} className="text-oro-antiguo" strokeWidth={1.2} />
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.4em] text-oro-antiguo/50 border border-oro-antiguo/15 px-2 py-1 text-right">
                    {accent}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-hueso-seda font-medium">{title}</h3>
                  <p className="text-[10px] md:text-[11px] text-hueso-seda/45 font-light leading-loose">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONCIERGE SHOWCASE */}
      <section className="py-0">
        <div className="flex flex-col md:flex-row">
          {/* Image side */}
          <div className="relative w-full md:w-1/2 h-[400px] md:h-[700px] overflow-hidden group">
            <Image
              src="https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275666/minerva_joyeria/products/escencia/Minerva_Joyeria_1_-10.jpg"
              alt="Concierge Minerva Alcaraz"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-verde-ebano/50 hidden md:block" />
          </div>

          {/* Content side */}
          <div className="w-full md:w-1/2 bg-hueso-seda/5 border-l border-oro-antiguo/10 flex flex-col justify-center p-12 md:p-16 lg:p-24 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-oro-antiguo/50" />
              <span className="text-[9px] uppercase tracking-[0.8em] text-oro-antiguo">Servicio</span>
            </div>
            <h2 className="font-display text-hueso-seda text-3xl md:text-5xl uppercase leading-tight">
              Su Concierge<br />Dedicado
            </h2>
            <p className="text-hueso-seda/60 text-sm font-light leading-loose">
              No un bot. No una línea de atención. Una persona que conoce sus preferencias, su historial y su visión estética. Disponible para resolver consultas, organizar visitas al atelier, agendar co-creaciones y coordinar cada detalle de su experiencia.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Respuesta en menos de 4 horas en días hábiles",
                "Comunicación directa por WhatsApp o correo dedicado",
                "Acompañamiento en el proceso de co-creación",
                "Coordinación de envíos y mantenimiento de piezas",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-oro-antiguo mt-2 flex-shrink-0" />
                  <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-hueso-seda/60 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/personalized"
              className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-oro-antiguo border-b border-oro-antiguo/30 pb-1 w-fit hover:border-oro-antiguo transition-colors group"
            >
              Conocer el Atelier
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="py-16 md:py-24 luxury-container">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.8em] text-oro-antiguo/60">Colecciones Reservadas</span>
            <Link href="/shop" className="text-[9px] uppercase tracking-[0.4em] text-hueso-seda/30 hover:text-oro-antiguo transition-colors flex items-center gap-2">
              Explorar Catálogo <ArrowRight size={10} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {galleryPieces.map((piece, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative overflow-hidden group cursor-pointer ${i === 0 ? "col-span-2 md:col-span-2 h-[300px]" : "h-[150px] md:h-[300px]"}`}
              >
                <Image
                  src={piece.src}
                  alt={piece.label}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-108 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute bottom-3 left-3 bg-verde-ebano/40 backdrop-blur-sm px-2 py-1">
                  <span className="text-[7px] uppercase tracking-[0.4em] text-hueso-seda/70">{piece.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 border-t border-oro-antiguo/10 luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-oro-antiguo/50" />
              <span className="text-[9px] uppercase tracking-[0.8em] text-oro-antiguo">Preguntas</span>
            </div>
            <h2 className="font-display text-hueso-seda text-3xl md:text-4xl uppercase leading-tight">
              Lo Que Desea<br />Saber
            </h2>
          </div>
          <div className="md:col-span-8 flex flex-col">
            {faqs.map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 md:py-40 border-t border-oro-antiguo/10">
        <div className="luxury-container flex flex-col items-center text-center gap-10">
          <Sparkles size={28} className="text-oro-antiguo" strokeWidth={1} />
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="font-display text-hueso-seda text-4xl md:text-6xl uppercase leading-tight">
              Su Lugar Está<br />Guardado
            </h2>
            <p className="text-hueso-seda/50 text-sm font-light leading-loose italic">
              "La pertenencia no se compra. Se cultiva con el tiempo, la belleza y la fe en lo que dura."
            </p>
          </div>
          <Link
            href="/auth"
            className="flex items-center gap-3 bg-oro-antiguo text-verde-ebano text-[10px] uppercase tracking-[0.5em] py-5 px-14 hover:bg-hueso-seda transition-colors duration-500 font-medium group"
          >
            Unirse a The Circle
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-[8px] uppercase tracking-[0.4em] text-hueso-seda/20">Gratuito · Por invitación · Sin compromisos</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
