
import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
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
              <Heart className="size-7 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Impact</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs mb-6 text-sm leading-relaxed">
              Connecting generous hearts with causes that matter. We are building a world where everyone can make a difference.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/how-it-works">How it works</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/for-nonprofits">For Nonprofits</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/help-center">Help Center</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/safety-trust">Safety & Trust</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/about">About Us</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/explore">Explore Campaigns</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <p>© 2024 ImpactGive Foundation. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" to="/privacy">Privacy Policy</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" to="/terms">Terms of Service</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white transition-colors" to="/eula">EULA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
