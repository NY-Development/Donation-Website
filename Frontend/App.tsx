
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Explore from './pages/Explore';
import CampaignDetail from './pages/CampaignDetail';
import Donate from './pages/Donate';
import CreateCampaign from './pages/CreateCampaign';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Success from './pages/Success';
import HowItWorks from './pages/HowItWorks';
import ForNonprofits from './pages/ForNonprofits';
import HelpCenter from './pages/HelpCenter';
import SafetyTrust from './pages/SafetyTrust';
import AboutUs from './pages/AboutUs';
import Eula from './pages/Eula';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { useAuthStore } from './store';
import { HelpCircle, X } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

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
                <ProtectedRoute>
                  <CreateCampaign />
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
                <ProtectedRoute>
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
  );
};

export default App;
