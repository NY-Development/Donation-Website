import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import organizerService from '../Services/organizer';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VerificationPending: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    let isActive = true;

    const loadStatus = async () => {
      try {
        const response = await organizerService.status();
        const data = response.data?.data as {
          isOrganizerVerified?: boolean;
          submittedAt?: string;
          status?: string;
        } | undefined;
        if (!isActive) return;
        if (data?.isOrganizerVerified) {
          setIsVerified(true);
          return;
        }
        if (!data?.submittedAt) {
          navigate('/verIntro', { replace: true });
        }
      } catch {
        if (isActive) {
          setError(t('pages.verificationPending.error'));
        }
      }
    };

    loadStatus();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (isVerified) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerified, navigate]);

  return (
    <div className="min-h-[70vh] bg-linear-to-br from-gray-50 via-white to-primary/5 dark:from-surface-dark dark:via-slate-950 dark:to-primary/10 flex items-center justify-center">
      <div className="max-w-3xl w-full px-6 py-12">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-10 text-center">
          <div className="mx-auto mb-8 size-20 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="size-10 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-black">
            {isVerified ? t('pages.verificationPending.approvedTitle') : t('pages.verificationPending.pendingTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-lg mx-auto">
            {isVerified
              ? t('pages.verificationPending.approvedBody')
              : t('pages.verificationPending.pendingBody')}
          </p>
          {!isVerified && (
            <p className="mt-4 text-sm text-gray-500">
              {t('pages.verificationPending.returning', { seconds: secondsLeft })}
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate(isVerified ? '/create' : '/dashboard')}
              className="px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20"
            >
              {isVerified ? t('pages.verificationPending.launch') : t('pages.verificationPending.back')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/uploadID')}
              className="px-8 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {t('pages.verificationPending.viewSubmission')}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500">
            {t('pages.verificationPending.needHelp')}{' '}
            <button
              type="button"
              onClick={() => navigate('/help-center')}
              className="text-primary font-semibold hover:underline"
            >
              {t('pages.verificationPending.contact')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
