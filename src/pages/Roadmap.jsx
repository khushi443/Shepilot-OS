import AIToolPage from "../components/ui/AIToolPage";

const buildPrompt = (business) => `
You are an operator who has taken multiple startups from zero to launch.
Build a concrete execution roadmap for:

"${business}"

Respond ONLY in Markdown using this exact structure:

## Milestones
Table: Milestone | Target Week | Success Metric — 5-6 major milestones from
idea to launch.

## Week-by-Week Timeline
### Week 1
- Tasks (3-4 concrete, specific to this business)
- Tools needed

### Week 2
- Tasks
- Marketing prep

### Week 3
- Budget/ops tasks
- Branding tasks

### Week 4
- Launch tasks
- Immediate post-launch growth actions

## Beyond Day 30
2-3 sentences on what the next quarter should focus on.

Every task must be concrete and doable in a day or two — not abstract advice.
`;

export default function Roadmap() {
  return (
    <AIToolPage
      toolType="roadmap"
      eyebrow="AI Roadmap Planner"
      emoji="🗺"
      title="AI Business Roadmap"
      description="Generate a complete week-by-week execution roadmap for launching your startup."
      placeholder="Example: AI-powered fitness coaching app..."
      idleLabel="🗺 Generate Roadmap"
      loadingLabel="Generating..."
      historyType="Roadmap"
      resultTitle="AI Startup Roadmap"
      resultEmoji="📅"
      buildPrompt={buildPrompt}
      heroGradientClass="from-[#00C9A7]/20 via-[#1B2040] to-[#00E5FF]/20"
      buttonGradientClass="from-[#00C9A7] to-[#00E5FF]"
      buttonTextClass="font-bold text-black"
      accentTextClass="text-[#00E5FF]"
    />
  );
}
