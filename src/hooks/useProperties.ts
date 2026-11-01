import { useState, useEffect, useCallback } from 'react';
import { Property, PropertyFilterParams, PaginatedResult } from '../types';
import { getProperties, getPropertyBySlug } from '../services/properties';

export function useProperties(params: PropertyFilterParams = {}) {
  const [data, setData] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: PaginatedResult<Property> = await getProperties(params);
      setData(res.data);
      setTotal(res.total);
    } catch (err: any) {
      setError(err?.message || 'Error fetching properties');
    } finally {
      setLoading(false);
    }
  }, [
    params.keyword,
    params.city,
    params.locality,
    params.property_type,
    params.category,
    params.listing_type,
    params.min_price,
    params.max_price,
    params.bedrooms,
    params.status,
    params.page,
    params.pageSize,
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties: data, total, loading, error, refetch: fetchProperties };
}

export function useProperty(slug: string | null) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProperty(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getPropertyBySlug(slug)
      .then((res) => {
        if (active) setProperty(res);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return { property, loading, error };
}
