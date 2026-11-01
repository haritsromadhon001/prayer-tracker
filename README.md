# Personal Prayer Tracker — Website Absensi Sholat Pribadi

Aplikasi web modern, responsif, dan elegan untuk mencatat absensi sholat lima waktu pribadi dan sholat sunnah, memantau konsistensi ibadah harian, melihat tabel rekap model spreadsheet Excel, melihat jadwal sholat akurat, serta mengatur pengingat sholat.

Dibangun dengan standar profesional untuk penggunaan harian di desktop, laptop, tablet, dan smartphone.

---

## 🌟 Fitur Utama yang Tersedia

### 1. Absensi Sholat Fardhu & Sholat Sunnah Pilihan
- **Lima Waktu Sholat Fardhu**: Subuh, Zuhur, Asar, Magrib, dan Isya.
- **Sholat Sunnah Muakkad**:
  - **Sunnah Rawatib**: Pengiring sholat fardhu dengan rincian checklist otomatis:
    - 2 Rakaat Qobliyah Subuh
    - 2/4 Rakaat Qobliyah Zuhur
    - 2 Rakaat Ba'diyah Zuhur
    - 2 Rakaat Ba'diyah Magrib
    - 2 Rakaat Ba'diyah Isya
  - **Sholat Tahajud / Qiyamul Lail**: Dilengkapi pilihan jumlah rakaat (2, 4, 6, 8, 11 rakaat witir).
  - **Sholat Dhuha**: Sholat pembuka rezeki di pagi hari dengan pilihan rakaat (2, 4, 6, 8 rakaat).
- **Status Pelaksanaan**:
  - `completed` (✓ Sudah dilaksanakan).
  - `not_completed` (✕ Secara eksplisit ditandai tidak dilaksanakan).
  - *Belum dicatat* (`-`, tidak diasumsikan sebagai lalai atau meninggalkan).

### 2. Tabel Rekap Model Excel (Spreadsheet Matriks)
- **Desain Otentik Microsoft Excel**:
  - Bilah pita hijau khas Excel (*Green Ribbon Bar*).
  - *Excel Formula Bar* (`fx`) yang menampilkan koordinat sel aktif dan rincian catatan sholat saat kursor diarahkan ke sel.
  - Header kolom dan kolom tanggal yang tetap beku (*sticky frozen header & date column*) saat menggulir tabel.
- **Interaktivitas Sel**:
  - **Klik Cepat 1x**: Berubah menjadi ✓ (Terlaksana).
  - **Klik Cepat 2x**: Berubah menjadi ✕ (Tidak Terlaksana).
  - **Klik Cepat 3x**: Reset menjadi `-` (Belum Dicatat).
  - **Klik Ganda / Edit**: Membuka dialog modal lengkap dengan jam, rakaat, ketepatan waktu, dan catatan.
- **Ringkasan Baris Bawah (Footer Sum Row)**:
  - Total pelaksanaan per kolom untuk Subuh, Zuhur, Asar, Magrib, Isya, Dhuha, Tahajud, dan Rawatib.
  - Rata-rata persentase penyelesaian bulanan.
- **Pemilih Bulan**: Beralih melihat rekap spreadsheet bulan apa pun dalam setahun.
- **Unduh Laporan PDF**: Tombol unduh laporan rekapitulasi dan evaluasi hasil sholat dalam format PDF lengkap dengan indikator hasil dan logo resmi.

### 3. Dashboard & Hitung Mundur Sholat
- Sapaan cerdas sesuai waktu lokal (*Selamat Pagi, Siang, Sore, Malam*).
- Tanggal lengkap Bahasa Indonesia tanpa pergeseran zona waktu UTC.
- Hitung mundur sholat berikutnya (*live countdown* per detik).
- Bilah progres harian (*progress bar* fardhu & sunnah).

### 4. Riwayat & Kalender Bulanan
- Kalender bulanan dengan dot indikator warna hijau dan merah.
- Detail harian lengkap dengan tombol *"Tandai 5 Fardhu Selesai"*.

### 5. Statistik & Analisis Ibadah
- Filter periode 7 Hari, 30 Hari, dan Bulan Ini.
- Formula eksak kelengkapan pencatatan dan tingkat penyelesaian (tanpa mendistorsi sholat yang belum dicatat).
- Grafik tren batang SVG responsif.

### 6. Jadwal Waktu Sholat Akurat (Kemenag RI)
- Terintegrasi langsung dengan endpoint Aladhan API menggunakan metode Kemenag RI.
- Dilengkapi estimasi waktu terbit (syuruq), awal waktu Dhuha, dan sepertiga malam terakhir (Tahajud).
- Fitur GPS geolokasi perangkat dan pemilih kota-kota di Indonesia.

### 7. Pengingat & Nada Lonceng Tenang
- Saklar pengingat per waktu sholat.
- Web Audio API *Harmonious Serene Chime* (528 Hz) tanpa dependensi file eksternal.
- Notifikasi browser pop-up.

---

## 🛠️ Struktur File Proyek

```
Website_Absensi Sholat/
├── index.html                  # Halaman web utama (Dashboard, Tabel Excel, Kalender, Statistik, Jadwal, Pengingat)
├── styles.css                  # Desain sistem CSS modern & styling spreadsheet Excel
├── app.js                      # Mesin logika aplikasi utama (Fardhu, Sunnah, Excel Matrix Engine)
├── server.js                   # Node development server
├── test_suite.js               # Pengujian otomatis logika tanggal, statistik, sunnah, & formula Excel
├── package.json                # Konfigurasi dependensi
├── .env.example                # Template konfigurasi Supabase
├── supabase/
│   └── migrations/
│       ├── 20261026000001_initial_schema.sql  # Skema awal PostgreSQL & RLS
│       └── 20261026000002_add_sunnah_prayers.sql # Migrasi penambahan Sholat Sunnah
└── src/                        # Modul TypeScript & React
```

---

## 🚀 Cara Menjalankan & Menggunakan

1. Server lokal saat ini sudah aktif di:
   ```
   http://127.0.0.1:5173/
   ```
2. Buka URL di browser untuk mengakses aplikasi.
3. Klik tab **"Tabel Excel"** pada navigasi atas atau bilah bawah smartphone untuk membuka tampilan spreadsheet rekap bulanan.
4. Anda dapat langsung mengklik sel mana saja pada tabel untuk mencatat pelaksanaan sholat, atau membuka modal untuk mengisi rakaat dan catatan.
