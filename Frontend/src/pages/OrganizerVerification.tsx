import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const [documentType, setDocumentType] = useState<'national_id' | 'driver_license' | 'passport'>('national_id');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const requiresBack = documentType !== 'passport';

  useEffect(() => {
    if (!livePhoto) {
      setSelfiePreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(livePhoto);
    setSelfiePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [livePhoto]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera access is not supported on this device.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      setCameraError('Unable to access the camera. Please allow camera access and try again.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureSelfie = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setLivePhoto(file);
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!idFront || (requiresBack && !idBack) || !livePhoto) {
      setError(requiresBack
        ? 'Please upload your ID front, ID back, and a live photo.'
        : 'Please upload your passport and a live photo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('idFront', idFront);
      if (idBack) {
        formData.append('idBack', idBack);
      }
      formData.append('livePhoto', livePhoto);
      formData.append('documentType', documentType);

      await organizerService.verify(formData);
      setSuccess('Verification submitted. We will review your documents shortly.');
      navigate('/verPending', { replace: true });
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
          To protect donors and beneficiaries, we require a government-issued ID and a live selfie before you can launch campaigns.
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
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Document type</label>
          <select
            className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm"
            value={documentType}
            onChange={(event) => {
              const nextType = event.target.value as typeof documentType;
              setDocumentType(nextType);
              if (nextType === 'passport') {
                setIdBack(null);
              }
            }}
            disabled={!canSubmit || isSubmitting}
          >
            <option value="national_id">National ID</option>
            <option value="driver_license">Driver License</option>
            <option value="passport">Passport</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            {documentType === 'passport' ? 'Passport' : 'ID Front'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setIdFront(event.target.files?.[0] ?? null)}
            className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm"
            disabled={!canSubmit || isSubmitting}
          />
        </div>

        {requiresBack && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">ID Back</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setIdBack(event.target.files?.[0] ?? null)}
              className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm"
              disabled={!canSubmit || isSubmitting}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Live Photo</label>
          <div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <div className="relative w-full overflow-hidden rounded-lg bg-black">
              <video ref={videoRef} className={`w-full ${isCameraActive ? 'block' : 'hidden'}`} playsInline />
              {!isCameraActive && selfiePreview && (
                <img src={selfiePreview} alt="Selfie preview" className="w-full object-cover" />
              )}
              {!isCameraActive && !selfiePreview && (
                <div className="flex items-center justify-center py-12 text-sm text-gray-500">
                  Camera preview will appear here.
                </div>
              )}
            </div>
            {cameraError && (
              <p className="mt-2 text-sm text-red-600">{cameraError}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover"
                  disabled={!canSubmit || isSubmitting}
                >
                  {livePhoto ? 'Retake selfie' : 'Start camera'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={captureSelfie}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover"
                >
                  Capture selfie
                </button>
              )}
              {isCameraActive && (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
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
