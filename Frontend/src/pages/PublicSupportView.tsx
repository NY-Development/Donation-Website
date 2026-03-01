import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Globe, Languages, Loader2, MessageSquareText } from 'lucide-react';
import supportService from '../Services/support';
import { getApiData, getErrorMessage } from '../store/apiHelpers';

type PublicSupportResponse = {
  id: string;
  subject: string;
  message: string;
  adminName?: string;
  repliedAt?: string;
  createdAt: string;
  hasReply: boolean;
};

type TranslateResponse = {
  responseData?: {
    translatedText?: string;
  };
};

const supportedLanguages = ['en', 'am', 'om'] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

const PublicSupportView: React.FC = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const [translatedBody, setTranslatedBody] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    const [langPart, userIdPart] = (slug ?? '').split('@');
    const normalizedLang = (langPart ?? '').toLowerCase();

    const lang = supportedLanguages.includes(normalizedLang as SupportedLanguage)
      ? (normalizedLang as SupportedLanguage)
      : 'en';

    return {
      lang,
      userId: userIdPart ?? '',
      isValid: Boolean(langPart && userIdPart)
    };
  }, [slug]);

  useEffect(() => {
    void i18n.changeLanguage(parsed.lang);
    localStorage.setItem('impact:lang', parsed.lang);
  }, [i18n, parsed.lang]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['support', 'public', parsed.userId],
    enabled: parsed.isValid,
    queryFn: async () => {
      const response = await supportService.getPublicByUserId(parsed.userId);
      return getApiData<PublicSupportResponse>(response);
    }
  });

  const handleTranslate = async () => {
    if (!data?.message || parsed.lang === 'en') return;

    try {
      setIsTranslating(true);
      setTranslateError(null);

      const targetLang = parsed.lang;
      const endpoint = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(data.message)}&langpair=en|${targetLang}`;
      const response = await fetch(endpoint);
      const payload = (await response.json()) as TranslateResponse;

      const translatedText = payload.responseData?.translatedText?.trim();
      if (!translatedText) {
        throw new Error('Translation unavailable');
      }

      setTranslatedBody(translatedText);
    } catch {
      setTranslateError(t('pages.publicSupport.translateError', 'Translation failed. Please try again.'));
    } finally {
      setIsTranslating(false);
    }
  };

  if (!parsed.isValid) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <p className="text-sm text-red-600 dark:text-red-400">{t('pages.publicSupport.invalidLink', 'Invalid support link.')}</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="size-4" />
            {t('pages.publicSupport.returnHome', 'Return to Home')}
          </Link>
        </div>
      </div>
    );
  }

  const visibleMessage = translatedBody ?? data?.message ?? '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Globe className="size-5" />
            </div>
            <div>
              <p className="text-sm font-black">{t('pages.publicSupport.platform', 'Donations Platform')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('pages.publicSupport.supportResponse', 'Support Response')}</p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="size-4" />
            {t('pages.publicSupport.returnHome', 'Return to Home')}
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                {t('pages.publicSupport.ticketId', { id: parsed.userId, defaultValue: 'Ticket: {{id}}' })}
              </p>
              <h1 className="mt-1 text-lg sm:text-xl font-extrabold">{data?.subject ?? t('pages.publicSupport.loadingTitle', 'Loading support message...')}</h1>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <Languages className="size-3.5" />
              {t('pages.publicSupport.languageTag', { lang: parsed.lang.toUpperCase(), defaultValue: 'Language: {{lang}}' })}
            </div>
          </div>

          <div className="px-5 sm:px-7 py-6">
            {isLoading && (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" />
                {t('pages.publicSupport.loading', 'Fetching your support response...')}
              </div>
            )}

            {isError && (
              <p className="text-sm text-red-600 dark:text-red-400">{getErrorMessage(error) || t('pages.publicSupport.error', 'Unable to fetch support response.')}</p>
            )}

            {!isLoading && !isError && data && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/40">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('pages.publicSupport.adminName', 'Admin Name')}</p>
                    <p className="mt-1 font-semibold">{data.adminName ?? t('pages.publicSupport.supportTeam', 'Support Team')}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/40">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('pages.publicSupport.sentAt', 'Sent At')}</p>
                    <p className="mt-1 font-semibold">{new Date(data.repliedAt ?? data.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-white dark:bg-slate-950/30">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('pages.publicSupport.messageBody', 'Message')}</p>
                    {parsed.lang !== 'en' && (
                      <button
                        type="button"
                        onClick={handleTranslate}
                        disabled={isTranslating}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-60"
                      >
                        {isTranslating ? <Loader2 className="size-3.5 animate-spin" /> : <Languages className="size-3.5" />}
                        {isTranslating
                          ? t('pages.publicSupport.translating', 'Translating...')
                          : t('pages.publicSupport.aiTranslate', 'AI Translate')}
                      </button>
                    )}
                  </div>

                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                    {visibleMessage || t('pages.publicSupport.emptyMessage', 'No message available.')}
                  </div>

                  {translateError && <p className="mt-3 text-xs text-red-600 dark:text-red-400">{translateError}</p>}
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50 dark:bg-amber-950/20 p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <MessageSquareText className="size-4 mt-0.5 shrink-0" />
                  <p>{t('pages.publicSupport.disclaimer', 'Donations Platform is a SaaS intermediary. We do not hold funds directly.')}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicSupportView;
