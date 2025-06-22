import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/documents/'],
    },
    sitemap: 'https://docgen-saas.vercel.app/sitemap.xml',
  }
} 