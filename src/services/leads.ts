import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lead, LeadStatus, UserRole } from '../types';
import { SEED_LEADS } from '../data/seedData';
import { logAudit } from './audit';
import { createNotification } from './notifications';

/**
 * Fetch leads with RBAC enforcement:
 * Agents can only see leads assigned to them.
 * Admins, CRM managers, and Sales managers can view all leads.
 */
export async function getLeads(
  userRole?: UserRole,
  userId?: string,
  statusFilter?: string
): Promise<Lead[]> {
  if (!isSupabaseConfigured) {
    let result = [...SEED_LEADS];
    if (userRole === 'agent' && userId) {
      result = result.filter((l) => l.assigned_agent_id === userId);
    }
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }
    return result;
  }

  try {
    let query = supabase
      .from('leads')
      .select('*, profiles:assigned_agent_id(full_name)')
      .order('created_at', { ascending: false });

    // Enforce Agent isolation
    if (userRole === 'agent' && userId) {
      query = query.eq('assigned_agent_id', userId);
    }

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.warn('getLeads fallback:', error?.message);
      return SEED_LEADS;
    }

    return data.map((l: any) => ({
      ...l,
      assigned_agent_name: l.profiles?.full_name || l.assigned_agent_name,
      notes: Array.isArray(l.notes) ? l.notes : [],
    })) as Lead[];
  } catch {
    return SEED_LEADS;
  }
}

/**
 * Creates a new customer enquiry lead in Supabase
 */
export async function createLead(leadData: Partial<Lead>): Promise<{ lead: Lead | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { lead: null, error: 'Database is not connected.' };
  }

  try {
    const payload: any = {
      customer_name: leadData.customer_name || 'Enquiry Client',
      customer_email: leadData.customer_email || 'client@example.com',
      customer_phone: leadData.customer_phone || '+91 9873083899',
      property_id: leadData.property_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadData.property_id) ? leadData.property_id : null,
      project_id: leadData.project_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadData.project_id) ? leadData.project_id : null,
      assigned_agent_id: leadData.assigned_agent_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadData.assigned_agent_id) ? leadData.assigned_agent_id : null,
      source: leadData.source || 'Website Form',
      status: 'New',
      budget_range: leadData.budget_range,
      preferred_location: leadData.preferred_location,
      message: leadData.message,
      notes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { lead: null, error: error.message };
    }

    // Record initial status in history
    await supabase.from('lead_status_history').insert({
      lead_id: data.id,
      old_status: null,
      new_status: 'New',
      created_at: new Date().toISOString(),
    });

    // Notify agents/admins
    await createNotification({
      title: 'New Client Enquiry',
      message: `${data.customer_name} submitted an enquiry for ${leadData.property_title || 'a property'}.`,
      type: 'lead',
      link: 'admin-leads',
    });

    await logAudit('LEAD_SUBMISSION', 'leads', data.id, null, {
      name: data.customer_name,
      email: data.customer_email,
    });

    return { lead: data as Lead, error: null };
  } catch (err: any) {
    return { lead: null, error: err.message || 'Unable to create lead.' };
  }
}

/**
 * Update lead status and append consultation note
 */
export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  noteText?: string,
  authorName: string = 'Agent',
  operatorId?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    // 1. Fetch current lead
    const { data: currentLead, error: fetchErr } = await supabase
      .from('leads')
      .select('notes, status')
      .eq('id', leadId)
      .single();

    if (fetchErr) return { success: false, error: fetchErr.message };

    const currentNotes = Array.isArray(currentLead.notes) ? currentLead.notes : [];
    if (noteText) {
      currentNotes.unshift({
        id: `note-${Date.now()}`,
        author: authorName,
        note: noteText,
        created_at: new Date().toISOString(),
      });
    }

    // 2. Update status and notes
    const { error: updateErr } = await supabase
      .from('leads')
      .update({
        status,
        notes: currentNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (updateErr) return { success: false, error: updateErr.message };

    // 3. Log status history
    await supabase.from('lead_status_history').insert({
      lead_id: leadId,
      old_status: currentLead.status,
      new_status: status,
      changed_by: operatorId,
      notes: noteText,
      created_at: new Date().toISOString(),
    });

    await logAudit('LEAD_STATUS_UPDATED', 'leads', leadId, { status: currentLead.status }, { status, noteText }, operatorId);

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Assign lead to agent with audit trail in lead_assignments
 */
export async function assignLead(
  leadId: string,
  agentId: string,
  agentName: string,
  operatorId?: string,
  notes?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { error: updateErr } = await supabase
      .from('leads')
      .update({
        assigned_agent_id: agentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (updateErr) return { success: false, error: updateErr.message };

    // Record assignment history
    await supabase.from('lead_assignments').insert({
      lead_id: leadId,
      agent_id: agentId,
      assigned_by: operatorId,
      notes,
      created_at: new Date().toISOString(),
    });

    // Notify assigned agent
    await createNotification({
      user_id: agentId,
      title: 'New Lead Assigned to You',
      message: `You have been assigned an inbound client enquiry.`,
      type: 'lead',
      link: 'agent-leads',
    });

    await logAudit('LEAD_ASSIGNED', 'leads', leadId, null, { agent_id: agentId, agent_name: agentName }, operatorId);

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
