import { useState, useEffect, useCallback } from 'react';
import { Lead, UserRole } from '../types';
import { getLeads } from '../services/leads';

export function useLeads(userRole?: UserRole, userId?: string, statusFilter?: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeads(userRole, userId, statusFilter);
      setLeads(res);
    } catch (err: any) {
      setError(err?.message || 'Error fetching leads');
    } finally {
      setLoading(false);
    }
  }, [userRole, userId, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
}
