import { PublicSettings } from './types/settings';

// Server-side call goes straight to Laravel.
// Client-side never runs this function.
const SERVER_API_URL = process.env.LARAVEL_INTERNAL_URL ?? 'http://localhost:8000';

const FALLBACK: PublicSettings = {
  app_name: process.env.NEXT_PUBLIC_APP_NAME ?? 'NTS SMS',
  tagline: null,
  logo_url: null,
  favicon_url: null,
  primary_color: process.env.NEXT_PUBLIC_PRIMARY_COLOR ?? '#0F172A',
  secondary_color: '#2563EB',
};

export async function getPublicSettings(): Promise<PublicSettings> {
  try {
    const res = await fetch(`${SERVER_API_URL}/api/settings/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return FALLBACK;
    return (await res.json()) as PublicSettings;
  } catch {
    return FALLBACK;
  }
}