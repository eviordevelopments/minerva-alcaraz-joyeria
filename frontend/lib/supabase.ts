import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Local state will be used.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
  material: string;
  weight_grams: number;
  gemstone_origin?: string;
  is_exclusive_circle: boolean;
};

export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  manifesto: string;
};
