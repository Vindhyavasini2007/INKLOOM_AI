import { Router } from "express";
import { z } from "zod";
import { Content, Review, Approval, AuditLog, Organization } from "../models.js";
import { auth, allow } from "../middleware/auth.js";
import { wrap, validId, httpError } from "../utils.js";
import { audit } from "../services/auditService.js";

const r = Router();
r.use(auth);
const text = z.string().min(1).max(20000);

async function load(req) {
  if (!validId(req.params.id)) throw httpError(404, "Not found");
  const c = await Content.findOne({ _id: req.params.id, organisationId: req.user.organisationId }); // org isolation
  if (!c) throw httpError(404, "Not found");
  return c;
}
const isOwnerOrAdmin = (u, c) => u.role === "admin" || String(c.createdBy) === String(u._id);
const latestReview = (c) => Review.findOne({ contentId: c._id }).sort({ createdAt: -1 });

r.post("/", allow("creator", "admin"), wrap(async (req, res) => {
  const b = z.object({ title: z.string().min(1).max(200), type: z.enum(["marketing", "social", "email", "web"]).default("marketing"), text }).parse(req.body);
  const c = await Content.create({
    organisationId: req.user.organisationId, title: b.title, type: b.type, createdBy: req.user._id, createdByName: req.user.name,
    versions: [{ n: 1, text: b.text, authorId: req.user._id, authorName: req.user.name, note: "Initial draft" }],
  });
  await audit(req.user, "content.created", c._id, { title: b.title });
  res.status(201).json(c);
}));

r.get("/", wrap(async (req, res) => {
  const q = { organisationId: req.user.organisationId };
  if (req.query.status) q.status = String(req.query.status);
  const items = await Content.find(q).select("-versions.text -dismissals").sort({ updatedAt: -1 }).limit(200).lean();
  const reviews = await Review.find({ contentId: { $in: items.map((i) => i._id) } }).sort({ createdAt: -1 }).lean();
  const latest = new Map();
  for (const rv of reviews) if (!latest.has(String(rv.contentId))) latest.set(String(rv.contentId), rv);
  res.json(items.map((i) => {
    const rv = latest.get(String(i._id));
    return { ...i, versionCount: i.versions.length, score: rv?.score ?? null, openIssues: rv ? rv.findings.filter((f) => f.status === "open").length : null };
  }));
}));

r.get("/:id", wrap(async (req, res) => {
  const c = await load(req);
  const [review, approvals, auditLog] = await Promise.all([
    latestReview(c), Approval.find({ contentId: c._id }).sort({ decidedAt: -1 }),
    AuditLog.find({ targetId: c._id, organisationId: req.user.organisationId }).sort({ timestamp: -1 }).limit(60),
  ]);
  res.json({ content: c, review, approvals, audit: auditLog });
}));

r.put("/:id", allow("creator", "admin"), wrap(async (req, res) => {
  const c = await load(req);
  if (!isOwnerOrAdmin(req.user, c)) throw httpError(403, "Only the author or an admin can edit");
  if (!["draft", "changes_requested"].includes(c.status)) throw httpError(409, "This content is locked while it is in review or decided");
  const b = z.object({ text, note: z.string().max(200).optional() }).parse(req.body);
  const cur = c.versions.at(-1);
  if (b.text === cur.text) throw httpError(400, "No changes to save");
  c.versions.push({ n: cur.n + 1, text: b.text, authorId: req.user._id, authorName: req.user.name, note: b.note || "Manual edit" });
  await c.save();
  await audit(req.user, "content.revised", c._id, { version: cur.n + 1 });
  res.json(c);
}));

r.post("/:id/submit", allow("creator", "admin"), wrap(async (req, res) => {
  const c = await load(req);
  if (!isOwnerOrAdmin(req.user, c)) throw httpError(403, "Only the author or an admin can submit");
  if (!["draft", "changes_requested"].includes(c.status)) throw httpError(409, "Already submitted or decided");
  const rv = await latestReview(c);
  if (!rv || rv.version !== c.versions.at(-1).n) throw httpError(400, "Run a review on the latest version before submitting");
  c.status = "in_review"; c.submittedAt = new Date();
  await c.save();
  await audit(req.user, "content.submitted", c._id, { version: rv.version, score: rv.score, blocking: rv.blocking });
  res.json(c);
}));

async function decide(req, res, decision) {
  const c = await load(req);
  if (c.status !== "in_review") throw httpError(409, "Content is not waiting for review");
  const org = await Organization.findById(req.user.organisationId);
  if (String(c.createdBy) === String(req.user._id) && !org?.settings?.allowSelfApproval) throw httpError(403, "You cannot decide on your own content");
  const b = z.object({ comment: z.string().max(1000).default(""), override: z.boolean().optional() }).parse(req.body);
  if (decision !== "approved" && b.comment.trim().length < 3) throw httpError(400, "A comment is required");
  let override = false;
  if (decision === "approved") {
    const rv = await latestReview(c);
    if (!rv || rv.version !== c.versions.at(-1).n) throw httpError(409, "The latest version has not been reviewed. Ask the creator to re-run the review");
    if (rv.findings.some((f) => f.status === "open" && f.severity === "critical")) {
      if (!b.override || b.comment.trim().length < 5) throw httpError(409, "Critical issues are still open. Resolve them, or override with a written reason");
      override = true;
    }
  }
  const status = { approved: "approved", changes_requested: "changes_requested", rejected: "rejected" }[decision];
  await Approval.create({
    organisationId: req.user.organisationId, contentId: c._id, version: c.versions.at(-1).n, reviewerId: req.user._id,
    reviewerName: req.user.name, decision, comment: b.comment, override,
  });
  c.status = status; c.decidedAt = new Date();
  await c.save();
  await audit(req.user, `content.${decision}`, c._id, { comment: b.comment, override });
  res.json(c);
}
r.post("/:id/approve", allow("reviewer", "admin"), wrap((req, res) => decide(req, res, "approved")));
r.post("/:id/request-changes", allow("reviewer", "admin"), wrap((req, res) => decide(req, res, "changes_requested")));
r.post("/:id/reject", allow("reviewer", "admin"), wrap((req, res) => decide(req, res, "rejected")));
export default r;
