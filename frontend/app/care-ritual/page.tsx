import React from "react";
import Image from "next/image";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Sparkles } from "lucide-react";

export default function CareRitualPage() {
  return (
    <main className="min-h-screen bg-hueso-seda text-verde-ebano selection:bg-oro-antiguo/30">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 sm:pt-48 pb-16 sm:pb-24 px-4 sm:px-8 border-b border-verde-ebano/10 relative overflow-hidden bg-verde-ebano text-hueso-seda">
        {/* Abstract shapes in the background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-oro-antiguo/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-hueso-seda/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="w-12 h-[1px] bg-oro-antiguo mb-6" />
          <span className="text-xs uppercase tracking-[0.5em] text-oro-antiguo font-medium mb-4">
            El Ritual de Preservación
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display leading-tight uppercase">
            Cuidado de tu Joya
          </h1>
          <p className="mt-8 text-base sm:text-lg font-light text-hueso-seda/80 leading-relaxed max-w-2xl italic">
            "Gracias por elegir una pieza creada con dedicación y cuidado. Cada joya está hecha para acompañarte durante muchos años."
          </p>
          <div className="mt-8">
            <Sparkles className="text-oro-antiguo/50" size={24} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-24">
          
          <div className="text-center border-b border-verde-ebano/15 pb-12">
            <p className="text-lg text-verde-ebano/80 font-light leading-relaxed">
              Siguiendo estas sencillas recomendaciones, conservará su belleza y brillo por más tiempo.
            </p>
          </div>

          {/* Joyería de Plata .925 */}
          <div className="space-y-8">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
              <span className="text-xs uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Plata Sterling</span>
              <h2 className="text-3xl font-display text-verde-ebano uppercase">Joyería de Plata .925</h2>
            </div>
            <ul className="space-y-6 text-verde-ebano/80 font-light leading-relaxed">
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Guarda tu joya en su estuche o bolsa cuando no la estés usando.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Evita el contacto con perfumes, cremas, maquillaje, cloro y productos de limpieza.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Retírala antes de bañarte, nadar o realizar ejercicio intenso.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Guárdala en un lugar fresco y seco para reducir la oxidación natural.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Si el acabado de la pieza es oscuro (oxidado) solo necesitas frotar la pieza con un paño limpio y seco para darle brillo, si usas químicos especiales para limpiar joyería el acabo se desvanece.</p>
              </li>
            </ul>
            <div className="mt-8 p-6 bg-verde-ebano/5 border-l-2 border-oro-antiguo">
              <p className="text-sm font-medium text-verde-ebano uppercase tracking-widest mb-2">Importante</p>
              <p className="text-sm text-verde-ebano/80 leading-relaxed italic">
                La plata puede oscurecerse con el tiempo debido a la humedad y al contacto con el ambiente o con la piel. Esto es un proceso completamente natural y puede recuperarse fácilmente con una limpieza adecuada.
              </p>
            </div>
          </div>

          {/* Joyería de Oro */}
          <div className="space-y-8">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
              <span className="text-xs uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Oro Fino</span>
              <h2 className="text-3xl font-display text-verde-ebano uppercase">Joyería de Oro</h2>
            </div>
            <ul className="space-y-6 text-verde-ebano/80 font-light leading-relaxed">
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Evita el contacto con perfumes, cremas, cloro y otros productos químicos.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Retira tu joya antes de hacer ejercicio, practicar deportes o realizar actividades que puedan golpearla.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Guárdala por separado para evitar rayaduras.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-oro-antiguo mt-1">✦</span>
                <p>Para mantener su brillo, límpiala ocasionalmente con agua tibia, jabón neutro y un paño suave, secándola completamente.</p>
              </li>
            </ul>
          </div>

          {/* Un Pequeño Consejo */}
          <div className="bg-verde-ebano text-hueso-seda p-10 sm:p-16 text-center space-y-6 relative overflow-hidden mt-16 shadow-2xl">
            {/* Decors */}
            <div className="absolute top-0 right-0 w-24 h-24 border-l border-b border-oro-antiguo/20" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-r border-t border-oro-antiguo/20" />
            
            <span className="text-xs uppercase tracking-[0.4em] text-oro-antiguo font-semibold">Un pequeño consejo</span>
            <p className="text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto italic text-hueso-seda/90">
              "Recuerda que la joyería debe ser el último detalle que te pongas al arreglarte y el primero que retires al terminar el día. Este sencillo hábito ayudará a conservar tus piezas en excelentes condiciones."
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
