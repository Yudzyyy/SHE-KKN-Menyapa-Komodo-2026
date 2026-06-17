// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimasi gambar — izinkan semua domain eksternal
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  // Aktifkan React strict mode
  reactStrictMode: true,
  // Tree-shaking otomatis untuk package besar
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
