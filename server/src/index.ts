import express from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Profile } from "./types.js";
import { rankProfiles } from "./lib/search.js";

const app = express();
const devOrigins = ["http://localhost:5173", "http://localhost:5174"];
const envOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      const allowAllInProd = envOrigins.length === 0;
      const isDev = devOrigins.includes(origin);
      const isWhitelisted = envOrigins.includes(origin);

      if (isDev || isWhitelisted || allowAllInProd) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const profilesPath = path.join(__dirname, "data", "profiles.json");
const profiles: Profile[] = JSON.parse(readFileSync(profilesPath, "utf-8"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/profiles", (_req, res) => {
  res.json(profiles);
});

app.post("/search", (req, res) => {
  const skills = Array.isArray(req.body?.skills) ? req.body.skills : [];
  const results = rankProfiles(profiles, skills);
  res.json({ query: skills, total: results.length, results });
});

app.get("/", (_req, res) => {
  res.type("text").send("Accountable demo API is running. Try GET /profiles");
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});


