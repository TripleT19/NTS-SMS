import type { Metadata } from 'next';
import { getPublicSettings } from '@/lib/getPublicSettings';
import { BrandProvider } from '@/providers/BrandProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicSettings();

  return {
    title: s.app_name,
    description: s.tagline ?? `${s.app_name} management portal`,
    icons: s.favicon_url
      ? { icon: s.favicon_url }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getPublicSettings();

  const primaryColor = s.primary_color || '#1E88E5';
  const secondaryColor = s.secondary_color || '#00C853';

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        style={{
          '--color-primary': primaryColor,
          '--color-secondary': secondaryColor,
        } as React.CSSProperties}
      >
        <BrandProvider initial={s}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </BrandProvider>
      </body>
    </html>
  );
}