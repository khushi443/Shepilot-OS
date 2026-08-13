import DashboardShell from "../components/app/DashboardShell";
import SectionHeader from "../components/app/SectionHeader";
import RecentHistory from "../components/RecentHistory";

export default function ActivityHistory() {
  return (
    <DashboardShell title="Activity History" subtitle="Every AI session, in one place">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="History"
          title="Activity History"
          description="Search, filter and revisit everything your AI workspace has generated."
        />
        <div className="mt-6">
          <RecentHistory />
        </div>
      </div>
    </DashboardShell>
  );
}
