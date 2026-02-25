
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { gsap } from 'gsap';
import { addHoverScale, animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { useAuthStore } from '../store';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';

const Signup: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [wantsOrganizer, setWantsOrganizer] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const schema = z.object({
      name: z.string().min(3, t('pages.auth.signup.validation.name')),
      email: z.string().email(t('pages.auth.signup.validation.email')),
      password: z.string().min(8, t('pages.auth.signup.validation.password'))
    });

    const parsed = schema.safeParse({ name: fullName.trim(), email, password });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? t('pages.auth.signup.validation.fallback'));
      return;
    }

    const success = await register({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: wantsOrganizer ? 'organizer' : undefined
    });
    if (success) {
      navigate(`/verify-otp?email=${encodeURIComponent(parsed.data.email)}`);
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
    <div ref={containerRef} className="min-h-screen w-full bg-background-light dark:bg-background-dark text-[#140d1b] dark:text-white flex flex-col">
      <div className="flex flex-col lg:flex-row min-h-screen w-full">
        <div className="relative w-full lg:w-5/12 bg-primary flex flex-col justify-center items-center overflow-hidden p-8 lg:p-12 text-white" data-animate="section">
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary to-primary/80 mix-blend-multiply" aria-hidden="true" />
          <div className="relative z-10 flex flex-col gap-8 max-w-md">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm mb-2">
                <span className="material-symbols-outlined text-3xl text-white">volunteer_activism</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">{t('pages.auth.signup.heroTitle')}</h1>
              <p className="text-lg text-white/90 font-medium leading-relaxed">
                {t('pages.auth.signup.heroSubtitle')}
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-white/10">
                  <span className="material-symbols-outlined text-white">insights</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t('pages.auth.signup.benefit1Title')}</h3>
                  <p className="text-sm text-white/80 leading-normal">
                    {t('pages.auth.signup.benefit1Body')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-white/10">
                  <span className="material-symbols-outlined text-white">receipt_long</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t('pages.auth.signup.benefit2Title')}</h3>
                  <p className="text-sm text-white/80 leading-normal">
                    {t('pages.auth.signup.benefit2Body')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-white/10">
                  <span className="material-symbols-outlined text-white">bolt</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t('pages.auth.signup.benefit3Title')}</h3>
                  <p className="text-sm text-white/80 leading-normal">
                    {t('pages.auth.signup.benefit3Body')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-white/60 italic">
                {t('pages.auth.signup.testimonial')}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden">
                  <img
                    alt="User avatar"
                    className="w-full h-full object-cover"
                    src="/yitbarek.jpg"
                  />
                </div>
                <span className="text-sm font-semibold">{t('pages.auth.login.quoteName')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-7/12 flex flex-col justify-center items-center bg-background-light dark:bg-background-dark p-6 lg:p-20 overflow-y-auto" data-animate="section">
          <div className="w-full max-w-120 flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <h2 className="text-[#140d1b] dark:text-white text-3xl font-bold leading-tight tracking-tight">{t('pages.auth.signup.formTitle')}</h2>
              <p className="text-[#734c9a] dark:text-[#a58dc2] text-base">{t('pages.auth.signup.formSubtitle')}</p>
            </div>

            {(formError || authError) && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError || authError}
              </div>
            )}

            <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full" data-animate="form">
              <div className="flex flex-col gap-2">
                <label className="text-[#140d1b] dark:text-white text-sm font-medium leading-normal" htmlFor="fullname">{t('pages.auth.signup.fullName')}</label>
                <input
                  id="fullname"
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#140d1b] dark:text-white dark:bg-[#2a1f36] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbcfe7] dark:border-[#4a3b5a] bg-white focus:border-primary h-12 placeholder:text-[#734c9a]/60 dark:placeholder:text-[#a58dc2]/60 px-4 text-base font-normal leading-normal transition-all duration-200"
                  placeholder="e.g. Jane Doe"
                  type="text"
                  required
                  data-animate="input"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    if (formError) setFormError(null);
                    if (authError) clearError();
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#140d1b] dark:text-white text-sm font-medium leading-normal" htmlFor="email">{t('pages.auth.signup.email')}</label>
                <input
                  id="email"
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#140d1b] dark:text-white dark:bg-[#2a1f36] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbcfe7] dark:border-[#4a3b5a] bg-white focus:border-primary h-12 placeholder:text-[#734c9a]/60 dark:placeholder:text-[#a58dc2]/60 px-4 text-base font-normal leading-normal transition-all duration-200"
                  placeholder="e.g. jane@example.com"
                  type="email"
                  required
                  auto-Complete="email"
                  data-animate="input"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (formError) setFormError(null);
                    if (authError) clearError();
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#140d1b] dark:text-white text-sm font-medium leading-normal" htmlFor="password">{t('pages.auth.signup.password')}</label>
                <div className="relative flex w-full items-center">
                  <input
                    id="password"
                    className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-white dark:text-white dark:bg-[#2a1f36] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbcfe7] dark:border-[#4a3b5a] bg-white focus:border-primary h-12 placeholder:text-[#734c9a] dark:placeholder:text-[#a58dc2] pl-4 pr-12 text-base font-normal leading-normal transition-all duration-200"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    auto-Complete="new-password"
                    data-animate="input"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (formError) setFormError(null);
                      if (authError) clearError();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-0 top-0 h-full px-3 text-[#734c9a] dark:text-[#a58dc2] hover:text-primary transition-colors flex items-center justify-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-[#734c9a] dark:text-[#a58dc2] mt-1">{t('pages.auth.signup.passwordHint')}</p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <label className="inline-flex items-start gap-3 cursor-pointer group">
                  <input
                    className="form-checkbox mt-1 h-4 w-4 rounded border-[#dbcfe7] dark:border-[#4a3b5a] dark:bg-[#2a1f36] text-primary focus:ring-primary/50 transition duration-150 ease-in-out"
                    type="checkbox"
                    checked={wantsOrganizer}
                    onChange={(event) => setWantsOrganizer(event.target.checked)}
                  />
                  <span className="text-sm text-[#140d1b] dark:text-white/90 leading-normal select-none">
                    {t('pages.auth.signup.organizerOptIn')}
                  </span>
                </label>
                {/* <label className="inline-flex items-start gap-3 cursor-pointer group">
                  <input className="form-checkbox mt-1 h-4 w-4 rounded border-[#dbcfe7] dark:border-[#4a3b5a] dark:bg-[#2a1f36] text-primary focus:ring-primary/50 transition duration-150 ease-in-out" type="checkbox" />
                  <span className="text-sm text-[#140d1b] dark:text-white/90 leading-normal select-none">
                    {t('pages.auth.signup.newsletterOptIn')}
                  </span>
                </label> */}
                <label className="inline-flex items-start gap-3 cursor-pointer group">
                  <input className="form-checkbox mt-1 h-4 w-4 rounded border-[#dbcfe7] dark:border-[#4a3b5a] dark:bg-[#2a1f36] text-primary focus:ring-primary/50 transition duration-150 ease-in-out" type="checkbox" required />
                  <span className="text-sm text-[#140d1b] dark:text-white/90 leading-normal select-none">
                    {t('pages.auth.signup.termsAgree')} <Link className="text-primary hover:underline font-medium" to="/terms">{t('pages.auth.signup.terms')}</Link> and <Link className="text-primary hover:underline font-medium" to="/privacy">{t('pages.auth.signup.privacy')}</Link>.
                  </span>
                </label>
              </div>

              <button
                className={`cursor-pointer ${isLoading && 'cursor-not-allowed'} w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-lg transition-colors duration-200 shadow-lg shadow-primary/20 mt-4 flex items-center justify-center gap-2`}
                type="submit"
                data-animate="button"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? t('pages.auth.signup.creatingAccount') : t('pages.auth.signup.createAccount')}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-[#140d1b] dark:text-white/70">
                {t('pages.auth.signup.haveAccount')}{' '}
                <Link className="text-primary font-bold hover:underline transition-colors" to="/login">{t('pages.auth.signup.signIn')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;