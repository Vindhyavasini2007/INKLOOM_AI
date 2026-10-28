import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { NewsletterSubscription } from "../models.js";
import { wrap } from "../utils.js";

const r = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });
export const newsletterEmailSchema = z.object({ email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()) });
const genericResponse = { message: "Request received." };

r.post("/subscribe", limiter, wrap(async (req, res) => {
  const { email } = newsletterEmailSchema.parse(req.body);
  try {
    await NewsletterSubscription.updateOne(
      { email },
      { $setOnInsert: { email, consentedAt: new Date(), source: "inkloom_website" } },
      { upsert: true },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
  res.status(200).json(genericResponse);
}));

r.post("/unsubscribe", limiter, wrap(async (req, res) => {
  const { email } = newsletterEmailSchema.parse(req.body);
  await NewsletterSubscription.deleteOne({ email });
  res.status(200).json(genericResponse);
}));

export default r;
