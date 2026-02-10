
import React, { useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { BadgeCheck, Heart, Lock, Mail, MapPin, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import campaignService from '../Services/campaigns';
import { getApiData } from '../store/apiHelpers';
import type { Campaign, CampaignDonor } from '../types';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const { data: campaign } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await campaignService.getById(id);
      return getApiData<Campaign>(response);
    },
    enabled: Boolean(id)
  });

  const { data: donors } = useQuery({
    queryKey: ['campaign', id, 'donors'],
    queryFn: async () => {
      if (!id) return [] as CampaignDonor[];
      const response = await campaignService.getDonors(id);
      return getApiData<CampaignDonor[]>(response) ?? [];
    },
    enabled: Boolean(id)
  });

  const image = campaign?.media?.[0] ?? 'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop';
  const raised = campaign?.raisedAmount ?? 0;
  const goal = campaign?.goalAmount ?? 1;
  const percent = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="flex flex-wrap gap-2 mb-6" data-animate="section">
        <Link className="text-primary hover:underline text-sm font-medium" to="/">Home</Link>
        <span className="text-gray-400 text-sm">/</span>
        <Link className="text-primary hover:underline text-sm font-medium" to="/explore">Campaigns</Link>
        <span className="text-gray-400 text-sm">/</span>
        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{campaign?.category ?? 'Campaign'}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 flex flex-col gap-6" data-animate="section">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
              {campaign?.title ?? 'Campaign'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {campaign?.story ?? 'Loading campaign details...'}
            </p>
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm relative group">
            <img 
              src={image}
              alt={campaign?.title ?? 'Campaign'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wide">
              <MapPin className="size-3.5" aria-hidden="true" />
              <span>{campaign?.location ?? 'Global'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
            <div className="flex gap-4 items-center">
              <div className="h-14 w-14 rounded-full bg-cover bg-center bg-gray-200" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop")' }}></div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Organizer</p>
                  <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
                </div>
                <p className="text-gray-500 text-sm">Organizer • {campaign?.status === 'approved' ? 'Verified' : 'Pending'}</p>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-bold">
              <Mail className="size-4" aria-hidden="true" /> Contact
            </button>
          </div>

          <article className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p className="mb-4">{campaign?.story ?? 'Loading story...'}</p>
            <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-xl text-gray-900 dark:text-white font-medium">
              "Every donation brings this mission closer to reality."
            </blockquote>
            <p>Every dollar counts. Whether you can give $5 or $500, your contribution directly impacts a brighter future.</p>
          </article>
        </div>

        <div className="lg:col-span-4 relative" data-animate="section">
          <div className="sticky top-24 flex flex-col gap-6">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">${raised.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 font-medium">raised of ${goal.toLocaleString()} goal</span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-gray-500 mt-1">
                    <span>{donors?.length ?? 0} donations</span>
                    <span className="flex items-center gap-1 text-orange-500">
                      <TrendingUp className="size-3.5" aria-hidden="true" /> 12 today
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[20, 50, 100].map(amt => (
                    <button key={amt} className="py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 text-gray-700 dark:text-gray-200 font-bold transition">
                      ${amt}
                    </button>
                  ))}
                </div>

                <Link to={`/donate/${id}`} className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-lg shadow-lg shadow-primary/20 transition-all text-center">
                  Donate Now
                </Link>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Lock className="size-3.5" aria-hidden="true" />
                  Secure donation via Stripe
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-surface-dark p-6 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="size-4 text-primary" aria-hidden="true" /> Hero Donors
                </h4>
                <div className="space-y-4">
                  {(donors ?? []).map((donor, index) => (
                    <div key={`${donor.createdAt}-${index}`} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {donor.user ? 'DN' : 'AN'}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{donor.user ? 'Donor' : 'Anonymous'}</span>
                        <span className="text-xs text-gray-500">Recent donation</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">${donor.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
