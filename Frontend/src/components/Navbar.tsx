import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { addHoverScale, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import {
  Compass,
  Globe,
  HeartHandshake,
  Home,
  LayoutDashboard,
  Lock,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
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
  const lastScrollY = useRef(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
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

  const profileInitial =
    user?.name?.trim()?.[0]?.toUpperCase() ||
    user?.email?.trim()?.[0]?.toUpperCase() ||
    'U';

  const profileImage = user?.profileImage?.trim() || '';
  const hasProfileImage = Boolean(profileImage);

  /* ===============================
     Scroll Hide / Show
  =============================== */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      const delta = currentY - lastScrollY.current;

      if (currentY < 20) setIsNavVisible(true);
      else if (delta > 8) setIsNavVisible(false);
      else if (delta < -8) setIsNavVisible(true);

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ===============================
     GSAP Entry
  =============================== */
  useLayoutEffect(() => {
    ensureGsap();
    if (!navRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        autoAlpha: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.out',
      });
    }, navRef);

    const cleanupHover = addHoverScale(
      gsap.utils.toArray('[data-animate="nav-link"]', navRef.current),
      1.05
    );

    return () => {
      cleanupHover();
      ctx.revert();
    };
  }, []);

  /* ===============================
     Profile Modal Helpers
  =============================== */
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
        profileImage: profileImageFile ?? undefined,
      });

      if (success) setIsProfileOpen(false);
      else setProfileError(t('navbar.profile.updateError'));
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

  if (isAdmin) return null;

  const navItems = [
    { to: '/', label: t('navbar.home'), icon: Home },
    { to: '/explore', label: t('navbar.explore'), icon: Compass },
    { to: '/dashboard', label: t('navbar.dashboard'), icon: LayoutDashboard },
  ];

  /* ===================================================
      MAIN NAVBAR
  =================================================== */
  return (
    <>
      <motion.nav
        ref={navRef}
        animate={{ opacity: isNavVisible ? 1 : 0, y: isNavVisible ? 0 : -12 }}
        transition={{ duration: 0.4 }}
        className="flex mt-6 left-4 right-4 -translate-x-1/2 z-50s max- mx-auto"
      >
        <div className="rounded-3xl border border-white/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] px-6 py-3 justify-center items-center">
          <div className="flex items-center justify-center gap-6">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 font-black text-lg">
              <div className="size-9 rounded-xl bg-primary text-white flex items-center justify-center">
                <HeartHandshake className="size-5" />
              </div>
              <span className="hidden sm:inline text-gray-900 dark:text-white">
                {t('common.brand')}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-animate="nav-link"
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">

              {/* Language Globe */}
              <button
                onClick={() => {const nextLang = i18n.language.startsWith('am') ? 'en' : 'am';
                      i18n.changeLanguage(nextLang);}
                }
                className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800"
              >
                <Globe size={18} />
              </button>

              {/* Theme */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <button
                  onClick={openProfileModal}
                  className="size-9 rounded-full bg-primary text-white font-bold overflow-hidden"
                >
                  {hasProfileImage ? (
                    <img src={profileImage} className="w-full h-full object-cover" />
                  ) : (
                    profileInitial
                  )}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-block px-5 py-2 rounded-full bg-primary text-white font-bold"
                >
                  {t('navbar.logIn')}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ===============================
          MOBILE CENTERED GLASS MENU
      =============================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[90%] max-w-md rounded-[2.5rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black">
                  {t('common.brand')}
                </h3>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100 dark:bg-white/5 font-bold"
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </Link>
                  );
                })}

                {isAuthenticated ? (
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 text-red-500 font-bold"
                  >
                    <LogOut />
                    {t('navbar.logOut')}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-4 rounded-2xl bg-primary text-white text-center font-bold"
                  >
                    {t('navbar.logIn')}
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFILE MODAL (UNCHANGED) */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProfileModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-[2.5rem] bg-white dark:bg-gray-900 p-8 shadow-2xl"
            >
              <div className="flex justify-between mb-6">
                <h3 className="text-2xl font-black">
                  {t('navbar.profile.title')}
                </h3>
                <button onClick={closeProfileModal}>
                  <X />
                </button>
              </div>

              <form onSubmit={submitProfile} className="space-y-4">
                <input
                  className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
                <input
                  className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold"
                >
                  {t('navbar.profile.save')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;