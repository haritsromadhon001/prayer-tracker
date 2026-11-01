import { UserProfile, UserSettings } from '../types/prayer';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const LOCAL_STORAGE_PROFILE_KEY = 'ppt_user_profile';
const LOCAL_STORAGE_SETTINGS_KEY = 'ppt_user_settings';

export const DEFAULT_PROFILE: UserProfile = {
  id: 'demo-user',
  display_name: 'Sahabat Sholat',
  timezone: 'Asia/Jakarta',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SETTINGS: UserSettings = {
  user_id: 'demo-user',
  location_name: 'Jakarta',
  latitude: -6.2088,
  longitude: 106.8456,
  calculation_method: 'KEMENAG',
  asr_method: 'STANDARD',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Fetches user profile from Supabase or localStorage fallback
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      return data as UserProfile;
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (err) {
    console.warn('Failed reading local profile', err);
  }

  return { ...DEFAULT_PROFILE, id: userId || 'demo-user' };
}

/**
 * Updates user profile
 */
export async function saveUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
  const updated: UserProfile = {
    ...DEFAULT_PROFILE,
    ...profile,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: updated.id,
        display_name: updated.display_name,
        timezone: updated.timezone,
        updated_at: updated.updated_at,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Gagal menyimpan profil: ${error.message}`);
    }
    return data as UserProfile;
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed saving local profile', err);
  }

  return updated;
}

/**
 * Fetches user prayer calculation and location settings
 */
export async function fetchUserSettings(userId: string): Promise<UserSettings> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      return data as UserSettings;
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (err) {
    console.warn('Failed reading local user settings', err);
  }

  return { ...DEFAULT_SETTINGS, user_id: userId || 'demo-user' };
}

/**
 * Saves user settings
 */
export async function saveUserSettings(settings: Partial<UserSettings> & { user_id: string }): Promise<UserSettings> {
  const updated: UserSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: updated.user_id,
        location_name: updated.location_name,
        latitude: updated.latitude,
        longitude: updated.longitude,
        calculation_method: updated.calculation_method,
        asr_method: updated.asr_method,
        updated_at: updated.updated_at,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Gagal menyimpan pengaturan: ${error.message}`);
    }
    return data as UserSettings;
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed saving local user settings', err);
  }

  return updated;
}
