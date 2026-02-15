
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { HeartHandshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const footerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    ensureGsap();
    if (!footerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <HeartHandshake className="size-7 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">{t('common.brand')}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs mb-6 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/how-it-works">{t('footer.howItWorks')}</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/for-nonprofits">{t('footer.forNonprofits')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/help-center">{t('footer.helpCenter')}</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/safety-trust">{t('footer.safetyTrust')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/about">{t('footer.aboutUs')}</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/explore">{t('footer.exploreCampaigns')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <p>{t('footer.copyright')}</p>
          <a
            href="https://nydevelopment.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t('footer.developedBy')}
          </a>
          <div className="flex gap-6">
            <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" to="/privacy">{t('footer.privacy')}</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" to="/terms">{t('footer.terms')}</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" to="/eula">{t('footer.eula')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
