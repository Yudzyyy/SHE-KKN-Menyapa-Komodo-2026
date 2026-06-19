import { supabase } from '@/utils/supabaseClient';
import DashboardClient from './DashboardClient';

// Tambahkan revalidate untuk ISR (Incremental Static Regeneration)
// Vercel akan meng-cache halaman ini dan me-regenerate setiap 60 detik di background.
export const revalidate = 60;

export default async function Home() {
  let stats = {
    totalMembers: 30,
    totalHealthy: 30,
    totalSick: 0,
    totalInjury: 0,
    warlokaCount: 15,
    goloMoriCount: 15,
    warlokaHealthy: 15,
    warlokaSick: 0,
    warlokaInjury: 0,
    goloMoriHealthy: 15,
    goloMoriSick: 0,
    goloMoriInjury: 0,
    recentIncidents: [] // Kosong jika belum ada insiden di database
  };

  try {
    // Fetch anggota dan insiden secara paralel dengan kolom terbatas agar lebih cepat dan hemat bandwidth
    const [
      { data: members, error: mErr },
      { data: incidents, error: iErr },
      { count: totalIncidentsCount }
    ] = await Promise.all([
      supabase.from('anggota').select('posko, kondisi'),
      supabase.from('insiden').select('id, nama, lokasi, tipe, status, tindakan, deskripsi, tanggal').order('tanggal', { ascending: false }).limit(3),
      supabase.from('insiden').select('*', { count: 'exact', head: true })
    ]);

    if (members && members.length > 0) {
      stats.totalMembers = members.length;
      
      // Filter by village
      const warlokaMembers = members.filter(m => (m.posko || m.village) === "Warloka Pesisir");
      const goloMoriMembers = members.filter(m => (m.posko || m.village) === "Golo Mori");

      stats.warlokaCount = warlokaMembers.length;
      stats.goloMoriCount = goloMoriMembers.length;

      stats.warlokaHealthy = warlokaMembers.filter(m => m.kondisi === "Sehat" || m.kondisi === "Fit").length;
      stats.warlokaSick = warlokaMembers.filter(m => m.kondisi === "Sakit" || m.kondisi === "Kurang Sehat").length;
      stats.warlokaInjury = warlokaMembers.filter(m => m.kondisi === "Cedera" || m.kondisi === "Luka" || m.kondisi === "Cedera Ringan").length;

      stats.goloMoriHealthy = goloMoriMembers.filter(m => m.kondisi === "Sehat" || m.kondisi === "Fit").length;
      stats.goloMoriSick = goloMoriMembers.filter(m => m.kondisi === "Sakit" || m.kondisi === "Kurang Sehat").length;
      stats.goloMoriInjury = goloMoriMembers.filter(m => m.kondisi === "Cedera" || m.kondisi === "Luka" || m.kondisi === "Cedera Ringan").length;

      stats.totalHealthy = stats.warlokaHealthy + stats.goloMoriHealthy;
      stats.totalSick = stats.warlokaSick + stats.goloMoriSick;
      stats.totalInjury = stats.warlokaInjury + stats.goloMoriInjury;
    }

    // Selalu update recentIncidents dari Supabase (maksimal 3)
    if (incidents) {
      stats.recentIncidents = incidents.map((inc, i) => {
        const sequentialNumber = (totalIncidentsCount || incidents.length) - i;
        
        let extra = {};
        try {
          extra = JSON.parse(inc.tindakan);
        } catch (e) {
          const isKorban = inc.tindakan && inc.tindakan.startsWith("Korban: ");
          extra = {
            victimName: isKorban ? inc.tindakan.split(" | ")[0].replace("Korban: ", "") : "Tidak ada",
            photo: null
          };
        }

        return {
          id: `#${sequentialNumber}`,
          reporter: inc.nama,
          location: inc.lokasi || "Posko KKN",
          type: inc.tipe === "emergency" ? "Darurat Medis" : (inc.tipe === "high" ? "Insiden Tinggi" : (inc.tipe === "medium" ? "Insiden Sedang" : "Insiden Ringan")),
          status: inc.status || "Ditangani",
          severity: inc.tipe,
          victimName: extra.victimName || "Tidak ada",
          description: inc.deskripsi || "Tidak ada catatan.",
          photo: extra.photo || null
        };
      });
    }

  } catch (err) {
    console.error("Gagal mengambil data dashboard:", err);
  }

  return <DashboardClient initialStats={stats} />;
}