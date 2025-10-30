import { supabase } from '../supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get current user's profile
 */
export async function getProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return { data: data as Profile, error: null };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { data: null, error };
  }
}

/**
 * Update user's profile
 */
export async function updateProfile(updates: { full_name?: string; avatar_url?: string }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    return { data: data as Profile, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
}
