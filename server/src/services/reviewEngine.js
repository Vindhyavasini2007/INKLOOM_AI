import { Guideline, ApprovedFact, Review, Organization } from "../models.js";
import { runRules, dedupe, scoreFindings, dismissKey } from "./ruleEngine.js";
import { retrieve } from "./sourceRetrieval.js";
import { aiReview } from "./aiReview.js";
import { audit } from "./auditService.js";

// Runs the hybrid review on the latest version of a content item and stores it.
export async function createReview(user, content) {
  const org = await Organization.findById(user.organisationId);
  const now = new Date();
  const [guidelines, facts] = await Promise.all([
    Guideline.find({ organisationId: user.organisationId, active: true }),
    ApprovedFact.find({
      organisationId: user.organisationId, status: "active",
      $and: [{ $or: [{ validFrom: null }, { validFrom: { $lte: now } }] }, { $or: [{ validUntil: null }, { validUntil: { $gte: now } }] }],
    }),
  ]);
  const cur = content.versions.at(-1);
  const sources = retrieve(cur.text, facts, guidelines);
  const ai = org?.settings?.aiEnabled === false
    ? { used: false, model: null, findings: [], note: "AI disabled for this organisation" }
    : await aiReview(cur.text, sources);

  const valid = new Map(sources.map((s) => [s.id, s]));
  const aiFindings = [];
  for (const f of ai.findings) {
    const start = cur.text.indexOf(f.excerpt);
    if (start < 0) continue; // excerpt must exist in the submitted text
    const src = f.sourceId ? valid.get(f.sourceId) : null; // citations must come from retrieved sources
    aiFindings.push({
      category: f.category, severity: f.severity, excerpt: f.excerpt, start, end: start + f.excerpt.length,
      explanation: f.explanation, sourceType: src?.type || null, sourceId: src?.id || null, sourceLabel: src?.label || null,
      evidenceMissing: ["factual", "claims", "terminology"].includes(f.category) && !src,
      suggestion: f.suggestion || null, origin: "ai",
    });
  }
  const findings = dedupe([...runRules(cur.text, guidelines, facts), ...aiFindings]).map((f, i) => ({
    ...f, fid: String(i + 1), status: content.dismissals.includes(dismissKey(f)) ? "rejected" : "open",
  }));
  const { score, blocking } = scoreFindings(findings);
  const review = await Review.create({
    organisationId: user.organisationId, contentId: content._id, version: cur.n, findings, score, blocking,
    modelInfo: { aiUsed: ai.used, model: ai.model, note: ai.note },
  });
  await audit(user, "review.run", content._id, { version: cur.n, findings: findings.length, score, aiUsed: ai.used });
  return review;
}
