import express from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Profile } from "./types.js";
import { rankProfiles } from "./lib/search.js";

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

