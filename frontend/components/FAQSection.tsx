"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { LuxuryButton } from "./DesignSystem";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-plata-niebla/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex justify-between items-center text-left hover:text-oro-antiguo transition-colors"
      >
        <span className="text-base md:text-xl uppercase tracking-widest font-light">{question}</span>
        {isOpen ? <Minus size={24} strokeWidth={1} /> : <Plus size={24} strokeWidth={1} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-sm md:text-base text-verde-ebano/80 leading-loose max-w-4xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection = () => {
  const faqData = [
    {
      category: "Pedidos y Pagos",
      items: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PayPal y transferencias bancarias protegidas para su total comodidad y seguridad."
        },
        {
          question: "¿Es seguro comprar en línea?",
          answer: "Absolutamente. Contamos con certificados SSL de alta seguridad y procesamiento de pagos encriptado para garantizar que su privacidad y datos financieros estén siempre protegidos."
        }
      ]
    },
    {
      category: "Envíos y Devoluciones",
      items: [
        {
          question: "¿Cuál es la política de devoluciones?",
          answer: "Las piezas pueden ser devueltas en un plazo de 15 días, siempre que conserven sus sellos de seguridad y empaque original. Para piezas personalizadas, consulte nuestros términos específicos."
        },
        {
          question: "¿Hacen envíos internacionales?",
          answer: "Sí, llevamos la elegancia de Minerva Alcaraz a cualquier parte del mundo a través de servicios de mensajería premium que garantizan la integridad de su tesoro."
        }
      ]
    },
    {
      category: "Guía de Tallas y Cuidado",
      items: [
        {
          question: "¿Cómo sé cuál es mi talla?",
          answer: "Visite nuestra Guía de Tallas donde encontrará un instructivo detallado para medir su dedo, muñeca o elegir el largo de cadena ideal para su fisonomía."
        },
        {
          question: "¿Cómo cuido mi joyería?",
          answer: "Recomendamos evitar el contacto con químicos y seguir nuestro Ritual de Cuidados incluido en la sección principal para mantener el brillo y la esencia de su pieza de por vida."
        }
      ]
    },
    {
      category: "Personalizados",
      items: [
        {
          question: "¿Puedo diseñar una pieza desde cero?",
          answer: "Absolutamente. La cocreación es parte de nuestro ADN. Contáctenos vía WhatsApp para agendar una cita de diseño con nuestros maestros joyeros."
        }
      ]
    }
  ];

  return (
    <section className="py-24 md:py-48 bg-hueso-seda border-t border-plata-niebla/10">
      <div className="luxury-container w-full">
        <div className="border border-verde-ebano p-6 md:p-16 lg:p-24 flex flex-col gap-16 md:gap-24">
          
          <div className="flex flex-col gap-6 text-center">
            <h2 className="text-5xl md:text-7xl font-display text-verde-ebano">Preguntas Frecuentes</h2>
            <p className="text-xs md:text-sm uppercase tracking-[0.6em] text-verde-ebano/60">Claridad y Confianza en su Experiencia</p>
          </div>

        <div className="flex flex-col gap-16">
          {faqData.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-8">
              <h3 className="text-sm md:text-base uppercase tracking-[0.2em] text-oro-antiguo border-l-2 border-oro-antiguo pl-6">
                {section.category}
              </h3>
              <div className="flex flex-col">
                {section.items.map((item, itemIdx) => (
                  <FAQItem key={itemIdx} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-authority p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h4 className="text-3xl md:text-4xl font-display text-oro-antiguo">¿Aún tiene dudas?</h4>
            <p className="text-xs md:text-sm uppercase tracking-widest text-hueso-seda opacity-80">Nuestro Concierge Digital está a su disposición</p>
          </div>
          <LuxuryButton variant="gold" className="flex items-center justify-center gap-4 py-4 px-8 text-sm md:text-base w-fit mx-auto lg:mx-0">
            <MessageCircle size={20} className="flex-shrink-0" /> Contactar a Concierge
          </LuxuryButton>
        </div>

        </div>
      </div>
    </section>
  );
};
