"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Images, Plus, Crown, Lock, Globe, Link2, Loader2,
  Pencil, Trash2, X, Check, ArrowRight
} from "lucide-react";

type AlbumVisibility = "private" | "shared_link" | "public";

interface Album {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  visibility: AlbumVisibility;
  share_token: string;
  is_default: boolean;
  item_count?: number;
}

const VISIBILITY_MAP = {
  private:     { label: "Privado",   icon: Lock,   color: "text-verde-ebano/40" },
  shared_link: { label: "Con link",  icon: Link2,  color: "text-oro-antiguo/60" },
  public:      { label: "Público",   icon: Globe,  color: "text-verde-ebano/60" },
};

export default function AlbumesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newVisibility, setNewVisibility] = useState<AlbumVisibility>("private");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    if (user && !user.isCircleMember) { router.push("/perfil"); return; }
    fetchAlbums();
  }, [isAuthenticated, user?.id]);

  const fetchAlbums = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("albums")
      .select(`
        id, slug, title, description, cover_image_url,
        visibility, share_token, is_default,
        album_items(count)
      `)
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    setAlbums(
      (data || []).map((a: any) => ({
        ...(a as unknown as Album),
        item_count: (a.album_items as {count: number}[])?.[0]?.count ?? 0,
      }))
    );
    setIsLoading(false);
  };

  const createAlbum = async () => {
    if (!user || !newTitle.trim()) return;
    setIsCreating(true);
    const slug = newTitle.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      + "-" + Date.now().toString(36);

    const { data, error } = await supabase.from("albums").insert({
      user_id: user.id,
      slug,
      title: newTitle.trim(),
      description: newDesc.trim() || null,
      visibility: newVisibility,
    }).select().single();

    if (!error && data) {
      setAlbums(prev => [data as Album, ...prev]);
      setShowCreateModal(false);
      setNewTitle(""); setNewDesc(""); setNewVisibility("private");
      router.push(`/perfil/albumes/${data.id}`);
    }
    setIsCreating(false);
  };

  const deleteAlbum = async (albumId: string) => {
    if (!confirm("¿Eliminar este álbum? Los productos no serán eliminados.")) return;
    setDeletingId(albumId);
    await supabase.from("albums").delete().eq("id", albumId);
    setAlbums(prev => prev.filter(a => a.id !== albumId));
    setDeletingId(null);
  };

  const copyShareLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/album/${token}`);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />

          <div className="flex-1 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Crown size={10} strokeWidth={1.5} className="text-oro-antiguo" />
                  <p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">The Circle</p>
                </div>
                <h1 className="text-3xl font-display text-verde-ebano">Mis Álbumes</h1>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-verde-ebano text-hueso-seda text-[9px] uppercase tracking-[0.4em] px-5 py-3 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-300 group"
              >
                <Plus size={12} strokeWidth={2} />
                Nuevo Álbum
              </button>
            </div>

            {/* Info strip */}
            <div className="bg-white border border-oro-antiguo/12 p-5 flex items-start gap-4">
              <div className="w-8 h-8 border border-oro-antiguo/20 flex items-center justify-center flex-shrink-0">
                <Images size={13} strokeWidth={1.2} className="text-oro-antiguo" />
              </div>
              <p className="text-[10px] text-verde-ebano/50 leading-loose">
                Crea álbumes personales con las piezas que más te inspiran. Agrega productos del catálogo, escribe notas, y comparte tu colección con quienes elijas. Tus álbumes son tu legado curado.
              </p>
            </div>

            {/* Albums grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} strokeWidth={1} className="animate-spin text-oro-antiguo/40" />
              </div>
            ) : albums.length === 0 ? (
              <div className="bg-white border border-verde-ebano/8 p-16 flex flex-col items-center gap-5 text-center">
                <div className="w-14 h-14 border border-oro-antiguo/15 flex items-center justify-center">
                  <Images size={20} strokeWidth={0.8} className="text-oro-antiguo/40" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-verde-ebano/40 uppercase tracking-[0.3em]">Aún no tienes álbumes</p>
                  <p className="text-[10px] text-verde-ebano/25">Crea tu primera colección personal</p>
                </div>
                <button onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 text-[9px] uppercase tracking-[0.5em] text-oro-antiguo border-b border-oro-antiguo/30 pb-0.5 hover:border-oro-antiguo transition-colors"
                >
                  <Plus size={10} /> Crear Álbum
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {albums.map((album, i) => {
                  const vis = VISIBILITY_MAP[album.visibility];
                  const VisIcon = vis.icon;
                  return (
                    <motion.div
                      key={album.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border border-verde-ebano/8 group overflow-hidden"
                    >
                      {/* Cover */}
                      <Link href={`/perfil/albumes/${album.id}`} className="block relative h-40 bg-verde-ebano/4 overflow-hidden">
                        {album.cover_image_url ? (
                          <Image src={album.cover_image_url} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Images size={28} strokeWidth={0.6} className="text-verde-ebano/10" />
                          </div>
                        )}
                        {album.is_default && (
                          <div className="absolute top-3 left-3 bg-verde-ebano text-hueso-seda text-[7px] uppercase tracking-[0.4em] px-2 py-1">
                            Lista de Deseos
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </Link>

                      {/* Meta */}
                      <div className="p-5 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-0.5">
                            <Link href={`/perfil/albumes/${album.id}`} className="text-[10px] uppercase tracking-[0.3em] text-verde-ebano font-medium hover:text-oro-antiguo transition-colors">
                              {album.title}
                            </Link>
                            <p className="text-[9px] text-verde-ebano/30">
                              {album.item_count ?? 0} {album.item_count === 1 ? "pieza" : "piezas"}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {album.visibility === "shared_link" && (
                              <button onClick={() => copyShareLink(album.share_token)}
                                className="w-7 h-7 border border-verde-ebano/10 flex items-center justify-center hover:border-oro-antiguo transition-colors"
                                title="Copiar link"
                              >
                                <Link2 size={10} strokeWidth={1.5} className="text-verde-ebano/40 hover:text-oro-antiguo" />
                              </button>
                            )}
                            <Link href={`/perfil/albumes/${album.id}?edit=true`}
                              className="w-7 h-7 border border-verde-ebano/10 flex items-center justify-center hover:border-verde-ebano/30 transition-colors"
                            >
                              <Pencil size={10} strokeWidth={1.5} className="text-verde-ebano/40" />
                            </Link>
                            {!album.is_default && (
                              <button onClick={() => deleteAlbum(album.id)} disabled={deletingId === album.id}
                                className="w-7 h-7 border border-verde-ebano/10 flex items-center justify-center hover:border-red-200 transition-colors"
                              >
                                {deletingId === album.id
                                  ? <Loader2 size={10} className="animate-spin text-red-300" />
                                  : <Trash2 size={10} strokeWidth={1.5} className="text-verde-ebano/30 hover:text-red-400" />
                                }
                              </button>
                            )}
                          </div>
                        </div>

                        <div className={`flex items-center gap-1.5 text-[8px] uppercase tracking-[0.3em] ${vis.color}`}>
                          <VisIcon size={9} strokeWidth={1.5} />
                          {vis.label}
                        </div>

                        <Link href={`/perfil/albumes/${album.id}`}
                          className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.4em] text-verde-ebano/25 hover:text-oro-antiguo transition-colors group/link mt-1"
                        >
                          Ver Álbum <ArrowRight size={9} className="group-hover/link:translate-x-0.5 transition-transform" />
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

      {/* Create Album Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-verde-ebano/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-hueso-seda w-full max-w-md p-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-[8px] uppercase tracking-[0.6em] text-oro-antiguo">The Circle</p>
                  <h2 className="text-xl font-display text-verde-ebano">Nuevo Álbum</h2>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 border border-verde-ebano/10 flex items-center justify-center hover:border-verde-ebano/30 transition-colors">
                  <X size={13} strokeWidth={1.5} className="text-verde-ebano/40" />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Nombre del Álbum *</label>
                  <input
                    value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    className="bg-transparent border-b border-verde-ebano/15 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/25"
                    placeholder="Mi Colección de Oro..."
                    autoFocus
                    onKeyDown={e => { if (e.key === "Enter" && newTitle.trim()) createAlbum(); }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Descripción</label>
                  <textarea
                    value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2}
                    className="bg-transparent border-b border-verde-ebano/15 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors resize-none placeholder:text-verde-ebano/25"
                    placeholder="Una narrativa de este álbum..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">Visibilidad</label>
                  <div className="flex gap-2">
                    {(["private", "shared_link", "public"] as AlbumVisibility[]).map(v => {
                      const vis = VISIBILITY_MAP[v];
                      const VIcon = vis.icon;
                      return (
                        <button key={v} onClick={() => setNewVisibility(v)}
                          className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 border text-center transition-all duration-200 ${
                            newVisibility === v
                              ? "bg-verde-ebano text-hueso-seda border-verde-ebano"
                              : "border-verde-ebano/12 text-verde-ebano/40 hover:border-verde-ebano/30"
                          }`}
                        >
                          <VIcon size={12} strokeWidth={1.5} className={newVisibility === v ? "text-oro-antiguo" : ""} />
                          <span className="text-[7px] uppercase tracking-[0.3em]">{vis.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-verde-ebano/12 text-verde-ebano/40 text-[9px] uppercase tracking-[0.4em] py-3 hover:border-verde-ebano/30 transition-colors"
                >
                  Cancelar
                </button>
                <button onClick={createAlbum} disabled={isCreating || !newTitle.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-oro-antiguo text-verde-ebano text-[9px] uppercase tracking-[0.4em] py-3 hover:bg-verde-ebano hover:text-hueso-seda transition-all duration-300 disabled:opacity-50"
                >
                  {isCreating ? <Loader2 size={12} className="animate-spin" /> : <><Check size={12} /> Crear</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
