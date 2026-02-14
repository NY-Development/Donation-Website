
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { CheckCircle, Heart } from 'lucide-react';
import { FaRegSmileBeam, FaStar } from 'react-icons/fa';
import { useAuthStore } from '../store';

const Success: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const state = location.state as { amount?: number; campaignTitle?: string; redirectTo?: string } | undefined;
  const amount = state?.amount ?? 0;
  const campaignTitle = state?.campaignTitle ?? 'Campaign';
  const redirectTo = state?.redirectTo ?? (isAuthenticated ? '/dashboard' : '/campaigns');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [navigate, redirectTo]);

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);

      const celebrate = containerRef.current?.querySelector('[data-animate="celebrate"]');
      if (celebrate) {
        gsap.fromTo(
          celebrate,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
        );
        gsap.to(celebrate, {
          scale: 1.05,
          duration: 0.8,
          ease: 'power1.inOut',
          repeat: 2,
          yoyo: true,
          delay: 0.6,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-5%] left-[10%] w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-[600px] flex flex-col items-center text-center" data-animate="section">
        <div className="mb-8 relative flex items-center justify-center" data-animate="celebrate">
          <div className="flex items-center justify-center w-24 h-24 bg-white dark:bg-surface-dark rounded-full shadow-lg border-4 border-primary/20">
            <Heart className="size-12 text-primary" aria-hidden="true" />
          </div>
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: '-2rem',
              color: '#FACC15', // Tailwind 'text-yellow-400'
              fontSize: '1.5rem',
              transform: 'rotate(-20deg)'
            }}
            aria-hidden="true"
          >
            <FaRegSmileBeam size={24} />
          </span>
          <span
            style={{
              position: 'absolute',
              top: '-1rem',
              right: 0,
              color: '#2563eb', // Tailwind 'text-primary'
              fontSize: '1.25rem'
            }}
            aria-hidden="true"
          >
            <FaStar size={20} />
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-4">
          Your impact starts now!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-sm">
          Thank you for your generosity. We've received your transfer details for review.
        </p>

        <div className="w-full bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
          <div className="p-8 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Total Donation</p>
            <p className="text-5xl font-black text-primary">ETB {amount.toFixed(2)}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase">
              <CheckCircle className="size-4" aria-hidden="true" />
              Submitted For Review
            </div>
          </div>
          <div className="p-8 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-lg bg-cover bg-center bg-gray-200" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?q=80&w=200&auto=format&fit=crop")' }}></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Campaign</p>
                <h3 className="text-lg font-bold">{campaignTitle}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link to={redirectTo} className="flex-1 h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center hover:bg-primary-hover transition-all">
            {isAuthenticated ? 'Go to My Impact' : 'Back to Campaigns'}
          </Link>
          <Link to={isAuthenticated ? '/campaigns' : '/login'} className="flex-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold flex items-center justify-center hover:border-primary transition-all">
            {isAuthenticated ? 'Explore Campaigns' : 'Sign In'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
