"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import Navigation from '../../components/Navigation';

// Detailed mock emergency contacts with regional categorizations
const CONTACTS_DATA = [
  // DI Yogyakarta
  {
    id: "CON-DIY-001",
    name: "Panggilan Darurat Umum",
    type: "Darurat Umum",
    phone: "112",
    region: "DI Yogyakarta",
    category: "police",
    description: "Nomor darurat bebas pulsa nasional dari ponsel mana saja (bisa diakses dalam kondisi kartu SIM terkunci/tanpa pulsa)."
  },
  {
    id: "CON-DIY-002",
    name: "Ambulans Gawat Darurat Kemenkes",
    type: "Medis",
    phone: "119",
    region: "DI Yogyakarta",
    category: "hospital",
    description: "Layanan gawat darurat medis terintegrasi Kementerian Kesehatan RI."
  },
  {
    id: "CON-DIY-003",
    name: "SAR DIY Basarnas",
    type: "SAR",
    phone: "115",
    region: "DI Yogyakarta",
    category: "fire",
    description: "Badan Nasional Pencarian dan Pertolongan RI (Search and Rescue) wilayah DIY."
  },
  {
    id: "CON-DIY-004",
    name: "SAR DIY Landline",
    type: "SAR",
    phone: "(0274) 587 559",
    region: "DI Yogyakarta",
    category: "fire",
    description: "Layanan telepon kabel kantor SAR DIY."
  },
  {
    id: "CON-DIY-005",
    name: "PMI DIY",
    type: "Kesehatan",
    phone: "(0274) 372 176",
    region: "DI Yogyakarta",
    category: "hospital",
    description: "Palang Merah Indonesia wilayah Daerah Istimewa Yogyakarta."
  },
  {
    id: "CON-DIY-006",
    name: "Polda DIY",
    type: "Kepolisian",
    phone: "(0274) 563 494",
    region: "DI Yogyakarta",
    category: "police",
    description: "Markas Kepolisian Daerah Daerah Istimewa Yogyakarta."
  },
  {
    id: "CON-DIY-007",
    name: "Polresta Yogyakarta",
    type: "Kepolisian",
    phone: "(0274) 543 920",
    region: "DI Yogyakarta",
    category: "police",
    description: "Markas Kepolisian Resor Kota Yogyakarta."
  },
  {
    id: "CON-DIY-008",
    name: "Polres Sleman",
    type: "Kepolisian",
    phone: "(0274) 868 410",
    region: "DI Yogyakarta",
    category: "police",
    description: "Markas Kepolisian Resor Sleman."
  },
  {
    id: "CON-DIY-009",
    name: "Polres Bantul",
    type: "Kepolisian",
    phone: "(0274) 367 410",
    region: "DI Yogyakarta",
    category: "police",
    description: "Markas Kepolisian Resor Bantul."
  },
  {
    id: "CON-DIY-010",
    name: "RSU Dr. Sardjito",
    type: "Kesehatan",
    phone: "(0274) 587 333",
    region: "DI Yogyakarta",
    category: "hospital",
    description: "Rumah Sakit Umum Pusat Dr. Sardjito Yogyakarta (Rujukan Utama)."
  },

  // Labuan Bajo & Kec. Komodo
  {
    id: "CON-LBJ-001",
    name: "Layanan Polisi Terintegrasi",
    type: "Keamanan",
    phone: "110",
    region: "Labuan Bajo & Kec. Komodo",
    category: "police",
    description: "Layanan kepolisian darurat terintegrasi nasional."
  },
  {
    id: "CON-LBJ-002",
    name: "Hotline Polres Manggarai Barat (24 Jam)",
    type: "Keamanan",
    phone: "0811-3832-006",
    region: "Labuan Bajo & Kec. Komodo",
    category: "police",
    description: "Pusat pengaduan dan bantuan keamanan 24 jam Polres Manggarai Barat."
  },
  {
    id: "CON-LBJ-003",
    name: "Pos SAR Labuan Bajo",
    type: "Penyelamatan",
    phone: "115",
    region: "Labuan Bajo & Kec. Komodo",
    category: "fire",
    description: "Pos Pencarian dan Pertolongan (Basarnas) Labuan Bajo."
  },
  {
    id: "CON-LBJ-004",
    name: "RSUD Komodo Golo Bilas",
    type: "Kesehatan",
    phone: "0813-3705-5250",
    region: "Labuan Bajo & Kec. Komodo",
    category: "hospital",
    description: "Rumah Sakit Umum Daerah Komodo, Golo Bilas."
  },
  {
    id: "CON-LBJ-005",
    name: "RS Siloam Labuan Bajo (Emergency)",
    type: "Kesehatan",
    phone: "(0385) 2381 911",
    region: "Labuan Bajo & Kec. Komodo",
    category: "hospital",
    description: "Unit Gawat Darurat (UGD) Siloam Hospitals Labuan Bajo."
  },
  {
    id: "CON-LBJ-006",
    name: "RS Siloam Labuan Bajo (Hotline)",
    type: "Kesehatan",
    phone: "1500-911",
    region: "Labuan Bajo & Kec. Komodo",
    category: "hospital",
    description: "Layanan hotline/telepon umum Siloam Hospitals Labuan Bajo."
  },
  {
    id: "CON-LBJ-007",
    name: "Layanan Cepat Tanggap Kesehatan (PSC)",
    type: "Kesehatan",
    phone: "119",
    region: "Labuan Bajo & Kec. Komodo",
    category: "hospital",
    description: "Public Safety Center (PSC) layanan tanggap darurat medis cepat."
  }
];

