import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * The dashboard and certificate are personal to one browser and hold nothing a
 * search engine should index, so they are excluded rather than crawled.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard', '/certificate'] },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
