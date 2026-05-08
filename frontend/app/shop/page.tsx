"use client";

import React, { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ProductCard } from "../../components/DesignSystem";
import { Filter, ChevronDown, X, SlidersHorizontal, Sparkles } from "lucide-react";
import { PRODUCTS, Product } from "../../constants/products";
import { useSearchParams } from "next/navigation";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCollection = searchParams.get("collection");
  const initialCategory = searchParams.get("category");

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sortBy, setSortBy] = useState("Relevancia");

  useEffect(() => {
    const filters: string[] = [];
    if (initialCollection) filters.push(initialCollection);
    if (initialCategory) filters.push(initialCategory);
    if (filters.length > 0) {
      setActiveFilters(prev => {
        const newFilters = [...new Set([...prev, ...filters])];
        return newFilters;
      });
    }
  }, [initialCollection, initialCategory]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  // Dynamic filter lists
  const collections = Array.from(new Set(PRODUCTS.map(p => p.collection)));
  const categories = Array.from(new Set(PRODUCTS.map(p => p.category)));
  const materials = Array.from(new Set(PRODUCTS.flatMap(p => p.materials)));

  // Filter logic
  let filteredProducts = PRODUCTS.filter(p => {
    if (activeFilters.length === 0) return true;
    
    return activeFilters.includes(p.collection) || 
           activeFilters.includes(p.category) || 
           p.materials.some(m => activeFilters.includes(m));
  });

  if (sortBy === "Precio: Mayor a Menor") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "Precio: Menor a Mayor") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  }

  return (
    <main className="min-h-screen bg-hueso-seda">
      <Header />

      <section className="pt-48 pb-32 luxury-container">
        {/* Page Header */}
        <div className="flex flex-col gap-6 mb-16 border-b border-verde-ebano/10 pb-12">
          <span className="text-[10px] uppercase tracking-[0.8em] text-oro-antiguo">El Catálogo</span>
          <h1 className="text-5xl md:text-7xl font-display italic text-verde-ebano">Todas las Joyas</h1>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap justify-between items-center gap-8 mb-12 py-6 border-y border-verde-ebano/5">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-verde-ebano hover:text-oro-antiguo transition-colors"
            >
              <SlidersHorizontal size={14} /> {isSidebarOpen ? "Ocultar Filtros" : "Mostrar Filtros"}
            </button>
            <div className="hidden md:flex gap-4">
              {activeFilters.map(filter => (
                <span key={filter} className="flex items-center gap-2 bg-verde-ebano text-hueso-seda text-[9px] px-3 py-1 uppercase tracking-widest">
                  {filter} <X size={10} className="cursor-pointer" onClick={() => toggleFilter(filter)} />
                </span>
              ))}
              {activeFilters.length > 0 && (
                <button onClick={() => setActiveFilters([])} className="text-[9px] uppercase tracking-widest text-oro-antiguo hover:underline">Limpiar todo</button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-verde-ebano">
            <span className="opacity-40">Ordenar por:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-medium hover:text-oro-antiguo transition-colors"
            >
              <option>Relevancia</option>
              <option>Precio: Mayor a Menor</option>
              <option>Precio: Menor a Mayor</option>
              <option>Nuevas Adquisiciones</option>
            </select>
          </div>
        </div>

        <div className="flex gap-16">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.aside 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-12"
              >
                <FilterGroup title="Tipo de Joya" items={categories} active={activeFilters} onToggle={toggleFilter} />
                <FilterGroup title="Colecciones" items={collections} active={activeFilters} onToggle={toggleFilter} />
                <FilterGroup title="Materiales" items={materials} active={activeFilters} onToggle={toggleFilter} />
                
                <div className="flex flex-col gap-4">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium text-verde-ebano">Preferencias</h3>
                  <div className="flex flex-col gap-2">
                    {["Piezas Únicas", "Edición Limitada", "Diseño de Autor"].map(p => (
                      <label key={p} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="hidden" checked={activeFilters.includes(p)} onChange={() => toggleFilter(p)} />
                        <div className={`w-3 h-3 border border-verde-ebano/30 transition-all ${activeFilters.includes(p) ? 'bg-oro-antiguo border-oro-antiguo' : 'group-hover:border-verde-ebano'}`} />
                        <span className={`text-[10px] uppercase tracking-widest transition-colors ${activeFilters.includes(p) ? 'text-verde-ebano' : 'text-verde-ebano/50'}`}>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-6 bg-verde-ebano text-hueso-seda relative overflow-hidden group cursor-pointer">
                  <div className="relative z-10 flex flex-col gap-3">
                    <Sparkles size={16} className="text-oro-antiguo" />
                    <h4 className="text-[10px] uppercase tracking-widest font-medium">Filtro Inteligente</h4>
                    <p className="text-[9px] font-light leading-relaxed opacity-60">Permita que nuestro Oráculo Digital seleccione la pieza que vibra con su esencia.</p>
                  </div>
                  <div className="absolute inset-0 bg-oro-antiguo/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>

            <div className="mt-24 flex flex-col items-center gap-8 border-t border-verde-ebano/5 pt-16">
               <span className="text-[10px] uppercase tracking-widest text-verde-ebano/40">Mostrando {filteredProducts.length} de {PRODUCTS.length} piezas</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-hueso-seda flex items-center justify-center">
        <div className="text-oro-antiguo animate-pulse uppercase tracking-[0.5em] text-[10px]">Cargando Legado...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

function FilterGroup({ title, items, active, onToggle }: { title: string, items: string[], active: string[], onToggle: (f: string) => void }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full group"
      >
        <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium text-verde-ebano">{title}</h3>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col gap-2"
          >
            {items.map(item => (
              <label key={item} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="hidden" checked={active.includes(item)} onChange={() => onToggle(item)} />
                <div className={`w-3 h-3 border border-verde-ebano/30 transition-all ${active.includes(item) ? 'bg-oro-antiguo border-oro-antiguo' : 'group-hover:border-verde-ebano'}`} />
                <span className={`text-[10px] uppercase tracking-widest transition-colors ${active.includes(item) ? 'text-verde-ebano' : 'text-verde-ebano/50'}`}>{item}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
