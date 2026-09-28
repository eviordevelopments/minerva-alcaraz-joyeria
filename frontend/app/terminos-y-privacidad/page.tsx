"use client";

import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function TerminosYPrivacidadPage() {
  return (
    <main className="min-h-screen bg-hueso-seda text-verde-ebano selection:bg-verde-ebano selection:text-hueso-seda">
      <Header />

      {/* Hero Header */}
      <section className="pt-36 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-8 md:px-16 border-b border-verde-ebano/10 bg-verde-ebano text-hueso-seda relative">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <span className="text-xs sm:text-sm uppercase tracking-[0.4em] text-oro-antiguo font-medium">
            Acuerdo de Transparencia
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display leading-tight">
            Términos, Condiciones y Privacidad
          </h1>
          <p className="text-base font-light text-hueso-seda/80 leading-relaxed max-w-2xl mx-auto">
            En Minerva Alcaraz Joyería, protegemos tu legado y tus datos con el mismo rigor y dedicación con el que forjamos nuestras piezas. A continuación, detallamos nuestras políticas de privacidad y los términos de servicio de THE CIRCLE.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-16">
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-verde-ebano/20 pb-4">
            <Shield className="text-oro-antiguo" size={28} />
            <h2 className="text-2xl sm:text-3xl font-display text-verde-ebano">1. Condiciones de THE CIRCLE</h2>
          </div>
          <p className="text-base text-verde-ebano/80 font-light leading-relaxed">
            Al registrarte y unirte a <strong>THE CIRCLE</strong>, adquieres acceso prioritario a colecciones exclusivas, invitaciones a eventos privados y un servicio de conserjería personalizado. Este es un club de privilegios, y tu membresía está condicionada al respeto mutuo, la confidencialidad de los adelantos presentados y el uso legítimo de la plataforma. Nos reservamos el derecho de revocar el acceso ante actividades inusuales, reventa no autorizada o comportamientos fraudulentos.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-verde-ebano/20 pb-4">
            <Eye className="text-oro-antiguo" size={28} />
            <h2 className="text-2xl sm:text-3xl font-display text-verde-ebano">2. Uso de Datos y Privacidad</h2>
          </div>
          <p className="text-base text-verde-ebano/80 font-light leading-relaxed">
            Recolectamos únicamente la información indispensable para brindarte una experiencia de lujo a tu medida: nombre, correo electrónico, direcciones de entrega e historial de compras. Estos datos nos permiten personalizar tu ritual de desempaque, procesar tus pagos de forma segura y asesorarte en futuras elecciones. Minerva Alcaraz Joyería <strong>no vende, no alquila y no cede</strong> tu información personal a terceros bajo ninguna circunstancia ajena al servicio logístico y de pagos.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-verde-ebano/20 pb-4">
            <Lock className="text-oro-antiguo" size={28} />
            <h2 className="text-2xl sm:text-3xl font-display text-verde-ebano">3. Uso de Cookies y Sesiones</h2>
          </div>
          <p className="text-base text-verde-ebano/80 font-light leading-relaxed">
            Implementamos cookies estrictamente necesarias para el funcionamiento del sitio y cookies funcionales para la gestión de la sesión. Las cookies nos permiten recordar tu sesión activa, tus piezas favoritas y los artículos en tu bolsa de compras para que tu experiencia sea ininterrumpida. Utilizamos políticas <em>Consent-Aware</em> (gestión de almacenamiento sensible al consentimiento), asegurando que tu sesión nunca se comparta erróneamente entre dispositivos distintos y que tú tengas el control sobre el mantenimiento de tu acceso.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-verde-ebano/20 pb-4">
            <Database className="text-oro-antiguo" size={28} />
            <h2 className="text-2xl sm:text-3xl font-display text-verde-ebano">4. Almacenamiento y Seguridad de la Información</h2>
          </div>
          <p className="text-base text-verde-ebano/80 font-light leading-relaxed">
            Tu información sensible se almacena y cifra utilizando la infraestructura de <strong>Supabase</strong>, cumpliendo con estándares internacionales de seguridad en bases de datos. Los accesos están regidos por estrictas políticas de seguridad a nivel de fila (RLS), lo que garantiza que ni siquiera nuestros desarrolladores puedan acceder a contraseñas o información privada. Únicamente el equipo de Conserjería de Minerva Alcaraz tiene acceso al registro histórico de tus piezas para ofrecerte asistencia.
          </p>
        </div>

        <div className="bg-white/50 border border-verde-ebano/10 p-8 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-verde-ebano font-semibold">Consentimiento</p>
          <p className="text-base text-verde-ebano/80 font-light italic">
            Al crear una cuenta, unirte a THE CIRCLE y navegar por nuestro sitio web, manifiestas tu acuerdo y aceptación íntegra de estas políticas de privacidad y términos de servicio.
          </p>
        </div>

      </section>

      <Footer />
    </main>
  );
}
