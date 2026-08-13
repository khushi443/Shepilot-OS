import AIToolPage from "../components/ui/AIToolPage";

const buildPrompt = (business) => `
You are a CFO-for-hire who builds financial models for pre-seed startups.
Build one for:

${business}

Respond ONLY in Markdown using this exact structure, with real tables (use
reasonable, clearly-labeled estimates — always state they are approximate):

## Estimated Startup Cost
Table: category, one-time cost.

## Monthly Expenses
Table: expense category, monthly amount.

## Revenue Forecast (12 Months)
Table with columns: Month | Revenue | Expenses | Profit/Loss — show all 12
rows with a realistic ramp (don't just repeat one number).

## Break-even Analysis
State the approximate month break-even is reached and why, based on the
table above.

## Runway
Given the startup cost and monthly burn, how many months of runway before
funds run out without new revenue — show the math briefly.

## Pricing Strategy
1-2 concrete pricing options with reasoning.

## Funding Suggestions
Bootstrapping vs. external funding — which fits this idea and why.

## Financial Tips
3 specific tips for this business, not generic advice.

Always note these are estimates for planning purposes, not guarantees.
`;

export default function FinancePlanner() {
  return (
    <AIToolPage
      toolType="finance"
      eyebrow="AI Finance Planner"
      emoji="💰"
      title="AI Finance Planner"
      description="Plan your startup budget, pricing, revenue forecast and financial strategy using AI."
      placeholder="Example: Online fashion store for college students..."
      idleLabel="💰 Generate Finance Plan"
      loadingLabel="Generating..."
      historyType="Finance Plan"
      resultTitle="AI Financial Report"
      resultEmoji="📊"
      buildPrompt={buildPrompt}
      heroGradientClass="from-[#F9CB28]/20 via-[#1B2040] to-[#FF8A00]/20"
      buttonGradientClass="from-[#F9CB28] to-[#FF8A00]"
      buttonTextClass="font-bold text-black"
      accentTextClass="text-[#F9CB28]"
    />
  );
}
