import React from 'react';
import {
  BadgeCheck,
  BookOpen,
  CreditCard,
  HeartHandshake,
  HelpCircle,
  LifeBuoy,
  Lock,
  Mail,
  Phone,
  Rocket,
  ShieldCheck,
  UserCircle
} from 'lucide-react';

const HelpCenter: React.FC = () => {
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
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <input
                  id="help-search"
                  type="text"
                  placeholder="Try: refund, verification, update campaign, receipts"
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition"
                >
                  Search
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Donations', 'Receipts', 'Verification', 'Campaign tips', 'Security', 'Account'].map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

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
                {[
                  'How to donate without logging in',
                  'How to verify your organizer account',
                  'How to create a campaign draft',
                  'How to track donations and receipts',
                  'How to update your campaign story',
                  'How to report suspicious activity'
                ].map((guide) => (
                  <div
                    key={guide}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4"
                  >
                    <BookOpen className="size-4 text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{guide}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              {[
                {
                  q: 'How do I verify my email with OTP?',
                  a: 'After signup, we send a 6-digit OTP to your email. Enter it on the verification page to activate your account.'
                },
                {
                  q: 'Why do I need organizer verification to launch a campaign?',
                  a: 'Verification protects donors and ensures campaigns remain trustworthy. You can submit ID and a live selfie to start review.'
                },
                {
                  q: 'Can I donate without an account?',
                  a: 'Yes. You can complete a donation as a guest. Create an account later to track receipts and impact.'
                },
                {
                  q: 'How do refunds work?',
                  a: 'If a payment fails or is canceled, it is automatically reversed. For other refund requests, contact support with your receipt.'
                },
                {
                  q: 'Where can I find my donation receipts?',
                  a: 'Receipts appear in your dashboard after a successful payment. We also email a copy for your records.'
                },
                {
                  q: 'How do I edit or pause my campaign?',
                  a: 'Use the campaign manager in your dashboard to update your story, goal, and media. You can pause updates anytime.'
                }
              ].map((item) => (
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
                  <span>support@impactgive.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" aria-hidden="true" />
                  <span>+1 (800) 555-0175</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="mt-4 space-y-3">
                {[
                  { label: 'Report an issue', icon: LifeBuoy },
                  { label: 'Verify identity status', icon: BadgeCheck },
                  { label: 'Security & privacy', icon: Lock },
                  { label: 'Donation protection', icon: HeartHandshake }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3"
                  >
                    <item.icon className="size-4 text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</span>
                  </div>
                ))}
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
    </div>
  );
};

export default HelpCenter;
