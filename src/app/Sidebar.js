"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `group flex items-center gap-3.5 px-4 py-3 border-l-4 transition-colors duration-200 font-semibold text-[14px] ${
      pathname === path
        ? "bg-emerald-50/80 text-emerald-700 border-emerald-500"
        : "border-transparent text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30"
    }`;

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 top-0 h-screen w-[260px] z-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex-col py-8 px-4 border-r border-slate-100">
      <div className="px-3 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-500/20">
            S
          </div>
          <div>
            <h1 className="font-bold text-[15px] text-slate-900 leading-tight tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SHE Monitoring
            </h1>
            <p className="text-[10px] text-emerald-600 font-semibold tracking-normal mt-0.5 leading-snug">
              KKN PPM UGM Menyapa Komodo 2026
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        <Link className={linkClass("/")} href="/">
          <span className="material-symbols-outlined text-xl">dashboard</span>
          <span>Dashboard</span>
        </Link>
        <Link className={linkClass("/anggota")} href="/anggota">
          <span className="material-symbols-outlined text-xl">group</span>
          <span>Anggota</span>
        </Link>
        <Link className={linkClass("/kesehatan")} href="/kesehatan">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>monitor_heart</span>
          <span>Kesehatan Anggota</span>
        </Link>
        <Link className={linkClass("/aktivitas")} href="/aktivitas">
          <span className="material-symbols-outlined text-xl">task_alt</span>
          <span>Aktivitas Harian</span>
        </Link>
        <Link className={linkClass("/insiden")} href="/insiden">
          <span className="material-symbols-outlined text-xl">report_problem</span>
          <span>Insiden</span>
        </Link>
        <Link className={linkClass("/emergency")} href="/emergency">
          <span className="material-symbols-outlined text-xl">contact_phone</span>
          <span>Emergency Contact</span>
        </Link>
      </nav>
    </aside>
  );
}
