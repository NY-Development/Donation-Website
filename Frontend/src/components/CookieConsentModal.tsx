import React, { useEffect, useState } from 'react';
import axios from '../Services/axios';
import { CURRENT_POLICY_VERSION } from '../config/cookiePolicyVersion';
import LegalModal from './LegalModal';

const CONSENT_KEY = 'cookieConsent';
const POLICY_VERSION_KEY = 'policyVersion';

const defaultCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const CookieConsentModal: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  useEffect(() => {
    const localConsent = localStorage.getItem(CONSENT_KEY);
    const localVersion = localStorage.getItem(POLICY_VERSION_KEY);
    if (!localConsent || localVersion !== CURRENT_POLICY_VERSION) {
      setOpen(true);
      document.body.style.overflow = 'hidden';
    }
    const handler = () => {
      setOpen(true);
      document.body.style.overflow = 'hidden';
    };
    window.addEventListener('openCookieSettings', handler);
    return () => window.removeEventListener('openCookieSettings', handler);
  }, []);

  const handleConsent = async (consentGiven: boolean, categories = defaultCategories) => {
    setLoading(true);
    try {
      const method = localStorage.getItem(CONSENT_KEY) ? 'put' : 'post';
      await axios[method]('/api/cookie-consent', {
        consentGiven,
        consentCategories: categories,
      });
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ consentGiven, categories }));
      localStorage.setItem(POLICY_VERSION_KEY, CURRENT_POLICY_VERSION);
      setOpen(false);
      document.body.style.overflow = '';
      if (onClose) onClose();
    } catch (err) {
      // Handle error
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
        <h2 className="text-xl font-bold mb-2">Cookie Consent</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">We use cookies to enhance your experience. Manage your preferences below. Read our <button type="button" className="underline text-brand hover:text-brand-dark" onClick={() => setShowPolicy(true)}>Privacy Policy</button>.</p>
        <LegalModal open={showPolicy} onClose={() => setShowPolicy(false)} content="privacy" />
        <div className="flex flex-col gap-3 mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked disabled />
            Necessary (required)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={consent.analytics} onChange={e => setConsent(c => ({ ...c, analytics: e.target.checked }))} />
            Analytics
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={consent.marketing} onChange={e => setConsent(c => ({ ...c, marketing: e.target.checked }))} />
            Marketing
          </label>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            className="px-4 py-2 rounded border-2 border-red-500 text-red-500 font-bold hover:text-white dark:text-gray-200 hover:bg-red-500 dark:hover:bg-red-600 transition"
            disabled={loading}
            onClick={() => handleConsent(false, { ...defaultCategories, analytics: false, marketing: false })}
          >{loading ? 'Processing...' : 'Decline All'}</button>
          <button
            className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-700 bg-brand text-white font-semibold hover:bg-brand-dark transition"
            disabled={loading}
            onClick={() => handleConsent(true, consent)}
          >{loading ? 'Processing...' : 'I Agree to All'}</button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentModal;
