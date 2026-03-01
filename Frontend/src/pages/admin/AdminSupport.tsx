import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import supportService from '../../Services/support';
import { getApiData } from '../../store/apiHelpers';
import { useTranslation } from 'react-i18next';
import { Search, RefreshCw, User, MessageSquare, Inbox } from 'lucide-react';

type SupportItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
};

type SupportListResponse = {
  data: SupportItem[];
  total: number;
  page: number;
  limit: number;
};

const AdminSupport: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'support', search],
    queryFn: async () => {
      const response = await supportService.listForAdmin({
        limit: 100,
        search: search.trim() || undefined,
        status: 'open'
      });
      return getApiData<SupportListResponse>(response);
    }
  });

  const requests = data?.data ?? [];

  const summary = useMemo(() => {
    return {
      total: data?.total ?? 0,
      open: requests.filter((item) => item.status === 'open').length,
      withAccount: requests.filter((item) => Boolean(item.user?.id)).length
    };
  }, [data?.total, requests]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('pages.admin.support.title', 'Support Requests')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
              {t('pages.admin.support.subtitle', 'Review contact issues submitted by users.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20 text-sm"
          >
            <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
            {t('pages.admin.support.refresh', 'Refresh')}
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatCard 
            label={t('pages.admin.support.stats.total', 'Total requests')} 
            value={summary.total} 
            icon={<Inbox className="size-5" />}
          />
          <StatCard 
            label={t('pages.admin.support.stats.open', 'Open requests')} 
            value={summary.open} 
            icon={<MessageSquare className="size-5" />}
          />
          <StatCard 
            label={t('pages.admin.support.stats.withAccount', 'From signed-in users')} 
            value={summary.withAccount} 
            icon={<User className="size-5" />}
          />
        </div>

        {/* List Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Search and Metadata Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                placeholder={t('pages.admin.support.searchPlaceholder', 'Search by name, email, subject...')}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full self-start md:self-center">
              {t('pages.admin.support.showing', { shown: requests.length, total: summary.total, defaultValue: 'Showing {{shown}} of {{total}}' })}
            </span>
          </div>

          {/* Status Handling */}
          {isLoading && (
            <div className="p-12 text-center">
              <RefreshCw className="size-8 text-primary animate-spin mx-auto mb-4 opacity-20" />
              <p className="text-sm text-slate-500">{t('pages.admin.support.loading', 'Loading support requests...')}</p>
            </div>
          )}

          {isError && (
            <div className="p-12 text-center">
              <p className="text-sm text-red-600 font-medium">{t('pages.admin.support.error', 'Unable to load support requests right now.')}</p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((item) => (
                <article key={item.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
                        {item.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="truncate">{item.email}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                        <span className="uppercase font-bold tracking-wider">{t('pages.admin.support.submitted_label', 'Submitted')}:</span>
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                      
                      {item.user?.id && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 text-primary rounded text-[10px] font-bold mt-2 border border-primary/10 uppercase">
                          <User className="size-3" />
                          {t('pages.admin.support.accountLinked', {
                            role: item.user.role ?? 'user',
                            defaultValue: 'Linked: {{role}}'
                          })}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 self-start">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {item.message}
                    </p>
                  </div>
                </article>
              ))}

              {requests.length === 0 && (
                <div className="p-12 text-center">
                  <Inbox className="size-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-sm text-slate-500">{t('pages.admin.support.empty', 'No support requests found.')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Internal Stat Card Helper
const StatCard = ({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
    <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 rounded-xl transition-all">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black mt-0.5 tabular-nums">{value}</p>
    </div>
  </div>
);

export default AdminSupport;