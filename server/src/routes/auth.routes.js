import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { User, Organization } from "../models.js";
import { auth } from "../middleware/auth.js";
import { wrap, httpError } from "../utils.js";
import { audit } from "../services/auditService.js";

const r = Router();
r.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 60 }));
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "8h" });
export const publicUser = (u) => ({ id: String(u._id), name: u.name, email: u.email, role: u.role, organisationId: String(u.organisationId) });

r.post("/register", wrap(async (req, res) => {
  const b = z.object({
    name: z.string().min(1).max(100), email: z.string().email(),
    password: z.string().min(8).max(100), organisationName: z.string().min(1).max(120),
  }).parse(req.body);
  if (await User.findOne({ email: b.email.toLowerCase() })) throw httpError(409, "That email is already registered");
  const org = await Organization.create({ name: b.organisationName });
  const user = await User.create({
    name: b.name, email: b.email, passwordHash: await bcrypt.hash(b.password, 10), organisationId: org._id, role: "admin",
  });
  await audit(user, "org.created", org._id, { name: org.name });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
}));

r.post("/login", wrap(async (req, res) => {
  const b = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
  const user = await User.findOne({ email: b.email.toLowerCase() });
  if (!user || !(await bcrypt.compare(b.password, user.passwordHash))) throw httpError(401, "Wrong email or password");
  res.json({ token: sign(user), user: publicUser(user) });
}));

r.get("/me", auth, (req, res) => res.json({ user: publicUser(req.user) }));
export default r;
