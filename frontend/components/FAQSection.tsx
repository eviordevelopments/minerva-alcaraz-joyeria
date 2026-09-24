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
            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
            animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }}
            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
          >
            <div className="pb-8 text-base md:text-base text-verde-ebano/80 leading-loose max-w-4xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CareGuideTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span 
        className="text-oro-antiguo underline cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        nuestra guía de cuidados
      </span>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            style={{ pointerEvents: 'auto' }}
          >
            <div 
              className="absolute inset-0 bg-verde-ebano/80 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-3xl bg-hueso-seda border border-oro-antiguo/30 shadow-2xl p-6 sm:p-10 md:p-12 text-verde-ebano text-left max-h-[85vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-verde-ebano/50 hover:text-verde-ebano"
              >
                <Minus size={24} strokeWidth={1} />
              </button>
              
              <h4 className="font-display italic text-2xl md:text-3xl text-center text-oro-antiguo mb-4">CUIDADO DE TU JOYA</h4>
              
              <div className="text-[11px] md:text-xs font-light text-center leading-relaxed max-w-lg mx-auto opacity-80 mb-8">
                <p>Gracias por elegir una pieza creada con dedicación y cuidado. Cada joya está hecha para acompañarte durante muchos años.</p>
                <p className="mt-2">Siguiendo estas sencillas recomendaciones, conservará su belleza y brillo por más tiempo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="flex flex-col gap-4">
                  <h5 className="font-display text-lg md:text-xl uppercase tracking-widest text-oro-antiguo border-b border-verde-ebano/10 pb-2">Joyería de Plata .925</h5>
                  <ul className="list-disc pl-4 space-y-2 text-[11px] md:text-xs opacity-80 leading-relaxed font-light">
                    <li>Guarda tu joya en su estuche o bolsa cuando no la estés usando.</li>
                    <li>Evita el contacto con perfumes, cremas, maquillaje, cloro y productos de limpieza.</li>
                    <li>Retírala antes de bañarte, nadar o realizar ejercicio intenso.</li>
                    <li>Guárdala en un lugar fresco y seco para reducir la oxidación natural.</li>
                    <li>Si el acabado de la pieza es oscuro (oxidado) solo necesitas frotar la pieza con un paño limpio y seco para darle brillo, si usas químicos especiales para limpiar joyería el acabo se desvanece.</li>
                  </ul>
                  <p className="text-[10px] italic opacity-60 mt-4 bg-verde-ebano/5 p-3 border border-verde-ebano/10">
                    Importante: La plata puede oscurecerse con el tiempo debido a la humedad y al contacto con el ambiente o con la piel. Esto es un proceso completamente natural y puede recuperarse fácilmente con una limpieza adecuada.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <h5 className="font-display text-lg md:text-xl uppercase tracking-widest text-oro-antiguo border-b border-verde-ebano/10 pb-2">Joyería de Oro</h5>
                  <ul className="list-disc pl-4 space-y-2 text-[11px] md:text-xs opacity-80 leading-relaxed font-light">
                    <li>Evita el contacto con perfumes, cremas, cloro y otros productos químicos.</li>
                    <li>Retira tu joya antes de hacer ejercicio, practicar deportes o realizar actividades que puedan golpearla.</li>
                    <li>Guárdala por separado para evitar rayaduras.</li>
                    <li>Para mantener su brillo, límpiala ocasionalmente con agua tibia, jabón neutro y un paño suave, secándola completamente.</li>
                  </ul>

                  <div className="mt-auto bg-oro-antiguo/10 p-4 md:p-5 border border-oro-antiguo/20">
                    <h5 className="font-display italic mb-2 text-oro-antiguo text-base md:text-lg">Un pequeño consejo</h5>
                    <p className="text-[10px] md:text-[11px] font-light opacity-80 leading-relaxed">
                      Recuerda que la joyería debe ser el último detalle que te pongas al arreglarte y el primero que retires al terminar el día. Este sencillo hábito ayudará a conservar tus piezas en excelentes condiciones.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


export const FAQSection = () => {
  const faqData = [
    {
      category: "Pedidos y Pagos",
      items: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PayPal. Los pagos se hacen únicamente a través de la tienda en línea gracias a la incorporación de Stripe que proporciona seguridad y rapidez en las transacciones dentro de la tienda para comprar con total tranquilidad."
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
          answer: (
            <span>
              Las piezas pueden ser devueltas en un plazo de 10 días naturales, siempre que conserven sus sellos de seguridad y empaque original. Para piezas personalizadas, consulte nuestros <a href="https://avpmuuihbxginosffhuf.supabase.co/storage/v1/object/public/public-bucket/politica-de-devoluciones.pdf" target="_blank" rel="noopener noreferrer" className="text-oro-antiguo hover:underline">términos de devoluciones</a>.
            </span>
          )
        },
        {
          question: "¿HACEN ENVÍOS NACIONALES?",
          answer: "Sí, llevamos la elegancia de Minerva Alcaraz a cualquier parte del México a través de servicios de mensajería  que garantizan la integridad de su pieza."
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
              Visita nuestra <Link href="/guia-de-tallas" className="text-oro-antiguo hover:underline">Guía de Tallas</Link> donde encontrarás un instructivo detallado para medir tu dedo, muñeca o elegir el largo de cadena ideal.
            </span>
          )
        },
        {
          question: "¿Cómo cuido mi joyería?",
          answer: (
            <span>
              Recomendamos evitar el contacto con químicos y seguir <CareGuideTrigger /> incluido en la sección principal para mantener el brillo y la esencia de su pieza de por vida.
            </span>
          )
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
            <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] md:tracking-[0.6em] text-verde-ebano/60">CLARIDAD Y CONFIANZA EN TU EXPERIENCIA</p>
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
