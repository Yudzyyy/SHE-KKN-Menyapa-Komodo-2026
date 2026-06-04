"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import Navigation from '../../components/Navigation';

// Pre-populated realistic initial activities for the timeline
const INITIAL_ACTIVITIES = [
  {
    id: "ACT-001",
    title: "Site Inspection Zone B",
    time: "Hari Ini, 09:30 AM",
    description: "Selesai melakukan pemeriksaan rutin keselamatan. Semua sistem dan peralatan nominal. Puing-puing kecil di jalur evakuasi telah dibersihkan.",
    location: "Sektor 4",
    mood: "😃",
    hasImage: false,
    imageSrc: null
  },
  {
    id: "ACT-002",
    title: "Safety Briefing Mingguan",
    time: "Kemarin, 14:15 PM",
    description: "Melakukan pengarahan (briefing) keselamatan mingguan bersama seluruh kru lapangan mengenai protokol sabuk pengaman (harness) baru di ketinggian.",
    location: "Ruang Rapat Utama",
    mood: "🙂",
    hasImage: false,
    imageSrc: null
  },
  {
    id: "ACT-003",
    title: "Laporan Bahaya (Hazard Report)",
    time: "Kemarin, 10:00 AM",
    description: "Menemukan scaffolding (perancah) yang agak longgar dan tidak stabil di Zona C. Petugas pemeliharaan langsung dihubungi untuk perbaikan segera.",
    location: "Zona Konstruksi C",
    mood: "😫",
    hasImage: true,
    imageSrc: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=200"
  }
];

