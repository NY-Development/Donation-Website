import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  ShieldCheck,
  AlarmClock, 
  ShieldAlert, 
  Search, 
  Trash2, 
  Filter, 
  MoreHorizontal,
  Mail,
  Calendar,
  UserPlus
} from 'lucide-react';

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

  const { data, isError, refetch, isFetching } = useQuery({
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
  
  const stats = useMemo(() => ({
    donors: users.filter(u => u.role === 'donor').length,
    organizers: users.filter(u => u.role === 'organizer').length,
    pending: users.filter(u => u.verificationStatus === 'pending').length,
    admins: users.filter(u => u.role === 'admin').length,
  }), [users]);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm(t('pages.admin.users.confirm.deleteOne'))) return;
    setActionId(userId);
    try {
      await adminService.deleteUser(userId);
      await refetch();
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteAllUsers = async () => {
    if (!window.confirm(t('pages.admin.users.confirm.deleteAll'))) return;
    setBulkDeleting(true);
    try {
      await adminService.deleteAllUsers();
      await refetch();
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background-dark">
      {/* Sticky Header with Glass Effect */}
      <header className="h-16 sm:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg hidden sm:block">
            <Users className="text-primary size-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight">
              {t('pages.admin.users.title')}
            </h1>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
              {t('pages.admin.users.showing', { shown: users.length, total: data?.total ?? 0 })}
            </p>
          </div>
        </div>
        <button 
          onClick={() => {}} // Logical for adding user if available
          className="flex items-center gap-2 bg-slate-900 dark:bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-primary/20"
        >
          <UserPlus className="size-4" />
          <span className="hidden md:inline">Invite Admin</span>
        </button>
      </header>

      <div className="p-4 sm:p-8 max-w-[1600px] mx-auto space-y-8">
        {isError && (
          <div className="rounded-2xl border-l-4 border-red-500 bg-red-50 dark:bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400 flex items-center gap-3">
            <ShieldAlert className="size-5" />
            {t('pages.admin.users.loadError')}
          </div>
        )}

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatMiniCard label={t('pages.admin.users.stats.totalDonors')} value={stats.donors} icon={<Users />} color="blue" />
          <StatMiniCard label={t('pages.admin.users.stats.organizers')} value={stats.organizers} icon={<ShieldCheck />} color="purple" />
          <StatMiniCard label={t('pages.admin.users.stats.pending')} value={stats.pending} icon={<AlarmClock />} color="orange" />
          <StatMiniCard label={t('pages.admin.users.stats.admins')} value={stats.admins} icon={<ShieldAlert />} color="slate" />
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder={t('pages.admin.users.searchPlaceholder')}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {['all', 'approved', 'pending'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVerification(v as any)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      verification === v 
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t(`pages.admin.users.tabs.${v}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <Filter className="size-4 text-slate-400" />
                <select
                  className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer pr-8"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="all">All Roles</option>
                  <option value="donor">Donors</option>
                  <option value="organizer">Organizers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              
              <button
                onClick={handleDeleteAllUsers}
                disabled={bulkDeleting}
                className="p-2.5 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                title={t('pages.admin.users.deleteAll')}
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          </div>

          {/* Optimized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-5">{t('pages.admin.users.table.user')}</th>
                  <th className="px-6 py-5">{t('pages.admin.users.table.role')}</th>
                  <th className="px-6 py-5">{t('pages.admin.users.table.verification')}</th>
                  <th className="px-6 py-5 hidden md:table-cell">{t('pages.admin.users.table.joined')}</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Mail className="size-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                        user.role === 'organizer' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          user.verificationStatus === 'approved' ? 'bg-green-500' :
                          user.verificationStatus === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 capitalize">
                          {user.verificationStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar className="size-3" />
                        {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          disabled={user.role === 'admin'}
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionId === user.id || user.role === 'admin'}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-20"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && !isFetching && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Users className="size-12 mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">{t('pages.admin.users.empty')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Sub-component for Stats
const StatMiniCard = ({ label, value, icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-500/10 text-blue-600',
    purple: 'bg-purple-500/10 text-purple-600',
    orange: 'bg-orange-500/10 text-orange-600',
    slate: 'bg-slate-500/10 text-slate-600',
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all">
      <div className={`p-3 rounded-2xl ${colorMap[color] || 'bg-primary/10 text-primary'} group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tabular-nums">{value}</p>
      </div>
    </div>
  );
};

export default AdminUserManagement;