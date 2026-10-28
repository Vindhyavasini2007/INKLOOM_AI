import mongoose from "mongoose";
const { Schema, model } = mongoose;
const ref = (extra = {}) => ({ type: Schema.Types.ObjectId, ...extra });

export const Organization = model("Organization", new Schema({
  name: { type: String, required: true },
  settings: { allowSelfApproval: { type: Boolean, default: false }, aiEnabled: { type: Boolean, default: true } },
}, { timestamps: true }));

export const User = model("User", new Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true, required: true },
  passwordHash: { type: String, required: true },
  organisationId: ref({ required: true, index: true }),
  role: { type: String, enum: ["admin", "creator", "reviewer"], default: "creator" },
}, { timestamps: true }));

export const Guideline = model("Guideline", new Schema({
  organisationId: ref({ required: true, index: true }),
  category: { type: String, enum: ["terminology", "claims", "tone"], required: true },
  pattern: { type: String, required: true, maxlength: 200 }, // case-insensitive regex
  replacement: String,
  rule: { type: String, required: true },
  severity: { type: String, enum: ["critical", "high", "medium", "low"], default: "medium" },
  version: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
}, { timestamps: true }));

export const ApprovedFact = model("ApprovedFact", new Schema({
  organisationId: ref({ required: true, index: true }),
  topic: { type: String, required: true },
  statement: { type: String, required: true },
  source: String,
  keywords: [String],
  match: { regex: String, expected: String }, // optional deterministic check; first capture group is compared to expected
  validFrom: Date,
  validUntil: Date,
  status: { type: String, enum: ["active", "retired"], default: "active" },
  version: { type: Number, default: 1 },
}, { timestamps: true }));

export const BrandAsset = model("BrandAsset", new Schema({
  organisationId: ref({ required: true, index: true }),
  name: { type: String, required: true },
  type: { type: String, enum: ["color", "typography", "logo", "badge", "imagery", "guideline_doc"], default: "color" },
  value: { type: String, required: true },
  description: String,
  usageRules: String,
  tags: [String],
  version: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
}, { timestamps: true }));

const versionSchema = new Schema({
  n: Number, text: String, authorId: ref(), authorName: String, note: String,
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

export const Content = model("Content", new Schema({
  organisationId: ref({ required: true, index: true }),
  title: { type: String, required: true },
  type: { type: String, default: "marketing" },
  status: { type: String, enum: ["draft", "in_review", "changes_requested", "approved", "rejected"], default: "draft" },
  createdBy: ref({ required: true }),
  createdByName: String,
  versions: [versionSchema],
  dismissals: [String],
  submittedAt: Date,
  decidedAt: Date,
}, { timestamps: true }));

const findingSchema = new Schema({
  fid: String, category: String, severity: String, excerpt: String, start: Number, end: Number,
  explanation: String, sourceType: String, sourceId: String, sourceLabel: String,
  evidenceMissing: Boolean, suggestion: String, origin: String,
  status: { type: String, enum: ["open", "accepted", "rejected"], default: "open" },
}, { _id: false });

export const Review = model("Review", new Schema({
  organisationId: ref({ required: true, index: true }),
  contentId: ref({ required: true, index: true }),
  version: Number,
  findings: [findingSchema],
  score: Number,
  blocking: Boolean,
  modelInfo: { aiUsed: Boolean, model: String, note: String },
}, { timestamps: true }));

export const Approval = model("Approval", new Schema({
  organisationId: ref({ required: true, index: true }),
  contentId: ref({ required: true, index: true }),
  version: Number,
  reviewerId: ref(), reviewerName: String,
  decision: { type: String, enum: ["approved", "changes_requested", "rejected"] },
  comment: String,
  override: { type: Boolean, default: false },
  decidedAt: { type: Date, default: Date.now },
}));

export const AuditLog = model("AuditLog", new Schema({
  organisationId: ref({ required: true, index: true }),
  actorId: ref(), actorName: String, action: String, targetId: ref({ index: true }),
  meta: Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
}));

export const NewsletterSubscription = model("NewsletterSubscription", new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  consentedAt: { type: Date, required: true },
  source: { type: String, required: true, enum: ["inkloom_website"] },
}, { timestamps: true }));
