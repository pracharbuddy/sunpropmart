import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Property,
  PropertyPriceChangeRequest,
  PropertyDeleteRequest,
  PropertyFilterParams,
  PaginatedResult,
} from '../types';
import { SEED_PROPERTIES } from '../data/seedData';
import { logAudit } from './audit';

/**
 * Fetch properties from Supabase with server-side filters and pagination
 */
export async function getProperties(
  params: PropertyFilterParams = {}
): Promise<PaginatedResult<Property>> {
  const {
    keyword,
    city,
    locality,
    sector,
    property_type,
    category,
    listing_type,
    min_price,
    max_price,
    min_area,
    max_area,
    bedrooms,
    bathrooms,
    furnishing,
    status,
    page = 1,
    pageSize = 12,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = params;

  if (!isSupabaseConfigured) {
    // Seed data fallback for development / before SQL execution
    let filtered = [...SEED_PROPERTIES].filter((p) => !p.deleted_at);
    if (status && status !== 'all') filtered = filtered.filter((p) => p.status === status);
    if (category && category !== 'all') filtered = filtered.filter((p) => p.category === category);
    if (listing_type && listing_type !== 'All') filtered = filtered.filter((p) => p.listing_type === listing_type);
    if (property_type && property_type !== 'Any') filtered = filtered.filter((p) => p.property_type === property_type);
    if (city && city !== 'Any') filtered = filtered.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));
    if (keyword) {
      const q = keyword.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.property_id.toLowerCase().includes(q)
      );
    }
    const total = filtered.length;
    const from = (page - 1) * pageSize;
    const paginated = filtered.slice(from, from + pageSize);
    return {
      data: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  try {
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .is('deleted_at', null);

    // Apply Filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (listing_type && listing_type !== 'All') {
      query = query.eq('listing_type', listing_type);
    }
    if (property_type && property_type !== 'Any') {
      query = query.eq('property_type', property_type);
    }
    if (city && city !== 'Any') {
      query = query.ilike('city', `%${city}%`);
    }
    if (locality) {
      query = query.ilike('locality', `%${locality}%`);
    }
    if (sector) {
      query = query.ilike('sector', `%${sector}%`);
    }
    if (min_price !== undefined) {
      query = query.gte('price', min_price);
    }
    if (max_price !== undefined) {
      query = query.lte('price', max_price);
    }
    if (min_area !== undefined) {
      query = query.gte('area', min_area);
    }
    if (max_area !== undefined) {
      query = query.lte('area', max_area);
    }
    if (bedrooms && bedrooms !== 'Any') {
      query = query.gte('bedrooms', Number(bedrooms));
    }
    if (bathrooms && bathrooms !== 'Any') {
      query = query.gte('bathrooms', Number(bathrooms));
    }
    if (furnishing && furnishing !== 'Any') {
      query = query.eq('furnishing', furnishing);
    }
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,locality.ilike.%${keyword}%,city.ilike.%${keyword}%,property_id.ilike.%${keyword}%`
      );
    }

    // Sort & Pagination
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.warn('Supabase query notice (falling back to initial cache):', error.message);
      // Graceful seed fallback if tables pending creation
      const total = SEED_PROPERTIES.length;
      return {
        data: SEED_PROPERTIES.slice(0, pageSize),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      };
    }

    const total = count || 0;
    return {
      data: (data || []) as Property[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  } catch (err: any) {
    console.warn('getProperties catch error:', err);
    return {
      data: SEED_PROPERTIES.slice(0, pageSize),
      total: SEED_PROPERTIES.length,
      page,
      pageSize,
      totalPages: 1,
    };
  }
}

/**
 * Fetch a single property by slug
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    return SEED_PROPERTIES.find((p) => p.slug === slug && !p.deleted_at) || null;
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle();

    if (error || !data) {
      return SEED_PROPERTIES.find((p) => p.slug === slug) || null;
    }

    return data as Property;
  } catch {
    return SEED_PROPERTIES.find((p) => p.slug === slug) || null;
  }
}

/**
 * Create a new property in Supabase
 */
export async function createProperty(propertyData: Partial<Property>, operatorId?: string): Promise<{ property: Property | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { property: null, error: 'Database is not configured. Please connect Supabase.' };
  }

  try {
    const seqNum = Date.now().toString().slice(-6);
    const propertyIdCode = propertyData.property_id || `SPM-${seqNum}`;
    const slug = (propertyData.title || `Property ${seqNum}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const recordToInsert: any = {
      ...propertyData,
      property_id: propertyIdCode,
      slug,
      status: propertyData.status || 'draft',
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // If ID is not a valid UUID, let PostgreSQL generate a uuid_generate_v4()
    if (recordToInsert.id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recordToInsert.id)) {
      delete recordToInsert.id;
    }

    const { data, error } = await supabase
      .from('properties')
      .insert(recordToInsert)
      .select()
      .single();

    if (error) {
      return { property: null, error: error.message };
    }

    await logAudit(
      'PROPERTY_CREATED',
      'properties',
      data.id,
      null,
      { title: data.title, status: data.status, price: data.price },
      operatorId
    );

    return { property: data as Property, error: null };
  } catch (err: any) {
    return { property: null, error: err.message || 'Unable to create property.' };
  }
}

/**
 * Update an existing property in Supabase
 */
