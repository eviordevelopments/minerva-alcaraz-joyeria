import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandSafeStorage } from "../safeStorage";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  // We use product.id (static slug or UUID) as the cart key
  productId: string;
  sku: string;
  name: string;
  collection: string;
  category: string;
  image: string;
  price: number; // MXN pesos
  currency: string;
  quantity: number;
  size?: string;
  paymentLink?: string | null;
  requires_shipping?: boolean;
}

// ─── Sanitizer ────────────────────────────────────────────────────────────────
export const isTestOrInvalidProduct = (item: Partial<CartItem> | null | undefined): boolean => {
  if (!item) return true;
  const name = (item.name || "").toLowerCase().trim();
  const sku = (item.sku || "").toUpperCase().trim();
  const id = (item.productId || "").trim();
  const price = Number(item.price) || 0;

  // Filter out any ghost/test products
  if (name.includes("prueba") || name.includes("test")) return true;
  if (id === "390acec2-5ef3-42e2-99d2-59140013d394") return true;
  if (id === "b00de559-a3bc-4762-867a-5fa2535b947c") return true;
  if (id === "bc1ec5a3-3060-4af6-89bf-3f79897bd480") return true;
  if (sku === "MA-CO-AMA-GEN-PUN-0001" || sku === "MA-PI-DIS-GEN-PUN-0001" || sku === "MA-PI-DIS-PLA-PUN-0001") return true;
  if (price <= 10 && name.includes("prueba")) return true;

  return false;
};

// Immediate client-side storage cleanup before React mounts
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("minerva-cart-storage");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.items && Array.isArray(parsed.state.items)) {
        const cleaned = parsed.state.items.filter((it: any) => !isTestOrInvalidProduct(it));
        if (cleaned.length !== parsed.state.items.length) {
          parsed.state.items = cleaned;
          localStorage.setItem("minerva-cart-storage", JSON.stringify(parsed));
        }
      }
    }
  } catch {
    // Ignore storage parse errors
  }
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Derived
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (newItem) => {
        if (isTestOrInvalidProduct(newItem)) {
          console.warn("Blocked adding test product to cart:", newItem);
          return;
        }

        const items = get().items.filter((i) => !isTestOrInvalidProduct(i));
        const existing = items.find((i) => i.productId === newItem.productId);
        if (existing) {
          // Increment quantity
          set({
            items: items.map((i) =>
              i.productId === newItem.productId
                ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, { ...newItem, quantity: newItem.quantity ?? 1 }],
            isOpen: true,
          });
        }
      },

      removeItem: (productId) =>
        set({
          items: get()
            .items.filter((i) => !isTestOrInvalidProduct(i))
            .filter((i) => i.productId !== productId),
        }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get()
            .items.filter((i) => !isTestOrInvalidProduct(i))
            .map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get()
          .items.filter((i) => !isTestOrInvalidProduct(i))
          .reduce((s, i) => s + i.quantity, 0),

      subtotal: () =>
        get()
          .items.filter((i) => !isTestOrInvalidProduct(i))
          .reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    {
      name: "minerva-cart-storage",
      version: 2,
      storage: createJSONStorage(() => zustandSafeStorage),
      // Only persist valid items, not isOpen (cart should start closed)
      partialize: (state) => ({
        items: (state.items || []).filter((it) => !isTestOrInvalidProduct(it)),
      }),
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.items)) {
          return { items: [] };
        }
        return {
          ...persistedState,
          items: persistedState.items.filter((it: any) => !isTestOrInvalidProduct(it)),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.items) {
          state.items = state.items.filter((it) => !isTestOrInvalidProduct(it));
        }
      },
    }
  )
);
