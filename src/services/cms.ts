import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CmsPage, CmsPageSection, ServiceItem, Testimonial, FaqItem } from '../types';
import { SEED_SERVICES, SEED_TESTIMONIALS } from '../data/seedData';
import { logAudit } from './audit';

export const DEFAULT_HOMEPAGE_SECTIONS: CmsPageSection[] = [
  { id: 'sec-hero', section_key: 'hero', title: 'Buy | Rent | Invest', subtitle: 'Find your dream property in Delhi NCR', sort_order: 1, enabled: true },
  { id: 'sec-search', section_key: 'search', title: 'Property Search Bar', sort_order: 2, enabled: true },
  { id: 'sec-categories', section_key: 'categories', title: 'Browse by Category', sort_order: 3, enabled: true },
  { id: 'sec-featured', section_key: 'featured_properties', title: 'Featured Properties', subtitle: 'Handpicked properties for you', sort_order: 4, enabled: true },
  { id: 'sec-banner', section_key: 'projects_banner', title: 'Explore Our Latest Projects', subtitle: 'Discover new launch and ongoing projects', sort_order: 5, enabled: true },
  { id: 'sec-new-launch', section_key: 'new_launch', title: 'New Launch Projects', subtitle: 'Explore best new launch projects', sort_order: 6, enabled: true },
  { id: 'sec-services', section_key: 'services', title: 'Our Services', subtitle: 'Complete real estate solutions under one roof', sort_order: 7, enabled: true },
  { id: 'sec-why-us', section_key: 'why_choose_us', title: 'Why Choose SunPropMart', subtitle: 'Your trusted partner in real estate', sort_order: 8, enabled: true },
  { id: 'sec-locations', section_key: 'popular_locations', title: 'Popular Locations', subtitle: 'Find properties in prime locations', sort_order: 9, enabled: true },
  { id: 'sec-testimonials', section_key: 'testimonials', title: 'Testimonials', subtitle: 'What our clients say about us', sort_order: 10, enabled: true },
  { id: 'sec-blog', section_key: 'blog_insights', title: 'Latest News & Insights', subtitle: 'Real estate news, market insights and investment tips', sort_order: 11, enabled: true },
  { id: 'sec-cta', section_key: 'cta_banner', title: "Let's Find the Perfect Property for You", subtitle: 'Connect with our experts and get personalized recommendations.', sort_order: 12, enabled: true },
];

export async function getHomepageSections(): Promise<CmsPageSection[]> {
  if (!isSupabaseConfigured) return DEFAULT_HOMEPAGE_SECTIONS;
  try {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_HOMEPAGE_SECTIONS;
    return data as CmsPageSection[];
  } catch {
    return DEFAULT_HOMEPAGE_SECTIONS;
  }
}

export async function updateHomepageSection(
  id: string,
  updates: Partial<CmsPageSection>,
  operatorId?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not connected' };
  try {
    const { error } = await supabase
      .from('page_sections')
      .update(updates)
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    await logAudit('SECTION_UPDATED', 'page_sections', id, null, updates, operatorId);
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  if (!isSupabaseConfigured) return SEED_SERVICES;
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) return SEED_SERVICES;
    return data as ServiceItem[];
  } catch {
    return SEED_SERVICES;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return SEED_TESTIMONIALS;
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('rating', { ascending: false });

    if (error || !data || data.length === 0) return SEED_TESTIMONIALS;
    return data as Testimonial[];
  } catch {
    return SEED_TESTIMONIALS;
  }
}
