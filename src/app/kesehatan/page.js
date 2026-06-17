"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';
import Navigation from '../../components/Navigation';

export default function KesehatanPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKondisi, setFilterKondisi] = useState("all");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Update Modal State
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formKondisi, setFormKondisi] = useState("Sehat");
  const [formMedicalNotes, setFormMedicalNotes] = useState("");

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('anggota')
          .select('*')
          .order('nama', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedData = data.map(m => {
            let extra = {};
            if (m.catatan) {
              try {
                extra = JSON.parse(m.catatan);
              } catch (e) {
                extra = { medicalNotes: m.catatan };
              }
            }
            return {
              id: m.id,
              name: m.nama,
              posko: m.posko || "Warloka Pesisir",
              kondisi: m.kondisi || "Sehat",
              medicalHistory: extra.medicalHistory || "Tidak ada riwayat",
              medicalNotes: extra.medicalNotes || "Sehat walafiat",
              profilePic: extra.profilePic || `https://i.pravatar.cc/150?u=${m.id}`,
              fullData: m // Keep original DB row for update preservation
            };
          });
          setMembers(mappedData);
        }
      } catch (err) {
        console.error("Gagal mengambil data kesehatan:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesKondisi = true;
      if (filterKondisi !== "all") {
        const k = member.kondisi.toLowerCase();
        if (filterKondisi === "sehat") matchesKondisi = k.includes("sehat") || k.includes("fit");
        else if (filterKondisi === "sakit") matchesKondisi = k.includes("sakit") || k.includes("kurang");
        else if (filterKondisi === "cedera") matchesKondisi = k.includes("cedera") || k.includes("luka");
      }
      return matchesSearch && matchesKondisi;
    });
  }, [members, searchQuery, filterKondisi]);

  // Dashboard Stats
  const stats = useMemo(() => {
    const total = members.length;
    const healthy = members.filter(m => {
      const k = m.kondisi.toLowerCase();
      return k.includes("sehat") || k.includes("fit");
    }).length;
    const sick = members.filter(m => {
      const k = m.kondisi.toLowerCase();
      return k.includes("sakit") || k.includes("kurang");
    }).length;
    const injured = members.filter(m => {
      const k = m.kondisi.toLowerCase();
      return k.includes("cedera") || k.includes("luka");
    }).length;
    return { total, healthy, sick, injured };
  }, [members]);

  const openUpdateModal = (member) => {
    setSelectedMember(member);
    
    // Normalize string to select standard radio button
    const k = member.kondisi.toLowerCase();
    let standardizedKondisi = "Sehat";
    if (k.includes("sakit") || k.includes("kurang")) standardizedKondisi = "Sakit";
    if (k.includes("cedera") || k.includes("luka")) standardizedKondisi = "Cedera";
    
    setFormKondisi(standardizedKondisi);
    setFormMedicalNotes(member.medicalNotes);
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Re-serialize extra properties to keep them intact
      let extra = {};
      if (selectedMember.fullData.catatan) {
         try { extra = JSON.parse(selectedMember.fullData.catatan); } catch(e) {}
      }
      extra.medicalNotes = formMedicalNotes; // Update only medical notes

      const { error } = await supabase
        .from('anggota')
        .update({
          kondisi: formKondisi,
          catatan: JSON.stringify(extra)
        })
        .eq('id', selectedMember.id);

      if (error) throw error;

      // Update local state instantly
      const updatedList = members.map(m => m.id === selectedMember.id ? {
        ...m,
        kondisi: formKondisi,
        medicalNotes: formMedicalNotes,
        fullData: {
          ...m.fullData,
          kondisi: formKondisi,
          catatan: JSON.stringify(extra)
        }
      } : m);

      setMembers(updatedList);
      triggerToast("Kondisi kesehatan berhasil diperbarui!");
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      triggerToast(`Gagal memperbarui: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getKondisiBadge = (kondisi) => {
    const k = kondisi.toLowerCase();
    if (k.includes("sakit") || k.includes("kurang")) {
      return (
        <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-amber-200 flex items-center gap-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Sakit
        </span>
      );
    } else if (k.includes("cedera") || k.includes("luka")) {
      return (
        <span className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-rose-200 flex items-center gap-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Cedera
        </span>
      );
    } else {
      return (
        <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-emerald-200 flex items-center gap-1.5 w-fit">
          <span className="material-symbols-outlined text-[12px] leading-none">check_circle</span> Sehat
        </span>
      );
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen antialiased flex font-sans selection:bg-emerald-500 selection:text-white relative">
      
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

      {/* SIDEBAR */}
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
          <Image src="/logo.png" alt="SHE Logo" width={120} height={48} className="h-12 w-auto object-contain" priority />
        </div>

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <Link className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" href="/">
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" href="/anggota">
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">group</span>
            <span>Anggota</span>
          </Link>
          <Link className="bg-emerald-50/80 text-emerald-700 font-bold rounded-xl pl-3.5 pr-4 py-3 flex items-center gap-3.5 border-l-4 border-emerald-500 transition-all text-[14px]" href="/kesehatan">
            <span className="material-symbols-outlined text-xl text-emerald-600" style={{ fontVariationSettings: '"FILL" 1' }}>monitor_heart</span>
            <span>Kesehatan Anggota</span>
          </Link>
          <Link className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" href="/aktivitas">
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">task_alt</span>
            <span>Aktivitas Harian</span>
          </Link>
          <Link className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" href="/insiden">
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">report_problem</span>
            <span>Insiden</span>
          </Link>
          <Link className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" href="/emergency">
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">contact_phone</span>
            <span>Emergency Contact</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden w-full">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-50/60 via-slate-50/30 to-transparent -z-10" />

        {/* TOPBAR */}
        <header className="sticky top-0 w-full z-30 border-b border-slate-100 bg-white/70 backdrop-blur-md shadow-sm flex justify-between items-center h-20 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-emerald-600 hover:bg-slate-50 p-2.5 rounded-xl transition-all border border-slate-100 mr-1"
            >
              <span className="material-symbols-outlined text-xl leading-none">menu</span>
            </button>
            <h2 className="font-poppins font-bold text-lg lg:text-xl text-slate-800 hidden sm:block">SHE Dashboard</h2>
            
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-slate-800 w-44 sm:w-60 md:w-80 shadow-inner" 
                placeholder="Cari anggota..." 
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

        <main className="flex-1 p-8 flex flex-col gap-6.5 max-w-7xl w-full mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 font-bold text-[10px] tracking-wide uppercase mb-3 border border-teal-100">
                <span className="material-symbols-outlined text-sm">health_and_safety</span>
                Health Center
              </div>
              <h1 className="text-3xl font-poppins font-extrabold text-slate-900 tracking-tight">Kesehatan Anggota</h1>
              <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
                Pantau kondisi medis, riwayat penyakit, dan status kesehatan seluruh anggota KKN di lapangan secara real-time.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 -z-10"></div>
              <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center border border-slate-100 mb-4">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Anggota</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-poppins font-extrabold text-slate-800">{stats.total}</h3>
                  <span className="text-xs text-slate-400 font-medium">Orang</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 -z-10"></div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 mb-4 shadow-inner">
                <span className="material-symbols-outlined">favorite</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-600/80 uppercase tracking-wider mb-1">Kondisi Sehat</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-poppins font-extrabold text-emerald-600">{stats.healthy}</h3>
                  <span className="text-xs text-emerald-600/60 font-medium">Orang</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 -z-10"></div>
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 mb-4 shadow-inner">
                <span className="material-symbols-outlined">coronavirus</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-orange-600/80 uppercase tracking-wider mb-1">Kondisi Sakit</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-poppins font-extrabold text-orange-500">{stats.sick}</h3>
                  <span className="text-xs text-orange-500/60 font-medium">Orang</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-red-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-red-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 -z-10"></div>
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 mb-4 shadow-inner animate-pulse">
                <span className="material-symbols-outlined">personal_injury</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-red-600/80 uppercase tracking-wider mb-1">Kondisi Cedera</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-poppins font-extrabold text-red-600">{stats.injured}</h3>
                  <span className="text-xs text-red-600/60 font-medium">Orang</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and List */}
          <div className="flex flex-col gap-6 mt-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xs">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama anggota..."
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => setFilterKondisi("all")} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterKondisi === "all" ? "bg-slate-800 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>
                  Semua Status
                </button>
                <button onClick={() => setFilterKondisi("sehat")} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterKondisi === "sehat" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 border border-emerald-500" : "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50"}`}>
                  Sehat
                </button>
                <button onClick={() => setFilterKondisi("sakit")} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterKondisi === "sakit" ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 border border-amber-500" : "bg-white text-amber-600 border border-amber-200 hover:bg-amber-50"}`}>
                  Sakit
                </button>
                <button onClick={() => setFilterKondisi("cedera")} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterKondisi === "cedera" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20 border border-rose-500" : "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50"}`}>
                  Cedera
                </button>
              </div>
            </div>

            {/* Cards Layout - Responsive untuk Desktop dan Mobile */}
            <div className="p-4 md:p-6 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="animate-pulse bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-3.5 h-fit">
                    <div className="flex gap-3">
                      <div className="w-11 h-11 bg-slate-100 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-100 rounded w-32 mb-1.5" />
                        <div className="h-3 bg-slate-100 rounded w-44" />
                      </div>
                    </div>
                    <div className="h-6 bg-slate-100 rounded-full w-24" />
                    <div className="h-8 bg-slate-100 rounded-xl w-full" />
                    <div className="h-8 bg-slate-100 rounded-xl w-full" />
                    <div className="flex justify-end gap-2 mt-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-3.5 group h-fit"
                  >
                    {/* Header dengan profil */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500/20 shadow-sm flex-shrink-0">
                        <Image alt={member.name} className="w-full h-full object-cover" src={member.profilePic} width={44} height={44} unoptimized />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-slate-800 font-poppins leading-tight line-clamp-2">
                          {member.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-1.5">
                          <span className="material-symbols-outlined text-[10px]">location_on</span>
                          {member.posko}
                        </p>
                      </div>
                    </div>

                    {/* Status Kesehatan Badge */}
                    <div className="pt-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Status Kesehatan</p>
                      {getKondisiBadge(member.kondisi)}
                    </div>

                    {/* Medical Info */}
                    <div className="border-t border-slate-50 pt-3 flex flex-col gap-2">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Riwayat</p>
                        <p className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 line-clamp-2">
                          {member.medicalHistory}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Catatan Medis</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed bg-emerald-50/40 px-2.5 py-1.5 rounded-lg border border-emerald-100/40 line-clamp-2">
                          {member.medicalNotes}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-2 mt-auto">
                      <button 
                        onClick={() => openUpdateModal(member)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-[11px] font-semibold border border-emerald-200 shadow-sm"
                        title="Update Status Medis"
                      >
                        <span className="material-symbols-outlined text-base">edit_note</span>
                        <span className="hidden sm:inline">Update</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white border border-slate-100 rounded-2xl p-8">
                  <span className="material-symbols-outlined text-slate-300 text-4xl mb-2 block">medical_information</span>
                  <p className="text-slate-500 text-sm font-medium">Tidak ada anggota yang ditemukan dengan status ini.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* UPDATE MODAL */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div 
            className="absolute inset-0" 
            onClick={() => !isLoading && setShowEditModal(false)}
          />
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-slide-up border border-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white relative z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">healing</span>
                </div>
                <h3 className="font-poppins font-bold text-base text-slate-800">Update Status Medis</h3>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
                disabled={isLoading}
              >
                <span className="material-symbols-outlined text-lg leading-none">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-6">
                
                {/* Member Profile Banner */}
                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <Image src={selectedMember.profilePic} alt={selectedMember.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" width={48} height={48} unoptimized />
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{selectedMember.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Riwayat: {selectedMember.medicalHistory}</p>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Kondisi Saat Ini</label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Sehat */}
                    <label className="cursor-pointer">
                      <input 
                        type="radio" 
                        className="peer sr-only" 
                        name="kondisi" 
                        value="Sehat"
                        checked={formKondisi === "Sehat"}
                        onChange={() => setFormKondisi("Sehat")}
                      />
                      <div className="text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 transition-all">
                        Sehat
                      </div>
                    </label>
                    {/* Sakit */}
                    <label className="cursor-pointer">
                      <input 
                        type="radio" 
                        className="peer sr-only" 
                        name="kondisi" 
                        value="Sakit"
                        checked={formKondisi === "Sakit"}
                        onChange={() => setFormKondisi("Sakit")}
                      />
                      <div className="text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700 transition-all">
                        Sakit
                      </div>
                    </label>
                    {/* Cedera */}
                    <label className="cursor-pointer">
                      <input 
                        type="radio" 
                        className="peer sr-only" 
                        name="kondisi" 
                        value="Cedera"
                        checked={formKondisi === "Cedera"}
                        onChange={() => setFormKondisi("Cedera")}
                      />
                      <div className="text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-700 transition-all">
                        Cedera
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notes Input */}
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Catatan Medis & Penanganan</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white shadow-inner transition-all resize-none"
                    rows="4"
                    placeholder="Contoh: Diberikan paracetamol dan istirahat di posko..."
                    value={formMedicalNotes}
                    onChange={(e) => setFormMedicalNotes(e.target.value)}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">save</span>
                        Simpan Pembaruan
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
