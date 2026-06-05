"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus, Eye, Pencil, Trash2, X, Check, AlertCircle,
  Loader2, Search, Filter, RefreshCw, ArrowRight,
  ImagePlus, Package, TrendingUp, Archive, ChevronDown,
  ChevronUp, ToggleLeft, ToggleRight, ArrowLeft,
} from "lucide-react";
import { ProductPDPPreview, PDPProduct } from "../../../components/ProductPDPPreview";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminProduct {
  _source: "db" | "static";
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  long_description: string | null;
  significado: string | null;
  price: number;
  price_cents: number;
  currency: string;
  category: string;
  collection: string;
  materials: string[];
  primary_material: string | null;
  occasions: string[];
  outfits: string[];
  style: string | null;
  purity: string | null;
  finish: string | null;
  available_sizes: string[];
  images: string[];
  primary_image: string | null;
  stock: number;
  stock_reserved: number;
  sold: number;
  is_active: boolean;
  is_featured: boolean;
  is_author_design: boolean;
  is_limited_edition: boolean;
  is_unique_piece: boolean;
  is_circle_exclusive: boolean;
  seo_keywords: string[];
  created_at: string;
  updated_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIAS = ["Anillos", "Collares", "Pendientes", "Piezas Únicas", "Sets", "Pulseras", "Edición Limitada", "Broches"];
const COLECCIONES = ["Amatista", "Chai", "Escencia", "Diseños de Autor", "Piezas Únicas", "Etérea", "Serpientes", "Floral", "Ecos de la Tierra", "Anillos de Piedras"];
const MATERIALES = [
  "Plata .925", "Amatista Natural", "Baño de Oro 24k", "Oro 14k", "Rubíes",
  "Detalles en Oro 14k", "Oro Amarillo 18k", "Texturizado a mano", "Plata Ley .950",
  "Perla Negra de Tahití", "Oro Blanco 14k", "Zafiros Blancos", "Ojos de Esmeralda",
  "Centro de Citrino", "Plata .950 Envejecida", "Cuarzo Hialino",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toPDPProduct(p: AdminProduct): PDPProduct {
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    description: p.description,
    long_description: p.long_description,
    significado: p.significado,
    price: p.price,
    currency: p.currency,
    category: p.category,
    collection: p.collection,
    materials: p.materials,
    occasions: p.occasions,
    outfits: p.outfits,
    style: p.style,
    purity: p.purity,
    images: p.images,
    stock: p.stock,
    is_featured: p.is_featured,
    is_circle_exclusive: p.is_circle_exclusive,
    is_unique_piece: p.is_unique_piece,
    is_author_design: p.is_author_design,
    is_limited_edition: p.is_limited_edition,
    available_sizes: p.available_sizes,
  };
}

// Build a PDPProduct from the "New product" form state
function formToPDPProduct(form: NewProductForm): PDPProduct {
  return {
    id: "preview",
    sku: form.sku || "MA-NEW-001",
    name: form.nombre || "Nombre de la Pieza",
    description: form.narrativa || "",
    long_description: form.detalles || null,
    significado: null,
    price: parseFloat(form.precio || "0") || 0,
    currency: "MXN",
    category: form.tipo,
    collection: form.coleccion,
    materials: form.materiales,
    occasions: [],
    outfits: [],
    style: null,
    purity: null,
    images: form.imagenes.filter((i) => i.url).map((i) => i.url),
    stock: 1,
    is_featured: false,
    is_circle_exclusive: form.isExclusive,
    is_unique_piece: form.preferencia === "Piezas Únicas",
    is_author_design: form.preferencia === "Diseño de Autor",
    is_limited_edition: form.preferencia === "Edición Limitada",
    available_sizes: [],
  };
}

interface NewProductForm {
  nombre: string;
  baseSku: string;
  sku: string;
  precio: string;
  tipo: string;
  coleccion: string;
  preferencia: string;
  narrativa: string;
  detalles: string;
  materiales: string[];
  imagenes: { url: string; localPreview: string; uploading?: boolean; error?: string }[];
  isExclusive: boolean;
  seoKeywords: string;
}

const EMPTY_FORM: NewProductForm = {
  nombre: "", baseSku: "0001", sku: "", precio: "",
  tipo: "Collares", coleccion: "Serpientes", preferencia: "Piezas Únicas",
  narrativa: "", detalles: "", materiales: [], imagenes: [],
  isExclusive: false, seoKeywords: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminInventario() {
  // ── View state ─────────────────────────────────────────────────────────────
  type View = "list" | "new" | "edit" | "preview";
  const [view, setView] = useState<View>("list");

  // ── Products ───────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);

  // ── Filters ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCollection, setFilterCollection] = useState("all");
  const [sortField, setSortField] = useState<"name" | "price" | "stock" | "sold">("name");
  const [sortAsc, setSortAsc] = useState(true);

  // ── New product form ───────────────────────────────────────────────────────
  const [form, setForm] = useState<NewProductForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Edit state ─────────────────────────────────────────────────────────────
  const [editForm, setEditForm] = useState<Partial<AdminProduct>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // ── Delete confirm ─────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Computed SKU ───────────────────────────────────────────────────────────
  useEffect(() => {
    const ti = form.tipo.substring(0, 2).toUpperCase();
    const co = form.coleccion.substring(0, 3).toUpperCase();
    const ma = form.materiales[0]?.substring(0, 3).toUpperCase() ?? "GEN";
    const pr = form.preferencia === "Piezas Únicas" ? "PUN" : form.preferencia === "Edición Limitada" ? "ELM" : "AUT";
    setForm((f) => ({ ...f, sku: `MA-${ti}-${co}-${ma.replace(/[^A-Z0-9]/g, "")}-${pr}-${f.baseSku}` }));
  }, [form.tipo, form.coleccion, form.materiales, form.preferencia, form.baseSku]);

  // ── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/products");
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error al cargar");
      setProducts(json.products);
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Filtered + sorted list ─────────────────────────────────────────────────
  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchCat = filterCategory === "all" || p.category === filterCategory;
      const matchCol = filterCollection === "all" || p.collection === filterCollection;
      return matchSearch && matchCat && matchCol;
    })
    .sort((a, b) => {
      const mult = sortAsc ? 1 : -1;
      if (sortField === "name") return mult * a.name.localeCompare(b.name);
      if (sortField === "price") return mult * (a.price - b.price);
      if (sortField === "stock") return mult * (a.stock - b.stock);
      if (sortField === "sold") return mult * (a.sold - b.sold);
      return 0;
    });

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalSold = products.reduce((s, p) => s + p.sold, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 2).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  // ── Image upload ───────────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (fileInputRef.current) fileInputRef.current.value = "";

    const newEntries = files.map((f) => ({ url: "", localPreview: URL.createObjectURL(f), uploading: true }));
    const start = form.imagenes.length;
    setForm((f) => ({ ...f, imagenes: [...f.imagenes, ...newEntries] }));

    await Promise.all(files.map(async (file, i) => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error ?? "Error");
        setForm((f) => {
          const updated = [...f.imagenes];
          updated[start + i] = { url: json.url, localPreview: newEntries[i].localPreview, uploading: false };
          return { ...f, imagenes: updated };
        });
      } catch (err: unknown) {
        setForm((f) => {
          const updated = [...f.imagenes];
          updated[start + i] = { ...newEntries[i], uploading: false, error: err instanceof Error ? err.message : "Error" };
          return { ...f, imagenes: updated };
        });
      }
    }));
  };

  // ── Save new product ───────────────────────────────────────────────────────
  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    if (form.imagenes.some((i) => i.uploading)) {
      setSaveError("Espera a que terminen de subirse todas las imágenes.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/save-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre, sku: form.sku, precio: form.precio,
          tipo: form.tipo, coleccion: form.coleccion, preferencia: form.preferencia,
          narrativa: form.narrativa, detalles: form.detalles,
          materiales: form.materiales,
          imagenes: form.imagenes.filter((i) => i.url).map((i) => i.url),
          isExclusive: form.isExclusive, seoKeywords: form.seoKeywords,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error al guardar");
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setForm(EMPTY_FORM);
        setView("list");
        fetchProducts();
      }, 1800);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Update product ─────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!selectedProduct || selectedProduct._source === "static") return;
    setUpdateError(null);
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          price: editForm.price,
          collection: editForm.collection,
          materials: editForm.materials,
          stock: editForm.stock,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error al actualizar");
      setView("list");
      fetchProducts();
    } catch (err: unknown) {
      setUpdateError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Delete product ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget || deleteTarget._source === "static") return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Error al eliminar");
      setDeleteTarget(null);
      fetchProducts();
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Toggle field helper ────────────────────────────────────────────────────
  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField === field
      ? sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />
      : null;

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────

  // ── STATS BAR ─────────────────────────────────────────────────────────────
  const StatsBar = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {[
        { label: "Total Productos", value: products.length, icon: Package, color: "#CBB67B" },
        { label: "Total en Stock", value: totalStock, icon: Archive, color: "#CBB67B" },
        { label: "Vendidas", value: totalSold, icon: TrendingUp, color: "#4ade80" },
        { label: "Bajo Stock / Agotadas", value: `${lowStock} / ${outOfStock}`, icon: AlertCircle, color: lowStock + outOfStock > 0 ? "#f87171" : "#CBB67B" },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-[#1F271D] border border-[#CBB67B]/15 p-4 flex items-center gap-4">
          <div className="w-9 h-9 border border-[#CBB67B]/20 flex items-center justify-center flex-shrink-0">
            <Icon size={15} style={{ color }} />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">{label}</p>
            <p className="text-lg font-mono font-bold text-[#E5DBD6] mt-0.5">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  const ListView = () => (
    <div className="space-y-6">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9A8B]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="w-full bg-[#1F271D] border border-[#CBB67B]/20 pl-9 pr-4 py-2.5 text-xs text-[#E5DBD6] placeholder-[#8E9A8B]/50 outline-none focus:border-[#CBB67B]"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-[#1F271D] border border-[#CBB67B]/20 px-3 py-2.5 text-xs text-[#E5DBD6] outline-none focus:border-[#CBB67B]"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterCollection}
          onChange={(e) => setFilterCollection(e.target.value)}
          className="bg-[#1F271D] border border-[#CBB67B]/20 px-3 py-2.5 text-xs text-[#E5DBD6] outline-none focus:border-[#CBB67B]"
        >
          <option value="all">Todas las colecciones</option>
          {COLECCIONES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          onClick={fetchProducts}
          className="border border-[#CBB67B]/30 px-3 py-2.5 text-[#CBB67B] hover:border-[#CBB67B] transition-colors"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#CBB67B]/20 text-[9px] uppercase tracking-widest text-[#8E9A8B]">
              <th className="pb-3 pr-4 w-16">Imagen</th>
              <th className="pb-3 pr-4 cursor-pointer hover:text-[#CBB67B] transition-colors" onClick={() => toggleSort("name")}>
                <span className="flex items-center gap-1">Nombre <SortIcon field="name" /></span>
              </th>
              <th className="pb-3 pr-4 hidden sm:table-cell">SKU / Colección</th>
              <th className="pb-3 pr-4 cursor-pointer hover:text-[#CBB67B] transition-colors hidden md:table-cell" onClick={() => toggleSort("price")}>
                <span className="flex items-center gap-1">Precio <SortIcon field="price" /></span>
              </th>
              <th className="pb-3 pr-4 cursor-pointer hover:text-[#CBB67B] transition-colors" onClick={() => toggleSort("stock")}>
                <span className="flex items-center gap-1">Stock <SortIcon field="stock" /></span>
              </th>
              <th className="pb-3 pr-4 cursor-pointer hover:text-[#CBB67B] transition-colors hidden lg:table-cell" onClick={() => toggleSort("sold")}>
                <span className="flex items-center gap-1">Vendidas <SortIcon field="sold" /></span>
              </th>
              <th className="pb-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-[#CBB67B]/8">
                  {[...Array(7)].map((__, j) => (
                    <td key={j} className="py-4 pr-4">
                      <div className="h-5 bg-[#2C3729]/60 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-[#8E9A8B] text-[10px] uppercase tracking-widest">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const stockStatus =
                  p.stock === 0 ? "text-red-400" :
                  p.stock <= 2 ? "text-amber-400" :
                  "text-emerald-400";

                return (
                  <tr
                    key={p.id}
                    className="border-b border-[#CBB67B]/8 hover:bg-[#CBB67B]/3 transition-colors group"
                  >
                    {/* Thumb */}
                    <td className="py-3 pr-4">
                      <div className="w-12 h-16 relative overflow-hidden bg-[#2C3729] border border-[#CBB67B]/10 flex-shrink-0">
                        {p.images[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#8E9A8B]/30">
                            <Package size={14} />
                          </div>
                        )}
                        {p._source === "static" && (
                          <div className="absolute top-0 right-0 w-2 h-2 bg-[#8E9A8B]/60" title="Catálogo estático" />
                        )}
                      </div>
                    </td>

                    {/* Name + category */}
                    <td className="py-3 pr-4">
                      <p className="text-xs font-medium text-[#E5DBD6] leading-snug">{p.name}</p>
                      <span className="text-[8px] uppercase tracking-widest text-[#8E9A8B]">{p.category}</span>
                    </td>

                    {/* SKU / Collection */}
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <p className="text-[9px] font-mono text-[#CBB67B]/80">{p.sku}</p>
                      <p className="text-[8px] text-[#8E9A8B] mt-0.5">{p.collection}</p>
                    </td>

                    {/* Price */}
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <span className="text-xs font-mono text-[#E5DBD6]">
                        ${p.price.toLocaleString("es-MX")}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-mono font-bold ${stockStatus}`}>
                        {p.stock}
                      </span>
                      {p.stock_reserved > 0 && (
                        <span className="text-[8px] text-[#8E9A8B] ml-1">({p.stock_reserved} res.)</span>
                      )}
                    </td>

                    {/* Sold */}
                    <td className="py-3 pr-4 hidden lg:table-cell">
                      <span className="text-xs font-mono text-[#E5DBD6]">{p.sold}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview */}
                        <button
                          onClick={() => { setSelectedProduct(p); setView("preview"); }}
                          className="w-8 h-8 border border-[#CBB67B]/20 flex items-center justify-center text-[#CBB67B] hover:bg-[#CBB67B]/10 transition-colors"
                          title="Previsualizar PDP"
                        >
                          <Eye size={13} />
                        </button>

                        {/* Edit — DB only */}
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setEditForm({ ...p });
                            setView("edit");
                          }}
                          disabled={p._source === "static"}
                          className="w-8 h-8 border border-[#CBB67B]/20 flex items-center justify-center text-[#CBB67B] hover:bg-[#CBB67B]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={p._source === "static" ? "Producto del catálogo estático — editar en constants/products.ts" : "Editar producto"}
                        >
                          <Pencil size={13} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(p)}
                          disabled={p._source === "static"}
                          className="w-8 h-8 border border-red-800/30 flex items-center justify-center text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={p._source === "static" ? "No eliminable — catálogo estático" : "Eliminar producto"}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {!isLoading && (
        <p className="text-[9px] text-[#8E9A8B] uppercase tracking-widest text-right">
          Mostrando {filtered.length} de {products.length} productos
        </p>
      )}
    </div>
  );

  // ── NEW PRODUCT FORM ──────────────────────────────────────────────────────
  const NewProductForm = () => {
    const previewProduct = formToPDPProduct(form);
    const [showPreview, setShowPreview] = useState(false);
    const uploadedUrls = form.imagenes.filter((i) => i.url).map((i) => i.url);

    const toggleMat = (m: string) =>
      setForm((f) => ({
        ...f,
        materiales: f.materiales.includes(m) ? f.materiales.filter((x) => x !== m) : [...f.materiales, m],
      }));

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 border px-5 py-2.5 text-xs uppercase tracking-widest transition-all font-semibold ${
              showPreview
                ? "bg-[#CBB67B] border-[#CBB67B] text-[#1F271D]"
                : "border-[#CBB67B] bg-[#CBB67B]/10 text-[#CBB67B] hover:bg-[#CBB67B] hover:text-[#1F271D]"
            }`}
          >
            <Eye size={14} />
            {showPreview ? "Volver al Formulario" : "Previsualizar PDP"}
          </button>
          <span className="text-[9px] uppercase tracking-widest text-[#8E9A8B]">
            La vista previa refleja exactamente cómo se verá en la tienda
          </span>
        </div>

        <AnimatePresence mode="wait">
          {showPreview ? (
            <motion.div key="pdp-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductPDPPreview product={previewProduct} isAdminPreview />
            </motion.div>
          ) : (
            <motion.form
              key="new-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSaveNew}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left: specs */}
              <div className="lg:col-span-8 space-y-5">
                {/* Basic */}
                <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                    Especificaciones Básicas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Nombre de la Pieza *</label>
                      <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                        placeholder="Ej: Collar Serpiente Sagrada"
                        className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] placeholder-[#8E9A8B]/50" required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Precio de Venta (MXN) *</label>
                      <input type="number" value={form.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
                        placeholder="Ej: 64000"
                        className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] font-mono placeholder-[#8E9A8B]/50" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(["tipo", "coleccion", "preferencia"] as const).map((field) => {
                      const opts = field === "tipo" ? CATEGORIAS : field === "coleccion" ? COLECCIONES : ["Piezas Únicas", "Edición Limitada", "Diseño de Autor"];
                      const labels: Record<string, string> = { tipo: "Tipo de Joya", coleccion: "Colección", preferencia: "Preferencia" };
                      return (
                        <div key={field} className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">{labels[field]}</label>
                          <select value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                            className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6]">
                            {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Narrativa */}
                <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                    Narrativa & Detalles Técnicos
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Narrativa Emocional *</label>
                    <textarea rows={3} value={form.narrativa} onChange={(e) => setForm((f) => ({ ...f, narrativa: e.target.value }))}
                      placeholder="Esculpido a mano en honor a la deidad primordial del renacimiento..."
                      className="bg-[#2C3729] border border-[#CBB67B]/20 p-3 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] leading-relaxed placeholder-[#8E9A8B]/50" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Detalles Técnicos *</label>
                    <textarea rows={3} value={form.detalles} onChange={(e) => setForm((f) => ({ ...f, detalles: e.target.value }))}
                      placeholder="Plata Ley .950 texturizada a fuego, engaste manual de..."
                      className="bg-[#2C3729] border border-[#CBB67B]/20 p-3 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] leading-relaxed placeholder-[#8E9A8B]/50" required />
                  </div>
                </div>

                {/* Materiales */}
                <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                    Materiales
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MATERIALES.map((mat) => (
                      <button type="button" key={mat} onClick={() => toggleMat(mat)}
                        className={`text-[9px] uppercase tracking-wider p-2.5 border text-center transition-all ${
                          form.materiales.includes(mat)
                            ? "bg-[#CBB67B]/15 border-[#CBB67B] text-[#CBB67B] font-bold"
                            : "bg-[#2C3729]/50 border-[#CBB67B]/10 text-[#8E9A8B] hover:border-[#CBB67B]/40"
                        }`}>
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: SKU, images, flags, save */}
              <div className="lg:col-span-4 space-y-5">
                {/* SKU */}
                <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                    Serialización
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Correlativo / Lote</label>
                    <input type="text" value={form.baseSku} maxLength={4}
                      onChange={(e) => setForm((f) => ({ ...f, baseSku: e.target.value }))}
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] font-mono text-center" />
                  </div>
                  <div className="bg-[#2C3729] border border-[#CBB67B]/10 p-4 text-center space-y-1">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-[#8E9A8B]">SKU Generado</span>
                    <p className="text-sm font-bold font-mono text-[#CBB67B] break-words">{form.sku}</p>
                  </div>
                </div>

                {/* Images */}
                <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                    Imágenes
                  </h3>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                  <div className="flex flex-col gap-2">
                    {form.imagenes.map((img, i) => (
                      <div key={i} className="flex gap-2 items-center bg-[#2C3729] border border-[#CBB67B]/10 p-2">
                        <div className="w-12 h-14 relative flex-shrink-0 overflow-hidden">
                          <Image src={img.localPreview || img.url} alt="" fill className={`object-cover ${img.uploading ? "opacity-50" : ""}`} unoptimized />
                          {img.uploading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 size={14} className="animate-spin text-[#CBB67B]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {img.error ? (
                            <span className="text-[8px] text-red-400 truncate block">{img.error}</span>
                          ) : img.uploading ? (
                            <span className="text-[8px] text-[#CBB67B]">Subiendo...</span>
                          ) : (
                            <span className="text-[8px] text-emerald-400">✓ Lista</span>
                          )}
                        </div>
                        <button type="button" onClick={() => setForm((f) => ({ ...f, imagenes: f.imagenes.filter((_, j) => j !== i) }))}
                          className="text-red-400 hover:text-red-500 p-1">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-[#CBB67B]/40 hover:border-[#CBB67B] py-6 flex flex-col items-center gap-2 text-[#8E9A8B] hover:text-[#CBB67B] transition-all bg-[#2C3729]/30">
                      <ImagePlus size={20} />
                      <span className="text-[9px] uppercase tracking-widest">Seleccionar fotos</span>
                    </button>
                    {uploadedUrls.length > 0 && (
                      <p className="text-[8px] text-center text-[#8E9A8B] uppercase tracking-widest">
                        {uploadedUrls.length} / {form.imagenes.length} listas
                      </p>
                    )}
                  </div>
                </div>

                {/* Flags */}
                <div className="bg-[#1F271D] border border-[#CBB67B]/15 p-6 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#CBB67B] font-bold border-b border-[#CBB67B]/10 pb-2">
                    Configuración
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#E5DBD6]">Exclusivo The Circle</span>
                      <span className="text-[8px] text-[#8E9A8B]">Requiere membresía activa</span>
                    </div>
                    <button type="button" onClick={() => setForm((f) => ({ ...f, isExclusive: !f.isExclusive }))}
                      className={`w-12 h-6 flex items-center p-0.5 transition-all ${form.isExclusive ? "bg-[#CBB67B]" : "bg-[#2C3729] border border-[#CBB67B]/20"}`}>
                      <div className={`w-5 h-5 transition-transform duration-300 ${form.isExclusive ? "translate-x-6 bg-[#1F271D]" : "bg-[#CBB67B]"}`} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">SEO Keywords</label>
                    <input type="text" value={form.seoKeywords} onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
                      placeholder="collar plata, joyería artesanal..."
                      className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2 text-xs focus:border-[#CBB67B] outline-none text-[#E5DBD6] placeholder-[#8E9A8B]/50" />
                  </div>
                </div>

                {/* Save */}
                <div className="space-y-3">
                  <button type="submit" disabled={isSaving}
                    className="w-full py-4 bg-[#CBB67B] hover:bg-[#E4D5A4] disabled:opacity-50 text-[#1F271D] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    {isSaving ? <><Loader2 size={13} className="animate-spin" /> Guardando...</> : <>Publicar en Tienda <ArrowRight size={13} /></>}
                  </button>
                  <AnimatePresence>
                    {saveSuccess && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-emerald-950 border border-emerald-500/30 p-3 flex items-center gap-2 text-emerald-300 text-[10px] uppercase tracking-wider">
                        <Check size={13} /> ¡Producto publicado con éxito!
                      </motion.div>
                    )}
                    {saveError && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-red-950 border border-red-500/30 p-3 flex items-start gap-2 text-red-300">
                        <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                        <div className="flex-1 text-[9px]">
                          <span className="font-bold uppercase tracking-wider block">Error</span>
                          <span className="opacity-80">{saveError}</span>
                        </div>
                        <button type="button" onClick={() => setSaveError(null)}><X size={11} /></button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ── EDIT VIEW ─────────────────────────────────────────────────────────────
  const EditView = () => {
    if (!selectedProduct) return null;
    const isStatic = selectedProduct._source === "static";

    return (
      <div className="space-y-6 max-w-4xl">
        {isStatic && (
          <div className="bg-amber-950/60 border border-amber-500/30 p-4 flex items-start gap-3 text-amber-300">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed uppercase tracking-wider">
              Este producto proviene del catálogo estático. Para editarlo permanentemente, actualiza <code className="lowercase font-mono">constants/products.ts</code>.
              Los cambios aquí solo aplican a la sesión activa.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Nombre</label>
            <input type="text" value={editForm.name ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2.5 text-sm focus:border-[#CBB67B] outline-none text-[#E5DBD6]" />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Precio (MXN)</label>
            <input type="number" value={editForm.price ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, price: parseFloat(e.target.value) }))}
              className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2.5 text-sm font-mono focus:border-[#CBB67B] outline-none text-[#E5DBD6]" />
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Stock (piezas)</label>
            <input type="number" min={0} value={editForm.stock ?? 0} onChange={(e) => setEditForm((f) => ({ ...f, stock: parseInt(e.target.value) }))}
              className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2.5 text-sm font-mono focus:border-[#CBB67B] outline-none text-[#E5DBD6]" />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Categoría</label>
            <select value={editForm.category ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
              className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2.5 text-sm focus:border-[#CBB67B] outline-none text-[#E5DBD6]">
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Collection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Colección</label>
            <select value={editForm.collection ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, collection: e.target.value }))}
              className="bg-[#2C3729] border border-[#CBB67B]/20 px-3 py-2.5 text-sm focus:border-[#CBB67B] outline-none text-[#E5DBD6]">
              {COLECCIONES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Descripción / Narrativa</label>
            <textarea rows={3} value={editForm.description ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              className="bg-[#2C3729] border border-[#CBB67B]/20 p-3 text-sm focus:border-[#CBB67B] outline-none text-[#E5DBD6] leading-relaxed" />
          </div>

          {/* Significado */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">El Significado</label>
            <textarea rows={2} value={editForm.significado ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, significado: e.target.value }))}
              className="bg-[#2C3729] border border-[#CBB67B]/20 p-3 text-sm focus:border-[#CBB67B] outline-none text-[#E5DBD6] leading-relaxed" />
          </div>

          {/* Materials */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-[10px] uppercase tracking-wider text-[#8E9A8B]">Materiales</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MATERIALES.map((mat) => {
                const sel = (editForm.materials ?? []).includes(mat);
                return (
                  <button type="button" key={mat}
                    onClick={() => setEditForm((f) => ({
                      ...f,
                      materials: sel
                        ? (f.materials ?? []).filter((m) => m !== mat)
                        : [...(f.materials ?? []), mat],
                    }))}
                    className={`text-[9px] uppercase tracking-wider p-2 border text-center transition-all ${
                      sel ? "bg-[#CBB67B]/15 border-[#CBB67B] text-[#CBB67B] font-bold" : "bg-[#2C3729]/50 border-[#CBB67B]/10 text-[#8E9A8B]"
                    }`}>
                    {mat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flags row */}
          <div className="sm:col-span-2 flex flex-wrap gap-4">
            {([
              ["is_active", "Activo"],
              ["is_featured", "Destacado"],
              ["is_circle_exclusive", "Exclusivo Circle"],
              ["is_limited_edition", "Ed. Limitada"],
            ] as const).map(([field, label]) => (
              <label key={field} className="flex items-center gap-2 cursor-pointer">
                <button type="button"
                  onClick={() => setEditForm((f) => ({ ...f, [field]: !f[field as keyof typeof f] }))}
                  className="text-[#CBB67B]">
                  {(editForm as Record<string, unknown>)[field]
                    ? <ToggleRight size={22} />
                    : <ToggleLeft size={22} className="text-[#8E9A8B]" />}
                </button>
                <span className="text-[10px] uppercase tracking-wider text-[#E5DBD6]">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {updateError && (
          <div className="bg-red-950 border border-red-500/30 p-3 flex items-center gap-2 text-red-300 text-[10px] uppercase tracking-wider">
            <AlertCircle size={13} /> {updateError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating || isStatic}
            className="flex items-center gap-2 bg-[#CBB67B] hover:bg-[#E4D5A4] disabled:opacity-50 text-[#1F271D] font-bold text-xs uppercase tracking-widest px-8 py-3 transition-all"
          >
            {isUpdating ? <><Loader2 size={13} className="animate-spin" /> Guardando...</> : <><Check size={13} /> Guardar Cambios</>}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedProduct(p => p);
              setView("preview");
            }}
            className="flex items-center gap-2 border border-[#CBB67B]/30 text-[#CBB67B] hover:border-[#CBB67B] px-8 py-3 text-xs uppercase tracking-widest transition-all"
          >
            <Eye size={13} /> Ver PDP
          </button>
        </div>
      </div>
    );
  };

  // ── MAIN RENDER ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBB67B]/20 pb-6">
        <div className="flex items-center gap-4">
          {view !== "list" && (
            <button
              onClick={() => { setView("list"); setSelectedProduct(null); }}
              className="w-9 h-9 border border-[#CBB67B]/30 flex items-center justify-center text-[#CBB67B] hover:border-[#CBB67B] transition-colors"
            >
              <ArrowLeft size={15} />
            </button>
          )}
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#CBB67B]">
              {view === "list" && "Inventario Completo · CRUD en Tiempo Real"}
              {view === "new" && "Ingesta de Producto"}
              {view === "edit" && `Editando · ${selectedProduct?.name}`}
              {view === "preview" && `Vista PDP · ${selectedProduct?.name}`}
            </span>
            <h1 className="font-display-erp text-3xl sm:text-4xl text-[#E5DBD6] mt-1 font-bold">
              {view === "list" && "Gestión de Inventario"}
              {view === "new" && "Nuevo Producto"}
              {view === "edit" && "Editar Producto"}
              {view === "preview" && "Previsualización PDP"}
            </h1>
          </div>
        </div>

        {view === "list" && (
          <button
            onClick={() => { setForm(EMPTY_FORM); setView("new"); }}
            className="flex items-center gap-2 bg-[#CBB67B] hover:bg-[#E4D5A4] text-[#1F271D] font-bold text-xs uppercase tracking-widest px-6 py-3 transition-all"
          >
            <Plus size={14} /> Nuevo Producto
          </button>
        )}
      </div>

      {/* LOAD ERROR */}
      {loadError && (
        <div className="bg-red-950/60 border border-red-500/30 p-4 flex items-center gap-3 text-red-300">
          <AlertCircle size={15} className="flex-shrink-0" />
          <p className="text-[10px] uppercase tracking-wider">{loadError}</p>
        </div>
      )}

      {/* VIEWS */}
      {view === "list" && (
        <>
          <StatsBar />
          <ListView />
        </>
      )}
      {view === "new" && <NewProductForm />}
      {view === "edit" && <EditView />}
      {view === "preview" && selectedProduct && (
        <ProductPDPPreview product={toPDPProduct(selectedProduct)} isAdminPreview />
      )}

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-[#1F271D] border border-red-500/30 p-8 max-w-md w-full space-y-6 shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold">
                  Confirmar Eliminación
                </span>
                <h3 className="text-lg font-display-erp text-[#E5DBD6]">{deleteTarget.name}</h3>
                <p className="text-[10px] text-[#8E9A8B] leading-relaxed uppercase tracking-wider">
                  Esta acción desactivará el producto (soft delete) y lo ocultará de la tienda inmediatamente.
                  El registro permanece en la base de datos para preservar el historial de ventas.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  {isDeleting ? "Eliminando..." : "Confirmar"}
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 border border-[#CBB67B]/30 text-[#CBB67B] hover:border-[#CBB67B] text-xs uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
