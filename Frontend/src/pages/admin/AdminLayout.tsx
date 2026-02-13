import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, LayoutDashboard, Menu, Settings, ShieldCheck, Users, X } from 'lucide-react';
import { useAuthStore } from '../../store';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);

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

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const handleChange = () => setIsOpen(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex">
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close admin navigation"
          onClick={() => setIsOpen(false)}
        />
      )}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold text-primary">ImpactGive</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800"
          aria-label="Toggle admin navigation"
        >
          {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </header>
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
        } md:translate-x-0 md:w-64`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">ImpactGive</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="ml-auto md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800"
            aria-label="Close admin navigation"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
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
        <div className="mt-auto">
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="mx-4 mb-6 w-[calc(100%-2rem)] rounded-lg bg-red-600 text-white font-bold py-2.5 hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 pt-16 md:pt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
