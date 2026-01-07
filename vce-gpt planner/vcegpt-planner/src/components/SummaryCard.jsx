export default function SummaryCard({ label, count, tone }) {
  const tones = {
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${tones[tone]}`}>
      <div className="text-xs font-medium uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold">{count}</div>
    </div>
  );
}

