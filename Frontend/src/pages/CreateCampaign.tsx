import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { gsap } from 'gsap';
import {
  addHoverScale,
  animatePageIn,
  animateSectionsOnScroll,
  animateStagger,
  ensureGsap,
  prefersReducedMotion
} from '../utils/gsapAnimations';
import { useAuthStore, useCampaignStore } from '../store';
import campaignService from '../Services/campaigns';
import organizerService from '../Services/organizer';
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  CheckCircle,
  Flag,
  Image,
  Italic,
  Lightbulb,
  Link as LinkIcon,
  Wallet
} from 'lucide-react';

const draftSchema = z.object({
  title: z.string().min(3, 'Campaign title is required.'),
  category: z.string().min(2, 'Select a campaign category.'),
  story: z.string().min(10, 'Tell a more detailed story.'),
  goalAmount: z.number().positive('Goal amount must be greater than 0.'),
  cbeAccountNumber: z.string().min(6, 'Account number must be at least 6 characters.').optional(),
  fundingStyle: z.enum(['keep', 'all_or_nothing']),
  urgent: z.boolean().optional(),
  deadline: z.string().optional()
});

const CreateCampaign: React.FC = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [story, setStory] = useState('');
  const [goalAmount, setGoalAmount] = useState('10000');
  const [cbeAccountNumber, setCbeAccountNumber] = useState('');
  const [deadline, setDeadline] = useState('');
  const [fundingStyle, setFundingStyle] = useState<'keep' | 'all_or_nothing'>('keep');
  const [urgent, setUrgent] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<Record<string, unknown> | null>(null);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [draftInitialized, setDraftInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const createCampaign = useCampaignStore((state) => state.createCampaign);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const draftKey = useMemo(() => `campaignDraft:${user?._id ?? 'guest'}`, [user?._id]);
  const mediaPreview = useMemo(
    () =>
      mediaFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file)
      })),
    [mediaFiles]
  );

  const nextStep = () => {
    if (step === 1 && (!title.trim() || !category)) {
      setFormError('Please enter a title and select a category to continue.');
      return;
    }
    if (step === 2 && story.trim().length < 10) {
      setFormError('Please provide a longer story before continuing.');
      return;
    }
    if (step === 3) {
      const parsedGoal = Number(goalAmount.replace(/,/g, ''));
      if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
        setFormError('Please enter a valid fundraising goal.');
        return;
      }
    }

    setFormError(null);
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const saveDraft = () => {
    const payload = {
      step,
      title,
      category,
      story,
      goalAmount,
      cbeAccountNumber,
      deadline,
      fundingStyle,
      urgent
    };
    localStorage.setItem(draftKey, JSON.stringify(payload));
  };

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
  };

  const restoreDraft = (payload: Record<string, unknown>) => {
    setTitle(String(payload.title ?? ''));
    setCategory(String(payload.category ?? ''));
    setStory(String(payload.story ?? ''));
    setGoalAmount(String(payload.goalAmount ?? '10000'));
    setCbeAccountNumber(String(payload.cbeAccountNumber ?? ''));
    setDeadline(String(payload.deadline ?? ''));
    setFundingStyle((payload.fundingStyle as 'keep' | 'all_or_nothing') ?? 'keep');
    setUrgent(Boolean(payload.urgent));
    const savedStep = Number(payload.step ?? 1);
    if (Number.isFinite(savedStep) && savedStep >= 1 && savedStep <= 4) {
      setStep(savedStep);
    }
  };

  const handleDraftRestore = () => {
    if (pendingDraft) {
      restoreDraft(pendingDraft);
    }
    setPendingDraft(null);
    setShowDraftPrompt(false);
    setDraftInitialized(true);
  };

  const handleDraftDiscard = () => {
    clearDraft();
    setPendingDraft(null);
    setShowDraftPrompt(false);
    setDraftInitialized(true);
  };

  const handleExitSave = () => {
    saveDraft();
    setShowExitPrompt(false);
    navigate('/dashboard');
  };

  const handleExitDiscard = () => {
    clearDraft();
    setShowExitPrompt(false);
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    const parsedGoal = Number(goalAmount.replace(/,/g, ''));
    const trimmedAccount = cbeAccountNumber.trim();
    const parsed = draftSchema.safeParse({
      title: title.trim(),
      category,
      story: story.trim(),
      goalAmount: parsedGoal,
      cbeAccountNumber: trimmedAccount ? trimmedAccount : undefined,
      fundingStyle,
      urgent,
      deadline: deadline || undefined
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please complete all required fields before submitting.');
      return;
    }

    if (!mediaFiles.length) {
      setFormError('Please upload at least one campaign image.');
      return;
    }

    try {
      const campaign = await createCampaign({
        title: parsed.data.title,
        category: parsed.data.category,
        story: parsed.data.story,
        goalAmount: parsed.data.goalAmount,
        cbeAccountNumber: parsed.data.cbeAccountNumber,
        fundingStyle: parsed.data.fundingStyle,
        urgent: parsed.data.urgent,
        deadline: parsed.data.deadline
      });

      if (!campaign?._id) {
        setFormError('Unable to create campaign. Please try again.');
        return;
      }

      const media = await Promise.all(
        mediaFiles.map((file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error('Failed to read image.'));
            reader.readAsDataURL(file);
          })
        )
      );
      await campaignService.uploadMedia(campaign._id, { media });
      await campaignService.submit(campaign._id);
      clearDraft();
      navigate('/dashboard');
    } catch (error) {
      setFormError('Unable to submit your campaign. Please try again.');
    }
  };

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!hasAnimatedRef.current) {
        animatePageIn(containerRef.current as HTMLDivElement);
        const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
        animateSectionsOnScroll(sections);
        hasAnimatedRef.current = true;
      }

      const forms = gsap.utils.toArray<HTMLElement>('[data-animate="form"]', containerRef.current);
      forms.forEach((form) => {
        const inputs = gsap.utils.toArray<HTMLElement>('[data-animate="input"]', form);
        animateStagger(inputs, {
          y: 12,
          duration: 0.5,
          stagger: 0.06,
          scrollTrigger: {
            trigger: form,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      });
    }, containerRef);

    const cleanupHover = addHoverScale(
      gsap.utils.toArray('[data-animate="button"]', containerRef.current),
      1.02
    );

    return () => {
      cleanupHover();
      ctx.revert();
    };
  }, [step]);

  useEffect(() => {
    let isActive = true;

    const checkVerification = async () => {
      try {
        const response = await organizerService.status();
        const data = response.data?.data as { isOrganizerVerified?: boolean } | undefined;

        if (!data?.isOrganizerVerified) {
          navigate('/organizer/verify', { replace: true, state: { from: '/create' } });
          return;
        }
      } catch {
        if (isActive) {
          setFormError('Unable to verify organizer status. Please try again.');
        }
      } finally {
        if (isActive) setIsCheckingVerification(false);
      }
    };

    checkVerification();
    return () => {
      isActive = false;
    };
  }, [navigate, user]);

  useEffect(() => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) {
      setDraftInitialized(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      setPendingDraft(parsed);
      setShowDraftPrompt(true);
    } catch {
      localStorage.removeItem(draftKey);
      setDraftInitialized(true);
    }
  }, [draftKey]);

  useEffect(() => {
    if (!draftInitialized) {
      return;
    }
    saveDraft();
  }, [step, title, category, story, goalAmount, cbeAccountNumber, deadline, fundingStyle, urgent, draftKey, draftInitialized]);

  useEffect(() => {
    return () => {
      mediaPreview.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [mediaPreview]);

  if (isCheckingVerification) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Checking verification...</p>
          <p className="text-sm text-gray-500">Preparing your campaign workspace.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-[1120px] mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      {showDraftPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resume your draft?</h2>
            <p className="mt-2 text-sm text-gray-500">
              We found a saved draft for this campaign. You can restore it or start fresh.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleDraftRestore}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover"
              >
                Restore draft
              </button>
              <button
                type="button"
                onClick={handleDraftDiscard}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
              >
                Start fresh
              </button>
            </div>
          </div>
                  <p className="text-xs text-gray-500 mt-2">Optional: add a payout account number if needed.</p>
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2">Campaign Deadline (optional)</label>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    type="date"
                    value={deadline}
                    onChange={(event) => {
                      setDeadline(event.target.value);
                      if (formError) setFormError(null);
                    }}
                    data-animate="input"
                  />
                  <p className="text-xs text-gray-500 mt-2">If set, the campaign closes automatically on this date.</p>
      )}

      {showExitPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Leave campaign setup?</h2>
            <p className="mt-2 text-sm text-gray-500">Save your progress as a draft or discard it.</p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleExitSave}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover"
              >
                Save draft and exit
              </button>
              <button
                type="button"
                onClick={handleExitDiscard}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
              >
                Discard draft
              </button>
              <button
                type="button"
                onClick={() => setShowExitPrompt(false)}
                className="w-full px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700"
              >
                Keep editing
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-10" data-animate="section">
        <nav className="inline-flex flex-wrap gap-2 md:gap-4 items-center bg-white dark:bg-surface-dark px-6 py-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-2 ${
                  step === s ? 'text-primary font-bold' : step > s ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step > s ? (
                  <CheckCircle className="size-5" aria-hidden="true" />
                ) : (
                  <span
                    className={`flex items-center justify-center size-5 rounded-full ${
                      step === s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    } text-xs`}
                  >
                    {s}
                  </span>
                )}
                <span>{s === 1 ? 'Title' : s === 2 ? 'Story' : s === 3 ? 'Goal' : 'Media'}</span>
              </div>
              {s < 4 && <span className="text-gray-300 dark:text-gray-700">/</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="mb-8 text-center md:text-left" data-animate="section">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Step {step} of 4</p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
          {step === 1 && "Let's start with the basics"}
          {step === 2 && 'Tell your story'}
          {step === 3 && 'Set your fundraising goal'}
          {step === 4 && 'Media & Cover Photo'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6" data-animate="section">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-8" data-animate="form">
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <label className="block text-xl font-bold mb-2">Give your campaign a title</label>
                  <p className="text-gray-500 text-sm mb-4">This is the first thing people will see. Make it clear and brief.</p>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-lg outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Help the Smith Family Rebuild"
                    data-animate="input"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      if (formError) setFormError(null);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-2">Select a category</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    data-animate="input"
                    value={category}
                    onChange={(event) => {
                      setCategory(event.target.value);
                      if (formError) setFormError(null);
                    }}
                  >
                    <option value="">Choose a category...</option>
                    <option>Education</option>
                    <option>Medical</option>
                    <option>Environment</option>
                    <option>Emergency</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xl font-bold mb-2">Why are you raising money?</label>
                  <p className="text-gray-500 text-base mb-4">Connect with your audience by sharing details about the cause.</p>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2 flex gap-1">
                      <Bold className="size-4 p-1 rounded hover:bg-gray-200 cursor-pointer" aria-hidden="true" />
                      <Italic className="size-4 p-1 rounded hover:bg-gray-200 cursor-pointer" aria-hidden="true" />
                      <LinkIcon className="size-4 p-1 rounded hover:bg-gray-200 cursor-pointer" aria-hidden="true" />
                    </div>
                    <textarea
                      className="w-full min-h-[300px] p-4 bg-white dark:bg-gray-800 border-none outline-none focus:ring-0 resize-none"
                      placeholder="Hi, my name is [Name] and I am raising funds for..."
                      data-animate="input"
                      value={story}
                      onChange={(event) => {
                        setStory(event.target.value);
                        if (formError) setFormError(null);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                <div>
                  <label className="block text-xl font-bold mb-4">How much would you like to raise?</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-300">ETB</span>
                    <input
                      className="w-full pl-20 pr-20 py-8 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl text-5xl font-black focus:ring-2 focus:ring-primary"
                      value={goalAmount}
                      onChange={(event) => {
                        setGoalAmount(event.target.value);
                        if (formError) setFormError(null);
                      }}
                      data-animate="input"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">ETB</span>
                  </div>
                  <div className="mt-6">
                    <label className="block text-lg font-bold mb-2">Payout Account Number (optional)</label>
                    <input
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="1000xxxxxxxxx"
                      value={cbeAccountNumber}
                      onChange={(event) => {
                        setCbeAccountNumber(event.target.value);
                        if (formError) setFormError(null);
                      }}
                      data-animate="input"
                    />
                    <p className="text-xs text-gray-500 mt-2">Optional: add a payout account number if you need one.</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Funding Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      className={`p-5 rounded-xl flex flex-col gap-2 cursor-pointer border-2 transition ${
                        fundingStyle === 'keep'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fundingStyle"
                        value="keep"
                        checked={fundingStyle === 'keep'}
                        onChange={() => setFundingStyle('keep')}
                        className="hidden"
                      />
                      <Wallet
                        className={`size-4 ${fundingStyle === 'keep' ? 'text-primary' : 'text-gray-400'}`}
                        aria-hidden="true"
                      />
                      <p className="font-bold">Keep what you raise</p>
                      <p className="text-sm text-gray-500">Keep all donations even if you don't reach the goal.</p>
                    </label>
                    <label
                      className={`p-5 rounded-xl flex flex-col gap-2 cursor-pointer border-2 transition ${
                        fundingStyle === 'all_or_nothing'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fundingStyle"
                        value="all_or_nothing"
                        checked={fundingStyle === 'all_or_nothing'}
                        onChange={() => setFundingStyle('all_or_nothing')}
                        className="hidden"
                      />
                      <Flag
                        className={`size-4 ${fundingStyle === 'all_or_nothing' ? 'text-primary' : 'text-gray-400'}`}
                        aria-hidden="true"
                      />
                      <p className="font-bold">All or nothing</p>
                      <p className="text-sm text-gray-500">Only receive funds if you reach the target.</p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <label className="block text-xl font-bold mb-2">Campaign Cover Photo</label>
                  <div className="mt-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center gap-4 text-center">
                    <Image className="size-12 text-gray-300" aria-hidden="true" />
                    <div>
                      <p className="font-bold">Upload a cover image</p>
                      <p className="text-xs text-gray-500 mt-1">Recommended: 1200 x 675px - JPG, PNG, GIF</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? []);
                        setMediaFiles(files);
                        if (formError) setFormError(null);
                      }}
                      className="w-full max-w-xs text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-hover"
                      data-animate="input"
                    />
                  </div>
                  {mediaPreview.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {mediaPreview.map((item) => (
                        <div key={item.url} className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                          <img src={item.url} alt={item.name} className="h-32 w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="urgent"
                    type="checkbox"
                    checked={urgent}
                    onChange={(event) => setUrgent(event.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="urgent" className="text-sm text-gray-700 dark:text-gray-300">
                    Mark this campaign as urgent
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <div className="flex w-full sm:w-auto items-center gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                  data-animate="button"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" /> Back
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowExitPrompt(true)}
                className="px-6 py-3 font-bold text-gray-400 hover:text-gray-600"
                data-animate="button"
              >
                Cancel
              </button>
            </div>
            <button
              type="button"
              onClick={step < 4 ? nextStep : handleSubmit}
              className="w-full sm:w-auto px-10 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"
              data-animate="button"
            >
              {step === 4 ? 'Launch Campaign' : 'Continue'}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          {formError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 w-full" data-animate="section">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="size-4 text-primary" aria-hidden="true" />
              <h3 className="font-bold text-lg">Tips for success</h3>
            </div>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-2">
                <CheckCircle className="size-4 text-green-500" aria-hidden="true" />
                <span><strong>Be descriptive.</strong> Specific titles build more trust.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="size-4 text-green-500" aria-hidden="true" />
                <span><strong>Share your story.</strong> People donate to people, not just causes.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateCampaign;
