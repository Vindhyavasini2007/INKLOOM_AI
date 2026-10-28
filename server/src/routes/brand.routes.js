import { Router } from "express";
import { z } from "zod";
import { Guideline, ApprovedFact, BrandAsset } from "../models.js";
import { auth, allow } from "../middleware/auth.js";
import { wrap, validId, httpError } from "../utils.js";
import { audit } from "../services/auditService.js";

const r = Router();
r.use(auth);

const safeRegex = z.string().max(200).refine((s) => { try { new RegExp(s); return true; } catch { return false; } }, "Invalid pattern");
const guidelineSchema = z.object({
  category: z.enum(["terminology", "claims", "tone"]), pattern: safeRegex, replacement: z.string().max(300).optional(),
  rule: z.string().min(3).max(500), severity: z.enum(["critical", "high", "medium", "low"]).default("medium"),
});
const factSchema = z.object({
  topic: z.string().min(1).max(120), statement: z.string().min(3).max(500), source: z.string().max(300).optional(),
  keywords: z.array(z.string().max(40)).max(20).default([]),
  match: z.object({ regex: safeRegex, expected: z.string().max(100) }).optional(),
  validFrom: z.coerce.date().optional(), validUntil: z.coerce.date().optional(),
});
const assetSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(["color", "typography", "logo", "badge", "imagery", "guideline_doc"]).default("color"),
  value: z.string().min(1).max(10000),
  description: z.string().max(500).optional(),
  usageRules: z.string().max(1000).optional(),
  tags: z.array(z.string().max(40)).max(20).default([]),
});

function crud(path, Model, schema, name) {
  r.get(`/${path}`, wrap(async (req, res) => {
    res.json(await Model.find({ organisationId: req.user.organisationId }).sort({ createdAt: -1 }));
  }));
  r.post(`/${path}`, allow("admin"), wrap(async (req, res) => {
    const doc = await Model.create({ ...schema.parse(req.body), organisationId: req.user.organisationId });
    await audit(req.user, `${name}.created`, doc._id);
    res.status(201).json(doc);
  }));
  r.put(`/${path}/:id`, allow("admin"), wrap(async (req, res) => {
    if (!validId(req.params.id)) throw httpError(400, "Invalid id");
    const doc = await Model.findOne({ _id: req.params.id, organisationId: req.user.organisationId });
    if (!doc) throw httpError(404, "Not found");
    Object.assign(doc, schema.parse(req.body));
    doc.version += 1; // every edit is a new version so old findings stay explainable
    await doc.save();
    await audit(req.user, `${name}.updated`, doc._id, { version: doc.version });
    res.json(doc);
  }));
  r.delete(`/${path}/:id`, allow("admin"), wrap(async (req, res) => {
    if (!validId(req.params.id)) throw httpError(400, "Invalid id");
    const doc = await Model.findOne({ _id: req.params.id, organisationId: req.user.organisationId });
    if (!doc) throw httpError(404, "Not found");
    if (name === "guideline" || name === "asset") doc.active = false; else doc.status = "retired";
    await doc.save(); // deactivate, never delete: keeps history reproducible
    await audit(req.user, `${name}.deactivated`, doc._id);
    res.json(doc);
  }));
}
crud("guidelines", Guideline, guidelineSchema, "guideline");
crud("facts", ApprovedFact, factSchema, "fact");
crud("assets", BrandAsset, assetSchema, "asset");
export default r;
