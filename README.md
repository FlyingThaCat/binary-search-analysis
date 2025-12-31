# Binary Search Analysis

Aplikasi web interaktif untuk menganalisis dan membandingkan performa algoritma Binary Search (Iteratif vs Rekursif) pada suatu array besar, dan disertai dengan visualisasi langkah, statistik waktu eksekusi, dan penggunaan memori.

## Fitur Utama

- **Visualisasi Langkah Binary Search**: Lihat setiap langkah pencarian secara visual, baik iteratif maupun rekursif.
- **Analisis Kompleksitas**: Penjelasan O(log n) dan perbandingan best/average/worst case.
- **Pengujian Performa**: Jalankan benchmark pada array hingga 100 juta elemen, lalu bandingkan waktu dan efisiensi.
- **Statistik Lengkap**: Tampilkan waktu rata-rata, deviasi standar, efisiensi, dan penggunaan memori.
- **Backend Go**: Semua perhitungan berat dilakukan di backend Go untuk performa maksimal dan responsibility.
- **UI**: Dibangun dengan Vite, React, TailwindCSS, dan Framer Motion.

## Cara Menjalankan

### 1. Jalankan Backend (Go)

```bash
cd backend
go mod download
go run main.go
```

Server Go akan berjalan di `http://localhost:5353`

### 2. Jalankan Frontend (React)

```bash
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (port lain jika bentrok)

### 3. Akses Aplikasi

Buka browser ke `http://localhost:5173` 

## Tech Stack

- **Frontend**:
  - React (Vite)
  - TypeScript
  - TailwindCSS
  - Framer Motion
  - Recharts (visualisasi grafik)
- **Backend**:
  - Go (Golang)
  - Gorilla Mux (router)
  - Gorilla Handlers (CORS)
- **Lainnya**:
  - concurrently (untuk dev script paralel)

## API Endpoint (Backend Go)

- `POST /api/search/iterative` — Binary search iteratif
- `POST /api/search/recursive` — Binary search rekursif
- `POST /api/performance` — Benchmark performa berbagai ukuran array
- `POST /api/generate-array` — Generate array terurut
- `GET /health` — Cek status backend

## Struktur Folder

```
.
├── backend/         # Backend Go API
│   ├── main.go
│   └── ...
├── src/             # Frontend React
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── ...
├── public/
├── package.json
├── README.md
└── ...
```

## Lisensi

MIT
