import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuditLog } from '../types';
import { SEED_AUDIT_LOGS } from '../data/seedData';

/**
 * Log an immutable audit trail event to Supabase
 */
export async function logAudit(
  action: string,
  entity: string,
  entityId: string,
  oldData?: any,
  newData?: any,
  operatorId?: string,
  operatorName?: string,
  operatorRole?: string
): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.from('audit_logs').insert({
      user_id: operatorId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(operatorId) ? operatorId : null,
      user_name: operatorName || 'Admin Operator',
      user_role: operatorRole || 'admin',
      action,
      entity,
      entity_id: entityId,
      old_data: oldData,
      new_data: newData,
      details: { old: oldData, new: newData },
      created_at: new Date().toISOString(),
    });
  } catch {
    // Audit log failures should not crash user operations
  }
}

/**
 * Fetch immutable audit logs for Admin inspection
 */
export async function getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
  if (!isSupabaseConfigured) return SEED_AUDIT_LOGS;

  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return SEED_AUDIT_LOGS;
    return data as AuditLog[];
  } catch {
    return SEED_AUDIT_LOGS;
  }
}
