import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { ArrowRight, BadgeCheck, Heart, Mail, MailCheck, Megaphone, Search, Sparkles, Wallet, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import campaignService from '../Services/campaigns';
import { getApiData } from '../store/apiHelpers';
import type { Campaign, GlobalStats } from '../../types';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroTrackRef = useRef<HTMLDivElement | null>(null);
  const heroImg1Ref = useRef<HTMLDivElement | null>(null);
  const heroImg2Ref = useRef<HTMLDivElement | null>(null);
  const [heroImagesHorizontal, setHeroImagesHorizontal] = useState(false);
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

      // Animate hero images from opposite sides
      if (heroImg1Ref.current) {
        gsap.fromTo(heroImg1Ref.current,
          { opacity: 0, x: -60, y: 40, scale: 0.96 },
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
        );
      }
      if (heroImg2Ref.current) {
        gsap.fromTo(heroImg2Ref.current,
          { opacity: 0, x: 60, y: 40, scale: 0.96 },
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
        );
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

  const onboardingSteps = t('pages.home.onboarding', { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

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
    <div ref={containerRef} className="font-sans bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 antialiased overflow-x-hidden transition-colors duration-200">
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-surface-dark border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-yellow-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-yellow-900/20" />
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
                <span>{t('pages.home.onboardingTitle')}</span>
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
                      {t('pages.home.back')}
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
                    {onboardingStep === onboardingSteps.length - 1 ? t('pages.home.getStarted') : t('pages.home.next')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-350 mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            <h1 className="text-6xl md:text-8xl font-serif leading-[0.95] text-gray-900 dark:text-white mb-8 tracking-tight text-balance">
              {t('pages.home.heroTitle', 'Empowering communities through ')}
              <span className="italic text-primary">{t('pages.home.heroHighlight', 'transparent')}</span> {t('pages.home.heroTitle2', 'giving')}
            </h1>
          </div>
          <div
            className={
              heroImagesHorizontal
                ? 'lg:col-span-5 flex flex-col lg:flex-row gap-4 items-center justify-center cursor-pointer'
                : 'lg:col-span-5 relative h-75 lg:h-100 flex items-center justify-center cursor-pointer'
            }
            onClick={() => setHeroImagesHorizontal((prev) => !prev)}
            title="Click to toggle layout"
          >
            {/* Horizontal layout: side by side on mobile, stacked on second row on large screens */}
            {heroImagesHorizontal ? (
              <>
                <div ref={heroImg1Ref} className="w-40 h-52 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-surface-dark">
                  <img alt="Community" className="w-full h-full object-cover" src={heroImages[0]} />
                </div>
                <div ref={heroImg2Ref} className="w-40 h-52 rounded-[2.5rem] overflow-hidden shadow-xl opacity-80 filter grayscale-[0.5] border-4 border-white dark:border-surface-dark">
                  <img alt="Impact" className="w-full h-full object-cover" src={heroImages[1]} />
                </div>
              </>
            ) : (
              <>
                <div ref={heroImg1Ref} className="absolute w-64 h-80 rounded-[4rem] overflow-hidden transform -rotate-6 translate-x-[-20%] shadow-2xl z-10 border-4 border-white dark:border-surface-dark">
                  <img alt="Community" className="w-full h-full object-cover" src={heroImages[0]} />
                </div>
                <div ref={heroImg2Ref} className="absolute w-56 h-72 rounded-[3.5rem] overflow-hidden transform rotate-[8deg] translate-x-[40%] translate-y-[10%] shadow-xl z-0 opacity-80 filter grayscale-[0.5]">
                  <img alt="Impact" className="w-full h-full object-cover" src={heroImages[1]} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="relative group">
          <div className="relative aspect-21/9 w-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl">
            <img alt="Main Action" className="w-full h-full object-cover scale-105" src={heroImages[2]} />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 flex flex-wrap gap-2 md:gap-3">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 text-xs md:text-sm font-bold text-gray-900 border border-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified ★
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs md:text-sm font-bold text-white border border-white/30">
                Global Impact
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs md:text-sm font-bold text-white border border-white/30">
                Direct Giving
              </div>
              <div className="bg-primary px-4 py-2 rounded-full text-xs md:text-sm font-bold text-white shadow-lg">
                Real-time Tracking ★
              </div>
            </div>
            <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 hidden md:block max-w-70">
              <p className="text-white text-lg font-medium leading-tight">
                <span className="opacity-70 text-2xl leading-none">✻</span> {t('pages.home.heroNote', 'We are professional non-profit agency working with heart from 2020.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-300 mx-auto">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl shadow-gray-200/20 dark:shadow-black/20 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center text-center p-2">
              <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter mb-1">{stats?.totalDonated ? `ETB ${stats.totalDonated.toLocaleString()}` : '0'}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('pages.home.totalRaised', 'Total Raised')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter mb-1">{stats?.livesImpacted?.toLocaleString() ?? '500+'}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('pages.home.activeCampaigns', 'Active Campaigns')}</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter mb-1">{stats?.donorsCount?.toLocaleString() ?? '10k+'}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('pages.home.livesChanged', 'Lives Changed')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-300 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">{t('pages.home.featuredTitle', 'Featured Campaigns')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('pages.home.featuredSubtitle', 'Support urgent causes that need your help right now with full transparency.')}</p>
          </div>
          <Link className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all gap-1 group" to="/explore">
            {t('pages.home.viewAll', 'View all campaigns')} <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(featured ?? []).slice(0, 3).map((campaign, idx) => {
            const raised = campaign.raisedAmount ?? 0;
            const goal = campaign.goalAmount ?? 1;
            const percent = Math.round((raised / goal) * 100);
            const image = campaign.media?.[0] ?? heroImages[idx % heroImages.length];
            return (
              <div key={campaign._id} className="group bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${image}')` }}></div>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-primary">
                    {campaign.category || 'Category'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{campaign.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-2">{campaign.story}</p>
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-primary">ETB {raised.toLocaleString()} {t('pages.home.raised', 'raised')}</span>
                      <span className="text-gray-400">{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                  <Link to={`/donate/${campaign._id}`} className="w-full py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary hover:text-white text-gray-900 dark:text-white font-bold transition-all">
                    {t('pages.home.donateNow', 'Donate Now')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transparent Giving Section */}
      <section className="py-32 bg-gray-50 dark:bg-surface-dark/30">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t('pages.home.transparentTitle', 'Transparent giving.')}<br />{t('pages.home.visibleImpact', 'Visible impact.')}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 leading-relaxed">
                {t('pages.home.transparentDesc', 'We make it easy to support the causes you care about. Every cent is tracked and verified, ensuring your contribution reaches those in need.')}
              </p>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{t('pages.home.discoverCause', 'Discover a Cause')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('pages.home.discoverDesc', 'Browse through hundreds of verified campaigns from trusted non-profits.')}</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">volunteer_activism</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{t('pages.home.donateSecurely', 'Donate Securely')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('pages.home.donateSecurelyDesc', 'Our secure platform ensures your money reaches its intended destination safely.')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-125 rounded-3xl overflow-hidden shadow-2xl">
              <img alt="Impact process" className="w-full h-full object-cover" src={heroImages[0]} />
              <div className="absolute top-8 right-8 bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-xl max-w-50">
                <div className="text-primary font-black text-2xl mb-1">100%</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{t('pages.home.proceeds', 'Proceeds go to the field directly')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-24 px-4">
        <div className="max-w-250 mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('pages.home.communityTitle', 'Join our community')}</h2>
            <p className="text-purple-100 text-lg mb-10 max-w-lg mx-auto">{t('pages.home.communitySubtitle', 'Get inspiring stories and impact reports delivered straight to your inbox.')}</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input className="flex-1 px-6 h-14 rounded-full bg-white/20 border-white/30 text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none backdrop-blur-md" placeholder={t('pages.home.emailPlaceholder', 'Your email address')} type="email" />
              <button className="px-8 h-14 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl" type="button">
                {t('pages.home.subscribe', 'Subscribe')}
              </button>
            </form>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
