import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles, ArrowRight, LogIn, ShieldAlert, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './Button';
import { UserAccount } from '../types';

interface NavbarProps {
  onOpenEarlyAccess: (interest?: 'Social Intelligence' | 'Growth Intelligence' | 'Managed Growth') => void;
  onOpenLoginInfo: () => void;
  currentUser?: UserAccount | null;
  onOpenDashboard?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenEarlyAccess, 
  onOpenLoginInfo,
  currentUser,
  onOpenDashboard,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Capabilities', href: '#product' },
    { label: 'Why GenieAds', href: '#problem' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF6E8]/92 backdrop-blur-xl border-b border-[#E8DEB7] shadow-xs py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#EF6905]/50 rounded-lg p-1"
          aria-label="GenieAds Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8B2626] to-[#EF6905] flex items-center justify-center text-[#FFFFFF] font-bold text-sm shadow-md shadow-[#EF6905]/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-[#F1E5A1]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#2A1A18] font-mono">
              GENIE<span className="text-[#EF6905]">ADS</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6A5652]" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className="text-[#6A5652] hover:text-[#8B2626] transition-colors duration-150 cursor-pointer focus:outline-none focus:text-[#EF6905]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#8B2626] bg-[#F1E5A1]/80 hover:bg-[#F1E5A1] border border-[#E8DEB7] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-[#EF6905]" />
                <span>
                  {currentUser.role === 'admin' 
                    ? 'Admin Dashboard' 
                    : 'Live Workspace'}
                </span>
              </button>
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 text-xs font-semibold text-[#6A5652] hover:text-[#8B2626] transition-colors flex items-center gap-1 cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenLoginInfo}
              icon={<LogIn className="w-3.5 h-3.5" />}
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser ? (
            <button
              onClick={onOpenDashboard}
              className="px-2.5 py-1.5 rounded-lg bg-[#2A1A18] text-[#FAF6E8] text-xs font-bold flex items-center gap-1"
            >
              <LayoutDashboard className="w-3 h-3 text-[#F1E5A1]" />
              <span>Dashboard</span>
            </button>
          ) : (
            <button
              onClick={onOpenLoginInfo}
              className="px-3 py-1.5 rounded-lg bg-[#8B2626] text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <LogIn className="w-3 h-3" />
              <span>Login</span>
            </button>
          )}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#6A5652] hover:text-[#2A1A18] rounded-lg hover:bg-[#F1E5A1]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#EF6905]/50"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#FAF6E8]/98 backdrop-blur-2xl border-b border-[#E8DEB7] px-4 pt-3 pb-6 space-y-4 shadow-lg shadow-[#2A1A18]/5"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="px-3 py-2.5 rounded-lg text-left text-sm font-medium text-[#2A1A18] hover:bg-[#F1E5A1]/40 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8DEB7] flex flex-col gap-2.5">
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenDashboard) onOpenDashboard();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-center text-sm font-bold text-[#8B2626] bg-[#F1E5A1]/80 hover:bg-[#F1E5A1] border border-[#E8DEB7] transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#EF6905]" />
                    <span>
                      {currentUser.role === 'admin' 
                        ? 'Open Admin Dashboard' 
                        : 'Open Live Workspace'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full py-2 px-3 rounded-xl text-center text-xs font-semibold text-[#8B2626] hover:bg-[#8B2626]/10 border border-[#8B2626]/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out ({currentUser.username})</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLoginInfo();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl text-center text-sm font-medium text-[#2A1A18] bg-[#FFFFFF] hover:bg-[#FDFBF2] border border-[#E8DEB7] transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-[#6A5652]" />
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
