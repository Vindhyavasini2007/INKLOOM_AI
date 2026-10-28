import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models.js";
import { auth, allow } from "../middleware/auth.js";
import { wrap, httpError } from "../utils.js";
import { audit } from "../services/auditService.js";
import { publicUser } from "./auth.routes.js";

const r = Router();
r.use(auth);
r.get("/", wrap(async (req, res) => {
  res.json((await User.find({ organisationId: req.user.organisationId }).sort({ createdAt: 1 })).map(publicUser));
}));
r.post("/", allow("admin"), wrap(async (req, res) => {
  const b = z.object({
    name: z.string().min(1).max(100), email: z.string().email(), password: z.string().min(8).max(100),
    role: z.enum(["admin", "creator", "reviewer"]),
  }).parse(req.body);
  if (await User.findOne({ email: b.email.toLowerCase() })) throw httpError(409, "That email is already registered");
  const u = await User.create({ name: b.name, email: b.email, role: b.role, organisationId: req.user.organisationId, passwordHash: await bcrypt.hash(b.password, 10) });
  await audit(req.user, "team.user_added", u._id, { role: b.role });
  res.status(201).json(publicUser(u));
}));
export default r;
