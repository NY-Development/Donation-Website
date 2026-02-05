import React from 'react';

const HelpCenter: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Help Center</p>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">How can we help?</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
          Find answers to common questions about donations, refunds, and campaigns.
        </p>
      </div>

      <div className="space-y-4">
        {[
          'Managing your donations',
          'Receipts and tax documents',
          'Starting a campaign',
          'Updating your profile',
        ].map((item) => (
          <div key={item} className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-base font-bold">{item}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Learn more about {item.toLowerCase()}.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;
