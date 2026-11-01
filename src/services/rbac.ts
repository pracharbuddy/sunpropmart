import { UserProfile, UserRole, PermissionAction } from '../types';

/**
 * Standard Role Permissions Matrix
 * Explicitly specifies granted capabilities per role in production.
 */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  super_admin: [
    'property.create',
    'property.edit',
    'property.delete',
    'property.delete_request',
    'property.approve',
    'property.reject',
    'property.publish',
    'property.price_change_direct',
    'property.price_change_request',
    'property.upload_media',
    'property.upload_document',
    'property.view_private_doc',
    'lead.view_assigned',
    'lead.view_all',
    'lead.assign',
    'lead.status_update',
    'site_visit.view',
    'site_visit.manage',
    'agent.manage',
    'cms.manage',
    'blog.manage',
    'audit.view',
    'settings.manage',
  ],
  admin: [
    'property.create',
    'property.edit',
    'property.delete',
    'property.delete_request',
    'property.approve',
    'property.reject',
    'property.publish',
    'property.price_change_direct',
    'property.price_change_request',
    'property.upload_media',
    'property.upload_document',
    'property.view_private_doc',
    'lead.view_assigned',
    'lead.view_all',
    'lead.assign',
    'lead.status_update',
    'site_visit.view',
    'site_visit.manage',
    'agent.manage',
    'cms.manage',
    'blog.manage',
    'audit.view',
    'settings.manage',
  ],
  property_manager: [
    'property.create',
    'property.edit',
    'property.delete_request',
    'property.approve',
    'property.reject',
    'property.publish',
    'property.price_change_direct',
    'property.upload_media',
    'property.upload_document',
    'property.view_private_doc',
    'lead.view_assigned',
    'site_visit.view',
    'site_visit.manage',
  ],
  sales_manager: [
    'property.create',
    'property.edit',
    'property.upload_media',
    'lead.view_assigned',
    'lead.view_all',
    'lead.assign',
    'lead.status_update',
    'site_visit.view',
    'site_visit.manage',
  ],
  agent: [
    // CRITICAL: Agent permissions strictly enforced per specification
    'property.create',              // Add -> YES
    'property.edit',                // Edit -> YES
    // 'property.delete',           // Delete -> NO
    'property.delete_request',      // Delete Request -> YES
    // 'property.approve',          // Approve -> NO
    // 'property.reject',           // Reject -> NO
    // 'property.publish',          // Direct Publish -> NO
    'property.price_change_request',// Price Change -> REQUEST ONLY
    // 'property.price_change_direct', // Direct Price Change -> NO
    'property.upload_media',        // Images & Video Upload -> YES
    'property.upload_document',     // Documents Upload -> YES
    'lead.view_assigned',           // Customer Leads -> YES (assigned only)
    'lead.status_update',           // Lead notes & follow-up -> YES
    'site_visit.view',              // Site visits assigned -> YES
    'site_visit.manage',            // Site visit update -> YES
    // 'agent.manage',              // Agent Management -> NO
    // 'audit.view',                // System audit trail -> NO
  ],
  content_manager: [
    'cms.manage',
    'blog.manage',
    'property.upload_media',
  ],
  crm_manager: [
    'lead.view_all',
    'lead.view_assigned',
    'lead.assign',
    'lead.status_update',
    'site_visit.view',
    'site_visit.manage',
  ],
  construction_manager: [
    'property.view_private_doc',
    'property.upload_document',
  ],
  account_manager: [
    'audit.view',
    'lead.view_all',
  ],
  customer: [
    // Public/Customer: only their own favorites, enquiries, and site visits
  ],
};

/**
 * Reusable RBAC Authorization helper
 * Enforces permissions at application logic & UI level.
 * Example: if (!can(user, 'property.delete')) throw new Error('Unauthorized');
 */
export function can(user: UserProfile | null | undefined, action: PermissionAction): boolean {
  if (!user || !user.role) return false;
  if (!user.is_active) return false;

  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(action);
}

/**
 * Validates if the user can modify a specific property
 */
export function canEditProperty(user: UserProfile | null | undefined, property: { created_by?: string; assigned_agent_id?: string }): boolean {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'property_manager') return true;
  if (user.role === 'agent') {
    return property.created_by === user.id || property.assigned_agent_id === user.id;
  }
  return false;
}

/**
 * Validates if the user can view a specific lead
 */
export function canViewLead(user: UserProfile | null | undefined, lead: { assigned_agent_id?: string }): boolean {
  if (!user) return false;
  if (['admin', 'super_admin', 'sales_manager', 'crm_manager'].includes(user.role)) return true;
  if (user.role === 'agent') {
    return lead.assigned_agent_id === user.id;
  }
  return false;
}
