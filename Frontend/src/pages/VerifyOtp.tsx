import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { gsap } from 'gsap';
import { addHoverScale, animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import authService from '../Services/auth';
import { useTranslation } from 'react-i18next';

const VerifyOtp: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const params = new URLSearchParams(location.search);
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const schema = z.object({
      email: z.string().email(t('pages.auth.verifyOtp.validation.email')),
      otp: z.string().min(6, t('pages.auth.verifyOtp.validation.code')).max(6, t('pages.auth.verifyOtp.validation.code'))
    });
    const parsed = schema.safeParse({ email, otp });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t('pages.auth.verifyOtp.validation.fallback'));
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.verifyOtp({ email: parsed.data.email, otp: parsed.data.otp });
      setSuccess(t('pages.auth.verifyOtp.success'));
      setTimeout(() => {
        navigate('/login');
      }, 800);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? t('pages.auth.verifyOtp.failure');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);

      const forms = gsap.utils.toArray<HTMLElement>('[data-animate="form"]', containerRef.current);
      forms.forEach((form) => {
        const inputs = gsap.utils.toArray<HTMLElement>('[data-animate="input"]', form);
        animateStagger(inputs, {
          y: 10,
          duration: 0.5,
          stagger: 0.06
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
  }, []);

  return (
    <div ref={containerRef} className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50 dark:bg-background-dark">
      <div className="w-full max-w-140 bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 md:p-12" data-animate="section">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('pages.auth.verifyOtp.kicker')}</p>
          <h1 className="text-3xl font-black mt-3 text-gray-900 dark:text-white">{t('pages.auth.verifyOtp.title')}</h1>
          <p className="text-gray-500 mt-3">{t('pages.auth.verifyOtp.subtitle')}</p>
        </div>

        {(error || success) && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              error
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            {error ?? success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6" data-animate="form">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('pages.auth.verifyOtp.email')}</label>
            <input
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              type="email"
              required
              data-animate="input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('pages.auth.verifyOtp.code')}</label>
            <input
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none tracking-[0.4em] text-center"
              type="text"
              maxLength={6}
              placeholder="123456"
              required
              data-animate="input"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70"
            data-animate="button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? t('pages.auth.verifyOtp.verifying') : t('pages.auth.verifyOtp.verify')}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t('pages.auth.verifyOtp.already')} <Link to="/login" className="text-primary font-bold hover:underline">{t('pages.auth.verifyOtp.logIn')}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
