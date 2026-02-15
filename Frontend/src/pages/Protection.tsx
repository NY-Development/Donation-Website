import React, { useLayoutEffect, useRef } from 'react';
import { ShieldCheck, Lock, BadgeCheck, FileText } from 'lucide-react';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { useTranslation } from 'react-i18next';

const Protection: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[calc(100vh-64px)] bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10" data-animate="section">
          <p className="text-primary text-sm font-bold uppercase tracking-[0.3em]">{t('pages.protection.kicker')}</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">
            {t('pages.protection.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
            {t('pages.protection.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6" data-animate="section">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Lock className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{t('pages.protection.card1Title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('pages.protection.card1Body')}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6" data-animate="section">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BadgeCheck className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{t('pages.protection.card2Title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('pages.protection.card2Body')}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6" data-animate="section">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{t('pages.protection.card3Title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('pages.protection.card3Body')}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6" data-animate="section">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{t('pages.protection.card4Title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('pages.protection.card4Body')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Protection;
