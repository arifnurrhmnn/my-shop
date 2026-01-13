# AI-READY PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project Name
Simple Shop Etalase

## Purpose of This Document
Dokumen ini **dirancang khusus untuk digunakan sebagai prompt ke AI Agent (GitHub Copilot / AI Coding Agent)**. Seluruh requirement ditulis **eksplisit, teknis, deterministik, dan bebas asumsi**, agar AI dapat:
- Meng-generate struktur project
- Mengimplementasikan fitur satu per satu
- Mengikuti standar library yang ditentukan

AI **TIDAK BOLEH**:
- Mengganti stack
- Menambahkan fitur di luar scope
- Mengubah UI menjadi desktop

---

## 1. Tech Stack (FIXED – DO NOT CHANGE)

### Framework & Tools
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- SASS (optional, hanya jika diperlukan custom style)

### State Management
- Redux Toolkit
- Slice-based architecture

### UI & Utility Libraries
- shadcn/ui (UI components)
- lucide-react (icons)
- sonner (toast notification)
- @tanstack/react-table (table admin)

### Data & API
- Supabase (database)
- Axios (HTTP client)

---

## 2. Design Constraints

- **Mobile-only UI**
- Semua page menggunakan container dengan `max-width`
- Theme:
  - Primary color: Green
  - Background: White
- UI sederhana, clean, dan ringan
- Gunakan smooth animation (CSS / framer-motion optional)

---

## 3. User Roles

### Client (Public)
- Tidak memerlukan login

### Admin
- Login statis
  - Username: `admin`
  - Password: `admin`

---

## 4. Pages & Features

## 4.1 Client Page (Public Etalase)

### Route
- `/`

### Header Section

Components wajib:
- Avatar (image)
- Title (text)
- Subtitle (text)
- Search input

Search behavior:
- Search hanya berdasarkan `etalase_number`
- Format nomor: 3 digit (001, 002, dst)
- Real-time filtering

---

### Etalase List Section

Layout:
- Grid
- 1 row = 2 column

Card content:
- Thumbnail image
- Nomor etalase (3 digit)

Card behavior:
- Entire card clickable
- On click → redirect ke `affiliate_url`

---

### Data Fetching Rules (Client)

- Initial fetch: **10 items**
- Infinite scroll:
  - Ketika scroll mencapai bottom
  - Fetch +10 data
  - Ulangi sampai data habis
- **Tidak boleh menggunakan pagination**

Loading state:
- Gunakan skeleton loader
- Skeleton muncul saat initial load & fetch berikutnya

Animation:
- Smooth fade / slide saat data muncul

---

## 4.2 Admin Authentication

### Route
- `/admin/login`

Rules:
- Simple client-side authentication
- Jika username & password benar → redirect ke dashboard
- Jika salah → tampilkan toast error

---

## 4.3 Admin Dashboard

### Route
- `/admin/dashboard`

Layout:
- Mobile-only
- Max-width container

Menu:
- Upload Etalase
- List Etalase

---

## 4.4 Upload Etalase Feature

### Form Fields

1. Thumbnail
   - Image upload
2. Affiliate URL
   - Text input
3. Nomor Etalase
   - Auto-generated
   - Disabled input

### Etalase Number Rules

- Format: 3 digit string
- Auto increment
- Berdasarkan data terakhir di database
- Contoh:
  - Data terakhir: 009
  - Data baru: 010

Admin **TIDAK BISA** mengedit nomor ini

---

### Submit Behavior

- On submit:
  - Upload thumbnail
  - Simpan data ke Supabase
- On success:
  - Show success toast (sonner)
- On error:
  - Show error toast

---

## 4.5 Admin Etalase Table

Library:
- @tanstack/react-table

Columns:
- Thumbnail
- Etalase Number
- Affiliate URL
- Created At

---

## 5. Database Specification (Supabase)

### Table: `etalases`

| Column | Type | Rule |
|------|------|------|
| id | uuid | Primary key |
| etalase_number | varchar(3) | Unique, auto-generated |
| thumbnail_url | text | Required |
| affiliate_url | text | Required |
| created_at | timestamp | Auto |

---

## 6. Redux Architecture

### Slices

#### authSlice
- isAuthenticated: boolean

#### etalaseSlice
- items: Etalase[]
- loading: boolean
- hasMore: boolean

---

## 7. Folder Structure (MANDATORY)

```
/src
 ├── app
 │   ├── page.tsx                # Client page
 │   ├── admin
 │   │   ├── login
 │   │   │   └── page.tsx
 │   │   └── dashboard
 │   │       └── page.tsx
 │   └── layout.tsx
 │
 ├── components
 │   ├── etalase
 │   ├── admin
 │   ├── common
 │   └── ui
 │
 ├── redux
 │   ├── store.ts
 │   └── slices
 │       ├── authSlice.ts
 │       └── etalaseSlice.ts
 │
 ├── services
 │   └── etalase.service.ts
 │
 ├── styles
 │   └── custom.scss
 │
 └── utils
```

---

## 8. Explicit Non-Goals (DO NOT IMPLEMENT)

- Desktop layout
- Role management
- Payment
- SEO optimization
- Multi admin

---

## 9. AI Agent Instructions (IMPORTANT)

AI Agent MUST:
- Follow this PRD exactly
- Use existing Next.js & Supabase setup
- Write clean, modular, readable code
- Use TypeScript strictly
- Follow best practice masing-masing library

AI Agent MUST NOT:
- Menambah fitur baru
- Mengubah stack
- Mengasumsikan kebutuhan tambahan

---

## END OF DOCUMENT

