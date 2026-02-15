
import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './src/components/Navbar';
import Footer from './src/components/Footer';
import ProtectedRoute from './src/components/ProtectedRoute';
import { useAuthStore } from './src/store';
import { HelpCircle, X } from 'lucide-react';
import adminService from './src/Services/admin';

const Home = React.lazy(() => import('./src/pages/Home'));
const Explore = React.lazy(() => import('./src/pages/Explore'));
const CampaignDetail = React.lazy(() => import('./src/pages/CampaignDetail'));
const Donate = React.lazy(() => import('./src/pages/Donate'));
const CreateCampaign = React.lazy(() => import('./src/pages/CreateCampaign'));
const VerificationIntro = React.lazy(() => import('./src/pages/VerificationIntro'));
const VerificationUpload = React.lazy(() => import('./src/pages/VerificationUpload'));
const VerificationSelfie = React.lazy(() => import('./src/pages/VerificationSelfie'));
const VerificationPending = React.lazy(() => import('./src/pages/VerificationPending'));
const UserDashboard = React.lazy(() => import('./src/pages/UserDashboard'));
const AdminLayout = React.lazy(() => import('./src/pages/admin/AdminLayout'));
const AdminOverview = React.lazy(() => import('./src/pages/admin/AdminOverview'));
const AdminCampaignModeration = React.lazy(() => import('./src/pages/admin/AdminCampaignModeration'));
const AdminUserManagement = React.lazy(() => import('./src/pages/admin/AdminUserManagement'));
const AdminReports = React.lazy(() => import('./src/pages/admin/AdminReports'));
const AdminSettings = React.lazy(() => import('./src/pages/admin/AdminSettings'));
const Login = React.lazy(() => import('./src/pages/Login'));
const Signup = React.lazy(() => import('./src/pages/Signup'));
const VerifyOtp = React.lazy(() => import('./src/pages/VerifyOtp'));
const Success = React.lazy(() => import('./src/pages/Success'));
const HowItWorks = React.lazy(() => import('./src/pages/HowItWorks'));
const ForNonprofits = React.lazy(() => import('./src/pages/ForNonprofits'));
const HelpCenter = React.lazy(() => import('./src/pages/HelpCenter'));
const SafetyTrust = React.lazy(() => import('./src/pages/SafetyTrust'));
const AboutUs = React.lazy(() => import('./src/pages/AboutUs'));
const Eula = React.lazy(() => import('./src/pages/Eula'));
const Terms = React.lazy(() => import('./src/pages/Terms'));
const Privacy = React.lazy(() => import('./src/pages/Privacy'));
const ForgotPassword = React.lazy(() => import('./src/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./src/pages/ResetPassword'));
const Protection = React.lazy(() => import('./src/pages/Protection'));

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

const PageFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-500">
    Loading...
  </div>
);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    let isActive = true;
    const loadFont = async () => {
      try {
        const response = await adminService.getPublicSettings();
        const settings = response.data?.data as { fontFamily?: string } | undefined;
        if (!isActive || !settings?.fontFamily) return;
        const fontMap: Record<string, string> = {
          'Source Sans Pro': '"Source Sans Pro", sans-serif',
          Roboto: '"Roboto", sans-serif',
          'Proxima Nova': '"Proxima Nova", "Source Sans Pro", sans-serif',
          Lato: '"Lato", sans-serif'
        };
        const selected = fontMap[settings.fontFamily] ?? '"Source Sans Pro", sans-serif';
        document.documentElement.style.setProperty('--font-sans', selected);
      } catch {
        if (isActive) {
          document.documentElement.style.setProperty('--font-sans', '"Source Sans Pro", sans-serif');
        }
      }
    };

    loadFont();
    return () => {
      isActive = false;
    };
  }, []);

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
        
        <main className="grow">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/campaigns" element={<Explore />} />
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
                path="/organizer/verify"
                element={
                  <ProtectedRoute>
                    <VerificationIntro />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verIntro"
                element={
                  <ProtectedRoute>
                    <VerificationIntro />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/uploadID"
                element={
                  <ProtectedRoute>
                    <VerificationUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/liveSelfie"
                element={
                  <ProtectedRoute>
                    <VerificationSelfie />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verPending"
                element={
                  <ProtectedRoute>
                    <VerificationPending />
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
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="campaigns" element={<AdminCampaignModeration />} />
                <Route path="users" element={<AdminUserManagement />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset" element={<ResetPassword />} />
              <Route path="/success" element={<Success />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/for-nonprofits" element={<ForNonprofits />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/safety-trust" element={<SafetyTrust />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/eula" element={<Eula />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/protection" element={<Protection />} />
            </Routes>
          </Suspense>
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
            <div className="relative w-full sm:w-105 bg-white dark:bg-surface-dark rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 m-0 sm:m-4">
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
