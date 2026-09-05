import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { TrustStrip } from './sections/TrustStrip';
import { ProblemSection } from './sections/ProblemSection';
import { ProductFlowSection } from './sections/ProductFlowSection';
import { CoreIntelligenceShowcase } from './sections/CoreIntelligenceShowcase';
import { PricingSection } from './sections/PricingSection';
import { FAQSection } from './sections/FAQSection';
import { FinalCTASection } from './sections/FinalCTASection';
import { Footer } from './components/Footer';
import { EarlyAccessModal } from './components/EarlyAccessModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './sections/AdminDashboard';
import { UserDashboard } from './sections/UserDashboard';
import { EarlyAccessFormData, UserAccount } from './types';
import { syncUserAccountApi } from './lib/adminApi';

export function App() {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<EarlyAccessFormData['interest']>('Growth Intelligence');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Check persisted login on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('genieads_user');
      if (stored) {
        const parsed: UserAccount = JSON.parse(stored);
        setCurrentUser(parsed);
        // If admin was logged in, automatically resume admin dashboard
        if (parsed.role === 'admin') {
          setCurrentView('dashboard');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleOpenEarlyAccess = (interest?: EarlyAccessFormData['interest']) => {
    if (interest) {
      setSelectedInterest(interest);
    }
    setIsEarlyAccessOpen(true);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // User requested: "admin is username and password is password is that have to render to admin dashboard"
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    if (currentUser) {
      syncUserAccountApi({
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        isLoggedIn: false,
        lastActive: 'Offline',
        status: 'Offline',
      });
    }
    localStorage.removeItem('genieads_user');
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // If user is viewing the dashboard
  if (currentUser && currentView === 'dashboard') {
    if (currentUser.role === 'admin') {
      return (
        <AdminDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onViewLanding={() => setCurrentView('landing')}
        />
      );
    }
    return (
      <UserDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onViewLanding={() => setCurrentView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6E8] text-[#2A1A18] relative overflow-x-hidden flex flex-col justify-between">
      {/* Top Global Navigation */}
      <Navbar
        onOpenEarlyAccess={handleOpenEarlyAccess}
        onOpenLoginInfo={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero onOpenEarlyAccess={() => handleOpenEarlyAccess()} />
        <TrustStrip />
        <ProblemSection />
        <ProductFlowSection />
        <CoreIntelligenceShowcase onOpenEarlyAccess={handleOpenEarlyAccess} />
        <PricingSection onOpenEarlyAccess={handleOpenEarlyAccess} />
        <FAQSection />
        <FinalCTASection onOpenEarlyAccess={() => handleOpenEarlyAccess()} />
      </main>

      {/* Footer */}
      <Footer onOpenEarlyAccess={() => handleOpenEarlyAccess()} />

      {/* Early Access Modal */}
      <EarlyAccessModal
        isOpen={isEarlyAccessOpen}
        onClose={() => setIsEarlyAccessOpen(false)}
        defaultInterest={selectedInterest}
      />

      {/* Authentication Modal (Sign in / Sign up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;

