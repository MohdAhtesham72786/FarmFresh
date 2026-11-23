/** Semi-transparent overlay while paginated table data is loading. */
export default function TableFetchOverlay({ busy, label = "Loading…" }) {
  if (!busy) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/65 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-2 rounded-full border border-forest-200/90 bg-white px-4 py-2 text-xs font-semibold text-forest-700 shadow-sm">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-forest-200 border-t-forest-700" />
        {label}
      </div>
    </div>
  );
}