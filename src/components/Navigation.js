import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
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
        href="/kesehatan"
      >
        <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">monitor_heart</span>
        <span>Kesehatan Anggota</span>
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
        href="/emergency"
      >
        <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">contact_phone</span>
        <span>Emergency Contact</span>
      </Link>
    </nav>
  );
};

export default Navigation;