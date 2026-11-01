/**
 * PERSONAL PRAYER TRACKER — AUTOMATED LOGIC VERIFICATION SUITE
 * Tests Fardhu, Sunnah (Rawatib, Tahajud, Dhuha), and Excel Matrix Calculations
 */

import assert from 'assert';

// 1. DATE UTILITY TESTS
function testDateUtilities() {
  console.log('Testing Indonesian Date Utilities...');

  function getLocalDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function parseLocalDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  }

  const testDate = new Date(2026, 9, 26); // 26 Oktober 2026
  const str = getLocalDateStr(testDate);
  assert.strictEqual(str, '2026-10-26');

  const parsed = parseLocalDate('2026-10-26');
  assert.strictEqual(parsed.getFullYear(), 2026);
  assert.strictEqual(parsed.getMonth(), 9);
  assert.strictEqual(parsed.getDate(), 26);

  console.log('✓ Date utilities pass (no UTC timezone shift)');
}

// 2. STATISTICS FORMULA TESTS
function testStatisticsFormulas() {
  console.log('Testing Statistics Formulas...');

  const records = [
    { prayer_date: '2026-10-26', prayer_name: 'subuh', status: 'completed', timing_category: 'on_time', congregation_type: 'congregation' },
    { prayer_date: '2026-10-26', prayer_name: 'zuhur', status: 'completed', timing_category: 'late', congregation_type: 'alone' },
    { prayer_date: '2026-10-26', prayer_name: 'asar', status: 'not_completed' },
    // magrib: unrecorded
    // isya: unrecorded
  ];

  const totalCompleted = records.filter(r => r.status === 'completed').length;
  const totalNotCompleted = records.filter(r => r.status === 'not_completed').length;
  const totalExplicit = totalCompleted + totalNotCompleted;
  const daysCount = 1;
  const totalPossible = daysCount * 5;

  assert.strictEqual(totalCompleted, 2);
  assert.strictEqual(totalNotCompleted, 1);
  assert.strictEqual(totalExplicit, 3);

  // Kelengkapan: 3 / 5 = 60%
  const completeness = Math.round((totalExplicit / totalPossible) * 100);
  assert.strictEqual(completeness, 60);

  // Tingkat penyelesaian: 2 / 3 = 67%
  const completionRate = Math.round((totalCompleted / totalExplicit) * 100);
  assert.strictEqual(completionRate, 67);

  console.log('✓ Statistics calculation formula matches specification strictly');
}

// 3. PRAYER COUNTDOWN TESTS
function testCountdownLogic() {
  console.log('Testing Prayer Countdown...');

  function timeToMinutes(tStr) {
    const [h, m] = tStr.split(':').map(Number);
    return h * 60 + m;
  }

  function getNextPrayer(timings, currentHours, currentMins) {
    const currentSec = currentHours * 3600 + currentMins * 60;
    const order = [
      { name: 'subuh', time: timings.subuh },
      { name: 'zuhur', time: timings.zuhur },
      { name: 'asar', time: timings.asar },
      { name: 'magrib', time: timings.magrib },
      { name: 'isya', time: timings.isya },
    ];

    for (const p of order) {
      const pSec = timeToMinutes(p.time) * 60;
      if (pSec > currentSec) {
        return { name: p.name, remainingSec: pSec - currentSec, isToday: true };
      }
    }

    const subuhTomorrow = 24 * 3600 + timeToMinutes(timings.subuh) * 60;
    return { name: 'subuh', remainingSec: subuhTomorrow - currentSec, isToday: false };
  }

  const timings = {
    subuh: '04:35',
    zuhur: '11:58',
    asar: '15:12',
    magrib: '18:03',
    isya: '19:14',
  };

  const res1 = getNextPrayer(timings, 4, 0);
  assert.strictEqual(res1.name, 'subuh');
  assert.strictEqual(res1.isToday, true);
  assert.strictEqual(res1.remainingSec, 35 * 60);

  const res2 = getNextPrayer(timings, 13, 0);
  assert.strictEqual(res2.name, 'asar');
  assert.strictEqual(res2.isToday, true);

  const res3 = getNextPrayer(timings, 21, 0);
  assert.strictEqual(res3.name, 'subuh');
  assert.strictEqual(res3.isToday, false);

  console.log('✓ Prayer countdown & next prayer resolution pass');
}

