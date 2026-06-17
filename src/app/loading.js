export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] w-full">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
        <h2 className="text-lg font-bold text-slate-700 font-poppins">Memuat Dashboard...</h2>
        <p className="text-sm text-slate-500">Menyinkronkan data dengan Supabase</p>
      </div>
    </div>
  );
}