export async function updateProperty(
  id: string,
  propertyData: Partial<Property>,
  operatorId?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    const { error } = await supabase
      .from('properties')
      .update({
        ...propertyData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    await logAudit(
      'PROPERTY_UPDATED',
      'properties',
      id,
      null,
      propertyData,
      operatorId
    );

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unable to update property.' };
  }
}

/**
 * Agent submits property for review
 */
export async function submitPropertyForReview(id: string, operatorId?: string): Promise<{ success: boolean; error: string | null }> {
  return updateProperty(
    id,
    {
      status: 'under_review',
    },
    operatorId
  );
}

/**
 * Admin approves property
 */
export async function approveProperty(
  id: string,
  reviewerId: string,
  notes?: string
): Promise<{ success: boolean; error: string | null }> {
  return updateProperty(
    id,
    {
      status: 'published',
      approved_by: reviewerId,
      published_at: new Date().toISOString(),
      review_notes: notes,
    },
    reviewerId
  );
}

/**
 * Admin rejects property
 */
export async function rejectProperty(
  id: string,
  reviewerId: string,
  notes?: string
): Promise<{ success: boolean; error: string | null }> {
  return updateProperty(
    id,
    {
      status: 'rejected',
      review_notes: notes,
    },
    reviewerId
  );
}

/**
 * Admin requests changes from agent
 */
export async function requestChangesProperty(
  id: string,
  reviewerId: string,
  notes?: string
): Promise<{ success: boolean; error: string | null }> {
  return updateProperty(
    id,
    {
      status: 'changes_required',
      review_notes: notes,
    },
    reviewerId
  );
}

/**
 * Submit price change request (Agent -> Admin)
 */
export async function requestPriceChange(
  propertyId: string,
  propertyTitle: string,
  requestedBy: string,
  requestedByName: string,
  oldPrice: number,
  newPrice: number,
  reason: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { error } = await supabase.from('property_price_change_requests').insert({
      property_id: propertyId,
      requested_by: requestedBy,
      old_price: oldPrice,
      new_price: newPrice,
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    await logAudit(
      'PRICE_CHANGE_REQUESTED',
      'properties',
      propertyId,
      { old_price: oldPrice },
      { new_price: newPrice, reason },
      requestedBy
    );

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unable to request price change' };
  }
}

/**
 * Review price change request (Admin)
 */
export async function reviewPriceChange(
  requestId: string,
  propertyId: string,
  newPrice: number,
  reviewerId: string,
  approved: boolean,
  comment?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    // 1. Update request status
    const { error: reqError } = await supabase
      .from('property_price_change_requests')
      .update({
        status: approved ? 'approved' : 'rejected',
        reviewed_by: reviewerId,
        review_comment: comment,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (reqError) return { success: false, error: reqError.message };

    // 2. If approved, update property price and record history
    if (approved) {
      await supabase
        .from('properties')
        .update({
          price: newPrice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId);

      // Record price history
      await supabase.from('property_price_history').insert({
        property_id: propertyId,
        price: newPrice,
        changed_by: reviewerId,
        reason: comment || 'Admin approved price change request',
        created_at: new Date().toISOString(),
      });
    }

    await logAudit(
      approved ? 'PRICE_CHANGE_APPROVED' : 'PRICE_CHANGE_REJECTED',
      'property_price_change_requests',
      requestId,
      null,
      { approved, newPrice, comment },
      reviewerId
    );

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all price change requests
 */
export async function getPriceChangeRequests(): Promise<PropertyPriceChangeRequest[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('property_price_change_requests')
      .select('*, properties(title)')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((r: any) => ({
      ...r,
      property_title: r.properties?.title || 'Property',
      requested_by_name: 'Agent',
    }));
  } catch {
    return [];
  }
}

/**
 * Submit property delete request (Agent -> Admin)
 */
export async function requestDelete(
  propertyId: string,
  propertyTitle: string,
  requestedBy: string,
  requestedByName: string,
  reason: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { error: reqError } = await supabase.from('property_delete_requests').insert({
      property_id: propertyId,
      requested_by: requestedBy,
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    if (reqError) return { success: false, error: reqError.message };

    // Update property status to delete_requested
    await supabase
      .from('properties')
      .update({ status: 'delete_requested' })
      .eq('id', propertyId);

    await logAudit(
      'DELETE_REQUESTED',
      'properties',
      propertyId,
      null,
      { reason },
      requestedBy
    );

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Review property delete request (Admin)
 * If approved, soft-deletes and archives the property.
 */
export async function reviewDeleteRequest(
  requestId: string,
  propertyId: string,
  reviewerId: string,
  approved: boolean,
  comment?: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { error: reqError } = await supabase
      .from('property_delete_requests')
      .update({
        status: approved ? 'approved' : 'rejected',
        reviewed_by: reviewerId,
        review_comment: comment,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (reqError) return { success: false, error: reqError.message };

    if (approved) {
      // Soft delete: sets deleted_at, deleted_by, delete_reason, status: archived
      await supabase
        .from('properties')
        .update({
          status: 'archived',
          deleted_at: new Date().toISOString(),
          deleted_by: reviewerId,
          delete_reason: comment || 'Admin approved delete request',
        })
        .eq('id', propertyId);
    } else {
      // Restore status to published
      await supabase
        .from('properties')
        .update({
          status: 'published',
        })
        .eq('id', propertyId);
    }

    await logAudit(
      approved ? 'DELETE_REQUEST_APPROVED' : 'DELETE_REQUEST_REJECTED',
      'property_delete_requests',
      requestId,
      null,
      { approved, comment },
      reviewerId
    );

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all delete requests
 */
export async function getDeleteRequests(): Promise<PropertyDeleteRequest[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('property_delete_requests')
      .select('*, properties(title)')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((r: any) => ({
      ...r,
      property_title: r.properties?.title || 'Property',
      requested_by_name: 'Agent',
    }));
  } catch {
    return [];
  }
}
