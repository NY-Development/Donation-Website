
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

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
            <Route path="/create" element={<CreateCampaign />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
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
      </div>
    </HashRouter>
  );
};

export default App;
