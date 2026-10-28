import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Organization, User, Guideline, ApprovedFact, BrandAsset } from "./models.js";

await connectDB();
if (await Organization.findOne({ name: "Demo Co" })) {
  console.log("Demo data already exists");
  await mongoose.disconnect();
  process.exit(0);
}
const org = await Organization.create({ name: "Demo Co" });
const hash = await bcrypt.hash("Passw0rd!demo", 10);
for (const [name, email, role] of [["Alex Admin", "admin@demo.test", "admin"], ["Cara Creator", "creator@demo.test", "creator"], ["Rae Reviewer", "reviewer@demo.test", "reviewer"]]) {
  await User.create({ name, email, role, passwordHash: hash, organisationId: org._id });
}
const o = org._id;
await ApprovedFact.create({
  organisationId: o, topic: "Free trial duration", statement: "Our product provides a 14-day free trial.", source: "Pricing page, approved Jan 2026",
  keywords: ["free", "trial", "days", "product"], match: { regex: "free (?:for )?(\\d+) days|(\\d+)[- ]day free trial", expected: "14" },
});
await Guideline.insertMany([
  { organisationId: o, category: "claims", pattern: "(?:the )?best (?:platform|product|tool) in the world", replacement: "A platform designed to help teams work more efficiently", rule: "Superlatives need an approved comparative study.", severity: "high" },
  { organisationId: o, category: "claims", pattern: "guarantee[sd]? (?:you )?\\d+% success", replacement: "Designed to help you achieve your goals", rule: "Absolute guarantees are not allowed without substantiation (Claims policy).", severity: "high" },
  { organisationId: o, category: "terminology", pattern: "\\bcheap\\b", replacement: "affordable", rule: "Say “affordable”, never “cheap”.", severity: "low" },
  { organisationId: o, category: "tone", pattern: "!{2,}", replacement: "!", rule: "Keep a calm, confident tone: one exclamation mark at most.", severity: "low" },
]);
await BrandAsset.insertMany([
  {
    organisationId: o, name: "Core Brand Iris", type: "color", value: "#4F46E5",
    description: "Primary brand accent used for primary CTAs, links, and focused highlights.",
    usageRules: "Maintain 4.5:1 contrast ratio against background surfaces. Do not use for large body text blocks.",
    tags: ["core", "cta", "primary"],
  },
  {
    organisationId: o, name: "Deep Obsidian", type: "color", value: "#0F172A",
    description: "Foundational dark surface and high-emphasis body text color.",
    usageRules: "Use for headings, primary content copy, and dark container accents.",
    tags: ["neutral", "text", "dark"],
  },
  {
    organisationId: o, name: "Verification Sage", type: "color", value: "#10B981",
    description: "Trust and approval indicator color for success badges and verified claims.",
    usageRules: "Reserved exclusively for verified statuses, approved stamps, and positive metrics.",
    tags: ["status", "success", "trust"],
  },
  {
    organisationId: o, name: "Primary Wordmark (Dark & Light)", type: "logo",
    value: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    description: "Approved Inkloom AI vector wordmark with minimum 24px clear margin space.",
    usageRules: "Never stretch, tilt, recolor or add drop-shadows. Maintain 1:1 or 4:1 approved aspect lock.",
    tags: ["logo", "vector", "official"],
  },
  {
    organisationId: o, name: "Editorial Editorial Standards", type: "imagery",
    value: "Natural daylight, authentic candid team collaboration, clean minimal backgrounds.",
    description: "Photography style guide for social media cards, web hero headers, and case studies.",
    usageRules: "Avoid generic high-contrast stock imagery with artificial smiles. Favor real work environments.",
    tags: ["photography", "guidelines", "media"],
  },
]);
console.log("Seeded. Log in with admin@demo.test, creator@demo.test or reviewer@demo.test (password: Passw0rd!demo)");
await mongoose.disconnect();
