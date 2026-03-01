import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import supportService from '../Services/support';
import { getErrorMessage } from '../store/apiHelpers';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = React.useState<string | null>(null);
  const addisAbabaGoogleMapLink = 'https://www.google.com/maps/place/Addis+Ababa/@8.9631768,38.7781448,12z/data=!3m1!4b1!4m6!3m5!1s0x164b85cef5ab402d:0x8467b6b037a24d49!8m2!3d9.0191936!4d38.7524635!16zL20vMGR0dGY?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D';

  const submitMutation = useMutation({
    mutationFn: async () => {
      await supportService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim()
      });
    },
    onSuccess: () => {
      setFormError(null);
      setFormSuccess(t('pages.contact.form.success', 'Your message has been sent. Our team will contact you soon.'));
      setForm({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(getErrorMessage(error));
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setFormError(t('pages.contact.form.validation', 'Please fill in all fields before sending your message.'));
      return;
    }

    submitMutation.mutate();
  };

  const handleShareMap = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: t('pages.contact.address.title', 'Visit HQ'),
          text: t('pages.contact.mapAlt', 'Map showing Addis Ababa, Ethiopia'),
          url: addisAbabaGoogleMapLink
        });
        setShareFeedback(t('pages.contact.social.shared', 'Map link shared.'));
      } else {
        await navigator.clipboard.writeText(addisAbabaGoogleMapLink);
        setShareFeedback(t('pages.contact.social.copied', 'Map link copied to clipboard.'));
      }
    } catch {
      setShareFeedback(t('pages.contact.social.copyFailed', 'Unable to share right now. Please copy the link manually.'));
    }
  };

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
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('pages.contact.email.value', 'mebasharew31@gmail.com')}</p>
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
                  aria-label={t('pages.contact.mapAlt', 'Map showing Addis Ababa, Ethiopia')}
                  style={{
                    backgroundImage:
                      "url('https://staticmap.openstreetmap.de/staticmap.php?center=Addis%20Ababa,Ethiopia&zoom=12&size=1200x700&markers=9.0191936,38.7524635,red-pushpin')"
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
              <a
                href={addisAbabaGoogleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-primary transition-colors"
                aria-label={t('pages.contact.social.web', 'Open Addis Ababa map')}
              >
                <Globe className="size-6" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={handleShareMap}
                className="text-slate-400 hover:text-primary transition-colors"
                aria-label={t('pages.contact.social.share', 'Share map link')}
              >
                <Share2 className="size-6" aria-hidden="true" />
              </button>
              {/* <Link to="/" className="text-slate-400 hover:text-primary transition-colors" aria-label={t('pages.contact.social.campaign', 'Campaign')}>
                <Megaphone className="size-6" aria-hidden="true" />
              </Link> */}
            </div>

            {shareFeedback && (
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">{shareFeedback}</p>
            )}
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

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1" htmlFor="contact-name">
                    {t('pages.contact.form.fullName', 'Full Name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
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
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
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
                    value={form.subject}
                    onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
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
                    value={form.message}
                    onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                    placeholder={t('pages.contact.form.messagePlaceholder', 'How can we help you today?')}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-transparent focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-xl px-5 py-3 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
                )}

                {formSuccess && (
                  <p className="text-sm text-green-600 dark:text-green-400">{formSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  {submitMutation.isPending
                    ? t('pages.contact.form.sending', 'Sending...')
                    : t('pages.contact.form.send', 'Send Message')}
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
