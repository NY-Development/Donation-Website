
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { Activity, Award, CheckCircle, Heart, Megaphone, RefreshCw, Repeat, Star, Wallet } from 'lucide-react';
import { useDonationStore, useAuthStore } from '../store';
import userService from '../Services/users';
import { getApiData } from '../store/apiHelpers';
import type { DonationTrendPoint } from '../../types';

const UserDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const totalDonated = useDonationStore((state) => state.totalDonated);
  const campaignsSupported = useDonationStore((state) => state.campaignsSupported);
  const timeline = useDonationStore((state) => state.timeline);
  const fetchDashboard = useDonationStore((state) => state.fetchDashboard);
  const [trends, setTrends] = useState<DonationTrendPoint[]>([]);

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

  const maxTrend = useMemo(() => Math.max(1, ...trends.map((point) => point.total)), [trends]);
  const earnedBadges = useMemo(() => {
    const badges = [] as Array<{ label: string; icon: React.ReactNode }>
    if (timeline.length > 0) {
      badges.push({ label: 'First Donation', icon: <Star className="size-4" aria-hidden="true" /> });
    }
    if (campaignsSupported >= 3) {
      badges.push({ label: 'Impact Builder', icon: <Heart className="size-4" aria-hidden="true" /> });
    }
    if (totalDonated >= 250) {
      badges.push({ label: 'Generous Giver', icon: <Award className="size-4" aria-hidden="true" /> });
    }
    if (timeline.length >= 5) {
      badges.push({ label: 'Consistent Supporter', icon: <Repeat className="size-4" aria-hidden="true" /> });
    }
    return badges;
  }, [campaignsSupported, timeline.length, totalDonated]);

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4" data-animate="section">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Welcome back, Alex!</h1>
          <p className="text-gray-500">You're making a real difference. Here's your impact overview.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary px-6 py-2.5 rounded-lg text-white font-bold hover:shadow-lg transition-all">
          <Heart className="size-4" aria-hidden="true" />
          Donate Again
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" data-animate="section">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2" data-animate="card">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Wallet className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Donated</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">${totalDonated.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2" data-animate="card">
          <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
            <Heart className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lives Touched</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{timeline.length}</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2" data-animate="card">
          <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
            <Megaphone className="size-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Projects Supported</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{campaignsSupported}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-animate="section">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8" data-animate="card">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Activity className="size-5 text-primary" aria-hidden="true" />
              Timeline of Impact
            </h3>
            <div className="space-y-12">
              {timeline.map((item) => (
                <div key={item.id} className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute top-0 -left-2.25 size-4 rounded-full bg-green-500 ring-4 ring-green-500/10"></div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">You made a donation</span>
                      <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="size-4 text-primary" aria-hidden="true" />
                        <span className="font-bold">Campaign {item.campaign}</span>
                      </div>
                      <span className="font-bold">${item.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-8 text-sm text-gray-500">
                  No donations yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800" data-animate="card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <RefreshCw className="size-4 text-primary" aria-hidden="true" />
              Donation Trends (7 days)
            </h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {trends.map((point) => {
                const height = Math.max(10, Math.round((point.total / maxTrend) * 100));
                return (
                  <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-lg bg-primary/20"
                      style={{ height: `${height}%` }}
                      title={`$${point.total.toFixed(2)}`}
                    />
                    <span className="text-[10px] text-gray-400 uppercase">
                      {new Date(point.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
              {trends.length === 0 && (
                <div className="text-sm text-gray-500">No trend data yet.</div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800" data-animate="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="size-4 text-warning" aria-hidden="true" />
              Badges Earned
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
              <p className="text-sm text-gray-500">No badges yet. Make a donation to start earning.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
