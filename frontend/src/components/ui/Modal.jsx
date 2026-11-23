import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 bg-forest-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl border border-forest-100 bg-white p-5 shadow-elevated sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-forest-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-forest-400 hover:bg-cream-100 hover:text-forest-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-forest-600">{children}</div>
        {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function ModalActions({ onCancel, onConfirm, confirmLabel = "Confirm", loading, danger }) {
  return (
    <>
      <Button variant="ghost" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} disabled={loading}>
        {loading ? "Please wait…" : confirmLabel}
      </Button>
    </>
  );
}