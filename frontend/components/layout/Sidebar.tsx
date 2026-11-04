
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppLogo } from './AppLogo';
import { useBrand } from '@/providers/BrandProvider';
import { usePermissions } from '@/hooks/usePermissions';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckSquare,
  FileText,
  GitBranch,
  Settings,
  Mail,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

export function Sidebar() {
  const { app_name } = useBrand();
  const { can } = usePermissions();
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Students',
      href: '/students',
      icon: Users,
      show: can('students.view'),
    },
    {
      name: 'Submit Grades',
      href: '/grades/submit',
      icon: BookOpen,
      show: can('grade.submit'),
    },
    {
      name: 'Approve Grades',
      href: '/grades/approvals',
      icon: CheckSquare,
      show: can('grade.approve'),
    },
    {
      name: 'Report Cards',
      href: '/admin/report-card-designer',
      icon: FileText,
      show: can('report_card.design'),
    },
    {
      name: 'Workflows',
      href: '/admin/workflows',
      icon: GitBranch,
      show: can('workflow.configure'),
    },
    {
      name: 'General Settings',
      href: '/admin/settings/general',
      icon: Settings,
      show: can('settings.general.update'),
    },
    {
      name: 'Mail Settings',
      href: '/admin/settings/mail',
      icon: Mail,
      show: can('settings.mail.update'),
    },
  ];

  const visibleNavigation = navigation.filter((item) => item.show);

  return (
    <aside
      className="flex h-screen w-64 shrink-0 flex-col overflow-hidden text-slate-300"
      style={{
        background: 'linear-gradient(180deg, #0A1930 0%, #102642 100%)',
      }}
    >
      {/* Brand Header */}
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/[0.08] px-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-lg shadow-black/10">
          <AppLogo size={36} />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold tracking-tight text-white">
            {app_name}
          </h1>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
            Management Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="custom-sidebar-scroll flex-1 space-y-1 overflow-y-auto px-3 py-6">

        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Main Menu
        </p>

        {visibleNavigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              pathname.startsWith(`${item.href}/`));

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#1E88E5]/15 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#1E88E5]" />
              )}

              <Icon
                size={19}
                strokeWidth={isActive ? 2.4 : 1.8}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#4DA3F5]'
                    : 'text-slate-500 group-hover:text-slate-200'
                }`}
              />

              <span className="flex-1">{item.name}</span>

              {isActive && (
                <ChevronRight
                  size={15}
                  className="text-[#4DA3F5]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Information */}
      <div className="shrink-0 border-t border-white/[0.08] p-4">

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00C853]/15 text-[#00C853]">
            <GraduationCap size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-white">
              Education Management
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Smart institutional solutions
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] font-medium tracking-wide text-slate-500">
          Powered by <span className="font-bold text-blue-400">Nzeru Tech</span>
        </p>

      </div>
    </aside>
  );
}
