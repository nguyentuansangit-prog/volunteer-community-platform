export default function ActivitiesLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-semibold animate-pulse">Đang tải hoạt động...</p>
    </div>
  );
}