"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { ProfileSidebar } from "../../../components/ProfileSidebar";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Camera, Save, Loader2, CheckCircle2, Plus, X, MapPin
} from "lucide-react";

const COLLECTIONS = ["Amatista","Chai","Escencia","Etérea","Serpientes","Floral","Ecos de la Tierra","Anillos de Piedras","Diseños de Autor","Piezas Únicas"];
const MATERIALS = ["Plata .925","Plata .950","Oro 14k","Oro 18k","Oro Blanco 14k","Baño de Oro 24k"];
const RING_SIZES = ["5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10"];
const BRACELET_SIZES = ["XS (14cm)","S (16cm)","M (17cm)","L (18cm)","XL (19cm)"];
const NECKLACE_LENGTHS = ["40cm","45cm","50cm","55cm","60cm","70cm"];
const MX_STATES = ["Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas","Chihuahua","Ciudad de México","Coahuila","Colima","Durango","Guanajuato","Guerrero","Hidalgo","Jalisco","México","Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas"];

type SaveStatus = "idle" | "saving" | "saved" | "error";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-verde-ebano/8 p-8 flex flex-col gap-6">
      <h2 className="text-[10px] uppercase tracking-[0.5em] text-verde-ebano/40 border-b border-verde-ebano/6 pb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/40">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "bg-transparent border-b border-verde-ebano/12 py-2.5 text-sm text-verde-ebano outline-none focus:border-oro-antiguo transition-colors placeholder:text-verde-ebano/20";

