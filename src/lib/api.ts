import { AuthUser } from '@/lib/auth-shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/** Gets a JWT from BetterAuth (jwt plugin /token endpoint) for API calls. */
export async function getToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/token', { credentials: 'include' });
    if (!res.ok) return null;
    const json = (await res.json()) as { token?: string };
    return json.token ?? null;
  } catch {
    return null;
  }
}

/** Fetch helper that attaches the JWT and unwraps { success, message, data } responses. */
export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string } & T;
  if (!res.ok) {
    throw new Error(json.message ?? `Request failed (${res.status})`);
  }
  return json;
}

/** Uploads a file to ImgBB via the backend proxy; returns the hosted URL. */
export async function uploadImage(file: File): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
  const json = await api<{ url: string }>('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ image: base64 }),
  });
  return json.url;
}

export type { AuthUser };
