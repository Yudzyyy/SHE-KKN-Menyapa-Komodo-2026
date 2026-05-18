"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import Navigation from '../../components/Navigation';

// Pre-populated initial incidents list for realistic dashboard demonstration
const INITIAL_INCIDENTS = [
  {
    id: "INC-4492",
    title: "Darurat Medis - Sektor B-4",
    time: "Hari Ini, 10:45 AM",
    description: "Pekerja jatuh dari perancah (scaffolding) tinggi. Tim medis siaga telah dipanggil dan sedang mengevakuasi korban.",
    reporter: "Budi Santoso",
    victimName: "Farhan Ramadhan",
    severity: "emergency", // emergency, high, medium, low
  },
  {
    id: "INC-4490",
    title: "Tumpahan Minyak Ringan",
    time: "Hari Ini, 08:20 AM",
    description: "Ditemukan tumpahan oli mesin cukup luas di area pintu masuk gudang logistik. Area sudah dibatasi dengan safety cone.",
    reporter: "Ahmad Yani",
    victimName: "Tidak Ada (Hanya Fasilitas Gudang)",
    severity: "medium",
  },
  {
    id: "INC-4488",
    title: "Lampu Penerangan Mati",
    time: "Kemarin, 16:30 PM",
    description: "Satu set lampu penerangan utama di lorong darurat Gedung A mati total. Perlu diganti segera demi visibilitas malam.",
    reporter: "Siti Rahma",
    victimName: "Semua Anggota (Dampak Visibilitas)",
    severity: "low",
  }
];

