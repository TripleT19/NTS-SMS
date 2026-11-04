
'use client';

import { useAuth } from '@/providers/AuthProvider';
import {
  LogOut,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export function Topbar() {
  const { user, signOut } = useAuth();

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="hidden h-9 w-1 rounded-full bg-[#1E88E5] sm:block" />

        <div>
          <p className="text-sm font-bold text-[#0A1930]">
            Management Portal
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your institution efficiently
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Security Status */}
        <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-2 md:flex">
          <ShieldCheck size={15} className="text-[#00C853]" />
          <span className="text-[11px] font-semibold text-green-700">
            Secure Session
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">

          <div className="hidden text-right sm:block">
            <p className="max-w-[180px] truncate text-sm font-bold text-[#0A1930]">
              {user?.name || 'User'}
            </p>
            <p className="max-w-[180px] truncate text-xs text-slate-500">
              {user?.email || ''}
            </p>
          </div>

          {/* Avatar */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-md shadow-blue-500/20"
            style={{
              background: 'linear-gradient(135deg, #1E88E5, #1263B0)',
            }}
          >
            {initials}
          </div>

        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* Sign Out */}
        <button
          type="button"
          onClick={() => signOut()}
          className="group flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
          title="Sign out"
        >
          <LogOut
            size={17}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          <span className="hidden sm:inline">Sign out</span>
        </button>

      </div>
    </header>
  );
}
