import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">ImpactGive</p>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">How It Works</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
          Transparent giving from start to finish. Discover causes, donate securely, and track impact in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">1. Discover</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Explore verified campaigns curated for transparency and impact.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">2. Donate</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Support causes securely with quick, encrypted checkout.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">3. See Impact</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates and outcomes from organizers.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
