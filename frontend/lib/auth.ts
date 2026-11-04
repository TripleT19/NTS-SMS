import { api, csrf } from './api';
import type { AuthPayload } from './types/auth';

export async function login(email: string, password: string): Promise<AuthPayload> {
  await csrf();
  return api<AuthPayload>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await csrf();
  await api('/api/logout', { method: 'POST' });
}

export async function fetchMe(): Promise<AuthPayload> {
  return api<AuthPayload>('/api/me');
}