import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import campaignService from '../../Services/campaigns';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import type { Campaign } from '../../../types';

const AdminCampaignModeration: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'pending' | 'reported' | 'draft'>('pending');
  const [actionId, setActionId] = useState<string | null>(null);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'campaigns', status],
    queryFn: async () => {
      const response = await campaignService.getAll({
        status: status === 'pending' ? 'pending_verification' : status === 'draft' ? 'draft' : 'rejected',
        limit: 25,
        sort: 'desc'
      });
      return getApiData<{ data: Campaign[]; nextCursor: string | null }>(response);
    }
  });

  const campaigns = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data?.data ?? []).filter((campaign) => {
      if (!term) return true;
      return `${campaign.title} ${campaign.category}`.toLowerCase().includes(term);
    });
  }, [data, search]);

  const handleVerify = async (id: string, nextStatus: 'approved' | 'rejected') => {
    setActionId(id);
    try {
      await adminService.verifyCampaign(id, { status: nextStatus });
      await refetch();
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="p-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <nav className="flex text-sm text-slate-500 mb-2 gap-2">
              <span>Admin</span>
              <span>/</span>
              <span className="text-primary font-medium">Campaign Moderation</span>
            </nav>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Moderation Queue</h1>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <span className="material-icons text-[18px]">file_download</span>
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <span className="material-icons text-[18px]">refresh</span>
              {isFetching ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Search campaigns or organizers..."
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <select
                className="bg-background-light dark:bg-zinc-800 border-none rounded-lg text-sm py-2 px-4 focus:ring-2 focus:ring-primary"
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
              >
                <option value="pending">Pending</option>
                <option value="reported">Reported</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                Viewing {campaigns.length} campaigns
              </span>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Goal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {campaigns.map((campaign) => (
                <tr key={campaign._id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{campaign.title}</p>
                      <p className="text-xs text-slate-500 italic">{campaign.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{campaign.category}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    ETB {campaign.goalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Pending Review
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleVerify(campaign._id, 'approved')}
                        className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary/90"
                        disabled={actionId === campaign._id}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerify(campaign._id, 'rejected')}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        disabled={actionId === campaign._id}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                    No campaigns found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminCampaignModeration;