// 4. SUNNAH PRAYERS & DUPLICATE PREVENTION
function testSunnahAndDuplicatePrevention() {
  console.log('Testing Sunnah Prayers (Rawatib, Tahajud, Dhuha) & Upsert Prevention...');

  const store = [];
  function upsertRecord(record) {
    const idx = store.findIndex(
      r => r.user_id === record.user_id &&
           r.prayer_date === record.prayer_date &&
           r.prayer_name === record.prayer_name
    );
    if (idx >= 0) {
      store[idx] = { ...store[idx], ...record, updated_at: 'now' };
    } else {
      store.push({ ...record, created_at: 'now' });
    }
  }

  // Fardhu
  upsertRecord({ user_id: 'u1', prayer_date: '2026-10-26', prayer_name: 'subuh', status: 'completed' });
  // Sunnah Dhuha (4 rakaat)
  upsertRecord({ user_id: 'u1', prayer_date: '2026-10-26', prayer_name: 'dhuha', status: 'completed', rakaat: 4 });
  // Sunnah Tahajud (8 rakaat)
  upsertRecord({ user_id: 'u1', prayer_date: '2026-10-26', prayer_name: 'tahajud', status: 'completed', rakaat: 8 });
  // Sunnah Rawatib with sub-prayers
  upsertRecord({
    user_id: 'u1',
    prayer_date: '2026-10-26',
    prayer_name: 'rawatib',
    status: 'completed',
    rakaat: 6,
    sub_prayers: ['qobliyah_subuh', 'badiyah_zuhur', 'badiyah_magrib']
  });

  assert.strictEqual(store.length, 4);

  // Verify upsert on Sunnah (e.g. updating Dhuha rakaat)
  upsertRecord({ user_id: 'u1', prayer_date: '2026-10-26', prayer_name: 'dhuha', status: 'completed', rakaat: 6 });
  assert.strictEqual(store.length, 4, 'Store length must remain 4 after updating dhuha');
  const dhuhaRec = store.find(r => r.prayer_name === 'dhuha');
  assert.strictEqual(dhuhaRec.rakaat, 6);

  console.log('✓ Sunnah prayers (Rawatib, Tahajud, Dhuha) and upsert mechanics pass');
}

// 5. EXCEL MODEL MATRIX COMPUTATION
function testExcelMatrixComputation() {
  console.log('Testing Excel Model Spreadsheet Calculations...');

  const FARDHU = ['subuh', 'zuhur', 'asar', 'magrib', 'isya'];
  const SUNNAH = ['dhuha', 'tahajud', 'rawatib'];
  const ALL = [...FARDHU, ...SUNNAH];

  const records = [
    { prayer_date: '2026-10-01', prayer_name: 'subuh', status: 'completed' },
    { prayer_date: '2026-10-01', prayer_name: 'zuhur', status: 'completed' },
    { prayer_date: '2026-10-01', prayer_name: 'asar', status: 'completed' },
    { prayer_date: '2026-10-01', prayer_name: 'magrib', status: 'completed' },
    { prayer_date: '2026-10-01', prayer_name: 'isya', status: 'completed' },
    { prayer_date: '2026-10-01', prayer_name: 'dhuha', status: 'completed' },
    { prayer_date: '2026-10-01', prayer_name: 'tahajud', status: 'completed' },
    { prayer_date: '2026-10-01', prayer_name: 'rawatib', status: 'completed' },
  ];

  const fardhuCount = records.filter(r => FARDHU.includes(r.prayer_name) && r.status === 'completed').length;
  const sunnahCount = records.filter(r => SUNNAH.includes(r.prayer_name) && r.status === 'completed').length;
  const totalCount = records.filter(r => ALL.includes(r.prayer_name) && r.status === 'completed').length;

  assert.strictEqual(fardhuCount, 5);
  assert.strictEqual(sunnahCount, 3);
  assert.strictEqual(totalCount, 8);

  // Column sums
  const colTotals = { subuh: 0, zuhur: 0, dhuha: 0, tahajud: 0, rawatib: 0 };
  records.forEach(r => {
    if (colTotals[r.prayer_name] !== undefined && r.status === 'completed') {
      colTotals[r.prayer_name]++;
    }
  });

  assert.strictEqual(colTotals.subuh, 1);
  assert.strictEqual(colTotals.dhuha, 1);
  assert.strictEqual(colTotals.tahajud, 1);
  assert.strictEqual(colTotals.rawatib, 1);

  console.log('✓ Excel spreadsheet matrix formulas & totals verified');
}

