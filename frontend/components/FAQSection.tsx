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
        className="w-full py-6 flex justify-between items-center text-left hover:text-oro-antiguo transition-colors"
      >
        <span className="text-sm uppercase tracking-widest font-light">{question}</span>
        {isOpen ? <Minus size={16} strokeWidth={1} /> : <Plus size={16} strokeWidth={1} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-xs text-plata-niebla leading-loose max-w-2xl">
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
    <section className="py-32 px-8 md:px-16 bg-hueso-seda border-t border-plata-niebla/10">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-3xl font-display text-verde-ebano">Preguntas Frecuentes</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-plata-niebla">Claridad y Confianza en su Experiencia</p>
        </div>

        <div className="flex flex-col gap-12">
          {faqData.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-oro-antiguo border-l-2 border-oro-antiguo pl-4">
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

        <div className="mt-16 bg-authority p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h4 className="text-xl font-display text-oro-antiguo">¿Aún tiene dudas?</h4>
            <p className="text-[10px] uppercase tracking-widest text-hueso-seda/60">Nuestro Concierge Digital está a su disposición</p>
          </div>
          <LuxuryButton variant="secondary" className="flex items-center gap-3">
            <MessageCircle size={16} /> Contactar a Concierge
          </LuxuryButton>
        </div>
      </div>
    </section>
  );
};
