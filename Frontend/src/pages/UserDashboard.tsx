
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { Activity, Award, BarChart3, CheckCircle, Heart, Megaphone, RefreshCw, Repeat, Sparkles, Star, Target, Wallet } from 'lucide-react';
import { useCampaignStore, useDonationStore, useAuthStore } from '../store';
import userService from '../Services/users';
import organizerService from '../Services/organizer';
import campaignService from '../Services/campaigns';
import { getApiData, getErrorMessage } from '../store/apiHelpers';
import type { DonationTrendPoint, OrganizerPendingDonations } from '../../types';
import { useTranslation } from 'react-i18next';

const UserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const totalDonated = useDonationStore((state) => state.totalDonated);
  const campaignsSupported = useDonationStore((state) => state.campaignsSupported);
  const timeline = useDonationStore((state) => state.timeline);
  const fetchDashboard = useDonationStore((state) => state.fetchDashboard);
  const campaigns = useCampaignStore((state) => state.campaigns);
  const fetchCampaigns = useCampaignStore((state) => state.fetchAll);
  const campaignLoading = useCampaignStore((state) => state.isLoading);
  const campaignError = useCampaignStore((state) => state.error);
  const [trends, setTrends] = useState<DonationTrendPoint[]>([]);
  const [pendingDonations, setPendingDonations] = useState<OrganizerPendingDonations | null>(null);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [organizerStatus, setOrganizerStatus] = useState<{
    status?: 'pending' | 'approved' | 'rejected';
    submittedAt?: string;
    reviewedAt?: string;
    rejectionReason?: string;
  } | null>(null);
  const [requestModal, setRequestModal] = useState<{ id: string; title: string; action: 'pause' | 'delete' } | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);

      const cards = gsap.utils.toArray<HTMLElement>('[data-animate="card"]', containerRef.current);
      animateStagger(cards, {
        y: 16,
        duration: 0.6,
        stagger: 0.08,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    fetchDashboard({ limit: 10 }, true);
  }, [fetchDashboard, navigate, user]);

  useEffect(() => {
    let isActive = true;

    const loadTrends = async () => {
      try {
        const response = await userService.getTrends({ days: 7 });
        const data = getApiData<DonationTrendPoint[]>(response) ?? [];
        if (isActive) {
          setTrends(data);
        }
      } catch {
        if (isActive) {
          setTrends([]);
        }
      }
    };

    loadTrends();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchCampaigns({ limit: 50, status: 'all', sort: 'desc' }, true);
  }, [fetchCampaigns, user]);

  useEffect(() => {
    if (!user || user.role !== 'organizer') {
      setPendingDonations(null);
      return;
    }

    let isActive = true;

    const loadPending = async () => {
      setPendingLoading(true);
      setPendingError(null);
      try {
        const response = await userService.getPendingDonations({ limit: 10 });
        const data = getApiData<OrganizerPendingDonations>(response);
        if (isActive) {
          setPendingDonations(data ?? { totalPending: 0, donations: [] });
        }
      } catch (error) {
        if (isActive) {
          setPendingError(getErrorMessage(error));
          setPendingDonations(null);
        }
      } finally {
        if (isActive) {
          setPendingLoading(false);
        }
      }
    };

    loadPending();
    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== 'organizer') {
      setOrganizerStatus(null);
      return;
    }

    let isActive = true;
    const loadStatus = async () => {
      try {
        const response = await organizerService.status();
        if (isActive) {
          setOrganizerStatus(response.data?.data ?? null);
        }
      } catch {
        if (isActive) {
          setOrganizerStatus(null);
        }
      }
    };

    loadStatus();
    return () => {
      isActive = false;
    };
  }, [user]);

  const maxTrend = useMemo(() => Math.max(1, ...trends.map((point) => point.total)), [trends]);
  const earnedBadges = useMemo(() => {
    const badges = [] as Array<{ label: string; icon: React.ReactNode }>
    if (timeline.length > 0) {
      badges.push({ label: t('pages.userDashboard.badges.firstDonation'), icon: <Star className="size-4" aria-hidden="true" /> });
    }
    if (campaignsSupported >= 3) {
      badges.push({ label: t('pages.userDashboard.badges.impactBuilder'), icon: <Heart className="size-4" aria-hidden="true" /> });
    }
    if (totalDonated >= 250) {
      badges.push({ label: t('pages.userDashboard.badges.generousGiver'), icon: <Award className="size-4" aria-hidden="true" /> });
    }
    if (timeline.length >= 5) {
      badges.push({ label: t('pages.userDashboard.badges.consistentSupporter'), icon: <Repeat className="size-4" aria-hidden="true" /> });
    }
    return badges;
  }, [campaignsSupported, t, timeline.length, totalDonated]);

  const userId = user?.id ?? user?._id ?? '';
  const myCampaigns = useMemo(
    () => campaigns.filter((campaign) => {
      const organizerId = typeof campaign.organizer === 'string'
        ? campaign.organizer
        : campaign.organizer?.id || campaign.organizer?._id || '';
      return organizerId === userId || campaign.createdBy === userId;
    }),
    [campaigns, userId]
  );

  const campaignSummary = useMemo(() => {
    const summary = myCampaigns.reduce(
      (acc, campaign) => {
        const progress = campaign.goalAmount > 0 ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0;
        acc.totalCampaigns += 1;
        acc.totalRaised += campaign.raisedAmount;
        acc.activeCampaigns += campaign.status === 'approved' ? 1 : 0;
        acc.successStories += campaign.raisedAmount >= campaign.goalAmount ? 1 : 0;
        acc.progressTotal += progress;
        return acc;
      },
      { totalCampaigns: 0, activeCampaigns: 0, successStories: 0, totalRaised: 0, progressTotal: 0 }
    );

    return {
      totalCampaigns: summary.totalCampaigns,
      activeCampaigns: summary.activeCampaigns,
      successStories: summary.successStories,
      totalRaised: summary.totalRaised,
      avgProgress: summary.totalCampaigns ? summary.progressTotal / summary.totalCampaigns : 0
    };
  }, [myCampaigns]);

  const formatCurrency = (value: number) => `ETB ${value.toLocaleString()}`;

  const statusLabels = useMemo(
    () => ({
      approved: t('status.approved'),
      pending_verification: t('status.pending'),
      rejected: t('status.rejected'),
      draft: t('status.draft'),
      paused: t('pages.userDashboard.status.paused'),
      closed: t('status.closed')
    }),
    [t]
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending_verification':
        return 'bg-amber-100 text-amber-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'paused':
        return 'bg-slate-200 text-slate-700';
      case 'closed':
        return 'bg-slate-300 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const openRequestModal = (campaignId: string, title: string, action: 'pause' | 'delete') => {
    setRequestError(null);
    setRequestMessage('');
    setRequestModal({ id: campaignId, title, action });
  };

  const closeRequestModal = () => {
    if (requestLoading) return;
    setRequestModal(null);
  };

  const submitRequest = async () => {
    if (!requestModal) return;
    if (requestMessage.trim().length < 5) {
      setRequestError(t('pages.userDashboard.request.validation'));
      return;
    }

    setRequestLoading(true);
    setRequestError(null);
    try {
      await campaignService.requestAction(requestModal.id, {
        action: requestModal.action,
        message: requestMessage.trim()
      });
      setRequestModal(null);
    } catch (error) {
      setRequestError(getErrorMessage(error));
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 mt-15" data-animate="section">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            {t('pages.userDashboard.welcome', {name: user.name})}
          </h1>
          <p className="text-gray-500">{t('pages.userDashboard.subtitle')}</p>
        </div>
        <button 
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-lg text-white font-bold hover:shadow-lg transition-all">
          <Heart className="size-4" aria-hidden="true" />
          {t('pages.userDashboard.donateAgain')}
        </button>
      </div>

      {user?.role === 'organizer' && organizerStatus?.status === 'approved' && organizerStatus.reviewedAt && (
        <div className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-4 text-emerald-700" data-animate="section">
          <p className="font-semibold">{t('pages.userDashboard.organizerApproved.title')}</p>
          <p className="text-sm mt-1">{t('pages.userDashboard.organizerApproved.body')}</p>
        </div>
      )}
      {user?.role === 'organizer' && organizerStatus?.status === 'rejected' && organizerStatus.reviewedAt && (
        <div className="mb-8 rounded-2xl border border-rose-100 bg-rose-50 px-6 py-4 text-rose-700" data-animate="section">
          <p className="font-semibold">{t('pages.userDashboard.organizerRejected.title')}</p>
          <p className="text-sm mt-1">
            {organizerStatus.rejectionReason ?? t('pages.userDashboard.organizerRejected.fallback')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" data-animate="section">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2" data-animate="card">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Wallet className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('pages.userDashboard.stats.totalDonated')}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">ETB {totalDonated.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2" data-animate="card">
          <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
            <Heart className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('pages.userDashboard.stats.livesTouched')}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{timeline.length}</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2" data-animate="card">
          <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
            <Megaphone className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('pages.userDashboard.stats.projectsSupported')}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{campaignsSupported}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-10" data-animate="section">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" aria-hidden="true" />
              {t('pages.userDashboard.campaigns.title')}
            </h3>
            <p className="text-sm text-gray-500">{t('pages.userDashboard.campaigns.subtitle')}</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition-all"
            onClick={() => navigate('/create')}
          >
            <Target className="size-4" aria-hidden="true" />
            {t('pages.userDashboard.campaigns.create')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" data-animate="card">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('pages.userDashboard.campaigns.stats.totalCampaigns')}</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{campaignSummary.totalCampaigns}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('pages.userDashboard.campaigns.stats.activeCampaigns')}</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{campaignSummary.activeCampaigns}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('pages.userDashboard.campaigns.stats.totalRaised')}</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(campaignSummary.totalRaised)}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t('pages.userDashboard.campaigns.stats.avgProgress')}</p>
            <p className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{Math.round(campaignSummary.avgProgress)}%</p>
          </div>
        </div>

        {campaignLoading && (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 text-sm text-gray-500">
            {t('pages.userDashboard.campaigns.loading')}
          </div>
        )}

        {campaignError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            {campaignError}
          </div>
        )}

        {!campaignLoading && !campaignError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-animate="card">
            {myCampaigns.map((campaign) => {
              const progress = campaign.goalAmount > 0
                ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100))
                : 0;
              const isGoalReached = campaign.goalAmount > 0 && campaign.raisedAmount >= campaign.goalAmount;
              return (
                <div key={campaign._id} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900 shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {campaign.media[0] ? (
                        <img src={campaign.media[0]} alt={campaign.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-xs text-gray-400">{t('pages.userDashboard.campaigns.noImage')}</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400">{campaign.category}</p>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{campaign.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {isGoalReached && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                              {t('pages.userDashboard.campaigns.goalReached')}
                            </span>
                          )}
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadge(campaign.status)}`}>
                            {statusLabels[campaign.status as keyof typeof statusLabels] ?? campaign.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                      {isGoalReached && (
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                          <Sparkles className="size-4" aria-hidden="true" />
                          {t('pages.userDashboard.campaigns.celebration')}
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{t('pages.userDashboard.campaigns.raised', { amount: formatCurrency(campaign.raisedAmount) })}</span>
                          <span>{t('pages.userDashboard.campaigns.goal', { amount: formatCurrency(campaign.goalAmount) })}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Activity className="size-3" aria-hidden="true" />
                          {t('pages.userDashboard.campaigns.funded', { progress })}
                        </div>
                      </div>
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openRequestModal(campaign._id, campaign.title, 'pause')}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary/40"
                        >
                          {t('pages.userDashboard.campaigns.requestPause')}
                        </button>
                        <button
                          type="button"
                          onClick={() => openRequestModal(campaign._id, campaign.title, 'delete')}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:text-red-700"
                        >
                          {t('pages.userDashboard.campaigns.requestDelete')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {myCampaigns.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8 text-center text-sm text-gray-500">
                {t('pages.userDashboard.campaigns.empty')}
              </div>
            )}
          </div>
        )}

        {user?.role === 'organizer' && (
          <div className="mt-10" data-animate="section">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('pages.userDashboard.pending.title')}</h4>
              <span className="text-xs font-semibold text-gray-500">
                {t('pages.userDashboard.pending.submissions', { count: pendingDonations?.totalPending ?? 0 })}
              </span>
            </div>

            {pendingLoading && (
              <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 text-sm text-gray-500">
                {t('pages.userDashboard.pending.loading')}
              </div>
            )}

            {pendingError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                {pendingError}
              </div>
            )}

            {!pendingLoading && !pendingError && (
              <div className="space-y-4">
                {pendingDonations?.donations.map((donation) => (
                  <div key={donation.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400">{t('pages.userDashboard.pending.campaignLabel')}</p>
                        <h5 className="text-base font-bold text-gray-900 dark:text-white">{donation.campaignTitle}</h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('pages.userDashboard.pending.submitted', { date: new Date(donation.createdAt).toLocaleDateString() })}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ETB {donation.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-3">
                        <p className="text-xs uppercase tracking-wider text-gray-400">{t('pages.userDashboard.pending.donorLabel')}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {donation.donorName ?? t('pages.userDashboard.pending.anonymous')}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-3">
                        <p className="text-xs uppercase tracking-wider text-gray-400">{t('pages.userDashboard.pending.referenceLabel')}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {donation.transactionId ?? t('pages.userDashboard.pending.referenceFallback')}
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-3">
                        <p className="text-xs uppercase tracking-wider text-gray-400">{t('pages.userDashboard.pending.proofLabel')}</p>
                        {donation.screenshotUrl ? (
                          <a
                            href={donation.screenshotUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-primary font-semibold"
                          >
                            {t('pages.userDashboard.pending.viewProof')}
                          </a>
                        ) : (
                          <span className="font-semibold text-gray-500">{t('pages.userDashboard.pending.noAttachment')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {pendingDonations?.donations.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-6 text-sm text-gray-500">
                    {t('pages.userDashboard.pending.empty')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-animate="section">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8" data-animate="card">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Activity className="size-5 text-primary" aria-hidden="true" />
              {t('pages.userDashboard.timeline.title')}
            </h3>
            <div className="space-y-12">
              {timeline.map((item) => (
                <div key={item.id} className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute top-0 -left-2.25 size-4 rounded-full bg-green-500 ring-4 ring-green-500/10"></div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{t('pages.userDashboard.timeline.madeDonation')}</span>
                      <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="size-4 text-primary" aria-hidden="true" />
                        <span className="font-bold">
                          {item.campaignTitle ?? item.campaignData?.title ?? t('pages.userDashboard.timeline.campaignFallback', { id: item.campaign })}
                        </span>
                      </div>
                      <span className="font-bold">ETB {item.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8 text-sm text-gray-500">
                  {t('pages.userDashboard.timeline.empty')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800" data-animate="card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <RefreshCw className="size-4 text-primary" aria-hidden="true" />
              {t('pages.userDashboard.trends.title')}
            </h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {trends.map((point) => {
                const height = Math.max(10, Math.round((point.total / maxTrend) * 100));
                return (
                  <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-lg bg-primary/20"
                      style={{ height: `${height}%` }}
                      title={`ETB ${point.total.toFixed(2)}`}
                    />
                    <span className="text-[10px] text-gray-400 uppercase">
                      {new Date(point.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
              {trends.length === 0 && (
                <div className="text-sm text-gray-500">{t('pages.userDashboard.trends.empty')}</div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800" data-animate="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="size-4 text-warning" aria-hidden="true" />
              {t('pages.userDashboard.badges.title')}
            </h3>
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {badge.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{badge.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">{t('pages.userDashboard.badges.empty')}</p>
            )}
          </div>
        </div>
      </div>

      {requestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-surface-dark p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('pages.userDashboard.request.title', {
                    action: requestModal.action === 'pause'
                      ? t('pages.userDashboard.request.pause')
                      : t('pages.userDashboard.request.delete')
                  })}
                </h3>
                <p className="text-sm text-gray-500">{t('pages.userDashboard.request.campaign', { title: requestModal.title })}</p>
              </div>
              <button
                type="button"
                onClick={closeRequestModal}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                {t('pages.userDashboard.request.close')}
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="text-sm font-semibold">{t('pages.userDashboard.request.messageLabel')}</label>
              <textarea
                rows={4}
                value={requestMessage}
                onChange={(event) => setRequestMessage(event.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm"
                placeholder={t('pages.userDashboard.request.messagePlaceholder')}
              />
              {requestError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {requestError}
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={submitRequest}
                disabled={requestLoading}
                className="flex-1 rounded-lg bg-primary text-white py-2.5 text-sm font-semibold hover:bg-primary-hover disabled:opacity-60"
              >
                {requestLoading ? t('pages.userDashboard.request.submitting') : t('pages.userDashboard.request.send')}
              </button>
              <button
                type="button"
                onClick={closeRequestModal}
                disabled={requestLoading}
                className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                {t('pages.userDashboard.request.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
