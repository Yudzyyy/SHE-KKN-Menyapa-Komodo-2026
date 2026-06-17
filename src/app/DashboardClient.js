"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';

export default function DashboardClient({ initialStats }) {
  // App States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIncidentPhoto, setSelectedIncidentPhoto] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Gunakan initialStats yang di-fetch dari server component
  const stats = initialStats;

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen antialiased flex font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-3 bg-white px-5 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-l-4 border-emerald-500 animate-slide-in">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
            toast.type === "success" ? "bg-emerald-500" : "bg-sky-500"
          }`}>
            <span className="material-symbols-outlined text-base">check</span>
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

      {/* 1. SIDEBAR - Responsive drawer style */}
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

        <div className="px-3 mb-10">
          <Image src="/logo.png" alt="SHE Logo" width={120} height={48} className="h-12 w-auto object-contain" priority />
        </div>

        {/* Navigation Menus - "Dashboard" is highlighted */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <Navigation />
        </nav>

      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden w-full">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-50/60 via-slate-50/30 to-transparent -z-10" />

        {/* 2. TOPBAR - Responsive margins & Hamburger button */}
        <header className="sticky top-0 w-full z-30 border-b border-slate-100 bg-white/70 backdrop-blur-md shadow-sm flex justify-between items-center h-20 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle button */}
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
                placeholder="Cari analitik..." 
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
          
          {/* Header Dashboard Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-semibold mb-1">
                <span>SHE Monitor</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-400">Overview</span>
              </div>
              <h1 className="font-poppins font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight">
                Welcome back, Admin
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Senin, 24 Mei 2026 • Semua sistem pemantauan keselamatan berjalan optimal.
              </p>
            </div>

            <button 
              onClick={() => triggerToast("Laporan berhasil dibuat!", "success")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shrink-0 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-base">analytics</span>
              Generate Report
            </button>
          </div>          
          
          {/* 4. STATISTIC CARDS - Redesigned white cards with emerald style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Total Anggota */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Anggota</p>
                <h2 className="text-3xl font-extrabold text-slate-800 font-poppins leading-tight">{stats.totalMembers}</h2>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">group</span> Terbagi di 2 Posko Desa
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white rounded-2xl flex items-center justify-center border border-emerald-100/50 shadow-inner transition-colors duration-300">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
            </div>

            {/* Card 2: Total Sehat */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Sehat</p>
                <h2 className="text-3xl font-extrabold text-emerald-600 font-poppins leading-tight">{stats.totalHealthy}</h2>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">verified</span> {stats.totalMembers > 0 ? Math.round((stats.totalHealthy / stats.totalMembers) * 100) : 100}% Anggota Fit
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white rounded-2xl flex items-center justify-center border border-emerald-100/50 shadow-inner transition-colors duration-300">
                <span className="material-symbols-outlined text-xl">favorite</span>
              </div>
            </div>

            {/* Card 3: Total Sakit */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-orange-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Total Sakit</p>
                <h2 className="text-3xl font-extrabold text-orange-500 font-poppins leading-tight">{stats.totalSick}</h2>
                <p className="text-[10px] text-orange-600 font-semibold mt-1 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">info</span> {stats.totalSick > 0 ? "Butuh Istirahat/Perawatan" : "Semua dalam kondisi sehat"}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white rounded-2xl flex items-center justify-center border border-orange-100/50 shadow-inner transition-colors duration-300">
                <span className="material-symbols-outlined text-xl">sick</span>
              </div>
            </div>

            {/* Card 4: Total Injury */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-red-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Total Injury</p>
                <h2 className="text-3xl font-extrabold text-red-600 font-poppins leading-tight">{stats.totalInjury}</h2>
                <p className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">emergency</span> {stats.totalInjury > 0 ? `${stats.totalInjury} Penanganan Medis` : "Zero accident dilaporkan"}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white rounded-2xl flex items-center justify-center border border-red-100/50 shadow-inner transition-colors duration-300">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
            </div>

          </div>

          {/* 5. MIDDLE SECTION - Progress, Site Metrics & Quick Action */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Health Distribution Circular Progress Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-poppins font-bold text-slate-900">Distribusi Kesehatan</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Analisis kondisi kesiapan kerja personil di lapangan.</p>
                </div>
                <button className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
                  7 Hari Terakhir
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-center justify-around flex-1 py-4">
                {/* Circular Gauge */}
                <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-50 flex items-center justify-center shadow-inner shrink-0">
                  {/* Decorative green ring fill */}
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-emerald-500 border-b-transparent border-l-transparent rotate-45" />
                  <div className="text-center relative z-10">
                    <h4 className="text-4xl font-extrabold text-slate-800 font-poppins">
                      {stats.totalMembers > 0 ? Math.round((stats.totalHealthy / stats.totalMembers) * 100) : 100}%
                    </h4>
                    <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mt-1.5">Overall Fit</p>
                  </div>
                </div>

                {/* Progress bars indicator lists */}
                <div className="space-y-4.5 flex-1 w-full max-w-sm">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Layak Bekerja (Fit for Work)</span>
                      <span className="text-emerald-600">{stats.totalHealthy} <span className="text-[10px] text-slate-400 font-medium">({stats.totalMembers > 0 ? Math.round((stats.totalHealthy / stats.totalMembers) * 100) : 100}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2.5 rounded-full" 
                        style={{ width: `${stats.totalMembers > 0 ? (stats.totalHealthy / stats.totalMembers) * 100 : 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Kondisi Kurang Sehat (Sick)</span>
                      <span className="text-slate-500">{stats.totalSick} <span className="text-[10px] text-slate-400 font-medium">({stats.totalMembers > 0 ? Math.round((stats.totalSick / stats.totalMembers) * 100) : 0}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-amber-400 h-2.5 rounded-full" 
                        style={{ width: `${stats.totalMembers > 0 ? (stats.totalSick / stats.totalMembers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Perawatan Medis (Injury)</span>
                      <span className="text-slate-500">{stats.totalInjury} <span className="text-[10px] text-slate-400 font-medium">({stats.totalMembers > 0 ? Math.round((stats.totalInjury / stats.totalMembers) * 100) : 0}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-rose-500 h-2.5 rounded-full" 
                        style={{ width: `${stats.totalMembers > 0 ? (stats.totalInjury / stats.totalMembers) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Metrics & Quick Action */}
            <div className="flex flex-col h-full">
              
              {/* Site Metrics Card */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col justify-between">
                <h3 className="text-base font-poppins font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">domain</span>
                  Kondisi Posko Desa KKN
                </h3>

                <div className="flex-1 flex flex-col justify-center gap-3.5">
                  <div className={`rounded-xl p-3.5 hover:shadow-sm transition-shadow border ${
                    (stats.warlokaSick > 0 || stats.warlokaInjury > 0)
                      ? "bg-amber-50/50 border-amber-200/50"
                      : "bg-emerald-50/50 border-emerald-100/50"
                  }`}>
                    <h4 className={`font-bold text-xs leading-tight ${
                      (stats.warlokaSick > 0 || stats.warlokaInjury > 0) ? "text-amber-800" : "text-emerald-800"
                    }`}>Posko Warloka Pesisir</h4>
                    <p className={`text-[11px] mt-1 font-semibold ${
                      (stats.warlokaSick > 0 || stats.warlokaInjury > 0) ? "text-amber-700" : "text-emerald-600"
                    }`}>
                      {stats.warlokaCount} Anggota Aktif • {" "}
                      {(stats.warlokaSick > 0 || stats.warlokaInjury > 0) ? (
                        <span>
                          {stats.warlokaHealthy} Sehat
                          {stats.warlokaSick > 0 && `, ${stats.warlokaSick} Sakit`}
                          {stats.warlokaInjury > 0 && `, ${stats.warlokaInjury} Cedera`}
                        </span>
                      ) : (
                        "Aman & Sehat."
                      )}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3.5 hover:shadow-sm transition-shadow border ${
                    (stats.goloMoriSick > 0 || stats.goloMoriInjury > 0)
                      ? "bg-amber-50/50 border-amber-200/50"
                      : "bg-emerald-50/50 border-emerald-100/50"
                  }`}>
                    <h4 className={`font-bold text-xs leading-tight ${
                      (stats.goloMoriSick > 0 || stats.goloMoriInjury > 0) ? "text-amber-800" : "text-emerald-800"
                    }`}>Posko Golo Mori</h4>
                    <p className={`text-[11px] mt-1 font-semibold ${
                      (stats.goloMoriSick > 0 || stats.goloMoriInjury > 0) ? "text-amber-700" : "text-emerald-600"
                    }`}>
                      {stats.goloMoriCount} Anggota Aktif • {" "}
                      {(stats.goloMoriSick > 0 || stats.goloMoriInjury > 0) ? (
                        <span>
                          {stats.goloMoriHealthy} Sehat
                          {stats.goloMoriSick > 0 && `, ${stats.goloMoriSick} Sakit`}
                          {stats.goloMoriInjury > 0 && `, ${stats.goloMoriInjury} Cedera`}
                        </span>
                      ) : (
                        "Aman & Sehat."
                      )}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* 6. TABLE - Recent Incidents Redesigned */}
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col">
            
            <div className="px-8 py-6.5 flex justify-between items-center border-b border-slate-50">
              <div>
                <h3 className="text-lg font-poppins font-bold text-slate-900">Laporan Insiden Terbaru</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Pemantauan kasus keselamatan lapangan terkini.</p>
              </div>

              <Link 
                href="/insiden" 
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
              >
                Lihat Semua Laporan
                <span className="material-symbols-outlined text-xs leading-none">arrow_forward</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pl-8 pr-4 py-4 w-32">INCIDENT ID</th>
                    <th className="px-5 py-4">Nama Pelapor</th>
                    <th className="px-5 py-4">Anggota Terkena</th>
                    <th className="px-5 py-4 w-40">Tingkat Keparahan</th>
                    <th className="px-5 py-4 max-w-xs">Catatan & Kronologi</th>
                    <th className="pl-4 pr-8 py-4 text-center w-36">Foto Insiden</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {stats.recentIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-14 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-emerald-400">verified_user</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-700">Tidak Ada Insiden Tercatat</p>
                            <p className="text-xs text-slate-400 mt-1">Semua aman — belum ada laporan insiden yang masuk.</p>
                          </div>
                          <Link
                            href="/insiden"
                            className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            <span className="material-symbols-outlined text-xs leading-none">add_circle</span>
                            Buat Laporan Insiden
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    stats.recentIncidents.map((inc, index) => (
                      <tr key={index} className="hover:bg-slate-50/40 transition-colors duration-200">
                        <td className="pl-8 pr-4 py-5 font-poppins font-bold text-xs text-slate-800">{inc.id}</td>
                        <td className="px-5 py-5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-base leading-none">person</span>
                            <span className="font-semibold text-slate-900">{inc.reporter}</span>
                          </div>
                        </td>
                        <td className="px-5 py-5 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-base leading-none">medical_services</span>
                            <span className="font-semibold text-rose-600">{inc.victimName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            inc.severity === "emergency" ? "bg-rose-50 text-rose-700 border border-rose-150 animate-pulse" :
                            inc.severity === "high" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                            inc.severity === "medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}>
                            {inc.type}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-xs text-slate-500 max-w-xs truncate" title={inc.description}>
                          {inc.description}
                        </td>
                        <td className="pl-4 pr-8 py-5 text-center">
                          {inc.photo ? (
                            <div className="inline-block relative group">
                              <Image
                                src={inc.photo}
                                alt="Foto Insiden"
                                onClick={() => setSelectedIncidentPhoto(inc.photo)}
                                className="w-14 h-10 object-cover rounded-lg border border-slate-200 shadow-sm transition-transform duration-200 hover:scale-150 z-10 cursor-zoom-in"
                                title="Klik untuk memperbesar"
                                width={56}
                                height={40}
                                unoptimized
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic flex items-center justify-center gap-1">
                              <span className="material-symbols-outlined text-[13px] leading-none">no_photography</span>
                              Tidak Ada
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Image Zoom Modal */}
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
      </div>

    </div>
  );
}
