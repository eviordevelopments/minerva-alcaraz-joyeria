"use client";

import React from "react";
import { motion } from "framer-motion";
import { Header } from "../../components/Header";
import { FAQSection } from "../../components/FAQSection";
import { Footer } from "../../components/Footer";

export default function AtelierPage() {
  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />
      
      {/* 1. Origin Narrative */}
      <section className="pt-32 md:pt-48 pb-32 luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 flex flex-col gap-10">
            <span className="text-[10px] uppercase tracking-[0.8em] text-oro-antiguo">El Origen</span>
            <h1 className="text-4xl md:text-7xl font-display text-verde-ebano leading-tight">Manos que Custodian la Eternidad</h1>
            <p className="text-sm md:text-base leading-loose text-verde-ebano/80 font-light">
              Minerva Alcaraz nace de la convicción de que una joya no es un objeto, sino un testimonio. En nuestro atelier, el tiempo no se mide en minutos, sino en la precisión de un martilleo o la pureza de una soldadura.
            </p>
            <p className="text-sm md:text-base leading-loose text-verde-ebano/80 font-light">
              Nuestra herencia se remonta a los talleres tradicionales de Taxco, donde el metal se entiende como un lenguaje sagrado. Cada pieza que sale de nuestras manos lleva consigo el alma de quien la forjó y la promesa de acompañar a quien la porta por generaciones.
            </p>
          </div>
          <div className="lg:col-span-7 aspect-video bg-plata-niebla/10 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.4em] opacity-30">
              Video: El Ritual del Atelier (Cinemática)
            </div>
          </div>
        </div>
      </section>

      {/* 2. Philosophy & Process */}
      <section className="py-32 bg-authority">
        <div className="luxury-container grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-display text-oro-antiguo">Materia Prima Ética</h3>
            <p className="text-xs leading-loose opacity-70 font-light">
              Seleccionamos solo plata esterlina .925 y oro de 18k de fuentes responsables, asegurando que el brillo de nuestras piezas nunca opaque la dignidad de la tierra.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-display text-oro-antiguo">Maestría Sistémica</h3>
            <p className="text-xs leading-loose opacity-70 font-light">
              Fusionamos técnicas milenarias de orfebrería con estándares de ingeniería modernos para garantizar una ergonomía y durabilidad impecables.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-display text-oro-antiguo">Devoción al Detalle</h3>
            <p className="text-xs leading-loose opacity-70 font-light">
              No existe el error en el lujo, solo la oportunidad de la perfección. Cada curva y cada cierre es revisado bajo el escrutinio de tres maestros joyeros.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Designer's Vision */}
      <section className="py-32 luxury-container">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/3 aspect-[3/4] bg-plata-niebla/10 relative">
             <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.4em] opacity-30">
              Retrato: Minerva Alcaraz
            </div>
          </div>
          <div className="w-full md:w-2/3 flex flex-col gap-8">
            <blockquote className="text-2xl md:text-4xl font-display text-verde-ebano leading-snug italic">
              "Mi misión es crear objetos que hablen cuando las palabras no bastan, piezas que se conviertan en parte de la historia genética de las familias."
            </blockquote>
            <span className="text-[10px] uppercase tracking-[0.4em] text-oro-antiguo">— Minerva Alcaraz, Fundadora</span>
          </div>
        </div>
      </section>

      <FAQSection />

      <Footer />
    </main>
  );
}
