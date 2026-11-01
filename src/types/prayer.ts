export type PrayerName = 'subuh' | 'zuhur' | 'asar' | 'magrib' | 'isya';

export type PrayerStatus = 'completed' | 'not_completed';

export type TimingCategory = 'on_time' | 'late';

export type CongregationType = 'congregation' | 'alone';

export interface PrayerRecord {
  id: string;
  user_id: string;
  prayer_date: string; // Format: YYYY-MM-DD (local date)
  prayer_name: PrayerName;
  status: PrayerStatus;
  completed_at?: string | null; // Format: HH:mm:ss or HH:mm
  timing_category?: TimingCategory | null;
  congregation_type?: CongregationType | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  timezone: string; // e.g. 'Asia/Jakarta'
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  user_id: string;
  location_name: string; // e.g. 'Jakarta'
  latitude?: number | null;
  longitude?: number | null;
  calculation_method: string; // e.g. 'KEMENAG', 'MWL', 'EGYPT', 'MAKKAH', 'ISNA'
  asr_method: 'STANDARD' | 'HANAFI';
  created_at: string;
  updated_at: string;
}

export interface ReminderPreference {
  id?: string;
  user_id: string;
  prayer_name: PrayerName;
  enabled: boolean;
  minutes_before: number; // 0, 5, 10, 15, etc.
}

export interface PrayerScheduleTimings {
  subuh: string; // HH:mm
  terbit?: string; // Sunrise HH:mm
  zuhur: string; // HH:mm
  asar: string; // HH:mm
  magrib: string; // HH:mm
  isya: string; // HH:mm
}

export interface DailySchedule {
  date: string; // YYYY-MM-DD
  location: string;
  timings: PrayerScheduleTimings;
  source: string;
  fetched_at: string;
}

export interface NextPrayerInfo {
  name: PrayerName;
  label: string;
  time: string;
  remainingSeconds: number;
  isToday: boolean;
  formattedCountdown: string;
}

export interface PrayerSummaryStats {
  completedCount: number;
  notCompletedCount: number;
  unrecordedCount: number;
  totalPrayers: number;
  percentage: number;
}

export interface OverallStats {
  totalCompleted: number;
  totalNotCompleted: number;
  totalRecordedDays: number;
  recordingCompletenessRate: number; // (completed + not_completed) / (days * 5) * 100
  prayerCompletionRate: number; // completed / (completed + not_completed) * 100
  onTimeCount: number;
  lateCount: number;
  congregationCount: number;
  aloneCount: number;
  periodDays: number;
}

export const PRAYER_NAMES: PrayerName[] = ['subuh', 'zuhur', 'asar', 'magrib', 'isya'];

export const PRAYER_DISPLAY_NAMES: Record<PrayerName, string> = {
  subuh: 'Subuh',
  zuhur: 'Zuhur',
  asar: 'Asar',
  magrib: 'Magrib',
  isya: 'Isya',
};

export const PRAYER_DESCRIPTIONS: Record<PrayerName, string> = {
  subuh: 'Sholat fajar penjemput keberkahan pagi',
  zuhur: 'Sholat tengah hari di kala matahari tergelincir',
  asar: 'Sholat petang sebelum datangnya senja',
  magrib: 'Sholat saat terbenamnya ufuk barat',
  isya: 'Sholat malam penutup rangkaian ibadah fardhu',
};
