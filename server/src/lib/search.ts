import type { Profile, ScoredProfile } from "../types.js";

const normalize = (s: string) => s.trim().toLowerCase();

export function rankProfiles(all: Profile[], querySkills: string[]): ScoredProfile[] {
  const q = Array.from(new Set(querySkills.map(normalize))).filter(Boolean);
  if (q.length === 0) return [];

  const results: ScoredProfile[] = all.map((p) => {
    const matched = p.skills
      .map(normalize)
      .filter((skill) => q.includes(skill));

    const score = Math.min(5, matched.length);
    return { ...p, score, matchedSkills: matched };
  })
  .filter(p => p.score >= 1)
  .sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.rating - a.rating;
  });

  return results;
}
