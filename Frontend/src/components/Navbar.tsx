import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { addHoverScale, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { HeartHandshake, Lock, Menu, Moon, Sun, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../store/apiHelpers';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode }) => {
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/donate');
  const isAdmin = location.pathname.startsWith('/admin');
  const navRef = useRef<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user, updateProfile } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const profileInitial = user?.name?.trim()?.[0]?.toUpperCase() || user?.email?.trim()?.[0]?.toUpperCase() || 'U';

  const openProfileModal = () => {
    setProfileError(null);
    setProfileName(user?.name ?? '');
    setProfileEmail(user?.email ?? '');
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    if (profileLoading) return;
    setIsProfileOpen(false);
  };

  const submitProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileError(null);
    setProfileLoading(true);
    try {
      const success = await updateProfile({
        name: profileName.trim(),
        email: profileEmail.trim()
      });
      if (success) {
        setIsProfileOpen(false);
      } else {
        setProfileError('Unable to update profile right now.');
      }
    } catch (error) {
      setProfileError(getErrorMessage(error));
    } finally {
      setProfileLoading(false);
    }
  };

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
              <span className="hidden sm:inline">Secure Verification</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isAdmin) {
    return null;
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
              <div className="relative hidden md:flex items-center" data-animate="nav-link">
                <button
                  type="button"
                  onClick={openProfileModal}
                  className="flex items-center justify-center size-9 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary-hover transition-colors"
                  aria-label="Open profile"
                >
                  {profileInitial}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your profile</h3>
                      <button
                        type="button"
                        onClick={closeProfileModal}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <span className="sr-only">Close</span>
                        X
                      </button>
                    </div>
                    <form className="space-y-4" onSubmit={submitProfile}>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
                        <input
                          className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                          type="text"
                          value={profileName}
                          onChange={(event) => setProfileName(event.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                        <input
                          className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                          type="email"
                          value={profileEmail}
                          onChange={(event) => setProfileEmail(event.target.value)}
                          required
                        />
                      </div>
                      {profileError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                          {profileError}
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={closeProfileModal}
                          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold"
                          disabled={profileLoading}
                          aria-busy={profileLoading}
                        >
                          {profileLoading ? 'Saving...' : 'Save changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/explore" className="hidden md:flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30" data-animate="nav-link">
                Donate
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="mt-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 shadow-lg">
              <div className="flex flex-col gap-3">
                <Link
                  to="/explore"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Campaigns
                </Link>
                <Link
                  to="/create"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Campaign
                </Link>
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Impact
                </Link>
                <div className="h-px bg-gray-100 dark:bg-gray-800" />
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-sm font-semibold text-red-500 hover:text-red-600"
                  >
                    Log Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                )}
                {!isAuthenticated && (
                  <Link
                    to="/signup"
                    className="text-sm font-semibold text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create account
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
