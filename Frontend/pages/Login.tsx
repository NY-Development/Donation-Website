
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50 dark:bg-background-dark">
      <div className="w-full max-w-[1000px] bg-white dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800">
        <div className="md:w-1/2 relative min-h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1559027615-cd837c92d5fd?q=80&w=1000&auto=format&fit=crop" 
            alt="Community" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-10 text-white">
            <span className="material-symbols-outlined text-4xl mb-4">format_quote</span>
            <p className="text-2xl font-bold leading-tight mb-4">"Your contribution changes lives every single day. We are building a future where everyone thrives."</p>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full border-2 border-white/50 bg-gray-200 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop")' }}></div>
              <div>
                <p className="text-sm font-bold">Sarah Jenkins</p>
                <p className="text-xs opacity-70">Community Leader</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-black mb-2 text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 mb-8">Please enter your details to sign in to your dashboard.</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">mail</span>
                  <input className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="name@example.com" type="email" required />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                  <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">lock</span>
                  <input className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary outline-none" placeholder="••••••••" type="password" required />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary transition-colors">visibility_off</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" id="remember" />
                <label htmlFor="remember" className="text-sm text-gray-500">Remember for 30 days</label>
              </div>

              <button className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98]">
                Sign In
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
