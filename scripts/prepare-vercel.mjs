import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";

for (const dir of ["public", "dist"]) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
  mkdirSync(dir, { recursive: true });
  cpSync("client/dist", dir, { recursive: true });
}
