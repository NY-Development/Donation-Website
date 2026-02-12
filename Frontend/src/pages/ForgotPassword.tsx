import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-8 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Reset your password</h1>
        <p className="mt-2 text-sm text-gray-500">
          We'll send reset instructions to the email you used to sign up.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            If an account exists for {email || 'that email'}, we've sent a reset link.
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email address</label>
              <input
                className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-white hover:bg-primary-hover"
            >
              Send reset link
            </button>
          </form>
        )}

        <div className="mt-6 text-sm text-gray-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
