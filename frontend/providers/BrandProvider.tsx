'use client';

import { createContext, useContext, useState } from 'react';
import type { PublicSettings } from '@/lib/types/settings';

type BrandContextType = PublicSettings & {
  updateBrand: (newSettings: Partial<PublicSettings>) => void;
};

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({
  initial,
  children,
}: {
  initial: PublicSettings;
  children: React.ReactNode;
}) {
  const [brand, setBrand] = useState<PublicSettings>(initial);

  const updateBrand = (newSettings: Partial<PublicSettings>) => {
    setBrand((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <BrandContext.Provider value={{ ...brand, updateBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used inside BrandProvider');
  return ctx;
}