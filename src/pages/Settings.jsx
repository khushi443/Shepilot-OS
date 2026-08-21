import { useState } from "react";
import { User, ShieldCheck, SlidersHorizontal, Bell } from "lucide-react";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import DashboardShell from "../components/app/DashboardShell";
import SectionHeader from "../components/app/SectionHeader";
import Avatar from "../components/app/Avatar";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebase";

// Sections with real, working functionality backed by Firebase Auth.
function ProfileSection({ currentUser }) {
  const [name, setName] = useState(currentUser?.displayName || "");
  const [saving, setSaving] = useState(false);

  const isGoogleAccount = currentUser?.providerData?.some(
    (p) => p.providerId === "google.com"
  );

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Name can't be empty.");
      return;
    }
    if (trimmed === currentUser?.displayName) return;

    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: trimmed });
      toast.success("Profile updated.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Couldn't update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="flex flex-col rounded-[16px] border p-5"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)", boxShadow: "var(--sp-shadow-sm)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[10px]"
          style={{ background: "var(--sp-accent-soft)" }}
        >
          <User size={18} className="text-[var(--sp-accent)]" strokeWidth={2.1} />
        </div>
        <div>
          <h3 className="text-[14.5px] font-semibold text-[var(--sp-text)]">Profile</h3>
          <p className="text-[12px] text-[var(--sp-text-faint)]">How founders see you across ShePilot.</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Avatar user={currentUser} size={40} />
        <div className="min-w-0">
          <p className="truncate text-[12px] text-[var(--sp-text-faint)]">{currentUser?.email}</p>
        </div>
      </div>

      <label htmlFor="display-name" className="mt-4 text-[12px] font-medium text-[var(--sp-text-muted)]">
        Display name
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          id="display-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isGoogleAccount}
          className="flex-1 rounded-[10px] border px-3 py-2 text-[13px] outline-none transition-colors focus:border-[var(--sp-primary)] disabled:opacity-50"
          style={{ borderColor: "var(--sp-border)", background: "var(--sp-bg)", color: "var(--sp-text)" }}
        />
        <button
          onClick={handleSave}
          disabled={saving || isGoogleAccount || name.trim() === currentUser?.displayName}
          className="rounded-[10px] px-4 py-2 text-[12.5px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: "var(--sp-primary)" }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {isGoogleAccount && (
        <p className="mt-1.5 text-[11.5px] text-[var(--sp-text-faint)]">
          Your name is managed by your Google account.
        </p>
      )}
    </div>
  );
}

function SecuritySection({ currentUser }) {
  const [sending, setSending] = useState(false);

  const isPasswordAccount = currentUser?.providerData?.some(
    (p) => p.providerId === "password"
  );

  const handleReset = async () => {
    if (!currentUser?.email) return;
    setSending(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      toast.success(`Password reset email sent to ${currentUser.email}.`);
    } catch (err) {
      console.error("Failed to send password reset email:", err);
      toast.error("Couldn't send the reset email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="flex flex-col rounded-[16px] border p-5"
      style={{ borderColor: "var(--sp-border)", background: "var(--sp-surface)", boxShadow: "var(--sp-shadow-sm)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[10px]"
          style={{ background: "var(--sp-accent-soft)" }}
        >
          <ShieldCheck size={18} className="text-[var(--sp-accent)]" strokeWidth={2.1} />
        </div>
        <div>
          <h3 className="text-[14.5px] font-semibold text-[var(--sp-text)]">Security</h3>
          <p className="text-[12px] text-[var(--sp-text-faint)]">Manage your password.</p>
        </div>
      </div>

      <div className="mt-4">
        {isPasswordAccount ? (
          <>
            <p className="text-[12.5px] leading-5 text-[var(--sp-text-muted)]">
            We&apos;ll send a password reset link to <strong>{currentUser?.email}</strong>.
            </p>
            <button
              onClick={handleReset}
              disabled={sending}
              className="mt-3 rounded-[10px] border px-4 py-2 text-[12.5px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              style={{ borderColor: "var(--sp-primary)", color: "var(--sp-primary)" }}
            >
              {sending ? "Sending…" : "Send password reset email"}
            </button>
          </>
        ) : (
          <p className="text-[12.5px] leading-5 text-[var(--sp-text-muted)]">
            You sign in with Google, so there&apos;s no ShePilot password to manage. Manage sign-in
            security from your Google account instead.
          </p>
        )}
      </div>
    </div>
  );
}

// These two genuinely have nothing behind them yet (no AI-tone setting is
// read anywhere, no email/notification pipeline exists) — labeling them
// "working" without a real system behind them would just be a differently
// shaped fake state, so they honestly stay "Coming soon" for now.
const COMING_SOON_SECTIONS = [
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
];

export default function Settings() {
  const { currentUser } = useAuth();

  return (
    <DashboardShell title="Settings" subtitle="Manage your account">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="Settings" title="Settings" description="Manage your ShePilot account." />

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProfileSection currentUser={currentUser} />
          <SecuritySection currentUser={currentUser} />

          {COMING_SOON_SECTIONS.map((section) => {
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
