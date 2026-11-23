export default function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-forest-900">{value}</p>
          {hint && <p className="mt-2 text-xs font-medium text-forest-500">{hint}</p>}
        </div>
        {Icon && (
          <span className="rounded-2xl bg-forest-800 p-2.5 text-white">
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}