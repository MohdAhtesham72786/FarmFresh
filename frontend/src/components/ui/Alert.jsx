import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const map = {
  error: { icon: AlertCircle, className: "border-red-100 bg-red-50 text-red-800" },
  success: { icon: CheckCircle2, className: "border-fresh-500/20 bg-fresh-500/10 text-forest-800" },
  info: { icon: Info, className: "border-forest-200 bg-cream-50 text-forest-700" },
};

export default function Alert({ tone = "info", children }) {
  const { icon: Icon, className } = map[tone];
  return (
    <div className={`flex gap-2 rounded-xl border px-4 py-3 text-sm ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}