import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileClock } from "lucide-react";
import { db, auth } from "../../firebase/firebase";
import EmptyStateCard from "./EmptyStateCard";

const RELATIVE_UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

function timeAgo(seconds) {
  const diff = Math.max(0, Date.now() / 1000 - seconds);
  if (diff < 60) return "just now";
  for (const [unit, secs] of RELATIVE_UNITS) {
    const value = Math.floor(diff / secs);
    if (value >= 1) return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function RecentActivityCard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", auth.currentUser.uid, "aiHistory"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div
      className="rounded-[16px] border p-5"
      style={{ background: "var(--sp-surface)", borderColor: "var(--sp-border)", boxShadow: "var(--sp-shadow-sm)" }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[14.5px] font-semibold text-[var(--sp-text)]">Recent Work</h3>
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--sp-primary)] hover:opacity-80"
        >
          View All
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="mt-3.5 space-y-1">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-[10px]" style={{ background: "var(--sp-surface-muted)" }} />
          ))}

        {!loading && items.length === 0 && (
          <EmptyStateCard
            icon={FileClock}
            title="Your workspace is waiting for its first activity."
            description="Generate a business idea, roadmap, or plan to see it here."
            ctaLabel="Explore AI Workspace"
            ctaPath="/business-idea"
          />
        )}

        {!loading &&
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate("/history")}
              className="flex w-full items-center justify-between gap-3 rounded-[10px] px-2.5 py-2.5 text-left transition-colors hover:bg-[var(--sp-surface-muted)]"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-[var(--sp-text)]">
                  {item.title || item.type}
                </p>
                <p className="text-[11.5px] text-[var(--sp-text-faint)]">{item.type}</p>
              </div>
              {item.createdAt?.seconds && (
                <span className="shrink-0 text-[11px] text-[var(--sp-text-faint)]">
                  {timeAgo(item.createdAt.seconds)}
                </span>
              )}
            </button>
          ))}
      </div>
    </div>
  );
}
