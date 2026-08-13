export default function ErrorCard({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 flex items-start gap-3"
    >
      <span className="text-xl leading-none" aria-hidden="true">⚠️</span>
      <div>
        <p className="font-semibold text-red-200">Generation failed</p>
        <p className="text-red-200/70 text-sm mt-1">{message}</p>
      </div>
    </div>
  );
}
