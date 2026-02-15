import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../Services/auth';
import { getErrorMessage } from '../store/apiHelpers';
import { useTranslation } from 'react-i18next';

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const stateEmail = (location.state as { email?: string } | null)?.email ?? '';
  const [email, setEmail] = useState(stateEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ email, password });
      setSuccess(true);
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-8 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('pages.auth.reset.title')}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {t('pages.auth.reset.subtitle')}
        </p>

        {success ? (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {t('pages.auth.reset.success')}
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('pages.auth.reset.email')}</label>
              <input
                className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('pages.auth.reset.newPassword')}</label>
              <input
                className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('pages.auth.reset.confirm')}</label>
              <input
                className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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
              {isLoading ? t('pages.auth.reset.updating') : t('pages.auth.reset.reset')}
            </button>
          </form>
        )}

        <div className="mt-6 text-sm text-gray-500">
          {t('pages.auth.reset.remembered')}{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t('pages.auth.reset.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
