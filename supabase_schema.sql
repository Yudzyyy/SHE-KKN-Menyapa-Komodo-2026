-- 1. Tabel Anggota
CREATE TABLE IF NOT EXISTS public.anggota (
    id BIGSERIAL PRIMARY KEY,
    nama TEXT NOT NULL,
    posko TEXT,
    jabatan TEXT,
    no_hp TEXT,
    kondisi TEXT DEFAULT 'Sehat',
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for public access (optional, adjust if production security is needed)
ALTER TABLE public.anggota DISABLE ROW LEVEL SECURITY;

-- 2. Tabel Insiden
CREATE TABLE IF NOT EXISTS public.insiden (
    id BIGSERIAL PRIMARY KEY,
    nama TEXT NOT NULL,
    tipe TEXT NOT NULL,
    lokasi TEXT,
    deskripsi TEXT,
    tindakan TEXT,
    status TEXT DEFAULT 'Ditangani',
    tanggal DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.insiden DISABLE ROW LEVEL SECURITY;

-- 3. Tabel Aktivitas
CREATE TABLE IF NOT EXISTS public.aktivitas (
    id BIGSERIAL PRIMARY KEY,
    posko TEXT,
    kategori TEXT,
    deskripsi TEXT,
    status TEXT DEFAULT 'Selesai',
    tanggal DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.aktivitas DISABLE ROW LEVEL SECURITY;

-- 4. Tabel Kontak Darurat
CREATE TABLE IF NOT EXISTS public.kontak_darurat (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    phone TEXT NOT NULL,
    region TEXT,
    description TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kontak_darurat DISABLE ROW LEVEL SECURITY;
