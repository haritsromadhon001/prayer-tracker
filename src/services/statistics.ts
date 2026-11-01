import { OverallStats, PrayerRecord } from '../types/prayer';
import { getLocalDateString, parseLocalDate, shiftDateDays } from '../utils/date';

export interface DailyTrendItem {
  date: string; // YYYY-MM-DD
  displayDate: string; // "26 Okt"
  completed: number;
  notCompleted: number;
  unrecorded: number;
}

export interface StatisticsFilter {
  period: '7days' | '30days' | 'month';
  selectedMonth?: string; // YYYY-MM
}

/**
 * Calculates accurate statistics based strictly on explicit records.
 * Unrecorded prayers are never conflated with neglected prayers.
 */
export function calculateOverallStats(
  records: PrayerRecord[],
  periodDays: number,
  startDateStr: string,
  endDateStr: string
): OverallStats {
  const filteredRecords = records.filter(
    (r) => r.prayer_date >= startDateStr && r.prayer_date <= endDateStr
  );

  let totalCompleted = 0;
  let totalNotCompleted = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  let congregationCount = 0;
  let aloneCount = 0;

  const recordedDaysSet = new Set<string>();

  for (const r of filteredRecords) {
    recordedDaysSet.add(r.prayer_date);
    if (r.status === 'completed') {
      totalCompleted += 1;
      if (r.timing_category === 'on_time') onTimeCount += 1;
      if (r.timing_category === 'late') lateCount += 1;
      if (r.congregation_type === 'congregation') congregationCount += 1;
      if (r.congregation_type === 'alone') aloneCount += 1;
    } else if (r.status === 'not_completed') {
      totalNotCompleted += 1;
    }
  }

  const totalExplicitRecords = totalCompleted + totalNotCompleted;
  const totalPossibleSlots = Math.max(1, periodDays * 5);

  // Kelengkapan pencatatan: catatan eksplisit / (hari * 5) * 100
  const recordingCompletenessRate = Math.min(
    100,
    Math.round((totalExplicitRecords / totalPossibleSlots) * 100)
  );

  // Tingkat penyelesaian catatan: completed / (completed + not_completed) * 100
  // Catatan yang belum dicatat TIDAK dimasukkan ke penyebut.
  const prayerCompletionRate =
    totalExplicitRecords > 0
      ? Math.round((totalCompleted / totalExplicitRecords) * 100)
      : 0;

  return {
    totalCompleted,
    totalNotCompleted,
    totalRecordedDays: recordedDaysSet.size,
    recordingCompletenessRate,
    prayerCompletionRate,
    onTimeCount,
    lateCount,
    congregationCount,
    aloneCount,
    periodDays,
  };
}

/**
 * Builds trend dataset for charts
 */
export function buildDailyTrend(
  records: PrayerRecord[],
  daysCount: number,
  endDateStr: string = getLocalDateString()
): DailyTrendItem[] {
  const trend: DailyTrendItem[] = [];
  const recordsMap = new Map<string, PrayerRecord[]>();

  for (const r of records) {
    const list = recordsMap.get(r.prayer_date) || [];
    list.push(r);
    recordsMap.set(r.prayer_date, list);
  }

  // Iterate backwards from endDateStr
  for (let i = daysCount - 1; i >= 0; i--) {
    const dateStr = shiftDateDays(endDateStr, -i);
    const dayRecords = recordsMap.get(dateStr) || [];

    const completed = dayRecords.filter((r) => r.status === 'completed').length;
    const notCompleted = dayRecords.filter((r) => r.status === 'not_completed').length;
    const unrecorded = Math.max(0, 5 - (completed + notCompleted));

    const dateObj = parseLocalDate(dateStr);
    const displayDate = `${dateObj.getDate()} ${
      ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][
        dateObj.getMonth()
      ]
    }`;

    trend.push({
      date: dateStr,
      displayDate,
      completed,
      notCompleted,
      unrecorded,
    });
  }

  return trend;
}
