import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../supabase";

export interface FavoriteItem {
  productId: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  collection: string;
  category: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  isFavorite: (productId: string) => boolean;
  toggle: (item: FavoriteItem, userId?: string) => Promise<void>;
  syncFromDB: (userId: string) => Promise<void>;
  clearLocal: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      isFavorite: (productId) =>
        get().items.some((i) => i.productId === productId),

      toggle: async (item, userId) => {
        const already = get().isFavorite(item.productId);

        // Optimistic local update
        if (already) {
          set({ items: get().items.filter((i) => i.productId !== item.productId) });
        } else {
          set({ items: [...get().items, item] });
        }

        // Persist to DB if user is logged in
        if (userId) {
          try {
            // DB favorites require a UUID product id — if the product came from
            // the static catalog (string slug), we skip DB persistence gracefully
            const isUUID = /^[0-9a-f-]{36}$/i.test(item.productId);
            if (!isUUID) return;

            if (already) {
              await supabase
                .from("favorites")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", item.productId);
            } else {
              await supabase
                .from("favorites")
                .insert({ user_id: userId, product_id: item.productId });
            }
          } catch (err) {
            console.warn("Favorites DB sync error:", err);
          }
        }
      },

      syncFromDB: async (userId) => {
        try {
          const { data } = await supabase
            .from("favorites")
            .select(
              `product_id,
               products:product_id (
                 id, sku, name, price_cents, currency,
                 collection_name, category, images, primary_image
               )`
            )
            .eq("user_id", userId);

          if (!data) return;

          const items: FavoriteItem[] = data
            .filter((row) => row.products)
            .map((row) => {
              const rawP = Array.isArray(row.products) ? row.products[0] : row.products;
              const p = (rawP as unknown) as Record<string, unknown>;
              const images = (p.images as string[]) ?? [];
              return {
                productId: row.product_id as string,
                sku: p.sku as string,
                name: p.name as string,
                image: images[0] ?? (p.primary_image as string) ?? "",
                price: Math.round(((p.price_cents as number) ?? 0) / 100),
                currency: (p.currency as string) ?? "MXN",
                collection: (p.collection_name as string) ?? "",
                category: p.category as string,
              };
            });

          set({ items });
        } catch (err) {
          console.warn("Favorites sync error:", err);
        }
      },

      clearLocal: () => set({ items: [] }),
    }),
    { name: "minerva-favorites-storage" }
  )
);
