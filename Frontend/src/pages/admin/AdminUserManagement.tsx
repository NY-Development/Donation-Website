import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import { useTranslation } from 'react-i18next';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'organizer' | 'admin';
  isOrganizerVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

type UserResponse = {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
};

const AdminUserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'all' | 'donor' | 'organizer' | 'admin'>('all');
  const [verification, setVerification] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionId, setActionId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const { data, isError, refetch } = useQuery({
    queryKey: ['admin', 'users', search, role, verification],
    queryFn: async () => {
      const response = await adminService.getUsers({
        search: search || undefined,
        role: role === 'all' ? undefined : role,
        verification: verification === 'all' ? undefined : verification,
        limit: 100
      });
      return getApiData<UserResponse>(response);
    }
  });

  const users = data?.data ?? [];
  const counts = useMemo(() => {
    return {
      donors: users.filter((user) => user.role === 'donor').length,
      organizers: users.filter((user) => user.role === 'organizer').length,
      pending: users.filter((user) => user.verificationStatus === 'pending').length
    };
  }, [users]);

  const handleDeleteUser = async (userId: string) => {
    const confirmed = window.confirm(t('pages.admin.users.confirm.deleteOne'));
    if (!confirmed) return;

    setActionId(userId);
    try {
      await adminService.deleteUser(userId);
      await refetch();
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteAllUsers = async () => {
    const confirmed = window.confirm(t('pages.admin.users.confirm.deleteAll'));
    if (!confirmed) return;

    setBulkDeleting(true);
    try {
      await adminService.deleteAllUsers();
      await refetch();
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">{t('pages.admin.users.title')}</h1>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <span className="text-sm text-slate-500 font-medium">
            {t('pages.admin.users.showing', { shown: users.length, total: data?.total ?? 0 })}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t('pages.admin.users.loadError')}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{t('pages.admin.users.stats.totalDonors')}</p>
            <p className="text-2xl font-bold mt-2">{counts.donors}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{t('pages.admin.users.stats.organizers')}</p>
            <p className="text-2xl font-bold mt-2">{counts.organizers}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{t('pages.admin.users.stats.pending')}</p>
            <p className="text-2xl font-bold mt-2">{counts.pending}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{t('pages.admin.users.stats.admins')}</p>
            <p className="text-2xl font-bold mt-2">{users.filter((user) => user.role === 'admin').length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-75">
              <div className="relative flex-1 max-w-md">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                  placeholder={t('pages.admin.users.searchPlaceholder')}
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
                {[
                  { label: t('pages.admin.users.tabs.all'), value: 'all' },
                  { label: t('pages.admin.users.tabs.approved'), value: 'approved' },
                  { label: t('pages.admin.users.tabs.pending'), value: 'pending' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setVerification(tab.value as typeof verification)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md ${
                      verification === tab.value
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm"
                value={role}
                onChange={(event) => setRole(event.target.value as typeof role)}
              >
                <option value="all">{t('pages.admin.users.roles.all')}</option>
                <option value="donor">{t('pages.admin.users.roles.donor')}</option>
                <option value="organizer">{t('pages.admin.users.roles.organizer')}</option>
                <option value="admin">{t('pages.admin.users.roles.admin')}</option>
              </select>
              <button
                type="button"
                onClick={handleDeleteAllUsers}
                disabled={bulkDeleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                <span className="material-icons-round text-sm">delete_forever</span>
                {bulkDeleting ? t('pages.admin.users.deleting') : t('pages.admin.users.deleteAll')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">{t('pages.admin.users.table.user')}</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">{t('pages.admin.users.table.role')}</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">{t('pages.admin.users.table.verification')}</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-center">{t('pages.admin.users.table.joined')}</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-right">{t('pages.admin.users.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {t(`pages.admin.users.roles.${user.role}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {t(`pages.admin.users.verification.${user.verificationStatus}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={actionId === user.id || user.role === 'admin'}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {t('pages.admin.users.actions.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                      {t('pages.admin.users.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
