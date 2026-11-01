import { PrayerName, ReminderPreference, PrayerScheduleTimings } from '../types/prayer';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { playSereneChime } from '../utils/sound';
import { timeStringToMinutes } from './prayer-schedule';

const LOCAL_STORAGE_REMINDERS_KEY = 'ppt_reminder_preferences';

export const DEFAULT_REMINDERS: ReminderPreference[] = [
  { user_id: 'default', prayer_name: 'subuh', enabled: true, minutes_before: 0 },
  { user_id: 'default', prayer_name: 'zuhur', enabled: true, minutes_before: 0 },
  { user_id: 'default', prayer_name: 'asar', enabled: true, minutes_before: 0 },
  { user_id: 'default', prayer_name: 'magrib', enabled: true, minutes_before: 0 },
  { user_id: 'default', prayer_name: 'isya', enabled: true, minutes_before: 0 },
];

/**
 * Checks browser notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Requests browser notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Sends a notification (both browser push if allowed and audio chime)
 */
export function triggerPrayerNotification(
  prayerName: string,
  message: string,
  playSound = true
): void {
  if (playSound) {
    playSereneChime();
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`Waktu Sholat ${prayerName}`, {
        body: message,
        icon: '/favicon.ico',
        tag: `prayer-${prayerName}-${Date.now()}`,
      });
    } catch (err) {
      console.warn('Could not display system notification:', err);
    }
  }
}

/**
 * Fetches user reminder preferences
 */
export async function fetchReminderPreferences(userId: string): Promise<ReminderPreference[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('reminder_preferences')
      .select('*')
      .eq('user_id', userId);

    if (!error && data && data.length > 0) {
      return data as ReminderPreference[];
    }
  }

  // Local storage fallback
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_REMINDERS_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (err) {
    console.warn('Failed to read local reminder preferences', err);
  }

  return DEFAULT_REMINDERS.map((r) => ({ ...r, user_id: userId || 'demo-user' }));
}

/**
 * Saves reminder preferences
 */
export async function saveReminderPreferences(
  userId: string,
  preferences: ReminderPreference[]
): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    for (const pref of preferences) {
      await supabase.from('reminder_preferences').upsert(
        {
          user_id: userId,
          prayer_name: pref.prayer_name,
          enabled: pref.enabled,
          minutes_before: pref.minutes_before,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,prayer_name' }
      );
    }
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_REMINDERS_KEY, JSON.stringify(preferences));
  } catch (err) {
    console.warn('Failed to save reminder preferences locally', err);
  }
}

/**
 * Evaluates whether any active prayer reminder should fire at current local minute
 */
export function checkAndTriggerReminders(
  timings: PrayerScheduleTimings,
  preferences: ReminderPreference[],
  firedHistorySet: Set<string>,
  dateStr: string
): void {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerNames: PrayerName[] = ['subuh', 'zuhur', 'asar', 'magrib', 'isya'];

  for (const name of prayerNames) {
    const pref = preferences.find((p) => p.prayer_name === name);
    if (!pref || !pref.enabled) continue;

    const timeStr = timings[name];
    if (!timeStr) continue;

    const targetMinutes = timeStringToMinutes(timeStr) - pref.minutes_before;
    const fireKey = `${dateStr}_${name}_${pref.minutes_before}`;

    if (currentMinutes === targetMinutes && !firedHistorySet.has(fireKey)) {
      firedHistorySet.add(fireKey);
      const prayerDisplay = name.charAt(0).toUpperCase() + name.slice(1);
      const text =
        pref.minutes_before > 0
          ? `${pref.minutes_before} menit lagi menjelang waktu Sholat ${prayerDisplay} (${timeStr}). Bersiaplah untuk berwudhu.`
          : `Telah masuk waktu Sholat ${prayerDisplay} (${timeStr}). Mari tunaikan sholat.`;

      triggerPrayerNotification(prayerDisplay, text, true);
    }
  }
}
