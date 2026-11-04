'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useBrand } from '@/providers/BrandProvider';
import type { GeneralSettings } from '@/lib/types/settings';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function GeneralSettingsPage() {
  const router = useRouter();
  const { updateBrand } = useBrand();
  
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preview states
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  useEffect(() => {
    api<GeneralSettings>('/api/settings/general')
      .then((data) => {
        setSettings(data);
        setLogoPreview(data.logo_url);
        setFaviconPreview(data.favicon_url);
      })
      .catch(() => setMessage({ type: 'error', text: 'Failed to load settings.' }));
  }, []);

  // Handle file selection and generate a temporary preview URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    if (type === 'logo') setLogoPreview(objectUrl);
    if (type === 'favicon') setFaviconPreview(objectUrl);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!settings) return;

    const form = new FormData(e.currentTarget);
    setSaving(true);
    setMessage(null);

    try {
      await api('/api/settings/general', { method: 'PUT', body: form });
      
      setMessage({ type: 'success', text: 'Settings saved successfully.' });

      // Instantly update the Sidebar and Topbar context
      updateBrand({
        app_name: form.get('app_name') as string,
        tagline: form.get('tagline') as string,
        primary_color: form.get('primary_color') as string,
        secondary_color: form.get('secondary_color') as string,
        logo_url: logoPreview, 
        favicon_url: faviconPreview,
      });

      // Trigger a Next.js soft refresh to update the <title> and favicon in the browser tab
      router.refresh();

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message ?? 'Save failed.' });
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <p className="p-6">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">General Settings</h1>
        <p className="text-sm text-slate-500">Manage your system's branding, colors, and identity.</p>
      </div>

      {message && (
        <div className={`rounded-lg p-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
        {/* Main Form Fields */}
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Identity</h2>
            
            <label className="block">
              <span className="text-sm font-medium text-slate-700">System Name</span>
              <input
                name="app_name"
                defaultValue={settings.app_name}
                required
                maxLength={60}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tagline</span>
              <input
                name="tagline"
                defaultValue={settings.tagline ?? ''}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Theme Colors</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Primary Color</span>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="color"
                    name="primary_color"
                    defaultValue={settings.primary_color}
                    className="h-10 w-14 cursor-pointer rounded border border-slate-300 p-1"
                  />
                  <span className="text-sm font-mono text-slate-500">{settings.primary_color}</span>
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Secondary Color</span>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="color"
                    name="secondary_color"
                    defaultValue={settings.secondary_color}
                    className="h-10 w-14 cursor-pointer rounded border border-slate-300 p-1"
                  />
                  <span className="text-sm font-mono text-slate-500">{settings.secondary_color}</span>
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Regional</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Timezone</span>
                <input
                  name="timezone"
                  defaultValue={settings.timezone}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Locale</span>
                <input
                  name="locale"
                  defaultValue={settings.locale}
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Image Previews & Uploads */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Brand Assets</h2>
            
            {/* Logo Upload & Preview */}
            <div>
              <span className="text-sm font-medium text-slate-700">System Logo</span>
              <div className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                {logoPreview ? (
                  <div className="relative mb-4 flex h-24 w-full items-center justify-center rounded-lg bg-white p-2 shadow-sm">
                    <img src={logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="mb-4 flex h-24 w-full items-center justify-center rounded-lg bg-slate-200 text-slate-400">
                    <ImageIcon size={32} />
                  </div>
                )}
                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                  <UploadCloud size={16} />
                  <span>Upload Logo</span>
                  <input type="file" name="logo" accept="image/*" className="sr-only" onChange={(e) => handleFileChange(e, 'logo')} />
                </label>
                <p className="mt-2 text-[10px] text-slate-500">PNG, JPG, SVG up to 2MB</p>
              </div>
            </div>

            {/* Favicon Upload & Preview */}
            <div>
              <span className="text-sm font-medium text-slate-700">Favicon</span>
              <div className="mt-2 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                  {faviconPreview ? (
                    <img src={faviconPreview} alt="Favicon Preview" className="h-8 w-8 object-contain" />
                  ) : (
                    <ImageIcon size={20} className="text-slate-400" />
                  )}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                  <span>Change Favicon</span>
                  <input type="file" name="favicon" accept=".ico,.png,image/*" className="sr-only" onChange={(e) => handleFileChange(e, 'favicon')} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {saving ? 'Saving Changes…' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}