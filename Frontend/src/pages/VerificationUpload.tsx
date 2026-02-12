import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import organizerService from '../Services/organizer';
import { useVerificationStore } from '../store/verificationStore';
import { CheckCircle, FileText, IdCard, Lightbulb } from 'lucide-react';

const VerificationUpload: React.FC = () => {
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
        const data = response.data?.data as { isOrganizerVerified?: boolean; status?: string } | undefined;
        if (!isActive) return;
        if (data?.isOrganizerVerified) {
          navigate('/create', { replace: true });
          return;
        }
        if (data?.status === 'pending') {
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

  const handleContinue = () => {
    if (!idFront || !idBack) {
      setError('Please upload both the front and back of your ID.');
      return;
    }
    navigate('/liveSelfie');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Loading verification...</p>
          <p className="text-sm text-gray-500">One moment while we prepare your form.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-gray-50 via-white to-primary/5 dark:from-surface-dark dark:via-slate-950 dark:to-primary/10">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center gap-4 mb-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">1</span>
            <span className="text-gray-500">Campaign Details</span>
          </div>
          <div className="h-px w-16 bg-primary/40" />
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">2</span>
            <span className="font-semibold text-gray-900 dark:text-white">Identity Verification</span>
          </div>
          <div className="h-px w-16 bg-gray-200 dark:bg-gray-800" />
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 flex items-center justify-center font-semibold">3</span>
            <span className="text-gray-500">Launch Campaign</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <header className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Identity verification</p>
              <h1 className="text-3xl font-black mt-3">Verify your identity</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Upload a clear photo of your government-issued ID to proceed. This helps us ensure the security of our
                community.
              </p>
            </header>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                {error}
              </div>
            )}

            <div className="mb-10">
              <label className="block text-sm font-semibold mb-4">Select Document Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <span className="text-sm font-medium">National ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDocumentType('passport')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                    documentType === 'passport'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary/50 text-gray-500'
                  }`}
                >
                  <FileText className="mb-2" aria-hidden="true" />
                  <span className="text-sm font-medium">Passport</span>
                </button>
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
                  <span className="text-sm font-medium">Driver's License</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="space-y-3">
                <label className="text-sm font-semibold">Front of ID Card</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center text-center transition-all hover:border-primary hover:bg-primary/5">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-primary">
                    <IdCard aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, or PDF up to 10MB</p>
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
                <label className="text-sm font-semibold">Back of ID Card</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center text-center transition-all hover:border-primary hover:bg-primary/5">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-primary">
                    <IdCard aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, or PDF up to 10MB</p>
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
                Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className={`px-8 py-2.5 rounded-lg text-white font-semibold shadow-lg transition-all ${
                  canContinue ? 'bg-primary hover:bg-primary-hover' : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!canContinue}
              >
                Continue
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Lightbulb className="text-primary mr-2" aria-hidden="true" />
                Submission Tips
              </h3>
              <div className="space-y-5 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 size-4 mt-1" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Good Lighting</h4>
                    <p className="text-xs">Ensure the document is well-lit without reflections or glare.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 size-4 mt-1" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Visible Corners</h4>
                    <p className="text-xs">All four corners of the document must be visible within the frame.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 size-4 mt-1" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sharp and Clear</h4>
                    <p className="text-xs">Information must be legible. Avoid shaky or blurry captures.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500">Your data is encrypted and used only for verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationUpload;
