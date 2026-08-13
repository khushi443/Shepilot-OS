import AIToolPage from "../components/ui/AIToolPage";

const buildPrompt = (idea) => `
You are a senior startup founder-in-residence who has personally built and
launched multiple businesses. A first-time founder just described this idea:

"${idea}"

Turn it into a complete, investor-credible business plan. Respond ONLY in
Markdown, using this exact structure:

## Startup Name
One punchy, ownable name plus a one-line tagline.

## Problem
2-3 sentences on the real pain point, who feels it, and how they cope today.

## Solution
2-3 sentences on what this product does differently, in plain language.

## Target Audience
- Primary ICP (be specific: demographics/firmographics, not "everyone")
- Secondary audience (if any)

## Revenue Model
A short table:

| Revenue Stream | How It Works | Est. Price Point |
|---|---|---|

## Marketing Strategy
3-4 bullet channels ranked by expected ROI for this specific idea.

## Estimated Startup Cost
A short table breaking cost into 3-5 categories with rough amounts.

## First 30 Days Plan
A numbered list of concrete, dated actions (Week 1 / Week 2 / Week 3 / Week 4).

Be specific to this idea — never generic filler. Flag one real risk honestly.
`;

export default function BusinessIdea() {
  return (
    <AIToolPage
      toolType="business"
      eyebrow="AI Business Planner"
      emoji="💡"
      title="AI Business Idea Generator"
      description="Describe your startup idea and ShePilot AI will generate a complete business plan."
      placeholder="Example: Organic skincare brand for college girls..."
      idleLabel="✨ Generate Business Plan"
      loadingLabel="Generating..."
      historyType="Business Idea"
      resultTitle="AI Generated Business Plan"
      resultEmoji="📋"
      buildPrompt={buildPrompt}
      heroGradientClass="from-[#464EFE]/20 via-[#1B2040] to-[#CE60F0]/20"
      buttonGradientClass="from-[#CE60F0] to-[#464EFE]"
      buttonTextClass="font-bold text-white"
      accentTextClass="text-[#CE60F0]"
    />
  );
}
