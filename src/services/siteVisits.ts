import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SiteVisit, SiteVisitStatus, UserRole } from '../types';
import { SEED_SITE_VISITS } from '../data/seedData';
import { logAudit } from './audit';
import { createNotification } from './notifications';

/**
 * Fetch site visits with RBAC:
 * Agents can only see visits assigned to them.
 * Admins see all visits.
 * Customers only see their own visits.
 */
export async function getSiteVisits(
  userRole?: UserRole,
  userId?: string
): Promise<SiteVisit[]> {
  if (!isSupabaseConfigured) {
    let result = [...SEED_SITE_VISITS];
    if (userRole === 'agent' && userId) {
      result = result.filter((v) => v.assigned_agent_id === userId);
    } else if (userRole === 'customer' && userId) {
      result = result.filter((v) => v.customer_id === userId);
    }
    return result;
  }

  try {
    let query = supabase
      .from('site_visits')
      .select('*, properties(title)')
      .order('visit_date', { ascending: false });

    if (userRole === 'agent' && userId) {
      query = query.eq('assigned_agent_id', userId);
    } else if (userRole === 'customer' && userId) {
      query = query.eq('customer_id', userId);
    }

    const { data, error } = await query;
    if (error || !data) {
      return SEED_SITE_VISITS;
    }

    return data.map((v: any) => ({
      ...v,
      property_title: v.properties?.title || v.property_title || 'SunPropMart Property',
    })) as SiteVisit[];
  } catch {
    return SEED_SITE_VISITS;
  }
}

/**
 * Book a site visit in Supabase
 */
export async function createSiteVisit(visitData: Partial<SiteVisit>): Promise<{ siteVisit: SiteVisit | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { siteVisit: null, error: 'Database is not connected.' };
  }

  try {
    const payload: any = {
      property_id: visitData.property_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(visitData.property_id) ? visitData.property_id : null,
      customer_id: visitData.customer_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(visitData.customer_id) ? visitData.customer_id : null,
      customer_name: visitData.customer_name || 'Prospective Buyer',
      customer_email: visitData.customer_email || 'client@example.com',
      customer_phone: visitData.customer_phone || '+91 9873083899',
      assigned_agent_id: visitData.assigned_agent_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(visitData.assigned_agent_id) ? visitData.assigned_agent_id : null,
      visit_date: visitData.visit_date,
      visit_time: visitData.visit_time,
      status: 'Requested',
      notes: visitData.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('site_visits')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { siteVisit: null, error: error.message };
    }

    await createNotification({
      title: 'New Site Visit Scheduled',
      message: `${data.customer_name} booked a visit for ${data.visit_date} at ${data.visit_time}.`,
      type: 'site_visit',
      link: 'admin-visits',
    });

    await logAudit('SITE_VISIT_BOOKED', 'site_visits', data.id, null, {
      date: data.visit_date,
      time: data.visit_time,
    });

    return { siteVisit: data as SiteVisit, error: null };
  } catch (err: any) {
    return { siteVisit: null, error: err.message || 'Unable to book site visit.' };
  }
}

/**
 * Update site visit status
 */
export async function updateSiteVisitStatus(
  visitId: string,
  status: SiteVisitStatus,
  notes?: string,
  operatorId?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase
      .from('site_visits')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', visitId);

    if (error) return { success: false, error: error.message };

    await logAudit('SITE_VISIT_STATUS_UPDATED', 'site_visits', visitId, null, { status, notes }, operatorId);

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
