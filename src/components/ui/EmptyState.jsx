export default function EmptyState({ emoji = "📂", title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 sm:p-10 text-center">
      <div className="text-4xl mb-3" aria-hidden="true">{emoji}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      {description && <p className="text-white/50 mt-3">{description}</p>}
    </div>
  );
}
