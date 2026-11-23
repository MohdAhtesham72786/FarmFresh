const styles = {
  active: "bg-fresh-500/15 text-fresh-600",
  inactive: "bg-forest-100 text-forest-500",
  warning: "bg-amber-50 text-amber-700",
  neutral: "bg-cream-200 text-forest-700",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}