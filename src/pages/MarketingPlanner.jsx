import AIToolPage from "../components/ui/AIToolPage";

const buildPrompt = (business) => `
You are a growth marketing lead who has launched multiple consumer brands.
Build a real go-to-market plan for:

${business}

Respond ONLY in Markdown using this exact structure:

## Ideal Customer Profile (ICP)
Specific description: who they are, what they care about, where they spend time online.

## Positioning
One-sentence positioning statement + the single message that should stick.

## Channels
Table: Channel | Why It Fits This Audience | Priority (High/Med/Low) — rank
3-5 channels, don't just list every platform.

## Content Calendar (Week 1)
Table: Day | Platform | Content Idea | Goal — 7 rows, concrete post ideas
specific to this business, not placeholders.

## Growth Plan (30 Days)
Numbered week-by-week plan (Week 1-4) tying content, paid, and organic
efforts together.

## Paid Ads Strategy
If/when paid spend makes sense here, which platform first and rough budget.

## Growth Tips
3 tips specific to this business's audience.

Be concrete — real post ideas and real channel names, not generic advice.
`;

export default function MarketingPlanner() {
  return (
    <AIToolPage
      toolType="marketing"
      eyebrow="AI Marketing Planner"
      emoji="📢"
      title="AI Marketing Planner"
      description="Generate a complete AI-powered marketing strategy to grow your business across social media."
      placeholder="Example: Online clothing brand for college students..."
      idleLabel="📢 Generate Marketing Plan"
      loadingLabel="Generating..."
      historyType="Marketing Plan"
      resultTitle="AI Marketing Strategy"
      resultEmoji="📈"
      buildPrompt={buildPrompt}
      heroGradientClass="from-[#FF6CAB]/20 via-[#1B2040] to-[#7366FF]/20"
      buttonGradientClass="from-[#FF6CAB] to-[#7366FF]"
      buttonTextClass="font-bold text-white"
      accentTextClass="text-[#FF6CAB]"
    />
  );
}
