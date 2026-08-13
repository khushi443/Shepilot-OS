export default function Skeleton({ lines = 6 }) {
  return (
    <div className="animate-pulse space-y-3" role="status" aria-label="Loading response">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-full"
          style={{ width: `${92 - (i % 3) * 18}%`, background: "var(--sp-border)" }}
        />
      ))}
    </div>
  );
}