export default function AktivitasPage() {
  // App States
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Form Field States
  const [mood, setMood] = useState("happy"); // happy, fine, neutral, stressed
  const [activityName, setActivityName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFilePreview, setAttachedFilePreview] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Load activities from Supabase (with fallback to localStorage/INITIAL_ACTIVITIES for first-run sync)
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('aktivitas')
          .select('*')
          .order('tanggal', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped = data.map(act => ({
            id: act.id,
            title: act.kategori,
            time: new Date(act.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            description: act.deskripsi,
            location: act.posko,
            mood: "🙂", // default
            hasImage: false,
            imageSrc: null
          }));
          setActivities(mapped);
          localStorage.setItem('she_activities', JSON.stringify(mapped));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi aktivitas dengan Supabase:", err.message);
        const stored = localStorage.getItem('she_activities');
        if (stored) {
          try {
            setActivities(JSON.parse(stored));
          } catch (e) {
            setActivities(INITIAL_ACTIVITIES);
          }
        } else {
          setActivities(INITIAL_ACTIVITIES);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Mood Emoji helper
  const getMoodEmoji = (selectedMood) => {
    switch (selectedMood) {
      case "happy": return "😃";
      case "fine": return "🙂";
      case "neutral": return "😐";
      case "stressed": return "😫";
      default: return "🙂";
    }
  };

  // Handle image upload simulation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
      triggerToast("Foto berhasil dilampirkan!", "success");
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activityName || !location || !notes) {
      triggerToast("Mohon lengkapi seluruh kolom isian!", "error");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('aktivitas')
        .insert([
          {
            posko: location,
            kategori: activityName,
            deskripsi: notes,
            status: 'Selesai',
            tanggal: new Date().toISOString().split('T')[0]
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const newActivity = {
          id: data[0].id,
          title: data[0].kategori,
          time: "Hari Ini, Baru Saja",
          description: data[0].deskripsi,
          location: data[0].posko,
          mood: getMoodEmoji(mood),
          hasImage: !!attachedFilePreview,
          imageSrc: attachedFilePreview
        };

        const updatedList = [newActivity, ...activities];
        setActivities(updatedList);
        localStorage.setItem('she_activities', JSON.stringify(updatedList));

        // Reset Form fields
        setActivityName("");
        setLocation("");
        setNotes("");
        setMood("happy");
        setAttachedFile(null);
        setAttachedFilePreview(null);

        triggerToast("Log aktivitas harian berhasil direkam!", "success");
      }
    } catch (err) {
      console.error(err);
      triggerToast(`Gagal merekam aktivitas: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen antialiased font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-3 bg-white px-5 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-l-4 border-emerald-500 animate-slide-in">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
            toast.type === "success" ? "bg-emerald-500" :
            toast.type === "error" ? "bg-rose-500" : "bg-sky-500"
          }`}>
            <span className="material-symbols-outlined text-base">
              {toast.type === "success" ? "check" :
               toast.type === "error" ? "error" : "info"}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-900">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Backdrop Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed left-0 top-0 h-full w-[260px] z-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col py-8 px-4 border-r border-slate-100 transition-transform duration-300 lg:hidden ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="px-3 mb-10">
          <img src="/logo.png" alt="SHE Logo" className="h-12 w-auto object-contain" />
        </div>

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <Navigation />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden w-full">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-50/60 via-slate-50/30 to-transparent -z-10" />

        {/* 2. TOPBAR - Sleek minimal responsive header */}
        <header className="sticky top-0 w-full z-30 border-b border-slate-100 bg-white/70 backdrop-blur-md shadow-sm flex justify-between items-center h-20 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle Button */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-emerald-600 hover:bg-slate-50 p-2.5 rounded-xl transition-all border border-slate-100 mr-1"
            >
              <span className="material-symbols-outlined text-xl leading-none">menu</span>
            </button>

            <h2 className="font-poppins font-bold text-lg lg:text-xl text-slate-800 hidden sm:block">SHE Dashboard</h2>
            
            {/* Search Bar */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-slate-800 w-44 sm:w-60 md:w-80 shadow-inner" 
                placeholder="Cari aktivitas harian..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
          </div>
        </header>

        {/* 3. WORKSPACE CANVAS */}
        <main className="flex-1 p-8 flex flex-col gap-6.5 max-w-7xl w-full mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-semibold mb-1">
                <Link href="/" className="hover:underline">Dashboard</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-400">Aktivitas Harian</span>
              </div>
              <h2 className="font-poppins font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight">Aktivitas Harian</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Catat laporan tugas lapangan harian dan observasi keselamatan kerja Anda.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Report Form (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6.5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                
                <h3 className="font-poppins font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">edit_document</span>
                  Log Aktivitas Baru
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700">
                  {/* Mood/Condition Selector */}
                  <div>
                    <label className="block font-bold text-slate-500 mb-2.5 uppercase tracking-wider">Kondisi & Perasaan Lapangan</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setMood("happy")}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center text-2xl transition-all duration-300 ${
                          mood === "happy" 
                          ? "border-2 border-emerald-500 bg-emerald-50 shadow-inner scale-110" 
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                        }`} 
                        type="button"
                        title="Sangat Baik"
                      >
                        <span>😃</span>
                      </button>
                      
                      <button 
                        onClick={() => setMood("fine")}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center text-2xl transition-all duration-300 ${
                          mood === "fine" 
                          ? "border-2 border-emerald-500 bg-emerald-50 shadow-inner scale-110" 
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                        }`} 
                        type="button"
                        title="Baik"
                      >
                        <span>🙂</span>
                      </button>

                      <button 
                        onClick={() => setMood("neutral")}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center text-2xl transition-all duration-300 ${
                          mood === "neutral" 
                          ? "border-2 border-emerald-500 bg-emerald-50 shadow-inner scale-110" 
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                        }`} 
                        type="button"
                        title="Biasa Saja"
                      >
                        <span>😐</span>
                      </button>

                      <button 
                        onClick={() => setMood("stressed")}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center text-2xl transition-all duration-300 ${
                          mood === "stressed" 
                          ? "border-2 border-emerald-500 bg-emerald-50 shadow-inner scale-110" 
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                        }`} 
                        type="button"
                        title="Sangat Lelah"
                      >
                        <span>😫</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-medium">Bagaimana kondisi fisik dan stamina Anda hari ini?</p>
                  </div>

                  {/* Activity Name */}
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="activityName">Nama Aktivitas *</label>
                    <input 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-inner" 
                      id="activityName" 
                      placeholder="Contoh: Inspeksi K3 Zona Tambang A" 
                      type="text"
                      value={activityName}
                      onChange={(e) => setActivityName(e.target.value)}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="location">Lokasi Pekerjaan *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">location_on</span>
                      <input 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-inner" 
                        id="location" 
                        placeholder="Contoh: Sektor Dermaga Timur, Blok C" 
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="notes">Deskripsi & Temuan K3 *</label>
                    <textarea 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-inner resize-y" 
                      id="notes" 
                      placeholder="Jelaskan detail aktivitas kerja, temuan bahaya lapangan, maupun tindakan pencegahan yang dilakukan..." 
                      rows="4"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* Photo Upload Attachment */}
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Lampiran Foto Lapangan</label>
                    <div className="mt-1 flex justify-center px-6 pt-5.5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl bg-slate-50 hover:bg-slate-100/50 hover:border-emerald-400 transition-colors cursor-pointer relative">
                      <input 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        id="file-upload" 
                        name="file-upload" 
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className="space-y-2 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-400 block">add_a_photo</span>
                        <div className="flex text-xs text-slate-600 justify-center">
                          <span className="relative font-bold text-emerald-600 hover:text-emerald-700">Unggah foto kegiatan</span>
                          <span className="pl-1 font-medium">atau seret gambar ke sini</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Format PNG, JPG, GIF hingga ukuran maksimal 10MB</p>
                        
                        {/* Selected File Name / Preview */}
                        {attachedFile && (
                          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg text-[11px] font-bold animate-scale-up relative z-20">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            {attachedFile.name}
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setAttachedFile(null);
                                setAttachedFilePreview(null);
                                triggerToast("Lampiran foto dihapus", "info");
                              }}
                              className="ml-1 text-slate-400 hover:text-rose-600"
                            >
                              <span className="material-symbols-outlined text-xs leading-none">close</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Preview Container */}
                    {attachedFilePreview && (
                      <div className="mt-3.5 p-2 bg-slate-50 border border-slate-100 rounded-2xl w-32 h-32 overflow-hidden shadow-inner relative animate-scale-up">
                        <img alt="Upload preview" className="w-full h-full object-cover rounded-xl" src={attachedFilePreview} />
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-slate-50 flex justify-end gap-3">
                    <button 
                      onClick={() => {
                        setActivityName("");
                        setLocation("");
                        setNotes("");
                        setMood("happy");
                        setAttachedFile(null);
                        setAttachedFilePreview(null);
                        triggerToast("Pengisian dibatalkan", "info");
                      }}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors" 
                      type="button"
                    >
                      Batal
                    </button>
                    
                    <button 
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-md shadow-emerald-500/10 hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2" 
                      type="submit"
                    >
                      <span className="material-symbols-outlined text-base leading-none">send</span>
                      Kirim Laporan
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Timeline / Recent Activities (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6.5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 h-full flex flex-col">
                <h3 className="font-poppins font-bold text-lg text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-50 pb-3">
                  <span className="material-symbols-outlined text-slate-400">history</span>
                  Aktivitas Terbaru
                </h3>

                {/* Vertical Timeline Feed */}
                <div className="relative border-l-2 border-slate-100 ml-3.5 space-y-8 pb-4 flex-1">
                  {isLoading ? (
                    // Loader state inside timeline
                    Array.from({ length: 2 }).map((_, idx) => (
                      <div key={idx} className="relative pl-6 animate-pulse">
                        <div className="absolute w-3.5 h-3.5 bg-slate-100 rounded-full -left-[8px] top-1 border-2 border-white" />
                        <div className="h-3 bg-slate-100 rounded w-24 mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-44 mb-2" />
                        <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                        <div className="h-3 bg-slate-100 rounded w-5/6" />
                      </div>
                    ))
                  ) : activities.length > 0 ? (
                    activities.map((act) => (
                      <div key={act.id} className="relative pl-6.5 animate-slide-down group">
                        {/* Timeline Bullet Ring */}
                        <div className="absolute w-3.5 h-3.5 rounded-full -left-[8px] top-1 border-2 border-white bg-emerald-500 shadow-inner group-hover:scale-125 transition-transform" />
                        
                        {/* Time details */}
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{act.time}</span>
                          <span className="text-base leading-none filter drop-shadow-sm">{act.mood}</span>
                        </div>

                        {/* Title & Desc */}
                        <h4 className="font-poppins font-bold text-xs text-slate-800 group-hover:text-emerald-600 transition-colors">{act.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{act.description}</p>
                        
                        {/* Location Tag */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">location_on</span>
                            {act.location}
                          </span>
                        </div>

                        {/* Attachment Preview (if any) */}
                        {act.hasImage && act.imageSrc && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-slate-100 max-w-[160px] max-h-[100px] shadow-sm hover:shadow transition-shadow">
                            <img alt={act.title} className="w-full h-full object-cover" src={act.imageSrc} />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-400 text-xs">Belum ada aktivitas terekam.</p>
                    </div>
                  )}
                </div>

                {/* Footer History Button */}
                <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                  <button 
                    onClick={() => triggerToast("Semua riwayat telah dimuat!", "info")}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors uppercase tracking-wider"
                  >
                    Lihat Semua Riwayat
                  </button>
                </div>
              </div>
            </div>

          </div>

        </main>

        {/* Footer */}
        <footer className="w-full py-6 mt-auto border-t border-slate-100 bg-white flex items-center justify-center px-6 text-slate-400 text-center">
          <p className="text-[11px] font-semibold tracking-wide text-slate-400/90 leading-relaxed">
            © 2026 SHE Monitoring Sistem Menyapa Komodo 2026
          </p>
        </footer>
      </div>

    </div>
  );
}
