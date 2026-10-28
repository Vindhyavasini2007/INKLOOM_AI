import { Router } from "express";
import { Content, Review } from "../models.js";
import { auth } from "../middleware/auth.js";
import { wrap } from "../utils.js";

const r = Router();
r.use(auth);

r.get("/overview", wrap(async (req, res) => {
  const org = req.user.organisationId;
  const [contents, reviews] = await Promise.all([
    Content.find({ organisationId: org }).select("status createdByName submittedAt decidedAt").lean(),
    Review.find({ organisationId: org }).sort({ createdAt: -1 }).limit(500).lean(),
  ]);
  const authorOf = new Map(contents.map((c) => [String(c._id), c.createdByName]));
  const latest = new Map();
  for (const rv of reviews) if (!latest.has(String(rv.contentId))) latest.set(String(rv.contentId), rv);
  const latestList = [...latest.values()];

  const byCategory = {}, bySource = {}, decisions = {}, byAuthor = {}, trend = {};
  for (const rv of reviews) {
    const day = rv.createdAt.toISOString().slice(0, 10);
    for (const f of rv.findings) {
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;
      trend[day] = (trend[day] || 0) + 1;
      const author = authorOf.get(String(rv.contentId)) || "Unknown";
      byAuthor[author] = (byAuthor[author] || 0) + 1;
      const key = f.sourceLabel || (f.evidenceMissing ? "No supporting source found" : `${f.category} (AI)`);
      const s = (bySource[key] ||= { label: key, count: 0, accepted: 0, rejected: 0 });
      s.count += 1;
      if (f.status === "accepted") s.accepted += 1;
      if (f.status === "rejected") s.rejected += 1;
    }
  }
  const approved = contents.filter((c) => c.status === "approved" && c.submittedAt && c.decidedAt);
  const hours = approved.length ? approved.reduce((n, c) => n + (c.decidedAt - c.submittedAt) / 36e5, 0) / approved.length : null;
  const sources = Object.values(bySource);
  res.json({
    totalContent: contents.length,
    avgScore: latestList.length ? Math.round(latestList.reduce((n, x) => n + x.score, 0) / latestList.length) : null,
    criticalOpen: latestList.reduce((n, x) => n + x.findings.filter((f) => f.status === "open" && f.severity === "critical").length, 0),
    pendingApprovals: contents.filter((c) => c.status === "in_review").length,
    avgHoursToApproval: hours === null ? null : Math.round(hours * 10) / 10,
    byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
    topSources: sources.sort((a, b) => b.count - a.count).slice(0, 6),
    // Rules whose suggestions are often rejected may be unclear or too strict.
    needsClarification: sources.filter((s) => s.accepted + s.rejected >= 3 && s.rejected / (s.accepted + s.rejected) >= 0.5)
      .map((s) => ({ ...s, rejectionRate: Math.round((s.rejected / (s.accepted + s.rejected)) * 100) })),
    byAuthor: Object.entries(byAuthor).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6),
    trend: Object.entries(trend).sort().slice(-14).map(([day, value]) => ({ day: day.slice(5), value })),
  });
}));
export default r;
