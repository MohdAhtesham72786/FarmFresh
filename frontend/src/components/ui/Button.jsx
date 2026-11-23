const variants = {
  primary: "bg-forest-700 text-white hover:bg-forest-800 focus-visible:ring-forest-600",
  secondary: "bg-cream-100 text-forest-800 hover:bg-cream-200 border border-forest-100",
  ghost: "bg-white text-forest-700 border border-forest-200 hover:bg-cream-50",
  danger: "bg-red-50 text-red-700 border border-red-100 hover:bg-red-100",
  fresh: "bg-fresh-600 text-white hover:bg-fresh-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex touch-manipulation items-center justify-center gap-2 rounded-xl font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}