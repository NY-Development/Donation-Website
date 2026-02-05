
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { ArrowRight, BadgeCheck, Heart, Mail, MailCheck, Megaphone, Search, Wallet } from 'lucide-react';

const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroTrackRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={containerRef}>
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">$2M+</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Raised</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-3 text-primary">
                <Megaphone className="size-7" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">500+</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Campaigns</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-3 text-primary">
                <Heart className="size-7" aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">10k+</p>
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
           {/* Card 1 */}
           <div className="group flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all border border-gray-100 dark:border-gray-800">
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541976590-71394168159b?q=80&w=2000&auto=format&fit=crop")' }}></div>
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-primary">Environment</div>
            </div>
            <div className="flex flex-col flex-1 p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reforestation Project: Amazon</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">Protect biodiversity and fight climate change by planting native trees.</p>
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-primary">$15,400 raised</span>
                  <span className="text-gray-500">77%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '77%' }}></div>
                </div>
              </div>
              <Link to="/donate/1" className="w-full h-10 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-bold transition-colors flex items-center justify-center gap-2">
                Donate Now
              </Link>
            </div>
          </div>
          {/* Card 2 */}
          <div className="group flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all border border-gray-100 dark:border-gray-800">
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop")' }}></div>
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-primary">Education</div>
            </div>
            <div className="flex flex-col flex-1 p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Digital Literacy for Kids</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">Bridging the gap with technology for underprivileged rural students.</p>
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-primary">$4,200 raised</span>
                  <span className="text-gray-500">42%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <Link to="/donate/2" className="w-full h-10 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-bold transition-colors flex items-center justify-center gap-2">
                Donate Now
              </Link>
            </div>
          </div>
          {/* Card 3 */}
          <div className="group flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all border border-gray-100 dark:border-gray-800">
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?q=80&w=2070&auto=format&fit=crop")' }}></div>
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-primary">Emergency</div>
            </div>
            <div className="flex flex-col flex-1 p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Emergency Aid for Refugees</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">Providing food, blankets, and medicine to displaced families.</p>
              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-primary">$45,900 raised</span>
                  <span className="text-gray-500">91%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>
              <Link to="/donate/3" className="w-full h-10 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-sm font-bold transition-colors flex items-center justify-center gap-2">
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>

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
