
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
    <footer ref={footerRef} className="bg-background-light dark:bg-background-dark pt-24 pb-12">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <HeartHandshake className="size-7 text-primary" aria-hidden="true" />
              <span className="text-2xl font-black text-gray-900 dark:text-white">{t('common.brand')}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8 leading-relaxed">
              {t('footer.tagline', 'Connecting generous hearts with causes that matter. We are building a world where everyone can make a difference.')}
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-primary transition-colors" href="#" aria-label="Twitter">
                {/* Twitter SVG */}
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-primary transition-colors" href="#" aria-label="Instagram">
                {/* Instagram SVG */}
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">{t('footer.platform', 'Platform')}</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/how-it-works">{t('footer.howItWorks', 'How it works')}</Link></li>
              {/* <li><Link className="hover:text-primary transition-colors" to="/pricing">{t('footer.pricing', 'Pricing')}</Link></li> */}
              <li><Link className="hover:text-primary transition-colors" to="/success-stories">{t('footer.successStories', 'Success Stories')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">{t('footer.resources', 'Resources')}</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/help-center">{t('footer.helpCenter', 'Help Center')}</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/safety">{t('footer.safetyTrust', 'Safety & Trust')}</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/guidelines">{t('footer.guidelines', 'Guidelines')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">{t('footer.company', 'Company')}</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/about">{t('footer.aboutUs', 'About Us')}</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/careers">{t('footer.careers', 'Careers')}</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/contact">{t('footer.contact', 'Contact')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>© 2023 Impact Foundation. All rights reserved.</p>
          <div className="flex gap-8">
            <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" to="/privacy">{t('footer.privacy', 'Privacy Policy')}</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" to="/terms">{t('footer.terms', 'Terms of Service')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
