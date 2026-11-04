'use client';

import { useBrand } from '@/providers/BrandProvider';

export function AppLogo({ size = 32 }: { size?: number }) {
  const { logo_url, app_name } = useBrand();

  if (logo_url) {
    return (
      <img
        src={logo_url}
        alt={`${app_name} logo`}
        className="h-full w-full object-contain"
        style={{
          maxWidth: size,
          maxHeight: size,
        }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl font-extrabold text-white"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, var(--color-primary), #1263B0)',
        fontSize: Math.max(12, size * 0.45),
      }}
      aria-label={`${app_name} logo`}
    >
      {app_name?.trim()?.charAt(0)?.toUpperCase() || 'N'}
    </div>
  );
}