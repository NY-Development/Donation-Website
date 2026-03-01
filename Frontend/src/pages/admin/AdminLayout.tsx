import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Headset, LayoutDashboard, Menu, Settings, ShieldCheck, Users, X } from 'lucide-react';
import { useAuthStore } from '../../store';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/image.png';

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const navItems = useMemo(
    () => [
      { label: t('pages.admin.nav.dashboard'), to: '/admin', icon: LayoutDashboard },
      { label: t('pages.admin.nav.campaigns'), to: '/admin/campaigns', icon: BarChart3 },
      { label: t('pages.admin.nav.users'), to: '/admin/users', icon: Users },
      { label: t('pages.admin.nav.reports'), to: '/admin/reports', icon: ShieldCheck },
      { label: t('pages.admin.nav.support'), to: '/admin/support', icon: Headset },
      { label: t('pages.admin.nav.settings'), to: '/admin/settings', icon: Settings }
    ],
    [t]
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

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <img src={logo} className="size-4 sm:size-5" aria-hidden="true" />
          </div>
          <span className="text-base sm:text-lg font-bold text-primary truncate max-w-[150px]">
            {t('pages.admin.layout.brandName')}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-95 transition-transform"
          aria-label={t('pages.admin.layout.toggleNav')}
        >
          {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-[280px] sm:w-64`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <img src={logo} className="size-5" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary whitespace-nowrap">
            {t('pages.admin.layout.brandName')}
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="ml-auto md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label={t('pages.admin.layout.closeNav')}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
                  active
                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon 
                  className={`size-5 transition-transform group-hover:scale-110 ${active ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`} 
                  aria-hidden="true" 
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 shrink-0">
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold py-3 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all active:scale-[0.98]"
          >
            <span className="material-icons text-[20px]">logout</span>
            {t('pages.admin.actions.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <main className="pt-16 md:pt-0 min-h-screen">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;