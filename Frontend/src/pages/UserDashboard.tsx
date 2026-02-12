
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { Activity, Award, CheckCircle, GraduationCap, Heart, Image, Leaf, Megaphone, RefreshCw, Repeat, Star, Wallet } from 'lucide-react';
import { useDonationStore, useAuthStore } from '../store';

const UserDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const totalDonated = useDonationStore((state) => state.totalDonated);
  const campaignsSupported = useDonationStore((state) => state.campaignsSupported);
  const timeline = useDonationStore((state) => state.timeline);
  const fetchDashboard = useDonationStore((state) => state.fetchDashboard);

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
                  <div className="absolute top-0 -left-[9px] size-4 rounded-full bg-green-500 ring-4 ring-green-500/10"></div>
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
              Active Subscriptions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <GraduationCap className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Education Fund</p>
                    <p className="text-xs text-gray-500">Monthly • Next: Oct 15</p>
                  </div>
                </div>
                <span className="font-bold text-sm">$25</span>
              </div>
            </div>
            <button className="w-full mt-6 text-sm font-bold text-primary hover:underline">Manage Subscriptions</button>
          </div>

          <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800" data-animate="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="size-4 text-warning" aria-hidden="true" />
              Badges Earned
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-square rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600" title="First Donation">
                <Star className="size-4" aria-hidden="true" />
              </div>
              <div className="aspect-square rounded-full bg-purple-100 flex items-center justify-center text-purple-600" title="Monthly Supporter">
                <Repeat className="size-4" aria-hidden="true" />
              </div>
              <div className="aspect-square rounded-full bg-pink-100 flex items-center justify-center text-pink-600" title="Life Changer">
                <Heart className="size-4" aria-hidden="true" />
              </div>
              <div className="aspect-square rounded-full bg-blue-100 flex items-center justify-center text-blue-600" title="Eco Hero">
                <Leaf className="size-4" aria-hidden="true" />
              </div>
            </div>
            <button className="w-full mt-6 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              + View All Badges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
