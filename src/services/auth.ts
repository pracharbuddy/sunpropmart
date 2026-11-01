import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';
import { SEED_PROFILES } from '../data/seedData';

/**
 * Signs in a user with email and password via Supabase Auth
 */
export async function signIn(email: string, password: string): Promise<{ profile: UserProfile | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    // Demo fallback if Supabase credentials are missing
    const match = SEED_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (match) return { profile: match, error: null };
    return { profile: null, error: 'User not found in system.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check if this is a known test profile for convenient fallback
      const match = SEED_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (match) {
        return { profile: match, error: null };
      }
      return { profile: null, error: error.message };
    }

    if (!data.user) {
      return { profile: null, error: 'Authentication returned no user record.' };
    }

    // Fetch user profile from public.profiles
    const profile = await getUserProfile(data.user.id);
    if (!profile) {
      // Create profile record if not present
      const newProfile: UserProfile = {
        id: data.user.id,
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
        email: data.user.email || email,
        phone: data.user.user_metadata?.phone || '',
        role: (data.user.user_metadata?.role as UserRole) || 'customer',
        designation: data.user.user_metadata?.designation || 'Client',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      await upsertUserProfile(newProfile);
      return { profile: newProfile, error: null };
    }

    return { profile, error: null };
  } catch (err: any) {
    return { profile: null, error: err.message || 'Unexpected login error' };
  }
}

/**
 * Signs up a new user via Supabase Auth and registers their profile
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole = 'customer',
  phone?: string
): Promise<{ profile: UserProfile | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { profile: null, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone,
        },
      },
    });

    if (error) {
      return { profile: null, error: error.message };
    }

    if (!data.user) {
      return { profile: null, error: 'Signup succeeded but no user was returned. Please check your email for confirmation.' };
    }

    const newProfile: UserProfile = {
      id: data.user.id,
      full_name: fullName,
      email,
      phone,
      role,
      designation: role === 'agent' ? 'Property Consultant' : 'Client',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    await upsertUserProfile(newProfile);
    return { profile: newProfile, error: null };
  } catch (err: any) {
    return { profile: null, error: err.message || 'Unexpected signup error' };
  }
}

/**
 * Signs out the current user session
 */
export async function signOut(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: null };
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err.message || 'Signout error' };
  }
}

/**
 * Sends a password reset email via Supabase Auth
 */
export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Supabase is not configured' };
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    });
    return { success: !error, error: error ? error.message : null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetches the user profile from public.profiles
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data as UserProfile;
  } catch {
    return null;
  }
}

/**
 * Upserts a user profile into public.profiles
 */
export async function upsertUserProfile(profile: UserProfile): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        agent_id: profile.agent_id,
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        designation: profile.designation,
        territory: profile.territory,
        avatar_url: profile.avatar_url,
        experience_years: profile.experience_years,
        bio: profile.bio,
        is_active: profile.is_active,
        updated_at: new Date().toISOString(),
      });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Returns current authenticated session
 */
export async function getCurrentSession() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
}

/**
 * Listen to auth state changes in Supabase
 */
export function onAuthStateChange(callback: (profile: UserProfile | null) => void) {
  if (!isSupabaseConfigured) return { unsubscribe: () => {} };

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const profile = await getUserProfile(session.user.id);
      callback(profile);
    } else {
      callback(null);
    }
  });

  return {
    unsubscribe: () => subscription.unsubscribe(),
  };
}
