import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Property, Project, BlogPost, ServiceItem } from '../types';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const BASE_URL = 'https://sunpropmart.in';

/**
 * Dynamically queries published entities from Supabase and formats them as a standard XML sitemap
 */
export async function generateDynamicSitemapXml(): Promise<string> {
  const entries: SitemapEntry[] = [
    { loc: `${BASE_URL}/`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 1.0 },
    { loc: `${BASE_URL}/properties`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/projects`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 0.9 },
    { loc: `${BASE_URL}/services`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/government-work`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/construction`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/investment`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
    { loc: `${BASE_URL}/blog`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/about`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.7 },
    { loc: `${BASE_URL}/contact`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.7 },
    { loc: `${BASE_URL}/careers`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.6 },
    { loc: `${BASE_URL}/privacy`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'yearly', priority: 0.3 },
    { loc: `${BASE_URL}/terms`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'yearly', priority: 0.3 },
  ];

  if (isSupabaseConfigured) {
    try {
      // 1. Published Properties (Exclude drafts, under_review, rejected, archived, deleted)
      const { data: properties } = await supabase
        .from('properties')
        .select('slug, updated_at')
        .eq('status', 'published')
        .is('deleted_at', null);

      if (properties) {
        properties.forEach((p) => {
          if (p.slug) {
            entries.push({
              loc: `${BASE_URL}/properties/${p.slug}`,
              lastmod: p.updated_at ? p.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
              changefreq: 'weekly',
              priority: 0.8,
            });
          }
        });
      }

      // 2. Published Projects
      const { data: projects } = await supabase
        .from('projects')
        .select('slug, updated_at');

      if (projects) {
        projects.forEach((proj) => {
          if (proj.slug) {
            entries.push({
              loc: `${BASE_URL}/projects/${proj.slug}`,
              lastmod: proj.updated_at ? proj.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
              changefreq: 'weekly',
              priority: 0.8,
            });
          }
        });
      }

      // 3. Published Blog Posts
      const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('status', 'published');

      if (posts) {
        posts.forEach((post) => {
          if (post.slug) {
            entries.push({
              loc: `${BASE_URL}/blog/${post.slug}`,
              lastmod: post.updated_at ? post.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
              changefreq: 'weekly',
              priority: 0.7,
            });
          }
        });
      }
    } catch {
      // Return base entries if remote query is restricted
    }
  }

  // XML Builder
  const xmlItems = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;
}
