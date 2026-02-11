
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { addHoverScale, animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { useAuthStore } from '../store';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    if (trimmedName.length < 3) {
      setFormError('Please enter your full name.');
      return;
    }

    const success = await register({ name: trimmedName, email, password });
    if (success) {
      navigate('/dashboard');
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
              <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">Join the Movement</h1>
              <p className="text-lg text-white/90 font-medium leading-relaxed">
                Become part of a community dedicated to making a real difference.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-white/10">
                  <span className="material-symbols-outlined text-white">insights</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Track Impact</h3>
                  <p className="text-sm text-white/80 leading-normal">
                    Visualize where your money goes and the lives you change in real-time.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-white/10">
                  <span className="material-symbols-outlined text-white">receipt_long</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Instant Receipts</h3>
                  <p className="text-sm text-white/80 leading-normal">
                    Automated tax receipts for every donation, organized in one place.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 p-2 rounded-lg bg-white/10">
                  <span className="material-symbols-outlined text-white">bolt</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Quick Donate</h3>
                  <p className="text-sm text-white/80 leading-normal">
                    Support your favorite causes with a single click, anytime, anywhere.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-white/60 italic">
                "The best platform for managing my philanthropic goals. Simple, transparent, and effective."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden">
                  <img
                    alt="User avatar"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFPhwJ9jwi4K2_uR-cwL7w2rpPm7GPBp_VYbxdKPNz4aPJtVE8adWlTaA2OWoCaBZ0kStkROVWyTl9wtHYABoqkQt7vGRLXAhOyO933EJwtRkXzQYRZGDgNYGM4EqVqnOiHe-2J3dVP1oEb2HFz_iOtHsw6iEK9D456g2am__n9bF4qOPA2a0PyuPXQWD_QKUay3_WlPnzM2vTPhAYSjoQ_cgExTmMTbwYmDpD71NdmwR81Q0Q71IMKm2qYwq9Q9le1JLlVI8Ti66j"
                  />
                </div>
                <span className="text-sm font-semibold">Sarah J., Donor since 2021</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-7/12 flex flex-col justify-center items-center bg-background-light dark:bg-background-dark p-6 lg:p-20 overflow-y-auto" data-animate="section">
          <div className="w-full max-w-120 flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-2">
              <h2 className="text-[#140d1b] dark:text-white text-3xl font-bold leading-tight tracking-tight">Create your account</h2>
              <p className="text-[#734c9a] dark:text-[#a58dc2] text-base">Start your journey of giving today.</p>
            </div>

            {(formError || authError) && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError || authError}
              </div>
            )}

            <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full" data-animate="form">
              <div className="flex flex-col gap-2">
                <label className="text-[#140d1b] dark:text-white text-sm font-medium leading-normal" htmlFor="fullname">Full Name</label>
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
                <label className="text-[#140d1b] dark:text-white text-sm font-medium leading-normal" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#140d1b] dark:text-white dark:bg-[#2a1f36] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbcfe7] dark:border-[#4a3b5a] bg-white focus:border-primary h-12 placeholder:text-[#734c9a]/60 dark:placeholder:text-[#a58dc2]/60 px-4 text-base font-normal leading-normal transition-all duration-200"
                  placeholder="e.g. jane@example.com"
                  type="email"
                  required
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
                <label className="text-[#140d1b] dark:text-white text-sm font-medium leading-normal" htmlFor="password">Password</label>
                <div className="relative flex w-full items-center">
                  <input
                    id="password"
                    className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#140d1b] dark:text-white dark:bg-[#2a1f36] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbcfe7] dark:border-[#4a3b5a] bg-white focus:border-primary h-12 placeholder:text-[#734c9a]/60 dark:placeholder:text-[#a58dc2]/60 pl-4 pr-12 text-base font-normal leading-normal transition-all duration-200"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    required
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
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
                <p className="text-xs text-[#734c9a] dark:text-[#a58dc2] mt-1">Must be at least 8 characters long.</p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <label className="inline-flex items-start gap-3 cursor-pointer group">
                  <input className="form-checkbox mt-1 h-4 w-4 rounded border-[#dbcfe7] dark:border-[#4a3b5a] dark:bg-[#2a1f36] text-primary focus:ring-primary/50 transition duration-150 ease-in-out" type="checkbox" />
                  <span className="text-sm text-[#140d1b] dark:text-white/90 leading-normal select-none">
                    Subscribe to inspiring impact stories and weekly updates.
                  </span>
                </label>
                <label className="inline-flex items-start gap-3 cursor-pointer group">
                  <input className="form-checkbox mt-1 h-4 w-4 rounded border-[#dbcfe7] dark:border-[#4a3b5a] dark:bg-[#2a1f36] text-primary focus:ring-primary/50 transition duration-150 ease-in-out" type="checkbox" required />
                  <span className="text-sm text-[#140d1b] dark:text-white/90 leading-normal select-none">
                    I agree to the <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a> and <a className="text-primary hover:underline font-medium" href="#">Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <button
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-lg transition-colors duration-200 shadow-lg shadow-primary/20 mt-4 flex items-center justify-center gap-2"
                type="submit"
                data-animate="button"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm text-[#140d1b] dark:text-white/70">
                Already have an account?{' '}
                <Link className="text-primary font-bold hover:underline transition-colors" to="/login">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;