import test from "node:test";
import assert from "node:assert/strict";
import { newsletterEmailSchema } from "../src/routes/newsletter.routes.js";

test("newsletter email is trimmed and normalized before storage", () => {
  assert.deepEqual(newsletterEmailSchema.parse({ email: "  Reader@Example.COM " }), { email: "reader@example.com" });
});

test("newsletter signup requires a valid email address", () => {
  assert.equal(newsletterEmailSchema.safeParse({ email: "not-an-email" }).success, false);
});

test("newsletter signup does not accept an email over 254 characters", () => {
  const email = `${"a".repeat(250)}@test.com`;
  assert.equal(newsletterEmailSchema.safeParse({ email }).success, false);
});
