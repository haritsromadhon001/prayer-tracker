/**
 * PERSONAL PRAYER TRACKER — CORE APPLICATION ENGINE
 * Pure Vanilla JavaScript ES Module (Fast, self-contained, robust)
 * Includes Fardhu (5 waktu), Sunnah (Rawatib, Tahajud, Dhuha) and Excel Model Table
 */

// --- CONSTANTS & CONFIGURATION ---
const FARDHU_PRAYERS = ['subuh', 'zuhur', 'asar', 'magrib', 'isya'];
const SUNNAH_PRAYERS = ['dhuha', 'tahajud', 'rawatib'];
const ALL_PRAYERS = [...FARDHU_PRAYERS, ...SUNNAH_PRAYERS];

const PRAYER_ICONS = {
  subuh: '🌅',
  zuhur: '☀️',
  asar: '🌤️',
  magrib: '🌇',
  isya: '🌙',
  dhuha: '☀️',
  tahajud: '🌌',
  rawatib: '✨',
};

const PRAYER_DISPLAY_NAMES = {
  subuh: 'Subuh',
  zuhur: 'Zuhur',
  asar: 'Asar',
  magrib: 'Magrib',
  isya: 'Isya',
  dhuha: 'Sholat Dhuha',
  tahajud: 'Sholat Tahajud',
  rawatib: 'Sunnah Rawatib',
};

const PRAYER_SHORT_NAMES = {
  subuh: 'Subuh',
  zuhur: 'Zuhur',
  asar: 'Asar',
  magrib: 'Magrib',
  isya: 'Isya',
  dhuha: 'Dhuha',
  tahajud: 'Tahajud',
  rawatib: 'Rawatib',
};

const PRAYER_DESCRIPTIONS = {
  subuh: 'Sholat fajar pembuka hari',
  zuhur: 'Sholat tengah hari',
  asar: 'Sholat petang hari',
  magrib: 'Sholat saat terbenam matahari',
  isya: 'Sholat malam penutup ibadah fardhu',
  dhuha: 'Sholat sunnah pagi pembuka pintu rezeki (2 - 8 rakaat)',
  tahajud: 'Qiyamul Lail di sepertiga malam terakhir',
  rawatib: 'Sunnah muakkad pengiring fardhu (Qobliyah & Ba\'diyah)',
};

const RAWATIB_BREAKDOWN = [
  { id: 'qobliyah_subuh', name: '2 Rakaat Qobliyah Subuh', rakaat: 2 },
  { id: 'qobliyah_zuhur', name: '2/4 Rakaat Qobliyah Zuhur', rakaat: 2 },
  { id: 'badiyah_zuhur', name: '2 Rakaat Ba\'diyah Zuhur', rakaat: 2 },
  { id: 'badiyah_magrib', name: '2 Rakaat Ba\'diyah Magrib', rakaat: 2 },
  { id: 'badiyah_isya', name: '2 Rakaat Ba\'diyah Isya', rakaat: 2 },
];

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAY_NAMES_SHORT_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const LOCATION_PRESETS = [
  // --- INDONESIA ---
  { name: 'Jakarta', country: 'Indonesia', province: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Surabaya', country: 'Indonesia', province: 'Jawa Timur', lat: -7.2575, lng: 112.7521, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Bandung', country: 'Indonesia', province: 'Jawa Barat', lat: -6.9175, lng: 107.6191, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Medan', country: 'Indonesia', province: 'Sumatera Utara', lat: 3.5952, lng: 98.6722, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Semarang', country: 'Indonesia', province: 'Jawa Tengah', lat: -6.9667, lng: 110.4167, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Makassar', country: 'Indonesia', province: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Palembang', country: 'Indonesia', province: 'Sumatera Selatan', lat: -2.9761, lng: 104.7754, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Yogyakarta', country: 'Indonesia', province: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Denpasar', country: 'Indonesia', province: 'Bali', lat: -8.6705, lng: 115.2126, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Banda Aceh', country: 'Indonesia', province: 'Aceh', lat: 5.5483, lng: 95.3238, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Padang', country: 'Indonesia', province: 'Sumatera Barat', lat: -0.9471, lng: 100.4172, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Banjarmasin', country: 'Indonesia', province: 'Kalimantan Selatan', lat: -3.3194, lng: 114.5908, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Balikpapan', country: 'Indonesia', province: 'Kalimantan Timur', lat: -1.2379, lng: 116.8289, method: 'KEMENAG', region: 'Indonesia' },
  { name: 'Jayapura', country: 'Indonesia', province: 'Papua', lat: -2.5337, lng: 140.7181, method: 'KEMENAG', region: 'Indonesia' },

  // --- ARAB SAUDI (UMRAH / HAJI / KUNJUNGAN TIMUR TENGAH) ---
  { name: 'Makkah', country: 'Arab Saudi', province: 'Makkah Al-Mukarramah', lat: 21.4225, lng: 39.8262, method: 'MAKKAH', region: 'Arab Saudi (Umrah & Haji)', timezone: 'Asia/Riyadh' },
  { name: 'Madinah', country: 'Arab Saudi', province: 'Al-Madinah Al-Munawwarah', lat: 24.5247, lng: 39.5692, method: 'MAKKAH', region: 'Arab Saudi (Umrah & Haji)', timezone: 'Asia/Riyadh' },
  { name: 'Riyadh', country: 'Arab Saudi', province: 'Riyadh', lat: 24.7136, lng: 46.6753, method: 'MAKKAH', region: 'Arab Saudi (Umrah & Haji)', timezone: 'Asia/Riyadh' },
  { name: 'Jeddah', country: 'Arab Saudi', province: 'Makkah', lat: 21.5433, lng: 39.1728, method: 'MAKKAH', region: 'Arab Saudi (Umrah & Haji)', timezone: 'Asia/Riyadh' },

  // --- ASIA TENGGARA ---
  { name: 'Kuala Lumpur', country: 'Malaysia', province: 'Wilayah Persekutuan', lat: 3.1390, lng: 101.6869, method: 'MWL', region: 'Malaysia & Singapura', timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Pulau Pinang', country: 'Malaysia', province: 'Penang', lat: 5.4164, lng: 100.3327, method: 'MWL', region: 'Malaysia & Singapura', timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Johor Bahru', country: 'Malaysia', province: 'Johor', lat: 1.4927, lng: 103.7414, method: 'MWL', region: 'Malaysia & Singapura', timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Singapura', country: 'Singapura', province: 'Singapore', lat: 1.3521, lng: 103.8198, method: 'MWL', region: 'Malaysia & Singapura', timezone: 'Asia/Singapore' },
  { name: 'Bandar Seri Begawan', country: 'Brunei Darussalam', province: 'Brunei-Muara', lat: 4.9031, lng: 114.9398, method: 'MWL', region: 'Malaysia & Singapura', timezone: 'Asia/Brunei' },
  { name: 'Bangkok', country: 'Thailand', province: 'Bangkok', lat: 13.7563, lng: 100.5018, method: 'MWL', region: 'Asia & Pasifik', timezone: 'Asia/Bangkok' },

  // --- TIMUR TENGAH & AFRIKA UTARA ---
  { name: 'Dubai', country: 'Uni Emirat Arab', province: 'Dubai', lat: 25.2048, lng: 55.2708, method: 'MWL', region: 'Timur Tengah & Afrika', timezone: 'Asia/Dubai' },
  { name: 'Abu Dhabi', country: 'Uni Emirat Arab', province: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, method: 'MWL', region: 'Timur Tengah & Afrika', timezone: 'Asia/Dubai' },
  { name: 'Doha', country: 'Qatar', province: 'Ad Dawhah', lat: 25.2854, lng: 51.5310, method: 'MAKKAH', region: 'Timur Tengah & Afrika', timezone: 'Asia/Qatar' },
  { name: 'Istanbul', country: 'Turki', province: 'Istanbul', lat: 41.0082, lng: 28.9784, method: 'MWL', region: 'Timur Tengah & Afrika', timezone: 'Europe/Istanbul' },
  { name: 'Ankara', country: 'Turki', province: 'Ankara', lat: 39.9334, lng: 32.8597, method: 'MWL', region: 'Timur Tengah & Afrika', timezone: 'Europe/Istanbul' },
  { name: 'Kairo', country: 'Mesir', province: 'Cairo', lat: 30.0444, lng: 31.2357, method: 'EGYPT', region: 'Timur Tengah & Afrika', timezone: 'Africa/Cairo' },
  { name: 'Alexandria', country: 'Mesir', province: 'Alexandria', lat: 31.2001, lng: 29.9187, method: 'EGYPT', region: 'Timur Tengah & Afrika', timezone: 'Africa/Cairo' },

  // --- ASIA TIMUR & PASIFIK ---
  { name: 'Tokyo', country: 'Jepang', province: 'Kanto', lat: 35.6762, lng: 139.6503, method: 'MWL', region: 'Asia & Pasifik', timezone: 'Asia/Tokyo' },
  { name: 'Osaka', country: 'Jepang', province: 'Kansai', lat: 34.6937, lng: 135.5023, method: 'MWL', region: 'Asia & Pasifik', timezone: 'Asia/Tokyo' },
  { name: 'Kyoto', country: 'Jepang', province: 'Kansai', lat: 35.0116, lng: 135.7681, method: 'MWL', region: 'Asia & Pasifik', timezone: 'Asia/Tokyo' },
  { name: 'Seoul', country: 'Korea Selatan', province: 'Seoul', lat: 37.5665, lng: 126.9780, method: 'MWL', region: 'Asia & Pasifik', timezone: 'Asia/Seoul' },
  { name: 'Sydney', country: 'Australia', province: 'New South Wales', lat: -33.8688, lng: 151.2093, method: 'MWL', region: 'Asia & Pasifik', timezone: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'Australia', province: 'Victoria', lat: -37.8136, lng: 144.9631, method: 'MWL', region: 'Asia & Pasifik', timezone: 'Australia/Melbourne' },
  { name: 'Perth', country: 'Australia', province: 'Western Australia', lat: -31.9505, lng: 115.8605, method: 'MWL', region: 'Asia & Pasifik', timezone: 'Australia/Perth' },

  // --- EROPA & AMERIKA ---
  { name: 'London', country: 'Inggris (UK)', province: 'Greater London', lat: 51.5074, lng: -0.1278, method: 'MWL', region: 'Eropa & Amerika', timezone: 'Europe/London' },
  { name: 'Manchester', country: 'Inggris (UK)', province: 'Greater Manchester', lat: 53.4808, lng: -2.2426, method: 'MWL', region: 'Eropa & Amerika', timezone: 'Europe/London' },
  { name: 'Paris', country: 'Prancis', province: 'Ile-de-France', lat: 48.8566, lng: 2.3522, method: 'MWL', region: 'Eropa & Amerika', timezone: 'Europe/Paris' },
  { name: 'Berlin', country: 'Jerman', province: 'Berlin', lat: 52.5200, lng: 13.4050, method: 'MWL', region: 'Eropa & Amerika', timezone: 'Europe/Berlin' },
  { name: 'Frankfurt', country: 'Jerman', province: 'Hesse', lat: 50.1109, lng: 8.6821, method: 'MWL', region: 'Eropa & Amerika', timezone: 'Europe/Berlin' },
  { name: 'Amsterdam', country: 'Belanda', province: 'North Holland', lat: 52.3676, lng: 4.9041, method: 'MWL', region: 'Eropa & Amerika', timezone: 'Europe/Amsterdam' },
  { name: 'New York', country: 'Amerika Serikat', province: 'New York', lat: 40.7128, lng: -74.0060, method: 'ISNA', region: 'Eropa & Amerika', timezone: 'America/New_York' },
  { name: 'Los Angeles', country: 'Amerika Serikat', province: 'California', lat: 34.0522, lng: -118.2437, method: 'ISNA', region: 'Eropa & Amerika', timezone: 'America/Los_Angeles' },
  { name: 'Chicago', country: 'Amerika Serikat', province: 'Illinois', lat: 41.8781, lng: -87.6298, method: 'ISNA', region: 'Eropa & Amerika', timezone: 'America/Chicago' },
  { name: 'Washington D.C.', country: 'Amerika Serikat', province: 'District of Columbia', lat: 38.9072, lng: -77.0369, method: 'ISNA', region: 'Eropa & Amerika', timezone: 'America/New_York' },
];

const MAJOR_CITIES = LOCATION_PRESETS;

const CALCULATION_METHODS = [
  { id: 'KEMENAG', name: 'Kemenag RI (Kementerian Agama)', number: 20 },
  { id: 'MWL', name: 'Muslim World League (MWL)', number: 3 },
  { id: 'EGYPT', name: 'Egyptian General Authority', number: 5 },
  { id: 'MAKKAH', name: 'Umm al-Qura University, Makkah', number: 4 },
  { id: 'ISNA', name: 'ISNA (North America)', number: 2 },
];

function recommendMethodForCountry(country = '') {
  const c = country.toLowerCase();
  if (c.includes('saudi') || c.includes('makkah') || c.includes('arab') || c.includes('qatar')) return 'MAKKAH';
  if (c.includes('egypt') || c.includes('mesir')) return 'EGYPT';
  if (c.includes('indonesia')) return 'KEMENAG';
  if (c.includes('america') || c.includes('united states') || c.includes('usa') || c.includes('canada')) return 'ISNA';
  return 'MWL';
}

let toastTimer = null;
function showLocationToast(msg, type = 'loading') {
  const toastEl = document.getElementById('ppt-toast');
  const iconEl = document.getElementById('ppt-toast-icon');
  const msgEl = document.getElementById('ppt-toast-msg');
  if (!toastEl) return;

  if (toastTimer) clearTimeout(toastTimer);

  toastEl.className = `ppt-toast toast-${type} show`;
  if (type === 'loading') {
    if (iconEl) iconEl.innerHTML = '<span class="toast-spinner"></span>';
  } else if (type === 'success') {
    if (iconEl) iconEl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  } else {
    if (iconEl) iconEl.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }

  if (msgEl) msgEl.textContent = msg;

  if (type !== 'loading') {
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 4500);
  }
}

