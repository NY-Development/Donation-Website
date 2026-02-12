import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import organizerService from '../Services/organizer';
import type { OrganizerVerificationStatus } from '../../types';
import { useAuthStore } from '../store';

const OrganizerVerification: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState<OrganizerVerificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [livePhoto, setLivePhoto] = useState<File | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadStatus = async () => {
      if (!user || user.role !== 'organizer') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await organizerService.status();
        const data = response.data?.data as OrganizerVerificationStatus | undefined;
        if (isActive) {
          setStatus(data ?? null);
        }
      } catch (err) {
        if (isActive) {
          setError('Unable to fetch verification status. Please try again.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadStatus();
    return () => {
      isActive = false;
    };
  }, [user]);

  const canSubmit = useMemo(() => {
    if (!status) return true;
    if (status.isOrganizerVerified) return false;
    if (status.status === 'pending' && status.submittedAt) return false;
    return true;
  }, [status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!idFront || !idBack || !livePhoto) {
      setError('Please upload your ID front, ID back, and a live photo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('idFront', idFront);
      formData.append('idBack', idBack);
      formData.append('livePhoto', livePhoto);

      await organizerService.verify(formData);
      setSuccess('Verification submitted. We will review your documents shortly.');

      const refreshed = await organizerService.status();
      setStatus(refreshed.data?.data ?? null);
    } catch (err) {
      setError('Unable to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Checking verification status...</p>
          <p className="text-sm text-gray-500">Hang tight while we load your details.</p>
        </div>
      </div>
    );
  }

  if (status?.isOrganizerVerified) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">You are verified</h1>
          <p className="text-gray-500 mt-3">Your organizer account is verified. You can start a campaign right away.</p>
          <Link
            to="/create"
            className="inline-flex items-center justify-center mt-6 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition"
          >
            Start a campaign
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-primary font-semibold">Organizer verification</p>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-2">Verify your identity</h1>
        <p className="text-gray-500 mt-3 max-w-2xl">
          To protect donors and beneficiaries, we require a national ID and a live photo before you can launch campaigns.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          For the live photo, please use a mobile device with a front camera.
        </p>
      </div>

      {status?.status === 'pending' && status.submittedAt && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
          <p className="font-semibold">Verification under review</p>
          <p className="text-sm mt-1">We received your documents and are reviewing them now.</p>
        </div>
      )}

      {status?.status === 'rejected' && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <p className="font-semibold">Verification rejected</p>
          <p className="text-sm mt-1">{status.rejectionReason ?? 'Please resubmit clearer images to continue.'}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">National ID - Front</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setIdFront(event.target.files?.[0] ?? null)}
            className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm"
            disabled={!canSubmit || isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">National ID - Back</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setIdBack(event.target.files?.[0] ?? null)}
            className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm"
            disabled={!canSubmit || isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Live Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setLivePhoto(event.target.files?.[0] ?? null)}
            className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm"
            disabled={!canSubmit || isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-2">Use a well-lit selfie that clearly shows your face.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition disabled:opacity-60"
            disabled={!canSubmit || isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit verification'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Back to dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizerVerification;
