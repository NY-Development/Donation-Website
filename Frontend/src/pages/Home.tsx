
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { ArrowRight, BadgeCheck, Heart, Mail, MailCheck, Megaphone, Search, Sparkles, Wallet, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import campaignService from '../Services/campaigns';
import { getApiData } from '../store/apiHelpers';
import type { Campaign, GlobalStats } from '../../types';

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroTrackRef = useRef<HTMLDivElement | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop',
  ];

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);

      const impactSteps = gsap.utils.toArray<HTMLElement>('[data-animate="impact-step"]', containerRef.current);
      if (impactSteps.length) {
        animateStagger(impactSteps, {
          y: 16,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: {
            trigger: impactSteps[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      if (heroTrackRef.current) {
        gsap.to(heroTrackRef.current, {
          xPercent: -75,
          duration: 30,
          ease: 'none',
          repeat: -1,
        });

        const panels = gsap.utils.toArray<HTMLElement>('[data-animate="hero-panel"]', heroTrackRef.current);
        gsap.to(panels, {
          scale: 1.05,
          duration: 8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 1.5,
          transformOrigin: 'center center',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const seen = localStorage.getItem('impact:onboarding');
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);

  const onboardingSteps = [
    {
      title: 'Discover trusted causes',
      description: 'Browse campaigns vetted for transparency and impact.'
    },
    {
      title: 'Choose your ETB amount',
      description: 'Pick a donation amount that fits your impact goal.'
    },
    {
      title: 'Pay with CBE transfer',
      description: 'Use the campaign account number to complete your transfer.'
    },
    {
      title: 'Verify and celebrate',
      description: 'Upload a QR screenshot or transaction ID to verify instantly.'
    }
  ];

  const closeOnboarding = () => {
    localStorage.setItem('impact:onboarding', 'true');
    setShowOnboarding(false);
  };

  const { data: stats } = useQuery({
    queryKey: ['stats', 'global'],
    queryFn: async () => {
      const response = await campaignService.getGlobalStats();
      return getApiData<GlobalStats>(response);
    }
  });

  const { data: featured } = useQuery({
    queryKey: ['campaigns', 'featured'],
    queryFn: async () => {
      const response = await campaignService.getFeatured();
      return getApiData<Campaign[]>(response) ?? [];
    }
  });

  const { data: successStories } = useQuery({
    queryKey: ['campaigns', 'success-stories'],
    queryFn: async () => {
      const response = await campaignService.getSuccessStories({ limit: 3 });
      return getApiData<Campaign[]>(response) ?? [];
    }
  });

  return (
    <div ref={containerRef}>
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-surface-dark border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-yellow-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-yellow-900/20" />
            <div className="relative p-8">
              <button
                type="button"
                onClick={closeOnboarding}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white"
                aria-label="Close onboarding"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-3 text-primary font-semibold">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="size-5" aria-hidden="true" />
                </div>
                <span>Welcome to Impact</span>
              </div>
              <h2 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">{onboardingSteps[onboardingStep].title}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{onboardingSteps[onboardingStep].description}</p>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {onboardingSteps.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 w-10 rounded-full transition ${
                        index === onboardingStep ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {onboardingStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setOnboardingStep((prev) => Math.max(0, prev - 1))}
                      className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (onboardingStep === onboardingSteps.length - 1) {
                        closeOnboarding();
                      } else {
                        setOnboardingStep((prev) => prev + 1);
                      }
                    }}
                    className="px-5 py-2 rounded-lg bg-primary text-white font-bold text-sm flex items-center gap-2"
                  >
                    {onboardingStep === onboardingSteps.length - 1 ? 'Get started' : 'Next'}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden" data-animate="section">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div ref={heroTrackRef} className="absolute inset-0 flex w-[400%]">
            {[...heroImages, heroImages[0]].map((image, index) => (
              <div
                key={`${image}-${index}`}
                data-animate="hero-panel"
                className="w-1/4 h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${image}")` }}
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-gray-900/60 via-gray-900/50 to-background-light dark:to-background-dark"></div>
        <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center pt-10">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-6">
            <BadgeCheck className="size-3.5" aria-hidden="true" />
            Trusted by 10k+ Donors
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mb-6 drop-shadow-sm">
            Make an Impact Today
          </h1>
          <h2 className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed max-w-2xl mb-10 drop-shadow-sm">
            Join thousands of changemakers supporting causes that matter. 100% of your donation goes directly to the field to help those in need.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link to="/explore" className="h-12 px-8 rounded-lg bg-primary text-white text-base font-bold hover:bg-primary-hover transition-all transform hover:scale-105 shadow-xl shadow-primary/40 flex items-center justify-center gap-2">
              <span>Donate Now</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link to="/explore" className="h-12 px-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/30 text-white text-base font-bold hover:bg-white/20 transition-all flex items-center justify-center">
              Explore Campaigns
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-30 -mt-16 pb-16 px-4" data-animate="section">
        <div className="max-w-[1000px] mx-auto">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center text-center p-2">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-3 text-primary">
                <Wallet className="size-7" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                ETB {stats?.totalDonated?.toLocaleString() ?? '0'}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Raised</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-3 text-primary">
                <Megaphone className="size-7" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                {stats?.livesImpacted?.toLocaleString() ?? '0'}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Campaigns</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-3 text-primary">
                <Heart className="size-7" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
                {stats?.donorsCount?.toLocaleString() ?? '0'}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lives Changed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section placeholder */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto" data-animate="section">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Featured Campaigns</h2>
            <p className="text-gray-600 dark:text-gray-400">Support urgent causes that need your help right now.</p>
          </div>
          <Link className="inline-flex items-center text-primary font-bold hover:underline gap-1" to="/explore">
            View all campaigns <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(featured ?? []).map((campaign) => {
            const raised = campaign.raisedAmount ?? 0;
            const goal = campaign.goalAmount ?? 1;
            const percent = Math.min(100, Math.round((raised / goal) * 100));
            const image = campaign.media?.[0] ?? 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2000&auto=format&fit=crop';

            return (
              <div key={campaign._id} className="group flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all border border-gray-100 dark:border-gray-800">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${image}")` }}></div>
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-primary">{campaign.category}</div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{campaign.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-2">{campaign.story}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-primary">ETB {raised.toLocaleString()} raised</span>
                      <span className="text-gray-500">{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                  <Link to={`/donate/${campaign._id}`} className="w-full h-10 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    Donate Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Success Stories */}
      {(successStories ?? []).length > 0 && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8" data-animate="section">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute bottom-0 right-10 h-52 w-52 rounded-full bg-yellow-400/20 blur-3xl" />
          </div>
          <div className="relative max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Success Stories</h2>
                <p className="text-gray-600 dark:text-gray-400">Campaigns that reached their goal and are celebrating impact.</p>
              </div>
              <Link className="inline-flex items-center text-primary font-bold hover:underline gap-1" to="/explore">
                Discover more <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(successStories ?? []).map((campaign) => {
                const image = campaign.media?.[0] ?? 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop';
                return (
                  <div
                    key={campaign._id}
                    className="group relative overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-surface-dark shadow-xl shadow-emerald-200/30"
                    data-animate="impact-step"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-transparent to-yellow-50/60 opacity-0 group-hover:opacity-100 transition" />
                    <div className="relative h-48 w-full overflow-hidden">
                      <img src={image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">Goal Reached</span>
                    </div>
                    <div className="relative p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{campaign.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{campaign.story}</p>
                      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-emerald-600">
                        <span>ETB {campaign.raisedAmount.toLocaleString()} raised</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-20 bg-white dark:bg-[#1f1528]" data-animate="section">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How Impact Works</h2>
            <p className="text-gray-600 dark:text-gray-400">Transparent giving. Visible impact. We make it easy to support the causes you care about.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center" data-animate="impact-step">
              <div className="size-16 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-primary mb-6">
                <Search className="size-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Discover a Cause</h3>
              <p className="text-gray-600 dark:text-gray-400">Browse through hundreds of verified campaigns from trusted non-profits.</p>
            </div>
            <div className="flex flex-col items-center" data-animate="impact-step">
              <div className="size-16 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-primary mb-6">
                <Heart className="size-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Donate Securely</h3>
              <p className="text-gray-600 dark:text-gray-400">Make a donation with just a few clicks. Our secure platform ensures safety.</p>
            </div>
            <div className="flex flex-col items-center" data-animate="impact-step">
              <div className="size-16 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-primary mb-6">
                <MailCheck className="size-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Receive Updates</h3>
              <p className="text-gray-600 dark:text-gray-400">Get real-time updates and photos showing exactly how your contribution made a difference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-primary text-white" data-animate="section">
        <div className="max-w-[800px] mx-auto text-center">
          <Mail className="size-12 mb-6 opacity-80" aria-hidden="true" />
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-purple-100 mb-8 max-w-lg mx-auto">Get inspiring stories and impact reports delivered straight to your inbox every week.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input className="flex-1 px-4 h-12 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-purple-300 placeholder-gray-500" placeholder="Enter your email" type="email" />
            <button className="px-6 h-12 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
