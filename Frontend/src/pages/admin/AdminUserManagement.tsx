import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';

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
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'all' | 'donor' | 'organizer' | 'admin'>('all');
  const [verification, setVerification] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const { data, isError } = useQuery({
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

  return (
    <div className="min-h-screen">
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">User Management</h1>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <span className="text-sm text-slate-500 font-medium">
            Showing {users.length} of {data?.total ?? 0} users
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Unable to load users. Please try again.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Total Donors</p>
            <p className="text-2xl font-bold mt-2">{counts.donors}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Organizers</p>
            <p className="text-2xl font-bold mt-2">{counts.organizers}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Pending Verification</p>
            <p className="text-2xl font-bold mt-2">{counts.pending}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Admins</p>
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
                  placeholder="Search by name, email or ID..."
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Pending', value: 'pending' }
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
                <option value="all">All Roles</option>
                <option value="donor">Donors</option>
                <option value="organizer">Organizers</option>
                <option value="admin">Admins</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                <span className="material-icons-round text-sm">person_add</span>
                Invite User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">User</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Role</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Verification</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-center">Joined</th>
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
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                      No users found.
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
