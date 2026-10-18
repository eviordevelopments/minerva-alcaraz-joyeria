import Link from 'next/link';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hueso-seda flex flex-col justify-between selection:bg-oro-antiguo/30">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
        <div className="max-w-xl w-full text-center border border-verde-ebano/20 p-8 md:p-14 bg-hueso-seda/50 backdrop-blur-sm shadow-sm">
          <span className="text-xs uppercase tracking-[0.4em] text-oro-antiguo font-sans mb-3 block">
            404 — Pieza No Encontrada
          </span>
          
          <h1 className="text-3xl md:text-5xl font-display text-verde-ebano uppercase tracking-wider mb-6">
            Página No Disponible
          </h1>

          <p className="text-verde-ebano/75 font-sans font-light leading-relaxed text-sm md:text-base mb-10">
            La página que buscas ha sido trasladada o el enlace es incorrecto. Nuestro catálogo de joyería de autor y piezas de colección se encuentra disponible en nuestra tienda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-verde-ebano text-hueso-seda font-sans text-xs tracking-[0.25em] uppercase hover:bg-verde-ebano/90 transition-all duration-300"
            >
              Volver al Inicio
            </Link>
            
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 border border-verde-ebano text-verde-ebano font-sans text-xs tracking-[0.25em] uppercase hover:bg-verde-ebano/10 transition-all duration-300"
            >
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
