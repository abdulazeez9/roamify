import { getSession } from 'next-auth/react';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Only get session on client side
  const session = typeof window !== 'undefined' ? await getSession() : null;

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach the token
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const res = await fetch(`${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }
  return data;
}
