
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { animatePageIn, animateSectionsOnScroll, ensureGsap, prefersReducedMotion } from '../utils/gsapAnimations';
import { AlertTriangle, BadgeCheck, Heart, Search } from 'lucide-react';
import { useCampaignStore } from '../store';

const Explore: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [status, setStatus] = useState<'approved' | 'pending_verification' | 'rejected' | 'draft' | 'closed' | 'all'>('all');
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [warningCampaignId, setWarningCampaignId] = useState<string | null>(null);
  const campaigns = useCampaignStore((state) => state.campaigns);
  const warningCampaign = warningCampaignId
    ? campaigns.find((campaign) => campaign._id === warningCampaignId)
    : null;
  const nextCursor = useCampaignStore((state) => state.nextCursor);
  const isLoading = useCampaignStore((state) => state.isLoading);
  const fetchAll = useCampaignStore((state) => state.fetchAll);

  useLayoutEffect(() => {
    ensureGsap();
    if (!containerRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animatePageIn(containerRef.current as HTMLDivElement);
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]', containerRef.current);
      animateSectionsOnScroll(sections);

      const cards = gsap.utils.toArray<HTMLElement>('[data-animate="card"]', containerRef.current);
      cards.forEach((card) => {
        gsap.from(card, {
          autoAlpha: 0,
          y: 18,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  
  const statusStyles: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-700',
    pending_verification: 'bg-amber-100 text-amber-700',
    rejected: 'bg-rose-100 text-rose-700',
    draft: 'bg-slate-100 text-slate-600',
    closed: 'bg-slate-200 text-slate-700'
  };

  const statusLabels: Record<string, string> = {
    approved: 'Approved',
    pending_verification: 'Pending',
    rejected: 'Rejected',
    draft: 'Draft',
    closed: 'Closed'
  };

  const categories = ['All', 'Education', 'Medical', 'Environment', 'Disaster Relief', 'Community'];

  useEffect(() => {
    const params = {
      category: activeCategory === 'All' ? undefined : activeCategory,
      urgent: urgentOnly ? true : undefined,
      status: status === 'all' ? 'all' : status,
      limit: 12,
      sort: 'desc' as const
    };

    fetchAll(params, true);
  }, [activeCategory, urgentOnly, status, fetchAll]);

  const filteredCampaigns = query.trim()
    ? campaigns.filter((campaign) => campaign.title.toLowerCase().includes(query.trim().toLowerCase()))
    : campaigns;

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8" data-animate="section">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Explore Campaigns</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">Browse all active, pending, and rejected campaigns with clear status labels.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0" data-animate="section">
          <div className="sticky top-24 space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Keywords</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="size-4 text-slate-400" aria-hidden="true" />
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary placeholder-slate-400"
                  placeholder="Refine search..."
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Categories</label>
                <button onClick={() => setActiveCategory('All')} className="text-xs text-primary font-medium hover:underline">Clear</button>
              </div>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={activeCategory === cat}
                      onChange={() => setActiveCategory(cat)}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent"
                    />
                    <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Urgency</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(event) => setUrgentOnly(event.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent"
                />
                <span className="text-slate-600 dark:text-slate-300">Urgent only</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
                className="w-full px-3 py-2.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              >
                <option value="approved">Approved</option>
                <option value="pending_verification">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Campaign Grid */}
        <main className="flex-1" data-animate="section">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              <span className="text-slate-900 dark:text-white font-bold">{filteredCampaigns.length}</span> campaigns found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign) => {
              const raised = campaign.raisedAmount ?? 0;
              const goal = campaign.goalAmount ?? 1;
              const percent = Math.min(100, Math.round((raised / goal) * 100));
              const image = campaign.media?.[0] ?? 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2000&auto=format&fit=crop';

              return (
                <article key={campaign._id} className="group bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col" data-animate="card">
                  <Link to={`/campaign/${campaign._id}`} className="relative h-56 overflow-hidden block">
                    <img src={image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {campaign.status === 'approved' && (
                      <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 px-2 py-1 rounded-md text-xs font-bold text-teal-600 flex items-center gap-1 shadow-sm">
                        <BadgeCheck className="size-3.5" aria-hidden="true" /> Verified Org
                      </div>
                    )}
                    {campaign.status !== 'approved' && (
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold shadow-sm ${statusStyles[campaign.status]}`}>
                        {statusLabels[campaign.status]}
                      </div>
                    )}
                    {campaign.urgent && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm animate-pulse">
                        <AlertTriangle className="size-3.5" aria-hidden="true" /> Urgent
                      </div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-3">
                      <span className="text-xs font-semibold tracking-wide text-primary uppercase">{campaign.category}</span>
                    </div>
                    <Link to={`/campaign/${campaign._id}`} className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                      {campaign.title}
                    </Link>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                      {campaign.story}
                    </p>
                    <div className="mt-auto space-y-4">
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-1.5">
                          <span className="text-slate-900 dark:text-slate-200">ETB {raised.toLocaleString()} raised</span>
                          <span className="text-slate-500">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (campaign.status !== 'approved') {
                            setWarningCampaignId(campaign._id);
                          } else {
                            navigate(`/donate/${campaign._id}`);
                          }
                        }}
                        className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2"
                      >
                        Donate Now <Heart className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            {nextCursor && (
              <button
                onClick={() => fetchAll({
                  category: activeCategory === 'All' ? undefined : activeCategory,
                  urgent: urgentOnly ? true : undefined,
                  status: status === 'all' ? 'all' : status,
                  limit: 12,
                  sort: 'desc',
                  cursor: nextCursor
                })}
                className="px-6 py-2.5 rounded-lg bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:border-primary hover:text-primary transition"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load more'}
              </button>
            )}
          </div>
        </main>
      </div>

      {warningCampaignId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-surface-dark border border-rose-200 dark:border-rose-900/40 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-rose-500 mt-1" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {warningCampaign?.status === 'closed' ? 'Campaign closed' : 'Campaign not approved'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {warningCampaign?.status === 'closed'
                    ? 'This campaign is closed and can no longer accept donations.'
                    : 'This campaign is not approved. The platform is not responsible for donations made to unapproved campaigns.'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setWarningCampaignId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-primary"
              >
                Cancel
              </button>
              {warningCampaign?.status !== 'closed' && (
                <button
                  type="button"
                  onClick={() => {
                    const target = warningCampaignId;
                    setWarningCampaignId(null);
                    navigate(`/donate/${target}`);
                  }}
                  className="px-5 py-2 rounded-lg bg-rose-600 text-white text-sm font-bold"
                >
                  Continue anyway
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
