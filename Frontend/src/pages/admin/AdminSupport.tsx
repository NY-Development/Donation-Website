import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import supportService from '../../Services/support';
import { getApiData } from '../../store/apiHelpers';
import { useTranslation } from 'react-i18next';

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

  const { data, isLoading, isError, refetch } = useQuery({
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <main className="p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('pages.admin.support.title', 'Support Requests')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t('pages.admin.support.subtitle', 'Review contact issues submitted by users.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {t('pages.admin.support.refresh', 'Refresh')}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{t('pages.admin.support.stats.total', 'Total requests')}</p>
            <p className="text-2xl font-bold mt-2">{summary.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{t('pages.admin.support.stats.open', 'Open requests')}</p>
            <p className="text-2xl font-bold mt-2">{summary.open}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{t('pages.admin.support.stats.withAccount', 'From signed-in users')}</p>
            <p className="text-2xl font-bold mt-2">{summary.withAccount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                placeholder={t('pages.admin.support.searchPlaceholder', 'Search by name, email, subject...')}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t('pages.admin.support.showing', { shown: requests.length, total: summary.total, defaultValue: 'Showing {{shown}} of {{total}}' })}
            </span>
          </div>

          {isLoading && (
            <div className="p-8 text-center text-sm text-slate-500">
              {t('pages.admin.support.loading', 'Loading support requests...')}
            </div>
          )}

          {isError && (
            <div className="p-8 text-center text-sm text-red-600">
              {t('pages.admin.support.error', 'Unable to load support requests right now.')}
            </div>
          )}

          {!isLoading && !isError && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((item) => (
                <article key={item.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.subject}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {item.name} · {item.email}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {t('pages.admin.support.submitted', {
                          date: new Date(item.createdAt).toLocaleString(),
                          defaultValue: 'Submitted {{date}}'
                        })}
                      </p>
                      {item.user?.id && (
                        <p className="text-xs text-primary mt-1">
                          {t('pages.admin.support.accountLinked', {
                            role: item.user.role ?? 'user',
                            defaultValue: 'Linked account role: {{role}}'
                          })}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{item.message}</p>
                </article>
              ))}

              {requests.length === 0 && (
                <div className="p-8 text-center text-sm text-slate-500">
                  {t('pages.admin.support.empty', 'No support requests found.')}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSupport;
