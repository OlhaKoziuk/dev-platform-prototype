export interface Profile {
  id: string;
  name: string;
  city: string;
  about: string;
  rating: number;
  skills: string[];
  photo?: string | null;
}

export interface ScoredProfile extends Profile {
  score: number;
  matchedSkills: string[];
}
