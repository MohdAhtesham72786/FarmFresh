/**
 * @param {object} props
 * @param {number} props.page - current page (1-based)
 * @param {number} props.totalPages
 * @param {number} props.total
 * @param {number} props.limit
 * @param {(page: number) => void} props.onPageChange
 * @param {boolean} [props.disabled]
 */
export default function Pagination({ page, totalPages, total, limit, onPageChange, disabled = false }) {
  if (totalPages <= 0) return null;

  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const navBtn =
    "inline-flex h-8 min-w-[2.25rem] items-center justify-center rounded-lg border border-forest-200 bg-white px-2.5 text-xs font-semibold text-forest-700 transition-colors hover:border-forest-300 hover:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 disabled:cursor-not-allowed disabled:opacity-40";
  const pageBtn =
    "inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-400";
  const pageIdle = `${pageBtn} border-forest-200/80 bg-white text-forest-600 hover:border-forest-300 hover:bg-cream-50`;
  const pageActive = `${pageBtn} border-forest-700 bg-forest-700 text-white shadow-sm`;

  return (
    <div className="flex flex-col gap-3 border-t border-forest-100 bg-cream-50/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-center text-xs text-forest-500 sm:text-left">
        Showing <span className="font-semibold text-forest-700">{from}</span>–
        <span className="font-semibold text-forest-700">{to}</span> of{" "}
        <span className="font-semibold text-forest-700">{total}</span>
        <span className="mx-2 hidden text-forest-300 sm:inline">·</span>
        <span className="block sm:inline">
          Page <span className="font-semibold text-forest-700">{page}</span> of{" "}
          <span className="font-semibold text-forest-700">{totalPages}</span>
        </span>
      </p>
      <nav className="flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
        <button
          type="button"
          className={navBtn}
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={p === page ? pageActive : pageIdle}
            disabled={disabled}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className={navBtn}
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  );
}