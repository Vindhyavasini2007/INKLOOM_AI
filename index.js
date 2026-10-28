import "dotenv/config";
import express from "express";
import app from "./server/src/app.js";

// Vercel detects the default Express export and runs it as a function.
void express;
export default app;
