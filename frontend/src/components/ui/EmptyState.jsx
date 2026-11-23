export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest-200 bg-white px-6 py-14 text-center shadow-card">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-100 text-forest-600">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-forest-900">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-forest-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}