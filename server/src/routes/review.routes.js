import { Router } from "express";
import { z } from "zod";
import { Content, Review } from "../models.js";
import { auth, allow } from "../middleware/auth.js";
import { wrap, validId, httpError } from "../utils.js";
import { audit } from "../services/auditService.js";
import { createReview } from "../services/reviewEngine.js";
import { scoreFindings, dismissKey } from "../services/ruleEngine.js";

const r = Router();
r.use(auth);

r.post("/", allow("creator", "admin", "reviewer"), wrap(async (req, res) => {
  const { contentId } = z.object({ contentId: z.string() }).parse(req.body);
  if (!validId(contentId)) throw httpError(404, "Not found");
  const c = await Content.findOne({ _id: contentId, organisationId: req.user.organisationId });
  if (!c) throw httpError(404, "Not found");
  res.status(201).json(await createReview(req.user, c));
}));

r.get("/:id", wrap(async (req, res) => {
  if (!validId(req.params.id)) throw httpError(404, "Not found");
  const rv = await Review.findOne({ _id: req.params.id, organisationId: req.user.organisationId });
  if (!rv) throw httpError(404, "Not found");
  res.json(rv);
}));

// Accept (apply the fix as a new version, then re-run the checks) or reject a suggestion.
r.post("/:id/suggestions/:fid", allow("creator", "admin"), wrap(async (req, res) => {
  const { action } = z.object({ action: z.enum(["accept", "reject"]) }).parse(req.body);
  if (!validId(req.params.id)) throw httpError(404, "Not found");
  const rv = await Review.findOne({ _id: req.params.id, organisationId: req.user.organisationId });
  if (!rv) throw httpError(404, "Not found");
  const c = await Content.findOne({ _id: rv.contentId, organisationId: req.user.organisationId });
  if (String(c.createdBy) !== String(req.user._id) && req.user.role !== "admin") throw httpError(403, "Only the author or an admin can act on suggestions");
  if (!["draft", "changes_requested"].includes(c.status)) throw httpError(409, "Content is locked");
  const f = rv.findings.find((x) => x.fid === req.params.fid);
  if (!f || f.status !== "open") throw httpError(400, "Finding is not open");

  if (action === "reject") {
    f.status = "rejected";
    if (!c.dismissals.includes(dismissKey(f))) c.dismissals.push(dismissKey(f));
    Object.assign(rv, scoreFindings(rv.findings));
    rv.markModified("findings");
    await Promise.all([c.save(), rv.save()]);
    await audit(req.user, "suggestion.rejected", c._id, { category: f.category, sourceId: f.sourceId, excerpt: f.excerpt });
    return res.json({ content: c, review: rv });
  }

  const cur = c.versions.at(-1);
  if (rv.version !== cur.n) throw httpError(409, "This review is out of date. Re-run the review");
  if (!f.suggestion) throw httpError(400, "No automatic fix for this finding. Edit the text yourself");
  if (cur.text.slice(f.start, f.end) !== f.excerpt) throw httpError(409, "The text changed. Re-run the review");
  const newText = cur.text.slice(0, f.start) + f.suggestion + cur.text.slice(f.end);
  c.versions.push({ n: cur.n + 1, text: newText, authorId: req.user._id, authorName: req.user.name, note: `Accepted ${f.category} suggestion` });
  await c.save();
  f.status = "accepted";
  Object.assign(rv, scoreFindings(rv.findings));
  rv.markModified("findings");
  await rv.save();
  await audit(req.user, "suggestion.accepted", c._id, { category: f.category, sourceId: f.sourceId, version: cur.n + 1 });
  res.json({ content: c, review: await createReview(req.user, c) }); // auto re-check the revised text
}));
export default r;
