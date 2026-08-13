import { User, SlidersHorizontal, Bell, ShieldCheck } from "lucide-react";
import DashboardShell from "../components/app/DashboardShell";
import SectionHeader from "../components/app/SectionHeader";
import Avatar from "../components/app/Avatar";
import { useAuth } from "../context/AuthContext";

const SECTIONS = [
  {
    icon: User,
    title: "Profile",
    description: "Update your name, photo and how founders see you across ShePilot.",
  },
  {
    icon: SlidersHorizontal,
    title: "Workspace Preferences",
    description: "Choose default tools, tone of AI responses, and journey pacing.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control email and in-app alerts for milestones and AI activity.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description: "Manage your password, sessions and connected sign-in methods.",
  },
];

export default function Settings() {
  const { currentUser } = useAuth();

  return (
    <DashboardShell title="Settings" subtitle="Workspace settings are coming soon">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Settings"
          title="Settings"
          description="Workspace settings are coming soon. Your account is safe and active in the meantime."
        />

        {/* Current account snapshot — the one thing that IS real today */}
        <div
          className="mt-7 flex items-center gap-3.5 rounded-[16px] border p-4.5"
          style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)", boxShadow: "var(--sp-shadow-sm)" }}
        >
          <Avatar user={currentUser} size={40} />
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold text-[var(--sp-text)]">
              {currentUser?.displayName || "Founder"}
            </p>
            <p className="truncate text-[12px] text-[var(--sp-text-faint)]">{currentUser?.email}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="flex flex-col rounded-[16px] border p-5"
                style={{
                  borderColor: "var(--sp-border)",
                  background: "var(--sp-surface)",
                  boxShadow: "var(--sp-shadow-sm)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-[10px]"
                    style={{ background: "var(--sp-accent-soft)" }}
                  >
                    <Icon size={18} className="text-[var(--sp-accent)]" strokeWidth={2.1} />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold"
                    style={{ background: "var(--sp-warning-soft)", color: "var(--sp-warning)" }}
                  >
                    Coming soon
                  </span>
                </div>

                <h3 className="mt-3.5 text-[14.5px] font-semibold text-[var(--sp-text)]">{section.title}</h3>
                <p className="mt-1 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{section.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
