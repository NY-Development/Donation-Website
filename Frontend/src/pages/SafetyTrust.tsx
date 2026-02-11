import React from 'react';

const SafetyTrust: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Safety & Trust</p>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Your security is our priority</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">
          We use verification, secure payments, and continuous monitoring to protect donors and beneficiaries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Organization Verification</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">We verify nonprofits and fundraisers before they go live.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Secure Payments</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">All transactions are encrypted and processed by trusted partners.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Fraud Monitoring</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">We monitor for suspicious activity and respond quickly.</p>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-2">Transparent Reporting</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Campaign updates keep donors informed and confident.</p>
        </div>
      </div>
    </div>
  );
};

export default SafetyTrust;
