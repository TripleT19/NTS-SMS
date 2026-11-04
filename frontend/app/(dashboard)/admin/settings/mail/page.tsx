'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { MailSettings } from '@/lib/types/settings';
import { 
  Server, 
  Mail, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

export default function MailSettingsPage() {
  const [settings, setSettings] = useState<MailSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api<MailSettings>('/api/settings/mail')
      .then(setSettings)
      .catch(() => setMessage({ type: 'error', text: 'Failed to load mail settings.' }));
  }, []);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    
    // Do not send an empty password, otherwise it overwrites the existing one
    if (!payload.password) delete payload.password;

    setSaving(true);
    setMessage(null);
    
    try {
      await api('/api/settings/mail', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setMessage({ type: 'success', text: 'Mail settings saved successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message ?? 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleTest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Grab the data from the main form, not just the test form
    const mainForm = document.getElementById('mail-settings-form') as HTMLFormElement;
    if (!mainForm) return;

    const formData = new FormData(mainForm);
    const recipient = new FormData(e.currentTarget).get('recipient') as string;
    
    const payload = Object.fromEntries(formData.entries());
    if (!payload.password) delete payload.password;

    setTesting(true);
    setMessage(null);
    
    try {
      await api('/api/settings/mail/test', {
        method: 'POST',
        body: JSON.stringify({ ...payload, recipient }),
      });
      setMessage({ type: 'success', text: `Test email sent successfully to ${recipient}.` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message ?? 'Test failed. Check your credentials.' });
    } finally {
      setTesting(false);
    }
  }

  if (!settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" style={{ borderTopColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mail Settings</h1>
        <p className="text-sm text-slate-500">Configure the SMTP server used to send system emails, notifications, and reports.</p>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className={`flex items-start gap-3 rounded-lg p-4 text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
        {/* Main Configuration Form */}
        <div className="md:col-span-2 space-y-6">
          <form id="mail-settings-form" onSubmit={handleSave} className="space-y-6">
            
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Server className="h-5 w-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">SMTP Configuration</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Host</span>
                  <input 
                    name="host" 
                    defaultValue={settings.host ?? ''} 
                    required 
                    placeholder="e.g. smtp.mailtrap.io"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Port</span>
                  <input 
                    name="port" 
                    type="number" 
                    defaultValue={settings.port ?? 587} 
                    required 
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Username</span>
                  <input 
                    name="username" 
                    defaultValue={settings.username ?? ''} 
                    required 
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Password {settings.has_password && <em className="text-xs font-normal text-slate-500">(leave blank to keep existing)</em>}
                  </span>
                  <input 
                    name="password" 
                    type="password" 
                    placeholder={settings.has_password ? "••••••••" : "Enter password"}
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </label>
              </div>

              <label className="block sm:w-1/2">
                <span className="text-sm font-medium text-slate-700">Encryption</span>
                <select 
                  name="encryption" 
                  defaultValue={settings.encryption ?? ''} 
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">None (Not Recommended)</option>
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                </select>
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Mail className="h-5 w-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Sender Identity</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">From Address</span>
                  <input 
                    name="from_address" 
                    type="email" 
                    defaultValue={settings.from_address ?? ''} 
                    required 
                    placeholder="noreply@school.edu"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">From Name</span>
                  <input 
                    name="from_name" 
                    defaultValue={settings.from_name ?? ''} 
                    placeholder="Nzeru Academy"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Reply-To Address (Optional)</span>
                <input 
                  name="reply_to_address" 
                  type="email" 
                  defaultValue={settings.reply_to_address ?? ''} 
                  placeholder="support@school.edu"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {saving ? 'Saving Settings…' : 'Save Mail Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar - Test Email Card */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Send className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900">Test Connection</h2>
            </div>
            
            <p className="text-sm text-slate-500 mb-4">
              Send a test email to verify your SMTP settings. This uses the values currently entered in the form, even if they haven't been saved yet.
            </p>

            <form onSubmit={handleTest} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Recipient Email</span>
                <input 
                  name="recipient" 
                  type="email" 
                  required 
                  placeholder="your-email@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                />
              </label>

              <button 
                type="submit" 
                disabled={testing} 
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-800" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Note */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Security Note</h3>
                <p className="mt-1 text-xs text-blue-700">
                  Passwords are encrypted at rest in the database. Changing these settings will automatically restart background queue workers so they pick up the new credentials immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}