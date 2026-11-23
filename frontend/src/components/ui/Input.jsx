export function Input({ label, error, id, className = "", ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-forest-800">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border border-forest-200 bg-white px-3.5 py-2.5 text-forest-900 shadow-sm placeholder:text-forest-300 focus:border-fresh-500 focus:outline-none focus:ring-2 focus:ring-fresh-500/25 ${error ? "border-red-300" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, id, className = "", ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-forest-800">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full rounded-xl border border-forest-200 bg-white px-3.5 py-2.5 text-forest-900 shadow-sm placeholder:text-forest-300 focus:border-fresh-500 focus:outline-none focus:ring-2 focus:ring-fresh-500/25 ${error ? "border-red-300" : ""} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export function Select({ label, error, id, children, className = "", ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-forest-800">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full rounded-xl border border-forest-200 bg-white px-3.5 py-2.5 text-forest-900 shadow-sm focus:border-fresh-500 focus:outline-none focus:ring-2 focus:ring-fresh-500/25 ${error ? "border-red-300" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}