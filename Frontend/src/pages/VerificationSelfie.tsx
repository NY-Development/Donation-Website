import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import organizerService from '../Services/organizer';
import { useVerificationStore } from '../store/verificationStore';
import { Camera, CircleDashed, ShieldCheck } from 'lucide-react';

const VerificationSelfie: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { idFront, idBack, livePhoto, setLivePhoto, reset } = useVerificationStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReady = useMemo(() => Boolean(idFront && idBack && livePhoto), [idFront, idBack, livePhoto]);

  const handleSubmit = async () => {
    if (!idFront || !idBack || !livePhoto) {
      setError('Please upload your ID front, ID back, and a live selfie.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('idFront', idFront);
      formData.append('idBack', idBack);
      formData.append('livePhoto', livePhoto);

      await organizerService.verify(formData);
      reset();
      navigate('/verPending');
    } catch {
      setError('Unable to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-gray-50 via-white to-primary/5 dark:from-surface-dark dark:via-slate-950 dark:to-primary/10">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Identity verification</p>
              <h1 className="text-2xl font-black mt-2">Live Selfie Check</h1>
            </div>
            <span className="text-sm font-semibold text-gray-500">Step 3 of 3</span>
          </div>
          <div className="mt-4 h-2 bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-10">
          <div className="flex flex-col items-center">
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
              Position your face within the frame and look directly at the camera to complete your profile.
            </p>

            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-blue-400 rounded-full blur opacity-20" />
              <div className="relative w-64 h-64 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <CircleDashed className="size-32 text-primary/40" aria-hidden="true" />
                {livePhoto && (
                  <img
                    src={URL.createObjectURL(livePhoto)}
                    alt="Selfie preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[90%] h-[90%] border-2 border-dashed border-primary/40 rounded-full" />
                </div>
                <span className="absolute bottom-6 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Ready to Scan
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center w-full gap-4">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setLivePhoto(event.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full md:w-64 bg-primary hover:bg-primary-hover text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
              >
                <Camera className="size-5" aria-hidden="true" />
                {livePhoto ? 'Replace Selfie' : 'Start Camera'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/uploadID')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium transition-colors"
              >
                Use another method
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-800 pt-8 w-full text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-2 text-primary">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wide">Good Lighting</h4>
                <p className="text-[11px] text-gray-500">Ensure your face is visible without shadows.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-2 text-primary">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wide">Natural Look</h4>
                <p className="text-[11px] text-gray-500">Remove glasses or hats for better accuracy.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-2 text-primary">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wide">Stay Centered</h4>
                <p className="text-[11px] text-gray-500">Keep your head inside the dashed circle.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isReady || isSubmitting}
            className={`px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition ${
              isReady ? 'bg-primary hover:bg-primary-hover' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit verification'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/uploadID')}
            className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationSelfie;
