import { useEffect, useId, useMemo, useRef, useState } from "react";
import { formatCurrency } from "../../utils/format";

const THUMB_SIZE = 20;
const PRICE_GREEN = "#2d6a4f";

const filterBtnBase =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-lg border px-5 text-[14px] font-bold leading-none transition-all duration-200 active:scale-[0.98]";

const amountInputClass =
  "price-amount-input mt-1.5 h-11 w-full rounded-xl border border-[#E1E9E3] bg-[#F7F9F6] px-2.5 text-center text-sm font-semibold tabular-nums text-[#2d6a4f] transition-all duration-200 hover:border-[#c9d6ce] hover:bg-[#f3f6f2] focus:border-[#2d6a4f] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#2d6a4f]/15";

function formatAmount(value) {
  return Number(value).toFixed(2);
}

function parseAmount(raw) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export default function PriceFilterButton({
  priceBounds,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onReset,
}) {
  const [open, setOpen] = useState(false);
  const [minDraft, setMinDraft] = useState(() => formatAmount(priceMin));
  const [maxDraft, setMaxDraft] = useState(() => formatAmount(priceMax));
  const rootRef = useRef(null);
  const panelId = useId();

  const active = priceMin > priceBounds.min || priceMax < priceBounds.max;

  const sliderPercent = useMemo(() => {
    const span = Math.max(priceBounds.max - priceBounds.min, 0.01);
    const left = ((priceMin - priceBounds.min) / span) * 100;
    const right = ((priceMax - priceBounds.min) / span) * 100;
    return { left: Math.min(left, right), right: Math.max(left, right) };
  }, [priceBounds.min, priceBounds.max, priceMin, priceMax]);

  const selectedTrackStyle = {
    left: `calc(${sliderPercent.left / 100} * (100% - ${THUMB_SIZE}px) + ${THUMB_SIZE / 2}px)`,
    width: `calc(${(sliderPercent.right - sliderPercent.left) / 100} * (100% - ${THUMB_SIZE}px))`,
  };

  const minThumbOnTop = priceMin > priceBounds.min + (priceBounds.max - priceBounds.min) * 0.5;

  useEffect(() => {
    setMinDraft(formatAmount(priceMin));
  }, [priceMin]);

  useEffect(() => {
    setMaxDraft(formatAmount(priceMax));
  }, [priceMax]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const clampMin = (value) => Math.min(Math.max(value, priceBounds.min), priceMax);
  const clampMax = (value) => Math.max(Math.min(value, priceBounds.max), priceMin);

  const onMinSlider = (value) => {
    const n = parseAmount(value);
    if (n == null) return;
    onPriceMinChange(clampMin(n));
  };

  const onMaxSlider = (value) => {
    const n = parseAmount(value);
    if (n == null) return;
    onPriceMaxChange(clampMax(n));
  };

  const commitMin = (raw) => {
    const n = parseAmount(raw);
    if (n == null) {
      setMinDraft(formatAmount(priceMin));
      return;
    }
    onPriceMinChange(clampMin(n));
  };

  const commitMax = (raw) => {
    const n = parseAmount(raw);
    if (n == null) {
      setMaxDraft(formatAmount(priceMax));
      return;
    }
    onPriceMaxChange(clampMax(n));
  };

  const onMinDraftChange = (raw) => {
    setMinDraft(raw);
    if (raw === "" || raw === "." || /[.\-]$/.test(raw)) return;
    const n = parseAmount(raw);
    if (n == null || n < priceBounds.min || n > priceMax) return;
    onPriceMinChange(n);
  };

  const onMaxDraftChange = (raw) => {
    setMaxDraft(raw);
    if (raw === "" || raw === "." || /[.\-]$/.test(raw)) return;
    const n = parseAmount(raw);
    if (n == null || n < priceMin || n > priceBounds.max) return;
    onPriceMaxChange(n);
  };

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`${filterBtnBase} ${
          open || active
            ? "border-forest-300 bg-white text-forest-900 shadow-sm ring-2 ring-forest-500/15"
            : "border-forest-200 bg-cream-50 text-forest-800 hover:border-forest-300 hover:bg-white"
        }`}
      >
        Price
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Price range"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(calc(100vw-2rem),20.5rem)] max-h-[min(22rem,calc(100dvh-8rem))] origin-top-right overflow-y-auto overflow-x-hidden overscroll-contain rounded-[18px] border border-[#E1E9E3] bg-white p-4 shadow-[0_1px_2px_rgb(45_106_79_/_0.06),0_10px_28px_rgb(45_106_79_/_0.10)] sm:p-5"
        >
          <div className="flex items-baseline justify-between gap-6 font-display text-[1.25rem] font-bold leading-none tracking-tight text-[#2d6a4f] sm:text-[1.35rem]">
            <span className="tabular-nums">{formatCurrency(priceMin)}</span>
            <span className="tabular-nums">{formatCurrency(priceMax)}</span>
          </div>

          <div className="relative mt-5 h-7 select-none">
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#E6EBE7]"
              style={{ left: THUMB_SIZE / 2, right: THUMB_SIZE / 2 }}
            />
            <div
              className="pointer-events-none absolute top-1/2 z-[1] h-1.5 -translate-y-1/2 rounded-full"
              style={{ ...selectedTrackStyle, backgroundColor: PRICE_GREEN }}
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={0.01}
              value={priceMin}
              onChange={(e) => onMinSlider(e.target.value)}
              className={`price-dual-range pointer-events-none absolute inset-x-0 top-1/2 h-7 w-full -translate-y-1/2 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto ${
                minThumbOnTop ? "z-30" : "z-20"
              }`}
              aria-label="Minimum price"
              aria-valuemin={priceBounds.min}
              aria-valuemax={priceMax}
              aria-valuenow={priceMin}
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={0.01}
              value={priceMax}
              onChange={(e) => onMaxSlider(e.target.value)}
              className={`price-dual-range pointer-events-none absolute inset-x-0 top-1/2 h-7 w-full -translate-y-1/2 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto ${
                minThumbOnTop ? "z-20" : "z-30"
              }`}
              aria-label="Maximum price"
              aria-valuemin={priceMin}
              aria-valuemax={priceBounds.max}
              aria-valuenow={priceMax}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <label className="block min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2d6a4f]/80">
                MIN
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={priceBounds.min}
                max={priceMax}
                step={0.01}
                value={minDraft}
                onChange={(e) => onMinDraftChange(e.target.value)}
                onBlur={(e) => commitMin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className={amountInputClass}
                aria-label="Minimum price amount"
              />
            </label>
            <label className="block min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2d6a4f]/80">
                MAX
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={priceMin}
                max={priceBounds.max}
                step={0.01}
                value={maxDraft}
                onChange={(e) => onMaxDraftChange(e.target.value)}
                onBlur={(e) => commitMax(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className={amountInputClass}
                aria-label="Maximum price amount"
              />
            </label>
          </div>

          {active && (
            <button
              type="button"
              onClick={onReset}
              className="mt-3 w-full rounded-xl py-1.5 text-center text-sm font-semibold text-[#2d6a4f]/70 transition-colors hover:bg-[#F7F9F6] hover:text-[#2d6a4f]"
            >
              Reset price range
            </button>
          )}
        </div>
      )}
    </div>
  );
}
