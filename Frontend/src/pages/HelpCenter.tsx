import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import {
  BadgeCheck,
  BookOpen,
  CreditCard,
  HeartHandshake,
  HelpCircle,
  LifeBuoy,
  Lock,
  Mail,
  Rocket,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import organizerService from '../Services/organizer';
import { useAuthStore } from '../store';
import { faqs, helpArticles, helpTopics, popularGuides, type HelpArticle } from '../data/help';

type ModalContent = {
  title: string;
  body: string[];
  meta?: Array<{ label: string; value: string }>;
};

const HelpCenter: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [identityLoading, setIdentityLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const articleMap = useMemo(() => {
    const map = new Map<string, HelpArticle>();
    helpArticles.forEach((article) => map.set(article.id, article));
    return map;
  }, []);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [] as HelpArticle[];
    return helpArticles.filter((article) => {
      const content = [article.title, article.summary, article.content.join(' '), article.tags.join(' ')].join(' ').toLowerCase();
      return content.includes(query);
    });
  }, [searchQuery]);

  useLayoutEffect(() => {
    ensureGsap();
    if (!modalContent || !overlayRef.current || !panelRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        panelRef.current,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power3.out' }
      );
    }, panelRef);

    return () => ctx.revert();
  }, [modalContent]);

  const openGuide = (guideId: string) => {
    const article = articleMap.get(guideId);
    if (!article) return;
    setModalContent({ title: article.title, body: article.content });
  };

  const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleIdentityStatus = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIdentityLoading(true);
    try {
      const response = await organizerService.status();
      const data = response.data?.data as {
        isOrganizerVerified?: boolean;
        status?: string;
        submittedAt?: string;
        reviewedAt?: string;
      } | undefined;

      if (!data?.submittedAt && !data?.isOrganizerVerified) {
        navigate('/login');
        return;
      }

      const statusLabel = data?.isOrganizerVerified
        ? 'Verified'
        : data?.status === 'pending'
          ? 'Pending review'
          : 'Submitted';

      setModalContent({
        title: 'Identity status',
        body: [
          'Your national ID is on file for verification.',
          'If you need to update your documents, visit the organizer verification page.'
        ],
        meta: [
          { label: 'Name', value: user?.name ?? 'Organizer' },
          { label: 'National ID', value: 'On file' },
          { label: 'Status', value: statusLabel },
          { label: 'Submitted', value: data?.submittedAt ? new Date(data.submittedAt).toLocaleDateString() : 'N/A' }
        ]
      });
    } catch {
      setModalContent({
        title: 'Identity status',
        body: [
          'We could not load your verification status right now.',
          'Please try again in a moment or contact support if the issue persists.'
        ]
      });
    } finally {
      setIdentityLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <div className="mb-10">
              <p className="text-primary text-sm font-bold uppercase tracking-[0.3em]">Help Center</p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">
                How can we help?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
                Find quick answers about donating, running campaigns, account access, verification, and safety. If you
                do not see what you need, contact our team anytime.
              </p>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-10">
              <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="help-search">
                Search the Help Center
              </label>
              <form className="mt-3 flex flex-col sm:flex-row gap-3" onSubmit={handleSearch}>
                <input
                  id="help-search"
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Try: receipts, verification, deadline, donations"
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition"
                >
                  Search
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                {helpTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                    onClick={() => {
                      setSearchInput(topic);
                      setSearchQuery(topic);
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {searchQuery && (
              <div className="space-y-4 mb-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Search results</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      setSearchQuery('');
                    }}
                    className="text-sm font-semibold text-gray-500 hover:text-primary"
                  >
                    Clear
                  </button>
                </div>
                {searchResults.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => openGuide(result.id)}
                        className="text-left rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 hover:border-primary/40 hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest">
                          <BookOpen className="size-3" aria-hidden="true" />
                          {result.category}
                        </div>
                        <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-white">{result.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{result.summary}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-6 text-sm text-gray-500">
                    No results found. Try different keywords or contact support at nydevofficial@gmail.com.
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                {
                  title: 'Account and Access',
                  description: 'Profile, password, email changes, and login help.',
                  icon: UserCircle
                },
                {
                  title: 'Donation Support',
                  description: 'Payment methods, receipts, refunds, and chargebacks.',
                  icon: CreditCard
                },
                {
                  title: 'Campaign Management',
                  description: 'Create, edit, verify, and update your fundraiser.',
                  icon: Rocket
                },
                {
                  title: 'Safety and Trust',
                  description: 'Reporting issues, fraud prevention, and community safety.',
                  icon: ShieldCheck
                }
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm"
                >
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <item.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-12">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Popular Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularGuides.map((guideId) => {
                  const guide = articleMap.get(guideId);
                  if (!guide) return null;
                  return (
                    <button
                      key={guide.id}
                      type="button"
                      onClick={() => openGuide(guide.id)}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 hover:border-primary/40 hover:shadow-md transition text-left"
                    >
                      <BookOpen className="size-4 text-primary" aria-hidden="true" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{guide.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                    {item.q}
                    <span className="text-primary group-open:rotate-180 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="size-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Need personal help?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                Our support team is here 24/7 to help with account access, payments, and safety concerns.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" aria-hidden="true" />
                  <a
                    href="mailto:nydevofficial@gmail.com"
                    className="hover:text-primary transition-colors"
                  >
                    nydevofficial@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = 'mailto:nydevofficial@gmail.com?subject=ImpactGive%20Issue';
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  <LifeBuoy className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Report an issue</span>
                </button>
                <button
                  type="button"
                  onClick={handleIdentityStatus}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition"
                  disabled={identityLoading}
                >
                  <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {identityLoading ? 'Checking identity...' : 'Verify identity status'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/privacy')}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  <Lock className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Security & privacy</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/protection')}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  <HeartHandshake className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Donation protection</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Safety Checklist</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-primary mt-0.5" aria-hidden="true" />
                  <span>Only donate to campaigns with clear updates and verified organizers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-primary mt-0.5" aria-hidden="true" />
                  <span>Never share your login codes or payment details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-primary mt-0.5" aria-hidden="true" />
                  <span>Report suspicious activity immediately to our trust team.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/50"
            onClick={() => setModalContent(null)}
            ref={overlayRef}
          />
          <div
            ref={panelRef}
            className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-2xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Guide</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                  {modalContent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="sr-only">Close</span>
                X
              </button>
            </div>
            {modalContent.meta && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {modalContent.meta.map((item) => (
                  <div key={item.label} className="rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-sm">
                    <p className="text-xs uppercase tracking-wider text-gray-400">{item.label}</p>
                    <p className="font-semibold text-gray-900 dark:text-white mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              {modalContent.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
