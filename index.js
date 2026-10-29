import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app from "./server/src/app.js";
import { connectDB } from "./server/src/config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "server/.env") });

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`Inkloom AI server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error("Failed to connect to database:", err.message);
    });
}

export default app;
