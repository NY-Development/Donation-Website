import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { useTranslation } from 'react-i18next';
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
import { faqs, helpArticles, helpTopics, popularGuides } from '../data/help';

type ModalContent = {
  title: string;
  body: string[];
  meta?: Array<{ label: string; value: string }>;
};

type LocalizedArticle = {
  id: string;
  title: string;
  summary: string;
  content: string[];
  tags: string[];
  category: string;
};

const HelpCenter: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [identityLoading, setIdentityLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const supportEmail = 'nydevofficial@gmail.com';

  const localizedArticles = useMemo<LocalizedArticle[]>(
    () =>
      helpArticles.map((article) => ({
        id: article.id,
        title: t(article.titleKey),
        summary: t(article.summaryKey),
        content: article.contentKeys.map((key) => t(key)),
        tags: article.tagKeys.map((key) => t(key)),
        category: t(article.categoryKey)
      })),
    [t]
  );

  const articleMap = useMemo(() => {
    const map = new Map<string, LocalizedArticle>();
    localizedArticles.forEach((article) => map.set(article.id, article));
    return map;
  }, [localizedArticles]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [] as LocalizedArticle[];
    return localizedArticles.filter((article) => {
      const content = [article.title, article.summary, article.content.join(' '), article.tags.join(' ')].join(' ').toLowerCase();
      return content.includes(query);
    });
  }, [localizedArticles, searchQuery]);

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
        ? t('pages.helpCenter.identity.statusVerified')
        : data?.status === 'pending'
          ? t('pages.helpCenter.identity.statusPending')
          : t('pages.helpCenter.identity.statusSubmitted');

      setModalContent({
        title: t('pages.helpCenter.identity.title'),
        body: [
          t('pages.helpCenter.identity.body.0'),
          t('pages.helpCenter.identity.body.1')
        ],
        meta: [
          { label: t('pages.helpCenter.identity.meta.name'), value: user?.name ?? t('pages.helpCenter.identity.meta.fallbackName') },
          { label: t('pages.helpCenter.identity.meta.nationalId'), value: t('pages.helpCenter.identity.meta.onFile') },
          { label: t('pages.helpCenter.identity.meta.status'), value: statusLabel },
          {
            label: t('pages.helpCenter.identity.meta.submitted'),
            value: data?.submittedAt ? new Date(data.submittedAt).toLocaleDateString() : t('pages.helpCenter.identity.meta.na')
          }
        ]
      });
    } catch {
      setModalContent({
        title: t('pages.helpCenter.identity.title'),
        body: [
          t('pages.helpCenter.identity.error.0'),
          t('pages.helpCenter.identity.error.1')
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
              <p className="text-primary text-sm font-bold uppercase tracking-[0.3em]">{t('pages.helpCenter.kicker')}</p>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-3">
                {t('pages.helpCenter.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl">
                {t('pages.helpCenter.subtitle')}
              </p>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-10">
              <label className="text-sm font-semibold text-gray-900 dark:text-white" htmlFor="help-search">
                {t('pages.helpCenter.search.label')}
              </label>
              <form className="mt-3 flex flex-col sm:flex-row gap-3" onSubmit={handleSearch}>
                <input
                  id="help-search"
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder={t('pages.helpCenter.search.placeholder')}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition"
                >
                  {t('pages.helpCenter.search.button')}
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                {helpTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                    onClick={() => {
                      const label = t(`pages.helpCenter.topics.${topic}`);
                      setSearchInput(label);
                      setSearchQuery(label);
                    }}
                  >
                    {t(`pages.helpCenter.topics.${topic}`)}
                  </button>
                ))}
              </div>
            </div>

            {searchQuery && (
              <div className="space-y-4 mb-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('pages.helpCenter.search.results')}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      setSearchQuery('');
                    }}
                    className="text-sm font-semibold text-gray-500 hover:text-primary"
                  >
                    {t('pages.helpCenter.search.clear')}
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
                    {t('pages.helpCenter.search.empty', { email: supportEmail })}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                {
                  title: t('pages.helpCenter.cards.account.title'),
                  description: t('pages.helpCenter.cards.account.body'),
                  icon: UserCircle
                },
                {
                  title: t('pages.helpCenter.cards.donations.title'),
                  description: t('pages.helpCenter.cards.donations.body'),
                  icon: CreditCard
                },
                {
                  title: t('pages.helpCenter.cards.campaigns.title'),
                  description: t('pages.helpCenter.cards.campaigns.body'),
                  icon: Rocket
                },
                {
                  title: t('pages.helpCenter.cards.safety.title'),
                  description: t('pages.helpCenter.cards.safety.body'),
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
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('pages.helpCenter.popularGuides')}</h2>
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
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('pages.helpCenter.faqsTitle')}</h2>
              {faqs.map((item) => (
                <details
                  key={item.qKey}
                  className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                    {t(item.qKey)}
                    <span className="text-primary group-open:rotate-180 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{t(item.aKey)}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="size-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('pages.helpCenter.sidebar.personalHelpTitle')}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                {t('pages.helpCenter.sidebar.personalHelpBody')}
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" aria-hidden="true" />
                  <a
                    href={`mailto:${supportEmail}`}
                    className="hover:text-primary transition-colors"
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('pages.helpCenter.sidebar.quickActions')}</h3>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `mailto:${supportEmail}?subject=ImpactGive%20Issue`;
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  <LifeBuoy className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('pages.helpCenter.sidebar.reportIssue')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleIdentityStatus}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition"
                  disabled={identityLoading}
                >
                  <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {identityLoading
                      ? t('pages.helpCenter.sidebar.identityChecking')
                      : t('pages.helpCenter.sidebar.identityStatus')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/privacy-policy')}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  <Lock className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('pages.helpCenter.sidebar.securityPrivacy')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/protection')}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-left hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  <HeartHandshake className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('pages.helpCenter.sidebar.donationProtection')}</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('pages.helpCenter.sidebar.safetyTitle')}</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-primary mt-0.5" aria-hidden="true" />
                  <span>{t('pages.helpCenter.sidebar.safetyItems.0')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-primary mt-0.5" aria-hidden="true" />
                  <span>{t('pages.helpCenter.sidebar.safetyItems.1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="size-4 text-primary mt-0.5" aria-hidden="true" />
                  <span>{t('pages.helpCenter.sidebar.safetyItems.2')}</span>
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t('pages.helpCenter.modal.guideLabel')}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                  {modalContent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="sr-only">{t('pages.helpCenter.modal.close')}</span>
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