export default function InsidenPage() {
  // App States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedIncidentPhoto, setSelectedIncidentPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Stats States (dynamically calculated + updated)
  const [totalToday, setTotalToday] = useState(12);
  const [pendingCount, setPendingCount] = useState(3);

  // Form Field States
  const [reporterName, setReporterName] = useState("");
  const [victimName, setVictimName] = useState("");
  const [severity, setSeverity] = useState("low"); // low, medium, high, emergency
  const [description, setDescription] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFilePreview, setAttachedFilePreview] = useState(null);

  // Modals & Details states
  const [toast, setToast] = useState(null);

  // Load incidents from Supabase (with fallback to localStorage/INITIAL_INCIDENTS for first-run sync)
  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('insiden')
          .select('*')
          .order('tanggal', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped = data.map((inc, i) => {
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

            const sequentialNumber = data.length - i;

            return {
              id: inc.id,
              title: inc.tipe === "emergency" ? `#${sequentialNumber} - Darurat Medis` : `#${sequentialNumber} - Insiden Lapangan`,
              time: new Date(inc.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
              description: inc.deskripsi,
              reporter: inc.nama,
              victimName: extra.victimName || "Tidak ada",
              severity: inc.tipe,
              photo: extra.photo || null
            };
          });
          setIncidents(mapped);
          localStorage.setItem('she_incidents', JSON.stringify(mapped));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi insiden dengan Supabase:", err.message);
        const stored = localStorage.getItem('she_incidents');
        if (stored) {
          try {
            setIncidents(JSON.parse(stored));
          } catch (e) {
            setIncidents(INITIAL_INCIDENTS);
          }
        } else {
          setIncidents(INITIAL_INCIDENTS);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Severity style helper
  const getSeverityBadge = (level) => {
    switch (level) {
      case "emergency":
        return (
          <span className="bg-rose-50 text-rose-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Darurat
          </span>
        );
      case "high":
        return (
          <span className="bg-rose-50 text-rose-600 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-rose-100 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Tinggi
          </span>
        );
      case "medium":
        return (
          <span className="bg-amber-50 text-amber-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Sedang
          </span>
        );
      case "low":
        return (
          <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Rendah
          </span>
        );
      default:
        return null;
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
      triggerToast("Foto insiden berhasil dilampirkan!", "success");
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reporterName || !victimName || !description) {
      triggerToast("Mohon lengkapi nama pelapor, nama yang terkena insiden, dan catatan insiden!", "error");
      return;
    }

    setIsLoading(true);

    const extraPayload = {
      victimName: victimName,
      action: "Segera dilaporkan ke Puskesmas/Posko Utama KKN",
      photo: attachedFilePreview // Save the base64 image data!
    };

    try {
      const { data, error } = await supabase
        .from('insiden')
        .insert([
          {
            nama: reporterName,
            tipe: severity,
            lokasi: 'Posko KKN',
            deskripsi: description,
            tindakan: JSON.stringify(extraPayload),
            status: 'Ditangani',
            tanggal: new Date().toISOString().split('T')[0]
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const newIncident = {
          id: data[0].id,
          title: severity === "emergency" ? `Darurat Medis - Laporan Baru` : `Insiden Baru Lapangan`,
          time: "Hari Ini, Baru Saja",
          description: data[0].deskripsi,
          reporter: data[0].nama,
          victimName: victimName,
          severity: severity,
          photo: attachedFilePreview
        };

        const updatedList = [newIncident, ...incidents];
        setIncidents(updatedList);
        localStorage.setItem('she_incidents', JSON.stringify(updatedList));

        // Increment stats
        setTotalToday(prev => prev + 1);
        if (severity === "emergency" || severity === "high") {
          setPendingCount(prev => prev + 1);
        }

        // Reset Fields
        setReporterName("");
        setVictimName("");
        setDescription("");
        setSeverity("low");
        setAttachedFile(null);
        setAttachedFilePreview(null);

        triggerToast("Laporan insiden berhasil dikirim ke Pusat SHE!", "success");
      }
    } catch (err) {
      console.error(err);
      triggerToast(`Gagal mengirim laporan insiden: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen antialiased flex font-sans selection:bg-emerald-500 selection:text-white">
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

      {/* 1. SIDEBAR - Elegant white responsive drawer */}
      <aside className={`fixed left-0 top-0 h-full w-[260px] z-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col py-8 px-4 border-r border-slate-100 transition-transform duration-300 lg:hidden ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Mobile Close Button inside sidebar */}
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Brand / Logo */}
        <div className="px-3 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-500/20">
              S
            </div>
            <div>
              <h1 className="font-bold text-[15px] text-slate-900 leading-tight tracking-wide font-poppins">SHE Monitoring</h1>
              <p className="text-[10px] text-emerald-600 font-semibold tracking-normal mt-0.5 leading-snug">KKN PPM UGM Menyapa Komodo 2026</p>
            </div>
          </div>
        </div>

        {/* Navigation Menus - "Insiden" is highlighted */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <Navigation />
        </nav>

      </aside>

      {/* Main Content Wrapper */}
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
                placeholder="Cari laporan insiden..." 
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
            {/* Notification bell */}
            <button className="text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition-all rounded-full p-2.5 relative border border-slate-100">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            {/* Avatar Admin with interactive Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-50 border border-slate-100 transition-all focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/30">
                  <img 
                    alt="Admin Profile" 
                    className="w-full h-full object-cover" 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
                  />
                </div>
                <span className="font-semibold text-xs text-slate-700 pr-2 hidden md:block">Adelia Siregar</span>
                <span className="material-symbols-outlined text-slate-400 text-sm hidden md:block">keyboard_arrow_down</span>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2.5 z-50 animate-fade-in">
                  <div className="px-4.5 py-2.5 border-b border-slate-50 mb-1.5">
                    <p className="font-bold text-sm text-slate-800">Adelia Siregar</p>
                    <p className="text-[11px] text-slate-400">Koordinator SHE Lapangan</p>
                  </div>
                  <a href="#" className="flex items-center gap-2.5 px-4.5 py-2 text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                    <span className="material-symbols-outlined text-base">person</span> Profil Saya
                  </a>
                  <a href="#" className="flex items-center gap-2.5 px-4.5 py-2 text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                    <span className="material-symbols-outlined text-base">security</span> Kebijakan Privasi
                  </a>
                  <hr className="my-1.5 border-slate-100" />
                  <a href="#" className="flex items-center gap-2.5 px-4.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors">
                    <span className="material-symbols-outlined text-base">logout</span> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. WORKSPACE CANVAS */}
        <main className="flex-1 p-8 flex flex-col gap-7 max-w-7xl w-full mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-semibold mb-1">
              <Link href="/" className="hover:underline">Dashboard</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-400">Insiden</span>
            </div>
            <h1 className="font-poppins font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight">Insiden Keselamatan</h1>
            <p className="text-sm text-slate-500 font-medium">Laporkan insiden baru dan pantau penanganan masalah keamanan di lokasi kerja.</p>
          </div>

          {/* Bento Grid Layout (Form & Riwayat) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Laporan (Left Column - 7/12) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6.5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2.5 border-b border-slate-50 pb-4 mb-6">
                <span className="material-symbols-outlined text-emerald-600 text-xl">add_circle</span>
                <h3 className="font-poppins font-bold text-base text-slate-900">Buat Laporan Baru</h3>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs text-slate-700">
                {/* Member Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider" htmlFor="member-name">Nama Pelapor *</label>
                  <input 
                    required
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white shadow-inner transition-all" 
                    id="member-name" 
                    placeholder="Masukkan nama lengkap pelapor" 
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                  />
                </div>

                {/* Victim Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider" htmlFor="victim-name">Nama Anggota Terkena Insiden *</label>
                  <input 
                    required
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white shadow-inner transition-all" 
                    id="victim-name" 
                    placeholder="Masukkan nama korban / terdampak (atau 'Tidak Ada')" 
                    type="text"
                    value={victimName}
                    onChange={(e) => setVictimName(e.target.value)}
                  />
                </div>

                {/* Severity Selection - Redesigned custom radios */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">Tingkat Keparahan *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    
                    {/* Low */}
                    <label className="cursor-pointer">
                      <input 
                        className="peer sr-only" 
                        name="severity" 
                        type="radio" 
                        value="low"
                        checked={severity === "low"}
                        onChange={() => setSeverity("low")}
                      />
                      <div className="px-3 py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 peer-checked:bg-emerald-50 peer-checked:border-emerald-400 peer-checked:text-emerald-800 transition-all font-bold">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <span>Rendah</span>
                      </div>
                    </label>

                    {/* Medium */}
                    <label className="cursor-pointer">
                      <input 
                        className="peer sr-only" 
                        name="severity" 
                        type="radio" 
                        value="medium"
                        checked={severity === "medium"}
                        onChange={() => setSeverity("medium")}
                      />
                      <div className="px-3 py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 peer-checked:bg-amber-50 peer-checked:border-amber-400 peer-checked:text-amber-800 transition-all font-bold">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                        <span>Sedang</span>
                      </div>
                    </label>

                    {/* High */}
                    <label className="cursor-pointer">
                      <input 
                        className="peer sr-only" 
                        name="severity" 
                        type="radio" 
                        value="high"
                        checked={severity === "high"}
                        onChange={() => setSeverity("high")}
                      />
                      <div className="px-3 py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 peer-checked:bg-rose-50 peer-checked:border-rose-300 peer-checked:text-rose-800 transition-all font-bold">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                        <span>Tinggi</span>
                      </div>
                    </label>

                    {/* Emergency */}
                    <label className="cursor-pointer">
                      <input 
                        className="peer sr-only" 
                        name="severity" 
                        type="radio" 
                        value="emergency"
                        checked={severity === "emergency"}
                        onChange={() => setSeverity("emergency")}
                      />
                      <div className="px-3 py-3 rounded-xl border border-rose-100 flex items-center justify-center gap-2 bg-rose-50 text-rose-800 hover:bg-rose-100/50 peer-checked:bg-rose-500 peer-checked:border-rose-500 peer-checked:text-white transition-all font-extrabold shadow-inner">
                        <div className="w-2 h-2 rounded-full animate-ping bg-current" />
                        <span>Darurat</span>
                      </div>
                    </label>

                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider" htmlFor="description">Catatan & Kronologi Insiden *</label>
                  <textarea 
                    required
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white shadow-inner transition-all resize-none" 
                    id="description" 
                    placeholder="Jelaskan detail waktu, kronologi kejadian secara presisi, serta dampak cedera/kerusakan..." 
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Photo Upload Attachment */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider">Unggah Bukti Foto Lapangan</label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-5.5 flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={handleFileChange}
                    />
                    <span className="material-symbols-outlined text-slate-400 text-3xl">cloud_upload</span>
                    <span className="font-bold text-slate-600 text-xs">Klik atau seret file gambar ke sini</span>
                    <span className="text-[10px] text-slate-400 font-medium">Format maksimal 5MB (JPG, PNG)</span>

                    {/* Image Attachment Preview */}
                    {attachedFile && (
                      <div className="mt-2.5 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg text-[10px] font-bold animate-scale-up relative z-20">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        {attachedFile.name}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setAttachedFile(null);
                            setAttachedFilePreview(null);
                            triggerToast("Foto dihapus", "info");
                          }}
                          className="ml-1 text-slate-400 hover:text-rose-600"
                        >
                          <span className="material-symbols-outlined text-xs leading-none">close</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {attachedFilePreview && (
                    <div className="mt-2.5 p-2 bg-slate-50 border border-slate-100 rounded-2xl w-32 h-32 overflow-hidden shadow-inner relative animate-scale-up">
                      <img alt="Incident evidence preview" className="w-full h-full object-cover rounded-xl" src={attachedFilePreview} />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2 border-t border-slate-50 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-primary text-on-primary font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-emerald-500/10 hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    Kirim Laporan Insiden
                  </button>
                </div>
              </form>
            </div>

            {/* Riwayat & Timeline (Right Column - 5/12) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Timeline History Card */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6.5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-5 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-slate-400">history</span>
                    <h3 className="font-poppins font-bold text-base text-slate-900">Riwayat Terakhir</h3>
                  </div>
                  <button 
                    onClick={() => triggerToast("Semua riwayat telah dimuat!", "info")}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Lihat Semua
                  </button>
                </div>

                {/* Timeline Content */}
                <div className="relative pl-6 flex-1 overflow-y-auto space-y-7.5 pb-2">
                  {/* Timeline Line */}
                  <div className="absolute left-[5px] top-2.5 bottom-2.5 w-0.5 bg-slate-100"></div>
                  
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="relative pl-3 animate-pulse">
                        <div className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-slate-100 border border-white" />
                        <div className="h-3 bg-slate-100 rounded w-20 mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-36 mb-2" />
                        <div className="h-3.5 bg-slate-100 rounded w-full" />
                      </div>
                    ))
                  ) : incidents.length > 0 ? (
                    incidents.map((incident) => (
                      <div key={incident.id} className="relative pl-3 group animate-slide-down">
                        {/* Timeline Bullet Ring */}
                        <div className={`absolute -left-[26px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-inner group-hover:scale-125 transition-transform ${
                          incident.severity === "emergency" ? "bg-rose-500" :
                          incident.severity === "high" ? "bg-rose-400" :
                          incident.severity === "medium" ? "bg-amber-400" : "bg-emerald-400"
                        }`} />
                        
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2.5">
                            {getSeverityBadge(incident.severity)}
                            <span className="text-[10px] font-bold text-slate-400 tracking-wide">{incident.time}</span>
                          </div>
                          
                          <h4 className="font-poppins font-bold text-xs text-slate-800 mt-1 leading-tight group-hover:text-emerald-600 transition-colors">
                            {incident.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                            {incident.description}
                          </p>
                          {incident.photo && (
                            <button 
                              type="button"
                              onClick={() => setSelectedIncidentPhoto(incident.photo)}
                              className="mt-3 overflow-hidden rounded-3xl border border-slate-200 shadow-sm w-full max-w-xs transition hover:shadow-lg"
                            >
                              <img
                                src={incident.photo}
                                alt="Foto Insiden"
                                className="w-full h-40 object-cover"
                              />
                            </button>
                          )}
                          <div className="text-[10px] text-slate-400 font-semibold mt-1 flex flex-wrap gap-1.5 items-center">
                            <span>Pelapor: <span className="text-emerald-700 font-bold">{incident.reporter}</span></span>
                            <span className="text-slate-300">•</span>
                            <span>Korban/Terdampak: <span className="text-rose-600 font-bold">{incident.victimName || "Tidak Ada"}</span></span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-400 text-xs">Belum ada insiden terdaftar.</p>
                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>

          {selectedIncidentPhoto && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
              <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden bg-white shadow-2xl">
                <button
                  type="button"
                  onClick={() => setSelectedIncidentPhoto(null)}
                  className="absolute top-4 right-4 z-20 rounded-full bg-white/90 text-slate-700 shadow-lg p-2 hover:bg-white transition"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <img src={selectedIncidentPhoto} alt="Foto Insiden" className="w-full max-h-[80vh] object-contain bg-slate-900" />
              </div>
            </div>
          )}

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
