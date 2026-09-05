import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  User, 
  Mail, 
  Building2, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from './Button';
import { UserAccount } from '../types';
import { syncUserAccountApi } from '../lib/adminApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  // Signup form state (Name, Email, Company, Password, ConfirmPassword)
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    companyBrand: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedUser = loginForm.username.trim().toLowerCase();
    const password = loginForm.password;

    if (!trimmedUser || !password) {
      setErrorMessage('Please enter both username or email and password.');
      return;
    }

    // Check for hardcoded Admin credentials: admin / password
    if (trimmedUser === 'admin' && password === 'password') {
      const adminUser: UserAccount = {
        id: 'usr_admin',
        username: 'admin',
        name: 'Administrator',
        email: 'admin@genieads.ai',
        companyBrand: 'GenieAds HQ',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('genieads_user', JSON.stringify(adminUser));
      syncUserAccountApi({
        id: 'usr_admin',
        username: 'admin',
        name: 'Administrator',
        email: 'admin@genieads.ai',
        companyBrand: 'GenieAds Admin HQ',
        role: 'admin',
        subscriptionTier: 'System Administrator' as any,
        planPrice: 0,
        isLoggedIn: true,
        lastActive: 'Active Now',
        status: 'Active Now',
      });
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    // Check stored registered users
    const existingUsersRaw = localStorage.getItem('genieads_registered_users');
    const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

    const foundUser = existingUsers.find(
      (u: any) =>
        (u.username?.toLowerCase() === trimmedUser || u.email?.toLowerCase() === trimmedUser) &&
        u.password === password
    );

    if (foundUser) {
      const userAccount: UserAccount = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
        companyBrand: foundUser.companyBrand,
        role: foundUser.role || 'user',
        subscriptionTier: foundUser.subscriptionTier,
        graphApiKey: foundUser.graphApiKey,
        graphApiAccount: foundUser.graphApiAccount,
        createdAt: foundUser.createdAt,
      };
      localStorage.setItem('genieads_user', JSON.stringify(userAccount));
      syncUserAccountApi({
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
        companyBrand: foundUser.companyBrand,
        role: foundUser.role || 'user',
        subscriptionTier: foundUser.subscriptionTier || 'Free Trial',
        planPrice: foundUser.subscriptionTier?.includes('2,499') ? 2499 : foundUser.subscriptionTier?.includes('1,499') ? 1499 : 0,
        isLoggedIn: true,
        lastActive: 'Active Now',
        status: 'Active Now',
      });
      onLoginSuccess(userAccount);
      onClose();
      return;
    }

    setErrorMessage('Invalid credentials. For Admin access use: admin / password');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupForm.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signupForm.email.trim() || !signupForm.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!signupForm.password || signupForm.password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const trimmedEmail = signupForm.email.trim().toLowerCase();

    // Prevent overriding admin username via sign up
    if (trimmedEmail === 'admin' || trimmedEmail === 'admin@genieads.ai') {
      setErrorMessage('This email is reserved for Admin. Please log in with admin / password.');
      return;
    }

    const existingUsersRaw = localStorage.getItem('genieads_registered_users');
    const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

    const userExists = existingUsers.some(
      (u: any) => u.email?.toLowerCase() === trimmedEmail || u.username?.toLowerCase() === trimmedEmail
    );

    if (userExists) {
      setErrorMessage('An account with this email already exists. Please log in.');
      return;
    }

    // Auto-generate safe username from email address
    const generatedUsername = trimmedEmail.split('@')[0].replace(/[^a-z0-9_]/g, '') || `user_${Date.now().toString().slice(-4)}`;

    const newUser = {
      id: 'usr_' + Date.now(),
      name: signupForm.name.trim(),
      email: trimmedEmail,
      username: generatedUsername,
      companyBrand: signupForm.companyBrand.trim() || 'My Brand',
      password: signupForm.password,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem('genieads_registered_users', JSON.stringify(existingUsers));

    // Sync newly registered user directly with admin backend
    syncUserAccountApi({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      companyBrand: newUser.companyBrand,
      role: 'user',
      subscriptionTier: 'Free Trial',
      planPrice: 0,
      isLoggedIn: true,
      lastActive: 'Active Now',
      createdAt: newUser.createdAt,
      phone: '',
      status: 'Active Now',
    });

    const userAccount: UserAccount = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      companyBrand: newUser.companyBrand,
      role: 'user',
      createdAt: newUser.createdAt,
    };

    localStorage.setItem('genieads_user', JSON.stringify(userAccount));
    setSuccessMessage('Account created successfully! Logging you in...');
    setTimeout(() => {
      onLoginSuccess(userAccount);
      onClose();
    }, 600);
  };

  const fillAdminCredentials = () => {
    setMode('login');
    setLoginForm({
      username: 'admin',
      password: 'password',
    });
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div
          className="fixed inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-[#FAF6E8] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#6A5652] hover:text-[#2A1A18] p-1.5 rounded-xl hover:bg-[#E8DEB7]/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#8B2626] text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs">
                GA
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B2626]">
                {mode === 'login' ? 'Authentication' : 'New Account Registration'}
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#2A1A18] tracking-tight">
              {mode === 'login' ? 'Sign in to GenieAds' : 'Join GenieAds'}
            </h3>
            <p className="text-xs text-[#6A5652] mt-1">
              {mode === 'login'
                ? 'Access your unified growth intelligence workspace or admin portal.'
                : 'Create your account to start tracking ad spend and video retention.'}
            </p>
          </div>

          {/* Tab Switcher: Login vs Sign Up */}
          <div className="flex p-1 bg-[#FFFFFF] border border-[#E8DEB7] rounded-xl mb-5 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Quick Admin Fill Helper Pill */}
          {mode === 'login' && (
            <div className="mb-4 p-2.5 rounded-xl bg-[#F1E5A1]/80 border border-[#E8DEB7] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#8B2626]">
                <Sparkles className="w-3.5 h-3.5 text-[#EF6905] shrink-0" />
                <span className="font-semibold text-[11px]">
                  Admin: <code className="font-mono font-bold bg-[#FFFFFF] px-1 py-0.5 rounded border border-[#E8DEB7]">admin</code> / <code className="font-mono font-bold bg-[#FFFFFF] px-1 py-0.5 rounded border border-[#E8DEB7]">password</code>
                </span>
              </div>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="text-[10px] font-bold text-[#EF6905] hover:underline uppercase tracking-wide cursor-pointer shrink-0 ml-2"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* Error / Success Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#8B2626]/12 border border-[#8B2626]/30 text-[#8B2626] text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#486C2F]/12 border border-[#486C2F]/30 text-[#486C2F] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2A1A18] mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Enter your email (or 'admin')"
                    className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2A1A18] placeholder:text-[#6A5652]/40 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1A18] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="password"
                    className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#2A1A18] placeholder:text-[#6A5652]/40 transition-colors shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A5652] hover:text-[#2A1A18] p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Log In
                </Button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#6A5652]">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                  className="text-xs font-bold text-[#8B2626] hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#2A1A18] mb-1">
                  Full Name <span className="text-[#EF6905]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    placeholder="Sarah Miller"
                    className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm text-[#2A1A18] placeholder:text-[#6A5652]/40 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1A18] mb-1">
                  Work Email <span className="text-[#EF6905]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="sarah@company.com"
                    className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm text-[#2A1A18] placeholder:text-[#6A5652]/40 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1A18] mb-1">
                  Company / Brand Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupForm.companyBrand}
                    onChange={(e) => setSignupForm({ ...signupForm, companyBrand: e.target.value })}
                    placeholder="Miller Wellness Co."
                    className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm text-[#2A1A18] placeholder:text-[#6A5652]/40 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2A1A18] mb-1">
                    Password <span className="text-[#EF6905]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="At least 4 chars"
                    className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2A1A18] placeholder:text-[#6A5652]/40 transition-colors shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2A1A18] mb-1">
                    Confirm Password <span className="text-[#EF6905]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2A1A18] placeholder:text-[#6A5652]/40 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Account & Enter
                </Button>
              </div>

              <div className="text-center pt-1">
                <span className="text-xs text-[#6A5652]">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-xs font-bold text-[#8B2626] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* Privacy footer info */}
          <div className="mt-6 pt-4 border-t border-[#E8DEB7] flex items-center justify-center gap-2 text-[11px] text-[#6A5652]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#486C2F]" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
