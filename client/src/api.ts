import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL as string) || '';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const getProfiles = () => api.get('/profiles').then(r => r.data);
export const searchProfiles = (skills: string[]) =>
  api.post('/search', { skills }).then(r => r.data);


