import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SUPABASE_URL = 'https://ocfhouwhnhgyqwioozkr.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_RYgvyzShAOZWW5vuO4HCag_sZ3WjaFB';

/**
 * Mobile-specific Supabase Client with persistent AsyncStorage Auth
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
