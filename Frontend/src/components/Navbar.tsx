import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { addHoverScale, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { Compass, Globe, HeartHandshake, Home, LayoutDashboard, Lock, Moon, Sun, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../store/apiHelpers';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
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
    if (!profileImageFile) return;
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
            >
              <Globe className="size-4" />
            </button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ede7f3] dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white">
              <Lock className="size-4" />
              <span className="hidden sm:inline">{t('navbar.secureVerification')}</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  if (isAdmin) return null;

  const navItems = [
    { to: '/', label: t('navbar.home'), icon: Home, match: (path: string) => path === '/' },
    { to: '/explore', label: t('navbar.explore'), icon: Compass, match: (path: string) => path.startsWith('/explore') },
    { to: '/donate', label: t('navbar.donate'), icon: HeartHandshake, match: (path: string) => path.startsWith('/donate') },
    { to: '/dashboard', label: t('navbar.dashboard'), icon: LayoutDashboard, match: (path: string) => path.startsWith('/dashboard') }
  ];

  return (
    <>
      <motion.nav
        ref={navRef}
        layout
        transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
        className={`fixed z-50 transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'top-6 right-6 left-6 rounded-[2rem]' 
            : 'top-6 right-6 md:left-1/2 md:-translate-x-1/2 md:w-[90%] md:max-w-6xl rounded-full'
        } border border-white/20 bg-white/80 dark:bg-gray-900/80 px-2 py-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-[16px]`}
      >
        <div className="flex items-center justify-between w-full px-2">
          {/* Logo - Desktop only or Mobile expanded */}
          <Link to="/" className={`flex items-center gap-3 ${!isMobileMenuOpen && 'hidden md:flex'}`}>
            <div className="size-8 rounded-lg bg-violet-700 text-white flex items-center justify-center">
              <HeartHandshake className="size-4" />
            </div>
            <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white">
              {t('common.brand')}
            </span>
          </Link>

          {/* Desktop Central Navigation */}
          <div 
            className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-full"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            {navItems.map((item) => {
              const isActive = item.match(location.pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
                    isActive ? 'bg-violet-700 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-violet-700 dark:hover:text-white'
                  }`}
                >
                  <Icon className="size-4" />
                  <motion.span
                    initial={false}
                    animate={{ width: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                const nextLang = i18n.language.startsWith('am') ? 'en' : 'am';
                i18n.changeLanguage(nextLang);
                localStorage.setItem('impact:lang', nextLang);
              }}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <Globe className="size-4" />
            </button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
            {isAuthenticated ? (
              <button onClick={openProfileModal} className="size-9 rounded-full bg-violet-700 text-white font-bold text-sm overflow-hidden shadow-sm">
                {hasProfileImage ? <img src={profileImage} className="h-full w-full object-cover" /> : profileInitial}
              </button>
            ) : (
              <Link to="/login" className="px-5 py-2 rounded-full bg-violet-700 text-white text-sm font-bold hover:bg-violet-800 transition-all">
                {t('navbar.logIn')}
              </Link>
            )}
          </div>

          {/* Mobile Toggle Button (The "Only Icon" entry point) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-3 md:hidden rounded-full transition-colors ${isMobileMenuOpen ? 'bg-gray-100 dark:bg-gray-800' : 'text-gray-900 dark:text-white'}`}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Expanded Menu Content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden px-4 pb-6 pt-2 overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-2 mb-6">
                {navItems.map((item) => {
                  const isActive = item.match(location.pathname);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        isActive ? 'bg-violet-700 text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="size-5" />
                      <span className="font-bold">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-3xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">{t('common.toggleTheme')}</span>
                  <button onClick={toggleDarkMode} className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                    {isDarkMode ? <Sun className="size-5 text-yellow-500" /> : <Moon className="size-5 text-violet-700" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">{t('language.label')}</span>
                  <button
                    onClick={() => {
                      const nextLang = i18n.language.startsWith('am') ? 'en' : 'am';
                      i18n.changeLanguage(nextLang);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm text-sm font-bold"
                  >
                    <Globe className="size-4" />
                    {i18n.language.toUpperCase()}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <button onClick={openProfileModal} className="flex items-center gap-3 p-4 rounded-2xl bg-violet-700 text-white font-bold">
                      <div className="size-8 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                        {hasProfileImage ? <img src={profileImage} className="h-full w-full object-cover" /> : profileInitial}
                      </div>
                      {t('navbar.profile.title')}
                    </button>
                    <button onClick={() => logout()} className="flex items-center gap-3 p-4 rounded-2xl text-red-500 font-bold bg-red-50 dark:bg-red-500/10">
                      <LogOut className="size-5" />
                      {t('navbar.logOut')}
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="p-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-center font-bold">
                      {t('navbar.logIn')}
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="p-4 rounded-2xl bg-violet-700 text-white text-center font-bold">
                      {t('navbar.createAccount')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeProfileModal} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md rounded-[2.5rem] bg-white dark:bg-gray-900 p-8 shadow-2xl overflow-hidden">
               {/* Modal Content - Kept the same but applied rounded style */}
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t('navbar.profile.title')}</h3>
                  <button onClick={closeProfileModal} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X /></button>
               </div>
               <form className="space-y-6" onSubmit={submitProfile}>
                  <div className="flex items-center gap-6">
                    <div className="size-20 rounded-3xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center overflow-hidden">
                      {profileImagePreview ? <img src={profileImagePreview} className="h-full w-full object-cover" /> : <span className="text-2xl font-bold text-violet-700">{profileInitial}</span>}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-violet-700 underline">
                      {t('navbar.profile.changePhoto')}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setProfileImageFile(e.target.files?.[0] ?? null)} />
                  </div>
                  <div className="space-y-4">
                    <input className="w-full rounded-2xl border-none bg-gray-100 dark:bg-gray-800 px-6 py-4 font-medium dark:text-white" type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder={t('navbar.profile.name')} />
                    <input className="w-full rounded-2xl border-none bg-gray-100 dark:bg-gray-800 px-6 py-4 font-medium dark:text-white" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder={t('navbar.profile.email')} />
                  </div>
                  {profileError && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold">{profileError}</div>}
                  <div className="flex gap-3">
                    <button type="button" onClick={closeProfileModal} className="flex-1 py-4 font-bold text-gray-500">{t('navbar.profile.cancel')}</button>
                    <button type="submit" className="flex-1 py-4 rounded-2xl bg-violet-700 text-white font-bold" disabled={profileLoading}>{profileLoading ? t('navbar.profile.saving') : t('navbar.profile.save')}</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;