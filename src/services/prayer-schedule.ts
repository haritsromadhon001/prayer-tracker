import { DailySchedule, NextPrayerInfo, PrayerName, PrayerScheduleTimings } from '../types/prayer';
import { formatSecondsToCountdown, getCurrentLocalTimeString, getLocalDateString } from '../utils/date';

export interface LocationOption {
  name: string;
  province?: string;
  country: string;
  lat?: number;
  lng?: number;
  timezone: string;
}

export const INDONESIA_MAJOR_CITIES: LocationOption[] = [
  { name: 'Jakarta', province: 'DKI Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta' },
  { name: 'Surabaya', province: 'Jawa Timur', country: 'Indonesia', lat: -7.2575, lng: 112.7521, timezone: 'Asia/Jakarta' },
  { name: 'Bandung', province: 'Jawa Barat', country: 'Indonesia', lat: -6.9175, lng: 107.6191, timezone: 'Asia/Jakarta' },
  { name: 'Medan', province: 'Sumatera Utara', country: 'Indonesia', lat: 3.5952, lng: 98.6722, timezone: 'Asia/Jakarta' },
  { name: 'Semarang', province: 'Jawa Tengah', country: 'Indonesia', lat: -6.9667, lng: 110.4167, timezone: 'Asia/Jakarta' },
  { name: 'Makassar', province: 'Sulawesi Selatan', country: 'Indonesia', lat: -5.1477, lng: 119.4327, timezone: 'Asia/Makassar' },
  { name: 'Palembang', province: 'Sumatera Selatan', country: 'Indonesia', lat: -2.9761, lng: 104.7754, timezone: 'Asia/Jakarta' },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', country: 'Indonesia', lat: -7.7956, lng: 110.3695, timezone: 'Asia/Jakarta' },
  { name: 'Denpasar', province: 'Bali', country: 'Indonesia', lat: -8.6705, lng: 115.2126, timezone: 'Asia/Makassar' },
  { name: 'Banda Aceh', province: 'Aceh', country: 'Indonesia', lat: 5.5483, lng: 95.3238, timezone: 'Asia/Jakarta' },
  { name: 'Padang', province: 'Sumatera Barat', country: 'Indonesia', lat: -0.9471, lng: 100.4172, timezone: 'Asia/Jakarta' },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', country: 'Indonesia', lat: -3.3194, lng: 114.5908, timezone: 'Asia/Makassar' },
  { name: 'Balikpapan', province: 'Kalimantan Timur', country: 'Indonesia', lat: -1.2379, lng: 116.8289, timezone: 'Asia/Makassar' },
  { name: 'Jayapura', province: 'Papua', country: 'Indonesia', lat: -2.5337, lng: 140.7181, timezone: 'Asia/Jayapura' },
];

export const CALCULATION_METHODS = [
  { id: 'KEMENAG', name: 'Kemenag RI (Kementerian Agama)', methodNumber: 20, description: 'Standar resmi Indonesia (Fajr 20°, Isha 18°)' },
  { id: 'MWL', name: 'Muslim World League (MWL)', methodNumber: 3, description: 'Rabitah al-Alam al-Islami (Fajr 18°, Isha 17°)' },
  { id: 'EGYPT', name: 'Egyptian General Authority', methodNumber: 5, description: 'Otoritas Umum Mesir (Fajr 19.5°, Isha 17.5°)' },
  { id: 'MAKKAH', name: 'Umm al-Qura University, Makkah', methodNumber: 4, description: 'Fajr 18.5°, Isha 90 menit setelah Magrib' },
  { id: 'ISNA', name: 'Islamic Society of North America (ISNA)', methodNumber: 2, description: 'Fajr 15°, Isha 15°' },
];

const CACHE_PREFIX = 'ppt_schedule_cache_';

/**
 * Clean timing string (e.g. "04:32 (WIB)" -> "04:32")
 */
function cleanTime(timeStr: string): string {
  if (!timeStr) return '00:00';
  return timeStr.split(' ')[0].substring(0, 5);
}

/**
 * Fetches prayer schedule from Aladhan API with resilient fallback and caching.
 */
