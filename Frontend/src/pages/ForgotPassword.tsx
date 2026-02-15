import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../Services/auth';
import { getErrorMessage } from '../store/apiHelpers';
import { useTranslation } from 'react-i18next';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSubmitted(true);
      navigate('/reset', { state: { email } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-8 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('pages.auth.forgot.title')}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {t('pages.auth.forgot.subtitle')}
        </p>

        {submitted ? (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {t('pages.auth.forgot.success', { email: email || t('common.email') })}
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('pages.auth.forgot.email')}</label>
              <input
                className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-white hover:bg-primary-hover"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? t('pages.auth.forgot.sending') : t('pages.auth.forgot.send')}
            </button>
          </form>
        )}

        <div className="mt-6 text-sm text-gray-500">
          {t('pages.auth.forgot.remembered')}{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t('pages.auth.forgot.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
