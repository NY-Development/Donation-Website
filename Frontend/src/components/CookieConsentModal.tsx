import React, { useEffect, useState } from "react";
import api from "../Services/axios";
import { CURRENT_POLICY_VERSION } from "../config/cookiePolicyVersion";
import LegalModal from "./LegalModal";

const CONSENT_KEY = "cookieConsent";
const POLICY_VERSION_KEY = "policyVersion";

const defaultCategories = {
  necessary: true,
  analytics: true,
  marketing: true,
};

const CookieConsentModal: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(defaultCategories);
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showMore, setShowMore] = useState(false);

  /* ===============================
     Validate stored consent safely
  =============================== */
  const hasValidStoredConsent = (): boolean => {
    try {
      const rawConsent = localStorage.getItem(CONSENT_KEY);
      const storedVersion = localStorage.getItem(POLICY_VERSION_KEY);

      if (!rawConsent) return false;
      if (storedVersion !== CURRENT_POLICY_VERSION) return false;

      const parsed = JSON.parse(rawConsent);

      return typeof parsed?.consentGiven === "boolean";
    } catch {
      return false;
    }
  };

  /* ===============================
     Initial Check
  =============================== */
  useEffect(() => {
    if (!hasValidStoredConsent()) {
      setOpen(true);
    }

    const handler = () => setOpen(true);

    window.addEventListener("openCookieSettings", handler);

    return () => {
      window.removeEventListener("openCookieSettings", handler);
    };
  }, []);

  /* ===============================
     Body Scroll Lock (State Driven)
  =============================== */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ===============================
     Handle Consent Submit
  =============================== */
  const handleConsent = async (consentGiven: boolean, categories = defaultCategories) => {
    setLoading(true);
    try {
      const method = localStorage.getItem(CONSENT_KEY) ? "put" : "post";
      await api[method]("/cookie-consent", {
        consentGiven,
        consentCategories: categories,
      });
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ consentGiven, categories }));
      localStorage.setItem(POLICY_VERSION_KEY, CURRENT_POLICY_VERSION);
      setOpen(false);
      document.body.style.overflow = "";
      if (onClose) onClose();
    } catch (err) {
      // Handle error
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in-up">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          Cookie Consent
        </h2>

        <p className="mb-4 text-gray-600 dark:text-gray-300 text-sm">
          We use cookies to enhance security, prevent fraud, and improve your
          experience. Manage your preferences below. Read our{" "}
          <button
            type="button"
            className="underline text-purple-600 hover:text-purple-800"
            onClick={() => setShowPolicy(true)}
          >
            Privacy Policy
          </button>.
        </p>

        <LegalModal
          open={showPolicy}
          onClose={() => setShowPolicy(false)}
          content="privacy"
        />

        <div className="flex flex-col gap-3 mb-6 text-left text-sm">

          <label className="flex items-center gap-2">
            <input type="checkbox" checked disabled />
            Necessary (required)
          </label>

          {!showMore && (
            <button
              type="button"
              className="text-xs text-purple-600 underline text-center mt-2"
              onClick={() => setShowMore(true)}
            >
              Show More ▼
            </button>
          )}

          {showMore && (
            <>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent((c) => ({
                      ...c,
                      analytics: e.target.checked,
                    }))
                  }
                />
                Analytics
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent((c) => ({
                      ...c,
                      marketing: e.target.checked,
                    }))
                  }
                />
                Marketing
              </label>

              <button
                type="button"
                className="text-xs text-purple-600 underline text-center mt-2"
                onClick={() => setShowMore(false)}
              >
                Show Less ▲
              </button>
            </>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            className="px-4 py-2 rounded border-2 border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition"
            disabled={loading}
            onClick={() =>
              handleConsent(false, {
                necessary: true,
                analytics: false,
                marketing: false,
              })
            }
          >
            {loading ? "Processing..." : "Decline All"}
          </button>

          <button
            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
            disabled={loading}
            onClick={() => handleConsent(true, consent)}
          >
            {loading
              ? "Processing..."
              : consent.analytics && consent.marketing
              ? "I Agree to All"
              : "I Agree"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentModal;