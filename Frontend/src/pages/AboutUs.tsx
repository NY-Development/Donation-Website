import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">About Us</p>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Building trust in giving</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
          ImpactGive connects donors with verified causes to make giving transparent, fast, and meaningful.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Our Mission</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Empower donors and nonprofits with tools that maximize impact.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Our Values</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Transparency, accountability, and community-driven change.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
