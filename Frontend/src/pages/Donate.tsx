
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { addHoverScale, animatePageIn, animateSectionsOnScroll, animateStagger, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { ArrowRight, AlertTriangle, FileImage, Leaf, ShieldCheck } from 'lucide-react';
import { useDonationStore, useAuthStore } from '../store';
import { useQuery } from '@tanstack/react-query';
import campaignService from '../Services/campaigns';
import { getApiData } from '../store/apiHelpers';
import type { Campaign } from '../../types';

const Donate: React.FC = () => {
  const [amount, setAmount] = useState('50');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'transaction' | 'qr'>('transaction');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [acknowledgeRisk, setAcknowledgeRisk] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const verifyCbeDonation = useDonationStore((state) => state.verifyCbeDonation);
  const isLoading = useDonationStore((state) => state.isLoading);
  const error = useDonationStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: campaign } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await campaignService.getById(id);
      return getApiData<Campaign>(response);
    },
    enabled: Boolean(id)
  });

  const handleDonate = async () => {
    if (!id) {
      return;
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }

    if (campaign?.status && campaign.status !== 'approved' && !acknowledgeRisk) {
      return;
    }

    if (paymentMethod === 'transaction' && !transactionId.trim()) {
      return;
    }
    if (paymentMethod === 'qr' && !screenshot) {
      return;
    }

    const formData = new FormData();
    formData.append('campaignId', id);
    formData.append('amount', String(numericAmount));
    if (firstName || lastName) {
      formData.append('donorName', `${firstName} ${lastName}`.trim());
    }
    if (paymentMethod === 'transaction') {
      formData.append('transactionId', transactionId.trim());
    } else if (screenshot) {
      formData.append('screenshot', screenshot);
    }

    const success = await verifyCbeDonation(formData);
    if (success) {
      navigate('/success', {
        state: {
          amount: numericAmount,
          campaignTitle: campaign?.title ?? 'Campaign'
        }
      });
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
          y: 12,
          duration: 0.5,
          stagger: 0.06,
          scrollTrigger: {
            trigger: form,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
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
    <div ref={containerRef} className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2" data-animate="section">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
              Complete your donation
            </h1>
            <div className="flex items-center gap-2 text-primary font-medium">
              <ShieldCheck className="size-4" aria-hidden="true" />
              <p>Secure, verified bank transfer</p>
            </div>
            {!isAuthenticated && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
                You can donate without an account, but we can only track your impact if you log in.
              </div>
            )}
            {campaign?.status && campaign.status !== 'approved' && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 flex items-start gap-2">
                <AlertTriangle className="size-4 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">This campaign is not approved.</p>
                  <p className="text-xs">Donate at your own risk. The platform is not responsible for unapproved campaigns.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Step 1: Amount */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden" data-animate="section">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">1</span>
                Choose an amount
              </h3>
            </div>
            <div className="p-6" data-animate="form">
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 mb-4">
                The verified payment amount must match the amount you select here.
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {['25', '50', '100', '250'].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`flex items-center justify-center py-4 rounded-lg border-2 font-bold text-lg transition-all ${
                      amount === val 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-gray-100 dark:border-gray-700 bg-transparent text-gray-500 hover:border-primary/50'
                    }`}
                    data-animate="button"
                  >
                    ETB {val}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">ETB</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Other amount"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  data-animate="input"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Information */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden" data-animate="section">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">2</span>
                Who is donating?
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4" data-animate="form">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">First Name</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  placeholder="Jane"
                  type="text"
                  data-animate="input"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">Last Name</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  placeholder="Doe"
                  type="text"
                  data-animate="input"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold">Email Address</label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  placeholder="jane@example.com"
                  type="email"
                  data-animate="input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <p className="text-xs text-gray-500">Name here must match the name on the bank transfer.</p>
              </div>
            </div>
          </div>

          {/* Step 3: Payment */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden" data-animate="section">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-primary/5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">3</span>
                Payment Details
              </h3>
            </div>
            <div className="p-6 space-y-4" data-animate="form">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <p className="text-sm font-semibold">Pay via CBE transfer</p>
                <p className="text-sm text-gray-500">Send your donation to:</p>
                <div className="mt-2 text-lg font-bold text-primary">
                  {campaign?.cbeAccountNumber ?? 'CBE account not set'}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transaction')}
                  className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                    paymentMethod === 'transaction'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-100 dark:border-gray-700'
                  }`}
                  data-animate="button"
                >
                  <p className="font-semibold">Enter Transaction ID</p>
                  <p className="text-xs text-gray-500">Use the ID from your CBE receipt.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr')}
                  className={`rounded-xl border-2 px-4 py-3 text-left transition ${
                    paymentMethod === 'qr'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-100 dark:border-gray-700'
                  }`}
                  data-animate="button"
                >
                  <p className="font-semibold">Upload QR Screenshot</p>
                  <p className="text-xs text-gray-500">We will scan the QR code.</p>
                </button>
              </div>

              {paymentMethod === 'transaction' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Transaction ID</label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    placeholder="Enter transaction ID"
                    type="text"
                    value={transactionId}
                    onChange={(event) => setTransactionId(event.target.value)}
                    data-animate="input"
                  />
                </div>
              ) : (
                <label className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-sm text-gray-500 cursor-pointer">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FileImage className="size-4" aria-hidden="true" />
                    <span>{screenshot ? screenshot.name : 'Upload QR code screenshot'}</span>
                  </div>
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(event) => setScreenshot(event.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              {campaign?.status && campaign.status !== 'approved' && (
                <label className="flex items-start gap-2 text-xs text-rose-700">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={acknowledgeRisk}
                    onChange={(event) => setAcknowledgeRisk(event.target.checked)}
                  />
                  <span>I understand this campaign is not approved and I donate at my own risk.</span>
                </label>
              )}
            </div>
            <div className="px-6 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4">
                <button 
                onClick={handleDonate}
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
                data-animate="button"
                  disabled={isLoading}
                  aria-busy={isLoading}
              >
                <span>{isLoading ? 'Processing...' : `Donate ETB ${amount} Now`}</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 space-y-4" data-animate="section">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="w-full aspect-video relative bg-gradient-to-br from-green-400 to-emerald-700 flex items-end p-4">
                <div className="bg-black/30 px-3 py-1 rounded text-white text-xs font-bold uppercase tracking-wider">
                  {campaign?.category ?? 'Campaign'}
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Supporting</p>
                  <h3 className="text-xl font-bold leading-tight">{campaign?.title ?? 'Campaign'}</h3>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex gap-3 items-start text-sm">
                    <Leaf className="size-4 text-primary" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">Your impact</p>
                      <p className="text-gray-500">Your ETB {amount} donation supports this cause directly.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Donation</span>
                    <span className="font-medium">ETB {Number(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span>Total Due</span>
                    <span>ETB {Number(amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
