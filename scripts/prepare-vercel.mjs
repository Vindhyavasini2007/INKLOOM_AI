import { cpSync, mkdirSync } from "node:fs";

mkdirSync("public", { recursive: true });
cpSync("client/dist", "public", { recursive: true });
