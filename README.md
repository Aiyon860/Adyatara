# ADYATARA

**Platform Cerita Rakyat Indonesia Interaktif**

Jelajahi kekayaan budaya Indonesia melalui cerita interaktif yang memukau. Buat pilihan, temukan hikmah, dan lestarikan warisan leluhur bangsa.

Adyatara adalah sebuah platform _Visual Novel Engine_ berbasis web yang membawa pemain menjelajahi jejak legenda Nusantara dengan antarmuka interaktif dan mekanisme pengambilan keputusan (_branching storyline_). Setiap cerita menghadirkan karakter, voice acting, musik latar, kuis edukatif, pilihan bercabang, akhiran ganda, item koleksi, dan ensiklopedia pengetahuan budaya.

---

## Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Cerita yang Tersedia](#-cerita-yang-tersedia)
- [Demo & Screenshots](#-demo--screenshots)
- [Stack Teknologi](#-stack-teknologi)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Struktur Database](#-struktur-database)
- [Cara Menjalankan Secara Lokal](#-cara-menjalankan-secara-lokal)
- [Environment Variables](#-environment-variables)
- [Perintah yang Tersedia](#-perintah-yang-tersedia)
- [Struktur Direktori](#-struktur-direktori)
- [Sistem Desain](#-sistem-desain)
- [API Reference](#-api-reference)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## Fitur Utama

### Interaktif Visual Novel

Cerita disajikan dalam format _visual novel_ dengan engine `narraleaf-react`. Setiap adegan mendukung:

- **Sprite Karakter** — dengan berbagai ekspresi (senang, sedih, marah, terkejut)
- **Background Images** — ilustrasi khas Nusantara per adegan
- **Voice Acting** — narasi dan dialog bersuara untuk tiap karakter
- **Musik Latar** — BGM yang berubah sesuai suasana cerita (_tension, romance, action_)
- **Sound Effects** — efek suara untuk momen dramatis
- **Auto-play Mode** — opsi baca otomatis dengan _timing delay_ yang dapat dikonfigurasi

### Sistem Pilihan Bercabang

Setiap cerita memiliki jalur bercabang (_branching storyline_) dengan konsekuensi nyata:

- Pilihan mempengaruhi alur cerita dan karakter
- **Skor** tercatat per pilihan dengan sistem _score delta_
- **Leveling** — skor menentukan level pemain
- Tiga jenis akhiran: **Best**, **Neutral**, dan **Bad**

### Kuis Edukatif

Tertanam di dalam alur cerita, kuis menguji pengetahuan pemain tentang:

- Sains (biologi, kimia) — _Legenda Timun Mas_
- Geografi & geologi — _Legenda Danau Tondano_
- Budaya & sejarah — _Legenda Candi Prambanan_

### Peta Interaktif Nusantara

Dashboard eksplorasi berbasis **Leaflet** + **GeoJSON** (`indonesia.geojson`) yang menampilkan:

- Peta Indonesia interaktif dengan 38 provinsi
- _Pop-up_ informasi per provinsi saat diklik
- Tautan langsung ke cerita yang tersedia di provinsi tersebut
- Statistik overlay dan legenda

### Sistem Koleksi

Pemain mengumpulkan artefak budaya berdasarkan akhiran yang dicapai:

| Rarity | Contoh Artefak |
|--------|---------------|
| Common | Nasi Pecel, Rumah Joglo, Lumpia Semarang |
| Uncommon | Angklung, Jamu Tradisional, Kolintang |
| Rare | Keris Yogyakarta, Gamelan Jawa, Tinutuan |
| Legendary | Candi Prambanan, Malioboro, Danau Tondano |

### AI Companion (Chatbot)

Chatbot berbasis **OpenRouter** (model Gemini 2.0 Flash Lite) yang siap menjawab pertanyaan tentang:

- Cerita rakyat per provinsi
- Budaya, adat, dan tradisi daerah
- Sejarah dan nilai moral legenda Nusantara

### Audio Player

Pemutar musik bergaya Spotify yang terintegrasi dengan _library_ musik daerah Indonesia dan _soundtrack_ cerita.

### Autentikasi & Profil

- **NextAuth v5** dengan JWT session strategy
- Login via _email/password_, GitHub OAuth, Google OAuth
- Profil pemain dengan avatar, bio, statistik skor, level, dan riwayat aktivitas

---

## Cerita yang Tersedia

### 1. Legenda Candi Prambanan

| | |
|---|---|
| **Provinsi** | Yogyakarta |
| **Karakter** | Narrator, Bandung Bondowoso, Roro Jonggrang, Jin Guardian |
| **Adegan** | 8 scene |
| **Voice Lines** | 30+ |
| **Ending** | Best (Roro menjadi candi ke-1000), Neutral (Bandung pergi), Bad (Bandung mengutuk Roro) |
| **Kuis** | Rumah tradisional Yogyakarta (Joglo) |
| **Koleksi** | Batik Parang, Keris Yogyakarta, Gamelan Jawa, Candi Prambanan (Legendary), Gudeg, Wayang Kulit |

### 2. Legenda Timun Mas

| | |
|---|---|
| **Provinsi** | Jawa Tengah |
| **Karakter** | Narrator, Mbok Srini, Timun Mas, Buto Ijo, Pertapa Sakti |
| **Adegan** | 10 scene |
| **Voice Lines** | 30+ |
| **Ending** | Best (mengalahkan Buto Ijo dengan 4 benda sakti), Bad (menolak perjanjian) |
| **Kuis** | Biologi (bibit mentimun), Kimia (garam dari laut) |
| **Koleksi** | Rumah Joglo, Jamu Tradisional, Angklung, Malioboro (Legendary), Nasi Pecel, Lumpia Semarang |

### 3. Legenda Danau Tondano

| | |
|---|---|
| **Provinsi** | Sulawesi Utara |
| **Karakter** | Narrator, Tonaas Utara, Marimbow, Maharimbow |
| **Adegan** | 10 scene |
| **Voice Lines** | 18+ |
| **Ending** | Best (Marimbow menjaga sumpah, menjadi pemimpin bijak), Bad (pernikahan rahasia marahi alam, gunung meletus) |
| **Kuis** | Geografi (lokasi Danau Tondano), Geologi (Gunung Kaweng) |
| **Koleksi** | Kolintang, Pakaian Adat Minahasa, Tinutuan, Danau Tondano (Legendary), Cakalang Fufu, Watu Pinabetengan (Legendary) |

---

## Stack Teknologi

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 16.1.7 | Full-stack React framework (App Router) |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety (strict mode) |
| Tailwind CSS | ^4 | Utility-first CSS dengan `@tailwindcss/postcss` |
| shadcn/ui | ^4.0.8 | UI primitives (base-nova style) |
| Framer Motion | ^12.38.0 | Animasi transisi antar adegan |
| Leaflet / react-leaflet | ^1.9.4 / ^5.0.0 | Peta interaktif Indonesia |
| narraleaf-react | ^0.9.0 | Visual novel rendering engine |
| React Hook Form | ^7.71.2 | Manajemen form |
| Zustand | ^5.0.12 | Global client state |
| React Query | ^5.90.21 | Server state & data fetching |
| lucide-react | ^0.577.0 | Ikon |
| sonner | ^2.0.7 | Toast notifications |
| next-themes | ^0.4.6 | Dark/light theme toggle |
| react-markdown | ^10.1.0 | Markdown rendering (chatbot) |
| shiki | ^4.0.2 | Syntax highlighting |

### Backend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| NextAuth.js | ^5.0.0-beta.30 | Autentikasi (JWT + Prisma adapter) |
| Prisma | ^7.5.0 | ORM |
| @prisma/adapter-pg | ^7.5.0 | PostgreSQL connection pooling |
| pg | ^8.20.0 | PostgreSQL client |
| bcryptjs | ^3.0.3 | Password hashing |
| zod | ^4.3.6 | Schema validation |
| openai | ^6.33.0 | OpenRouter SDK (AI chatbot) |

### Database & Infra

| Teknologi | Kegunaan |
|-----------|----------|
| PostgreSQL 16 (Alpine) | Database utama |
| Docker Compose | Container orchestration |
| pgAdmin | Database management UI |

### Font

| Font | Kegunaan |
|------|----------|
| **Kurale** (serif) | Heading dan angka besar |
| **Inter** (sans-serif) | Body text |
| **Space Mono** (monospace) | Kode dan monospace text |

---

## Arsitektur Sistem

### Dual Game Engine

Adyatara mengimplementasikan dua sistem permainan yang bekerja berdampingan:

**1. NarraLeaf VN Engine (Primary)**

Cerita didefinisikan sebagai modul TypeScript di `src/stories/*.ts` menggunakan kelas `Scene`, `Character`, `Story`, `Menu`, `Script`, `Image`, `Sound`. Engine merender cerita secara _client-side_ dengan fitur:

- Voice acting per karakter dan ekspresi
- Background music yang dinamis
- Sistem _storable_ untuk tracking skor dan akhiran
- Persistensi ke database melalui `/api/game/finish`

**2. Database-Driven Node System (Secondary)**

Cerita disimpan sebagai record `Node` dan `Choice` di database, ditelusuri melalui API:

- `/api/game/start` — memulai sesi baru
- `/api/game/[sessionId]` — mendapatkan node saat ini
- `/api/game/choice` — submit pilihan dan maju ke node berikutnya

### Pola Server-First

- **Server Components** adalah default (tanpa directive)
- `"use client"` hanya ditambahkan ketika menggunakan hooks, event handler, atau browser API
- **Server Actions** digunakan untuk mutasi dibanding API routes
- Server-side auth check via `auth()` di setiap halaman terproteksi

### State Management

| Layer | Teknologi | Kegunaan |
|-------|-----------|----------|
| Global Client | Zustand (`useAppStore`, `useAudioStore`) | Sidebar state, audio player (persisted) |
| Server State | React Query | Data fetching, 60s stale time |
| Form State | React Hook Form + Zod | Form validation & submission |
| Auth State | NextAuth Session | User authentication & profile |

---

## Struktur Database

14 model, 1 enum. Semua relasi menggunakan cascade delete.

```
User (id, name, email, password, role, level, totalScore, bio, avatarUrl)
 ├── Account          (NextAuth OAuth provider)
 ├── Session          (NextAuth database session)
 ├── GameSession      (tracking sesi permainan aktif/selesai)
 ├── UserKnowledge    (pengetahuan yang sudah dibuka)
 └── UserCollectible  (artefak yang sudah dikumpulkan)

Story (id, title, region, description, difficulty, levelReq, coverImage, themeColor)
 ├── Node             (narration | choice | ending)
 │   └── Choice       (text, scoreDelta, nextNodeId)
 │       ├── Knowledge    (terhubung via knowledgeId)
 │       └── Collectible  (terhubung via collectibleId)
 ├── Knowledge        (title, content, category)
 ├── Collectible      (name, image, rarity, category)
 └── GameSession

Character (id, name, avatar, region)
 └── Node             (sebagai speaker)

VerificationToken    (NextAuth email verification)
```

### Relasi Utama

```
User ──(1:N)──▶ GameSession ──(N:1)──▶ Story
User ──(1:N)──▶ UserKnowledge ──(N:1)──▶ Knowledge
User ──(1:N)──▶ UserCollectible ──(N:1)──▶ Collectible
Story ──(1:N)──▶ Node ──(1:N)──▶ Choice
Choice ──(N:1)──▶ Knowledge / Collectible
Node ──(N:1)──▶ Character (speaker)
```

---

## Cara Menjalankan Secara Lokal

### Prasyarat

- **Node.js** 18+
- **Docker** & Docker Compose (untuk PostgreSQL)
- **npm** atau **yarn**

### Langkah Instalasi

**1. Clone dan Install Dependensi**

```bash
git clone <repository_url>
cd adyatara
npm install
```

**2. Siapkan Environment Variables**

```bash
cp .env.example .env
```

Lengkapi variabel yang diperlukan di `.env` (lihat [Environment Variables](#-environment-variables)).

**3. Jalankan Database**

```bash
docker compose up -d
```

Ini akan mengstart:
- **PostgreSQL 16** di port `5432`
- **pgAdmin** di port `5050` (email: `admin@nextboiler.com`, password: `admin`)

**4. Setup Prisma & Database**

```bash
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Jalankan migrasi
npx prisma db seed       # Seed database dengan 3 cerita
```

**5. Jalankan Development Server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

**6. (Opsional) Generate Dokumentasi Next.js untuk AI Agent**

```bash
npx @next/codemod@latest agents-md
```

> **Catatan untuk Agen AI**: Setiap kali ingin meminta agen AI mengerjakan sesuatu, selalu rujuk ke `AGENTS.md`, `CLAUDE.md`, dan `adyatara-techspec.md` terlebih dahulu sebagai panduan.

---

## Environment Variables

| Variabel | Deskripsi | Default |
|----------|-----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/adyatara` |
| `DIRECT_URL` | Direct connection untuk migrasi | Sama dengan `DATABASE_URL` |
| `NEXTAUTH_SECRET` | Secret key untuk NextAuth | `development-secret-change-in-production` |
| `NEXTAUTH_URL` | URL aplikasi | `http://localhost:3000` |
| `AUTH_SECRET` | Auth secret (alias) | `development-secret-change-in-production` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` |
| `SUPABASE_URL` | Base URL project Supabase untuk akses Storage API | `https://[PROJECT_REF].supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key untuk upload avatar server-side | - |
| `SUPABASE_STORAGE_BUCKET` | Nama bucket public untuk avatar | `avatars` |
| `OPENROUTER_API_KEY` | API key untuk AI chatbot | - |
| `OPENROUTER_MODEL` | Model AI | `google/gemini-2.0-flash-lite-001` |

> **Penting**: Jangan pernah commit file `.env`. Gunakan `.env.example` sebagai referensi.

---

## Perintah yang Tersedia

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Jalankan migrasi database |
| `npx prisma db seed` | Seed database (tsx prisma/seed.ts) |
| `npx prisma studio` | Buka Prisma Studio (database GUI) |
| `docker compose up -d` | Jalankan PostgreSQL & pgAdmin |
| `docker compose down` | Hentikan semua container |

---

## Struktur Direktori

```
adyatara/
├── .env.example                    # Template environment variables
├── AGENTS.md                       # Konvensi untuk AI agent
├── CLAUDE.md                       # Referensi ke AGENTS.md
├── adyatara-techspec.md            # Spesifikasi teknis frontend
├── docker-compose.yml              # PostgreSQL 16 + pgAdmin
├── next.config.ts                  # Konfigurasi Next.js
├── tsconfig.json                   # Konfigurasi TypeScript (strict mode)
├── eslint.config.mjs               # Konfigurasi ESLint
├── postcss.config.mjs              # PostCSS dengan @tailwindcss/postcss
├── components.json                 # Konfigurasi shadcn/ui (base-nova)
├── package.json                    # Dependencies & scripts
│
├── prisma/
│   ├── schema.prisma               # 14 model, 1 enum
│   ├── seed.ts                     # Seed 3 cerita + koleksi
│   ├── seed-story.ts               # Alternatif seed script
│   ├── migrations/                 # 3 migrasi
│   │   ├── 20260320094119_init
│   │   ├── 20260322190145_add_user_bio_and_avatar
│   │   └── 20260324175323_add_collectibles
│   └── config.ts                   # Prisma 7+ config
│
├── public/
│   ├── indonesia.geojson           # Data GeoJSON peta Indonesia
│   ├── images/                     # Hero, auth, background, koleksi
│   ├── audio/                      # Voice acting (prambanan, timun-mas, danau-tondano)
│   └── music/                      # BGM per cerita + lagu daerah
│
└── src/
    ├── proxy.ts                    # NextAuth middleware (proteksi /dashboard)
    │
    ├── actions/
    │   ├── auth.ts                 # register
    │   └── profile.ts              # updateProfile, updatePassword
    │
    ├── app/
    │   ├── layout.tsx              # Root layout (Providers, Navbar, Footer, AudioPlayer)
    │   ├── page.tsx                # Landing page (hero, stats, fitur, cerita, CTA)
    │   ├── globals.css             # Design tokens, corner brackets, custom styles
    │   │
    │   ├── auth/
    │   │   ├── signin/page.tsx     # Halaman login
    │   │   └── register/page.tsx   # Halaman registrasi
    │   │
    │   ├── dashboard/
    │   │   ├── layout.tsx          # Sidebar + MobileNav
    │   │   ├── page.tsx            # Dashboard utama (stats, progress, aktivitas, koleksi)
    │   │   ├── profile/page.tsx    # Lihat profil
    │   │   ├── profile/edit/page.tsx  # Edit profil & ubah password
    │   │   ├── collection/page.tsx # Galeri koleksi (locked/unlocked)
    │   │   └── chat/page.tsx       # AI chatbot budaya Indonesia
    │   │
    │   ├── explore/
    │   │   ├── layout.tsx          # Full-screen layout
    │   │   └── page.tsx            # Peta interaktif Indonesia
    │   │
    │   ├── game/
    │   │   ├── layout.tsx          # Game layout (landscape overlay)
    │   │   ├── page.tsx            # Visual novel player
    │   │   └── result/page.tsx     # Halaman hasil permainan
    │   │
    │   └── api/
    │       ├── auth/[...nextauth]/route.ts
    │       ├── chat/route.ts
    │       ├── game/start/route.ts
    │       ├── game/[sessionId]/route.ts
    │       ├── game/choice/route.ts
    │       ├── game/finish/route.ts
    │       ├── stories/route.ts
    │       ├── stories/[id]/route.ts
    │       ├── user/profile/route.ts
    │       ├── user/progress/route.ts
    │       └── upload/avatar/route.ts
    │
    ├── components/
    │   ├── audio-player/           # Audio player UI & provider
    │   ├── auth/                   # LoginForm, RegisterForm
    │   ├── dashboard/              # Sidebar, MobileNav, ChatInterface, DashboardMap,
    │   │                           # CollectionGrid, CollectibleDetailModal
    │   ├── game/                   # AdyataraPlayer, AdyataraDialog, AdyataraMenu
    │   ├── providers/              # SessionProvider, QueryProvider, ThemeProvider,
    │   │                           # AudioPlayerProvider
    │   ├── shared/                 # Navbar, Footer, LandscapeOverlay, FormInput, ThemeToggle
    │   └── ui/                     # shadcn/ui primitives
    │
    ├── hooks/
    │   ├── use-app-store.ts        # Zustand store (sidebar state)
    │   ├── use-audio-store.ts      # Zustand store (audio player, persisted)
    │   └── use-mounted.ts          # Hydration-safe mounted hook
    │
    ├── lib/
    │   ├── auth.ts                 # NextAuth config + Credentials provider
    │   ├── auth.config.ts          # Auth config (OAuth, JWT callbacks, middleware)
    │   ├── db.ts                   # Prisma client singleton (pg adapter)
    │   ├── game-engine.ts          # Server-side game logic
    │   ├── game-utils.ts           # Client-side NarraLeaf helpers
    │   ├── metadata.ts             # OpenGraph/Twitter metadata builder
    │   ├── music-data.ts           # Koleksi musik daerah Indonesia (8 lagu)
    │   ├── utils.ts                # cn() utility (clsx + tailwind-merge)
    │   └── validations/
    │       ├── chat.ts             # Zod schema untuk chat
    │       └── profile.ts          # Zod schema untuk profil & password
    │
    ├── stories/
    │   ├── index.ts                # Story registry, loadStory(), provinceStoryMap
    │   ├── prambanan.ts            # 471 baris, 8 scene, 4 karakter
    │   ├── timun-mas.ts            # 514 baris, 10 scene, 5 karakter
    │   ├── danau-tondano.ts        # 373 baris, 10 scene, 4 karakter
    │   └── collectible-map.ts      # Mapping cerita+ending ke collectible ID
    │
    └── types/
        └── index.ts                # UserProfile, ApiResponse<T>, PaginatedResponse<T>
```

---

## Sistem Desain

### Palet Warna

| Token | Nilai | Penggunaan |
|-------|-------|------------|
| Background | `#0A0705` | Latar belakang utama |
| Background Alt | `#0D0A08` / `#0D0907` | Card, input field |
| Accent Primary | `#E8724A` / `#E86B52` | CTA button, ikon utama |
| Accent Secondary | `#D96B4A` | Hover state, label aksen |
| Text Primary | `#F5F0EB` | Judul, body text |
| Text Secondary | `#9A8A7A` | Deskripsi, label |
| Border | `#2E2318` / `#1A1410` | Border card, divider |

### Elemen Desain Khas

**Corner Brackets** — Dekorasi sudut yang digunakan secara konsisten di card, input, dan box:

```
┌─────────────────────┐
│                     │
│   Konten            │
│                     │
└─────────────────────┘
```

Implementasi Tailwind:
```tsx
<div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gray-800 group-hover:border-[#D96B4A]/60" />
<div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gray-800 group-hover:border-[#D96B4A]/60" />
<div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gray-800 group-hover:border-[#D96B4A]/60" />
<div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gray-800 group-hover:border-[#D96B4A]/60" />
```

**Typography Patterns:**

- Serif font untuk heading dan angka besar
- Uppercase + `tracking-[0.2em]` untuk label, button, section title
- Light weight untuk deskripsi dan teks sekunder
- Label: `text-[10px]`, `tracking-[0.2em]`, `uppercase`, `font-medium`

**Form Styling:**

- Input: `rounded-none`, `py-6`, `bg-[#0D0907]`, `border border-gray-800`
- Button: `bg-[#E86B52]`, `rounded-none`, `tracking-[0.2em]`, uppercase
- Placeholder: `text-gray-600`

---

## API Reference

### Autentikasi

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler (login, register, session) |

### Cerita

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/stories` | GET | Daftar semua cerita |
| `/api/stories/[id]` | GET | Detail cerita tertentu |

### Permainan

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/game/start` | POST | Memulai sesi permainan baru |
| `/api/game/[sessionId]` | GET | Mendapatkan node saat ini |
| `/api/game/choice` | POST | Submit pilihan dan maju ke node berikutnya |
| `/api/game/finish` | POST | Mengakhiri sesi, memberikan skor & koleksi |

### Pengguna

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/user/profile` | GET | Profil pengguna saat ini |
| `/api/user/progress` | GET | Progress pengguna (skor, sesi, pengetahuan) |
| `/api/upload/avatar` | POST | Upload avatar (disimpan di `/public/uploads/avatars/`) |

### AI Chatbot

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/chat` | POST | Chatbot budaya Indonesia (OpenRouter/Gemini) |

### Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `register` | `src/actions/auth.ts` | Buat akun baru (Zod validated, bcrypt hashed) |
| `updateProfile` | `src/actions/profile.ts` | Update nama, email, bio, avatar |
| `updatePassword` | `src/actions/profile.ts` | Ubah password (verifikasi password lama) |

---

## Migrasi Database

| Migrasi | Tanggal | Deskripsi |
|---------|---------|-----------|
| `20260320094119_init` | 20 Mar 2026 | Skema awal |
| `20260322190145_add_user_bio_and_avatar` | 22 Mar 2026 | Menambahkan `bio` dan `avatarUrl` ke User |
| `20260324175323_add_collectibles` | 24 Mar 2026 | Menambahkan model Collectible & UserCollectible |

---

## Kontribusi

Kontribusi sangat diterima! Berikut langkah-langkahnya:

1. Fork repository
2. Buat branch untuk fitur baru (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m 'feat: tambah fitur X'`)
4. Push ke branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

Pastikan untuk:
- Menjalankan `npm run lint` sebelum commit
- Mengikuti konvensi penamaan di `AGENTS.md`
- Tidak mengcommit file `.env`

---

## Lisensi

Proyek ini bersifat privat.