// --- MASTER DATA CATATAN SHOLAT PRIBADI ---
// Data absensi master yang tersimpan di dalam website agar otomatis sama persis di Laptop maupun HP tanpa perlu sync
const MASTER_RECORDS = [
  // 1 November 2026 (Minggu) - 5 Wajib Terlaksana (100%), 3 Sunnah Tidak Terlaksana
  {
    id: 'rec-20261101-subuh',
    user_id: 'user-self',
    prayer_date: '2026-11-01',
    prayer_name: 'subuh',
    status: 'completed',
    completed_at: '04:35',
    timing_category: 'on_time',
    congregation_type: 'alone',
    rakaat: 2,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  },
  {
    id: 'rec-20261101-zuhur',
    user_id: 'user-self',
    prayer_date: '2026-11-01',
    prayer_name: 'zuhur',
    status: 'completed',
    completed_at: '11:58',
    timing_category: 'on_time',
    congregation_type: 'alone',
    rakaat: 4,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  },
  {
    id: 'rec-20261101-asar',
    user_id: 'user-self',
    prayer_date: '2026-11-01',
    prayer_name: 'asar',
    status: 'completed',
    completed_at: '15:12',
    timing_category: 'on_time',
    congregation_type: 'alone',
    rakaat: 4,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  },
  {
    id: 'rec-20261101-magrib',
    user_id: 'user-self',
    prayer_date: '2026-11-01',
    prayer_name: 'magrib',
    status: 'completed',
    completed_at: '18:03',
    timing_category: 'on_time',
    congregation_type: 'alone',
    rakaat: 3,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  },
  {
    id: 'rec-20261101-isya',
    user_id: 'user-self',
    prayer_date: '2026-11-01',
    prayer_name: 'isya',
    status: 'completed',
    completed_at: '19:14',
    timing_category: 'on_time',
    congregation_type: 'alone',
    rakaat: 4,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  },
  {
    id: 'rec-20261101-dhuha',
    user_id: 'user-self',
    prayer_date: '2026-11-01',
    prayer_name: 'dhuha',
    status: 'not_completed',
    completed_at: null,
    timing_category: null,
    congregation_type: null,
    rakaat: 0,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  },
  {
    id: 'rec-20261101-tahajud',
    user_id: 'user-self',
    prayer_date: '2026-11-01',
    prayer_name: 'tahajud',
    status: 'not_completed',
    completed_at: null,
    timing_category: null,
    congregation_type: null,
    rakaat: 0,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  },
  {
    id: 'rec-20261101-rawatib',
    user_id: 'user-self',
    prayer_date: '2026-11-01',
    prayer_name: 'rawatib',
    status: 'not_completed',
    completed_at: null,
    timing_category: null,
    congregation_type: null,
    rakaat: 0,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  },
  // 2 November 2026 (Senin) - Subuh Terlaksana (20%)
  {
    id: 'rec-20261102-subuh',
    user_id: 'user-self',
    prayer_date: '2026-11-02',
    prayer_name: 'subuh',
    status: 'completed',
    completed_at: '04:35',
    timing_category: 'on_time',
    congregation_type: 'alone',
    rakaat: 2,
    notes: null,
    created_at: '2026-11-01T22:00:00.000Z',
    updated_at: '2026-11-01T22:00:00.000Z'
  }
];

// --- APP STATE ---
const AppState = {
  currentDate: new Date(),
  selectedDateStr: getLocalDateStr(new Date()),
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  excelMonth: new Date().getMonth(),
  excelYear: new Date().getFullYear(),
  activeTab: 'dashboard',
  statsPeriod: '7days', // '7days' | '30days' | 'month'
  
  profile: {
    display_name: 'Sahabat Sholat',
    timezone: 'Asia/Jakarta',
  },
  
  settings: {
    location_name: 'Jakarta',
    country: 'Indonesia',
    latitude: -6.2088,
    longitude: 106.8456,
    calculation_method: 'KEMENAG',
    asr_method: 'STANDARD',
  },

  schedule: {
    timings: {
      subuh: '04:35',
      terbit: '05:50',
      zuhur: '11:58',
      asar: '15:12',
      magrib: '18:03',
      isya: '19:14',
    },
    source: 'Memuat...',
    fetched_at: null,
  },

  records: [], // Default kosong untuk pengunjung baru agar data terisolasi mandiri
  reminders: [
    { prayer_name: 'subuh', enabled: true, minutes_before: 0 },
    { prayer_name: 'zuhur', enabled: true, minutes_before: 0 },
    { prayer_name: 'asar', enabled: true, minutes_before: 0 },
    { prayer_name: 'magrib', enabled: true, minutes_before: 0 },
    { prayer_name: 'isya', enabled: true, minutes_before: 0 },
  ],

  modalRecord: {
    isOpen: false,
    dateStr: '',
    prayerName: '',
    record: null,
  },

  firedRemindersSet: new Set(),
};

// --- UTILITY FUNCTIONS ---
function getLocalDateStr(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function formatIndoDate(dateStr, withDay = true) {
  if (!dateStr) return '';
  const d = parseLocalDate(dateStr);
  const dayName = DAY_NAMES_ID[d.getDay()];
  const day = d.getDate();
  const month = MONTH_NAMES_ID[d.getMonth()];
  const year = d.getFullYear();
  return withDay ? `${dayName}, ${day} ${month} ${year}` : `${day} ${month} ${year}`;
}

function getGreeting(d = new Date()) {
  const h = d.getHours();
  if (h >= 3 && h < 11) return 'Selamat Pagi';
  if (h >= 11 && h < 15) return 'Selamat Siang';
  if (h >= 15 && h < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

function timeToMinutes(tStr) {
  if (!tStr) return 0;
  const [h, m] = tStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatCountdown(sec) {
  if (sec <= 0) return '00:00:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Serene Audio Chime via Web Audio API
function playSereneChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') ctx.resume();
    
    const now = ctx.currentTime;
    const tones = [528, 660, 792]; // Solfeggio 528Hz harmonious triad
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 1.3);
    });
  } catch (e) {
    console.warn('Audio chime playback restricted', e);
  }
}

// --- LOCAL STORAGE PERSISTENCE ---
function loadLocalData() {
  try {
    const savedProfile = localStorage.getItem('ppt_profile');
    if (savedProfile) AppState.profile = JSON.parse(savedProfile);

    const savedSettings = localStorage.getItem('ppt_settings');
    if (savedSettings) {
      AppState.settings = JSON.parse(savedSettings);
      if (!AppState.settings.country) {
        AppState.settings.country = 'Indonesia';
      }
      // Auto-sync coordinates with location_name if user selected a city from MAJOR_CITIES
      if (AppState.settings.location_name && AppState.settings.location_name !== 'Lokasi GPS Saat Ini') {
        const found = MAJOR_CITIES.find(c => c.name.toLowerCase() === AppState.settings.location_name.toLowerCase());
        if (found) {
          AppState.settings.latitude = found.lat;
          AppState.settings.longitude = found.lng;
          AppState.settings.province = found.province;
          if (found.country) AppState.settings.country = found.country;
        }
      }
    }

    const savedRecords = localStorage.getItem('ppt_records');
    const isOwner = localStorage.getItem('ppt_is_owner') === 'true' || 
      (AppState.profile && AppState.profile.display_name && AppState.profile.display_name.toLowerCase().includes('harits'));

    if (isOwner) {
      // Perangkat milik Harits (Pemilik): tandai permanen agar data Harits selalu aman di perangkat ini
      localStorage.setItem('ppt_is_owner', 'true');
    }

    if (savedRecords !== null) {
      try {
        let recs = JSON.parse(savedRecords);
        // Jika perangkat ini BUKAN milik Harits, tapi sempat tercemar data master Harits dari versi sebelumnya:
        if (!isOwner && Array.isArray(recs)) {
          const hadMasterData = recs.some(r => r.id && (r.id.startsWith('rec-20261101-') || r.id.startsWith('rec-20261102-')));
          if (hadMasterData) {
            // Bersihkan data master Harits dari perangkat orang lain / tester secara otomatis!
            recs = recs.filter(r => r.id && !r.id.startsWith('rec-20261101-') && !r.id.startsWith('rec-20261102-'));
            localStorage.setItem('ppt_records', JSON.stringify(recs));
          }
        }
        AppState.records = recs;
      } catch (e) {
        AppState.records = [];
      }
    } else {
      // Pengunjung baru / tester: mulai dari lembar absensi bersih/kosong milik sendiri (0%)
      AppState.records = [];
      localStorage.setItem('ppt_records', JSON.stringify([]));
    }

    const savedReminders = localStorage.getItem('ppt_reminders');
    if (savedReminders) AppState.reminders = JSON.parse(savedReminders);
  } catch (e) {
    console.warn('Failed loading local storage data', e);
  }
}

function saveLocalData() {
  try {
    localStorage.setItem('ppt_profile', JSON.stringify(AppState.profile));
    localStorage.setItem('ppt_settings', JSON.stringify(AppState.settings));
    localStorage.setItem('ppt_records', JSON.stringify(AppState.records));
    localStorage.setItem('ppt_reminders', JSON.stringify(AppState.reminders));
  } catch (e) {
    console.warn('Failed saving local storage data', e);
  }
}

// --- DATA PRIVACY & RECORD MANAGEMENT ---
function clearUserRecords() {
  const confirmed = confirm('Apakah Anda yakin ingin mengosongkan seluruh catatan absensi sholat di perangkat ini untuk memulai absensi pribadi dari awal?');
  if (!confirmed) return;

  AppState.records = [];
  saveLocalData();
  renderAll();
  showLocationToast('Catatan absensi sholat berhasil dikosongkan. Anda dapat mulai mencatat dari nol.', 'success');
}

function loadMasterRecords() {
  const confirmed = confirm('Muat data master absensi milik Harits (Pemilik) ke perangkat ini? Seluruh 9 catatan bawaan akan diterapkan.');
  if (!confirmed) return;

  localStorage.setItem('ppt_is_owner', 'true');
  if (!AppState.profile.display_name || AppState.profile.display_name === 'Sahabat Sholat') {
    AppState.profile.display_name = 'Harits';
  }
  AppState.records = JSON.parse(JSON.stringify(MASTER_RECORDS));
  saveLocalData();
  renderAll();
  showLocationToast('Data master pemilik (Harits) berhasil dimuat!', 'success');
}

function triggerImportJson() {
  const fileInput = document.getElementById('input-import-backup');
  if (fileInput) fileInput.click();
}

function handleImportJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data && Array.isArray(data.records)) {
        AppState.records = data.records;
        if (data.profile) AppState.profile = { ...AppState.profile, ...data.profile };
        if (data.settings) AppState.settings = { ...AppState.settings, ...data.settings };
        saveLocalData();
        renderAll();
        showLocationToast(`Berhasil memulihkan ${data.records.length} catatan absensi sholat!`, 'success');
      } else {
        showLocationToast('Format berkas cadangan .json tidak sesuai.', 'error');
      }
    } catch (err) {
      showLocationToast('Gagal membaca berkas: pastikan format file JSON valid.', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// --- PRAYER SCHEDULE SERVICE ---
async function fetchSchedule(dateStr = getLocalDateStr()) {
  const loc = AppState.settings.location_name || 'Jakarta';
  const country = AppState.settings.country || 'Indonesia';
  const methodObj = CALCULATION_METHODS.find(m => m.id === AppState.settings.calculation_method) || CALCULATION_METHODS[0];
  const school = AppState.settings.asr_method === 'HANAFI' ? 1 : 0;
  
  const [y, m, d] = dateStr.split('-');
  const aladhanDate = `${d}-${m}-${y}`;
  
  let url = '';
  if (AppState.settings.latitude && AppState.settings.longitude) {
    url = `https://api.aladhan.com/v1/timings/${aladhanDate}?latitude=${AppState.settings.latitude}&longitude=${AppState.settings.longitude}&method=${methodObj.number}&school=${school}`;
  } else {
    url = `https://api.aladhan.com/v1/timingsByCity/${aladhanDate}?city=${encodeURIComponent(loc)}&country=${encodeURIComponent(country)}&method=${methodObj.number}&school=${school}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data && json.data.timings) {
      const t = json.data.timings;
      const clean = (s) => (s ? s.split(' ')[0].substring(0, 5) : '00:00');
      AppState.schedule = {
        timings: {
          subuh: clean(t.Fajr),
          terbit: clean(t.Sunrise),
          zuhur: clean(t.Dhuhr),
          asar: clean(t.Asr),
          magrib: clean(t.Maghrib),
          isya: clean(t.Isha),
        },
        source: `Aladhan API (${loc})`,
        fetched_at: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      renderAll();
      return;
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to local calculation', err);
  }

  // Fallback defaults for Indonesia based on city
  const isSurabaya = loc.toLowerCase().includes('surabaya');
  AppState.schedule = {
    timings: isSurabaya ? {
      subuh: '03:43',
      terbit: '05:03',
      zuhur: '11:13',
      asar: '14:26',
      magrib: '17:23',
      isya: '18:35',
    } : {
      subuh: '04:08',
      terbit: '05:28',
      zuhur: '11:37',
      asar: '14:51',
      magrib: '17:46',
      isya: '18:57',
    },
    source: `Estimasi Lokal Standar (${loc})`,
    fetched_at: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
  renderAll();
}

// --- COUNTDOWN CALCULATION ---
function getNextPrayerInfo() {
  const now = new Date();
  const currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const t = AppState.schedule.timings;

  const order = [
    { name: 'subuh', time: t.subuh },
    { name: 'zuhur', time: t.zuhur },
    { name: 'asar', time: t.asar },
    { name: 'magrib', time: t.magrib },
    { name: 'isya', time: t.isya },
  ];

  for (const p of order) {
    const pSec = timeToMinutes(p.time) * 60;
    if (pSec > currentSec) {
      const rem = pSec - currentSec;
      return {
        name: p.name,
        label: PRAYER_DISPLAY_NAMES[p.name],
        time: p.time,
        countdown: formatCountdown(rem),
        isToday: true,
      };
    }
  }

  // Next is Subuh tomorrow
  const subuhTomorrowSec = 24 * 3600 + timeToMinutes(t.subuh) * 60;
  const rem = subuhTomorrowSec - currentSec;
  return {
    name: 'subuh',
    label: 'Subuh',
    time: t.subuh,
    countdown: formatCountdown(rem),
    isToday: false,
  };
}

// --- REMINDER CHECKER ---
function checkReminders() {
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const todayStr = getLocalDateStr(now);

  for (const name of FARDHU_PRAYERS) {
    const pref = AppState.reminders.find(r => r.prayer_name === name);
    if (!pref || !pref.enabled) continue;

    const timeStr = AppState.schedule.timings[name];
    if (!timeStr) continue;

    const targetMin = timeToMinutes(timeStr) - pref.minutes_before;
    const key = `${todayStr}_${name}_${pref.minutes_before}`;

    if (currentMin === targetMin && !AppState.firedRemindersSet.has(key)) {
      AppState.firedRemindersSet.add(key);
      const prayerDisplay = PRAYER_DISPLAY_NAMES[name];
      const msg = pref.minutes_before > 0
        ? `${pref.minutes_before} menit lagi menjelang waktu Sholat ${prayerDisplay} (${timeStr}). Bersiaplah untuk berwudhu.`
        : `Telah masuk waktu Sholat ${prayerDisplay} (${timeStr}). Mari tunaikan sholat tepat waktu.`;

      playSereneChime();

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Waktu Sholat ${prayerDisplay}`, {
          body: msg,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230d9488"><circle cx="12" cy="12" r="10"/></svg>',
        });
      }
    }
  }
}