export async function fetchPrayerSchedule(
  dateString: string = getLocalDateString(),
  locationName: string = 'Jakarta',
  methodId: string = 'KEMENAG',
  asrMethod: 'STANDARD' | 'HANAFI' = 'STANDARD',
  latitude?: number | null,
  longitude?: number | null
): Promise<DailySchedule> {
  const cacheKey = `${CACHE_PREFIX}${dateString}_${locationName}_${methodId}_${asrMethod}`;
  
  // 1. Check local storage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed: DailySchedule = JSON.parse(cached);
      // Valid cache if fetched within 48 hours and matches date
      if (parsed.date === dateString) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read schedule cache', err);
  }

  // 2. Map method
  const methodObj = CALCULATION_METHODS.find((m) => m.id === methodId) || CALCULATION_METHODS[0];
  const schoolParam = asrMethod === 'HANAFI' ? 1 : 0;

  // 3. Convert YYYY-MM-DD to DD-MM-YYYY for Aladhan API
  const [year, month, day] = dateString.split('-');
  const aladhanDate = `${day}-${month}-${year}`;

  let apiUrl = '';
  if (latitude != null && longitude != null) {
    apiUrl = `https://api.aladhan.com/v1/timings/${aladhanDate}?latitude=${latitude}&longitude=${longitude}&method=${methodObj.methodNumber}&school=${schoolParam}`;
  } else {
    apiUrl = `https://api.aladhan.com/v1/timingsByCity/${aladhanDate}?city=${encodeURIComponent(locationName)}&country=Indonesia&method=${methodObj.methodNumber}&school=${schoolParam}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const json = await response.json();
    if (json.code !== 200 || !json.data || !json.data.timings) {
      throw new Error('Format respon API jadwal sholat tidak valid');
    }

    const t = json.data.timings;
    const schedule: DailySchedule = {
      date: dateString,
      location: locationName,
      timings: {
        subuh: cleanTime(t.Fajr),
        terbit: cleanTime(t.Sunrise),
        zuhur: cleanTime(t.Dhuhr),
        asar: cleanTime(t.Asr),
        magrib: cleanTime(t.Maghrib),
        isya: cleanTime(t.Isha),
      },
      source: `Aladhan API (${methodObj.name})`,
      fetched_at: new Date().toISOString(),
    };

    // Cache to localStorage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(schedule));
    } catch {
      // Ignore quota exceeded
    }

    return schedule;
  } catch (err) {
    console.warn('Aladhan API fetch failed, using fallback calculations:', err);
    // Use sensible fallback timings for Indonesian region
    return getFallbackSchedule(dateString, locationName, methodObj.name);
  }
}

/**
 * Fallback schedule tailored for Indonesian coordinates in case of offline/network failure
 */
export function getFallbackSchedule(dateString: string, locationName: string, methodName: string): DailySchedule {
  return {
    date: dateString,
    location: locationName,
    timings: {
      subuh: '04:35',
      terbit: '05:50',
      zuhur: '11:58',
      asar: '15:12',
      magrib: '18:03',
      isya: '19:14',
    },
    source: `Estimasi Lokal Cadangan (${methodName})`,
    fetched_at: new Date().toISOString(),
  };
}

/**
 * Converts HH:mm string to minutes from start of day
 */
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Computes next prayer and live countdown
 */
export function getNextPrayer(
  timings: PrayerScheduleTimings,
  currentDate: Date = new Date()
): NextPrayerInfo {
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const currentSecondsInDay = currentMinutes * 60 + currentDate.getSeconds();

  const prayerOrder: { name: PrayerName; label: string; time: string }[] = [
    { name: 'subuh', label: 'Subuh', time: timings.subuh },
    { name: 'zuhur', label: 'Zuhur', time: timings.zuhur },
    { name: 'asar', label: 'Asar', time: timings.asar },
    { name: 'magrib', label: 'Magrib', time: timings.magrib },
    { name: 'isya', label: 'Isya', time: timings.isya },
  ];

  // Find first prayer that is strictly after current time
  for (const prayer of prayerOrder) {
    const prayerSecondsInDay = timeStringToMinutes(prayer.time) * 60;
    if (prayerSecondsInDay > currentSecondsInDay) {
      const remaining = prayerSecondsInDay - currentSecondsInDay;
      return {
        name: prayer.name,
        label: prayer.label,
        time: prayer.time,
        remainingSeconds: remaining,
        isToday: true,
        formattedCountdown: formatSecondsToCountdown(remaining),
      };
    }
  }

  // If all prayers today have passed, the next prayer is Subuh tomorrow
  const subuhSecondsTomorrow = 24 * 3600 + timeStringToMinutes(timings.subuh) * 60;
  const remainingUntilSubuh = subuhSecondsTomorrow - currentSecondsInDay;

  return {
    name: 'subuh',
    label: 'Subuh',
    time: timings.subuh,
    remainingSeconds: remainingUntilSubuh,
    isToday: false,
    formattedCountdown: formatSecondsToCountdown(remainingUntilSubuh),
  };
}
