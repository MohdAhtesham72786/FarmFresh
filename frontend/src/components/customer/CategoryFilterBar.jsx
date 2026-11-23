import { categoryAnchorId } from "../../utils/categories";

function categoryChipClass(active) {
  const base =
    "inline-flex h-10 shrink-0 items-center justify-center rounded-lg border px-3.5 text-[14px] font-medium leading-none transition-all duration-200 active:scale-[0.98]";
  if (active) {
    return `${base} border-forest-800 bg-forest-800 text-white shadow-sm`;
  }
  return `${base} border-forest-200 bg-cream-50 text-forest-700 hover:border-forest-300 hover:bg-white`;
}

export default function CategoryFilterBar({
  categories,
  value,
  onChange,
  trailing,
  showClearAll,
  onClearAll,
}) {
  if (!categories.length) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 overflow-visible sm:flex-row sm:items-center sm:gap-4">
      <div
        className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Product categories"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!value}
          onClick={() => onChange("")}
          className={categoryChipClass(!value)}
        >
          All
        </button>
        {categories.map((name) => (
          <button
            key={name}
            id={categoryAnchorId(name)}
            type="button"
            role="tab"
            aria-selected={value === name}
            onClick={() => onChange(name)}
            className={categoryChipClass(value === name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex shrink-0 items-center justify-end gap-3 self-end sm:self-auto">
        {trailing}
        {showClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[14px] font-semibold text-fresh-600 underline-offset-2 transition-colors hover:text-forest-800 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}