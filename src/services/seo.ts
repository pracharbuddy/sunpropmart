import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SeoMetadata } from '../types';

export async function getSeoMetadata(
  entityType: 'property' | 'project' | 'page' | 'post' | 'service',
  entityId: string
): Promise<SeoMetadata | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('seo_metadata')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .maybeSingle();

    if (error || !data) return null;
    return data as SeoMetadata;
  } catch {
    return null;
  }
}

export async function upsertSeoMetadata(seoData: SeoMetadata): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('seo_metadata')
      .upsert(seoData, { onConflict: 'entity_type,entity_id' });

    return !error;
  } catch {
    return false;
  }
}
