"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../../../components/Header";
import { Footer } from "../../../../components/Footer";
import { ProfileSidebar } from "../../../../components/ProfileSidebar";
import { useAuthStore } from "../../../../lib/store/useAuthStore";
import { supabase, formatPrice } from "../../../../lib/supabase";
import type { Product } from "../../../../lib/supabase";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Plus, X, Save, Loader2, Globe, Lock, Link2,
  Crown, Pencil, Check, Trash2, ExternalLink, Search
} from "lucide-react";

type AlbumVisibility = "private" | "shared_link" | "public";

interface AlbumItem {
  id: string;
  product_id: string;
  note: string | null;
  sort_order: number;
  products: Product;
}

interface AlbumData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  visibility: AlbumVisibility;
  share_token: string;
  is_default: boolean;
}

const VISIBILITY_MAP = {
  private:     { label: "Privado",   icon: Lock,   desc: "Solo tú puedes verlo" },
  shared_link: { label: "Con Link",  icon: Link2,  desc: "Cualquiera con el link puede verlo" },
  public:      { label: "Público",   icon: Globe,  desc: "Visible para todos" },
};

export default function AlbumDetailPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const albumId = params.id as string;
  const isEditMode = searchParams.get("edit") === "true";

  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [items, setItems] = useState<AlbumItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editVisibility, setEditVisibility] = useState<AlbumVisibility>("private");

  // Add product modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Item note editing
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    fetchAlbum();
  }, [albumId, isAuthenticated]);

  const fetchAlbum = async () => {
    const { data: albumData } = await supabase
      .from("albums")
      .select("*")
      .eq("id", albumId)
      .single();

    if (!albumData) { router.push("/perfil/albumes"); return; }
    setAlbum(albumData as AlbumData);
    setEditTitle(albumData.title);
    setEditDesc(albumData.description || "");
    setEditVisibility(albumData.visibility);
    await fetchItems();
    setIsLoading(false);
  };

  const fetchItems = async () => {
    const { data } = await supabase
      .from("album_items")
      .select("id, product_id, note, sort_order, products(*)")
      .eq("album_id", albumId)
      .order("sort_order");
    setItems((data || []) as unknown as AlbumItem[]);
  };

  const saveAlbum = async () => {
    if (!album) return;
    setIsSaving(true);
    const { data } = await supabase
      .from("albums")
      .update({ title: editTitle, description: editDesc || null, visibility: editVisibility })
      .eq("id", albumId)
      .select()
      .single();
    if (data) setAlbum(data as AlbumData);
    setIsSaving(false);
    setIsEditing(false);
  };

  const searchProducts = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    const { data } = await supabase
      .from("products")
      .select("id, sku, slug, name, primary_image, price_cents, category, collection_name, materials")
      .ilike("name", `%${q}%`)
      .eq("is_active", true)
      .limit(12);
    setSearchResults((data || []) as unknown as Product[]);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchProducts(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  const addProduct = async (product: Product) => {
    const already = items.some(i => i.product_id === product.id);
    if (already) return;
    setAddingId(product.id);
    const { data } = await supabase.from("album_items").insert({
      album_id: albumId,
      product_id: product.id,
      sort_order: items.length,
    }).select("id, product_id, note, sort_order, products(*)").single();
    if (data) setItems(prev => [...prev, data as unknown as AlbumItem]);

    // If no cover, set it
    if (!album?.cover_image_url && product.primary_image) {
      await supabase.from("albums").update({ cover_image_url: product.primary_image }).eq("id", albumId);
      setAlbum(prev => prev ? { ...prev, cover_image_url: product.primary_image! } : prev);
    }
    setAddingId(null);
  };

  const removeItem = async (itemId: string) => {
    await supabase.from("album_items").delete().eq("id", itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const saveNote = async (itemId: string) => {
    await supabase.from("album_items").update({ note: noteText || null }).eq("id", itemId);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, note: noteText || null } : i));
    setEditingNoteId(null);
  };

  const copyShareLink = () => {
    if (!album) return;
    navigator.clipboard.writeText(`${window.location.origin}/album/${album.share_token}`);
  };

  if (!user || !album) return null;

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />

          <div className="flex-1 flex flex-col gap-6">
            {/* Back */}
            <Link href="/perfil/albumes" className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-verde-ebano/35 hover:text-verde-ebano transition-colors w-fit">
              <ArrowLeft size={12} strokeWidth={1.5} /> Mis Álbumes
            </Link>

            {/* Album header */}
            {isEditing ? (
              <div className="bg-white border border-verde-ebano/8 p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Nombre del Álbum</label>
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                    className="text-2xl font-display text-verde-ebano bg-transparent outline-none border-b border-verde-ebano/12 pb-2 focus:border-oro-antiguo transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Descripción</label>
                  <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                    className="text-sm text-verde-ebano/60 bg-transparent outline-none border-b border-verde-ebano/12 pb-2 focus:border-oro-antiguo transition-colors resize-none"
                    placeholder="Una narrativa de tu colección..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Visibilidad</label>
                  <div className="flex gap-2">
                    {(["private", "shared_link", "public"] as AlbumVisibility[]).map(v => {
                      const vis = VISIBILITY_MAP[v];
                      const VIcon = vis.icon;
                      return (
                        <button key={v} onClick={() => setEditVisibility(v)}
                          className={`flex-1 flex flex-col items-center gap-1 py-3 border text-center transition-all text-[7px] uppercase tracking-[0.3em] ${
                            editVisibility === v ? "bg-verde-ebano text-hueso-seda border-verde-ebano" : "border-verde-ebano/10 text-verde-ebano/40 hover:border-verde-ebano/25"
                          }`}
                        >
                          <VIcon size={11} strokeWidth={1.5} className={editVisibility === v ? "text-oro-antiguo" : ""} />
                          {vis.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsEditing(false)} className="flex-1 border border-verde-ebano/12 text-verde-ebano/40 text-[9px] uppercase tracking-[0.4em] py-2.5 hover:border-verde-ebano/25 transition-colors">Cancelar</button>
                  <button onClick={saveAlbum} disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-oro-antiguo text-verde-ebano text-[9px] uppercase tracking-[0.4em] py-2.5 hover:bg-verde-ebano hover:text-hueso-seda transition-all disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={12} className="animate-spin" /> : <><Save size={12} /> Guardar</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Crown size={9} strokeWidth={1.5} className="text-oro-antiguo" />
                    <p className="text-[8px] uppercase tracking-[0.6em] text-oro-antiguo">Álbum Personal</p>
                  </div>
                  <h1 className="text-3xl font-display text-verde-ebano">{album.title}</h1>
                  {album.description && <p className="text-sm text-verde-ebano/40 italic font-light max-w-lg">{album.description}</p>}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-verde-ebano/30">
                      {items.length} {items.length === 1 ? "pieza" : "piezas"}
                    </span>
                    <span className="text-verde-ebano/15">·</span>
                    <span className="text-[8px] uppercase tracking-[0.3em] text-verde-ebano/30">
                      {VISIBILITY_MAP[album.visibility].label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {album.visibility === "shared_link" && (
                    <button onClick={copyShareLink} title="Copiar link compartible"
                      className="w-9 h-9 border border-verde-ebano/10 flex items-center justify-center hover:border-oro-antiguo transition-colors"
                    >
                      <Link2 size={13} strokeWidth={1.2} className="text-verde-ebano/40" />
                    </button>
                  )}
                  <button onClick={() => setIsEditing(true)}
                    className="w-9 h-9 border border-verde-ebano/10 flex items-center justify-center hover:border-verde-ebano/30 transition-colors"
                  >
                    <Pencil size={13} strokeWidth={1.2} className="text-verde-ebano/40" />
                  </button>
                  <button onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-verde-ebano text-hueso-seda text-[9px] uppercase tracking-[0.4em] px-4 py-2.5 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-300"
                  >
                    <Plus size={11} strokeWidth={2} /> Agregar
                  </button>
                </div>
              </div>
            )}

            {/* Items grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={20} strokeWidth={1} className="animate-spin text-oro-antiguo/40" />
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white border border-verde-ebano/8 p-14 flex flex-col items-center gap-5 text-center">
                <p className="text-sm text-verde-ebano/25 uppercase tracking-[0.3em]">Álbum vacío</p>
                <p className="text-[10px] text-verde-ebano/20">Agrega piezas del catálogo para crear tu colección personal</p>
                <button onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors"
                >
                  <Plus size={10} /> Agregar Primera Pieza
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((item) => {
                  const product = item.products;
                  return (
                    <motion.div key={item.id} layout className="bg-white border border-verde-ebano/8 group overflow-hidden">
                      {/* Image */}
                      <div className="relative h-52 bg-verde-ebano/4 overflow-hidden">
                        {product?.primary_image && (
                          <Image src={product.primary_image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        )}
                        {/* Remove button */}
                        <button onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                          <X size={11} strokeWidth={2} className="text-red-400" />
                        </button>
                      </div>

                      {/* Meta */}
                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano font-medium leading-snug">{product?.name}</p>
                            <p className="text-[8px] text-verde-ebano/35 mt-0.5">{product?.collection_name}</p>
                          </div>
                          <p className="text-[10px] text-verde-ebano/60 flex-shrink-0">{product ? formatPrice(product.price_cents) : ""}</p>
                        </div>

                        {/* Personal note */}
                        {editingNoteId === item.id ? (
                          <div className="flex gap-2 items-end">
                            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={2} autoFocus
                              className="flex-1 text-[9px] text-verde-ebano/60 bg-transparent border-b border-verde-ebano/15 outline-none focus:border-oro-antiguo resize-none"
                              placeholder="Tu nota personal..."
                            />
                            <button onClick={() => saveNote(item.id)} className="text-oro-antiguo"><Check size={13} /></button>
                            <button onClick={() => setEditingNoteId(null)} className="text-verde-ebano/30"><X size={13} /></button>
                          </div>
                        ) : item.note ? (
                          <p onClick={() => { setEditingNoteId(item.id); setNoteText(item.note || ""); }}
                            className="text-[9px] text-verde-ebano/40 italic font-light cursor-pointer hover:text-verde-ebano/60 transition-colors"
                          >
                            "{item.note}"
                          </p>
                        ) : (
                          <button onClick={() => { setEditingNoteId(item.id); setNoteText(""); }}
                            className="text-[8px] uppercase tracking-[0.3em] text-verde-ebano/20 hover:text-oro-antiguo transition-colors text-left"
                          >
                            + Agregar nota personal
                          </button>
                        )}

                        <Link href={`/product/${product?.slug}`} target="_blank"
                          className="flex items-center gap-1 text-[8px] uppercase tracking-[0.3em] text-verde-ebano/20 hover:text-oro-antiguo transition-colors"
                        >
                          Ver en catálogo <ExternalLink size={9} strokeWidth={1.5} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-verde-ebano/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-hueso-seda w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-verde-ebano/8">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[8px] uppercase tracking-[0.5em] text-oro-antiguo">Catálogo</p>
                  <h2 className="text-lg font-display text-verde-ebano">Agregar al Álbum</h2>
                </div>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 border border-verde-ebano/10 flex items-center justify-center">
                  <X size={13} strokeWidth={1.5} className="text-verde-ebano/40" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-verde-ebano/6">
                <div className="flex items-center gap-3 border-b border-verde-ebano/15 pb-2">
                  <Search size={13} strokeWidth={1.5} className="text-verde-ebano/30 flex-shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar pieza por nombre o colección..."
                    className="flex-1 bg-transparent text-sm text-verde-ebano outline-none placeholder:text-verde-ebano/25"
                    autoFocus
                  />
                  {isSearching && <Loader2 size={12} className="animate-spin text-verde-ebano/30" />}
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto p-4">
                {!searchQuery ? (
                  <p className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/25 text-center py-10">
                    Escribe para buscar piezas del catálogo
                  </p>
                ) : searchResults.length === 0 && !isSearching ? (
                  <p className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano/25 text-center py-10">
                    Sin resultados para "{searchQuery}"
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {searchResults.map((product) => {
                      const alreadyAdded = items.some(i => i.product_id === product.id);
                      return (
                        <button
                          key={product.id}
                          onClick={() => !alreadyAdded && addProduct(product)}
                          disabled={alreadyAdded || addingId === product.id}
                          className={`text-left flex flex-col overflow-hidden border transition-all duration-200 ${
                            alreadyAdded
                              ? "border-verde-ebano/20 opacity-50 cursor-not-allowed"
                              : "border-verde-ebano/8 hover:border-oro-antiguo/40 cursor-pointer"
                          }`}
                        >
                          <div className="relative h-32 bg-verde-ebano/4">
                            {product.primary_image && (
                              <Image src={product.primary_image} alt={product.name} fill className="object-cover" />
                            )}
                            {alreadyAdded && (
                              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <Check size={16} strokeWidth={2} className="text-verde-ebano/40" />
                              </div>
                            )}
                            {addingId === product.id && (
                              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <Loader2 size={16} className="animate-spin text-oro-antiguo" />
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex flex-col gap-0.5">
                            <p className="text-[8px] uppercase tracking-[0.2em] text-verde-ebano leading-tight">{product.name}</p>
                            <p className="text-[7px] text-verde-ebano/35">{formatPrice(product.price_cents)}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
