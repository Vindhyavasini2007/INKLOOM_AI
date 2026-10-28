import { AuditLog } from "../models.js";

export const audit = (user, action, targetId, meta = {}) =>
  AuditLog.create({ organisationId: user.organisationId, actorId: user._id, actorName: user.name, action, targetId, meta })
    .catch((e) => console.error("audit failed", e.message));
