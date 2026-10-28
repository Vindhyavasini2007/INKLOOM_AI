import test from "node:test";
import assert from "node:assert/strict";
import { runRules, dedupe, scoreFindings } from "../src/services/ruleEngine.js";
import { retrieve } from "../src/services/sourceRetrieval.js";

const facts = [{ _id: "f1", version: 1, statement: "Our product provides a 14-day free trial.", keywords: ["free", "trial"],
  match: { regex: "free (?:for )?(\\d+) days|(\\d+)[- ]day free trial", expected: "14" } }];
const guidelines = [
  { _id: "g1", version: 1, category: "claims", severity: "high", pattern: "(?:the )?best platform in the world", replacement: "A platform designed to help teams work more efficiently", rule: "Superlatives need evidence." },
  { _id: "g2", version: 1, category: "claims", severity: "high", pattern: "guarantee[sd]? (?:you )?\\d+% success", replacement: "Designed to help you achieve your goals", rule: "No absolute guarantees." },
];
const text = "Try our product free for 60 days! It is the best platform in the world, and we guarantee 100% success.";

test("finds the wrong trial length with its source and a fix", () => {
  const f = runRules(text, guidelines, facts).find((x) => x.category === "factual");
  assert.equal(f.excerpt, "free for 60 days");
  assert.equal(f.suggestion, "free for 14 days");
  assert.equal(f.sourceId, "f1");
  assert.equal(f.severity, "critical");
});
test("does not flag the correct trial length", () => {
  assert.equal(runRules("Enjoy a 14-day free trial.", [], facts).length, 0);
});
test("finds three issues in the example copy", () => {
  assert.equal(dedupe(runRules(text, guidelines, facts)).length, 3);
});
test("score drops and critical findings block approval", () => {
  const f = dedupe(runRules(text, guidelines, facts)).map((x) => ({ ...x, status: "open" }));
  const s = scoreFindings(f);
  assert.equal(s.blocking, true);
  assert.equal(s.score, 100 - 25 - 12 - 12);
  f.forEach((x) => (x.status = "rejected"));
  assert.equal(scoreFindings(f).blocking, false);
});
test("retrieval returns the trial fact for trial copy", () => {
  assert.equal(retrieve(text, facts, guidelines)[0].id, "f1");
});
test("flags images without alternative text and vague link text", () => {
  const findings = runRules('Read [click here](https://example.test) or see <img src="launch.png">.', [], []);
  assert.equal(findings.length, 2);
  assert.deepEqual(findings.map((finding) => finding.category), ["accessibility", "accessibility"]);
  assert.match(findings.find((finding) => finding.excerpt.includes("click here")).explanation, /Link text/);
  assert.match(findings.find((finding) => finding.excerpt.includes("<img")).explanation, /alternative text/);
  assert.equal(findings.every((finding) => finding.suggestion === null), true);
});
test("does not flag images with alternative text or descriptive links", () => {
  assert.equal(runRules('Read [the launch guide](https://example.test) <img src="launch.png" alt="Team at launch">.', [], []).length, 0);
});
test("flags unapproved placeholder text and deprecated visual assets", () => {
  const findings = runRules('Launch promo: TODO: add discount. See <img src="logo-old.png" alt="Logo">.', [], []);
  assert.equal(findings.length, 2);
  assert.equal(findings.some((f) => f.category === "messaging" && f.excerpt === "TODO"), true);
  assert.equal(findings.some((f) => f.category === "visual" && f.excerpt === "logo-old.png"), true);
});
