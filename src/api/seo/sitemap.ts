import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

/**
 * Programmatic Sitemap Generator for SEO
 * Dynamically includes public portfolios to boost User-Generated Content ranking.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const publicPortfolios = await prisma.userProfile.findMany({
    where: { isPublic: true },
    select: { username: true, updatedAt: true },
  });

  const baseUrl = 'https://creatorasset.ai';
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${publicPortfolios.map(p => `
        <url>
          <loc>${baseUrl}/p/${p.username}</loc>
          <lastmod>${p.updatedAt.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}