export default function CuentaPage() {
  const { user, isAuthenticated, refreshProfile } = useAuthStore();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [ringSize, setRingSize] = useState("");
  const [braceletSize, setBraceletSize] = useState("");
  const [necklaceLength, setNecklaceLength] = useState("");
  const [preferredCollections, setPreferredCollections] = useState<string[]>([]);
  const [preferredMaterials, setPreferredMaterials] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Address
  const [recipientName, setRecipientName] = useState("");
  const [street, setStreet] = useState("");
  const [extNum, setExtNum] = useState("");
  const [intNum, setIntNum] = useState("");
  const [colonia, setColonia] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [addressId, setAddressId] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth"); return; }
    if (user) {
      setFullName(user.fullName || "");
      setDisplayName(user.displayName || "");
      setPhone(user.phone || "");
      setRingSize(user.ringSize || "");
      setBraceletSize(user.braceletSize || "");
      setNecklaceLength(user.necklaceLength || "");
      setPreferredCollections(user.preferredCollections || []);
      setPreferredMaterials(user.preferredMaterials || []);
      loadAddress();
    }
  }, [isAuthenticated, user?.id]);

  const loadAddress = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single();
    if (data) {
      setAddressId(data.id);
      setRecipientName(data.recipient_name || "");
      setStreet(data.street || "");
      setExtNum(data.exterior_num || "");
      setIntNum(data.interior_num || "");
      setColonia(data.colonia || "");
      setMunicipality(data.municipality || "");
      setCity(data.city || "");
      setState(data.state || "");
      setPostalCode(data.postal_code || "");
      setDeliveryNotes(data.delivery_notes || "");
    }
  };

  const toggleChip = (val: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const path = `avatars/${user.id}/${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("customer-uploads").upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("customer-uploads").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      await refreshProfile();
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaveStatus("saving");
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      display_name: displayName,
      phone,
      ring_size: ringSize,
      bracelet_size: braceletSize,
      necklace_length: necklaceLength,
      preferred_collections: preferredCollections,
      preferred_materials: preferredMaterials,
    }).eq("id", user.id);
    if (error) { setSaveStatus("error"); return; }
    await refreshProfile();
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const saveAddress = async () => {
    if (!user) return;
    setSavingAddress(true);
    const payload = {
      user_id: user.id,
      recipient_name: recipientName,
      street, exterior_num: extNum, interior_num: intNum,
      colonia, municipality, city, state, postal_code: postalCode,
      delivery_notes: deliveryNotes, is_default: true, address_type: "shipping",
    };
    if (addressId) {
      await supabase.from("addresses").update(payload).eq("id", addressId);
    } else {
      const { data } = await supabase.from("addresses").insert(payload).select().single();
      if (data) setAddressId(data.id);
    }
    setSavingAddress(false);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <Header />
      <div className="pt-28 pb-24 luxury-container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <ProfileSidebar />

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-[9px] uppercase tracking-[0.7em] text-oro-antiguo">Configuración</p>
              <h1 className="text-3xl font-display text-verde-ebano">Mi Cuenta</h1>
            </div>

            {/* Avatar */}
            <Section title="Foto de Perfil">
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <div className="w-20 h-20 bg-verde-ebano/5 border border-verde-ebano/10 overflow-hidden flex items-center justify-center">
                    {user.avatarUrl ? (
                      <Image src={user.avatarUrl} alt="" width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-3xl font-display text-verde-ebano/30">{user.fullName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-verde-ebano/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera size={18} className="text-hueso-seda" strokeWidth={1.5} />
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                <div className="flex flex-col gap-1">
                  <button onClick={() => fileRef.current?.click()} className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano border-b border-verde-ebano/20 pb-0.5 w-fit hover:border-oro-antiguo hover:text-oro-antiguo transition-colors">
                    Cambiar Foto
                  </button>
                  <p className="text-[8px] text-verde-ebano/30">JPG, PNG o WEBP. Máximo 5MB.</p>
                </div>
              </div>
            </Section>

            {/* Personal info */}
            <Section title="Información Personal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Nombre Completo">
                  <input value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} placeholder="Tu nombre completo" />
                </Field>
                <Field label="Nombre para mostrar">
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)} className={inputClass} placeholder="Como quieres que te llamen" />
                </Field>
                <Field label="Correo Electrónico">
                  <input value={user.email} disabled className={`${inputClass} opacity-40 cursor-not-allowed`} />
                </Field>
                <Field label="Teléfono / WhatsApp">
                  <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+52 55 0000 0000" type="tel" />
                </Field>
              </div>
            </Section>

            {/* Size preferences */}
            <Section title="Medidas y Preferencias">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Talla de Anillo">
                  <select value={ringSize} onChange={e => setRingSize(e.target.value)} className={`${inputClass} cursor-pointer`}>
                    <option value="">Seleccionar</option>
                    {RING_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Talla de Pulsera">
                  <select value={braceletSize} onChange={e => setBraceletSize(e.target.value)} className={`${inputClass} cursor-pointer`}>
                    <option value="">Seleccionar</option>
                    {BRACELET_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Largo de Collar">
                  <select value={necklaceLength} onChange={e => setNecklaceLength(e.target.value)} className={`${inputClass} cursor-pointer`}>
                    <option value="">Seleccionar</option>
                    {NECKLACE_LENGTHS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Colecciones Favoritas">
                <div className="flex flex-wrap gap-2 mt-1">
                  {COLLECTIONS.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleChip(c, preferredCollections, setPreferredCollections)}
                      className={`text-[8px] uppercase tracking-[0.3em] px-3 py-1.5 border transition-all duration-200 ${
                        preferredCollections.includes(c)
                          ? "bg-verde-ebano text-hueso-seda border-verde-ebano"
                          : "border-verde-ebano/15 text-verde-ebano/50 hover:border-verde-ebano/40"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Materiales Preferidos">
                <div className="flex flex-wrap gap-2 mt-1">
                  {MATERIALS.map(m => (
                    <button
                      key={m}
                      onClick={() => toggleChip(m, preferredMaterials, setPreferredMaterials)}
                      className={`text-[8px] uppercase tracking-[0.3em] px-3 py-1.5 border transition-all duration-200 ${
                        preferredMaterials.includes(m)
                          ? "bg-oro-antiguo/20 text-oro-antiguo border-oro-antiguo/50"
                          : "border-verde-ebano/15 text-verde-ebano/50 hover:border-verde-ebano/40"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>
            </Section>

            {/* Save profile button */}
            <button
              onClick={saveProfile}
              disabled={saveStatus === "saving"}
              className="flex items-center justify-center gap-3 bg-verde-ebano text-hueso-seda text-[10px] uppercase tracking-[0.5em] py-4 hover:bg-oro-antiguo hover:text-verde-ebano transition-all duration-500 disabled:opacity-60"
            >
              {saveStatus === "saving" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saveStatus === "saved" ? (
                <><CheckCircle2 size={14} className="text-green-400" /> Guardado</>
              ) : (
                <><Save size={14} /> Guardar Perfil</>
              )}
            </button>

            {/* Shipping address */}
            <Section title="Dirección de Envío Principal">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={12} strokeWidth={1.2} className="text-oro-antiguo" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-verde-ebano/40">Dirección guardada para tus pedidos</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Nombre del Destinatario">
                  <input value={recipientName} onChange={e => setRecipientName(e.target.value)} className={inputClass} placeholder="Nombre completo" />
                </Field>
                <Field label="Calle">
                  <input value={street} onChange={e => setStreet(e.target.value)} className={inputClass} placeholder="Av. Principal" />
                </Field>
                <Field label="Número Exterior">
                  <input value={extNum} onChange={e => setExtNum(e.target.value)} className={inputClass} placeholder="123" />
                </Field>
                <Field label="Número Interior">
                  <input value={intNum} onChange={e => setIntNum(e.target.value)} className={inputClass} placeholder="Depto. 4B (opcional)" />
                </Field>
                <Field label="Colonia">
                  <input value={colonia} onChange={e => setColonia(e.target.value)} className={inputClass} placeholder="Colonia Polanco" />
                </Field>
                <Field label="Municipio / Alcaldía">
                  <input value={municipality} onChange={e => setMunicipality(e.target.value)} className={inputClass} placeholder="Miguel Hidalgo" />
                </Field>
                <Field label="Ciudad">
                  <input value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="Ciudad de México" />
                </Field>
                <Field label="Estado">
                  <select value={state} onChange={e => setState(e.target.value)} className={`${inputClass} cursor-pointer`}>
                    <option value="">Seleccionar estado</option>
                    {MX_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Código Postal">
                  <input value={postalCode} onChange={e => setPostalCode(e.target.value)} className={inputClass} placeholder="11560" maxLength={5} />
                </Field>
              </div>
              <Field label="Indicaciones de Entrega">
                <textarea
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  className={`${inputClass} resize-none`}
                  rows={2}
                  placeholder="Ej: Portero automático, dejar con vecino..."
                />
              </Field>
              <button
                onClick={saveAddress}
                disabled={savingAddress}
                className="flex items-center gap-3 border border-verde-ebano/20 text-verde-ebano text-[9px] uppercase tracking-[0.4em] px-6 py-3 hover:border-oro-antiguo hover:text-oro-antiguo transition-all w-fit"
              >
                {savingAddress ? <Loader2 size={12} className="animate-spin" /> : addressSaved ? <CheckCircle2 size={12} className="text-green-500" /> : <Save size={12} />}
                {addressSaved ? "Dirección Guardada" : "Guardar Dirección"}
              </button>
            </Section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
