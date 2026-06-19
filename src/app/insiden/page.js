"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  // Height dynamic matching for Left & Right Column
  const leftCardRef = React.useRef(null);
  const [leftHeight, setLeftHeight] = useState("auto");

  useEffect(() => {
    const handleResize = () => {
      if (leftCardRef.current) {
        if (window.innerWidth >= 1024) {
          setLeftHeight(`${leftCardRef.current.offsetHeight}px`);
        } else {
          setLeftHeight("550px");
        }
      }
    };

    handleResize();

    let observer;
    if (leftCardRef.current) {
      observer = new ResizeObserver(handleResize);
      observer.observe(leftCardRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Stats States (dynamically calculated + updated)
  const [totalToday, setTotalToday] = useState(12);
  const [pendingCount, setPendingCount] = useState(3);

  // Form Field States
  const [reporterName, setReporterName] = useState("");
  const [victimName, setVictimName] = useState("Tidak Ada");
  const [selectedVictimId, setSelectedVictimId] = useState("");
  const [membersList, setMembersList] = useState([]);

  // Load members for incident report victim selection
  useEffect(() => {
    const fetchMembersForIncident = async () => {
      try {
        const { data, error } = await supabase
          .from('anggota')
          .select('id, nama, posko, catatan, kondisi')
          .order('nama', { ascending: true });

        if (error) throw error;

        if (data) {
          const sorted = [...data].sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
          setMembersList(sorted);
        }
      } catch (err) {
        console.error("Gagal mengambil data anggota untuk pilihan insiden:", err.message);
        // Fallback to local storage
        const stored = localStorage.getItem('she_members_v2');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const mData = parsed.data || [];
            const mapped = mData.map(m => ({
              id: m.id,
              nama: m.name,
              posko: m.village,
              catatan: JSON.stringify(m),
              kondisi: m.kondisi
            }));
            const sortedMapped = mapped.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));
            setMembersList(sortedMapped);
          } catch (e) {
            setMembersList([]);
          }
        }
      }
    };

    fetchMembersForIncident();
  }, []);

  const [severity, setSeverity] = useState("low"); // low, medium, high, emergency
  const [description, setDescription] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFilePreview, setAttachedFilePreview] = useState(null);

  // Modals & Details states
  const [toast, setToast] = useState(null);

  // Load incidents from Supabase (with fallback to localStorage/INITIAL_INCIDENTS for first-run sync)
  useEffect(() => {
    const CACHE_KEY = 'she_incidents_v2';
    const TTL = 60 * 60 * 1000; // 1 jam dalam milidetik

    // 1. Tampilkan data dari LocalStorage secara instan jika ada
    const stored = localStorage.getItem(CACHE_KEY);
    let hasStoredData = false;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.data && parsed.data.length > 0) {
          setIncidents(parsed.data);
          const age = Date.now() - parsed.timestamp;
          if (age < TTL) {
            setIsLoading(false); // Sembunyikan loading skeleton karena data cache sudah tampil
            hasStoredData = true;
          }
        }
      } catch (e) {
        console.error("Gagal parsing she_incidents_v2 dari localStorage", e);
      }
    }

    const fetchIncidents = async () => {
      if (!hasStoredData) {
        setIsLoading(true);
      }
      try {
        const { data, error } = await supabase
          .from('insiden')
          .select('id, nama, tipe, lokasi, deskripsi, tindakan, status, tanggal')
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
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: mapped,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        console.error("Gagal sinkronisasi insiden dengan Supabase:", err.message);
        if (!hasStoredData) {
          const storedFallback = localStorage.getItem(CACHE_KEY);
          if (storedFallback) {
            try {
              const parsed = JSON.parse(storedFallback);
              setIncidents(parsed.data || INITIAL_INCIDENTS);
            } catch (e) {
              setIncidents(INITIAL_INCIDENTS);
            }
          } else {
            setIncidents(INITIAL_INCIDENTS);
          }
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
        localStorage.setItem('she_incidents_v2', JSON.stringify({
          data: updatedList,
          timestamp: Date.now()
        }));

        // Increment stats
        setTotalToday(prev => prev + 1);
        if (severity === "emergency" || severity === "high") {
          setPendingCount(prev => prev + 1);
        }

        // Update member condition if a victim is selected
        if (selectedVictimId) {
          const targetKondisi = (severity === "emergency" || severity === "high") ? "Cedera" : "Sakit";
          const victimMember = membersList.find(m => String(m.id) === String(selectedVictimId));
          let updatedCatatan = "";
          if (victimMember && victimMember.catatan) {
            try {
              const extra = JSON.parse(victimMember.catatan);
              extra.medicalNotes = `Terkena insiden: ${description}`;
              updatedCatatan = JSON.stringify(extra);
            } catch (e) {
              updatedCatatan = JSON.stringify({ medicalNotes: `Terkena insiden: ${description}` });
            }
          } else {
            updatedCatatan = JSON.stringify({ medicalNotes: `Terkena insiden: ${description}` });
          }

          try {
            const { error: updateError } = await supabase
              .from('anggota')
              .update({
                kondisi: targetKondisi,
                catatan: updatedCatatan
              })
              .eq('id', selectedVictimId);

            if (updateError) throw updateError;

            // Update local state list of members
            setMembersList(prev => prev.map(m => String(m.id) === String(selectedVictimId) ? { ...m, kondisi: targetKondisi, catatan: updatedCatatan } : m));

            // Sync dengan localStorage she_members_v2
            const storedMembers = localStorage.getItem('she_members_v2');
            if (storedMembers) {
              try {
                const parsed = JSON.parse(storedMembers);
                if (parsed && parsed.data) {
                  const updated = parsed.data.map(m => String(m.id) === String(selectedVictimId) ? {
                    ...m,
                    kondisi: targetKondisi,
                    medicalNotes: `Terkena insiden: ${description}`,
                  } : m);
                  localStorage.setItem('she_members_v2', JSON.stringify({
                    data: updated,
                    timestamp: Date.now()
                  }));
                }
              } catch (e) {}
            }
          } catch (updateErr) {
            console.error("Gagal memperbarui status kesehatan anggota:", updateErr.message);
          }
        }

        // Reset Fields
        setReporterName("");
        setVictimName("Tidak Ada");
        setSelectedVictimId("");
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
          <Image src="/logo.png" alt="SHE Logo" width={120} height={48} className="h-12 w-auto object-contain" priority />
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
            <div 
              ref={leftCardRef}
              className="lg:col-span-7 bg-white rounded-3xl p-6.5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md transition-shadow duration-300"
            >
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

                {/* Victim Name Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider" htmlFor="victim-select">Nama Anggota Terkena Insiden *</label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white shadow-inner transition-all appearance-none cursor-pointer pr-10" 
                      id="victim-select"
                      value={selectedVictimId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedVictimId(val);
                        if (val === "") {
                          setVictimName("Tidak Ada");
                        } else {
                          const m = membersList.find(member => String(member.id) === String(val));
                          setVictimName(m ? m.nama : "Tidak Ada");
                        }
                      }}
                    >
                      <option value="">Tidak Ada (Hanya Fasilitas / Lainnya)</option>
                      {membersList.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nama} ({m.posko || "Warloka Pesisir"}) - [{m.kondisi || "Sehat"}]
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <span className="material-symbols-outlined text-sm">unfold_more</span>
                    </div>
                  </div>
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
            <div 
              className="lg:col-span-5 flex flex-col gap-6"
              style={{ height: leftHeight }}
            >
              
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
                              <Image
                                src={incident.photo}
                                alt="Foto Insiden"
                                className="w-full h-40 object-cover"
                                width={320}
                                height={160}
                                unoptimized
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
                <Image src={selectedIncidentPhoto} alt="Foto Insiden" className="w-full max-h-[80vh] object-contain bg-slate-900" width={900} height={600} unoptimized />
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
