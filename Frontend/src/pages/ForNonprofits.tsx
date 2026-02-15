import React from 'react';
import { useTranslation } from 'react-i18next';

const ForNonprofits: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">{t('pages.forNonprofits.kicker')}</p>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">{t('pages.forNonprofits.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
          {t('pages.forNonprofits.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">{t('pages.forNonprofits.card1Title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('pages.forNonprofits.card1Body')}</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">{t('pages.forNonprofits.card2Title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('pages.forNonprofits.card2Body')}</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">{t('pages.forNonprofits.card3Title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('pages.forNonprofits.card3Body')}</p>
        </div>
      </div>
    </div>
  );
};

export default ForNonprofits;
