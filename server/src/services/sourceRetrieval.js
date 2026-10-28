// Simple keyword retrieval over approved facts and guidelines. Swap for vector search at scale.
const tokens = (s) => (s || "").toLowerCase().match(/[a-z0-9]{3,}/g) || [];

export function retrieve(text, facts, guidelines, k = 10) {
  const words = new Set(tokens(text));
  const score = (s) => tokens(s).reduce((n, w) => n + (words.has(w) ? 1 : 0), 0);
  const items = [
    ...facts.map((f) => ({ id: String(f._id), type: "fact", label: f.statement, s: score(`${f.statement} ${(f.keywords || []).join(" ")}`) })),
    ...guidelines.map((g) => ({ id: String(g._id), type: "guideline", label: g.rule, s: score(g.rule) + (g.category === "tone" ? 1 : 0) })),
  ];
  return items.filter((i) => i.s > 0).sort((a, b) => b.s - a.s).slice(0, k);
}
