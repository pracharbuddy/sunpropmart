import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NotificationItem, UserRole } from '../types';

export async function getNotifications(userId?: string, userRole?: UserRole): Promise<NotificationItem[]> {
  if (!isSupabaseConfigured) {
    return [
      {
        id: 'notif-1',
        title: 'New Lead Assigned',
        message: 'Priya Kapoor requested a site visit for ATS Nobility Luxury 3 BHK.',
        type: 'lead',
        link: 'agent-leads',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ];
  }

  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as NotificationItem[];
  } catch {
    return [];
  }
}

export async function createNotification(notif: Partial<NotificationItem>): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('notifications').insert({
      user_id: notif.user_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(notif.user_id) ? notif.user_id : null,
      role_target: notif.role_target,
      title: notif.title || 'Notification',
      message: notif.message || '',
      type: notif.type || 'system',
      link: notif.link,
      is_read: false,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Fail gracefully
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  } catch {
    // Fail gracefully
  }
}
