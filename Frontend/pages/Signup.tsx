
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark p-4">
      <div className="w-full max-w-[1000px] bg-white dark:bg-surface-dark rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6">Join the Movement</h1>
            <p className="text-xl text-purple-100 opacity-90 max-w-sm">Become part of a global community dedicated to making a real difference in people's lives.</p>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-white/20 flex items-center justify-center"><span className="material-symbols-outlined">timeline</span></div>
              <div><p className="font-bold">Track Impact</p><p className="text-xs opacity-70">Visualize where your money goes in real-time.</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-white/20 flex items-center justify-center"><span className="material-symbols-outlined">verified</span></div>
              <div><p className="font-bold">Verified Causes</p><p className="text-xs opacity-70">Every campaign is vetted for transparency.</p></div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">Create your account</h2>
            <p className="text-gray-500 mb-8">Start your journey of giving today.</p>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Full Name</label>
                <input className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Jane Doe" type="text" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Email Address</label>
                <input className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. jane@example.com" type="email" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Password</label>
                <input className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="Create a password" type="password" required />
                <p className="text-[10px] text-gray-400 italic">Must be at least 8 characters long.</p>
              </div>
              <div className="flex items-start gap-2 pt-2">
                <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary" id="terms" required />
                <label htmlFor="terms" className="text-xs text-gray-500">I agree to the <a href="#" className="text-primary font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>.</label>
              </div>
              <button className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                Create Account <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
