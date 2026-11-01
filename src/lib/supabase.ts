import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property, Project, Lead, SiteVisit, UserProfile, AuditLog } from '../types';

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ocfhouwhnhgyqwioozkr.supabase.co';

export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_RYgvyzShAOZWW5vuO4HCag_sZ3WjaFB';

export const supabaseProjectId = (() => {
  try {
    const url = new URL(supabaseUrl);
    return url.hostname.split('.')[0] || 'ocfhouwhnhgyqwioozkr';
  } catch {
    return 'ocfhouwhnhgyqwioozkr';
  }
})();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder-project') &&
  supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseHealth {
  isConfigured: boolean;
  isConnected: boolean;
  projectId: string;
  projectUrl: string;
  tables: {
    properties: boolean;
    projects: boolean;
    leads: boolean;
    site_visits: boolean;
    profiles: boolean;
  };
  hasTables: boolean;
  message: string;
  checkedAt: string;
}

/**
 * Checks connection to the Supabase backend and tests if tables exist.
 */
export async function checkSupabaseConnection(): Promise<SupabaseHealth> {
  const result: SupabaseHealth = {
    isConfigured: isSupabaseConfigured,
    isConnected: false,
    projectId: supabaseProjectId,
    projectUrl: supabaseUrl,
    tables: {
      properties: false,
      projects: false,
      leads: false,
      site_visits: false,
      profiles: false,
    },
    hasTables: false,
    message: '',
    checkedAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    result.message = 'Supabase credentials not configured';
    return result;
  }

  try {
    // Test properties table
    const propRes = await supabase.from('properties').select('id', { count: 'exact', head: true }).limit(1);
    result.tables.properties = !propRes.error;

    // Test projects table
    const projRes = await supabase.from('projects').select('id', { count: 'exact', head: true }).limit(1);
    result.tables.projects = !projRes.error;

    // Test leads table
    const leadsRes = await supabase.from('leads').select('id', { count: 'exact', head: true }).limit(1);
    result.tables.leads = !leadsRes.error;

    // Test site_visits table
    const visitsRes = await supabase.from('site_visits').select('id', { count: 'exact', head: true }).limit(1);
    result.tables.site_visits = !visitsRes.error;

    // Test profiles table
    const profRes = await supabase.from('profiles').select('id', { count: 'exact', head: true }).limit(1);
    result.tables.profiles = !profRes.error;

    // Supabase endpoint responded
    result.isConnected = true;
    result.hasTables = Object.values(result.tables).some(Boolean);

    if (result.hasTables) {
      result.message = 'Connected to Supabase with active database schema';
    } else {
      result.message = 'Connected to Supabase project. Tables need to be initialized via SQL schema.';
    }
  } catch (err: any) {
    result.isConnected = false;
    result.message = `Connection error: ${err.message || 'Unknown network error'}`;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Supabase Data Access Functions with Graceful Local Fallbacks
// ---------------------------------------------------------------------------

/**
 * Fetch properties from Supabase
 */
export async function fetchPropertiesFromSupabase(): Promise<Property[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data as Property[];
  } catch {
    return null;
  }
}

/**
 * Insert or update a property in Supabase
 */
export async function syncPropertyToSupabase(prop: Partial<Property>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const payload: any = { ...prop };
    // If id is not a standard UUID, let Supabase auto-generate one on insert
    const isUuid = prop.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(prop.id);
    if (!isUuid) {
      delete payload.id;
    }

    const { error } = await supabase
      .from('properties')
      .upsert(payload, { onConflict: 'slug' });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch leads from Supabase
 */
export async function fetchLeadsFromSupabase(): Promise<Lead[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data as Lead[];
  } catch {
    return null;
  }
}

/**
 * Insert a new lead into Supabase
 */
export async function syncLeadToSupabase(lead: Partial<Lead>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const payload: any = {
      customer_name: lead.customer_name,
      customer_email: lead.customer_email,
      customer_phone: lead.customer_phone,
      property_id: lead.property_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lead.property_id) ? lead.property_id : null,
      message: lead.message,
      source: lead.source || 'Website',
      status: lead.status || 'New',
      budget_range: lead.budget_range,
      preferred_location: lead.preferred_location,
    };

    const { error } = await supabase.from('leads').insert(payload);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch site visits from Supabase
 */
export async function fetchSiteVisitsFromSupabase(): Promise<SiteVisit[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('site_visits')
      .select('*')
      .order('visit_date', { ascending: false });

    if (error || !data) return null;
    return data as SiteVisit[];
  } catch {
    return null;
  }
}

/**
 * Insert a new site visit into Supabase
 */
export async function syncSiteVisitToSupabase(visit: Partial<SiteVisit>): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const payload: any = {
      customer_name: visit.customer_name,
      customer_email: visit.customer_email,
      customer_phone: visit.customer_phone,
      property_id: visit.property_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(visit.property_id) ? visit.property_id : null,
      visit_date: visit.visit_date,
      visit_time: visit.visit_time,
      status: visit.status || 'Requested',
      notes: visit.notes,
    };

    const { error } = await supabase.from('site_visits').insert(payload);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch projects from Supabase
 */
export async function fetchProjectsFromSupabase(): Promise<Project[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;
    return data as Project[];
  } catch {
    return null;
  }
}

/**
 * Log audit events to Supabase
 */
export async function logAuditToSupabase(log: Partial<AuditLog>): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('audit_logs').insert({
      user_id: log.user_id,
      user_name: log.user_name,
      user_role: log.user_role,
      action: log.action,
      entity: log.entity,
      entity_id: log.entity_id,
      details: log.details,
      ip_address: log.ip_address,
    });
  } catch {
    // Fail silently for audit logs
  }
}
