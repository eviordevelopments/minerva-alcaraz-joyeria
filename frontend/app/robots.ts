import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/the-circle/dashboard', '/auth'],
    },
    sitemap: 'https://minervaalcarazjoyeria.mx/sitemap.xml',
  }
}
