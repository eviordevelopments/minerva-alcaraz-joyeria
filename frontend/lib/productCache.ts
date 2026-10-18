// Lightweight in-memory product cache for client navigation
// Prevents duplicate concurrent network requests and payload parsing on mobile

let cachedProductsPromise: Promise<any[]> | null = null;
let cachedProductsData: any[] | null = null;

export async function getCachedProducts(): Promise<any[]> {
  if (cachedProductsData) {
    return cachedProductsData;
  }

  if (!cachedProductsPromise) {
    cachedProductsPromise = (async (): Promise<any[]> => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) return [];
        const data = await res.json();
        cachedProductsData = data.products || [];
        return cachedProductsData || [];
      } catch (err) {
        console.warn("Error fetching products:", err);
        cachedProductsPromise = null;
        return [];
      }
    })();
  }

  return cachedProductsPromise;
}
