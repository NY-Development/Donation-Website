
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-3xl text-primary">volunteer_activism</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Impact</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs mb-6 text-sm leading-relaxed">
              Connecting generous hearts with causes that matter. We are building a world where everyone can make a difference.
            </p>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/explore">How it works</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/explore">For Nonprofits</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/dashboard">My Impact</Link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Safety & Trust</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><Link className="hover:text-primary transition-colors" to="/admin">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <p>© 2024 ImpactGive Foundation. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-gray-900 dark:hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-gray-900 dark:hover:text-white transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
