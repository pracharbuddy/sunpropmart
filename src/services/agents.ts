import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';
import { SEED_PROFILES } from '../data/seedData';
import { logAudit } from './audit';

export async function getAgents(): Promise<UserProfile[]> {
  if (!isSupabaseConfigured) {
    return SEED_PROFILES.filter((p) => p.role === 'agent');
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agent')
      .order('full_name');

    if (error || !data || data.length === 0) {
      return SEED_PROFILES.filter((p) => p.role === 'agent');
    }
    return data as UserProfile[];
  } catch {
    return SEED_PROFILES.filter((p) => p.role === 'agent');
  }
}

export async function createAgent(
  agentData: Partial<UserProfile>,
  operatorId?: string
): Promise<{ agent: UserProfile | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { agent: null, error: 'Database is not connected.' };
  }

  try {
    const agentSeq = Date.now().toString().slice(-3);
    const agentIdCode = agentData.agent_id || `SPM-AG-${agentSeq}`;

    const payload: any = {
      agent_id: agentIdCode,
      full_name: agentData.full_name,
      email: agentData.email,
      phone: agentData.phone || '+91 98000 00000',
      role: 'agent',
      designation: agentData.designation || 'Senior Property Consultant',
      territory: agentData.territory || 'Greater Noida West',
      experience_years: agentData.experience_years || 5,
      is_active: true,
      avatar_url: agentData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (agentData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(agentData.id)) {
      payload.id = agentData.id;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(payload)
      .select()
      .single();

    if (error) return { agent: null, error: error.message };

    await logAudit('AGENT_CREATED', 'profiles', data.id, null, { name: data.full_name, email: data.email }, operatorId);

    return { agent: data as UserProfile, error: null };
  } catch (err: any) {
    return { agent: null, error: err.message };
  }
}

export async function updateAgent(
  id: string,
  agentData: Partial<UserProfile>,
  operatorId?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not connected.' };
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...agentData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    await logAudit('AGENT_UPDATED', 'profiles', id, null, agentData, operatorId);
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleAgentStatus(
  id: string,
  isActive: boolean,
  operatorId?: string
): Promise<{ success: boolean; error: string | null }> {
  return updateAgent(id, { is_active: isActive }, operatorId);
}
