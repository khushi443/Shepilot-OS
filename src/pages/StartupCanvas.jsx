import AIToolPage from "../components/ui/AIToolPage";

const buildPrompt = (idea) => `
You are a business design consultant who builds Business Model Canvases for
early-stage founders. Build a complete one for:

"${idea}"

Respond ONLY in Markdown using this exact structure (keep these headings —
some are parsed by the UI into cards):

## Startup Name
Name + one-line tagline.

## Problem
The core pain point and who has it.

## Solution
What this product/service does about it.

## Target Audience
Primary customer segment, specific not generic.

## Revenue Model
How money is made — list 2-3 concrete streams.

## Key Business Model Canvas Blocks
| Block | Details |
|---|---|
| Key Partners | ... |
| Key Activities | ... |
| Key Resources | ... |
| Value Propositions | ... |
| Customer Relationships | ... |
| Channels | ... |
| Cost Structure | ... |

## Estimated Startup Cost
Short table: category + rough amount.

## Market Opportunity
TAM/SAM/SOM in one or two lines.

## Competition
2-3 named or typical competitors and the differentiation.

## Marketing
Top 3 channels to launch with.

## Launch
A tight 30-day roadmap, week by week.

## Risks
2-3 real risks with mitigations.

## Growth
What scaling this looks like after month 6.

Keep it concrete and specific to this idea — no generic filler.
`;

export default function StartupCanvas() {
  return (
    <AIToolPage
      toolType="canvas"
      eyebrow="AI Startup Canvas"
      emoji="🚀"
      title="One-Click Startup Blueprint"
      description="Enter your startup idea and let AI generate a complete business blueprint."
      placeholder="Example: AI-powered fitness coaching app..."
      idleLabel="🚀 Generate Startup Blueprint"
      loadingLabel="Generating..."
      historyType="Startup Canvas"
      resultTitle="AI Startup Blueprint"
      resultEmoji="📄"
      buildPrompt={buildPrompt}
      heroGradientClass="from-[#00C9A7]/20 via-[#1B2040] to-[#00E5FF]/20"
      buttonGradientClass="from-[#00C9A7] to-[#00E5FF]"
      buttonTextClass="font-bold text-black"
      accentTextClass="text-[#00E5FF]"
      rows={7}
    />
  );
}
