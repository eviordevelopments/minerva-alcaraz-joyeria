"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Upload, 
  Sparkles, 
  Eye, 
  Check, 
  ShieldAlert, 
  FileText,
  Trash2,
  Lock,
  ArrowRight
} from "lucide-react";

export default function AdminInventario() {
  // Product state matching database columns
  const [nombre, setNombre] = useState("Collar Serpiente Sagrada");
  const [baseSku, setBaseSku] = useState("0001");
  const [precio, setPrecio] = useState("64000");
  const [tipo, setTipo] = useState("Collares");
  const [coleccion, setColeccion] = useState("Serpientes");
  const [preferencia, setPreferencia] = useState("Piezas Únicas");
  const [narrativa, setNarrativa] = useState("Esculpido a mano en honor a la deidad primordial del renacimiento. Su cuerpo enroscado en plata envejecida custodia gemas que susurran misterio.");
  const [detalles, setDetalles] = useState("Plata Ley .950 texturizada a fuego, engaste manual de Ojos de Esmeralda colombiana de 0.25 quilates. Cadena tejida artesanal de 45cm.");
  const [isExclusive, setIsExclusive] = useState(true);
  const [seoKeywords, setSeoKeywords] = useState("collar plata, joyeria de autor, serpiente sagrada, esmeraldas");
  
  // Multiple selected materials
  const [materiales, setMateriales] = useState<string[]>([
    "Plata Ley.950",
    "Ojos de Esmeralda",
    "Texturizado a mano"
  ]);

  // Multiple simulated image uploads
  const [imagenes, setImagenes] = useState<string[]>([
    "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-100.jpg"
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pdpPreviewActive, setPdpPreviewActive] = useState(false);

  // Available enums from database schema
  const tiposJoya = ["Anillos", "Collares", "Pendientes", "Piezas Únicas", "Sets", "Pulseras", "Colecciones"];
  const coleccionesJoya = ["Amatista", "Chai", "Escencia", "Diseños de Autor", "Piezas Únicas", "Etérea", "Serpientes", "Floral", "Ecos de la Tierra", "Anillos de Piedras"];
  const preferenciasJoya = ["Piezas Únicas", "Edición Limitada", "Diseño de Autor"];
  const materialesDisponibles = [
    "Plata.925", "Amatista Natural", "Baño de Oro 24k", "Oro 14k", "Rubíes", 
    "Detalles en Oro 14k", "Oro Amarillo 18k", "Texturizado a mano", "Plata Ley.950", 
    "Perla Negra de Tahití", "Oro Blanco 14k", "Zafiros Blancos", "Ojos de Esmeralda", 
    "Centro de Citrino", "Plata.950 Envejecida", "Cuarzo Hialino"
  ];

  // Algorithmic dynamic SKU generation
  const [skuFinal, setSkuFinal] = useState("");

  useEffect(() => {
    // Generate SKU: MA-TIPO-COLEC-MAT-PREF-CORRELATIVO
    const tipoPrefix = tipo.substring(0, 2).toUpperCase();
    const colecPrefix = coleccion.substring(0, 3).toUpperCase();
    const matPrefix = materiales.length > 0 ? materiales[0].substring(0, 3).toUpperCase() : "GEN";
    const prefPrefix = preferencia === "Piezas Únicas" ? "PUN" : preferencia === "Edición Limitada" ? "ELM" : "AUT";
    
    // Clean spaces or dots
    const sanitizedMat = matPrefix.replace(/[^A-Z0-9]/g, "");

    setSkuFinal(`MA-${tipoPrefix}-${colecPrefix}-${sanitizedMat}-${prefPrefix}-${baseSku}`);
  }, [tipo, coleccion, materiales, preferencia, baseSku]);

  // Handle simulated image upload through Cloudinary Signed Signature Edge Function
  const handleImageUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      // Add a mocked highly beautiful jewelry image URL from res.cloudinary.com
      const mockedCloudinaryUrls = [
        "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-51.JPG",
        "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275666/minerva_joyeria/products/escencia/Minerva_Joyeria_1_-10.jpg",
        "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-7.JPG"
      ];
      const randomUrl = mockedCloudinaryUrls[Math.floor(Math.random() * mockedCloudinaryUrls.length)];
      setImagenes([...imagenes, randomUrl]);
      setIsUploading(false);
    }, 1500);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 2000);
  };

  const toggleMaterial = (mat: string) => {
    if (materiales.includes(mat)) {
      setMateriales(materiales.filter(m => m !== mat));
    } else {
      setMateriales([...materiales, mat]);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
            Ingesta Atómica y Gestión en Tiempo Real
          </span>
          <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-2 font-bold">
            Gestión de Inventario
          </h1>
        </div>

        {/* Tab switch between Form and PDP Live Preview */}
        <button
          onClick={() => setPdpPreviewActive(!pdpPreviewActive)}
          className="flex items-center gap-2 border border-[#CBB67B] px-5 py-2.5 bg-[#CBB67B]/10 hover:bg-[#CBB67B] hover:text-[#1F271D] text-xs uppercase tracking-widest text-[#CBB67B] transition-all font-semibold"
        >
          <Eye size={14} />
          <span>{pdpPreviewActive ? "Volver al Editor" : "Previsualizar PDP"}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!pdpPreviewActive ? (
          
          /* FORM EDITOR PANEL */
          <motion.form 
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSaveProduct}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            {/* Left side: Technical specifications */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Bloque 1: General */}
              <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                  Especificaciones Básicas
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Nombre de la Pieza</label>
                    <input 
                      type="text" 
                      value={nombre} 
                      onChange={(e) => setNombre(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6]"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Precio de Venta (MXN)</label>
                    <input 
                      type="number" 
                      value={precio} 
                      onChange={(e) => setPrecio(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Tipo de Joya</label>
                    <select 
                      value={tipo} 
                      onChange={(e) => setTipo(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6]"
                    >
                      {tiposJoya.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Colección</label>
                    <select 
                      value={coleccion} 
                      onChange={(e) => setColeccion(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6]"
                    >
                      {coleccionesJoya.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Preferencia de Edición</label>
                    <select 
                      value={preferencia} 
                      onChange={(e) => setPreferencia(e.target.value)}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6]"
                    >
                      {preferenciasJoya.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Narrativas */}
              <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                  Narrativa &amp; Detalles Técnicos
                </h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Narrativa Emocional (Marca de Lujo)</label>
                  <textarea 
                    rows={3} 
                    value={narrativa}
                    onChange={(e) => setNarrativa(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 p-3 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] leading-relaxed"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Detalles Técnicos (Materiales, Medidas, Pesos)</label>
                  <textarea 
                    rows={3} 
                    value={detalles}
                    onChange={(e) => setDetalles(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 p-3 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* Bloque 3: Selección de Materiales */}
              <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                  Materiales Seleccionados
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {materialesDisponibles.map((mat) => {
                    const isSelected = materiales.includes(mat);
                    return (
                      <button
                        type="button"
                        key={mat}
                        onClick={() => toggleMaterial(mat)}
                        className={`text-[9px] uppercase tracking-wider p-2.5 border text-center transition-all ${
                          isSelected 
                            ? "bg-[#CBB67B]/15 border-[#CBB67B] text-[#CBB67B] font-bold" 
                            : "bg-[#2C3729]/50 border-[#CBB67B]/10 text-[#8E9A8B]"
                        }`}
                      >
                        {mat}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right side: Uploads, SKU, and save options */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* SKU & Serialización Inteligente */}
              <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                  Serialización
                </h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Número Correlativo / Lote</label>
                  <input 
                    type="text" 
                    value={baseSku} 
                    onChange={(e) => setBaseSku(e.target.value)}
                    maxLength={4}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] font-mono text-center"
                    required
                  />
                </div>

                <div className="bg-[#2C3729] border border-[#CBB67B]/10 p-4 space-y-2 text-center">
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[#8E9A8B]">
                    SKU Único Generado
                  </span>
                  <p className="text-sm font-bold font-mono tracking-wider text-[#CBB67B] break-words">
                    {skuFinal}
                  </p>
                </div>
              </div>

              {/* Ingesta Multimedia Cloudinary Direct Carga */}
              <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                  Imágenes de la Joya
                </h3>

                <div className="flex flex-col gap-3">
                  {imagenes.map((img, i) => (
                    <div key={i} className="flex gap-2 items-center bg-[#2C3729] border border-[#CBB67B]/10 p-2">
                      <div className="w-12 h-12 bg-black relative flex-shrink-0">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[8px] font-mono truncate flex-1 text-[#8E9A8B]">{img}</span>
                      <button 
                        type="button" 
                        onClick={() => setImagenes(imagenes.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className="w-full border border-dashed border-[#CBB67B]/40 hover:border-[#CBB67B] py-6 flex flex-col items-center justify-center gap-2 transition-all bg-[#2C3729]/30 text-[#8E9A8B] hover:text-[#CBB67B]"
                  >
                    <Upload size={18} className={isUploading ? "animate-bounce" : ""} />
                    <span className="text-[9px] uppercase tracking-widest">
                      {isUploading ? "Firmando & Subiendo..." : "Subir a Cloudinary Direct"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Seguridad & Visibilidad */}
              <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                  Seguridad de Fila (RLS)
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-[#E5DBD6]">Exclusivo The Circle</span>
                    <span className="text-[8px] text-[#8E9A8B]">Requiere claim de membresía JWT</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExclusive(!isExclusive)}
                    className={`w-12 h-6 flex items-center p-0.5 transition-all ${
                      isExclusive ? "bg-[#CBB67B]" : "bg-[#2C3729] border border-[#CBB67B]/20"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-none transition-transform duration-300 ${
                      isExclusive ? "translate-x-6 bg-[#1F271D]" : "bg-[#CBB67B]"
                    }`}></div>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">SEO Palabras Clave</label>
                  <input 
                    type="text" 
                    value={seoKeywords} 
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6]"
                  />
                </div>
              </div>

              {/* Guardar Accion */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-4 bg-[#CBB67B] hover:bg-[#E4D5A4] text-[#1F271D] font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <span>Registrando en Supabase...</span>
                  ) : (
                    <>
                      <span>Subir Producto en Tiempo Real</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-emerald-950 border border-emerald-500/30 p-3 text-center flex items-center justify-center gap-2 text-emerald-300"
                    >
                      <Check size={14} />
                      <span className="text-[10px] uppercase tracking-wider">¡Guardado en base de datos exitosamente!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.form>
        ) : (
          
          /* CLIENT PDP LIVE PREVIEW */
          <motion.div 
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#E5DBD6] text-[#2C3729] p-8 md:p-12 lg:p-16 border-4 border-[#CBB67B] text-left max-w-4xl mx-auto shadow-2xl relative"
          >
            {/* The Circle Ribbon if marked exclusive */}
            {isExclusive && (
              <div className="absolute top-0 right-10 bg-[#2C3729] text-[#CBB67B] border-b border-r border-l border-[#CBB67B] px-4 py-2 flex items-center gap-2 z-10">
                <Lock size={12} />
                <span className="text-[8px] uppercase tracking-[0.3em] font-semibold">Exclusivo The Circle</span>
              </div>
            )}

            <span className="text-[9px] uppercase tracking-[0.4em] text-[#2C3729]/60">
              Previsualización de Portal de Alta Joyería
            </span>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mt-8 items-center">
              
              {/* Preview Image Carousel Block */}
              <div className="md:col-span-6 relative aspect-square w-full bg-[#1F271D]/5 border border-[#2C3729]/10 flex items-center justify-center overflow-hidden">
                {imagenes.length > 0 ? (
                  <img src={imagenes[0]} alt="PDP" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#2C3729]/30">
                    <Sparkles size={24} />
                    <span className="text-[9px] uppercase tracking-wider">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Details and Narratives Block */}
              <div className="md:col-span-6 flex flex-col gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#CBB67B] font-bold">
                    Colección {coleccion}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display-erp text-[#2C3729] font-medium leading-tight mt-1">
                    {nombre}
                  </h2>
                  <p className="text-sm font-semibold tracking-wider mt-2 font-mono">
                    ${parseFloat(precio || "0").toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[#2C3729]/50 font-bold">
                    Narrativa Emocional
                  </span>
                  <p className="text-[11px] text-[#2C3729]/80 font-light leading-relaxed italic">
                    "{narrativa}"
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[#2C3729]/50 font-bold">
                    Detalles Técnicos
                  </span>
                  <p className="text-[10px] text-[#2C3729]/70 font-light leading-relaxed">
                    {detalles}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[#2C3729]/50 font-bold">
                    Materiales Custodiados
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {materiales.map(m => (
                      <span key={m} className="text-[8px] uppercase tracking-wider border border-[#2C3729]/20 px-2.5 py-1">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#2C3729]/15 pt-4 flex justify-between items-center text-[9px] uppercase tracking-widest text-[#2C3729]/50 font-mono">
                  <span>Serie: {skuFinal}</span>
                  <span>{preferencia}</span>
                </div>
              </div>

            </div>

            <div className="mt-8 border-t border-[#2C3729]/20 pt-6 flex items-center justify-between text-[#2C3729]/60">
              <span className="text-[9px] uppercase tracking-widest">
                * Nota: Esta es una visualización adaptada del catálogo de Minerva Alcaraz Joyería.
              </span>
              <button 
                onClick={() => setPdpPreviewActive(false)}
                className="text-[9px] uppercase tracking-widest font-bold text-[#2C3729] hover:underline"
              >
                Volver al Formulario
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
