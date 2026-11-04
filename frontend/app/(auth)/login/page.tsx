
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { AppLogo } from '@/components/layout/AppLogo';
import { useBrand } from '@/providers/BrandProvider';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const brand = useBrand();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      const message =
        err?.body?.errors?.email?.[0] ??
        err?.body?.message ??
        'Unable to sign in. Check your credentials.';

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#F8FAFC]">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#1E88E5]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-[#00C853]/5 blur-3xl" />

      {/* LEFT BRANDING PANEL */}
      <section
        className="relative hidden w-[52%] flex-col justify-between overflow-hidden p-12 text-white lg:flex xl:p-16"
        style={{
          background:
            'linear-gradient(145deg, #0A1930 0%, #102D50 55%, #16436B 100%)',
        }}
      >
        {/* Decorative Shapes */}
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full border border-white/10" />
        <div className="absolute -right-24 top-36 h-[350px] w-[350px] rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-32 h-[450px] w-[450px] rounded-full bg-[#1E88E5]/10 blur-2xl" />

        {/* Branding */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-black/10">
            <AppLogo size={44} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {brand.app_name}
            </h2>
            <p className="mt-0.5 text-xs font-medium tracking-[0.2em] text-blue-200">
              EDUCATION MANAGEMENT
            </p>
          </div>
        </div>

        {/* Main Branding Content */}
        <div className="relative z-10 max-w-xl py-16">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#00C853]" />
            Smart. Secure. Connected.
          </div>

          <h1 className="text-5xl font-black leading-[1.15] tracking-tight xl:text-6xl">
            Simplifying
            <br />
            <span className="text-[#1E88E5]">Education</span>
            <br />
            Management.
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-slate-300">
            Welcome to the {brand.app_name} portal. A smarter way to manage
            students, academic records, grades, reports and institutional
            operations, all in one secure platform.
          </p>

          {/* Features */}
          <div className="mt-10 grid grid-cols-2 gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E88E5]/20 text-[#60B4FF]">
                <GraduationCap size={21} />
              </div>
              <div>
                <p className="text-sm font-semibold">Academic Records</p>
                <p className="text-xs text-slate-400">Organised and accessible</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C853]/15 text-[#00C853]">
                <ShieldCheck size={21} />
              </div>
              <div>
                <p className="text-sm font-semibold">Secure Access</p>
                <p className="text-xs text-slate-400">Protected information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {brand.app_name}. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} className="text-[#00C853]" />
            Secure Portal
          </div>
        </div>
      </section>

      {/* RIGHT LOGIN SECTION */}
      <section className="relative z-10 flex w-full items-center justify-center px-5 py-12 sm:px-8 lg:w-[48%] lg:px-12">

        <div className="w-full max-w-[440px]">

          {/* Mobile Branding */}
          <div className="mb-10 flex flex-col items-center lg:hidden">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg shadow-slate-200">
              <AppLogo size={60} />
            </div>

            <h2 className="text-xl font-extrabold text-[#0A1930]">
              {brand.app_name}
            </h2>

            <p className="mt-1 text-xs font-medium tracking-widest text-slate-500">
              EDUCATION MANAGEMENT
            </p>
          </div>

          {/* Login Heading */}
          <div className="mb-9">
            <div className="mb-5 hidden h-1.5 w-14 rounded-full bg-gradient-to-r from-[#1E88E5] to-[#00C853] lg:block" />

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1E88E5]">
              Welcome Back
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1930] sm:text-4xl">
              Sign in to your
              <br />
              account<span className="text-[#1E88E5]">.</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your login credentials below to access your dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#0A1930]"
              >
                Email Address
              </label>

              <div className="group relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#1E88E5]"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-[#0A1930] shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1E88E5] focus:ring-4 focus:ring-[#1E88E5]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#0A1930]"
                >
                  Password
                </label>
              </div>

              <div className="group relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#1E88E5]"
                />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-[#0A1930] shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1E88E5] focus:ring-4 focus:ring-[#1E88E5]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#1E88E5]"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
              >
                <span className="mt-0.5">!</span>
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#1E88E5] px-6 text-sm font-bold text-white shadow-lg shadow-[#1E88E5]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1675C7] hover:shadow-xl hover:shadow-[#1E88E5]/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Signing you in...
                </>
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

          </form>

          {/* Security Information */}
          <div className="mt-9 flex items-center justify-center gap-2 border-t border-slate-200 pt-6">
            <ShieldCheck size={17} className="text-[#00C853]" />

            <p className="text-xs text-slate-500">
              Your account and information are protected.
            </p>
          </div>

          {/* Copyright */}
          <p className="mt-7 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} {brand.app_name}. All rights reserved.
          </p>

        </div>
      </section>
    </main>
  );
}
