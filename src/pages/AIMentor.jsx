import AIToolPage from "../components/ui/AIToolPage";

const buildPrompt = (question) => `
You are ShePilot AI Mentor — a warm, direct startup mentor who has personally
coached first-time women entrepreneurs from idea to launch. A founder just
asked:

"${question}"

Respond in Markdown:
- Open with a direct 1-2 sentence answer — no throat-clearing.
- Then a short "### Here's how" section with a numbered, concrete action plan.
- If relevant, add a "### Watch out for" bullet or two on common mistakes.
- End with one short, specific follow-up question to keep the conversation going.

Keep it warm but no fluff — a busy founder should be able to act on this immediately.
`;

export default function AIMentor() {
  return (
    <AIToolPage
      toolType="mentor"
      eyebrow="AI Mentor"
      emoji="🤖"
      title="Ask Your AI Mentor"
      description="Get instant guidance for launching, growing and scaling your startup."
      placeholder="Example: How can I get my first 10 customers?"
      idleLabel="✨ Ask AI Mentor"
      loadingLabel="Thinking..."
      historyType="AI Mentor"
      resultTitle="AI Response"
      resultEmoji="🤖"
      buildPrompt={buildPrompt}
      heroGradientClass="from-[#464EFE]/20 via-[#1B2040] to-[#CE60F0]/20"
      buttonGradientClass="from-[#CE60F0] to-[#464EFE]"
      buttonTextClass="font-bold text-white"
      accentTextClass="text-[#CE60F0]"
      minLength={5}
      rows={6}
    />
  );
}
