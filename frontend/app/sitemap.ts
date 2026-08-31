import { MetadataRoute } from 'next'
import { PRODUCTS } from '../constants/products'

import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://minervaalcarazjoyeria.mx';

  let productEntries: any[] = [];
  let collectionEntries: any[] = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabaseAdmin
        .from("products")
        .select("id, collection_name")
        .eq("is_active", true);

      if (data) {
        productEntries = data.map((product) => ({
          url: `${baseUrl}/product/${product.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));

        const collections = Array.from(new Set(data.map(p => p.collection_name).filter(Boolean)));
        collectionEntries = collections.map((col) => ({
          url: `${baseUrl}/shop?collection=${encodeURIComponent(col as string)}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }));
      }
    }
  } catch (err) {
    console.error("Failed to generate sitemap for products", err);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/atelier`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productEntries,
    ...collectionEntries,
  ]
}
