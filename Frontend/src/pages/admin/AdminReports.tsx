import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/admin';
import { getApiData } from '../../store/apiHelpers';
import { useTranslation } from 'react-i18next';
import { RefreshCw, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

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

  const { data, refetch, isFetching } = useQuery({
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
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('pages.admin.reports.title')}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              {t('pages.admin.reports.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95 disabled:opacity-70"
          >
            <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="text-sm">{t('pages.admin.reports.refresh')}</span>
          </button>
        </header>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.userId}
              className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Information Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-primary/10 text-primary text-[10px] sm:text-xs uppercase font-extrabold px-2.5 py-1 rounded-md tracking-wider">
                      {t('pages.admin.reports.tag')}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 truncate max-w-full">
                      {report.email}
                    </span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">
                    {report.name}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-4">
                    {t('pages.admin.reports.submitted', {
                      date: report.submittedAt 
                        ? new Date(report.submittedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) 
                        : t('pages.admin.reports.recently')
                    })}
                  </p>

                  {/* Document Links */}
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {report.idFrontUrl && (
                      <a 
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/10" 
                        href={report.idFrontUrl} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <ExternalLink className="size-3" />
                        {t('pages.admin.reports.viewIdFront')}
                      </a>
                    )}
                    {report.idBackUrl && (
                      <a 
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/10" 
                        href={report.idBackUrl} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <ExternalLink className="size-3" />
                        {t('pages.admin.reports.viewIdBack')}
                      </a>
                    )}
                    {report.livePhotoUrl && (
                      <a 
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/10" 
                        href={report.livePhotoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <ExternalLink className="size-3" />
                        {t('pages.admin.reports.viewLivePhoto')}
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3 lg:border-l lg:pl-6 border-slate-100 dark:border-slate-800 pt-4 lg:pt-0 border-t lg:border-t-0 mt-2 lg:mt-0">
                  <button
                    type="button"
                    onClick={() => handleReject(report.userId)}
                    disabled={actionId === report.userId}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-600 hover:text-white transition-all rounded-xl disabled:opacity-50"
                  >
                    <XCircle className="size-4" />
                    {t('pages.admin.reports.reject')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(report.userId)}
                    disabled={actionId === report.userId}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all rounded-xl shadow-sm shadow-primary/20 disabled:opacity-50 active:scale-95"
                  >
                    <CheckCircle className="size-4" />
                    {t('pages.admin.reports.approve')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {reports.length === 0 && (
            <div className="bg-white dark:bg-slate-900 py-16 px-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <CheckCircle className="size-8" />
              </div>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1">{t('pages.admin.reports.emptyTitle', 'All Caught Up!') ?? 'All Caught Up!'}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                {t('pages.admin.reports.empty')}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;