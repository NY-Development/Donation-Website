import React from 'react';
import { useTranslation } from 'react-i18next';

const Privacy: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">{t('pages.privacy.title')}</h1>
      <p className="text-gray-600 dark:text-gray-400">
        {t('pages.privacy.body')}
      </p>
    </div>
  );
};

export default Privacy;