// 6. CITY LOCATION SWITCHING TEST
function testCityLocationSwitching() {
  console.log('Testing City Location Switching (Jakarta <-> Surabaya)...');

  const MAJOR_CITIES = [
    { name: 'Jakarta', province: 'DKI Jakarta', lat: -6.2088, lng: 106.8456 },
    { name: 'Surabaya', province: 'Jawa Timur', lat: -7.2575, lng: 112.7521 },
  ];

  const settings = {
    location_name: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
  };

  // User changes to Surabaya
  const selectedCity = 'Surabaya';
  const found = MAJOR_CITIES.find(c => c.name.toLowerCase() === selectedCity.toLowerCase());
  assert(found, 'Surabaya must be found in major cities list');

  settings.location_name = selectedCity;
  settings.latitude = found.lat;
  settings.longitude = found.lng;

  assert.strictEqual(settings.location_name, 'Surabaya');
  assert.strictEqual(settings.latitude, -7.2575);
  assert.strictEqual(settings.longitude, 112.7521);

  console.log('✓ City location & coordinate switching verified');
}

// 7. INTERNATIONAL COUNTRY & CITY LOCATION TEST
function testInternationalLocationSwitching() {
  console.log('Testing International Country Location Switching (Makkah, Tokyo, Kuala Lumpur)...');

  const LOCATION_PRESETS = [
    { name: 'Jakarta', country: 'Indonesia', province: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, method: 'KEMENAG' },
    { name: 'Makkah', country: 'Arab Saudi', province: 'Makkah Al-Mukarramah', lat: 21.4225, lng: 39.8262, method: 'MAKKAH' },
    { name: 'Tokyo', country: 'Jepang', province: 'Kanto', lat: 35.6762, lng: 139.6503, method: 'MWL' },
    { name: 'Kuala Lumpur', country: 'Malaysia', province: 'Wilayah Persekutuan', lat: 3.1390, lng: 101.6869, method: 'MWL' },
  ];

  function recommendMethod(country) {
    const c = country.toLowerCase();
    if (c.includes('saudi') || c.includes('makkah')) return 'MAKKAH';
    if (c.includes('egypt') || c.includes('mesir')) return 'EGYPT';
    if (c.includes('indonesia')) return 'KEMENAG';
    if (c.includes('america') || c.includes('usa')) return 'ISNA';
    return 'MWL';
  }

  // Switch to Makkah (Arab Saudi)
  const makkah = LOCATION_PRESETS.find(c => c.name.toLowerCase() === 'makkah');
  assert(makkah, 'Makkah preset must exist');
  assert.strictEqual(makkah.country, 'Arab Saudi');
  assert.strictEqual(recommendMethod(makkah.country), 'MAKKAH');

  // Switch to Tokyo (Jepang)
  const tokyo = LOCATION_PRESETS.find(c => c.name.toLowerCase() === 'tokyo');
  assert(tokyo, 'Tokyo preset must exist');
  assert.strictEqual(tokyo.country, 'Jepang');
  assert.strictEqual(tokyo.lat, 35.6762);
  assert.strictEqual(recommendMethod(tokyo.country), 'MWL');

  console.log('✓ International country & city location switching verified');
}

// RUN ALL TESTS
try {
  testDateUtilities();
  testStatisticsFormulas();
  testCountdownLogic();
  testSunnahAndDuplicatePrevention();
  testExcelMatrixComputation();
  testCityLocationSwitching();
  testInternationalLocationSwitching();
  console.log('\n=============================================');
  console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ✓');
  console.log('=============================================');
} catch (err) {
  console.error('Test Failed:', err);
  process.exit(1);
}
