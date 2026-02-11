import React, { useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { addHoverScale, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { HeartHandshake, Lock, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode }) => {
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/donate');
  const isAdmin = location.pathname.startsWith('/admin');
  const navRef = useRef<HTMLElement | null>(null);
  const { isAuthenticated, logout, user } = useAuthStore();
  const profileInitial = user?.name?.trim()?.[0]?.toUpperCase() || user?.email?.trim()?.[0]?.toUpperCase() || 'U';

  useLayoutEffect(() => {
    ensureGsap();
    if (!navRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        autoAlpha: 0,
        y: -16,
        duration: 0.6,
        ease: 'power3.out',
      });
    }, navRef);

    const cleanupHover = addHoverScale(
      gsap.utils.toArray('[data-animate="nav-link"]', navRef.current),
      1.03
    );

    return () => {
      cleanupHover();
      ctx.revert();
    };
  }, []);

  if (isCheckout) {
    return (
      <header ref={navRef} className="sticky top-0 z-50 w-full bg-white dark:bg-surface-dark border-b border-[#ede7f3] dark:border-gray-800">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-4" data-animate="nav-link">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
              <HeartHandshake className="size-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">Impact</h2>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" data-animate="nav-link">
              {isDarkMode ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ede7f3] dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white">
              <Lock className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav ref={navRef} className="sticky top-0 z-50 w-full bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" data-animate="nav-link">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <HeartHandshake className="size-5" aria-hidden="true" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Impact</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-semibold text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/explore" data-animate="nav-link">Campaigns</Link>
            <Link className="text-sm font-semibold text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/create" data-animate="nav-link">Start Campaign</Link>
            <Link className="text-sm font-semibold text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/dashboard" data-animate="nav-link">My Impact</Link>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300" data-animate="nav-link">
              {isDarkMode ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
            </button>
            {isAuthenticated ? (
              <button 
              onClick={() => {logout()}}
              className="hidden sm:flex items-center justify-center h-9 px-4 rounded-lg text-white bg-red-500 dark:bg-red-600 dark:text-white text-sm font-bold hover:bg-red-600 dark:hover:bg-gray-700 transition-colors" data-animate="nav-link">
                Log Out
              </button>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center justify-center h-9 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" data-animate="nav-link">
                Log In
              </Link>
            )}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center justify-center size-9 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary-hover transition-colors"
                aria-label="Open profile"
                data-animate="nav-link"
              >
                {profileInitial}
              </Link>
            ) : (
              <Link to="/explore" className="flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30" data-animate="nav-link">
                Donate
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
