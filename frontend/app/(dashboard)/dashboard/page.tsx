'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user, roles } = useAuth();

  const stats = [
    { name: 'Total Students', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Classes', value: '42', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Grades Pending', value: '18', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Published Reports', value: '856', icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 text-white shadow-lg"
        style={{
          background: `linear-gradient(to right, var(--color-navy), var(--color-primary))`
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="mt-2 text-white/80">
            You are logged in as <span className="font-semibold text-white">{roles.join(', ')}</span>.
          </p>
        </div>
        {/* Decorative shapes */}
        <div className="absolute right-0 top-0 -mr-8 -mt-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-20 -mb-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900">
            Add New Student
          </button>
          <button className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900">
            Enter Grades
          </button>
          <button 
            className="flex items-center justify-center rounded-lg py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Generate Report Cards
          </button>
        </div>
      </div>
    </div>
  );
}