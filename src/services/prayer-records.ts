import { PrayerName, PrayerRecord, PrayerStatus, TimingCategory, CongregationType } from '../types/prayer';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { getLocalDateString } from '../utils/date';

const LOCAL_STORAGE_RECORDS_KEY = 'ppt_local_prayer_records';

/**
 * Helper to get local demo storage records
 */
function getLocalRecords(): PrayerRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Gagal membaca data lokal', err);
    return [];
  }
}

/**
 * Helper to save local demo storage records
 */
function saveLocalRecords(records: PrayerRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Gagal menyimpan data lokal', err);
  }
}

export interface SavePrayerRecordInput {
  prayer_date: string; // YYYY-MM-DD
  prayer_name: PrayerName;
  status: PrayerStatus;
  completed_at?: string | null;
  timing_category?: TimingCategory | null;
  congregation_type?: CongregationType | null;
  notes?: string | null;
}

/**
 * Fetches prayer records for a specific date range.
 */
export async function fetchPrayerRecordsByDateRange(
  userId: string,
  startDateStr: string,
  endDateStr: string
): Promise<PrayerRecord[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('prayer_records')
      .select('*')
      .eq('user_id', userId)
      .gte('prayer_date', startDateStr)
      .lte('prayer_date', endDateStr)
      .order('prayer_date', { ascending: true });

    if (error) {
      console.error('Error fetching prayer records from Supabase:', error);
      throw new Error(`Gagal memuat catatan sholat: ${error.message}`);
    }

    return (data as PrayerRecord[]) || [];
  }

  // Fallback to local storage (demo mode)
  const all = getLocalRecords();
  return all
    .filter(
      (r) =>
        (!userId || r.user_id === userId || r.user_id === 'demo-user') &&
        r.prayer_date >= startDateStr &&
        r.prayer_date <= endDateStr
    )
    .sort((a, b) => a.prayer_date.localeCompare(b.prayer_date));
}

/**
 * Fetches prayer records for a single local date.
 */
export async function fetchPrayerRecordsForDate(
  userId: string,
  dateStr: string = getLocalDateString()
): Promise<Record<PrayerName, PrayerRecord | undefined>> {
  const records = await fetchPrayerRecordsByDateRange(userId, dateStr, dateStr);
  const recordMap: Record<PrayerName, PrayerRecord | undefined> = {
    subuh: undefined,
    zuhur: undefined,
    asar: undefined,
    magrib: undefined,
    isya: undefined,
  };

  for (const record of records) {
    recordMap[record.prayer_name] = record;
  }

  return recordMap;
}

/**
 * Saves or updates a prayer record.
 * Strictly prevents duplicates via upsert on (user_id, prayer_date, prayer_name).
 */
export async function savePrayerRecord(
  userId: string,
  input: SavePrayerRecordInput
): Promise<PrayerRecord> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured() && supabase) {
    const payload = {
      user_id: userId,
      prayer_date: input.prayer_date,
      prayer_name: input.prayer_name,
      status: input.status,
      completed_at: input.completed_at || null,
      timing_category: input.timing_category || null,
      congregation_type: input.congregation_type || null,
      notes: input.notes?.trim() || null,
      updated_at: now,
    };

    // Upsert matching unique constraint (user_id, prayer_date, prayer_name)
    const { data, error } = await supabase
      .from('prayer_records')
      .upsert(payload, {
        onConflict: 'user_id,prayer_date,prayer_name',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving prayer record to Supabase:', error);
      throw new Error(`Gagal menyimpan catatan sholat: ${error.message}`);
    }

    return data as PrayerRecord;
  }

  // Local storage demo fallback
  const all = getLocalRecords();
  const existingIdx = all.findIndex(
    (r) =>
      r.user_id === (userId || 'demo-user') &&
      r.prayer_date === input.prayer_date &&
      r.prayer_name === input.prayer_name
  );

  const updatedRecord: PrayerRecord = {
    id: existingIdx >= 0 ? all[existingIdx].id : `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId || 'demo-user',
    prayer_date: input.prayer_date,
    prayer_name: input.prayer_name,
    status: input.status,
    completed_at: input.completed_at || null,
    timing_category: input.timing_category || null,
    congregation_type: input.congregation_type || null,
    notes: input.notes?.trim() || null,
    created_at: existingIdx >= 0 ? all[existingIdx].created_at : now,
    updated_at: now,
  };

  if (existingIdx >= 0) {
    all[existingIdx] = updatedRecord;
  } else {
    all.push(updatedRecord);
  }

  saveLocalRecords(all);
  return updatedRecord;
}

/**
 * Deletes a prayer record with user verification.
 */
export async function deletePrayerRecord(
  userId: string,
  recordId: string
): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('prayer_records')
      .delete()
      .eq('id', recordId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Gagal menghapus catatan: ${error.message}`);
    }
    return;
  }

  // Local storage demo fallback
  const all = getLocalRecords();
  const filtered = all.filter((r) => r.id !== recordId);
  saveLocalRecords(filtered);
}

/**
 * Exports user records to JSON string
 */
export function exportRecordsToJSON(records: PrayerRecord[]): string {
  return JSON.stringify(
    {
      app: 'Personal Prayer Tracker',
      version: '1.0',
      exported_at: new Date().toISOString(),
      total_records: records.length,
      data: records,
    },
    null,
    2
  );
}

/**
 * Exports user records to CSV format string
 */
export function exportRecordsToCSV(records: PrayerRecord[]): string {
  const headers = [
    'Tanggal',
    'Waktu Sholat',
    'Status',
    'Jam Pelaksanaan',
    'Ketepatan Waktu',
    'Tipe Sholat',
    'Catatan'
  ];

  const rows = records.map((r) => [
    r.prayer_date,
    r.prayer_name,
    r.status === 'completed' ? 'Sudah Dilaksanakan' : 'Tidak Dilaksanakan',
    r.completed_at || '-',
    r.timing_category === 'on_time' ? 'Tepat Waktu' : r.timing_category === 'late' ? 'Terlambat' : '-',
    r.congregation_type === 'congregation' ? 'Berjamaah' : r.congregation_type === 'alone' ? 'Sendiri' : '-',
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
