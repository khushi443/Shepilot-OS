import AIToolPage from "../components/ui/AIToolPage";

const buildPrompt = (idea) => `
You are a due-diligence analyst at an early-stage venture fund. Evaluate this
startup idea as if you were deciding whether to invest:

"${idea}"

Respond ONLY in Markdown with this exact structure. Keep every numeric score
on its own line in the "Label: NN%" or "Label: NN/100" format shown — this is
parsed by the UI, so do not change the label wording:

## Validation Scorecard
- Overall Startup Score: NN/100
- Problem-Solution Fit: NN%
- Market Demand: NN%
- Competition: NN%
- Revenue Potential: NN%
- Risk: NN%

## SWOT Analysis
| Strengths | Weaknesses | Opportunities | Threats |
|---|---|---|---|
| ... | ... | ... | ... |

## Market Size
TAM / SAM / SOM as a short bulleted estimate with reasoning, not just numbers.

## Competitors
- Name 2-3 realistic direct or indirect competitors and how this idea differs.

## Target Audience
Primary ICP, one sentence.

## Risks
- 3 concrete risks, each with one mitigation.

## Marketing Suggestions
3 channels most likely to work for this specific audience.

## First 30 Days Plan
A short numbered action list.

## Verdict
**Should I Build This?** YES or NO in bold, with a two-sentence reason.

Be honest and specific — a real investor would push back on vague claims.
`;

export default function StartupValidator() {
  return (
    <AIToolPage
      toolType="validator"
      eyebrow="Startup Validator"
      emoji="🔍"
      title="Validate Your Startup"
      description="Get an AI-powered validation report before building your startup."
      placeholder="Example: Handmade Jewellery Brand..."
      idleLabel="🔍 Validate Startup"
      loadingLabel="Validating..."
      historyType="Startup Validator"
      resultTitle="Startup Validation Report"
      resultEmoji="📊"
      buildPrompt={buildPrompt}
      rows={7}
    />
  );
}
