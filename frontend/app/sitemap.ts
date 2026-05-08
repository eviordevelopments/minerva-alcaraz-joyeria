import { MetadataRoute } from 'next'
import { PRODUCTS } from '../constants/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://minervaalcarazjoyeria.mx'

  // Dynamic products
  const productEntries = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic collections
  const collections = Array.from(new Set(PRODUCTS.map(p => p.collection)))
  const collectionEntries = collections.map((col) => ({
    url: `${baseUrl}/shop?collection=${encodeURIComponent(col)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

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
