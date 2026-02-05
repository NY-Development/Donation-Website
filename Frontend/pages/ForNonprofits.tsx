import React from 'react';

const ForNonprofits: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">For Nonprofits</p>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Grow Your Impact</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
          Launch campaigns, engage donors, and share progress with a trusted community of supporters.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Verified Onboarding</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">We verify organizations to build donor confidence and reduce fraud.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Campaign Tools</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Create compelling campaigns with flexible goals, media, and updates.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Donor Analytics</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track performance and communicate outcomes to supporters.</p>
        </div>
      </div>
    </div>
  );
};

export default ForNonprofits;
