import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import organizerService from '../Services/organizer';
import { useVerificationStore } from '../store/verificationStore';
import { CheckCircle, FileText, IdCard, Lightbulb } from 'lucide-react';
import { VerificationSteps } from '../components/VerificationSteps';
import { useTranslation } from 'react-i18next';

const VerificationUpload: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { documentType, idFront, idBack, setDocumentType, setIdFront, setIdBack } = useVerificationStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const canContinue = useMemo(() => Boolean(idFront && idBack), [idFront, idBack]);

  useEffect(() => {
    let isActive = true;

    const loadStatus = async () => {
      try {
        const response = await organizerService.status();
        const data = response.data?.data as {
          isOrganizerVerified?: boolean;
          status?: string;
          submittedAt?: string;
        } | undefined;
        if (!isActive) return;
        if (data?.isOrganizerVerified) {
          navigate('/create', { replace: true });
          return;
        }
        if (data?.status === 'pending' && data.submittedAt) {
          navigate('/verPending', { replace: true });
          return;
        }
      } catch {
        if (isActive) {
          setError(t('pages.verificationUpload.error'));
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadStatus();
    return () => {
      isActive = false;
    };
  }, [navigate]);

  const handleContinue = () => {
    if (!idFront || !idBack) {
      setError(t('pages.verificationUpload.bothRequired'));
      return;
    }
    navigate('/liveSelfie');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{t('pages.verificationUpload.loadingTitle')}</p>
          <p className="text-sm text-gray-500">{t('pages.verificationUpload.loadingSubtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-linear-to-br from-gray-50 via-white to-primary/5 dark:from-surface-dark dark:via-slate-950 dark:to-primary/10">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center gap-4 mb-10 text-sm mt-15">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">1</span>
            <span className="text-gray-500">{t('pages.verificationUpload.step1')}</span>
          </div>
          <div className="h-px w-16 bg-primary/40" />
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">2</span>
            <span className="font-semibold text-gray-900 dark:text-white">{t('pages.verificationUpload.step2')}</span>
          </div>
          <div className="h-px w-16 bg-gray-200 dark:bg-gray-800" />
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 flex items-center justify-center font-semibold">3</span>
            <span className="text-gray-500">{t('pages.verificationUpload.step3')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <header className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t('pages.verificationUpload.kicker')}</p>
              <h1 className="text-3xl font-black mt-3">{t('pages.verificationUpload.title')}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('pages.verificationUpload.subtitle')}
              </p>
            </header>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                {error}
              </div>
            )}

            <div className="mb-10">
              <label className="block text-sm font-semibold mb-4">{t('pages.verificationUpload.docType')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDocumentType('national')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                    documentType === 'national'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary/50'
                  }`}
                >
                  <IdCard className="mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium">{t('pages.verificationUpload.nationalId')}</span>
                </button>
                {/* <button
                  type="button"
                  onClick={() => setDocumentType('passport')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                    documentType === 'passport'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary/50 text-gray-500'
                  }`}
                >
                  <FileText className="mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium">{t('pages.verificationUpload.passport')}</span>
                </button> */}
                <button
                  type="button"
                  onClick={() => setDocumentType('driver')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                    documentType === 'driver'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary/50 text-gray-500'
                  }`}
                >
                  <IdCard className="mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium">{t('pages.verificationUpload.driver')}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="space-y-3">
                <label className="text-sm font-semibold">{t('pages.verificationUpload.frontLabel')}</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center text-center transition-all hover:border-primary hover:bg-primary/5">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-primary">
                    <IdCard aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium mb-1">{t('pages.verificationUpload.uploadTitle')}</p>
                  <p className="text-xs text-gray-500">{t('pages.verificationUpload.uploadHint')}</p>
                  {idFront && <p className="mt-2 text-xs text-primary">{idFront.name}</p>}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(event) => setIdFront(event.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold">{t('pages.verificationUpload.backLabel')}</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center text-center transition-all hover:border-primary hover:bg-primary/5">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-primary">
                    <IdCard aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium mb-1">{t('pages.verificationUpload.uploadTitle')}</p>
                  <p className="text-xs text-gray-500">{t('pages.verificationUpload.uploadHint')}</p>
                  {idBack && <p className="mt-2 text-xs text-primary">{idBack.name}</p>}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(event) => setIdBack(event.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => navigate('/verIntro')}
                className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {t('pages.verificationUpload.back')}
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className={`px-8 py-2.5 rounded-lg text-white font-semibold shadow-lg transition-all ${
                  canContinue ? 'bg-primary hover:bg-primary-hover' : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!canContinue}
              >
                {t('pages.verificationUpload.continue')}
              </button>
            </div>
            {/* Steps below buttons on mobile */}
            <div className="block lg:hidden mt-8">
              <VerificationSteps />
            </div>
          </div>

          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24 flex flex-col gap-8">
              {/* Steps sidebar on large screens */}
              <div className="hidden lg:block mb-6">
                <VerificationSteps />
              </div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Lightbulb className="text-primary mr-2" aria-hidden="true" />
                {t('pages.verificationUpload.tipsTitle')}
              </h3>
              <div className="space-y-5 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 size-4 mt-1" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('pages.verificationUpload.tip1Title')}</h4>
                    <p className="text-xs">{t('pages.verificationUpload.tip1Body')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 size-4 mt-1" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('pages.verificationUpload.tip2Title')}</h4>
                    <p className="text-xs">{t('pages.verificationUpload.tip2Body')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 size-4 mt-1" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('pages.verificationUpload.tip3Title')}</h4>
                    <p className="text-xs">{t('pages.verificationUpload.tip3Body')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500">{t('pages.verificationUpload.dataNote')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationUpload;
