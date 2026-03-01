import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import campaignService from '../Services/campaigns';
import { getApiData } from '../store/apiHelpers';
import type { Campaign } from '../../types';

const isCampaignSuccessful = (campaign: Campaign) => {
  const status = String(campaign.status ?? '').toLowerCase();
  const reachedGoal = Number(campaign.raisedAmount ?? 0) >= Number(campaign.goalAmount ?? 0) && Number(campaign.goalAmount ?? 0) > 0;
  return status === 'completed' || status === 'closed' || reachedGoal;
};

const SuccessStory: React.FC = () => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['campaigns', 'success-stories', 'page'],
    queryFn: async () => {
      const response = await campaignService.getSuccessStories({ limit: 50 });
      return getApiData<Campaign[]>(response) ?? [];
    }
  });

  const successfulCampaigns = (data ?? []).filter(isCampaignSuccessful);
  const categoryChips =
    (t('pages.successStories.chips', { returnObjects: true }) as string[] | undefined) ??
    ['All Stories', 'Health', 'Environment', 'Education', 'Clean Water'];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 py-12 md:py-16 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full">
            {t('pages.successStories.kicker', 'Impact Report')}
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            {t('pages.successStories.heroTitlePrefix', 'Real Stories of')}{' '}
            <span className="text-primary">{t('pages.successStories.heroTitleHighlight', 'Real Change')}</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('pages.successStories.title', 'Success Stories')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t(
              'pages.successStories.subtitle',
              'Campaigns shown here are completed or have reached 100% of their goal.'
            )}
          </p>
        </div>

        {/* Filtering fixed at the top - to be implemented later
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categoryChips.map((chip, index) => (
            <button
              key={chip}
              type="button"
              className={
                index === 0
                  ? 'px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm shadow-md transition-all'
                  : 'px-6 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:border-primary/50 hover:text-primary transition-all'
              }
            >
              {chip}
            </button>
          ))}
        </div> */}

        {isLoading && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 p-10 text-center text-slate-500 dark:text-slate-400">
            {t('pages.successStories.loading', 'Loading success stories...')}
          </div>
        )}

        {isError && (
          <div className="rounded-3xl border border-red-100 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/20 p-10 text-center text-red-700 dark:text-red-300">
            {t('pages.successStories.error', 'Unable to load success stories right now.')}
          </div>
        )}

        {!isLoading && !isError && successfulCampaigns.length === 0 && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 p-10 text-center text-slate-600 dark:text-slate-400">
            {t('pages.successStories.empty', 'No completed campaigns yet. Please check back soon.')}
          </div>
        )}

        {!isLoading && !isError && successfulCampaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successfulCampaigns.map((campaign) => {
              const raised = Number(campaign.raisedAmount ?? 0);
              const goal = Number(campaign.goalAmount ?? 1);
              const progress = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
              const beforeImage = campaign.media?.[0];
              const afterImage = campaign.media?.[1] ?? campaign.media?.[0];

              return (
                <article
                  key={campaign._id}
                  className="group bg-white dark:bg-slate-900/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {beforeImage || afterImage ? (
                      <>
                        <div className="flex h-full">
                          <div className="w-1/2 h-full relative">
                            <img
                              src={beforeImage ?? afterImage}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 bg-black/40 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold uppercase">
                              {t('pages.successStories.before', 'Before')}
                            </span>
                          </div>
                          <div className="w-1/2 h-full relative">
                            <img
                              src={afterImage ?? beforeImage}
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 right-2 bg-primary/80 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold uppercase">
                              {t('pages.successStories.after', 'After')}
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 backdrop-blur left-1/2 -translate-x-1/2 z-10" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                        {t('pages.successStories.noImage', 'No image available')}
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-md">
                      {progress}%
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {campaign.category || t('pages.successStories.successCategory', 'Success')}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {campaign.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3 flex-1">
                      {campaign.story}
                    </p>

                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs font-semibold mb-2">
                        <span className="text-primary">ETB {raised.toLocaleString()}</span>
                        <span className="text-slate-500 dark:text-slate-400">{t('pages.successStories.goal', 'Goal')}: ETB {goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <Link
                      to={`/campaign/${campaign._id}`}
                      className="inline-flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all text-sm"
                    >
                      {t('pages.successStories.viewCampaign', 'View campaign')}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStory;
