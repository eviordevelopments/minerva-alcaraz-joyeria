"use client";

import { useState, useEffect } from "react";
import { getSiteContent, updateSiteContent } from "../../../actions/content";
import { motion } from "framer-motion";

export default function ContentAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collectionsHeader, setCollectionsHeader] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSiteContent('collections', 'header');
        if (data) {
          setCollectionsHeader({
            title: data.title || "",
            subtitle: data.subtitle || "",
            description: data.description || "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateSiteContent('collections', 'header', collectionsHeader);
      setMessage("Contenido guardado exitosamente.");
    } catch (e) {
      console.error(e);
      setMessage("Error al guardar el contenido.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="flex-1 p-8 bg-hueso-seda/20 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display text-verde-ebano uppercase">Gestión de Contenido</h1>
          <p className="text-verde-ebano/60 mt-2">Administra los textos y narrativas del sitio público.</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-verde-ebano/10">
          <h2 className="text-xl font-display text-verde-ebano uppercase mb-6">Página: Colecciones</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-verde-ebano/60">Subtítulo (Antetítulo)</label>
              <input
                type="text"
                value={collectionsHeader.subtitle}
                onChange={(e) => setCollectionsHeader({ ...collectionsHeader, subtitle: e.target.value })}
                className="w-full p-3 border border-verde-ebano/20 rounded focus:outline-none focus:border-oro-antiguo transition-colors"
                placeholder="Ej. Antología del Diseño"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-verde-ebano/60">Título Principal</label>
              <input
                type="text"
                value={collectionsHeader.title}
                onChange={(e) => setCollectionsHeader({ ...collectionsHeader, title: e.target.value })}
                className="w-full p-3 border border-verde-ebano/20 rounded focus:outline-none focus:border-oro-antiguo transition-colors"
                placeholder="Ej. Colecciones"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-verde-ebano/60">Narrativa / Descripción</label>
              <textarea
                rows={4}
                value={collectionsHeader.description}
                onChange={(e) => setCollectionsHeader({ ...collectionsHeader, description: e.target.value })}
                className="w-full p-3 border border-verde-ebano/20 rounded focus:outline-none focus:border-oro-antiguo transition-colors"
                placeholder="Descripción de la página..."
              />
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-verde-ebano text-hueso-seda px-8 py-3 uppercase text-xs tracking-widest hover:bg-oro-antiguo transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              {message && (
                <span className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {message}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
