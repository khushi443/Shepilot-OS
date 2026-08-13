export default function Skeleton({ lines = 6 }) {
  return (
    <div className="space-y-3 animate-pulse" role="status" aria-label="Loading response">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-full bg-white/10"
          style={{ width: `${92 - (i % 3) * 18}%` }}
        />
      ))}
    </div>
  );
}
