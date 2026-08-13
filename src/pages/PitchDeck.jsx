import AIToolPage from "../components/ui/AIToolPage";

const buildPrompt = (business) => `
You are a pitch coach who has helped founders raise seed rounds. Write a
slide-by-slide investor pitch deck script for:

${business}

Respond ONLY in Markdown. Use one "### Slide N: Title" heading per slide,
followed by 2-4 punchy bullet points of exactly what appears on that slide
(not a paragraph — real slide content):

### Slide 1: Cover
### Slide 2: Problem
### Slide 3: Solution
### Slide 4: Market Opportunity (TAM/SAM/SOM)
### Slide 5: Product / Demo
### Slide 6: Business Model
### Slide 7: Traction / Milestones
### Slide 8: Competitive Landscape
### Slide 9: Go-To-Market Strategy
### Slide 10: Financial Projections
### Slide 11: Team
### Slide 12: The Ask (funding amount + use of funds)

End with:

## Investor One-Liner
A single sentence an investor could repeat to describe this company.

Keep every slide's bullets specific to this business — no generic filler.
`;

export default function PitchDeck() {
  return (
    <AIToolPage
      toolType="pitchdeck"
      eyebrow="AI Pitch Deck Generator"
      emoji="🚀"
      title="AI Pitch Deck Generator"
      description="Create an investor-ready pitch deck in seconds using ShePilot AI."
      placeholder="Example: AI-powered career platform for college students..."
      idleLabel="🚀 Generate Pitch Deck"
      loadingLabel="Generating..."
      historyType="Pitch Deck"
      resultTitle="AI Generated Investor Pitch Deck"
      resultEmoji="📑"
      buildPrompt={buildPrompt}
      heroGradientClass="from-[#7928CA]/20 via-[#1B2040] to-[#FF0080]/20"
      buttonGradientClass="from-[#7928CA] to-[#FF0080]"
      buttonTextClass="font-bold text-white"
      accentTextClass="text-[#FF4ECD]"
    />
  );
}
