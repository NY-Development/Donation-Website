
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { gsap } from 'gsap';
import { addHoverScale, animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { useAuthStore } from '../store';
import { Eye, EyeOff, Lock, Mail, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const user = useAuthStore((state) => state.user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const schema = z.object({
      email: z.string().email(t('pages.auth.login.validation.email')),
      password: z.string().min(8, t('pages.auth.login.validation.password'))
    });
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      return;
    }

    const success = await login(parsed.data);
    if (success) {
      const role = useAuthStore.getState().user?.role;
      navigate(role === 'admin' ? '/admin' : '/dashboard');
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
          stagger: 0.06,
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
      <div className="w-full max-w-[1000px] bg-white dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800" data-animate="section">
        <div className="md:w-1/2 relative min-h-[400px]" data-animate="section">
          <img 
            src="./image.png"
            alt={t('pages.auth.login.communityAlt')} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-10 text-white">
            <Quote className="size-10 mb-4" aria-hidden="true" />
            <p className="text-2xl font-bold leading-tight mb-4">{t('pages.auth.login.quote')}</p>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full border-2 border-white/50 bg-gray-200 bg-cover bg-center" style={{ backgroundImage: 'url("./yitbarek.jpg")' }}></div>
              <div>
                <p className="text-sm font-bold">{t('pages.auth.login.quoteName')}</p>
                <p className="text-xs opacity-70">{t('pages.auth.login.quoteRole')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center" data-animate="section">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">{t('pages.auth.login.welcome')}</h1>
            <p className="text-gray-500 mb-8">{t('pages.auth.login.subtitle')}</p>

            {authError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {authError}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6" data-animate="form">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('pages.auth.login.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder="name@example.com"
                    type="email"
                    required
                    data-animate="input"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (authError) clearError();
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('pages.auth.login.password')}</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">{t('pages.auth.login.forgot')}</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
                  <input
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    required
                    data-animate="input"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (authError) clearError();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    aria-label={showPassword ? t('pages.auth.login.hidePassword') : t('pages.auth.login.showPassword')}
                  >
                    {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-500">{t('pages.auth.login.remember')}</label>
              </div>

              <button
                className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70"
                data-animate="button"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? t('pages.auth.login.signingIn') : t('pages.auth.login.signIn')}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {t('pages.auth.login.noAccount')} <Link to="/signup" className="text-primary font-bold hover:underline">{t('pages.auth.login.signUp')}</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
