/**
 * Utility functions for local date and time handling in Indonesian context.
 * Strictly preserves local date representation to avoid UTC skew.
 */

export const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const MONTH_NAMES_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

/**
 * Returns YYYY-MM-DD string in local user timezone.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into a Date object at local midnight (00:00:00).
 * Prevents UTC timezone shift bug.
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Returns current local time as HH:mm
 */
export function getCurrentLocalTimeString(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formats a YYYY-MM-DD date string into Indonesian format
 * Example: "Senin, 26 Oktober 2026"
 */
export function formatIndonesianDate(dateString: string, includeDayName = true): string {
  if (!dateString) return '';
  const date = parseLocalDate(dateString);
  const dayName = DAY_NAMES_ID[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();

  if (includeDayName) {
    return `${dayName}, ${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
}

/**
 * Formats short Indonesian date
 * Example: "26 Okt 2026"
 */
export function formatShortIndonesianDate(dateString: string): string {
  if (!dateString) return '';
  const date = parseLocalDate(dateString);
  const day = date.getDate();
  const month = MONTH_NAMES_SHORT_ID[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Returns Indonesian greeting based on current local hour
 */
export function getTimeOfDayGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 3 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

/**
 * Add or subtract days from a YYYY-MM-DD string
 */
export function shiftDateDays(dateString: string, daysDelta: number): string {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + daysDelta);
  return getLocalDateString(date);
}

/**
 * Formats seconds into HH:MM:SS or MM:SS countdown
 */
export function formatSecondsToCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  return `${hStr}:${mStr}:${sStr}`;
}