// --- RENDER FUNCTIONS ---
function renderHeaderAndGreeting() {
  const now = new Date();
  const greetingEl = document.getElementById('header-greeting');
  const dateEl = document.getElementById('header-date');
  const locEl = document.getElementById('header-location');

  if (greetingEl) {
    greetingEl.textContent = `${getGreeting(now)}, ${AppState.profile.display_name}`;
  }
  if (dateEl) {
    dateEl.textContent = formatIndoDate(getLocalDateStr(now), true);
  }
  if (locEl) {
    const country = AppState.settings.country || 'Indonesia';
    locEl.textContent = `${AppState.settings.location_name}, ${country} • ${AppState.profile.timezone}`;
  }

  // Next prayer badge
  const nextInfo = getNextPrayerInfo();
  const nextNameEl = document.getElementById('next-prayer-name');
  const nextTimeEl = document.getElementById('next-prayer-time');
  const nextCountEl = document.getElementById('next-prayer-countdown');

  if (nextNameEl) nextNameEl.textContent = `Sholat Berikutnya: ${nextInfo.label}`;
  if (nextTimeEl) nextTimeEl.textContent = nextInfo.time;
  if (nextCountEl) {
    nextCountEl.textContent = nextInfo.isToday 
      ? `Hitung mundur: ${nextInfo.countdown}`
      : `Menuju Subuh • ${nextInfo.countdown}`;
  }
}

function updateDashboardDateUI() {
  const datePicker = document.getElementById('dashboard-date-picker');
  const badge = document.getElementById('dashboard-date-badge');
  const todayBtn = document.getElementById('btn-reset-dashboard-today');
  const progressCardTitle = document.getElementById('progress-card-title');
  
  const selected = AppState.selectedDateStr || getLocalDateStr();
  const today = getLocalDateStr();

  if (datePicker && datePicker.value !== selected) {
    datePicker.value = selected;
  }

  const isToday = selected === today;
  const selDate = parseLocalDate(selected);
  const todayDate = parseLocalDate(today);
  const diffTime = selDate.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  let badgeText = '';
  let badgeClass = 'badge-today';

  if (diffDays === 0) {
    badgeText = `📅 Hari Ini: ${formatIndoDate(selected, true)}`;
    badgeClass = 'badge-today';
  } else if (diffDays === -1) {
    badgeText = `📝 Mengisi Catatan Kemarin (${formatIndoDate(selected, true)})`;
    badgeClass = 'badge-past';
  } else if (diffDays < -1) {
    badgeText = `📝 Mengisi Catatan ${Math.abs(diffDays)} Hari Lalu (${formatIndoDate(selected, true)})`;
    badgeClass = 'badge-past';
  } else if (diffDays === 1) {
    badgeText = `📝 Mengisi Catatan Besok (${formatIndoDate(selected, true)})`;
    badgeClass = 'badge-future';
  } else {
    badgeText = `📝 Mengisi Catatan Lusa (+${diffDays} Hari: ${formatIndoDate(selected, true)})`;
    badgeClass = 'badge-future';
  }

  if (badge) {
    badge.className = `date-status-badge ${badgeClass}`;
    badge.innerHTML = badgeText;
  }

  if (todayBtn) {
    todayBtn.style.display = isToday ? 'none' : 'inline-flex';
  }

  if (progressCardTitle) {
    progressCardTitle.textContent = isToday 
      ? 'Progres Absensi Sholat Hari Ini' 
      : `Progres Absensi Sholat: ${formatIndoDate(selected, false)}`;
  }
}

function changeDashboardDate(newDateStr) {
  if (!newDateStr) return;
  AppState.selectedDateStr = newDateStr;
  updateDashboardDateUI();
  renderDailyProgress();
  renderPrayerCards();
}

function navigateDashboardDate(deltaDays) {
  const cur = parseLocalDate(AppState.selectedDateStr || getLocalDateStr());
  cur.setDate(cur.getDate() + deltaDays);
  AppState.selectedDateStr = getLocalDateStr(cur);
  updateDashboardDateUI();
  renderDailyProgress();
  renderPrayerCards();
}

function resetDashboardDateToToday() {
  AppState.selectedDateStr = getLocalDateStr();
  updateDashboardDateUI();
  renderDailyProgress();
  renderPrayerCards();
}

function renderDailyProgress() {
  const targetDateStr = AppState.selectedDateStr || getLocalDateStr();
  const dateRecords = AppState.records.filter(r => r.prayer_date === targetDateStr);

  // Penilaian utama murni berdasarkan 5 sholat wajib (Subuh s/d Isya)
  const fardhuCompleted = dateRecords.filter(r => FARDHU_PRAYERS.includes(r.prayer_name) && r.status === 'completed').length;
  const fardhuNotCompleted = dateRecords.filter(r => FARDHU_PRAYERS.includes(r.prayer_name) && r.status === 'not_completed').length;
  const fardhuUnrecorded = Math.max(0, 5 - (fardhuCompleted + fardhuNotCompleted));
  const fardhuPercent = Math.round((fardhuCompleted / 5) * 100);

  // Sholat sunnah sebagai amalan tambahan / bonus opsional
  const sunnahCompleted = dateRecords.filter(r => SUNNAH_PRAYERS.includes(r.prayer_name) && r.status === 'completed').length;

  const titleEl = document.getElementById('progress-title-text');
  const barEl = document.getElementById('progress-bar-fill');
  const metaCompEl = document.getElementById('meta-completed');
  const metaNotEl = document.getElementById('meta-not-completed');
  const metaUnrecEl = document.getElementById('meta-unrecorded');

  if (titleEl) {
    const bonusText = sunnahCompleted > 0 ? ` • +${sunnahCompleted} Sholat Sunnah (Bonus)` : ' • Sholat Sunnah Opsional';
    titleEl.textContent = `${fardhuCompleted} dari 5 sholat wajib dilaksanakan (${fardhuPercent}%)${bonusText}`;
  }
  if (barEl) {
    barEl.style.width = `${fardhuPercent}%`;
  }
  if (metaCompEl) metaCompEl.textContent = `${fardhuCompleted} Wajib Selesai`;
  if (metaNotEl) metaNotEl.textContent = `${fardhuNotCompleted} Wajib Tidak Dilaksanakan`;
  if (metaUnrecEl) metaUnrecEl.textContent = `${fardhuUnrecorded} Wajib Belum Dicatat`;
}

function renderPrayerCards() {
  const fardhuContainer = document.getElementById('prayers-grid-container');
  const sunnahContainer = document.getElementById('sunnah-prayers-grid-container');
  const targetDateStr = AppState.selectedDateStr || getLocalDateStr();
  const dateRecords = AppState.records.filter(r => r.prayer_date === targetDateStr);

  const recordMap = {};
  dateRecords.forEach(r => { recordMap[r.prayer_name] = r; });

  // 1. Render Fardhu Prayers (Fokus Penilaian Utama)
  if (fardhuContainer) {
    fardhuContainer.innerHTML = FARDHU_PRAYERS.map(name => renderSingleCard(name, recordMap[name], targetDateStr, false)).join('');
  }

  // 2. Render Sunnah Prayers (Opsional / Bonus Amalan)
  if (sunnahContainer) {
    sunnahContainer.innerHTML = SUNNAH_PRAYERS.map(name => renderSingleCard(name, recordMap[name], targetDateStr, true)).join('');
  }
}

