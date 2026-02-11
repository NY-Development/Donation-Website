
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './src/components/Navbar';
import Footer from './src/components/Footer';
import ProtectedRoute from './src/components/ProtectedRoute';
import Home from './src/pages/Home';
import Explore from './src/pages/Explore';
import CampaignDetail from './src/pages/CampaignDetail';
import Donate from './src/pages/Donate';
import CreateCampaign from './src/pages/CreateCampaign';
import OrganizerVerification from './src/pages/OrganizerVerification';
import UserDashboard from './src/pages/UserDashboard';
import AdminDashboard from './src/pages/AdminDashboard';
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import Success from './src/pages/Success';
import HowItWorks from './src/pages/HowItWorks';
import ForNonprofits from './src/pages/ForNonprofits';
import HelpCenter from './src/pages/HelpCenter';
import SafetyTrust from './src/pages/SafetyTrust';
import AboutUs from './src/pages/AboutUs';
import Eula from './src/pages/Eula';
import Terms from './src/pages/Terms';
import Privacy from './src/pages/Privacy';
import { useAuthStore } from './src/store';
import { HelpCircle, X } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1
    }
  }
});

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleHelp = () => setIsHelpOpen((prev) => !prev);

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
        {/* Hide default navbar on checkout or admin pages if needed, but for simplicity we show it or a variant */}
        <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/campaign/:id" element={<CampaignDetail />} />
            <Route path="/donate/:id" element={<Donate />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute roles={['organizer', 'admin']}>
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/verify"
              element={
                <ProtectedRoute roles={['organizer']}>
                  <OrganizerVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/success" element={<Success />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/for-nonprofits" element={<ForNonprofits />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/safety-trust" element={<SafetyTrust />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/eula" element={<Eula />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>

        <Footer />

        <button
          type="button"
          aria-label="Open help"
          onClick={toggleHelp}
          className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center hover:bg-primary-hover transition-all"
        >
          <HelpCircle className="size-6" aria-hidden="true" />
        </button>

        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <button
              type="button"
              aria-label="Close help"
              className="absolute inset-0 bg-black/40"
              onClick={toggleHelp}
            />
            <div className="relative w-full sm:w-[420px] bg-white dark:bg-surface-dark rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 m-0 sm:m-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Need help?</h3>
                <button
                  type="button"
                  aria-label="Close help"
                  onClick={toggleHelp}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary/40 hover:bg-primary/5 transition">
                  <p className="font-semibold">How do I donate securely?</p>
                  <p className="text-sm text-gray-500">Learn about encryption, receipts, and payment safety.</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary/40 hover:bg-primary/5 transition">
                  <p className="font-semibold">How do I start a campaign?</p>
                  <p className="text-sm text-gray-500">Step-by-step guide to create and launch your fundraiser.</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-primary/40 hover:bg-primary/5 transition">
                  <p className="font-semibold">Where can I track my impact?</p>
                  <p className="text-sm text-gray-500">See donations, updates, and progress reports.</p>
                </button>
                <div className="pt-2">
                  <Link
                    to="/help-center"
                    onClick={() => setIsHelpOpen(false)}
                    className="w-full h-10 rounded-lg bg-primary text-white font-bold flex items-center justify-center hover:bg-primary-hover transition-colors"
                  >
                    Visit Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
