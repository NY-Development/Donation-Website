import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import { useTranslation } from 'react-i18next';

type OrganizerVerification = {
  userId: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  idFrontUrl?: string | null;
  idBackUrl?: string | null;
  livePhotoUrl?: string | null;
};

const AdminReports: React.FC = () => {
  const { t } = useTranslation();
  const [actionId, setActionId] = useState<string | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ['admin', 'organizer-verifications'],
    queryFn: async () => {
      const response = await adminService.getOrganizerVerifications();
      return getApiData<OrganizerVerification[]>(response);
    }
  });

  const handleApprove = async (userId: string) => {
    setActionId(userId);
    try {
      await adminService.approveOrganizer(userId);
      await refetch();
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionId(userId);
    try {
      await adminService.rejectOrganizer(userId, { reason: t('pages.admin.reports.rejectReason') });
      await refetch();
    } finally {
      setActionId(null);
    }
  };

  const reports = data ?? [];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <main className="p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('pages.admin.reports.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t('pages.admin.reports.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {t('pages.admin.reports.refresh')}
            </button>
          </div>
        </header>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.userId}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider">
                      {t('pages.admin.reports.tag')}
                    </span>
                    <span className="text-xs text-slate-400">{report.email}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{report.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {t('pages.admin.reports.submitted', {
                      date: report.submittedAt ? new Date(report.submittedAt).toLocaleString() : t('pages.admin.reports.recently')
                    })}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 items-center">
                    {report.idFrontUrl && (
                      <a className="text-xs text-primary hover:underline" href={report.idFrontUrl} target="_blank" rel="noreferrer">
                        {t('pages.admin.reports.viewIdFront')}
                      </a>
                    )}
                    {report.idBackUrl && (
                      <a className="text-xs text-primary hover:underline" href={report.idBackUrl} target="_blank" rel="noreferrer">
                        {t('pages.admin.reports.viewIdBack')}
                      </a>
                    )}
                    {report.livePhotoUrl && (
                      <a className="text-xs text-primary hover:underline" href={report.livePhotoUrl} target="_blank" rel="noreferrer">
                        {t('pages.admin.reports.viewLivePhoto')}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 lg:border-l lg:pl-6 border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleReject(report.userId)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    disabled={actionId === report.userId}
                  >
                    {t('pages.admin.reports.reject')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(report.userId)}
                    className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                    disabled={actionId === report.userId}
                  >
                    {t('pages.admin.reports.approve')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
              {t('pages.admin.reports.empty')}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