function renderSingleCard(name, record, todayStr, isSunnah = false) {
  const schedTime = AppState.schedule.timings[name] || (isSunnah ? 'Waktu Sunnah' : '--:--');
  const desc = PRAYER_DESCRIPTIONS[name];
  const icon = PRAYER_ICONS[name] || '🕌';

  let statusClass = 'unrecorded';
  let pillClass = isSunnah ? 'pill-sunnah' : 'pill-unrecorded';
  let pillLabel = isSunnah ? 'Opsional' : 'Belum Dicatat';
  let mainBtnText = isSunnah ? '+ Catat Sunnah' : 'Catat Sholat';
  let mainBtnClass = '';

  if (record) {
    if (record.status === 'completed') {
      statusClass = 'completed';
      pillClass = 'pill-completed';
      pillLabel = isSunnah ? '✓ Bonus Terlaksana' : '✓ Dilaksanakan';
      mainBtnText = 'Edit Catatan';
      mainBtnClass = 'completed';
    } else if (record.status === 'not_completed') {
      statusClass = isSunnah ? 'unrecorded' : 'not-completed';
      pillClass = isSunnah ? 'pill-sunnah' : 'pill-not';
      pillLabel = isSunnah ? 'Tidak Terlaksana' : '✕ Terlewat';
      mainBtnText = 'Edit Catatan';
      mainBtnClass = 'completed';
    }
  }

  let tagsHtml = '';
  if (record && record.status === 'completed') {
    const timeTag = record.completed_at ? `<span class="prayer-tag">Jam ${record.completed_at}</span>` : '';
    const rakaatTag = record.rakaat ? `<span class="prayer-tag">${record.rakaat} Rakaat</span>` : '';
    const timingTag = record.timing_category === 'on_time' 
      ? `<span class="prayer-tag tag-ontime">Tepat Waktu</span>` 
      : record.timing_category === 'late' 
      ? `<span class="prayer-tag tag-late">Terlambat</span>` 
      : '';
    const congTag = record.congregation_type === 'congregation'
      ? `<span class="prayer-tag tag-cong">Berjamaah</span>`
      : record.congregation_type === 'alone'
      ? `<span class="prayer-tag tag-alone">Sendiri</span>`
      : '';

    tagsHtml = `<div class="prayer-details-info" style="margin-top:0.4rem; display:flex; flex-wrap:wrap; gap:0.25rem;">
      ${timeTag} ${rakaatTag} ${timingTag} ${congTag}
    </div>`;

    if (name === 'rawatib' && record.sub_prayers && record.sub_prayers.length > 0) {
      const subLabels = record.sub_prayers.map(spId => {
        const item = RAWATIB_BREAKDOWN.find(b => b.id === spId);
        return item ? item.name.replace(' Rakaat ', ' ') : spId;
      }).join(', ');
      tagsHtml += `<div style="font-size:0.7rem; color:var(--brand-700); font-weight:600; margin-top:0.3rem;">${escapeHtml(subLabels)}</div>`;
    }
  }

  if (record && record.notes) {
    tagsHtml += `<p style="font-size:0.7rem; color:var(--text-muted); margin-top:0.3rem; font-style:italic;">"${escapeHtml(record.notes)}"</p>`;
  }

  return `
    <div class="prayer-card ${statusClass}" data-prayer="${name}">
      <div class="prayer-card-header">
        <div style="display:flex; align-items:center; gap:0.4rem;">
          <span style="font-size:1.15rem; line-height:1;">${icon}</span>
          <span class="prayer-name">${PRAYER_DISPLAY_NAMES[name]}</span>
          ${isSunnah ? '<span class="badge-sunnah-chip">Sunnah</span>' : ''}
        </div>
        <span class="prayer-status-pill ${pillClass}">${pillLabel}</span>
      </div>

      <div class="prayer-card-schedule">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>${isSunnah ? schedTime : schedTime + ' WIB'}</span>
      </div>

      <div class="prayer-card-body">
        <p style="font-size:0.75rem; color:var(--text-muted); line-height:1.4;">${desc}</p>
        ${tagsHtml}
      </div>
      <div class="prayer-card-actions">
        <button class="btn-record-main ${mainBtnClass}" onclick="window.app.openRecordModal('${todayStr}', '${name}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          ${mainBtnText}
        </button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// --- EXCEL MODEL TABLE RENDERER ---
function renderExcelTable(autoScrollToToday = false) {
  const container = document.getElementById('excel-table-body');
  const footerContainer = document.getElementById('excel-table-foot');
  if (!container) return;

  const year = AppState.excelYear;
  const month = AppState.excelMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = MONTH_NAMES_ID[month];

  // Update Excel Title & Month label
  const titleEl = document.getElementById('excel-sheet-title');
  if (titleEl) titleEl.textContent = `Rekap_Absensi_Sholat_${monthName}_${year}.xlsx`;

  const colTotals = {
    subuh: 0, zuhur: 0, asar: 0, magrib: 0, isya: 0,
    dhuha: 0, tahajud: 0, rawatib: 0,
    totalFardhu: 0, totalSunnah: 0, totalAll: 0
  };

  let rowsHtml = '';
  const todayStr = getLocalDateStr();

  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = parseLocalDate(dStr);
    const dayOfWeek = DAY_NAMES_SHORT_ID[dateObj.getDay()];
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const isToday = dStr === todayStr;

    const dayRecords = AppState.records.filter(r => r.prayer_date === dStr);
    const recMap = {};
    dayRecords.forEach(r => { recMap[r.prayer_name] = r; });

    let fardhuCount = 0;
    let sunnahCount = 0;

    // Fardhu & Sunnah cells
    const cellHtmls = ALL_PRAYERS.map(pName => {
      const rec = recMap[pName];
      let char = '-';
      let cls = 'unrecorded';
      let title = `${formatIndoDate(dStr, false)}: ${PRAYER_DISPLAY_NAMES[pName]} (Belum Dicatat)`;

      if (rec) {
        if (rec.status === 'completed') {
          char = '✓';
          cls = 'completed';
          title = `${formatIndoDate(dStr, false)}: ${PRAYER_DISPLAY_NAMES[pName]} (✓ Dilaksanakan${rec.completed_at ? ' jam ' + rec.completed_at : ''}${rec.rakaat ? ', ' + rec.rakaat + ' rakaat' : ''})`;
          colTotals[pName] += 1;
          if (FARDHU_PRAYERS.includes(pName)) fardhuCount++;
          else sunnahCount++;
        } else if (rec.status === 'not_completed') {
          char = '✕';
          cls = 'not-completed';
          title = `${formatIndoDate(dStr, false)}: ${PRAYER_DISPLAY_NAMES[pName]} (✕ Tidak Dilaksanakan)`;
        }
      }

      return `
        <td class="col-cell-prayer">
          <button class="excel-cell-btn ${cls}" 
            title="${title}" 
            onmouseenter="window.app.updateExcelFormulaBar('${day}', '${pName}', '${title}')"
            onclick="window.app.updateExcelFormulaBar('${day}', '${pName}', '${title}'); window.app.quickToggleExcelCell('${dStr}', '${pName}')"
            ondblclick="window.app.openRecordModal('${dStr}', '${pName}')">
            ${char}
          </button>
        </td>
      `;
    }).join('');

    colTotals.totalFardhu += fardhuCount;
    colTotals.totalSunnah += sunnahCount;
    colTotals.totalAll += (fardhuCount + sunnahCount);

    const totalDayCompleted = fardhuCount + sunnahCount;
    const percentFardhu = Math.round((fardhuCount / 5) * 100);

    // Notes summary
    const notesSummary = dayRecords.filter(r => r.notes).map(r => `${PRAYER_SHORT_NAMES[r.prayer_name]}: ${r.notes}`).join('; ');

    rowsHtml += `
      <tr ${isToday ? 'id="excel-row-today"' : ''} style="${isToday ? 'background-color:#f0fdf4;' : isWeekend ? 'background-color:#fafafa;' : ''}">
        <td class="col-row-idx">${day}</td>
        <td class="col-tanggal" style="${isToday ? 'font-weight:700; color:#166534;' : ''}">
          <div class="col-tanggal-desktop">${day} ${monthName.substring(0, 3)} ${year}</div>
          <div class="col-tanggal-mobile">
            <span class="d-m-num">${day} ${monthName.substring(0, 3)}</span>
            <span class="d-m-day ${isWeekend ? 'weekend' : ''}">${dayOfWeek}</span>
          </div>
        </td>
        <td class="col-hari" style="font-weight:600; color:${isWeekend ? '#dc2626' : '#64748b'};">${dayOfWeek}</td>
        ${cellHtmls}
        <td class="col-wajib" style="font-weight:700; color:${fardhuCount === 5 ? '#15803d' : '#334155'};">${fardhuCount}/5</td>
        <td class="col-sunnah" style="font-weight:700; color:${sunnahCount > 0 ? '#b45309' : '#94a3b8'};">${sunnahCount > 0 ? '+' + sunnahCount : '0'}</td>
        <td class="col-total" style="font-weight:800; color:#0f172a;">${totalDayCompleted}</td>
        <td class="col-progres" style="text-align:right; font-variant-numeric:tabular-nums; font-weight:600;">
          <span style="font-size:0.75rem; padding:2px 6px; border-radius:4px; background:${percentFardhu === 100 ? '#dcfce7; color:#15803d;' : percentFardhu >= 60 ? '#fef3c7; color:#b45309;' : '#f1f5f9; color:#64748b;'}">
            ${percentFardhu}%
          </span>
        </td>
        <td class="col-catatan" style="text-align:left; font-size:0.75rem; color:#64748b; max-width:200px; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(notesSummary)}">
          ${escapeHtml(notesSummary) || '-'}
        </td>
      </tr>
    `;
  }

  container.innerHTML = rowsHtml;

  // Render Footer Sum Row
  if (footerContainer) {
    const avgFardhuRate = Math.round((colTotals.totalFardhu / (daysInMonth * 5)) * 100);
    footerContainer.innerHTML = `
      <tr>
        <td class="col-row-idx">Σ</td>
        <td class="col-tanggal">
          <div class="col-tanggal-desktop">TOTAL (BULAN INI)</div>
          <div class="col-tanggal-mobile">TOTAL</div>
        </td>
        <td class="col-hari">-</td>
        <td class="col-cell-prayer">${colTotals.subuh}</td>
        <td class="col-cell-prayer">${colTotals.zuhur}</td>
        <td class="col-cell-prayer">${colTotals.asar}</td>
        <td class="col-cell-prayer">${colTotals.magrib}</td>
        <td class="col-cell-prayer">${colTotals.isya}</td>
        <td class="col-cell-prayer" style="color:#b45309;">${colTotals.dhuha}</td>
        <td class="col-cell-prayer" style="color:#b45309;">${colTotals.tahajud}</td>
        <td class="col-cell-prayer" style="color:#b45309;">${colTotals.rawatib}</td>
        <td class="col-wajib">${colTotals.totalFardhu}</td>
        <td class="col-sunnah" style="color:#b45309;">${colTotals.totalSunnah}</td>
        <td class="col-total">${colTotals.totalAll}</td>
        <td class="col-progres" style="text-align:right;">${avgFardhuRate}%</td>
        <td class="col-catatan">Rata-rata fardhu ${avgFardhuRate}%</td>
      </tr>
    `;
  }

  // Handle auto-scroll when tab is switched
  if (autoScrollToToday) {
    const wrapper = document.querySelector('.excel-table-wrapper');
    if (wrapper) {
      wrapper.scrollLeft = 0;
      const todayRow = document.getElementById('excel-row-today');
      if (todayRow) {
        setTimeout(() => {
          wrapper.scrollTop = Math.max(0, todayRow.offsetTop - 70);
        }, 50);
      } else {
        wrapper.scrollTop = 0;
      }
    }
  }
}

// Quick toggle directly inside Excel cell
function quickToggleExcelCell(dateStr, prayerName) {
  const existing = AppState.records.find(r => r.prayer_date === dateStr && r.prayer_name === prayerName);
  const now = new Date().toISOString();

  if (!existing) {
    // 1. None -> Completed
    AppState.records.push({
      id: `rec-${Date.now()}-${prayerName}`,
      user_id: 'user-self',
      prayer_date: dateStr,
      prayer_name: prayerName,
      status: 'completed',
      completed_at: AppState.schedule.timings[prayerName] || '06:00',
      timing_category: 'on_time',
      congregation_type: 'alone',
      rakaat: prayerName === 'rawatib' ? 2 : prayerName === 'dhuha' ? 2 : prayerName === 'tahajud' ? 2 : null,
      notes: null,
      created_at: now,
      updated_at: now,
    });
    playSereneChime();
  } else if (existing.status === 'completed') {
    // 2. Completed -> Not Completed
    existing.status = 'not_completed';
    existing.updated_at = now;
  } else {
    // 3. Not Completed -> Reset (Delete)
    AppState.records = AppState.records.filter(r => !(r.prayer_date === dateStr && r.prayer_name === prayerName));
  }

  saveLocalData();
  renderAll();
}

function updateExcelFormulaBar(day, prayerName, text) {
  const bar = document.getElementById('excel-fx-text');
  if (bar) {
    bar.textContent = `[R${day}:${prayerName.toUpperCase()}] ${text}`;
  }
}

// --- CALENDAR RENDERER ---
function renderCalendar() {
  const year = AppState.calendarYear;
  const month = AppState.calendarMonth;
  const titleEl = document.getElementById('calendar-month-year');
  if (titleEl) {
    titleEl.textContent = `${MONTH_NAMES_ID[month]} ${year}`;
  }

  const grid = document.getElementById('calendar-days-grid');
  if (!grid) return;

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Minggu
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = getLocalDateStr();

  let html = '';
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="calendar-cell" style="opacity:0.3; background:transparent; border-color:transparent; cursor:default;"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dStr === todayStr;
    const isSelected = dStr === AppState.selectedDateStr;

    const dayFardhuRecords = AppState.records.filter(r => r.prayer_date === dStr && FARDHU_PRAYERS.includes(r.prayer_name));
    const daySunnahRecords = AppState.records.filter(r => r.prayer_date === dStr && SUNNAH_PRAYERS.includes(r.prayer_name));
    const completedFardhu = dayFardhuRecords.filter(r => r.status === 'completed').length;
    const notCompletedFardhu = dayFardhuRecords.filter(r => r.status === 'not_completed').length;
    const completedSunnah = daySunnahRecords.filter(r => r.status === 'completed').length;

    let dotsHtml = '';
    if (completedFardhu > 0 || notCompletedFardhu > 0 || completedSunnah > 0) {
      dotsHtml = `<div class="calendar-dots">`;
      // Titik hijau untuk sholat fardhu selesai (maksimal 5 waktu)
      for (let c = 0; c < Math.min(completedFardhu, 5); c++) {
        dotsHtml += `<span class="calendar-dot" style="background-color:var(--brand-500)" title="Fardhu Terlaksana"></span>`;
      }
      // Titik merah untuk sholat fardhu yang terlewat
      for (let n = 0; n < Math.min(notCompletedFardhu, 5 - completedFardhu); n++) {
        dotsHtml += `<span class="calendar-dot" style="background-color:#ef4444" title="Fardhu Tidak Dilaksanakan"></span>`;
      }
      // Indikator bintang emas kecil untuk amalan sunnah bonus
      if (completedSunnah > 0) {
        dotsHtml += `<span class="calendar-dot" style="background-color:#f59e0b; width:4px; height:4px; border-radius:50%;" title="+${completedSunnah} Sholat Sunnah (Bonus)"></span>`;
      }
      dotsHtml += `</div>`;
    }

    html += `
      <div class="calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" onclick="window.app.selectCalendarDate('${dStr}')">
        <span>${day}</span>
        ${dotsHtml}
      </div>
    `;
  }

  grid.innerHTML = html;
  renderSelectedDayDetails();
}

function renderSelectedDayDetails() {
  const container = document.getElementById('selected-day-details');
  if (!container) return;

  const dStr = AppState.selectedDateStr;
  const dayRecords = AppState.records.filter(r => r.prayer_date === dStr);
  const recordMap = {};
  dayRecords.forEach(r => { recordMap[r.prayer_name] = r; });

  const fardhuCompleted = dayRecords.filter(r => FARDHU_PRAYERS.includes(r.prayer_name) && r.status === 'completed').length;
  const sunnahCompleted = dayRecords.filter(r => SUNNAH_PRAYERS.includes(r.prayer_name) && r.status === 'completed').length;

  let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
      <div>
        <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-main);">${formatIndoDate(dStr, true)}</h3>
        <p style="font-size:0.75rem; color:var(--text-muted);">${fardhuCompleted} dari 5 fardhu selesai • ${sunnahCompleted} sholat sunnah</p>
      </div>
      <button class="btn-secondary" style="font-size:0.75rem; padding:0.35rem 0.75rem;" onclick="window.app.quickFillAll('${dStr}', 'completed')">
        Tandai 5 Fardhu Selesai
      </button>
    </div>
    <div style="display:grid; grid-template-columns:1fr; gap:0.5rem;">
  `;

  html += ALL_PRAYERS.map(name => {
    const record = recordMap[name];
    const isSunnah = SUNNAH_PRAYERS.includes(name);
    let statusText = 'Belum Dicatat';
    let badgeClass = isSunnah ? 'pill-sunnah' : 'pill-unrecorded';

    if (record) {
      if (record.status === 'completed') {
        statusText = '✓ Dilaksanakan' + (record.completed_at ? ` (${record.completed_at})` : '') + (record.rakaat ? ` [${record.rakaat} rakaat]` : '');
        badgeClass = 'pill-completed';
      } else {
        statusText = '✕ Tidak Dilaksanakan';
        badgeClass = 'pill-not';
      }
    }

    return `
      <div style="background:var(--bg-app); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.75rem 1rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-weight:600; font-size:0.9rem; color:var(--text-main);">${PRAYER_DISPLAY_NAMES[name]}</span>
          ${isSunnah ? '<span class="badge-sunnah-chip" style="margin-left:0.35rem;">Sunnah</span>' : ''}
          <span class="prayer-status-pill ${badgeClass}" style="margin-left:0.5rem; font-size:0.65rem;">${statusText}</span>
        </div>
        <button class="btn-secondary" style="font-size:0.75rem; padding:0.35rem 0.65rem;" onclick="window.app.openRecordModal('${dStr}', '${name}')">
          ${record ? 'Ubah' : 'Catat'}
        </button>
      </div>
    `;
  }).join('');

  html += `</div>`;
  container.innerHTML = html;
}

// --- STATISTICS RENDERER ---
function renderStatistics() {
  const period = AppState.statsPeriod;
  const now = new Date();
  let daysCount = 7;

  if (period === '30days') daysCount = 30;
  else if (period === 'month') daysCount = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (daysCount - 1));
  const startStr = getLocalDateStr(startDate);
  const endStr = getLocalDateStr(endDate);

  const filtered = AppState.records.filter(r => r.prayer_date >= startStr && r.prayer_date <= endStr);
  // Penilaian utama murni berdasarkan 5 sholat wajib (Subuh s/d Isya)
  const fardhuRecords = filtered.filter(r => FARDHU_PRAYERS.includes(r.prayer_name));
  const sunnahRecords = filtered.filter(r => SUNNAH_PRAYERS.includes(r.prayer_name));

  let totalCompleted = 0;
  let totalNotCompleted = 0;
  let onTime = 0;
  let late = 0;
  let congregation = 0;
  let alone = 0;
  const recordedDays = new Set();

  fardhuRecords.forEach(r => {
    recordedDays.add(r.prayer_date);
    if (r.status === 'completed') {
      totalCompleted++;
      if (r.timing_category === 'on_time') onTime++;
      if (r.timing_category === 'late') late++;
      if (r.congregation_type === 'congregation') congregation++;
      if (r.congregation_type === 'alone') alone++;
    } else if (r.status === 'not_completed') {
      totalNotCompleted++;
    }
  });

  const totalExplicit = totalCompleted + totalNotCompleted;
  const possibleSlots = daysCount * 5; // strictly 5 fardhu prayers per day

  const completeness = Math.min(100, Math.round((totalExplicit / possibleSlots) * 100));
  const completionRate = totalExplicit > 0 ? Math.round((totalCompleted / totalExplicit) * 100) : 0;

  // Sunnah bonus metrics
  const sunnahCompleted = sunnahRecords.filter(r => r.status === 'completed').length;
  const tahajudCount = sunnahRecords.filter(r => r.prayer_name === 'tahajud' && r.status === 'completed').length;
  const dhuhaCount = sunnahRecords.filter(r => r.prayer_name === 'dhuha' && r.status === 'completed').length;
  const rawatibCount = sunnahRecords.filter(r => r.prayer_name === 'rawatib' && r.status === 'completed').length;

  document.getElementById('stat-completed').textContent = `${totalCompleted}`;
  document.getElementById('stat-not-completed').textContent = `${totalNotCompleted}`;
  document.getElementById('stat-days-recorded').textContent = `${recordedDays.size} / ${daysCount} Hari`;
  document.getElementById('stat-completeness').textContent = `${completeness}%`;
  document.getElementById('stat-completion-rate').textContent = `${completionRate}%`;

  document.getElementById('stat-ontime-rate').textContent = `${onTime} Tepat Waktu • ${late} Terlambat`;
  document.getElementById('stat-congregation-rate').textContent = `${congregation} Berjamaah • ${alone} Sendiri`;

  const sunnahBonusEl = document.getElementById('stat-sunnah-bonus');
  if (sunnahBonusEl) {
    sunnahBonusEl.textContent = `${sunnahCompleted} Terlaksana (${tahajudCount} Tahajud, ${dhuhaCount} Dhuha, ${rawatibCount} Rawatib)`;
  }

  renderTrendSVG(daysCount, endDate);
}

function renderTrendSVG(daysCount, endDate) {
  const container = document.getElementById('trend-chart-container');
  if (!container) return;

  const trendData = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    const dStr = getLocalDateStr(d);
    const dayRecords = AppState.records.filter(r => r.prayer_date === dStr && FARDHU_PRAYERS.includes(r.prayer_name));
    const completed = dayRecords.filter(r => r.status === 'completed').length;
    const notCompleted = dayRecords.filter(r => r.status === 'not_completed').length;
    trendData.push({
      dateStr: dStr,
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      completed,
      notCompleted,
      unrecorded: Math.max(0, 5 - (completed + notCompleted)),
    });
  }

  const chartHeight = 160;
  const barWidth = Math.max(12, Math.min(32, Math.floor(600 / daysCount) - 6));
  const svgWidth = Math.max(500, daysCount * (barWidth + 8));

  let barsHtml = '';
  trendData.forEach((item, idx) => {
    const x = idx * (barWidth + 8) + 20;
    const totalSlotHeight = 120;
    const unitHeight = totalSlotHeight / 5;

    const compH = item.completed * unitHeight;
    const notH = item.notCompleted * unitHeight;
    const unrecH = item.unrecorded * unitHeight;

    const yComp = 130 - compH;
    const yNot = yComp - notH;
    const yUnrec = yNot - unrecH;

    barsHtml += `
      <g class="chart-bar-group" data-date="${item.dateStr}">
        <rect x="${x}" y="${yUnrec}" width="${barWidth}" height="${unrecH}" fill="#f1f5f9" rx="2" />
        <rect x="${x}" y="${yNot}" width="${barWidth}" height="${notH}" fill="#fca5a5" rx="2" />
        <rect x="${x}" y="${yComp}" width="${barWidth}" height="${compH}" fill="#14b8a6" rx="2" />
        <text x="${x + barWidth / 2}" y="150" font-size="9" fill="#94a3b8" text-anchor="middle" font-family="inherit">${item.label}</text>
      </g>
    `;
  });

  container.innerHTML = `
    <div style="overflow-x:auto; padding-bottom:0.5rem;">
      <svg width="${svgWidth}" height="${chartHeight}" style="overflow:visible;">
        <line x1="10" y1="10" x2="${svgWidth}" y2="10" stroke="#f1f5f9" stroke-dasharray="3,3" />
        <line x1="10" y1="70" x2="${svgWidth}" y2="70" stroke="#f1f5f9" stroke-dasharray="3,3" />
        <line x1="10" y1="130" x2="${svgWidth}" y2="130" stroke="#e2e8f0" />
        ${barsHtml}
      </svg>
    </div>
    <div style="display:flex; justify-content:center; gap:1.25rem; font-size:0.75rem; color:var(--text-secondary); margin-top:0.5rem;">
      <span style="display:flex; align-items:center; gap:0.35rem;"><span class="dot dot-completed"></span> Dilaksanakan</span>
      <span style="display:flex; align-items:center; gap:0.35rem;"><span class="dot dot-not"></span> Tidak Dilaksanakan</span>
      <span style="display:flex; align-items:center; gap:0.35rem;"><span class="dot dot-unrecorded"></span> Belum Dicatat</span>
    </div>
  `;
}

// --- JADWAL SHOLAT TAB RENDERER ---
function renderScheduleTab() {
  const container = document.getElementById('schedule-table-rows');
  if (!container) return;

  const cityTitleEl = document.getElementById('schedule-city-title');
  if (cityTitleEl) {
    const country = AppState.settings.country || 'Indonesia';
    const prov = AppState.settings.province ? ` (${AppState.settings.province})` : '';
    cityTitleEl.textContent = `${AppState.settings.location_name}${prov}, ${country}`;
  }

  const t = AppState.schedule.timings;
  const scheduleRows = [
    { name: 'Imsak', time: calculateImsak(t.subuh), desc: '10 menit sebelum waktu Subuh' },
    { name: 'Subuh', time: t.subuh, desc: 'Fajar shodiq terbit di ufuk timur' },
    { name: 'Terbit (Syuruq)', time: t.terbit || '05:50', desc: 'Matahari terbit (akhir waktu Subuh)' },
    { name: 'Sholat Dhuha', time: calculateDhuhaStart(t.terbit), desc: 'Mulai 20 menit setelah terbit hingga menjelang Zuhur' },
    { name: 'Zuhur', time: t.zuhur, desc: 'Matahari tergelincir dari zenit' },
    { name: 'Asar', time: t.asar, desc: 'Bayangan benda sama panjang dengan aslinya' },
    { name: 'Magrib', time: t.magrib, desc: 'Matahari terbenam sempurna di ufuk barat' },
    { name: 'Isya', time: t.isya, desc: 'Hilangnya mega merah (syafaq)' },
    { name: 'Tahajud / Qiyam', time: '02:30 - 04:00', desc: 'Sepertiga malam terakhir sebelum Subuh' },
  ];

  container.innerHTML = scheduleRows.map(row => `
    <tr style="border-bottom:1px solid var(--border-light);">
      <td style="padding:0.75rem 1rem; font-weight:600; color:var(--text-main);">${row.name}</td>
      <td style="padding:0.75rem 1rem; font-weight:700; color:var(--brand-700); font-variant-numeric:tabular-nums; font-size:1.05rem;">
        ${row.time} <span style="font-size:0.7rem; font-weight:500; color:var(--text-muted);">WIB</span>
      </td>
      <td style="padding:0.75rem 1rem; font-size:0.8rem; color:var(--text-secondary);">${row.desc}</td>
    </tr>
  `).join('');

  const srcEl = document.getElementById('schedule-source-info');
  if (srcEl) {
    srcEl.textContent = `Sumber: ${AppState.schedule.source} • Diperbarui: ${AppState.schedule.fetched_at || 'Baru saja'}`;
  }
}

