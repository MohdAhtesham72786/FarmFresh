import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, min = 1, max, onChange, className = "" }) {
  return (
    <div className={`inline-flex items-center rounded-full border border-forest-200 bg-white ${className}`}>
      <button
        type="button"
        className="px-3 py-2 text-forest-700 hover:text-forest-900 disabled:opacity-40"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-forest-900">{value}</span>
      <button
        type="button"
        className="px-3 py-2 text-forest-700 hover:text-forest-900 disabled:opacity-40"
        disabled={typeof max === "number" && value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}