import { supabase } from '@/utils/supabaseClient';

export const runtime = 'edge';

export async function GET(req) {
  try {
    // Jalankan query SELECT super ringan untuk menjaga koneksi/database tetap bangun
    const { data, error } = await supabase
      .from('anggota')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        message: 'Database connection is active',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Cron Keep-Alive Error:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
