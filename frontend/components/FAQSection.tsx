"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { LuxuryButton } from "./DesignSystem";
import Link from "next/link";

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
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
            <p className="pb-8 text-base md:text-base text-verde-ebano/80 leading-loose max-w-4xl">
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
          answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex) y PayPal. Los pagos se hacen únicamente a través de la tienda en línea gracias a la incorporación de Stripe que proporciona seguridad y rapidez en las transacciones dentro de la tienda para comprar con total tranquilidad."
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
          answer: "Las piezas pueden ser devueltas en un plazo de 10 días naturales, siempre que conserven sus sellos de seguridad y empaque original. Para piezas personalizadas, consulte nuestros términos específicos."
        },
        {
          question: "¿Hacen envíos internacionales?",
          answer: "No hay envíos internacionales."
        }
      ]
    },
    {
      category: "Guía de Tallas y Cuidado",
      items: [
        {
          question: "¿Cómo sé cuál es mi talla?",
          answer: (
            <span>
              Visite nuestra <Link href="/guia-de-tallas" className="text-oro-antiguo hover:underline">Guía de Tallas</Link> donde encontrará un instructivo detallado para medir su dedo, muñeca o elegir el largo de cadena ideal para su fisonomía en un solo hub en pantalla flotante.
            </span>
          )
        },
        {
          question: "¿Cómo cuido mi joyería?",
          answer: "Recomendamos evitar el contacto con químicos y seguir nuestro Ritual de Cuidados incluido en la sección de cada joya para mantener el brillo y la esencia de su pieza de por vida."
        }
      ]
    },
    {
      category: "Personalizados",
      items: [
        {
          question: "¿Puedo diseñar una pieza desde cero?",
          answer: (
            <span>
              Absolutamente. La cocreación es parte de nuestro ADN. Contáctenos vía WhatsApp para agendar una cita de diseño con nuestros maestros joyeros o desde nuestro <Link href="/concierge" className="text-oro-antiguo hover:underline">concierge</Link>.
            </span>
          )
        }
      ]
    }
  ];

  return (
    <section className="py-16 md:py-48 bg-hueso-seda border-t border-plata-niebla/10">
      <div className="luxury-container w-full">
        <div className="border border-verde-ebano p-5 sm:p-8 md:p-16 lg:p-24 flex flex-col gap-10 md:gap-24">
          
          <div className="flex flex-col gap-4 md:gap-6 text-center">
            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-display text-verde-ebano">Preguntas Frecuentes</h2>
            <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] md:tracking-[0.6em] text-verde-ebano/60">Claridad y Confianza en su Experiencia</p>
          </div>

        <div className="flex flex-col gap-16">
          {faqData.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-8">
              <h3 className="text-base md:text-base uppercase tracking-[0.2em] text-oro-antiguo border-l-2 border-oro-antiguo pl-6">
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

        <div className="mt-6 md:mt-8 bg-authority py-5 px-6 sm:py-6 sm:px-8 md:py-7 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 shadow-xl border border-oro-antiguo/20 max-w-4xl mx-auto w-full">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl md:text-2xl font-display text-oro-antiguo">¿Aún tiene dudas?</h4>
            <p className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] text-hueso-seda/80">Nuestro Concierge Digital está a su disposición</p>
          </div>
          <LuxuryButton 
            variant="gold" 
            className="!py-2.5 !px-5 flex items-center justify-center gap-2.5 text-xs uppercase tracking-[0.2em] w-full sm:w-auto flex-shrink-0"
            onClick={() => window.open('https://wa.me/', '_blank')}
          >
            <MessageCircle size={15} className="flex-shrink-0" /> Contactar a Concierge
          </LuxuryButton>
        </div>

        </div>
      </div>
    </section>
  );
};
