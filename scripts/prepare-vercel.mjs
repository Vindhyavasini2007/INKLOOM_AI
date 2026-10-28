import { cpSync, mkdirSync, writeFileSync } from "node:fs";

mkdirSync("public", { recursive: true });
cpSync("client/dist", "public", { recursive: true });

const entrypoint = 'import app from "../index.js";\nexport default app;\n';
writeFileSync("public/index.js", entrypoint);
writeFileSync("public/app.js", entrypoint);
writeFileSync("public/server.js", entrypoint);
