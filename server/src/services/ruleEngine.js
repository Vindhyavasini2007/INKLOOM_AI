// Deterministic checks. Pure functions: no database or network access.
export const WEIGHTS = { critical: 25, high: 12, medium: 6, low: 2 };

export const dismissKey = (f) => `${f.category}|${f.excerpt.toLowerCase()}`;

export function scoreFindings(findings) {
  const open = findings.filter((f) => f.status === "open");
  const score = Math.max(0, 100 - open.reduce((n, f) => n + (WEIGHTS[f.severity] || 0), 0));
  return { score, blocking: open.some((f) => f.severity === "critical") };
}

export function runRules(text, guidelines, facts) {
  const out = [];
  for (const g of guidelines) {
    let re;
    try { re = new RegExp(g.pattern, "gi"); } catch { continue; }
    for (const m of text.matchAll(re)) {
      if (!m[0]) continue;
      out.push({
        category: g.category, severity: g.severity, excerpt: m[0], start: m.index, end: m.index + m[0].length,
        explanation: g.rule, sourceType: "guideline", sourceId: String(g._id),
        sourceLabel: `Guideline v${g.version}: ${g.rule}`, evidenceMissing: false,
        suggestion: g.replacement || null, origin: "rule",
      });
    }
  }
  for (const f of facts) {
    if (!f.match?.regex || f.match.expected == null) continue;
    let re;
    try { re = new RegExp(f.match.regex, "gi"); } catch { continue; }
    for (const m of text.matchAll(re)) {
      const got = m.slice(1).find((v) => v !== undefined);
      if (got === undefined || String(got) === String(f.match.expected)) continue;
      out.push({
        category: "factual", severity: "critical", excerpt: m[0], start: m.index, end: m.index + m[0].length,
        explanation: `The draft says “${got}” but the approved information says “${f.match.expected}”.`,
        sourceType: "fact", sourceId: String(f._id), sourceLabel: `Approved fact v${f.version}: ${f.statement}`,
        evidenceMissing: false, suggestion: m[0].replace(got, f.match.expected), origin: "rule",
      });
    }
  }
  const accessibilityChecks = [
    {
      pattern: /<img\b(?![^>]*\balt\s*=)[^>]*>/gi,
      explanation: "Images need descriptive alternative text so people using screen readers can understand their purpose.",
      label: "Built-in accessibility check: add descriptive alternative text to images.",
    },
    {
      pattern: /!\[\s*\]\([^)]+\)/g,
      explanation: "Images need descriptive alternative text so people using screen readers can understand their purpose.",
      label: "Built-in accessibility check: add descriptive alternative text to images.",
    },
    {
      pattern: /<a\b[^>]*>\s*(?:click here|here|read more|learn more)\s*<\/a>/gi,
      explanation: "Link text should describe its destination or action, rather than relying on surrounding context.",
      label: "Built-in accessibility check: use descriptive link text.",
    },
    {
      pattern: /\[(?:click here|here|read more|learn more)\]\([^)]+\)/gi,
      explanation: "Link text should describe its destination or action, rather than relying on surrounding context.",
      label: "Built-in accessibility check: use descriptive link text.",
    },
  ];
  for (const check of accessibilityChecks) {
    for (const match of text.matchAll(check.pattern)) {
      out.push({
        category: "accessibility", severity: "medium", excerpt: match[0], start: match.index, end: match.index + match[0].length,
        explanation: check.explanation, sourceType: "accessibility", sourceId: null, sourceLabel: check.label,
        evidenceMissing: false, suggestion: null, origin: "rule",
      });
    }
  }

  const visualAndGovernanceChecks = [
    {
      pattern: /\b(?:TODO|LOREM IPSUM|TBD|REPLACE[ _-]ME|INSERT[ _-]LINK)\b/gi,
      category: "messaging",
      severity: "high",
      explanation: "Draft contains unverified placeholder copy that must be completed before publication.",
      label: "Governance check: remove draft placeholders before submitting.",
    },
    {
      pattern: /(?:logo[-_]?(?:old|draft|v1|temp|sample)\.(?:png|jpg|svg|webp))/gi,
      category: "visual",
      severity: "high",
      explanation: "Draft references an unapproved or deprecated logo asset. Use official brand assets from the Brand Kit.",
      label: "Brand Asset Rule: use official approved logo assets.",
    },
    {
      pattern: /(?:style=["'][^"']*\b(?:color|background)\s*:\s*(?:#(?:ff0000|00ff00|0000ff)|red|lime|magenta)\b[^"']*["'])/gi,
      category: "visual",
      severity: "medium",
      explanation: "Unapproved saturated color detected in inline styles. Use approved brand color palette tokens.",
      label: "Brand Asset Rule: follow approved color palette.",
    },
  ];
  for (const check of visualAndGovernanceChecks) {
    for (const match of text.matchAll(check.pattern)) {
      out.push({
        category: check.category, severity: check.severity, excerpt: match[0], start: match.index, end: match.index + match[0].length,
        explanation: check.explanation, sourceType: "governance", sourceId: null, sourceLabel: check.label,
        evidenceMissing: false, suggestion: null, origin: "rule",
      });
    }
  }
  return out;
}

// Keep the highest-severity finding when spans overlap, then sort by position.
export function dedupe(findings) {
  const rank = { critical: 4, high: 3, medium: 2, low: 1 };
  const sorted = [...findings].sort((a, b) => (a.origin === b.origin ? 0 : a.origin === "rule" ? -1 : 1) ||
    rank[b.severity] - rank[a.severity] || (b.end - b.start) - (a.end - a.start));
  const kept = [];
  for (const f of sorted) if (!kept.some((k) => f.start < k.end && k.start < f.end)) kept.push(f);
  return kept.sort((a, b) => a.start - b.start);
}
