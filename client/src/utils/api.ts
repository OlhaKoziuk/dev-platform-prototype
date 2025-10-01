export const API_BASE = 'http://localhost:3000';

export async function apiGet<T>(url: string): Promise<T> {
  const r = await fetch(`${API_BASE}${url}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