export default function EmergencyPage() {
  // App States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState(CONTACTS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calling Simulator Modal State
  const [activeCall, setActiveCall] = useState(null); // holds contact object when dialing
  const [callDuration, setCallDuration] = useState(0);
  const [isRinging, setIsRinging] = useState(true);

  // Chat Simulator Modal State
  const [activeChat, setActiveChat] = useState(null); // holds contact object
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // SOS Countdown Modal State
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosActive, setSosActive] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Load contacts from Supabase (with fallback to localStorage/CONTACTS_DATA for first-run sync)
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('kontak_darurat')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map(con => {
            // Deduce category (map DB 'sar' to app 'fire' icon)
            let cat = con.category === "sar" ? "fire" : con.category;

            return {
              id: con.id,
              name: con.name,
              type: con.type || "Umum",
              phone: con.phone,
              region: con.region || "Lokal",
              category: cat,
              description: con.description || ""
            };
          });
          setContacts(mapped);
          localStorage.setItem('she_contacts', JSON.stringify(mapped));
        } else {
          // If empty, pre-populate table with CONTACTS_DATA!
          const insertPayload = CONTACTS_DATA.map(con => ({
            name: con.name,
            type: con.type,
            phone: con.phone,
            region: con.region,
            description: con.description,
            category: con.category === "fire" ? "sar" : con.category
          }));

          const { data: insertedData, error: insertError } = await supabase
            .from('kontak_darurat')
            .insert(insertPayload)
            .select();

          if (insertError) {
            console.error("Gagal inisialisasi kontak darurat:", insertError.message);
            setContacts(CONTACTS_DATA);
          } else if (insertedData) {
            const mappedInserted = insertedData.map(con => {
              let cat = con.category === "sar" ? "fire" : con.category;
              return {
                id: con.id,
                name: con.name,
                type: con.type || "Umum",
                phone: con.phone,
                region: con.region || "Lokal",
                category: cat,
                description: con.description || ""
              };
            });
            setContacts(mappedInserted);
            localStorage.setItem('she_contacts', JSON.stringify(mappedInserted));
          }
        }
      } catch (err) {
        console.error("Gagal sinkronisasi kontak darurat dengan Supabase:", err.message);
        const stored = localStorage.getItem('she_contacts');
        if (stored) {
          try {
            setContacts(JSON.parse(stored));
          } catch (e) {
            setContacts(CONTACTS_DATA);
          }
        } else {
          setContacts(CONTACTS_DATA);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Call duration counter simulation
  useEffect(() => {
    let interval = null;
    if (activeCall && !isRinging) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCall, isRinging]);

  // SOS countdown effect
  useEffect(() => {
    let interval = null;
    if (showSosModal && sosCountdown > 0 && !sosActive) {
      interval = setInterval(() => {
        setSosCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showSosModal && sosCountdown === 0 && !sosActive) {
      setSosActive(true);
      triggerToast("ALARM DARURAT SOS DIKIRIM KE PUSAT KONTROL!", "error");
    }
    return () => clearInterval(interval);
  }, [showSosModal, sosCountdown, sosActive]);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.region.toLowerCase().includes(query) ||
      c.type.toLowerCase().includes(query)
    );
  });

  // Call handlers
  const handleStartCall = (contact) => {
    if (contact.phone.toLowerCase().includes("hubungi")) {
      triggerToast("Silakan catat kontak personal Kepala Desa/Bidan saat tiba di lokasi.", "info");
      return;
    }
    setActiveCall(contact);
    setIsRinging(true);
    // Simulate ringing for 2 seconds then answering
    setTimeout(() => {
      setIsRinging(false);
    }, 2000);
  };

  const handleEndCall = () => {
    setActiveCall(null);
    triggerToast("Panggilan suara diakhiri", "info");
  };

  // Chat handlers
  const handleOpenChat = (contact) => {
    setActiveChat(contact);
    setChatHistory([
      { sender: "system", text: `Mulai obrolan darurat dengan ${contact.name}` }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { sender: "user", text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    const currentMessage = chatMessage;
    setChatMessage("");

    // Simulate clinical desk automatic reply
    setTimeout(() => {
      const responseMsg = { 
        sender: "agent", 
        text: `Diterima. Laporan Anda: "${currentMessage}" sedang kami teruskan ke petugas medis terdekat. Tetap tenang.` 
      };
      setChatHistory(prev => [...prev, responseMsg]);
    }, 1500);
  };

  // SOS handlers
  const handleTriggerSos = () => {
    setSosCountdown(5);
    setSosActive(false);
    setShowSosModal(true);
  };

  const handleCancelSos = () => {
    setShowSosModal(false);
    setSosActive(false);
    triggerToast("Pengiriman SOS dibatalkan.", "info");
  };

  // Helper format seconds
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Contacts by region
  const regions = [
    "Labuan Bajo & Kec. Komodo",
    "DI Yogyakarta"
  ];

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
          <img src="/logo.png" alt="SHE Logo" className="h-12 w-auto object-contain" />
        </div>

        {/* Navigation Menus - "Emergency Contact" is highlighted */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">dashboard</span>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/anggota"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">group</span>
            <span>Anggota</span>
          </Link>

          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/aktivitas"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">task_alt</span>
            <span>Aktivitas Harian</span>
          </Link>

          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/insiden"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">report_problem</span>
            <span>Insiden</span>
          </Link>

          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/kesehatan"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">favorite</span>
            <span>Kesehatan Anggota</span>
          </Link>

          <Link 
            className="bg-emerald-50/80 text-emerald-700 font-bold rounded-xl pl-3.5 pr-4 py-3 flex items-center gap-3.5 border-l-4 border-emerald-500 transition-all text-[14px]" 
            href="/emergency"
          >
            <span className="material-symbols-outlined text-xl text-emerald-600" style={{ fontVariationSettings: '"FILL" 1' }}>contact_phone</span>
            <span>Emergency Contact</span>
          </Link>
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
                placeholder="Cari kontak darurat..." 
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
        <main className="flex-1 p-8 flex flex-col gap-8 max-w-7xl w-full mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-semibold mb-1">
                <Link href="/" className="hover:underline">Dashboard</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-400">Kontak Darurat</span>
              </div>
              <h2 className="font-poppins font-extrabold text-2xl md:text-3xl text-slate-950 tracking-tight">Kontak Darurat</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Akses cepat menuju tim penanganan taktis, klinik medis, dan kepolisian di seluruh wilayah kerja.</p>
            </div>
            
            {/* Search within page header (right aligned) */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" 
                placeholder="Cari kontak darurat..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Catatan Penting Lapangan Banner */}
          <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start animate-fade-in shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
              <span className="material-symbols-outlined text-lg">info</span>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-poppins font-extrabold text-xs text-amber-800 tracking-wide uppercase">Catatan Penting Lapangan</h4>
              <ul className="list-disc pl-4.5 text-[11px] text-amber-700/90 font-semibold leading-relaxed flex flex-col gap-1">
                <li>Nomor darurat nasional seperti 112, 110, dan 119 bisa diakses tanpa pulsa.</li>
                <li>Untuk wilayah Warloka Pesisir dan Golo Mori, sangat disarankan segera mencatat nomor HP Kepala Desa, Bhabinkamtibmas, dan Babinsa setempat begitu tiba di lokasi karena penanganan tercepat berbasis komunitas lokal.</li>
              </ul>
            </div>
          </div>

          {isLoading ? (
            // Animated pulse rows skeleton
            <div className="flex flex-col gap-3.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse h-[60px]" />
              ))}
            </div>
          ) : (
            // Render Regions
            regions.map((region) => {
              const regionContacts = filteredContacts.filter(c => c.region === region);
              if (regionContacts.length === 0) return null;

              return (
                <section key={region} className="flex flex-col gap-4 animate-slide-down">
                  <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3 py-1 bg-slate-50 rounded-r-lg border-y border-r border-slate-100">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px]">location_on</span>
                    <h3 className="font-poppins font-extrabold text-[13px] text-slate-800 tracking-wide uppercase">{region}</h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    {regionContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all duration-200 group"
                      >
                        {/* Left: Icon and Meta Info */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Icon Badge */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            contact.category === "hospital" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                            contact.category === "police" ? "bg-sky-50 text-sky-600 border border-sky-100" :
                            "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            <span className="material-symbols-outlined text-lg leading-none">
                              {contact.category === "hospital" ? "local_hospital" :
                               contact.category === "police" ? "local_police" : "local_fire_department"}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-poppins font-bold text-[13px] text-slate-900 leading-tight">
                                {contact.name}
                              </h4>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                                contact.category === "hospital" ? "bg-rose-50/50 text-rose-700 border-rose-100" :
                                contact.category === "police" ? "bg-sky-50/50 text-sky-700 border-sky-100" :
                                "bg-amber-50/50 text-amber-700 border-amber-100"
                              }`}>
                                {contact.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed truncate max-w-2xl hidden md:block">
                              {contact.description}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed sm:hidden block">
                              {contact.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Phone & Call Action Buttons */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                          {/* Phone Number Display */}
                          <div className="flex items-center gap-1.5 font-poppins font-bold text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <span className="material-symbols-outlined text-slate-400 text-sm leading-none">phone</span>
                            <span className="tracking-wide select-all">{contact.phone}</span>
                          </div>

                          {/* Action Button */}
                          <button 
                            onClick={() => handleStartCall(contact)}
                            className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-[10.5px] px-3.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm shadow-rose-500/10 active:scale-95 transition-all duration-150 shrink-0"
                          >
                            <span className="material-symbols-outlined text-[11px] leading-none">call</span>
                            Hubungi
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          )}

          {/* Zero Search State */}
          {!isLoading && filteredContacts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-scale-up">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">contact_support</span>
              <h3 className="font-poppins font-bold text-slate-700 text-sm">Kontak Tidak Ditemukan</h3>
              <p className="text-xs text-slate-400 mt-1">Tidak ada hasil yang cocok untuk kata kunci "{searchQuery}"</p>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="w-full py-6 mt-auto border-t border-slate-100 bg-white flex items-center justify-center px-6 text-slate-400 text-center z-20 relative">
          <p className="text-[11px] font-semibold tracking-wide text-slate-400/90 leading-relaxed">
            © 2026 SHE Monitoring Sistem Menyapa Komodo 2026
          </p>
        </footer>
      </div>

      {/* Sticky SOS Red Floating Button - With pulse ripple effect */}
      <button 
        onClick={handleTriggerSos}
        className="fixed bottom-8 right-8 w-16 h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-[0_10px_30px_rgba(225,29,72,0.3)] hover:shadow-[0_15px_35px_rgba(225,29,72,0.45)] flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 z-50 group border-4 border-white animate-pulse"
        title="SOS - DARURAT"
      >
        <span className="material-symbols-outlined text-2xl group-hover:animate-bounce" style={{ fontVariationSettings: '"FILL" 1' }}>sos</span>
      </button>

      {/* ============================================================ */}
      {/* 4. ACTIVE CALL SIMULATOR MODAL (Premium Outgoing VoIP) */}
      {/* ============================================================ */}
      {activeCall && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-8 text-center text-white shadow-2xl relative overflow-hidden animate-scale-up">
            
            {/* Soft backdrop glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* VoIP Category Icon Badge */}
            <div className="w-20 h-20 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center mb-6 relative">
              <span className="material-symbols-outlined text-3xl text-emerald-400 animate-pulse">call</span>
              {/* Spinning active ring */}
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-transparent animate-spin" />
            </div>

            {/* Calling Details */}
            <h3 className="font-poppins font-extrabold text-lg tracking-tight mb-1">{activeCall.name}</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">{activeCall.type}</p>
            
            {/* Status indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-emerald-400 font-bold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              {isRinging ? "Menghubungkan..." : "Panggilan Aktif"}
            </div>

            {/* Dialed Number Display */}
            <div className="font-mono text-xl font-bold tracking-widest text-slate-300 bg-slate-950/60 py-3 rounded-2xl border border-slate-800 mb-8">
              {activeCall.phone}
            </div>

            {/* Call duration or Ringing */}
            <div className="text-slate-400 text-sm font-semibold mb-10 h-6">
              {isRinging ? "Berdering (Ringing)..." : formatTime(callDuration)}
            </div>

            {/* Dialpad Mic Speaker Controls */}
            <div className="grid grid-cols-3 gap-4.5 mb-10 max-w-[240px] mx-auto">
              <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-lg">mic_off</span>
              </button>
              <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-lg">volume_up</span>
              </button>
              <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-300">
                <span className="material-symbols-outlined text-lg">dialpad</span>
              </button>
            </div>

            {/* Red End Call Action Button */}
            <button 
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-900/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-2xl">call_end</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. WHATSAPP CHAT Darurat SIMULATOR MODAL */}
      {/* ============================================================ */}
      {activeChat && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[500px] animate-scale-up">
            
            {/* Header Whatsapp layout */}
            <div className="bg-emerald-600 text-white px-5 py-4.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  🏪
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-xs leading-none">{activeChat.name}</h3>
                  <p className="text-[10px] text-emerald-100 font-semibold mt-1">Meja Siaga Darurat</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveChat(null)}
                className="w-8 h-8 rounded-full bg-emerald-700/50 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Chat Messages Log Area */}
            <div className="flex-1 overflow-y-auto p-4.5 bg-slate-50 space-y-3.5 flex flex-col text-xs">
              {chatHistory.map((msg, index) => {
                if (msg.sender === "system") {
                  return (
                    <div key={index} className="text-center text-[10px] text-slate-400 font-bold bg-slate-100/80 py-1 px-3.5 rounded-full mx-auto self-center">
                      {msg.text}
                    </div>
                  );
                }
                const isUser = msg.sender === "user";
                return (
                  <div 
                    key={index}
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm leading-relaxed ${
                      isUser 
                      ? "bg-emerald-600 text-white rounded-tr-none self-end font-semibold" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none self-start font-medium"
                    }`}
                  >
                    {msg.text}
                  </div>
                );
              })}
            </div>

            {/* Message Templates bar */}
            <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex gap-2 overflow-x-auto shrink-0">
              <button 
                onClick={() => setChatMessage("TOLONG! Ada kecelakaan kerja di Sektor C tambang!")}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-lg px-3 py-1.5 text-[9px] font-bold text-slate-600 shrink-0 shadow-sm"
              >
                🚨 Cedera Tambang
              </button>
              <button 
                onClick={() => setChatMessage("Butuh mobil ambulans ke Mess Warloka segera!")}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-lg px-3 py-1.5 text-[9px] font-bold text-slate-600 shrink-0 shadow-sm"
              >
                🚑 Panggil Ambulans
              </button>
            </div>

            {/* Input Message box footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
              <input 
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                placeholder="Tulis pesan darurat..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-colors"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. CRITICAL SOS SYSTEM MODAL (Broadcasting GPS/ Distress Alert) */}
      {/* ============================================================ */}
      {showSosModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl relative overflow-hidden animate-scale-up border-4 border-rose-600">
            
            {/* Alarm Siren Circle */}
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 relative ${
              sosActive ? "bg-rose-600 text-white animate-ping" : "bg-rose-50 text-rose-600"
            }`}>
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>sos</span>
            </div>

            {sosActive ? (
              <div className="animate-scale-up">
                <h3 className="font-poppins font-extrabold text-xl text-rose-600 mb-2">SOS DIKIRIM!</h3>
                <p className="text-slate-600 text-xs font-semibold leading-relaxed mb-8">
                  Sinyal bahaya & koordinat GPS Anda telah dipancarkan secara prioritas ke Pusat Kontrol Keamanan KORMA SHE Monitoring! Tetap berada di posisi aman.
                </p>

                <button 
                  onClick={() => setShowSosModal(false)}
                  className="w-full bg-slate-900 hover:bg-black text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-colors"
                >
                  Tutup Peringatan
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-poppins font-extrabold text-xl text-slate-800 mb-2">PEMANCAR SOS SEGERA DIAKTIFKAN</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                  Menyiarkan sinyal evakuasi darurat prioritas utama. Pusat SHE akan melacak koordinat Anda secara instan.
                </p>

                {/* Circular Countdown Progress */}
                <div className="font-poppins font-extrabold text-4xl text-rose-500 mb-10 select-none">
                  {sosCountdown}
                </div>

                <div className="flex flex-col gap-3">
                  {/* Cancel Button */}
                  <button 
                    onClick={handleCancelSos}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-colors"
                  >
                    Batalkan Pengiriman (Cancel)
                  </button>
                  <button 
                    onClick={() => setSosCountdown(0)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    Kirim Sekarang Tanpa Menunggu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
