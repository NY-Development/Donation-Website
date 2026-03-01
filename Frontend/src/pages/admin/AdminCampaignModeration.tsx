import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import campaignService from '../../Services/campaigns';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import type { Campaign } from '../../../types';
import { useTranslation } from 'react-i18next';

type CampaignActionRequest = {
  id: string;
  action: 'pause' | 'delete';
  message: string;
  createdAt: string;
  campaign?: { id: string; title: string; status?: string };
  requestedBy?: { id: string; name: string; email?: string };
};

const AdminCampaignModeration: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'campaigns', 'all'],
    queryFn: async () => {
      const response = await campaignService.getAll({
        status: 'all',
        limit: 25,
        sort: 'desc'
      });
      return getApiData<{ data: Campaign[]; nextCursor: string | null }>(response);
    }
  });

  const {
    data: requestData,
    refetch: refetchRequests,
    isFetching: requestsLoading
  } = useQuery({
    queryKey: ['admin', 'campaign-requests'],
    queryFn: async () => {
      const response = await adminService.getCampaignRequests({ limit: 20 });
      return getApiData<CampaignActionRequest[]>(response);
    }
  });

  const campaigns = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data?.data ?? []).filter((campaign) => {
      if (!term) return true;
      return `${campaign.title} ${campaign.category}`.toLowerCase().includes(term);
    });
  }, [data, search]);

  const statusLabels = useMemo(
    () => ({
      approved: t('status.approved'),
      rejected: t('status.rejected'),
      paused: t('pages.admin.campaigns.status.paused'),
      pending_verification: t('pages.admin.campaigns.status.pendingVerification')
    }),
    [t]
  );

  const requests = requestData ?? [];

  const handleVerify = async (id: string, nextStatus: 'approved' | 'rejected') => {
    setActionId(id);
    try {
      await adminService.verifyCampaign(id, { status: nextStatus });
      await refetch();
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t('pages.admin.campaigns.confirm.deleteOne'));
    if (!confirmed) return;

    setDeleteId(id);
    try {
      await adminService.deleteCampaign(id);
      await refetch();
    } finally {
      setDeleteId(null);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(t('pages.admin.campaigns.confirm.deleteAll'));
    if (!confirmed) return;

    setBulkDeleting(true);
    try {
      await adminService.deleteAllCampaigns();
      await refetch();
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    await adminService.approveCampaignRequest(requestId);
    await refetchRequests();
  };

  const handleRejectRequest = async (requestId: string) => {
    const reason = window.prompt(t('pages.admin.campaigns.prompt.rejectReason')) ?? undefined;
    await adminService.rejectCampaignRequest(requestId, reason ? { reason } : undefined);
    await refetchRequests();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <main className="p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <nav className="flex flex-wrap items-center text-sm text-slate-500 gap-2">
              <span>{t('pages.admin.breadcrumb.admin')}</span>
              <span className="text-slate-300 dark:text-zinc-600">/</span>
              <span className="text-primary font-medium">{t('pages.admin.campaigns.breadcrumb')}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t('pages.admin.campaigns.title')}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3 sm:items-center">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-slate-700 dark:text-slate-200">
              <span className="material-icons text-[18px]">file_download</span>
              {t('pages.admin.campaigns.export')}
            </button>
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={bulkDeleting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
            >
              <span className="material-icons text-[18px]">delete_forever</span>
              <span className="whitespace-nowrap">
                {bulkDeleting ? t('pages.admin.campaigns.deleting') : t('pages.admin.campaigns.deleteAll')}
              </span>
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <span className="material-icons text-[18px]">refresh</span>
              <span className="whitespace-nowrap">
                {isFetching ? t('pages.admin.campaigns.syncing') : t('pages.admin.campaigns.syncData')}
              </span>
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                placeholder={t('pages.admin.campaigns.searchPlaceholder')}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                {t('pages.admin.campaigns.viewing', { count: campaigns.length })}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-700">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-zinc-800/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('pages.admin.campaigns.table.campaign')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('pages.admin.campaigns.table.category')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('pages.admin.campaigns.table.goal')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('pages.admin.campaigns.table.status')}</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('pages.admin.campaigns.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-[250px]">
                        <p className="font-semibold text-slate-900 dark:text-white truncate" title={campaign.title}>{campaign.title}</p>
                        <p className="text-xs text-slate-500 italic truncate">{campaign.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{campaign.category}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      ETB {campaign.goalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                          campaign.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : campaign.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : campaign.status === 'paused'
                                ? 'bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {statusLabels[campaign.status] ?? campaign.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {campaign.status === 'pending_verification' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleVerify(campaign._id, 'approved')}
                              className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                              disabled={actionId === campaign._id || deleteId === campaign._id}
                            >
                              {t('pages.admin.campaigns.actions.approve')}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerify(campaign._id, 'rejected')}
                              className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                              disabled={actionId === campaign._id || deleteId === campaign._id}
                            >
                              {t('pages.admin.campaigns.actions.reject')}
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(campaign._id)}
                          className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          disabled={deleteId === campaign._id || actionId === campaign._id}
                        >
                          {t('pages.admin.campaigns.actions.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500 dark:text-zinc-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-icons text-4xl opacity-20">inventory_2</span>
                        {t('pages.admin.campaigns.empty')}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('pages.admin.campaigns.requests.title')}</h2>
              <p className="text-xs text-slate-500">{t('pages.admin.campaigns.requests.subtitle')}</p>
            </div>
            <button
              type="button"
              onClick={() => refetchRequests()}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className={`material-icons text-[16px] ${requestsLoading ? 'animate-spin' : ''}`}>refresh</span>
              {requestsLoading ? t('pages.admin.campaigns.syncing') : t('pages.admin.campaigns.refresh')}
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-zinc-800">
            {requests.map((request) => (
              <div key={request.id} className="p-4 sm:p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                      {t(`pages.admin.campaigns.requestActions.${request.action}`)}
                    </span>
                    <span className="text-slate-400">{t('pages.admin.campaigns.requests.campaignLabel')}</span>
                    <span className="text-primary truncate max-w-[200px] sm:max-w-md">
                      {request.campaign?.title ?? t('pages.admin.campaigns.requests.campaignFallback')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{request.message}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="material-icons text-[14px]">person_outline</span>
                    <span>
                      {t('pages.admin.campaigns.requests.requestedBy', {
                        name: request.requestedBy?.name ?? t('pages.admin.campaigns.requests.userFallback'),
                        date: new Date(request.createdAt).toLocaleDateString()
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApproveRequest(request.id)}
                    className="flex-1 md:flex-none px-5 py-2 text-xs font-bold rounded-lg bg-primary text-white hover:opacity-90 transition-opacity shadow-sm shadow-primary/20"
                  >
                    {t('pages.admin.campaigns.actions.approve')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectRequest(request.id)}
                    className="flex-1 md:flex-none px-5 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {t('pages.admin.campaigns.actions.reject')}
                  </button>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="p-12 text-center text-sm text-slate-500 dark:text-zinc-500 italic">
                {t('pages.admin.campaigns.requests.empty')}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCampaignModeration;