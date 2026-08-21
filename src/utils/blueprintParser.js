export function parseBlueprint(aiText) {
  if (!aiText) return [];

  const sections = [
    {
      key: "Startup Name",
      aliases: ["Startup Name", "Business Name", "Company Name", "Project Name"],
      icon: "💡",
      color: "#8B5CF6",
    },
    {
      key: "Problem",
      aliases: ["Problem", "Pain Point", "Challenge"],
      icon: "❗",
      color: "#EF4444",
    },
    {
      key: "Solution",
      aliases: ["Solution", "Product", "Our Solution"],
      icon: "✅",
      color: "#22C55E",
    },
    {
      key: "Target Audience",
      aliases: [
        "Target Audience",
        "Audience",
        "Customer",
        "Customers",
        "Customer Segment",
        "Target Market",
      ],
      icon: "🎯",
      color: "#3B82F6",
    },
    {
      key: "Revenue",
      aliases: [
        "Revenue",
        "Revenue Model",
        "Business Model",
        "Monetization",
        "Pricing",
      ],
      icon: "💰",
      color: "#F59E0B",
    },
    {
      key: "Marketing",
      aliases: [
        "Marketing",
        "Marketing Strategy",
        "Go-To-Market",
        "GTM Strategy",
      ],
      icon: "📢",
      color: "#EC4899",
    },
    {
      key: "Launch",
      aliases: [
        "Launch",
        "Execution",
        "Implementation",
        "Roadmap",
        "30-Day Roadmap",
      ],
      icon: "🚀",
      color: "#06B6D4",
    },
    {
      key: "Growth",
      aliases: [
        "Growth",
        "Scaling",
        "Future Growth",
        "Expansion",
      ],
      icon: "📈",
      color: "#10B981",
    },
  ];

  return extractSections(aiText, sections);
}

export function parseBusinessSnapshot(aiText) {
  if (!aiText) return [];

  const sections = [
    {
      key: "Investment",
      aliases: [
        "Estimated Startup Cost",
        "Startup Cost",
        "Investment",
        "Budget",
      ],
      icon: "💰",
      color: "#F59E0B",
    },
    {
      key: "Revenue Potential",
      aliases: [
        "Revenue Potential",
        "Revenue Forecast",
        "Revenue Streams",
      ],
      icon: "📈",
      color: "#10B981",
    },
    {
      key: "Market Opportunity",
      aliases: [
        "Market Opportunity",
        "Market Size",
        "Opportunity",
      ],
      icon: "🌍",
      color: "#3B82F6",
    },
    {
      key: "Competition",
      aliases: [
        "Competitor Analysis",
        "Competition",
        "Competitors",
      ],
      icon: "⚔️",
      color: "#EF4444",
    },
    {
      key: "Funding",
      aliases: [
        "Funding Strategy",
        "Funding",
      ],
      icon: "💸",
      color: "#8B5CF6",
    },
    {
      key: "KPIs",
      aliases: [
        "Key Metrics",
        "KPIs",
        "Metrics",
      ],
      icon: "📊",
      color: "#06B6D4",
    },
    {
      key: "Risks",
      aliases: [
        "Risks",
        "Risk",
        "Risk Analysis",
      ],
      icon: "⚠️",
      color: "#F97316",
    },
    {
      key: "Next Steps",
      aliases: [
        "Next Steps",
        "Action Plan",
        "Immediate Actions",
      ],
      icon: "🚀",
      color: "#22C55E",
    },
  ];

  return extractSections(aiText, sections);
}

function extractSections(aiText, sections) {
  const nodes = [];

  sections.forEach((section) => {
    let found = "";

    for (const alias of section.aliases) {
      const regex = new RegExp(
        `${alias}[\\s\\S]*?(?=\\n[A-Z#]|$)`,
        "i"
      );

      const match = aiText.match(regex);

      if (match) {
        found = match[0];
        break;
      }
    }

    if (!found) return;

    let text = found;

    section.aliases.forEach((alias) => {
      text = text.replace(new RegExp(alias, "ig"), "");
    });

    text = text
      .replace(/[*#:>-]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    nodes.push({
      key: section.key,
      icon: section.icon,
      color: section.color,
      text: text || "AI generated summary",
    });
  });

  return nodes;
}