import React, { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, FileText, LayoutDashboard, Settings, ShieldCheck, Users } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = useMemo(
    () => [
      { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
      { label: 'Campaigns', to: '/admin/campaigns', icon: BarChart3 },
      { label: 'Users', to: '/admin/users', icon: Users },
      { label: 'Reports', to: '/admin/reports', icon: ShieldCheck },
      { label: 'Settings', to: '/admin/settings', icon: Settings }
    ],
    []
  );

  const isActive = (to: string) => {
    if (to === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex">
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 ${
          isOpen ? 'w-64' : 'w-20'
        } transition-all duration-200`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          {isOpen && <span className="text-xl font-bold tracking-tight text-primary">ImpactGive</span>}
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive(item.to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5'
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="m-4 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-primary rounded-lg border border-slate-200 dark:border-slate-800"
        >
          {isOpen ? 'Collapse' : 'Expand'}
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
