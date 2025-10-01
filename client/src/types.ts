export interface Profile {
  id: string;
  name: string;
  city: string;
  about: string;
  rating: number;
  skills: string[];
  photo?: string | null;
  age?: number;
}


export interface ScoredProfile extends Profile {
  score: number;
  matchedSkills: string[];
}

export interface SearchResponse {
  query: string[];
  total: number;
  results: ScoredProfile[];
}

