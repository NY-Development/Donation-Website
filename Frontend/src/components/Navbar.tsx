import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { addHoverScale, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { Globe, HeartHandshake, Lock, Menu, Moon, Sun, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../store/apiHelpers';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode }) => {
  const { t, i18n } = useTranslation();
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
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const profileInitial = user?.name?.trim()?.[0]?.toUpperCase() || user?.email?.trim()?.[0]?.toUpperCase() || 'U';
  const profileImage = user?.profileImage?.trim() || '';
  const hasProfileImage = Boolean(profileImage);

  const openProfileModal = () => {
    setProfileError(null);
    setProfileName(user?.name ?? '');
    setProfileEmail(user?.email ?? '');
    setProfileImageFile(null);
    setProfileImagePreview(profileImage || null);
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
        email: profileEmail.trim(),
        profileImage: profileImageFile ?? undefined
      });
      if (success) {
        setIsProfileOpen(false);
      } else {
        setProfileError(t('navbar.profile.updateError'));
      }
    } catch (error) {
      setProfileError(getErrorMessage(error));
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!profileImageFile) {
      return;
    }

    const previewUrl = URL.createObjectURL(profileImageFile);
    setProfileImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [profileImageFile]);

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
    const nextLanguage = i18n.language.startsWith('am') ? 'en' : 'am';
    return (
      <header ref={navRef} className="sticky top-0 z-50 w-full bg-white dark:bg-surface-dark border-b border-[#ede7f3] dark:border-gray-800">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-4" data-animate="nav-link">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
              <HeartHandshake className="size-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
              {t('common.brand')}
            </h2>
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                i18n.changeLanguage(nextLanguage);
                localStorage.setItem('impact:lang', nextLanguage);
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              aria-label={t('language.label')}
              data-animate="nav-link"
            >
              <span className="sr-only">{t('language.label')}</span>
              <div className="flex items-center gap-2 text-xs font-bold">
                <Globe className="size-4" aria-hidden="true" />
                <span>{t('language.toggle')}</span>
              </div>
            </button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" data-animate="nav-link">
              {isDarkMode ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ede7f3] dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white">
              <Lock className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t('navbar.secureVerification')}</span>
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
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
              {t('common.brand')}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-semibold text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/explore" data-animate="nav-link">{t('navbar.campaigns')}</Link>
            <Link className="text-sm font-semibold text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/create" data-animate="nav-link">{t('navbar.startCampaign')}</Link>
            <Link className="text-sm font-semibold text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/dashboard" data-animate="nav-link">{t('navbar.myImpact')}</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const nextLanguage = i18n.language.startsWith('am') ? 'en' : 'am';
                i18n.changeLanguage(nextLanguage);
                localStorage.setItem('impact:lang', nextLanguage);
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              aria-label={t('language.label')}
              data-animate="nav-link"
            >
              <span className="sr-only">{t('language.label')}</span>
              <div className="flex items-center gap-2 text-xs font-bold">
                <Globe className="size-4" aria-hidden="true" />
                <span>{t('language.toggle')}</span>
              </div>
            </button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300" data-animate="nav-link">
              {isDarkMode ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
            </button>
            {isAuthenticated ? (
              <button 
              onClick={() => {logout()}}
              className="hidden sm:flex items-center justify-center h-9 px-4 rounded-lg text-white bg-red-500 dark:bg-red-600 dark:text-white text-sm font-bold hover:bg-red-600 dark:hover:bg-gray-700 transition-colors" data-animate="nav-link">
                {t('navbar.logOut')}
              </button>
            ) : (
              <Link to="/login" className="hidden sm:flex items-center justify-center h-9 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" data-animate="nav-link">
                {t('navbar.logIn')}
              </Link>
            )}
            {isAuthenticated ? (
              <div className="relative hidden md:flex items-center" data-animate="nav-link">
                <button
                  type="button"
                  onClick={openProfileModal}
                  className="flex items-center justify-center size-9 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary-hover transition-colors overflow-hidden"
                  aria-label="Open profile"
                >
                  {hasProfileImage ? (
                    <img
                      src={profileImage}
                      alt={user?.name ?? 'User'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profileInitial
                  )}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('navbar.profile.title')}</h3>
                      <button
                        type="button"
                        onClick={closeProfileModal}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <span className="sr-only">{t('common.close')}</span>
                        X
                      </button>
                    </div>
                    <form className="space-y-4" onSubmit={submitProfile}>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold overflow-hidden">
                          {profileImagePreview ? (
                            <img src={profileImagePreview} alt={profileName || 'Profile'} className="h-full w-full object-cover" />
                          ) : (
                            profileInitial
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => setProfileImageFile(event.target.files?.[0] ?? null)}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary"
                          >
                            {t('navbar.profile.changePhoto')}
                          </button>
                          {profileImageFile && (
                            <span className="text-xs text-gray-500">{profileImageFile.name}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('navbar.profile.name')}</label>
                        <input
                          className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                          type="text"
                          value={profileName}
                          onChange={(event) => setProfileName(event.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('navbar.profile.email')}</label>
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
                          {t('navbar.profile.cancel')}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold"
                          disabled={profileLoading}
                          aria-busy={profileLoading}
                        >
                          {profileLoading ? t('navbar.profile.saving') : t('navbar.profile.save')}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/explore" className="hidden md:flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30" data-animate="nav-link">
                {t('navbar.donate')}
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
                  {t('navbar.campaigns')}
                </Link>
                <Link
                  to="/create"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navbar.startCampaign')}
                </Link>
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navbar.myImpact')}
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
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navbar.createAccount')}
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
