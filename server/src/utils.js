import mongoose from "mongoose";
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const validId = (id) => mongoose.isValidObjectId(id);
export const httpError = (status, message) => Object.assign(new Error(message), { status });
