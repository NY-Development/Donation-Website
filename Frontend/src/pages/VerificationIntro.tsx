import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import organizerService from '../Services/organizer';
import { Check, Fingerprint, ShieldCheck } from 'lucide-react';

const VerificationIntro: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setError('Unable to load verification status. Please try again.');
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

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Preparing verification...</p>
          <p className="text-sm text-gray-500">Hang tight while we load your details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-linear-to-br from-gray-50 via-white to-primary/5 dark:from-surface-dark dark:via-slate-950 dark:to-primary/10">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Identity verification</p>
              <h1 className="text-4xl font-black leading-tight text-gray-900 dark:text-white mt-3">
                Keep your campaigns safe and transparent.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
                To ensure a secure environment for all creators and prevent fraud, we require a quick identity check
                before you can launch your first campaign.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">ID Scan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Upload a photo of your government-issued ID (Passport, DL, or ID card).
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Fingerprint className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Selfie Check</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    A quick face scan to confirm it is really you. No recording stored.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Check className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Instant Results</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Verification usually takes less than 24 hours via our automated system.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="uppercase tracking-[0.2em] font-semibold">Encrypted and secure</span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                GDPR compliant
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
            <div className="relative w-56 h-56 mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary/10" />
              <div className="absolute inset-4 rounded-full bg-primary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="size-20 text-primary" aria-hidden="true" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mt-6">Ready to start?</h2>
            <p className="text-sm text-gray-500 mt-3">
              Please have your valid government ID ready and ensure you are in a well-lit area.
            </p>
            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => navigate('/uploadID')}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition"
              >
                Start Verification
              </button>
              <button
                type="button"
                onClick={() => navigate('/help-center')}
                className="w-full py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Learn more about our process
              </button>
            </div>
            <p className="mt-6 text-xs text-gray-400">
              Your data is end-to-end encrypted. We never share your documents with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationIntro;
