import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";

if (existsSync("public")) {
  rmSync("public", { recursive: true, force: true });
}
mkdirSync("public", { recursive: true });
cpSync("client/dist", "public", { recursive: true });
