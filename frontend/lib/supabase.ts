import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Domain Types ──────────────────────────────────────────────────────────

export type CircleTier = "Observer" | "Initiate" | "Devotee" | "Keeper" | "Eternal";
export type OrderStatus = "draft" | "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type CustomizationStatus = "pending_review" | "in_design" | "quoted" | "approved" | "in_production" | "ready" | "delivered" | "cancelled";
export type AlbumVisibility = "private" | "shared_link" | "public";
export type NewsletterStatus = "subscribed" | "unsubscribed" | "pending_confirmation";
export type ProductCategory = "Anillos" | "Collares" | "Pulseras" | "Sets" | "Edición Limitada" | "Piezas Únicas" | "Pendientes" | "Broches";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  phone: string | null;
  phone_whatsapp: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  is_circle_member: boolean;
  circle_tier: CircleTier;
  circle_joined_at: string | null;
  circle_points: number;
  circle_code: string | null;
  preferred_collections: string[] | null;
  preferred_materials: string[] | null;
  ring_size: string | null;
  bracelet_size: string | null;
  necklace_length: string | null;
  newsletter_status: NewsletterStatus;
  created_at: string;
  updated_at: string;
};

export type Address = {
  id: string;
  user_id: string;
  address_type: "shipping" | "billing" | "both";
  is_default: boolean;
  recipient_name: string;
  phone: string | null;
  street: string;
  exterior_num: string;
  interior_num: string | null;
  colonia: string;
  municipality: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  delivery_notes: string | null;
  created_at: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  manifesto: string | null;
  narrative: string | null;
  image_url: string | null;
  theme_background: string;
  is_featured: boolean;
  is_circle_exclusive: boolean;
  display_order: number;
};

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string | null;
  significado: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  currency: string;
  category: ProductCategory;
  collection_id: string | null;
  collection_name: string | null;
  collection_slug?: string | null;
  materials: string[];
  primary_material: string | null;
  purity: string | null;
  occasions: string[] | null;
  is_featured: boolean;
  is_unique_piece: boolean;
  is_author_design: boolean;
  is_limited_edition: boolean;
  is_circle_exclusive: boolean;
  is_customizable: boolean;
  available_sizes: string[] | null;
  stock: number;
  images: string[];
  primary_image: string | null;
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  product_image: string | null;
  unit_price_cents: number;
  quantity: number;
  subtotal_cents: number;
  size_requested: string | null;
  engraving_text: string | null;
  customization_notes: string | null;
};

export type Cart = {
  id: string;
  user_id: string | null;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  total_cents: number;
  promo_code: string | null;
  is_active: boolean;
  items?: CartItem[];
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  total_cents: number;
  currency: string;
  placed_at: string;
  tracking_number: string | null;
  points_earned: number;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  product_sku: string;
  product_image: string | null;
  collection_name: string | null;
  materials: string[];
  unit_price_cents: number;
  quantity: number;
  subtotal_cents: number;
};

export type Favorite = {
  id: string;
  user_id: string;
  product_id: string;
  notes: string | null;
  created_at: string;
  product?: Product;
};

export type Album = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  visibility: AlbumVisibility;
  share_token: string;
  is_default: boolean;
  items?: Product[];
};

export type CustomizationRequest = {
  id: string;
  request_number: string;
  user_id: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: CustomizationStatus;
  request_type: string | null;
  description: string;
  desired_material: string | null;
  desired_stone: string | null;
  desired_size: string | null;
  engraving_text: string | null;
  budget_cents: number | null;
  quoted_price_cents: number | null;
  created_at: string;
};

// ─── Helper: price formatter ───────────────────────────────────────────────

export function formatPrice(cents: number, currency = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

