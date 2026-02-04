
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, isDarkMode }) => {
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/donate');
  const isAdmin = location.pathname.startsWith('/admin');

  if (isCheckout) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-surface-dark border-b border-[#ede7f3] dark:border-gray-800">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-4">
            <div className="size-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">ImpactGive</h2>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ede7f3] dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span className="hidden sm:inline">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 text-primary transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Impact</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/explore">Campaigns</Link>
            <Link className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/create">Start Campaign</Link>
            <Link className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" to="/dashboard">My Impact</Link>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <Link to="/login" className="hidden sm:flex items-center justify-center h-9 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Log In
            </Link>
            <Link to="/explore" className="flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
              Donate
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