function calculateImsak(subuhStr) {
  if (!subuhStr) return '04:25';
  const mins = timeToMinutes(subuhStr) - 10;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function calculateDhuhaStart(terbitStr) {
  if (!terbitStr) return '06:10';
  const mins = timeToMinutes(terbitStr) + 20;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// --- REMINDER TAB RENDERER ---
function renderReminderTab() {
  const container = document.getElementById('reminder-list-container');
  if (!container) return;

  container.innerHTML = FARDHU_PRAYERS.map(name => {
    const pref = AppState.reminders.find(r => r.prayer_name === name) || { enabled: true, minutes_before: 0 };
    const schedTime = AppState.schedule.timings[name] || '--:--';

    return `
      <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <h4 style="font-size:1rem; font-weight:700; color:var(--text-main);">${PRAYER_DISPLAY_NAMES[name]}</h4>
          <p style="font-size:0.8rem; color:var(--text-secondary);">Jadwal: ${schedTime} WIB</p>
        </div>
        <div style="display:flex; align-items:center; gap:1rem;">
          <select class="form-select" style="font-size:0.8rem; padding:0.4rem 0.6rem; width:auto;" onchange="window.app.updateReminderMinutes('${name}', this.value)" ${pref.enabled ? '' : 'disabled'}>
            <option value="0" ${pref.minutes_before === 0 ? 'selected' : ''}>Tepat Waktu (0 menit)</option>
            <option value="5" ${pref.minutes_before === 5 ? 'selected' : ''}>5 Menit Sebelumnya</option>
            <option value="10" ${pref.minutes_before === 10 ? 'selected' : ''}>10 Menit Sebelumnya</option>
            <option value="15" ${pref.minutes_before === 15 ? 'selected' : ''}>15 Menit Sebelumnya</option>
          </select>
          <label style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer;">
            <input type="checkbox" style="opacity:0; width:0; height:0;" ${pref.enabled ? 'checked' : ''} onchange="window.app.toggleReminder('${name}', this.checked)">
            <span style="position:absolute; inset:0; background-color:${pref.enabled ? 'var(--brand-600)' : '#cbd5e1'}; border-radius:24px; transition:0.2s;">
              <span style="position:absolute; height:18px; width:18px; left:${pref.enabled ? '22px' : '3px'}; bottom:3px; background-color:white; border-radius:50%; transition:0.2s;"></span>
            </span>
          </label>
        </div>
      </div>
    `;
  }).join('');

  const permStatusEl = document.getElementById('notif-permission-status');
  if (permStatusEl) {
    if (!('Notification' in window)) {
      permStatusEl.textContent = 'Browser ini tidak mendukung notifikasi web';
      permStatusEl.style.color = '#ef4444';
    } else if (Notification.permission === 'granted') {
      permStatusEl.textContent = '✓ Izin notifikasi browser aktif';
      permStatusEl.style.color = '#059669';
    } else if (Notification.permission === 'denied') {
      permStatusEl.textContent = '✕ Izin notifikasi browser diblokir oleh pengguna';
      permStatusEl.style.color = '#dc2626';
    } else {
      permStatusEl.textContent = 'Belum meminta izin notifikasi browser';
      permStatusEl.style.color = '#d97706';
    }
  }
}

// --- RECORD MODAL CONTROLLER ---
function openRecordModal(dateStr, prayerName) {
  const existing = AppState.records.find(r => r.prayer_date === dateStr && r.prayer_name === prayerName);
  AppState.modalRecord = {
    isOpen: true,
    dateStr,
    prayerName,
    record: existing || null,
  };

  const titleEl = document.getElementById('record-modal-title');
  const subEl = document.getElementById('record-modal-subtitle');
  if (titleEl) titleEl.textContent = `Absensi ${PRAYER_DISPLAY_NAMES[prayerName]}`;
  if (subEl) subEl.textContent = `${formatIndoDate(dateStr, true)}`;

  const dateInput = document.getElementById('record-date-input');
  if (dateInput) dateInput.value = dateStr;

  const timeInput = document.getElementById('record-completed-time');
  const timingSelect = document.getElementById('record-timing-category');
  const congSelect = document.getElementById('record-congregation-type');
  const rakaatInput = document.getElementById('record-rakaat-count');
  const rakaatGroup = document.getElementById('record-rakaat-group');
  const rawatibGroup = document.getElementById('record-rawatib-group');
  const notesInput = document.getElementById('record-notes');
  const deleteBtn = document.getElementById('btn-delete-record');

  const status = existing ? existing.status : 'completed';
  selectModalStatus(status);

  const defaultTime = existing?.completed_at || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
  if (timeInput) timeInput.value = defaultTime;

  if (timingSelect) timingSelect.value = existing?.timing_category || '';
  if (congSelect) congSelect.value = existing?.congregation_type || '';
  if (notesInput) notesInput.value = existing?.notes || '';

  // Handle Sunnah Custom Fields
  const isSunnah = SUNNAH_PRAYERS.includes(prayerName);
  const sunnahNotice = document.getElementById('record-modal-sunnah-notice');
  if (sunnahNotice) {
    sunnahNotice.style.display = isSunnah ? 'block' : 'none';
  }
  if (rakaatGroup) {
    if (prayerName === 'dhuha' || prayerName === 'tahajud') {
      rakaatGroup.style.display = 'block';
      if (rakaatInput) rakaatInput.value = existing?.rakaat || (prayerName === 'dhuha' ? 2 : 2);
    } else {
      rakaatGroup.style.display = 'none';
    }
  }

  if (rawatibGroup) {
    if (prayerName === 'rawatib') {
      rawatibGroup.style.display = 'block';
      renderRawatibCheckboxes(existing?.sub_prayers || ['qobliyah_subuh', 'badiyah_magrib']);
    } else {
      rawatibGroup.style.display = 'none';
    }
  }

  if (deleteBtn) {
    deleteBtn.style.display = existing ? 'inline-block' : 'none';
  }

  const modal = document.getElementById('modal-record-prayer');
  if (modal) modal.style.display = 'flex';
}

function renderRawatibCheckboxes(selectedSubPrayers = []) {
  const container = document.getElementById('rawatib-checkbox-list');
  if (!container) return;

  container.innerHTML = RAWATIB_BREAKDOWN.map(item => {
    const isChecked = selectedSubPrayers.includes(item.id);
    return `
      <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.8rem; color:var(--text-main); margin-bottom:0.35rem; cursor:pointer;">
        <input type="checkbox" name="rawatib_sub" value="${item.id}" ${isChecked ? 'checked' : ''} style="accent-color:var(--brand-600); width:16px; height:16px;">
        <span>${item.name}</span>
      </label>
    `;
  }).join('');
}

function selectModalStatus(status) {
  const compBtn = document.getElementById('btn-status-completed');
  const notBtn = document.getElementById('btn-status-not');
  const optionalSection = document.getElementById('completed-optional-fields');

  if (status === 'completed') {
    compBtn.classList.add('selected');
    notBtn.classList.remove('selected');
    if (optionalSection) optionalSection.style.display = 'block';
  } else {
    notBtn.classList.add('selected');
    compBtn.classList.remove('selected');
    if (optionalSection) optionalSection.style.display = 'none';
  }
}

function changeModalDate(newDateStr) {
  if (!newDateStr) return;
  const prayerName = AppState.modalRecord.prayerName;
  AppState.modalRecord.dateStr = newDateStr;

  const subEl = document.getElementById('record-modal-subtitle');
  if (subEl) subEl.textContent = `${formatIndoDate(newDateStr, true)}`;

  const existing = AppState.records.find(r => r.prayer_date === newDateStr && r.prayer_name === prayerName);
  AppState.modalRecord.record = existing || null;

  const timeInput = document.getElementById('record-completed-time');
  const timingSelect = document.getElementById('record-timing-category');
  const congSelect = document.getElementById('record-congregation-type');
  const notesInput = document.getElementById('record-notes');
  const deleteBtn = document.getElementById('btn-delete-record');

  const status = existing ? existing.status : 'completed';
  selectModalStatus(status);

  const defaultTime = existing?.completed_at || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
  if (timeInput) timeInput.value = defaultTime;
  if (timingSelect) timingSelect.value = existing?.timing_category || '';
  if (congSelect) congSelect.value = existing?.congregation_type || '';
  if (notesInput) notesInput.value = existing?.notes || '';
  if (deleteBtn) deleteBtn.style.display = existing ? 'inline-block' : 'none';
}

function setModalDateToToday() {
  const today = getLocalDateStr();
  const dateInput = document.getElementById('record-date-input');
  if (dateInput) dateInput.value = today;
  changeModalDate(today);
}

function closeRecordModal() {
  AppState.modalRecord.isOpen = false;
  const modal = document.getElementById('modal-record-prayer');
  if (modal) modal.style.display = 'none';
}

function saveRecordFromModal() {
  const dateInput = document.getElementById('record-date-input');
  const dateStr = (dateInput && dateInput.value) ? dateInput.value : AppState.modalRecord.dateStr;
  const { prayerName } = AppState.modalRecord;
  const isCompleted = document.getElementById('btn-status-completed').classList.contains('selected');
  const status = isCompleted ? 'completed' : 'not_completed';
  
  const completedAt = isCompleted ? document.getElementById('record-completed-time').value : null;
  const timing = isCompleted ? document.getElementById('record-timing-category').value || null : null;
  const congregation = isCompleted ? document.getElementById('record-congregation-type').value || null : null;
  const notes = document.getElementById('record-notes').value.trim() || null;

  // Sunnah meta
  let rakaat = null;
  let subPrayers = null;

  if (prayerName === 'dhuha' || prayerName === 'tahajud') {
    const rakaatVal = Number(document.getElementById('record-rakaat-count').value);
    rakaat = rakaatVal || 2;
  } else if (prayerName === 'rawatib') {
    const checkedBoxes = Array.from(document.querySelectorAll('input[name="rawatib_sub"]:checked')).map(cb => cb.value);
    subPrayers = checkedBoxes;
    rakaat = checkedBoxes.length * 2;
  }

  const idx = AppState.records.findIndex(r => r.prayer_date === dateStr && r.prayer_name === prayerName);
  const now = new Date().toISOString();

  const recordPayload = {
    id: idx >= 0 ? AppState.records[idx].id : `rec-${Date.now()}-${prayerName}`,
    user_id: 'user-self',
    prayer_date: dateStr,
    prayer_name: prayerName,
    status,
    completed_at: completedAt,
    timing_category: timing,
    congregation_type: congregation,
    rakaat,
    sub_prayers: subPrayers,
    notes,
    created_at: idx >= 0 ? AppState.records[idx].created_at : now,
    updated_at: now,
  };

  if (idx >= 0) {
    AppState.records[idx] = recordPayload;
  } else {
    AppState.records.push(recordPayload);
  }

  AppState.selectedDateStr = dateStr;
  saveLocalData();
  closeRecordModal();
  renderAll();
  updateDashboardDateUI();
  showLocationToast(`✓ Catatan ${PRAYER_DISPLAY_NAMES[prayerName]} (${formatIndoDate(dateStr, false)}) berhasil disimpan!`, 'success');

  if (status === 'completed') {
    playSereneChime();
  }
}

function deleteCurrentRecord() {
  const { dateStr, prayerName } = AppState.modalRecord;
  if (!confirm(`Hapus catatan ${PRAYER_DISPLAY_NAMES[prayerName]} pada tanggal ${formatIndoDate(dateStr, false)}?`)) {
    return;
  }

  AppState.records = AppState.records.filter(r => !(r.prayer_date === dateStr && r.prayer_name === prayerName));
  saveLocalData();
  closeRecordModal();
  renderAll();
}

function quickFillAll(dateStr, status = 'completed') {
  if (!confirm(`Tandai semua 5 sholat fardhu pada tanggal ${formatIndoDate(dateStr, false)} sebagai ${status === 'completed' ? 'Sudah Dilaksanakan' : 'Tidak Dilaksanakan'}?`)) {
    return;
  }

  const now = new Date().toISOString();
  FARDHU_PRAYERS.forEach(name => {
    const idx = AppState.records.findIndex(r => r.prayer_date === dateStr && r.prayer_name === name);
    const rec = {
      id: idx >= 0 ? AppState.records[idx].id : `rec-${Date.now()}-${name}`,
      user_id: 'user-self',
      prayer_date: dateStr,
      prayer_name: name,
      status,
      completed_at: status === 'completed' ? AppState.schedule.timings[name] : null,
      timing_category: 'on_time',
      congregation_type: 'alone',
      rakaat: null,
      sub_prayers: null,
      notes: null,
      created_at: idx >= 0 ? AppState.records[idx].created_at : now,
      updated_at: now,
    };
    if (idx >= 0) AppState.records[idx] = rec;
    else AppState.records.push(rec);
  });

  saveLocalData();
  renderAll();
}

// --- TAB SWITCHING ---
function switchTab(tabName) {
  AppState.activeTab = tabName;

  const mainContainer = document.querySelector('main');
  if (mainContainer) {
    if (tabName === 'excel') {
      mainContainer.classList.add('main-wide');
    } else {
      mainContainer.classList.remove('main-wide');
      mainContainer.classList.remove('main-fullscreen');
    }
  }

  document.querySelectorAll('.tab-pane').forEach(el => {
    el.classList.remove('active');
  });
  const target = document.getElementById(`tab-${tabName}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-btn, .bottom-nav-item').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (tabName === 'excel') renderExcelTable(true);
  if (tabName === 'history') renderCalendar();
  if (tabName === 'statistics') renderStatistics();
  if (tabName === 'schedule') renderScheduleTab();
  if (tabName === 'reminders') renderReminderTab();
}


// --- PDF EXPORT & EVALUATION REPORT SYSTEM ---
function openPdfExportModal(month, year) {
  if (month !== undefined) AppState.pdfMonth = Number(month);
  else AppState.pdfMonth = AppState.excelMonth !== undefined ? AppState.excelMonth : new Date().getMonth();

  if (year !== undefined) AppState.pdfYear = Number(year);
  else AppState.pdfYear = AppState.excelYear !== undefined ? AppState.excelYear : new Date().getFullYear();

  populatePdfPeriodSelect();
  renderPdfPreview();

  const modal = document.getElementById('modal-pdf-export');
  if (modal) modal.style.display = 'flex';
}

function closePdfExportModal() {
  const modal = document.getElementById('modal-pdf-export');
  if (modal) modal.style.display = 'none';
}

function populatePdfPeriodSelect() {
  const select = document.getElementById('pdf-period-select');
  if (!select) return;

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  let optionsHtml = '';

  years.forEach(yr => {
    MONTH_NAMES_ID.forEach((mName, mIdx) => {
      const val = `${yr}-${mIdx}`;
      const isSelected = yr === AppState.pdfYear && mIdx === AppState.pdfMonth;
      optionsHtml += `<option value="${val}" ${isSelected ? 'selected' : ''}>${mName} ${yr}</option>`;
    });
  });

  select.innerHTML = optionsHtml;
}

function changePdfPeriod(periodVal) {
  if (!periodVal) return;
  const [yr, mIdx] = periodVal.split('-').map(Number);
  AppState.pdfYear = yr;
  AppState.pdfMonth = mIdx;
  renderPdfPreview();
}

function renderPdfPreview() {
  const container = document.getElementById('pdf-report-document');
  if (!container) return;

  const year = AppState.pdfYear || new Date().getFullYear();
  const month = AppState.pdfMonth !== undefined ? AppState.pdfMonth : new Date().getMonth();
  const monthName = MONTH_NAMES_ID[month];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sunnahCheckbox = document.getElementById('pdf-opt-sunnah');
  const includeSunnah = sunnahCheckbox ? sunnahCheckbox.checked : true;

  const notesCheckbox = document.getElementById('pdf-opt-notes');
  const includeNotes = notesCheckbox ? notesCheckbox.checked : true;

  const sigCheckbox = document.getElementById('pdf-opt-signatures');
  const includeSignatures = sigCheckbox ? sigCheckbox.checked : true;

  let colWidths;
  if (includeSunnah && includeNotes) {
    colWidths = {
      num: '2.5%', date: '7.5%', day: '4%',
      fardhuItem: '7%', sunnahItem: '6%',
      fardhuCount: '6%', sunnahCount: '5%',
      total: '5%', percent: '5%', notes: '12%'
    };
  } else if (includeSunnah && !includeNotes) {
    colWidths = {
      num: '3%', date: '8.5%', day: '4.5%',
      fardhuItem: '8%', sunnahItem: '6.5%',
      fardhuCount: '6.5%', sunnahCount: '6%',
      total: '6%', percent: '6%', notes: '0%'
    };
  } else if (!includeSunnah && includeNotes) {
    colWidths = {
      num: '3%', date: '10%', day: '5%',
      fardhuItem: '10%', sunnahItem: '0%',
      fardhuCount: '7%', sunnahCount: '0%',
      total: '6%', percent: '6%', notes: '13%'
    };
  } else {
    colWidths = {
      num: '4%', date: '12%', day: '8%',
      fardhuItem: '11%', sunnahItem: '0%',
      fardhuCount: '8%', sunnahCount: '0%',
      total: '8%', percent: '5%', notes: '0%'
    };
  }

  // Compute monthly metrics
  const colTotals = {
    subuh: 0, zuhur: 0, asar: 0, magrib: 0, isya: 0,
    dhuha: 0, tahajud: 0, rawatib: 0,
    totalFardhu: 0, totalSunnah: 0, totalAll: 0,
    perfectDays: 0
  };

  const todayStr = getLocalDateStr();
  let rowsHtml = '';

  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = parseLocalDate(dStr);
    const dayOfWeek = DAY_NAMES_SHORT_ID[dateObj.getDay()];
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const isToday = dStr === todayStr;

    const dayRecords = AppState.records.filter(r => r.prayer_date === dStr);
    const recMap = {};
    dayRecords.forEach(r => { recMap[r.prayer_name] = r; });

    let fardhuCount = 0;
    let sunnahCount = 0;

    // Fardhu cells
    const fardhuCellsHtml = FARDHU_PRAYERS.map(pName => {
      const rec = recMap[pName];
      if (rec && rec.status === 'completed') {
        colTotals[pName]++;
        fardhuCount++;
        return '<td class="pdf-cell-check">✓</td>';
      } else if (rec && rec.status === 'not_completed') {
        return '<td class="pdf-cell-cross">✕</td>';
      }
      return '<td class="pdf-cell-dash">-</td>';
    }).join('');

    // Sunnah cells
    let sunnahCellsHtml = '';
    if (includeSunnah) {
      sunnahCellsHtml = SUNNAH_PRAYERS.map(pName => {
        const rec = recMap[pName];
        if (rec && rec.status === 'completed') {
          colTotals[pName]++;
          sunnahCount++;
          return '<td class="pdf-cell-check pdf-cell-sunnah">✓</td>';
        } else if (rec && rec.status === 'not_completed') {
          return '<td class="pdf-cell-cross">✕</td>';
        }
        return '<td class="pdf-cell-dash">-</td>';
      }).join('');
    }

    colTotals.totalFardhu += fardhuCount;
    colTotals.totalSunnah += sunnahCount;
    colTotals.totalAll += (fardhuCount + sunnahCount);
    if (fardhuCount === 5) colTotals.perfectDays++;

    const percentFardhu = Math.round((fardhuCount / 5) * 100);
    const pctClass = percentFardhu === 100 ? 'pct-high' : percentFardhu >= 60 ? 'pct-med' : 'pct-low';

    const totalDayCompleted = fardhuCount + sunnahCount;
    const notesSummary = dayRecords.filter(r => r.notes).map(r => `${PRAYER_SHORT_NAMES[r.prayer_name]}: ${r.notes}`).join('; ');

    rowsHtml += `
      <tr class="${isToday ? 'pdf-today' : isWeekend ? 'pdf-weekend' : ''}">
        <td style="font-weight:600; color:#475569;">${day}</td>
        <td style="white-space:nowrap; font-weight:${isToday ? '700' : '500'};">${day} ${monthName.substring(0, 3)}</td>
        <td style="font-weight:600; color:${isWeekend ? '#dc2626' : '#64748b'};">${dayOfWeek}</td>
        ${fardhuCellsHtml}
        ${sunnahCellsHtml}
        <td style="font-weight:700; color:${fardhuCount === 5 ? '#15803d' : '#0f172a'};">${fardhuCount}/5</td>
        ${includeSunnah ? `<td style="font-weight:700; color:${sunnahCount > 0 ? '#b45309' : '#94a3b8'};">${sunnahCount > 0 ? '+' + sunnahCount : '0'}</td>` : ''}
        <td class="col-pdf-total" style="font-weight:800; color:${totalDayCompleted > 0 ? '#0f766e' : '#94a3b8'}; background:${totalDayCompleted > 0 ? '#f0fdfa' : 'transparent'}; font-size:0.68rem;">${totalDayCompleted}</td>
        <td><span class="pdf-pct-badge ${pctClass}">${percentFardhu}%</span></td>
        ${includeNotes ? `<td class="pdf-cell-notes" title="${escapeHtml(notesSummary)}">${escapeHtml(notesSummary) || '-'}</td>` : ''}
      </tr>
    `;
  }

  // Summary Metrics
  const totalTargetFardhu = daysInMonth * 5;
  const overallFardhuRate = Math.round((colTotals.totalFardhu / totalTargetFardhu) * 100) || 0;
  
  let evalBadge = 'Mumtaz (Sangat Baik)';
  let evalBadgeClass = 'badge-mumtaz';
  if (overallFardhuRate < 60) {
    evalBadge = 'Perlu Ditingkatkan';
    evalBadgeClass = 'badge-perlu-tingkatkan';
  } else if (overallFardhuRate < 85) {
    evalBadge = 'Jayyid (Baik)';
    evalBadgeClass = 'badge-jayyid';
  }

  const nowPrint = new Date();
  const printTimestamp = `${nowPrint.getDate()} ${MONTH_NAMES_ID[nowPrint.getMonth()]} ${nowPrint.getFullYear()}, ${String(nowPrint.getHours()).padStart(2, '0')}:${String(nowPrint.getMinutes()).padStart(2, '0')} WIB`;
  const userName = AppState.profile.display_name || 'Hamba Allah';
  const locationStr = `${AppState.settings.location_name || 'Jakarta'}, ${AppState.settings.country || 'Indonesia'}`;

  container.innerHTML = `
    <!-- Header / Kop Dokumen -->
    <div class="pdf-header">
      <div class="pdf-header-left">
        <div class="pdf-logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="46" height="46" style="display:block;">
            <defs>
              <linearGradient id="pdfLogoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981"/>
                <stop offset="50%" stop-color="#0d9488"/>
                <stop offset="100%" stop-color="#044e42"/>
              </linearGradient>
              <linearGradient id="pdfLogoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fef08a"/>
                <stop offset="50%" stop-color="#f59e0b"/>
                <stop offset="100%" stop-color="#d97706"/>
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#pdfLogoBgGrad)"/>
            <rect x="2" y="2" width="60" height="60" rx="14" fill="none" stroke="#6ee7b7" stroke-width="1.5" stroke-opacity="0.35"/>
            <!-- Hilal Crescent -->
            <path d="M37 11 C33 11 29 13.5 27.5 17.5 C26 21.5 27.2 26 30.5 28.5 C25 28 20.5 23 21 17.5 C17.5 21 16 26.5 17.5 31.5 C19.5 38 25.5 42.5 32.5 42 C38.5 41.5 43.5 37 45 31.5 C46 27.5 44.5 23.5 42 20.5 C40.5 23 37.5 24.5 34.5 24 C31.5 23.5 29.5 21 29.5 18 C29.5 15 32 12.2 35.5 11.8 C36 11.3 36.5 11.1 37 11 Z" fill="url(#pdfLogoGoldGrad)"/>
            <!-- Islamic Star -->
            <path d="M43 14.5 L44.2 16.8 L46.7 17.2 L44.8 18.9 L45.3 21.4 L43 20.1 L40.7 21.4 L41.2 18.9 L39.3 17.2 L41.8 16.8 Z" fill="#ffffff" opacity="0.95"/>
            <!-- Mosque Dome & Arch -->
            <path d="M22 51 L22 41 C22 35 26 31 32 29 C38 31 42 35 42 41 L42 51 Z" fill="#ffffff" fill-opacity="0.2"/>
            <path d="M25 51 L25 42 C25 38 28 34.5 32 33 C36 34.5 39 38 39 42 L39 51 Z" fill="#ffffff" fill-opacity="0.35"/>
            <path d="M28 51 L28 44 C28 41 29.8 38.5 32 37.5 C34.2 38.5 36 41 36 44 L36 51 Z" fill="url(#pdfLogoGoldGrad)"/>
            <circle cx="32" cy="27" r="2" fill="url(#pdfLogoGoldGrad)"/>
            <line x1="32" y1="27" x2="32" y2="30" stroke="url(#pdfLogoGoldGrad)" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="16" y1="51" x2="48" y2="51" stroke="#a7f3d0" stroke-width="2" stroke-linecap="round" stroke-opacity="0.8"/>
          </svg>
        </div>
        <div>
          <h1 class="pdf-doc-title">REKAPITULASI &amp; EVALUASI HASIL SHOLAT</h1>
          <div class="pdf-doc-subtitle">PERSONAL PRAYER TRACKER • CATATAN DISIPLIN IBADAH HARIAN</div>
        </div>
      </div>
      <div class="pdf-header-right">
        <div class="pdf-meta-item"><strong>Nama Pengguna:</strong> <span>${escapeHtml(userName)}</span></div>
        <div class="pdf-meta-item"><strong>Periode Laporan:</strong> <span>${monthName} ${year}</span></div>
        <div class="pdf-meta-item"><strong>Lokasi Waktu:</strong> <span>${escapeHtml(locationStr)}</span></div>
        <div class="pdf-meta-item"><strong>Tanggal Cetak:</strong> <span>${printTimestamp}</span></div>
      </div>
    </div>

    <!-- Islamic Quote / Hadith Bar -->
    <div class="pdf-hadith-bar">
      <em>"Amalan hamba yang pertama kali dihisab pada hari kiamat adalah sholat. Jika sholatnya baik, maka sungguh ia telah beruntung dan berhasil."</em> (HR. Tirmidzi &amp; An-Nasa'i)
    </div>

    <!-- KPI / Scorecards Ringkasan Hasil Ibadah -->
    <div class="pdf-kpi-grid">
      <div class="pdf-kpi-card">
        <div class="pdf-kpi-label">Disiplin Sholat Wajib</div>
        <div class="pdf-kpi-value" style="color:#0f766e;">${overallFardhuRate}%</div>
        <div class="pdf-kpi-badge ${evalBadgeClass}">${evalBadge}</div>
      </div>
      <div class="pdf-kpi-card">
        <div class="pdf-kpi-label">Sholat Fardhu Terlaksana</div>
        <div class="pdf-kpi-value" style="color:#15803d;">${colTotals.totalFardhu} <span style="font-size:0.85rem; font-weight:600; color:#64748b;">/ ${totalTargetFardhu}</span></div>
        <div class="pdf-kpi-sub">Kewajiban 5 Waktu Subuh s/d Isya</div>
      </div>
      <div class="pdf-kpi-card">
        <div class="pdf-kpi-label">Amalan Sholat Sunnah</div>
        <div class="pdf-kpi-value" style="color:#b45309;">${colTotals.totalSunnah}</div>
        <div class="pdf-kpi-sub">Dhuha, Tahajud &amp; Sunnah Rawatib</div>
      </div>
      <div class="pdf-kpi-card">
        <div class="pdf-kpi-label">Hari Tertib 5 Waktu</div>
        <div class="pdf-kpi-value" style="color:#0f172a;">${colTotals.perfectDays} <span style="font-size:0.85rem; font-weight:600; color:#64748b;">/ ${daysInMonth} Hari</span></div>
        <div class="pdf-kpi-sub">Hari dengan 5/5 Fardhu Komplit</div>
      </div>
    </div>

    <!-- Mini Breakdown Bar -->
    <div class="pdf-prayer-breakdown">
      <div class="pdf-breakdown-pill"><span>🌅 Subuh:</span> <strong>${colTotals.subuh}/${daysInMonth}</strong></div>
      <div class="pdf-breakdown-pill"><span>☀️ Zuhur:</span> <strong>${colTotals.zuhur}/${daysInMonth}</strong></div>
      <div class="pdf-breakdown-pill"><span>🌤️ Asar:</span> <strong>${colTotals.asar}/${daysInMonth}</strong></div>
      <div class="pdf-breakdown-pill"><span>🌇 Magrib:</span> <strong>${colTotals.magrib}/${daysInMonth}</strong></div>
      <div class="pdf-breakdown-pill"><span>🌙 Isya:</span> <strong>${colTotals.isya}/${daysInMonth}</strong></div>
      ${includeSunnah ? `
        <div class="pdf-breakdown-pill" style="color:#b45309;"><span>☀️ Dhuha:</span> <strong>${colTotals.dhuha}x</strong></div>
        <div class="pdf-breakdown-pill" style="color:#b45309;"><span>🌌 Tahajud:</span> <strong>${colTotals.tahajud}x</strong></div>
        <div class="pdf-breakdown-pill" style="color:#b45309;"><span>✨ Rawatib:</span> <strong>${colTotals.rawatib}x</strong></div>
      ` : ''}
    </div>

    <!-- Tabel Matriks Hasil Absensi Sholat -->
    <table class="pdf-table">
      <thead>
        <tr>
          <th rowspan="2" style="width:${colWidths.num};">#</th>
          <th rowspan="2" style="width:${colWidths.date};">Tanggal</th>
          <th rowspan="2" style="width:${colWidths.day};">Hari</th>
          <th colspan="5" class="th-fardhu">SHOLAT FARDHU (5 WAKTU UTAMA)</th>
          ${includeSunnah ? '<th colspan="3" class="th-sunnah">SHOLAT SUNNAH</th>' : ''}
          <th rowspan="2" style="width:${colWidths.fardhuCount};">Fardhu (x/5)</th>
          ${includeSunnah ? `<th rowspan="2" style="width:${colWidths.sunnahCount};">Sunnah</th>` : ''}
          <th rowspan="2" style="width:${colWidths.total}; background:#0d9488 !important; color:#ffffff !important; font-weight:800;">Total</th>
          <th rowspan="2" style="width:${colWidths.percent};">% Disiplin</th>
          ${includeNotes ? `<th rowspan="2" style="width:${colWidths.notes};">Catatan Harian</th>` : ''}
        </tr>
        <tr>
          <th style="background:#115e59; width:${colWidths.fardhuItem};">Subuh</th>
          <th style="background:#115e59; width:${colWidths.fardhuItem};">Zuhur</th>
          <th style="background:#115e59; width:${colWidths.fardhuItem};">Asar</th>
          <th style="background:#115e59; width:${colWidths.fardhuItem};">Magrib</th>
          <th style="background:#115e59; width:${colWidths.fardhuItem};">Isya</th>
          ${includeSunnah ? `
            <th style="background:#92400e; width:${colWidths.sunnahItem};">Dhuha</th>
            <th style="background:#92400e; width:${colWidths.sunnahItem};">Tahajud</th>
            <th style="background:#92400e; width:${colWidths.sunnahItem};">Rawatib</th>
          ` : ''}
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr class="pdf-tfoot-row">
          <td style="font-weight:900; color:#0f766e;">Σ</td>
          <td colspan="2" style="font-weight:800; color:#0f766e; text-align:center; letter-spacing:0.3px;">TOTAL BULAN INI</td>
          <td style="font-weight:800; color:#0f766e;">${colTotals.subuh}</td>
          <td style="font-weight:800; color:#0f766e;">${colTotals.zuhur}</td>
          <td style="font-weight:800; color:#0f766e;">${colTotals.asar}</td>
          <td style="font-weight:800; color:#0f766e;">${colTotals.magrib}</td>
          <td style="font-weight:800; color:#0f766e;">${colTotals.isya}</td>
          ${includeSunnah ? `
            <td style="font-weight:800; color:#b45309;">${colTotals.dhuha}</td>
            <td style="font-weight:800; color:#b45309;">${colTotals.tahajud}</td>
            <td style="font-weight:800; color:#b45309;">${colTotals.rawatib}</td>
          ` : ''}
          <td style="font-weight:900; color:#15803d; background:#dcfce7 !important; font-size:0.72rem;">${colTotals.totalFardhu}</td>
          ${includeSunnah ? `<td style="font-weight:900; color:#b45309; background:#fef3c7 !important; font-size:0.72rem;">+${colTotals.totalSunnah}</td>` : ''}
          <td class="col-pdf-grand-total" style="font-weight:900; color:#044e42; background:#a7f3d0 !important; font-size:0.76rem; border:1.5px solid #059669 !important;">${colTotals.totalAll}</td>
          <td style="font-weight:900; color:#0f766e; background:#f0fdf4 !important; font-size:0.72rem;">${overallFardhuRate}%</td>
          ${includeNotes ? `<td style="font-size:0.6rem; color:#64748b; font-weight:600; text-align:center;">${colTotals.totalFardhu}/${daysInMonth * 5} Wajib</td>` : ''}
        </tr>
      </tfoot>
    </table>

    <!-- Signature / Lembar Pengesahan -->
    ${includeSignatures ? `
      <div class="pdf-signature-area">
        <div class="pdf-sig-box">
          <div class="pdf-sig-role">Pemilik Catatan / Yang Bersangkutan</div>
          <div class="pdf-sig-line"></div>
          <div class="pdf-sig-name">${escapeHtml(userName)}</div>
        </div>
        <div style="font-size:0.68rem; color:#94a3b8; text-align:center; max-width:320px; line-height:1.4;">
          <em>"Maka dirikanlah sholat itu (sebagaimana biasa). Sungguh, sholat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman." (QS. An-Nisa: 103)</em>
        </div>
        <div class="pdf-sig-box">
          <div class="pdf-sig-role">Mengetahui / Pembimbing / Orang Tua</div>
          <div class="pdf-sig-line"></div>
          <div class="pdf-sig-name">( .................................................... )</div>
        </div>
      </div>
    ` : ''}

    <div class="pdf-footer-note">
      Dokumen Laporan Resmi • Dihasilkan otomatis oleh Personal Prayer Tracker pada ${printTimestamp}
    </div>
  `;
}

function downloadPdfReport() {
  const element = document.getElementById('pdf-report-document');
  if (!element) return;

  const btn = document.getElementById('btn-do-pdf-download');
  const btnText = document.getElementById('text-do-pdf-download');
  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Menyusun Dokumen PDF...';

  showLocationToast('Sedang membuat file PDF berkualitas tinggi...', 'loading');

  const year = AppState.pdfYear || new Date().getFullYear();
  const month = AppState.pdfMonth !== undefined ? AppState.pdfMonth : new Date().getMonth();
  const monthName = MONTH_NAMES_ID[month];
  const filename = `Laporan_Hasil_Absensi_Sholat_${monthName}_${year}.pdf`;

  const resetBtn = () => {
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = 'Unduh File PDF (.pdf)';
  };

  if (typeof html2pdf !== 'undefined') {
    const opt = {
      margin: [2, 3, 2, 3],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save()
      .then(() => {
        showLocationToast('✓ Dokumen PDF berhasil diunduh ke perangkat Anda!', 'success');
        resetBtn();
      })
      .catch((err) => {
        console.error('Error html2pdf:', err);
        showLocationToast('Mengalihkan ke dialog Simpan PDF browser...', 'loading');
        setTimeout(() => {
          printPdfReport();
          resetBtn();
        }, 600);
      });
  } else {
    // Fallback directly to print window
    showLocationToast('Membuka dialog Simpan PDF browser...', 'loading');
    setTimeout(() => {
      printPdfReport();
      resetBtn();
    }, 400);
  }
}

function printPdfReport() {
  window.print();
}

// --- EXPORT & BACKUP (EXCEL CSV / JSON) ---
function exportData(format = 'csv') {
  if (format === 'json') {
    const data = {
      app: 'Personal Prayer Tracker',
      version: '1.2',
      exported_at: new Date().toISOString(),
      profile: AppState.profile,
      settings: AppState.settings,
      records: AppState.records,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `prayer_tracker_backup_${getLocalDateStr()}.json`);
  } else {
    // Excel Spreadsheet CSV format with both Fardhu and Sunnah
    const headers = [
      'Tanggal',
      'Hari',
      'Subuh',
      'Zuhur',
      'Asar',
      'Magrib',
      'Isya',
      'Dhuha',
      'Tahajud',
      'Rawatib',
      'Rakaat Sunnah',
      'Catatan'
    ];

    // Group records by date
    const dateMap = {};
    AppState.records.forEach(r => {
      if (!dateMap[r.prayer_date]) dateMap[r.prayer_date] = {};
      dateMap[r.prayer_date][r.prayer_name] = r;
    });

    const dates = Object.keys(dateMap).sort();
    const rows = dates.map(dStr => {
      const dObj = parseLocalDate(dStr);
      const dayName = DAY_NAMES_ID[dObj.getDay()];
      const dayRecs = dateMap[dStr];

      const getVal = (name) => {
        const r = dayRecs[name];
        if (!r) return '-';
        if (r.status === 'completed') return r.completed_at ? `✓ (${r.completed_at})` : '✓';
        return '✕';
      };

      const sunnahRakaatTotal = (dayRecs['dhuha']?.rakaat || 0) + (dayRecs['tahajud']?.rakaat || 0) + (dayRecs['rawatib']?.rakaat || 0);
      const notesCombined = Object.values(dayRecs).filter(r => r.notes).map(r => `${PRAYER_SHORT_NAMES[r.prayer_name]}: ${r.notes}`).join('; ');

      return [
        dStr,
        dayName,
        getVal('subuh'),
        getVal('zuhur'),
        getVal('asar'),
        getVal('magrib'),
        getVal('isya'),
        getVal('dhuha'),
        getVal('tahajud'),
        getVal('rawatib'),
        sunnahRakaatTotal > 0 ? `${sunnahRakaatTotal} Rakaat` : '-',
        `"${notesCombined.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `Tabel_Absensi_Sholat_${getLocalDateStr()}.csv`);
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- MASTER RENDER ---
function renderAll() {
  updateDashboardDateUI();
  renderHeaderAndGreeting();
  renderDailyProgress();
  renderPrayerCards();

  if (AppState.activeTab === 'excel') renderExcelTable();
  if (AppState.activeTab === 'history') renderCalendar();
  if (AppState.activeTab === 'statistics') renderStatistics();
  if (AppState.activeTab === 'schedule') renderScheduleTab();
  if (AppState.activeTab === 'reminders') renderReminderTab();
}

function populateCitySelect() {
  const citySelect = document.getElementById('setting-city-select');
  if (!citySelect) return;

  const currentLoc = (AppState.settings.location_name || '').toLowerCase();
  const currentCountry = (AppState.settings.country || 'Indonesia').toLowerCase();

  const regions = [
    { label: '🇮🇩 Indonesia', filter: c => c.country === 'Indonesia' },
    { label: '🇸🇦 Arab Saudi (Umrah & Haji)', filter: c => c.country === 'Arab Saudi' },
    { label: '🇲🇾 Malaysia, Singapura, Brunei', filter: c => ['Malaysia', 'Singapura', 'Brunei Darussalam'].includes(c.country) },
    { label: '🇹🇷 Timur Tengah & Afrika Utara', filter: c => ['Uni Emirat Arab', 'Qatar', 'Turki', 'Mesir'].includes(c.country) },
    { label: '🇯🇵 Asia Timur, Tenggara & Pasifik', filter: c => ['Jepang', 'Korea Selatan', 'Thailand', 'Australia'].includes(c.country) },
    { label: '🇬🇧 Eropa & Amerika Serikat', filter: c => ['Inggris (UK)', 'Prancis', 'Jerman', 'Belanda', 'Amerika Serikat'].includes(c.country) },
  ];

  let html = '';
  regions.forEach(reg => {
    const list = LOCATION_PRESETS.filter(reg.filter);
    html += `<optgroup label="${reg.label}">`;
    list.forEach(c => {
      const isSel = c.name.toLowerCase() === currentLoc && (!c.country || c.country.toLowerCase() === currentCountry);
      const provStr = c.province ? ` - ${c.province}` : '';
      html += `<option value="${c.name}" data-country="${c.country}" data-method="${c.method || ''}" ${isSel ? 'selected' : ''}>${c.name} (${c.country}${provStr})</option>`;
    });
    html += `</optgroup>`;
  });

  // If current location is not in presets (e.g. custom or auto-detected location)
  const isPreset = LOCATION_PRESETS.some(c => c.name.toLowerCase() === currentLoc);
  if (!isPreset && AppState.settings.location_name) {
    const countryStr = AppState.settings.country ? ` (${AppState.settings.country})` : '';
    html = `<optgroup label="📍 Lokasi Terdeteksi / Kustom"><option value="${AppState.settings.location_name}" data-country="${AppState.settings.country || ''}" selected>📍 ${AppState.settings.location_name}${countryStr}</option></optgroup>` + html;
  }

  html += `<optgroup label="🔍 Pencarian Bebas"><option value="custom">🔍 Cari / Ketik Kota &amp; Negara Lainnya di Dunia...</option></optgroup>`;

  citySelect.innerHTML = html;
}

function handleCitySelectChange(val) {
  const customBox = document.getElementById('setting-custom-city-box');
  const methodSelect = document.getElementById('setting-method-select');

  if (val === 'custom') {
    if (customBox) {
      customBox.style.display = 'block';
      const input = document.getElementById('input-custom-city');
      if (input) input.focus();
    }
    return;
  }

  if (customBox) customBox.style.display = 'none';

  const found = LOCATION_PRESETS.find(c => c.name.toLowerCase() === val.toLowerCase());
  if (found) {
    if (found.method && methodSelect) {
      methodSelect.value = found.method;
    }
  }
}

async function searchAndApplyCustomLocation() {
  const cityInput = document.getElementById('input-custom-city');
  const countryInput = document.getElementById('input-custom-country');
  const statusEl = document.getElementById('custom-search-status');
  if (!cityInput || !cityInput.value.trim()) {
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#ef4444';
      statusEl.textContent = 'Harap isi nama kota yang dicari.';
    }
    return;
  }

  const queryCity = cityInput.value.trim();
  const queryCountry = countryInput ? countryInput.value.trim() : '';
  const fullQuery = queryCountry ? `${queryCity}, ${queryCountry}` : queryCity;

  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.color = 'var(--brand-700)';
    statusEl.textContent = `Sedang mencari koordinat ${fullQuery}...`;
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&limit=1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || data.length === 0) {
      // Fallback: try querying Aladhan API directly
      const aladhanRes = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(queryCity)}&country=${encodeURIComponent(queryCountry || queryCity)}&method=3`);
      if (aladhanRes.ok) {
        const alData = await aladhanRes.json();
        if (alData.data && alData.data.meta) {
          const lat = alData.data.meta.latitude;
          const lng = alData.data.meta.longitude;
          const tz = alData.data.meta.timezone;
          applyCustomLocationSuccess(queryCity, queryCountry || 'Internasional', lat, lng, tz);
          return;
        }
      }
      throw new Error('Kota tidak ditemukan');
    }

    const item = data[0];
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const parts = (item.display_name || '').split(',').map(s => s.trim());
    const detectedCountry = queryCountry || parts[parts.length - 1] || 'Internasional';
    applyCustomLocationSuccess(queryCity, detectedCountry, lat, lng, null);
  } catch (err) {
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#ef4444';
      statusEl.textContent = `Pencarian gagal: ${err.message}. Periksa ejaan atau koneksi internet.`;
    }
  }
}

function applyCustomLocationSuccess(city, country, lat, lng, timezone) {
  AppState.settings.location_name = city;
  AppState.settings.country = country;
  AppState.settings.province = null;
  AppState.settings.latitude = lat;
  AppState.settings.longitude = lng;
  AppState.settings.calculation_method = recommendMethodForCountry(country);
  if (timezone) AppState.profile.timezone = timezone;

  saveLocalData();
  populateCitySelect();

  const citySelect = document.getElementById('setting-city-select');
  if (citySelect) citySelect.value = city;
  const customBox = document.getElementById('setting-custom-city-box');
  if (customBox) customBox.style.display = 'none';

  const modal = document.getElementById('modal-settings');
  if (modal) modal.style.display = 'none';

  fetchSchedule();
  renderAll();
  showLocationToast(`✓ Berhasil menerapkan lokasi: ${city}, ${country}`, 'success');
}

// --- INITIALIZATION ---
function initApp() {
  loadLocalData();
  populateCitySelect();

  // Populate Excel month selector
  const excelMonthSelect = document.getElementById('excel-month-select');
  if (excelMonthSelect) {
    excelMonthSelect.innerHTML = MONTH_NAMES_ID.map((name, idx) => 
      `<option value="${idx}" ${idx === AppState.excelMonth ? 'selected' : ''}>${name} ${AppState.excelYear}</option>`
    ).join('');
  }

  // Check banner dismissal
  if (localStorage.getItem('hide_supabase_banner') === 'true') {
    const b = document.getElementById('supabase-status-banner');
    if (b) b.style.display = 'none';
  }

  fetchSchedule();

  setInterval(() => {
    const next = getNextPrayerInfo();
    const countEl = document.getElementById('next-prayer-countdown');
    if (countEl) {
      countEl.textContent = next.isToday 
        ? `Hitung mundur: ${next.countdown}`
        : `Menuju Subuh • ${next.countdown}`;
    }
    checkReminders();
  }, 1000);

  // Close modals when clicking backdrop overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  });

  renderAll();
}

// --- EXPOSE GLOBAL METHODS TO WINDOW ---
window.app = {
  dismissSupabaseBanner: () => {
    localStorage.setItem('hide_supabase_banner', 'true');
    const b = document.getElementById('supabase-status-banner');
    if (b) b.style.display = 'none';
  },
  switchTab,
  changeDashboardDate,
  navigateDashboardDate,
  resetDashboardDateToToday,
  changeModalDate,
  setModalDateToToday,
  openRecordModal,
  closeRecordModal,
  selectModalStatus,
  saveRecordFromModal,
  deleteCurrentRecord,
  quickFillAll,
  quickToggleExcelCell,
  updateExcelFormulaBar,
  changeExcelMonth: (monthVal) => {
    AppState.excelMonth = Number(monthVal);
    renderExcelTable();
  },
  toggleExcelWide: () => {
    const mainContainer = document.querySelector('main');
    const textEl = document.getElementById('text-toggle-excel-wide');
    if (!mainContainer) return;

    if (mainContainer.classList.contains('main-fullscreen')) {
      mainContainer.classList.remove('main-fullscreen');
      mainContainer.classList.add('main-wide');
      if (textEl) textEl.textContent = 'Mode Layar Penuh (100%)';
    } else {
      mainContainer.classList.add('main-fullscreen');
      if (textEl) textEl.textContent = 'Mode Standar Lebar';
    }
  },
  selectCalendarDate: (dStr) => {
    AppState.selectedDateStr = dStr;
    renderCalendar();
  },
  prevCalendarMonth: () => {
    AppState.calendarMonth--;
    if (AppState.calendarMonth < 0) {
      AppState.calendarMonth = 11;
      AppState.calendarYear--;
    }
    renderCalendar();
  },
  nextCalendarMonth: () => {
    AppState.calendarMonth++;
    if (AppState.calendarMonth > 11) {
      AppState.calendarMonth = 0;
      AppState.calendarYear++;
    }
    renderCalendar();
  },
  setStatsPeriod: (period) => {
    AppState.statsPeriod = period;
    document.querySelectorAll('.stat-period-btn').forEach(b => {
      if (b.getAttribute('data-period') === period) b.classList.add('active');
      else b.classList.remove('active');
    });
    renderStatistics();
  },
  toggleReminder: (prayerName, enabled) => {
    const pref = AppState.reminders.find(r => r.prayer_name === prayerName);
    if (pref) pref.enabled = enabled;
    saveLocalData();
    renderReminderTab();
  },
  updateReminderMinutes: (prayerName, mins) => {
    const pref = AppState.reminders.find(r => r.prayer_name === prayerName);
    if (pref) pref.minutes_before = Number(mins);
    saveLocalData();
    renderReminderTab();
  },
  requestNotifPermission: async () => {
    if (!('Notification' in window)) {
      alert('Perangkat/browser Anda tidak mendukung Web Notifications.');
      return;
    }
    const res = await Notification.requestPermission();
    renderReminderTab();
    if (res === 'granted') {
      new Notification('Personal Prayer Tracker', {
        body: 'Notifikasi sholat berhasil diaktifkan!',
      });
      playSereneChime();
    }
  },
  testNotification: () => {
    playSereneChime();
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Uji Coba Pengingat Sholat', {
        body: 'Alhamdulillah, pengingat sholat dan nada notifikasi berfungsi dengan baik.',
      });
    } else {
      alert('Suara lonceng tenang berhasil dimainkan! Untuk menampilkan notifikasi pop-up browser, klik "Minta Izin Notifikasi" di atas.');
    }
  },
  openSettingsModal: () => {
    const nameInput = document.getElementById('setting-display-name');
    const citySelect = document.getElementById('setting-city-select');
    const methodSelect = document.getElementById('setting-method-select');
    const asrSelect = document.getElementById('setting-asr-select');
    const customBox = document.getElementById('setting-custom-city-box');

    if (customBox) customBox.style.display = 'none';
    if (nameInput) nameInput.value = AppState.profile.display_name || '';
    
    populateCitySelect();

    if (citySelect) {
      citySelect.value = AppState.settings.location_name || 'Jakarta';
    }
    if (methodSelect) methodSelect.value = AppState.settings.calculation_method || 'KEMENAG';
    if (asrSelect) asrSelect.value = AppState.settings.asr_method || 'STANDARD';

    const modal = document.getElementById('modal-settings');
    if (modal) modal.style.display = 'flex';
  },
  handleCitySelectChange,
  searchAndApplyCustomLocation,
  saveSettingsModal: async () => {
    const nameInput = document.getElementById('setting-display-name').value.trim();
    const citySelect = document.getElementById('setting-city-select');
    const cityInput = citySelect ? citySelect.value : '';
    const methodInput = document.getElementById('setting-method-select').value;
    const asrInput = document.getElementById('setting-asr-select').value;

    if (nameInput) {
      AppState.profile.display_name = nameInput;
      if (nameInput.toLowerCase().includes('harits')) {
        localStorage.setItem('ppt_is_owner', 'true');
      }
    }

    if (cityInput && cityInput !== 'custom') {
      AppState.settings.location_name = cityInput;
      const foundCity = LOCATION_PRESETS.find(c => c.name.toLowerCase() === cityInput.toLowerCase());
      if (foundCity) {
        AppState.settings.latitude = foundCity.lat;
        AppState.settings.longitude = foundCity.lng;
        AppState.settings.province = foundCity.province;
        AppState.settings.country = foundCity.country;
        if (foundCity.timezone) AppState.profile.timezone = foundCity.timezone;
      }
    }

    AppState.settings.calculation_method = methodInput;
    AppState.settings.asr_method = asrInput;

    saveLocalData();
    document.getElementById('modal-settings').style.display = 'none';

    await fetchSchedule();
    renderAll();
    showLocationToast(`✓ Pengaturan disimpan: ${AppState.settings.location_name}, ${AppState.settings.country}`, 'success');
  },
  useGeolocation: async () => {
    showLocationToast('Sedang mendeteksi lokasi dan negara Anda...', 'loading');

    const applyLocation = async (cityName, countryName, lat, lng, tz) => {
      AppState.settings.location_name = cityName;
      AppState.settings.country = countryName;
      AppState.settings.province = null;
      AppState.settings.latitude = lat;
      AppState.settings.longitude = lng;
      if (tz) AppState.profile.timezone = tz;
      AppState.settings.calculation_method = recommendMethodForCountry(countryName);

      saveLocalData();
      populateCitySelect();
      await fetchSchedule();
      renderAll();

      showLocationToast(`✓ Lokasi berhasil disesuaikan: ${cityName}, ${countryName}`, 'success');
    };

    // 1. Try HTML5 Geolocation (high accuracy with 3.5s timeout)
    let gpsWorked = false;
    if (navigator.geolocation && window.isSecureContext !== false) {
      try {
        const pos = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('GPS timeout')), 3500);
          navigator.geolocation.getCurrentPosition(
            p => { clearTimeout(timer); resolve(p); },
            e => { clearTimeout(timer); reject(e); },
            { timeout: 3500, enableHighAccuracy: true, maximumAge: 60000 }
          );
        });

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Reverse geocode to get City and Country
        try {
          const rev = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
          if (rev.ok) {
            const rData = await rev.json();
            const city = rData.city || rData.locality || rData.principalSubdivision || 'Lokasi Saya';
            const country = rData.countryName || 'Internasional';
            await applyLocation(city, country, lat, lng, null);
            gpsWorked = true;
            return;
          }
        } catch (revErr) {
          console.warn('Reverse geocode error, continuing to IP lookup', revErr);
        }
      } catch (gpsErr) {
        console.warn('HTML5 Geolocation unavailable or blocked on origin, falling back to IP detection', gpsErr);
      }
    }

    // 2. Seamless IP Geolocation Fallback (Works 100% reliably on file:/// protocol and desktop browsers)
    if (!gpsWorked) {
      try {
        const ipRes = await fetch('https://ipwho.is/');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.success !== false && ipData.city) {
            const city = ipData.city;
            const country = ipData.country;
            const lat = ipData.latitude;
            const lng = ipData.longitude;
            const tz = ipData.timezone?.id || 'Asia/Jakarta';
            await applyLocation(city, country, lat, lng, tz);
            return;
          }
        }
      } catch (e1) {
        console.warn('ipwho.is failed, trying ipapi.co', e1);
      }

      try {
        const ipRes2 = await fetch('https://ipapi.co/json/');
        if (ipRes2.ok) {
          const ipData2 = await ipRes2.json();
          if (ipData2.city) {
            const city = ipData2.city;
            const country = ipData2.country_name || 'Internasional';
            const lat = ipData2.latitude;
            const lng = ipData2.longitude;
            const tz = ipData2.timezone || 'Asia/Jakarta';
            await applyLocation(city, country, lat, lng, tz);
            return;
          }
        }
      } catch (e2) {
        console.warn('ipapi.co fallback failed', e2);
      }

      showLocationToast('Tidak dapat mendeteksi jaringan/lokasi otomatis. Silakan pilih negara & kota di menu Pengaturan.', 'error');
    }
  },
  exportData,
  clearUserRecords,
  loadMasterRecords,
  triggerImportJson,
  handleImportJsonFile,
  openPdfExportModal,
  closePdfExportModal,
  changePdfPeriod,
  renderPdfPreview,
  downloadPdfReport,
  printPdfReport,
};

// Run when DOM ready
document.addEventListener('DOMContentLoaded', initApp);
