import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Mail, MapPin, Megaphone, Phone, Share2 } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased">
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="max-w-lg">
              <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight mb-4">
                {t('pages.contact.titlePrefix', 'Contact Our')} <span className="text-primary">{t('pages.contact.titleHighlight', 'Team')}</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  'pages.contact.subtitle',
                  "We're here to help and answer any question you might have. Your support fuels our mission for global impact."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="group">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{t('pages.contact.email.title', 'Email Us')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('pages.contact.email.value', 'support@socialimpact.org')}</p>
              </div>

              <div className="group">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{t('pages.contact.phone.title', 'Call Us')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('pages.contact.phone.value', '+1 (555) 000-0000')}</p>
              </div>

              <div className="group sm:col-span-2">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <MapPin className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{t('pages.contact.address.title', 'Visit HQ')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('pages.contact.address.value', '123 Impact Way, San Francisco, CA 94103')}
                </p>
              </div>
            </div>

            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <div
                  className="w-full h-full bg-cover bg-center opacity-80"
                  role="img"
                  aria-label={t('pages.contact.mapAlt', 'Stylized map showing our headquarters location')}
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvYYu_KC7fj0pBPFbLUVVh3SLqsiRFFiXzE7DSyl5-S_3zy26b9jT__oZbI0orD2VJtzMUQ-VnVEjpaVJBn-qsAEM-nJjY0J7yJ3ai6rB5IOPNtRpdExYv1Aau63vjdRnrnDvIrT1TllpnZmFb4Mu_V5bjleg2V4SDZ8FNs2ENdIMqvWuVemui2-XVfJnQvait4yidjJhrd-L9BKysyCgm9E13lmVVvIKveNgzVpXFb_lAl7sLIOh0Uhk2Y465BmUOfVac7Kh2x11S')"
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-background-light/40 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
                    <div className="relative size-6 bg-primary border-4 border-white rounded-full shadow-lg" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <Link to="/" className="text-slate-400 hover:text-primary transition-colors" aria-label={t('pages.contact.social.web', 'Website')}>
                <Globe className="size-6" aria-hidden="true" />
              </Link>
              <Link to="/" className="text-slate-400 hover:text-primary transition-colors" aria-label={t('pages.contact.social.share', 'Share')}>
                <Share2 className="size-6" aria-hidden="true" />
              </Link>
              <Link to="/" className="text-slate-400 hover:text-primary transition-colors" aria-label={t('pages.contact.social.campaign', 'Campaign')}>
                <Megaphone className="size-6" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 size-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 size-64 bg-primary/10 rounded-full blur-3xl -z-10" />

            <div className="bg-white/70 dark:bg-background-dark/70 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-4xl p-8 md:p-12 shadow-2xl shadow-primary/5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t('pages.contact.form.title', 'Send us a message')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                {t('pages.contact.form.subtitle', "Fill out the form below and we'll get back to you within 24 hours.")}
              </p>

              <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1" htmlFor="contact-name">
                    {t('pages.contact.form.fullName', 'Full Name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder={t('pages.contact.form.fullNamePlaceholder', 'John Doe')}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1" htmlFor="contact-email">
                    {t('pages.contact.form.email', 'Email Address')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder={t('pages.contact.form.emailPlaceholder', 'john@example.com')}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1" htmlFor="contact-subject">
                    {t('pages.contact.form.subject', 'Subject')}
                  </label>
                  <select
                    id="contact-subject"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3 text-slate-900 dark:text-slate-100 transition-all"
                  >
                    <option>{t('pages.contact.form.subjectOptions.general', 'General Inquiry')}</option>
                    <option>{t('pages.contact.form.subjectOptions.donation', 'Donation Support')}</option>
                    <option>{t('pages.contact.form.subjectOptions.partnership', 'Partnership Proposal')}</option>
                    <option>{t('pages.contact.form.subjectOptions.volunteer', 'Volunteer Opportunity')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1" htmlFor="contact-message">
                    {t('pages.contact.form.message', 'Message')}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder={t('pages.contact.form.messagePlaceholder', 'How can we help you today?')}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  {t('pages.contact.form.send', 'Send Message')}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('pages.contact.form.faqPrompt', 'Have questions about our operations?')}{' '}
                  <Link to="/help-center" className="text-primary font-semibold hover:underline decoration-primary/30">
                    {t('pages.contact.form.faqLink', 'Read our Transparency FAQ')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
