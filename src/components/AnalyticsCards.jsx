import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Target, Sparkles, TrendingUp, Compass } from "lucide-react";
import { db, auth } from "../firebase/firebase";
import { getCurrentStage } from "../utils/businessContext";
import StatCard from "./app/StatCard";

// Live KPI row for the Overview dashboard. Every number is derived from the
// same Firestore aiHistory listener plus the local Startup Journey progress
// — nothing here is invented; a founder with no history yet sees honest
// zero-states instead of placeholder numbers.
export default function AnalyticsCards({ progress }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", auth.currentUser.uid, "aiHistory"),
      (snapshot) => setTotal(snapshot.docs.length),
      (err) => console.error(err)
    );

    return unsubscribe;
  }, []);

  const stage = getCurrentStage(progress);

  const cards = [
    {
      label: "Startup Progress",
      value: `${progress.completedCount}/${progress.total}`,
      description: progress.isComplete ? "Every milestone logged" : "Milestones logged",
      icon: TrendingUp,
    },
    {
      label: "Business Readiness",
      value: `${progress.percent}%`,
      description: `${progress.completedCount} of ${progress.total} journey steps done`,
      icon: Target,
      percent: progress.percent,
    },
    {
      label: "AI Tasks Completed",
      value: total,
      description: total === 0 ? "No AI sessions yet" : "Across every workspace tool",
      icon: Sparkles,
    },
    {
      label: "Current Stage",
      value: stage.stage,
      description: stage.description,
      icon: Compass,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
      {cards.map((card, index) => (
        <StatCard key={card.label} {...card} delay={index * 0.05} />
      ))}
    </div>
  );
}
