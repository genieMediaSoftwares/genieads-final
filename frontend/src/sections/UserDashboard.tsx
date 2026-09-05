import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  DollarSign, 
  Target, 
  LogOut, 
  Eye, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Instagram, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  Check, 
  X, 
  Lock, 
  HelpCircle,
  Play,
  RotateCcw,
  Flame,
  ChevronRight,
  Sliders,
  ExternalLink,
  Smartphone,
  KeyRound,
  Loader2,
  Users,
  Heart,
  Bookmark,
  MessageSquare,
  Share2,
  Film,
  Layers,
  ArrowUpDown,
  Search,
  Download,
  ChevronLeft,
  Trophy,
  TrendingDown,
  Award
} from 'lucide-react';
import { UserAccount, PricingPlan, MetaPostItem } from '../types';
import { Button } from '../components/Button';
import { PostDiagnosisModal } from '../components/PostDiagnosisModal';
import { TrendsVsProfileView } from '../components/TrendsVsProfileView';
import { recordPaymentApi, syncUserAccountApi } from '../lib/adminApi';

interface UserDashboardProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onViewLanding: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  onLogout,
  onViewLanding,
}) => {
  // Navigation tabs: 'onboarding' (Journey & Perks + Payment) vs 'workspace' (Live intelligence)
  const [activeTab, setActiveTab] = useState<'onboarding' | 'workspace'>(
    currentUser.subscriptionTier ? 'workspace' : 'onboarding'
  );

  // Local user state reflecting subscription updates
  const [user, setUser] = useState<UserAccount>(currentUser);

  // Currency & Billing state for payment options
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    price: string;
    numericPrice: number;
    period: string;
    features: string[];
    isPopular?: boolean;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Graph API Key & Connection state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [graphApiKeyInput, setGraphApiKeyInput] = useState(user.graphApiKey || '');
  const [isFetchingAccount, setIsFetchingAccount] = useState(false);
  const [graphApiError, setGraphApiError] = useState('');
  const [graphApiSuccess, setGraphApiSuccess] = useState(
    user.graphApiKey ? 'Graph API verified & active. 24h telemetry streaming.' : ''
  );

  // Filter, Search, Sorting & Pagination for connected posts
  const [postFilter, setPostFilter] = useState<'ALL' | 'VIDEO' | 'IMAGE'>('ALL');
  const [performanceCategory, setPerformanceCategory] = useState<'ALL' | 'TOP_15' | 'BOTTOM_15' | 'TRENDS_VS_PROFILE'>('ALL');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [postSort, setPostSort] = useState<'views' | 'watchTime' | 'saves' | 'likes' | 'comments' | 'latest' | 'oldest'>('views');
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [postsPerPage, setPostsPerPage] = useState<number | 'ALL'>(9);
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [selectedInspectPost, setSelectedInspectPost] = useState<MetaPostItem | null>(null);
  const [selectedInspectRank, setSelectedInspectRank] = useState<{ type: 'top' | 'bottom'; rank: number } | null>(null);
  const [selectedDiagnosisPost, setSelectedDiagnosisPost] = useState<MetaPostItem | null>(null);
  const [selectedDiagnosisRank, setSelectedDiagnosisRank] = useState<{ type: 'top' | 'bottom'; rank: number } | null>(null);

  const resolvePostViews = (p: MetaPostItem): number => {
    if (typeof p.views === 'number' && p.views > 0) return p.views;
    const likes = p.likes || 0;
    const comments = p.comments || 0;
    const reach = p.reach || 0;
    if (p.mediaType === 'VIDEO') {
      return Math.max(Math.round(likes * 24 + comments * 6), reach || 0);
    }
    if (p.mediaType === 'CAROUSEL_ALBUM') {
      return Math.max(Math.round(likes * 20 + comments * 5), Math.round((reach || 0) * 1.35));
    }
    return Math.max(Math.round(likes * 15 + comments * 4), Math.round((reach || 0) * 1.2));
  };

  const handleExportPostsCSV = (postsToExport: MetaPostItem[], filenameLabel = 'posts_telemetry') => {
    if (!postsToExport || postsToExport.length === 0) return;
    const headers = ['Rank', 'Post ID', 'Media Type', 'Caption', 'Published Date', 'Views / Impressions', 'Watch Duration (sec)', 'Likes', 'Comments', 'Saves', 'Shares', 'Reach', 'Engagement Rate', 'URL'];
    const rows = postsToExport.map((p, idx) => [
      `"#${idx + 1}"`,
      `"${p.id}"`,
      `"${p.mediaType}"`,
      `"${(p.caption || '').replace(/"/g, '""')}"`,
      `"${p.formattedDate}"`,
      resolvePostViews(p),
      p.watchTimeSeconds || 0,
      p.likes || 0,
      p.comments || 0,
      p.saves || 0,
      p.shares || 0,
      p.reach || 0,
      `"${p.engagementRate || '0%'}"`,
      `"${p.permalink || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meta_${filenameLabel}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFetchAccount = async (keyToUse?: string) => {
    const token = (keyToUse !== undefined ? keyToUse : graphApiKeyInput).trim();
    setGraphApiError('');
    setGraphApiSuccess('');

    if (!token) {
      setGraphApiError('Please enter your Meta Graph API Access Key / User Token.');
      return;
    }

    if (token.length < 8) {
      setGraphApiError('Token appears too short. Meta Graph API tokens usually begin with EAA... and contain 40+ characters.');
      return;
    }

    setIsFetchingAccount(true);

    try {
      const response = await fetch('/api/meta/fetch-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setIsFetchingAccount(false);
        setGraphApiError(result.message || result.errors?.message || 'Failed to fetch Meta profile. Please verify your token and permissions.');
        return;
      }

      const metaData = result.data;
      const graphAccount = {
        profileName: metaData.name,
        followersCount: metaData.followersCount,
        formattedFollowers: metaData.formattedFollowers,
        username: metaData.username,
        profilePictureUrl: metaData.profilePictureUrl,
        accountType: metaData.accountType,
        mediaCount: metaData.mediaCount,
        accountId: metaData.adAccountId || metaData.id,
        accountName: metaData.name,
        adAccountId: metaData.adAccountId,
        adAccountName: metaData.adAccountName,
        businessManagerId: metaData.businessManagerId,
        currency: metaData.currency || (currency === 'INR' ? 'INR (₹)' : 'USD ($)'),
        status: metaData.status || 'Active & Verified ✓',
        syncedAt: metaData.syncedAt || 'Just now',
        isDemo: Boolean(metaData.isDemo),
        posts: (metaData.posts as MetaPostItem[]) || [],
      };

      const updatedUser: UserAccount = {
        ...user,
        graphApiKey: token,
        graphApiAccount: graphAccount,
      };

      setUser(updatedUser);
      localStorage.setItem('genieads_user', JSON.stringify(updatedUser));

      try {
        const storedUsersRaw = localStorage.getItem('genieads_registered_users');
        if (storedUsersRaw) {
          const storedUsers: any[] = JSON.parse(storedUsersRaw);
          const updatedList = storedUsers.map((u) =>
            u.username === updatedUser.username
              ? { ...u, graphApiKey: token, graphApiAccount: graphAccount }
              : u
          );
          localStorage.setItem('genieads_registered_users', JSON.stringify(updatedList));
        }
      } catch (e) {
        console.error(e);
      }

      setIsFetchingAccount(false);
      const followerText = metaData.formattedFollowers || (metaData.followersCount ? metaData.followersCount.toLocaleString() : '0');
      setGraphApiSuccess(
        `Meta Profile Connected: "${metaData.name}" with ${followerText} followers.`
      );
    } catch (err: any) {
      setIsFetchingAccount(false);
      setGraphApiError(err.message || 'Network error while contacting Meta Graph API.');
    }
  };

  const handleDisconnectGraphApi = () => {
    const updatedUser: UserAccount = {
      ...user,
      graphApiKey: undefined,
      graphApiAccount: undefined,
    };
    setUser(updatedUser);
    setGraphApiKeyInput('');
    setGraphApiSuccess('');
    setGraphApiError('');
    localStorage.setItem('genieads_user', JSON.stringify(updatedUser));
  };

  // Plans data
  const pricingPlans = [
    {
      id: 'plan-social',
      name: 'Social Intelligence',
      tier: 'Social Intelligence' as const,
      price: currency === 'INR' 
        ? (billingCycle === 'annual' ? '₹1,199' : '₹1,499') 
        : (billingCycle === 'annual' ? '$15' : '$19'),
      numericPrice: currency === 'INR' ? (billingCycle === 'annual' ? 1199 : 1499) : (billingCycle === 'annual' ? 15 : 19),
      period: '/ month',
      description: 'For creators & brands focused on mastering organic video reach, hook retention, and audience growth.',
      features: [
        'Instagram & Reels organic diagnostics',
        '3-second hook retention scores',
        'Top vs bottom post breakdowns ("Why" engine)',
        'Content DNA Blueprint & formula extraction',
        'AI trend opportunities & content radar',
        'Live Growth Score benchmark',
        '24-hour automated data sync',
      ],
      ctaText: 'Start with Social',
    },
    {
      id: 'plan-growth',
      name: 'Growth Intelligence',
      tier: 'Growth Intelligence' as const,
      price: currency === 'INR' 
        ? (billingCycle === 'annual' ? '₹1,999' : '₹2,499') 
        : (billingCycle === 'annual' ? '$31' : '$39'),
      numericPrice: currency === 'INR' ? (billingCycle === 'annual' ? 1999 : 2499) : (billingCycle === 'annual' ? 31 : 39),
      period: '/ month',
      isPopular: true,
      badge: 'RECOMMENDED',
      description: 'For scaling brands connecting creative video performance with paid Meta & Google Ads conversion.',
      features: [
        'Everything in Social Intelligence',
        'Meta Ads & Google Ads intelligence layer',
        'Real-time ad spend fatigue alerts',
        'Daily Prioritized Action Playbook',
        'Cross-channel budget shift recommendations',
        'Lead quality & CPA drop-off tracking',
        'Priority new feature updates',
      ],
      ctaText: 'Get Growth Intelligence',
    },
    {
      id: 'plan-managed',
      name: 'Zero → Hero Managed',
      tier: 'Managed Growth' as const,
      price: currency === 'INR' 
        ? (billingCycle === 'annual' ? '₹35,000' : '₹45,000') 
        : (billingCycle === 'annual' ? '$479' : '$599'),
      numericPrice: currency === 'INR' ? (billingCycle === 'annual' ? 35000 : 45000) : (billingCycle === 'annual' ? 479 : 599),
      period: '/ month',
      badge: 'FULL AGENCY EXECUTION',
      description: 'Hands-on digital growth execution. Our elite team handles scripting, shooting, editing, and ad scaling for you.',
      features: [
        'Complete end-to-end growth strategy',
        'High-converting video scripting & hooks',
        'On-site video production & direction',
        'High-retention video editing & motion design',
        'Meta & Google Ads media buying management',
        'Full-funnel conversion rate optimization',
        'Dedicated growth strategist & weekly syncs',
      ],
      ctaText: 'Activate Managed Growth',
    },
  ];

  const handleOpenCheckout = (plan: typeof pricingPlans[0]) => {
    setSelectedPlan(plan);
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponMessage('');
    setPaymentSuccess(false);
    setIsCheckoutOpen(true);
  };

  const handleApplyCoupon = () => {
    if (!selectedPlan) return;
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'GENIE50' || cleanCode === 'GROWTH50') {
      const discountVal = Math.round(selectedPlan.numericPrice * 0.5);
      setCouponDiscount(discountVal);
      setCouponApplied(true);
      setCouponMessage('🎉 Promo code applied! 50% off your first month.');
    } else if (cleanCode === 'EARLY20') {
      const discountVal = Math.round(selectedPlan.numericPrice * 0.2);
      setCouponDiscount(discountVal);
      setCouponApplied(true);
      setCouponMessage('🎉 Promo code applied! 20% early-bird discount.');
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponMessage('❌ Invalid promo code. Try "GENIE50" for 50% off.');
    }
  };

  const handleProcessPayment = () => {
    if (!selectedPlan) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      // Update user subscription
      const updatedUser: UserAccount = {
        ...user,
        subscriptionTier: selectedPlan.tier,
      };
      setUser(updatedUser);

      // Save to localStorage
      localStorage.setItem('genieads_user', JSON.stringify(updatedUser));

      // Record real transaction in Admin payment ledger
      const paidAmount = Math.max(0, selectedPlan.numericPrice - couponDiscount);
      const isSocial1499 = selectedPlan.id === 'plan-starter' || selectedPlan.numericPrice === 1499;
      const isGrowth2499 = selectedPlan.id === 'plan-pro' || selectedPlan.numericPrice === 2499;
      const planTierLabel = isSocial1499 
        ? 'Social Intelligence (₹1,499)' 
        : isGrowth2499 
          ? 'Growth Intelligence (₹2,499)' 
          : 'Zero → Hero Managed (Custom)';

      recordPaymentApi({
        userId: user.id || 'usr_' + user.username,
        customerName: user.name || user.username,
        customerEmail: user.email,
        companyBrand: user.companyBrand || user.instagramData?.handle || 'Growth Brand',
        planTier: planTierLabel as any,
        planPrice: selectedPlan.numericPrice,
        grossAmount: paidAmount,
        discountAmount: couponDiscount,
        currency: 'INR',
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit Card' : 'NetBanking',
        settlementStatus: 'Yet to Credit',
      });

      // Update registered user in Admin backend
      syncUserAccountApi({
        id: user.id || 'usr_' + user.username,
        name: user.name || user.username,
        username: user.username,
        email: user.email,
        companyBrand: user.companyBrand || user.instagramData?.handle || 'Growth Brand',
        role: user.role || 'user',
        subscriptionTier: planTierLabel as any,
        planPrice: selectedPlan.numericPrice,
        isLoggedIn: true,
        lastActive: 'Active Now',
        status: 'Active Now',
      });

      // Update in registered users list
      try {
        const storedUsersRaw = localStorage.getItem('genieads_registered_users');
        if (storedUsersRaw) {
          const storedUsers: any[] = JSON.parse(storedUsersRaw);
          const updatedList = storedUsers.map((u) => 
            u.username === updatedUser.username ? { ...u, subscriptionTier: selectedPlan.tier } : u
          );
          localStorage.setItem('genieads_registered_users', JSON.stringify(updatedList));
        }
      } catch (e) {
        console.error(e);
      }
    }, 1200);
  };

  const handleFinishCheckoutAndEnterWorkspace = () => {
    setIsCheckoutOpen(false);
    setActiveTab('workspace');
  };

  return (
    <div className="min-h-screen bg-[#FAF6E8] text-[#2A1A18] flex flex-col font-sans">
      {/* TOP DASHBOARD HEADER */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E8DEB7] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo & Workspace Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#8B2626] flex items-center justify-center text-white font-black text-sm font-mono shadow-xs">
              GA
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-lg tracking-tight font-mono text-[#2A1A18]">
                GENIE<span className="text-[#EF6905]">ADS</span>
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F1E5A1] text-[#8B2626]">
                GROWTH PIPELINE
              </span>
            </div>
          </div>

          {/* Header Workspace Status Indicator - Once live workspace enabled, Start Journey & Perks navigation is removed */}
          {user.subscriptionTier ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7]">
              <span className="w-2 h-2 rounded-full bg-[#486C2F] animate-pulse" />
              <span className="text-xs font-bold text-[#2A1A18] font-mono">Live Workspace</span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F]">
                {user.subscriptionTier}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7]">
              <Sparkles className="w-3.5 h-3.5 text-[#EF6905]" />
              <span className="text-xs font-bold text-[#8B2626]">Onboarding: Choose Growth Tier</span>
            </div>
          )}

          {/* User & Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onViewLanding}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6A5652] hover:text-[#2A1A18] bg-[#FAF6E8] hover:bg-[#E8DEB7]/60 border border-[#E8DEB7] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#EF6905]" />
              <span>Public Site</span>
            </button>

            {user.graphApiKey && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#486C2F]/10 border border-[#486C2F]/30 text-xs">
                <KeyRound className="w-3.5 h-3.5 text-[#486C2F]" />
                <span className="font-mono font-bold text-[#486C2F]">Graph API: Connected ✓</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] text-xs">
              <div className="w-2 h-2 rounded-full bg-[#486C2F]" />
              <span className="font-bold text-[#2A1A18] truncate max-w-[100px] sm:max-w-[140px]">{user.name}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-[#8B2626] hover:bg-[#8B2626]/10 border border-[#8B2626]/30 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 inline-block sm:mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ========================================================================= */}
        {/* TAB 1: ENGAGING ONBOARDING LANDING PAGE (PERKS + START JOURNEY + PAYMENT) */}
        {/* ========================================================================= */}
        {activeTab === 'onboarding' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* HERO WELCOME BANNER */}
            <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#F1E5A1]/40 via-[#EF6905]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#F1E5A1] text-[#8B2626] border border-[#E8DEB7]">
                    <Sparkles className="w-3.5 h-3.5 text-[#EF6905]" />
                    <span>ONBOARDING ACTIVATION PORTAL</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2A1A18] tracking-tight leading-tight">
                    Welcome to GenieAds, <span className="text-[#8B2626]">{user.name.split(' ')[0]}</span>!
                  </h1>

                  <p className="text-sm sm:text-base text-[#6A5652] leading-relaxed">
                    You've successfully created your workspace for <strong className="text-[#2A1A18]">{user.companyBrand || 'Your Brand'}</strong>. 
                    Unlock the full intelligence engine below to run 3-second hook retention diagnostics, eliminate ad fatigue, and scale Meta & Google revenue.
                  </p>

                  {/* Connected Instagram Highlight Banner */}
                  {user.instagramHandle ? (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 border border-[#DD2A7B]/30 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-0.5 flex items-center justify-center shadow-xs">
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-[#2A1A18] text-xs">
                            {user.instagramHandle.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#2A1A18]">@{user.instagramHandle}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#486C2F]/15 text-[#486C2F]">
                              Instagram Synced
                            </span>
                          </div>
                          <div className="text-xs text-[#6A5652] mt-0.5">
                            {user.instagramData?.followers || 'Active'} followers • {user.instagramData?.reelsCount || 24} reels queued for 3-second hook analysis
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-[#8B2626] bg-[#FFFFFF] px-3 py-1.5 rounded-xl border border-[#E8DEB7] shadow-2xs">
                        Hook Diagnostic Ready
                      </span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-[#EF6905]" />
                        <span className="text-[#6A5652]">No Instagram handle linked yet. You can sync your profile in settings anytime.</span>
                      </div>
                      <span className="font-bold text-[#8B2626]">Optional</span>
                    </div>
                  )}
                </div>

                {/* Quick Status / Plan Box */}
                <div className="w-full lg:w-72 bg-[#FAF6E8] border border-[#E8DEB7] rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6A5652] uppercase tracking-wider">Account Status</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#486C2F]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Member
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E8DEB7]">
                    <div className="text-xs text-[#6A5652]">Current Growth Tier:</div>
                    <div className="text-lg font-black text-[#2A1A18] mt-0.5">
                      {user.subscriptionTier ? user.subscriptionTier : 'Setup Mode (Free Preview)'}
                    </div>
                  </div>

                  {user.subscriptionTier ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => setActiveTab('workspace')}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Enter Live Workspace
                    </Button>
                  ) : (
                    <a
                      href="#payment-plans"
                      className="block w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-[#FFFFFF] bg-[#8B2626] hover:bg-[#721F1F] transition-all shadow-xs"
                    >
                      Choose Plan & Activate
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* "START YOUR JOURNEY" 4-STEP INTERACTIVE ROADMAP */}
            <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2A1A18] tracking-tight flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#EF6905]" />
                    <span>Start Your Growth Journey</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6A5652] mt-1">
                    Follow these 4 clear milestones to transition from organic guesswork to automated, high-ROAS ad campaigns.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-[#8B2626] bg-[#F1E5A1]/80 px-3 py-1 rounded-full self-start sm:self-auto border border-[#E8DEB7]">
                  {user.subscriptionTier ? 'Step 3 of 4 Ready' : 'Step 2 of 4 Action Required'}
                </div>
              </div>

              {/* Progress Stepper Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-[#FAF6E8] border border-[#486C2F]/40 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-black uppercase text-[#486C2F] bg-[#486C2F]/10 px-2 py-0.5 rounded-full">
                      Step 1 • Completed
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#486C2F]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2A1A18]">Create Brand Account</h4>
                  <p className="text-xs text-[#6A5652] mt-1 leading-relaxed">
                    Account configured for {user.companyBrand || user.name}.
                  </p>
                </div>

                {/* Step 2 */}
                <div className={`p-4 rounded-2xl relative overflow-hidden ${
                  user.subscriptionTier 
                    ? 'bg-[#FAF6E8] border border-[#486C2F]/40' 
                    : 'bg-[#F1E5A1]/30 border-2 border-[#EF6905] shadow-xs'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                      user.subscriptionTier ? 'text-[#486C2F] bg-[#486C2F]/10' : 'text-[#8B2626] bg-[#F1E5A1]'
                    }`}>
                      Step 2 • {user.subscriptionTier ? 'Completed' : 'Current Action'}
                    </span>
                    {user.subscriptionTier ? (
                      <CheckCircle2 className="w-4 h-4 text-[#486C2F]" />
                    ) : (
                      <Flame className="w-4 h-4 text-[#EF6905] animate-pulse" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-[#2A1A18]">Choose Growth Plan</h4>
                  <p className="text-xs text-[#6A5652] mt-1 leading-relaxed">
                    {user.subscriptionTier 
                      ? `Active on ${user.subscriptionTier}. Workspace unlocked!` 
                      : 'Select Social or Growth Intelligence to unlock real-time hook analytics.'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className={`p-4 rounded-2xl relative overflow-hidden ${
                  user.graphApiKey
                    ? 'bg-[#FAF6E8] border border-[#486C2F]/40'
                    : 'bg-[#FAF6E8] border border-[#E8DEB7]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-black uppercase text-[#6A5652] bg-[#FFFFFF] px-2 py-0.5 rounded-full border border-[#E8DEB7]">
                      Step 3 • Pipeline
                    </span>
                    <Clock className="w-4 h-4 text-[#6A5652]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2A1A18]">Connect Ad Accounts</h4>
                  <p className="text-xs text-[#6A5652] mt-1 leading-relaxed">
                    Link Meta Graph API and Google Ads to track cross-channel CPA.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-black uppercase text-[#6A5652] bg-[#FFFFFF] px-2 py-0.5 rounded-full border border-[#E8DEB7]">
                      Step 4 • Daily Routine
                    </span>
                    <TrendingUp className="w-4 h-4 text-[#6A5652]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2A1A18]">Execute 3 Daily Moves</h4>
                  <p className="text-xs text-[#6A5652] mt-1 leading-relaxed">
                    Receive your 8:00 AM prioritized action playbook to scale winning creatives.
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* PERKS OF USING GENIEADS (SIMPLIFIED, HIGHLY ENGAGING SHOWCASE) */}
            {/* ================================================================= */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1] text-[#8B2626] border border-[#E8DEB7]">
                  <Zap className="w-3.5 h-3.5 text-[#EF6905]" />
                  <span>UNFAIR ADVANTAGES FOR YOUR BRAND</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#2A1A18] tracking-tight">
                  Why Fast-Growing Brands Run on GenieAds
                </h2>
                <p className="text-xs sm:text-sm text-[#6A5652]">
                  We eliminated complex dashboards and vanity metrics. Here are the 4 game-changing perks you get inside:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Perk 1 */}
                <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 hover:border-[#EF6905] transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#8B2626]/10 border border-[#8B2626]/20 flex items-center justify-center text-[#8B2626]">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2A1A18]">
                      1. The 3-Second Hook Retention Engine
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6A5652] mt-1.5 leading-relaxed">
                      73% of viewers swipe away on Instagram Reels and TikTok ads before second 3. GenieAds identifies the exact frame where attention drops and generates 5 data-backed script hooks that hold attention past second 10.
                    </p>
                  </div>

                  {/* Interactive Mini Visual Widget */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#2A1A18]">Hook Attention Retention</span>
                      <span className="font-mono text-[#486C2F] font-black">+225% Watch Time</span>
                    </div>
                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[11px] text-[#6A5652] mb-0.5">
                          <span>Standard Organic Hook</span>
                          <span>24% held at 3s</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#E8DEB7] overflow-hidden">
                          <div className="w-[24%] h-full bg-[#6A5652]/60" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-[#8B2626] mb-0.5">
                          <span>GenieAds Optimized Hook</span>
                          <span>78% held at 3s</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#E8DEB7] overflow-hidden">
                          <div className="w-[78%] h-full bg-gradient-to-r from-[#EF6905] to-[#8B2626]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perk 2 */}
                <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 hover:border-[#EF6905] transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#EF6905]/10 border border-[#EF6905]/20 flex items-center justify-center text-[#EF6905]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2A1A18]">
                      2. 24/7 Ad Fatigue & CPA Defense Radar
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6A5652] mt-1.5 leading-relaxed">
                      Never wake up to burned-out ad spend again. Our engine monitors audience saturation and frequency signals, automatically warning you before CPA surges so you can swap hooks seamlessly.
                    </p>
                  </div>

                  {/* Interactive Mini Visual Widget */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2A1A18]">Creative #04 Saturated</div>
                        <div className="text-[11px] text-[#6A5652]">Frequency 3.8 • CPA jumped 38%</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#8B2626] text-white whitespace-nowrap">
                      Rotate Creative
                    </span>
                  </div>
                </div>

                {/* Perk 3 */}
                <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 hover:border-[#EF6905] transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#486C2F]/10 border border-[#486C2F]/20 flex items-center justify-center text-[#486C2F]">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2A1A18]">
                      3. Morning Action Playbook (3 Daily Moves)
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6A5652] mt-1.5 leading-relaxed">
                      Stop staring at 40 conflicting columns in Meta Ads Manager. Every morning at 8:00 AM, GenieAds delivers 3 straightforward actions strictly ranked by estimated cash return.
                    </p>
                  </div>

                  {/* Interactive Mini Visual Widget */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-[#2A1A18]">
                      <span className="w-4 h-4 rounded-full bg-[#486C2F] text-white flex items-center justify-center text-[10px] font-black">1</span>
                      <span className="font-semibold">Scale Meta Campaign B by 25% (+₹18k ROI)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6A5652]">
                      <span className="w-4 h-4 rounded-full bg-[#E8DEB7] text-[#6A5652] flex items-center justify-center text-[10px] font-black">2</span>
                      <span>Cut underperforming Reel angle #02</span>
                    </div>
                  </div>
                </div>

                {/* Perk 4 */}
                <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 hover:border-[#EF6905] transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#F1E5A1] border border-[#E8DEB7] flex items-center justify-center text-[#8B2626]">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2A1A18]">
                      4. 3.4× Blended ROAS Multiplier
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6A5652] mt-1.5 leading-relaxed">
                      Bridge the gap between viral organic video and paid advertising. Turn your best-performing organic hooks into winning Meta & Google Ads with zero creative friction.
                    </p>
                  </div>

                  {/* Interactive Mini Visual Widget */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-[#6A5652] uppercase tracking-wider">Average Customer ROAS</div>
                      <div className="text-2xl font-black font-mono text-[#2A1A18]">3.42× Blended</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#486C2F] bg-[#486C2F]/15">
                      +1.8× vs Industry Avg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* DIRECT PAYMENT OPTIONS SECTION ("RENDER PAYMENT OPTIONS") */}
            {/* ================================================================= */}
            <div id="payment-plans" className="pt-6 space-y-8 scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1] text-[#8B2626] border border-[#E8DEB7]">
                  <CreditCard className="w-3.5 h-3.5 text-[#EF6905]" />
                  <span>STEP 2: CHOOSE YOUR GROWTH TIER</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#2A1A18] tracking-tight">
                  Activate Your GenieAds Intelligence Pipeline
                </h2>
                <p className="text-xs sm:text-sm text-[#6A5652]">
                  Select the plan that fits your growth stage. Transparent pricing, no hidden fees, cancel anytime.
                </p>

                {/* Currency & Billing Toggle Switches */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  {/* Billing Cycle Switch */}
                  <div className="inline-flex p-1 bg-[#FFFFFF] border border-[#E8DEB7] rounded-xl shadow-2xs">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        billingCycle === 'monthly'
                          ? 'bg-[#8B2626] text-white shadow-xs'
                          : 'text-[#6A5652] hover:text-[#2A1A18]'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('annual')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        billingCycle === 'annual'
                          ? 'bg-[#8B2626] text-white shadow-xs'
                          : 'text-[#6A5652] hover:text-[#2A1A18]'
                      }`}
                    >
                      <span>Annual</span>
                      <span className="text-[10px] bg-[#F1E5A1] text-[#8B2626] px-1.5 py-0.2 rounded font-black">
                        SAVE 20%
                      </span>
                    </button>
                  </div>

                  {/* Currency Switch */}
                  <div className="inline-flex p-1 bg-[#FFFFFF] border border-[#E8DEB7] rounded-xl shadow-2xs">
                    <button
                      onClick={() => setCurrency('INR')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        currency === 'INR'
                          ? 'bg-[#EF6905] text-white shadow-xs'
                          : 'text-[#6A5652] hover:text-[#2A1A18]'
                      }`}
                    >
                      ₹ INR
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-[#EF6905] text-white shadow-xs'
                          : 'text-[#6A5652] hover:text-[#2A1A18]'
                      }`}
                    >
                      $ USD
                    </button>
                  </div>
                </div>
              </div>

              {/* PRICING CARDS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {pricingPlans.map((plan) => {
                  const isCurrent = user.subscriptionTier === plan.tier;
                  return (
                    <div
                      key={plan.id}
                      className={`bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                        plan.isPopular
                          ? 'border-2 border-[#EF6905] shadow-lg ring-4 ring-[#EF6905]/10'
                          : 'border border-[#E8DEB7] shadow-xs hover:border-[#8B2626]'
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#EF6905] text-white font-black text-[10px] uppercase tracking-wider py-1 px-3 rounded-full shadow-xs">
                          {plan.badge}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-[#2A1A18] tracking-tight">{plan.name}</h3>
                          {isCurrent && (
                            <span className="text-[10px] font-bold bg-[#486C2F]/15 text-[#486C2F] px-2 py-0.5 rounded-full">
                              Current Plan
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#6A5652] leading-relaxed min-h-[36px]">
                          {plan.description}
                        </p>

                        <div className="pt-2 flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-black font-mono text-[#2A1A18]">
                            {plan.price}
                          </span>
                          <span className="text-xs text-[#6A5652] font-semibold">{plan.period}</span>
                        </div>

                        <div className="pt-4 border-t border-[#E8DEB7] space-y-2.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A5652] block">
                            Included in this tier:
                          </span>
                          <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-[#2A1A18]">
                                <Check className="w-4 h-4 text-[#486C2F] flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-[#E8DEB7]">
                        {isCurrent ? (
                          <Button
                            variant="secondary"
                            size="md"
                            className="w-full bg-[#486C2F]/10 text-[#486C2F] border-[#486C2F]/30"
                            onClick={() => setActiveTab('workspace')}
                          >
                            Plan Active • Go to Workspace
                          </Button>
                        ) : (
                          <Button
                            variant={plan.isPopular ? 'primary' : 'secondary'}
                            size="md"
                            className="w-full"
                            icon={<ArrowRight className="w-4 h-4" />}
                            onClick={() => handleOpenCheckout(plan)}
                          >
                            {plan.ctaText}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Guarantees & Trust Badge */}
              <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#486C2F]/10 text-[#486C2F] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2A1A18]">14-Day Money-Back Guarantee</h4>
                    <p className="text-xs text-[#6A5652]">
                      If you don't detect at least 3 winning hooks or save 15%+ on ad spend in 14 days, get a full refund.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#6A5652]">
                  <span className="flex items-center gap-1 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-[#486C2F]" />
                    256-Bit Encrypted
                  </span>
                  <span>•</span>
                  <span>Instant Activation</span>
                  <span>•</span>
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LIVE GROWTH WORKSPACE (GRAPH API, DATA, HOOK METRICS, ACTIVE AD CAMPAIGNS) */}
        {/* ========================================================================= */}
        {activeTab === 'workspace' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Workspace Header */}
            <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1]/80 text-[#8B2626] border border-[#E8DEB7] mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#EF6905]" />
                    <span>LIVE CONNECTED PIPELINE</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#2A1A18] tracking-tight">
                    {user.companyBrand || user.name}'s Growth Workspace
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6A5652] mt-1">
                    Unified intelligence across Meta Ads Manager, Instagram Reels Graph, and Creative Hook Telemetry.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant={user.graphApiKey ? "secondary" : "glow"}
                    size="sm"
                    icon={user.graphApiKey ? <CheckCircle2 className="w-4 h-4 text-[#486C2F]" /> : <KeyRound className="w-4 h-4" />}
                    onClick={() => setIsConnectModalOpen(true)}
                  >
                    {user.graphApiKey ? 'Graph API Config' : 'Connect Graph API'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={() => {
                      if (user.graphApiKey) {
                        handleFetchAccount();
                      } else {
                        alert("Please connect your Meta Graph API Key below to sync live accounts.");
                      }
                    }}
                  >
                    Refresh Sync
                  </Button>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* DEDICATED GRAPH API KEY CONNECTION SECTION */}
            {/* ========================================================================= */}
            <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#8B2626]/10 border border-[#8B2626]/20 flex items-center justify-center text-[#8B2626] shrink-0">
                    <KeyRound className="w-5 h-5 text-[#8B2626]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-black text-[#2A1A18] tracking-tight">
                        Connect Your Meta Graph API Key
                      </h3>
                      {user.graphApiKey && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#486C2F]/15 text-[#486C2F] border border-[#486C2F]/30">
                          Account Connected ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6A5652] mt-0.5">
                      Enter your Graph API access key below to fetch your Meta ad account telemetry and reel hook metrics.
                    </p>
                  </div>
                </div>

                {user.graphApiKey && (
                  <button
                    onClick={handleDisconnectGraphApi}
                    className="text-xs font-bold text-[#8B2626] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Disconnect Account</span>
                  </button>
                )}
              </div>

              {/* Simple Option: Key input followed by "Fetch account" button */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6A5652]">
                      <KeyRound className="w-4 h-4 text-[#6A5652]" />
                    </div>
                    <input
                      type="text"
                      value={graphApiKeyInput}
                      onChange={(e) => {
                        setGraphApiKeyInput(e.target.value);
                        if (graphApiError) setGraphApiError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleFetchAccount();
                        }
                      }}
                      placeholder="Enter Graph API Key (starts with EAA...)"
                      className="w-full bg-[#FAF6E8]/70 border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm font-mono text-[#2A1A18] placeholder:text-[#6A5652]/50 transition-colors shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const demoToken = 'EAABwzL1o9ZB8BALv94Y7q0DemoKeyLivev19Stream';
                        setGraphApiKeyInput(demoToken);
                        handleFetchAccount(demoToken);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#EF6905] hover:text-[#8B2626] bg-[#FFFFFF] border border-[#E8DEB7] px-2 py-1 rounded-lg hover:bg-[#FAF6E8] cursor-pointer"
                      title="Use sample Meta token to fetch immediately"
                    >
                      Sample Key
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    disabled={isFetchingAccount}
                    onClick={() => handleFetchAccount()}
                    icon={isFetchingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    className="shrink-0"
                  >
                    {isFetchingAccount ? 'Fetching Account...' : 'Fetch Account'}
                  </Button>
                </div>

                {/* Error Banner */}
                {graphApiError && (
                  <div className="p-3 rounded-xl bg-[#8B2626]/12 border border-[#8B2626]/30 text-[#8B2626] text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#8B2626]" />
                    <span>{graphApiError}</span>
                  </div>
                )}

                {/* Success / Connected Account Banner */}
                {user.graphApiAccount && (
                  <div className="p-5 rounded-2xl bg-[#FAF6E8] border-2 border-[#486C2F]/40 space-y-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Left: Avatar + Profile Name + Username + Account Type */}
                      <div className="flex items-center gap-3.5">
                        {user.graphApiAccount.profilePictureUrl ? (
                          <img
                            src={user.graphApiAccount.profilePictureUrl}
                            alt={user.graphApiAccount.profileName || 'Meta Profile'}
                            className="w-14 h-14 rounded-full object-cover border-2 border-[#486C2F]/30 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-[#486C2F]/15 border-2 border-[#486C2F]/30 flex items-center justify-center font-bold text-lg text-[#486C2F]">
                            {(user.graphApiAccount.profileName || user.name || 'M').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base sm:text-lg font-black text-[#2A1A18] tracking-tight">
                              {user.graphApiAccount.profileName || user.graphApiAccount.accountName || user.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#486C2F]/15 text-[#486C2F] border border-[#486C2F]/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#486C2F]" />
                              <span>Meta Verified ✓</span>
                            </span>
                            {user.graphApiAccount.isDemo && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1E5A1] text-[#8B2626] border border-[#E8DEB7]">
                                Demo Mode
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#6A5652] mt-0.5 flex-wrap">
                            {user.graphApiAccount.username && (
                              <span className="font-mono font-bold text-[#8B2626]">
                                @{user.graphApiAccount.username}
                              </span>
                            )}
                            <span>•</span>
                            <span className="text-[#6A5652]">
                              {user.graphApiAccount.accountType || 'Instagram Business Account'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Realistic Followers Count Badge */}
                      <div className="flex items-center gap-3 bg-[#FFFFFF] px-4 py-2.5 rounded-xl border border-[#E8DEB7] shadow-2xs">
                        <div className="w-9 h-9 rounded-lg bg-[#8B2626]/10 flex items-center justify-center text-[#8B2626]">
                          <Users className="w-5 h-5 text-[#8B2626]" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider font-bold text-[#6A5652]">
                            Followers
                          </div>
                          <div className="text-lg sm:text-xl font-black font-mono text-[#2A1A18]">
                            {user.graphApiAccount.formattedFollowers || (user.graphApiAccount.followersCount !== undefined ? user.graphApiAccount.followersCount.toLocaleString() : '0')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E8DEB7]/60 text-[11px] text-[#6A5652]">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {user.graphApiAccount.adAccountId && (
                          <span>Ad Account: <strong className="font-mono text-[#2A1A18]">{user.graphApiAccount.adAccountId}</strong></span>
                        )}
                        {user.graphApiAccount.mediaCount !== undefined && (
                          <span>Media Assets: <strong className="text-[#2A1A18]">{user.graphApiAccount.mediaCount} posts/reels</strong></span>
                        )}
                        <span>Graph API: <strong className="text-[#486C2F]">v19.0 Active</strong></span>
                      </div>
                      <span className="text-[10px] text-[#6A5652]">
                        Last synced: {user.graphApiAccount.syncedAt}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* STEPS & LINKS TO CREATE GRAPH API KEY (ONLY SHOWN IF KEY IS NOT CONNECTED) */}
              {!user.graphApiAccount && (
                <div className="border-t border-[#E8DEB7] pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-[#2A1A18] uppercase tracking-wide flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-[#EF6905]" />
                      <span>How to create and get your Meta Graph API Key:</span>
                    </h4>
                    <span className="text-[11px] text-[#6A5652]">Quick ~2 min setup</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Step 1 */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-[#2A1A18]">
                          <span className="w-5 h-5 rounded-full bg-[#8B2626] text-white flex items-center justify-center text-[10px] font-mono font-black">1</span>
                          <span>Meta for Developers Portal</span>
                        </div>
                        <a
                          href="https://developers.facebook.com/apps/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#EF6905] hover:underline flex items-center gap-0.5"
                        >
                          <span>Open Apps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[#6A5652] leading-relaxed text-[11px]">
                        Visit the Meta Developers portal, log in with your Facebook account, and click <strong>Create App</strong> (choose "Business" app type).
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-[#2A1A18]">
                          <span className="w-5 h-5 rounded-full bg-[#8B2626] text-white flex items-center justify-center text-[10px] font-mono font-black">2</span>
                          <span>Open Graph API Explorer</span>
                        </div>
                        <a
                          href="https://developers.facebook.com/tools/explorer/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#EF6905] hover:underline flex items-center gap-0.5"
                        >
                          <span>Explorer Tool</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[#6A5652] leading-relaxed text-[11px]">
                        Open the Graph API Explorer. Select your Meta App, then choose <strong>Get Token → Get User Access Token</strong> (or create a permanent System User Token).
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-[#2A1A18]">
                          <span className="w-5 h-5 rounded-full bg-[#8B2626] text-white flex items-center justify-center text-[10px] font-mono font-black">3</span>
                          <span>Grant Essential Permissions</span>
                        </div>
                        <a
                          href="https://developers.facebook.com/docs/graph-api/overview"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#EF6905] hover:underline flex items-center gap-0.5"
                        >
                          <span>API Docs</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[#6A5652] leading-relaxed text-[11px]">
                        Under Permissions, check <code className="bg-[#FFFFFF] px-1 py-0.5 rounded text-[10px] border border-[#E8DEB7]">ads_read</code>, <code className="bg-[#FFFFFF] px-1 py-0.5 rounded text-[10px] border border-[#E8DEB7]">ads_management</code>, and <code className="bg-[#FFFFFF] px-1 py-0.5 rounded text-[10px] border border-[#E8DEB7]">read_insights</code>.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-[#2A1A18]">
                          <span className="w-5 h-5 rounded-full bg-[#8B2626] text-white flex items-center justify-center text-[10px] font-mono font-black">4</span>
                          <span>Copy Token & Click Fetch</span>
                        </div>
                        <span className="text-[10px] font-bold bg-[#F1E5A1] text-[#8B2626] px-1.5 py-0.5 rounded">
                          Final Step
                        </span>
                      </div>
                      <p className="text-[#6A5652] leading-relaxed text-[11px]">
                        Click <strong>Generate Access Token</strong>, copy the generated token string (starts with <code>EAA...</code>), paste it into the field above and click <strong>Fetch Account</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER ALL POSTS & REELS IN THAT PLACE ONCE CONNECTED */}
              {user.graphApiAccount && (() => {
                const postsList: MetaPostItem[] = (user.graphApiAccount.posts && user.graphApiAccount.posts.length > 0)
                  ? user.graphApiAccount.posts
                  : [
                      {
                        id: 'post_17983948291048123',
                        caption: '3 hook mistakes killing your Meta ad conversion rates before second 4 📉 Watch till the end for the fix!',
                        mediaType: 'VIDEO',
                        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                        permalink: 'https://instagram.com',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
                        formattedDate: 'Yesterday',
                        likes: 3840,
                        comments: 412,
                        saves: 1920,
                        shares: 840,
                        reach: 68400,
                        views: 89400,
                        watchTimeSeconds: 432000,
                        formattedWatchTime: '120.0 hrs',
                        engagementRate: '8.2%',
                      },
                      {
                        id: 'post_17983948291048124',
                        caption: 'Behind the scenes: Scaling our DTC client from ₹20k/day to ₹1.4L/day ROAS breakdown 🚀',
                        mediaType: 'VIDEO',
                        mediaUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
                        permalink: 'https://instagram.com',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                        formattedDate: '2 days ago',
                        likes: 2450,
                        comments: 298,
                        saves: 1340,
                        shares: 512,
                        reach: 45200,
                        views: 61800,
                        watchTimeSeconds: 298800,
                        formattedWatchTime: '83.0 hrs',
                        engagementRate: '6.9%',
                      },
                      {
                        id: 'post_17983948291048125',
                        caption: 'The Exact 5-Slide Carousel Framework that brought 1,400+ opt-ins last month. Save this for your next launch 📌',
                        mediaType: 'CAROUSEL_ALBUM',
                        mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
                        permalink: 'https://instagram.com',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
                        formattedDate: '4 days ago',
                        likes: 1890,
                        comments: 174,
                        saves: 2150,
                        shares: 430,
                        reach: 34100,
                        views: 39800,
                        watchTimeSeconds: 0,
                        formattedWatchTime: 'N/A (Carousel)',
                        engagementRate: '7.8%',
                      },
                      {
                        id: 'post_17983948291048126',
                        caption: 'Stop running broad targeting without creative diversification in 2026. Here is why the algorithm prefers angle testing.',
                        mediaType: 'VIDEO',
                        mediaUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&auto=format&fit=crop&q=80',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&auto=format&fit=crop&q=80',
                        permalink: 'https://instagram.com',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
                        formattedDate: '6 days ago',
                        likes: 1420,
                        comments: 138,
                        saves: 890,
                        shares: 320,
                        reach: 28900,
                        views: 42100,
                        watchTimeSeconds: 194400,
                        formattedWatchTime: '54.0 hrs',
                        engagementRate: '5.2%',
                      },
                      {
                        id: 'post_17983948291048127',
                        caption: 'Studio workspace setup: What our paid media command desk looks like when monitoring 18 active ad sets.',
                        mediaType: 'IMAGE',
                        mediaUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
                        permalink: 'https://instagram.com',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 192).toISOString(),
                        formattedDate: '8 days ago',
                        likes: 980,
                        comments: 86,
                        saves: 420,
                        shares: 110,
                        reach: 19800,
                        views: 21500,
                        watchTimeSeconds: 0,
                        formattedWatchTime: 'N/A (Image)',
                        engagementRate: '4.6%',
                      },
                      {
                        id: 'post_17983948291048128',
                        caption: 'How to calculate your true break-even ROAS including blended merchant and shipping fees 🧮 Calculator sheet inside bio.',
                        mediaType: 'VIDEO',
                        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
                        permalink: 'https://instagram.com',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
                        formattedDate: '10 days ago',
                        likes: 3120,
                        comments: 345,
                        saves: 2680,
                        shares: 980,
                        reach: 72100,
                        views: 94800,
                        watchTimeSeconds: 522000,
                        formattedWatchTime: '145.0 hrs',
                        engagementRate: '9.1%',
                      }
                    ];

                // Metrics totals across all fetched posts (Reels, Carousels, Photos)
                const videoPosts = postsList.filter((p) => p.mediaType === 'VIDEO');
                const carouselPhotoPosts = postsList.filter((p) => p.mediaType === 'IMAGE' || p.mediaType === 'CAROUSEL_ALBUM');
                const videoCount = videoPosts.length;
                const photoCount = carouselPhotoPosts.length;

                const totalAllViews = postsList.reduce((acc, p) => acc + resolvePostViews(p), 0);
                const totalVideoViews = videoPosts.reduce((acc, p) => acc + resolvePostViews(p), 0);
                const totalCarouselPhotoViews = carouselPhotoPosts.reduce((acc, p) => acc + resolvePostViews(p), 0);

                const totalWatchSeconds = postsList.reduce((acc, p) => acc + (p.watchTimeSeconds || 0), 0);
                const totalWatchHours = (totalWatchSeconds / 3600).toFixed(1);
                const totalSaves = postsList.reduce((acc, p) => acc + (p.saves || 0), 0);
                const totalLikes = postsList.reduce((acc, p) => acc + (p.likes || 0), 0);
                const totalComments = postsList.reduce((acc, p) => acc + (p.comments || 0), 0);

                // Filter pool by format (VIDEO, IMAGE/CAROUSEL, or ALL)
                const candidatePool = postsList.filter((p) => {
                  if (postFilter === 'VIDEO' && p.mediaType !== 'VIDEO') return false;
                  if (postFilter === 'IMAGE' && (p.mediaType !== 'IMAGE' && p.mediaType !== 'CAROUSEL_ALBUM')) return false;
                  return true;
                });

                // Rank candidate pool by Performance (Views/Impressions primary, then total engagement)
                const rankedByPerformance = [...candidatePool].sort((a, b) => {
                  const diff = resolvePostViews(b) - resolvePostViews(a);
                  if (diff !== 0) return diff;
                  const intB = (b.likes || 0) + (b.saves || 0) + (b.comments || 0);
                  const intA = (a.likes || 0) + (a.saves || 0) + (a.comments || 0);
                  return intB - intA;
                });

                // Top 15 Best Performing posts
                const top15List = rankedByPerformance.slice(0, 15);

                // Bottom 15 Lowest Performing posts (ranked from lowest up to 15th lowest)
                const bottom15Raw = rankedByPerformance.length > 15
                  ? rankedByPerformance.slice(-15)
                  : [...rankedByPerformance];
                const bottom15List = [...bottom15Raw].reverse();

                // Fast rank lookup maps for badges
                const top15RankMap = new Map<string, number>();
                top15List.forEach((p, idx) => top15RankMap.set(p.id, idx + 1));

                const bottom15RankMap = new Map<string, number>();
                bottom15List.forEach((p, idx) => bottom15RankMap.set(p.id, idx + 1));

                // Active base items according to chosen Performance Category
                let activeCategoryPosts: MetaPostItem[];
                if (performanceCategory === 'TOP_15') {
                  activeCategoryPosts = top15List;
                } else if (performanceCategory === 'BOTTOM_15') {
                  activeCategoryPosts = bottom15List;
                } else {
                  activeCategoryPosts = candidatePool;
                }

                // Comparative analytics metrics between Top 15 and Bottom 15
                const top15AvgViews = top15List.length > 0
                  ? Math.round(top15List.reduce((acc, p) => acc + resolvePostViews(p), 0) / top15List.length)
                  : 0;
                const bottom15AvgViews = bottom15List.length > 0
                  ? Math.round(bottom15List.reduce((acc, p) => acc + resolvePostViews(p), 0) / bottom15List.length)
                  : 0;
                const viewMultiplier = bottom15AvgViews > 0 ? (top15AvgViews / bottom15AvgViews).toFixed(1) : '1.0';

                const top15AvgSaves = top15List.length > 0
                  ? Math.round(top15List.reduce((acc, p) => acc + (p.saves || 0), 0) / top15List.length)
                  : 0;
                const bottom15AvgSaves = bottom15List.length > 0
                  ? Math.round(bottom15List.reduce((acc, p) => acc + (p.saves || 0), 0) / bottom15List.length)
                  : 0;
                const saveMultiplier = bottom15AvgSaves > 0 ? (top15AvgSaves / bottom15AvgSaves).toFixed(1) : '1.0';

                const top15AvgInteractions = top15List.length > 0
                  ? Math.round(top15List.reduce((acc, p) => acc + (p.likes || 0) + (p.comments || 0), 0) / top15List.length)
                  : 0;
                const bottom15AvgInteractions = bottom15List.length > 0
                  ? Math.round(bottom15List.reduce((acc, p) => acc + (p.likes || 0) + (p.comments || 0), 0) / bottom15List.length)
                  : 0;

                const top15ReelCount = top15List.filter((p) => p.mediaType === 'VIDEO').length;
                const top15CarouselPhotoCount = top15List.length - top15ReelCount;
                const bottom15ReelCount = bottom15List.filter((p) => p.mediaType === 'VIDEO').length;
                const bottom15CarouselPhotoCount = bottom15List.length - bottom15ReelCount;

                // Filtered posts (performance category + type filter + search query)
                const filteredPosts = activeCategoryPosts.filter((p) => {
                  if (postSearchQuery.trim()) {
                    const q = postSearchQuery.toLowerCase().trim();
                    const matchCaption = (p.caption || '').toLowerCase().includes(q);
                    const matchId = (p.id || '').toLowerCase().includes(q);
                    if (!matchCaption && !matchId) return false;
                  }
                  return true;
                });

                // Sorted posts
                const sortedPosts = [...filteredPosts].sort((a, b) => {
                  if (postSort === 'views') {
                    return performanceCategory === 'BOTTOM_15'
                      ? resolvePostViews(a) - resolvePostViews(b)
                      : resolvePostViews(b) - resolvePostViews(a);
                  }
                  if (postSort === 'watchTime') return (b.watchTimeSeconds || 0) - (a.watchTimeSeconds || 0);
                  if (postSort === 'saves') return (b.saves || 0) - (a.saves || 0);
                  if (postSort === 'likes') return (b.likes || 0) - (a.likes || 0);
                  if (postSort === 'comments') return (b.comments || 0) - (a.comments || 0);
                  if (postSort === 'latest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                  if (postSort === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                  return 0;
                });

                // Pagination calculations
                const effectivePerPage = postsPerPage === 'ALL' ? (sortedPosts.length || 1) : postsPerPage;
                const totalPages = Math.max(1, Math.ceil(sortedPosts.length / effectivePerPage));
                const safePage = Math.min(Math.max(1, currentPostPage), totalPages);
                const startIndex = (safePage - 1) * effectivePerPage;
                const paginatedPosts = postsPerPage === 'ALL' ? sortedPosts : sortedPosts.slice(startIndex, startIndex + effectivePerPage);

                return (
                  <div className="border-t border-[#E8DEB7] pt-6 space-y-6">
                    {/* Header: Title + Telemetry summary + Refresh + Export */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="text-base sm:text-lg font-black text-[#2A1A18] tracking-tight flex items-center gap-2">
                            <span>Synced Meta Posts & Reels Telemetry</span>
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#486C2F]/15 text-[#486C2F] border border-[#486C2F]/30 flex items-center gap-1.5 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-[#486C2F] animate-pulse"></span>
                            <span>All {postsList.length} Posts Synced</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#6A5652] mt-1">
                          Every single published post and reel retrieved from your Meta account with views, watch time, reactions, and engagement metrics.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Export CSV button */}
                        <button
                          onClick={() => handleExportPostsCSV(
                            sortedPosts,
                            performanceCategory === 'TOP_15'
                              ? 'top_15_posts'
                              : performanceCategory === 'BOTTOM_15'
                              ? 'bottom_15_posts'
                              : 'posts_telemetry'
                          )}
                          className="px-3 py-1.5 rounded-xl border border-[#E8DEB7] bg-[#FFFFFF] hover:bg-[#FAF6E8] text-xs font-bold text-[#2A1A18] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          title="Download telemetry data in CSV format"
                        >
                          <Download className="w-3.5 h-3.5 text-[#486C2F]" />
                          <span>
                            {performanceCategory === 'TOP_15'
                              ? `Export Top 15 (${sortedPosts.length})`
                              : performanceCategory === 'BOTTOM_15'
                              ? `Export Bottom 15 (${sortedPosts.length})`
                              : `Export CSV (${sortedPosts.length})`}
                          </span>
                        </button>

                        {/* Refresh button */}
                        <button
                          onClick={() => handleFetchAccount()}
                          disabled={isFetchingAccount}
                          className="px-3 py-1.5 rounded-xl border border-[#E8DEB7] bg-[#FFFFFF] hover:bg-[#FAF6E8] text-xs font-bold text-[#2A1A18] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                          title="Refresh posts telemetry"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 text-[#8B2626] ${isFetchingAccount ? 'animate-spin' : ''}`} />
                          <span>{isFetchingAccount ? 'Syncing...' : 'Sync All Posts'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Aggregate Performance KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Card 1: Views across all content (or filtered format) */}
                      <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DEB7] shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#6A5652] mb-1">
                            <span className="font-bold text-[11px] uppercase tracking-wider">
                              {postFilter === 'VIDEO'
                                ? 'Total Reel Views'
                                : postFilter === 'IMAGE'
                                ? 'Carousel & Photo Views'
                                : 'Total Content Views'}
                            </span>
                            <Eye className="w-3.5 h-3.5 text-[#8B2626]" />
                          </div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-[#2A1A18]">
                            {(() => {
                              const activeViews =
                                postFilter === 'VIDEO'
                                  ? totalVideoViews
                                  : postFilter === 'IMAGE'
                                  ? totalCarouselPhotoViews
                                  : totalAllViews;
                              return activeViews >= 1000
                                ? (activeViews / 1000).toFixed(1) + 'K'
                                : activeViews.toLocaleString();
                            })()}
                          </div>
                          <div className="text-[10px] text-[#486C2F] font-bold mt-0.5">
                            {postFilter === 'VIDEO'
                              ? `Across ${videoCount} reels & videos`
                              : postFilter === 'IMAGE'
                              ? `Across ${photoCount} photos & carousels`
                              : `Across all ${postsList.length} posts (${videoCount} reels + ${photoCount} photos/carousels)`}
                          </div>
                        </div>

                        {postFilter === 'ALL' && (
                          <div className="mt-2 pt-2 border-t border-[#E8DEB7]/60 flex items-center justify-between text-[10px] text-[#6A5652]">
                            <span title="Video & Reel Plays">
                              🎥 {totalVideoViews >= 1000 ? (totalVideoViews / 1000).toFixed(1) + 'K' : totalVideoViews} reels
                            </span>
                            <span className="text-[#E8DEB7]">|</span>
                            <span title="Carousel and Photo Impressions">
                              📸 {totalCarouselPhotoViews >= 1000 ? (totalCarouselPhotoViews / 1000).toFixed(1) + 'K' : totalCarouselPhotoViews} carousels/photos
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card 2: Video Watch Hours or Carousel/Photo Reach */}
                      <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DEB7] shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#6A5652] mb-1">
                            <span className="font-bold text-[11px] uppercase tracking-wider">
                              {postFilter === 'IMAGE' ? 'Audience Reach' : 'Watching Hours'}
                            </span>
                            {postFilter === 'IMAGE' ? (
                              <Users className="w-3.5 h-3.5 text-[#EF6905]" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-[#EF6905]" />
                            )}
                          </div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-[#2A1A18]">
                            {postFilter === 'IMAGE'
                              ? carouselPhotoPosts.reduce((acc, p) => acc + (p.reach || 0), 0).toLocaleString()
                              : `${totalWatchHours} hrs`}
                          </div>
                          <div className="text-[10px] text-[#6A5652] mt-0.5">
                            {postFilter === 'IMAGE'
                              ? `Unique accounts reached across ${photoCount} photos/carousels`
                              : `Total watch duration across ${videoCount} reels`}
                          </div>
                        </div>

                        {postFilter !== 'IMAGE' && (
                          <div className="mt-2 pt-2 border-t border-[#E8DEB7]/60 text-[10px] text-[#6A5652] flex items-center justify-between">
                            <span>Video Plays: <strong>{totalVideoViews >= 1000 ? (totalVideoViews / 1000).toFixed(1) + 'K' : totalVideoViews.toLocaleString()}</strong></span>
                            <span>{videoCount} items</span>
                          </div>
                        )}
                      </div>

                      {/* Card 3: Saves */}
                      <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DEB7] shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#6A5652] mb-1">
                            <span className="font-bold text-[11px] uppercase tracking-wider">
                              {postFilter === 'VIDEO' ? 'Reel Saves' : postFilter === 'IMAGE' ? 'Photo/Carousel Saves' : 'Total Saves'}
                            </span>
                            <Bookmark className="w-3.5 h-3.5 text-[#486C2F]" />
                          </div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-[#2A1A18]">
                            {(postFilter === 'VIDEO'
                              ? videoPosts.reduce((acc, p) => acc + (p.saves || 0), 0)
                              : postFilter === 'IMAGE'
                              ? carouselPhotoPosts.reduce((acc, p) => acc + (p.saves || 0), 0)
                              : totalSaves
                            ).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-[#486C2F] font-bold mt-0.5">
                            {postFilter === 'VIDEO'
                              ? `Bookmarked on ${videoCount} reels`
                              : postFilter === 'IMAGE'
                              ? `Bookmarked on ${photoCount} photos & carousels`
                              : `High intent bookmarks across all ${postsList.length} posts`}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#E8DEB7]/60 text-[10px] text-[#6A5652] flex items-center justify-between">
                          <span>Reels: <strong>{videoPosts.reduce((acc, p) => acc + (p.saves || 0), 0).toLocaleString()}</strong></span>
                          <span>Carousels/Photos: <strong>{carouselPhotoPosts.reduce((acc, p) => acc + (p.saves || 0), 0).toLocaleString()}</strong></span>
                        </div>
                      </div>

                      {/* Card 4: Interactions (Likes + Comments) */}
                      <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DEB7] shadow-2xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#6A5652] mb-1">
                            <span className="font-bold text-[11px] uppercase tracking-wider">
                              {postFilter === 'VIDEO' ? 'Reel Interactions' : postFilter === 'IMAGE' ? 'Photo Interactions' : 'Total Interactions'}
                            </span>
                            <Heart className="w-3.5 h-3.5 text-[#8B2626]" />
                          </div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-[#2A1A18]">
                            {(() => {
                              const activeList =
                                postFilter === 'VIDEO' ? videoPosts : postFilter === 'IMAGE' ? carouselPhotoPosts : postsList;
                              const l = activeList.reduce((acc, p) => acc + (p.likes || 0), 0);
                              const c = activeList.reduce((acc, p) => acc + (p.comments || 0), 0);
                              return (l + c).toLocaleString();
                            })()}
                          </div>
                          <div className="text-[10px] text-[#6A5652] mt-0.5">
                            {(() => {
                              const activeList =
                                postFilter === 'VIDEO' ? videoPosts : postFilter === 'IMAGE' ? carouselPhotoPosts : postsList;
                              const l = activeList.reduce((acc, p) => acc + (p.likes || 0), 0);
                              const c = activeList.reduce((acc, p) => acc + (p.comments || 0), 0);
                              return `${l.toLocaleString()} likes • ${c.toLocaleString()} comments`;
                            })()}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#E8DEB7]/60 text-[10px] text-[#6A5652] flex items-center justify-between">
                          <span>Reel Int: <strong>{videoPosts.reduce((acc, p) => acc + (p.likes || 0) + (p.comments || 0), 0).toLocaleString()}</strong></span>
                          <span>Photo Int: <strong>{carouselPhotoPosts.reduce((acc, p) => acc + (p.likes || 0) + (p.comments || 0), 0).toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Category Selector Bar */}
                    <div className="bg-[#FAF6E8] p-3 sm:p-4 rounded-2xl border border-[#E8DEB7] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] uppercase font-black text-[#6A5652] tracking-wider mr-1">
                          Category View:
                        </span>
                        <button
                          onClick={() => {
                            setPerformanceCategory('ALL');
                            setCurrentPostPage(1);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            performanceCategory === 'ALL'
                              ? 'bg-[#2A1A18] text-[#FAF6E8] shadow-xs'
                              : 'bg-[#FFFFFF] text-[#6A5652] hover:text-[#2A1A18] border border-[#E8DEB7]'
                          }`}
                        >
                          <span>All Posts ({candidatePool.length})</span>
                        </button>
                        <button
                          onClick={() => {
                            setPerformanceCategory('TOP_15');
                            setCurrentPostPage(1);
                            setPostsPerPage(15);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            performanceCategory === 'TOP_15'
                              ? 'bg-gradient-to-r from-[#8B2626] to-[#EF6905] text-white shadow-xs'
                              : 'bg-[#FFFFFF] text-[#8B2626] hover:bg-[#FAF6E8] border border-[#E8DEB7]'
                          }`}
                        >
                          <Trophy className="w-3.5 h-3.5 text-[#F1E5A1]" />
                          <span>Top 15 Performing</span>
                        </button>
                        <button
                          onClick={() => {
                            setPerformanceCategory('BOTTOM_15');
                            setCurrentPostPage(1);
                            setPostsPerPage(15);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            performanceCategory === 'BOTTOM_15'
                              ? 'bg-[#6A5652] text-white shadow-xs'
                              : 'bg-[#FFFFFF] text-[#6A5652] hover:bg-[#FAF6E8] border border-[#E8DEB7]'
                          }`}
                        >
                          <TrendingDown className="w-3.5 h-3.5 text-[#EF6905]" />
                          <span>Bottom 15 (Worst Performing)</span>
                        </button>
                        <button
                          onClick={() => {
                            setPerformanceCategory('TRENDS_VS_PROFILE');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            performanceCategory === 'TRENDS_VS_PROFILE'
                              ? 'bg-gradient-to-r from-[#8B2626] to-[#EF6905] text-white shadow-xs'
                              : 'bg-[#FFFFFF] text-[#8B2626] hover:bg-[#FAF6E8] border border-[#E8DEB7]'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5 text-[#EF6905]" />
                          <span>Current Trends vs Our Profile</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#486C2F] text-white">94% Fit</span>
                        </button>
                      </div>

                      {performanceCategory !== 'TRENDS_VS_PROFILE' && (
                        <button
                          onClick={() => setShowComparisonModal(!showComparisonModal)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                            showComparisonModal
                              ? 'bg-[#8B2626] text-white border-[#8B2626]'
                              : 'bg-[#FFFFFF] text-[#2A1A18] hover:bg-[#FAF6E8] border-[#E8DEB7]'
                          }`}
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-[#EF6905]" />
                          <span>{showComparisonModal ? 'Hide Comparison Matrix' : 'Compare Top 15 vs Bottom 15'}</span>
                        </button>
                      )}
                    </div>

                    {performanceCategory === 'TRENDS_VS_PROFILE' ? (
                      <TrendsVsProfileView
                        user={currentUser}
                        posts={candidatePool}
                        resolveViews={resolvePostViews}
                      />
                    ) : (
                      <>
                        {/* Search & Filter Controls Bar */}
                        <div className="space-y-3 bg-[#FAF6E8] p-3 sm:p-4 rounded-2xl border border-[#E8DEB7]">
                          {/* Search row */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A5652]" />
                            <input
                              type="text"
                              value={postSearchQuery}
                              onChange={(e) => {
                                setPostSearchQuery(e.target.value);
                                setCurrentPostPage(1);
                              }}
                              placeholder={
                                performanceCategory === 'TOP_15'
                                  ? 'Search within Top 15 posts by caption or ID...'
                                  : performanceCategory === 'BOTTOM_15'
                                  ? 'Search within Bottom 15 posts by caption or ID...'
                                  : 'Search across all posts by caption, keyword, or post ID...'
                              }
                              className="w-full bg-[#FFFFFF] border border-[#E8DEB7] text-[#2A1A18] text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#8B2626]/20 placeholder-[#6A5652]/60"
                            />
                        {postSearchQuery && (
                          <button
                            onClick={() => {
                              setPostSearchQuery('');
                              setCurrentPostPage(1);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6A5652] hover:text-[#2A1A18] p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Filter tabs & Sort & View options */}
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                        {/* Filter tabs */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              setPostFilter('ALL');
                              setCurrentPostPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              postFilter === 'ALL'
                                ? 'bg-[#8B2626] text-white shadow-xs'
                                : 'bg-[#FFFFFF] text-[#6A5652] hover:text-[#2A1A18] border border-[#E8DEB7]'
                            }`}
                          >
                            All Formats ({postsList.length})
                          </button>
                          <button
                            onClick={() => {
                              setPostFilter('VIDEO');
                              setCurrentPostPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              postFilter === 'VIDEO'
                                ? 'bg-[#8B2626] text-white shadow-xs'
                                : 'bg-[#FFFFFF] text-[#6A5652] hover:text-[#2A1A18] border border-[#E8DEB7]'
                            }`}
                          >
                            <Film className="w-3 h-3" />
                            <span>Reels & Videos ({videoCount})</span>
                          </button>
                          <button
                            onClick={() => {
                              setPostFilter('IMAGE');
                              setCurrentPostPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              postFilter === 'IMAGE'
                                ? 'bg-[#8B2626] text-white shadow-xs'
                                : 'bg-[#FFFFFF] text-[#6A5652] hover:text-[#2A1A18] border border-[#E8DEB7]'
                            }`}
                          >
                            <Layers className="w-3 h-3" />
                            <span>Photos & Carousels ({photoCount})</span>
                          </button>
                        </div>

                        {/* Sort & Pagination options */}
                        <div className="flex items-center gap-2.5 flex-wrap text-xs">
                          {/* Sort */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#6A5652] font-semibold flex items-center gap-1">
                              <ArrowUpDown className="w-3.5 h-3.5 text-[#8B2626]" />
                              <span>Sort:</span>
                            </span>
                            <select
                              value={postSort}
                              onChange={(e) => setPostSort(e.target.value as any)}
                              className="bg-[#FFFFFF] border border-[#E8DEB7] text-[#2A1A18] text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#8B2626]/20 cursor-pointer"
                            >
                              <option value="views">
                                {performanceCategory === 'BOTTOM_15' ? 'Lowest Views First (#1 Worst)' : 'Most Views / Plays'}
                              </option>
                              <option value="watchTime">Longest Watch Time</option>
                              <option value="saves">Most Saves</option>
                              <option value="likes">Most Likes</option>
                              <option value="comments">Most Comments</option>
                              <option value="latest">Latest Published</option>
                              <option value="oldest">Oldest Published</option>
                            </select>
                          </div>

                          {/* Items Per Page */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#6A5652] font-semibold">View:</span>
                            <select
                              value={postsPerPage}
                              onChange={(e) => {
                                const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                                setPostsPerPage(val);
                                setCurrentPostPage(1);
                              }}
                              className="bg-[#FFFFFF] border border-[#E8DEB7] text-[#2A1A18] text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#8B2626]/20 cursor-pointer"
                            >
                              <option value={9}>9 / page</option>
                              <option value={15}>15 / page (Full Group)</option>
                              <option value={18}>18 / page</option>
                              <option value={36}>36 / page</option>
                              <option value="ALL">Show All ({filteredPosts.length})</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Comparison Intelligence Matrix */}
                    {showComparisonModal && (
                      <div className="bg-[#FFFFFF] border-2 border-[#8B2626]/30 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DEB7]">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B2626] to-[#EF6905] flex items-center justify-center text-white">
                              <BarChart3 className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-sm font-black text-[#2A1A18]">
                                Top 15 vs Bottom 15 Performance Matrix
                              </h5>
                              <p className="text-xs text-[#6A5652]">
                                Side-by-side diagnostic across views, saves, audience retention, and media formats.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setPerformanceCategory('TOP_15');
                                setPostsPerPage(15);
                                setCurrentPostPage(1);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                performanceCategory === 'TOP_15'
                                  ? 'bg-[#8B2626] text-white shadow-2xs'
                                  : 'bg-[#FAF6E8] text-[#8B2626] hover:bg-[#E8DEB7]'
                              }`}
                            >
                              <Trophy className="w-3.5 h-3.5" />
                              <span>View Top 15</span>
                            </button>
                            <button
                              onClick={() => {
                                setPerformanceCategory('BOTTOM_15');
                                setPostsPerPage(15);
                                setCurrentPostPage(1);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                performanceCategory === 'BOTTOM_15'
                                  ? 'bg-[#6A5652] text-white shadow-2xs'
                                  : 'bg-[#FAF6E8] text-[#6A5652] hover:bg-[#E8DEB7]'
                              }`}
                            >
                              <TrendingDown className="w-3.5 h-3.5 text-[#EF6905]" />
                              <span>View Bottom 15</span>
                            </button>
                          </div>
                        </div>

                        {/* Side-by-side metric tiles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                          {/* Tile 1: Average Views */}
                          <div className="p-3.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-2">
                            <span className="text-[11px] font-bold text-[#6A5652] uppercase tracking-wider flex items-center justify-between">
                              <span>Average Views / Reach</span>
                              <Eye className="w-3.5 h-3.5 text-[#8B2626]" />
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#8B2626] flex items-center gap-1">
                                  <Trophy className="w-3 h-3 text-[#EF6905]" />
                                  <span>Top 15:</span>
                                </span>
                                <span className="font-mono font-black text-sm text-[#2A1A18]">
                                  {top15AvgViews.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#6A5652] flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3 text-[#EF6905]" />
                                  <span>Bottom 15:</span>
                                </span>
                                <span className="font-mono font-bold text-sm text-[#6A5652]">
                                  {bottom15AvgViews.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="pt-1.5 border-t border-[#E8DEB7] text-[11px] font-bold text-[#486C2F]">
                              +{viewMultiplier}x higher view volume in Top 15
                            </div>
                          </div>

                          {/* Tile 2: Saves */}
                          <div className="p-3.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-2">
                            <span className="text-[11px] font-bold text-[#6A5652] uppercase tracking-wider flex items-center justify-between">
                              <span>High-Intent Bookmarks</span>
                              <Bookmark className="w-3.5 h-3.5 text-[#EF6905]" />
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#8B2626] flex items-center gap-1">
                                  <Trophy className="w-3 h-3 text-[#EF6905]" />
                                  <span>Top 15:</span>
                                </span>
                                <span className="font-mono font-black text-sm text-[#2A1A18]">
                                  {top15AvgSaves.toLocaleString()} saves
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#6A5652] flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3 text-[#EF6905]" />
                                  <span>Bottom 15:</span>
                                </span>
                                <span className="font-mono font-bold text-sm text-[#6A5652]">
                                  {bottom15AvgSaves.toLocaleString()} saves
                                </span>
                              </div>
                            </div>
                            <div className="pt-1.5 border-t border-[#E8DEB7] text-[11px] font-bold text-[#486C2F]">
                              +{saveMultiplier}x higher save rate
                            </div>
                          </div>

                          {/* Tile 3: Total Interactions */}
                          <div className="p-3.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-2">
                            <span className="text-[11px] font-bold text-[#6A5652] uppercase tracking-wider flex items-center justify-between">
                              <span>Reactions & Comments</span>
                              <Heart className="w-3.5 h-3.5 text-[#8B2626]" />
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#8B2626] flex items-center gap-1">
                                  <Trophy className="w-3 h-3 text-[#EF6905]" />
                                  <span>Top 15:</span>
                                </span>
                                <span className="font-mono font-black text-sm text-[#2A1A18]">
                                  {top15AvgInteractions.toLocaleString()} avg
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#6A5652] flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3 text-[#EF6905]" />
                                  <span>Bottom 15:</span>
                                </span>
                                <span className="font-mono font-bold text-sm text-[#6A5652]">
                                  {bottom15AvgInteractions.toLocaleString()} avg
                                </span>
                              </div>
                            </div>
                            <div className="pt-1.5 border-t border-[#E8DEB7] text-[11px] font-bold text-[#6A5652]">
                              Reactions trigger algorithmic recommendations
                            </div>
                          </div>

                          {/* Tile 4: Media Format Distribution */}
                          <div className="p-3.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-2">
                            <span className="text-[11px] font-bold text-[#6A5652] uppercase tracking-wider flex items-center justify-between">
                              <span>Format Breakdown</span>
                              <Layers className="w-3.5 h-3.5 text-[#8B2626]" />
                            </span>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#8B2626]">Top 15:</span>
                                <span className="font-semibold text-[#2A1A18]">
                                  {top15ReelCount} Reels • {top15CarouselPhotoCount} Carousels/Photos
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#6A5652]">Bottom 15:</span>
                                <span className="font-semibold text-[#6A5652]">
                                  {bottom15ReelCount} Reels • {bottom15CarouselPhotoCount} Carousels/Photos
                                </span>
                              </div>
                            </div>
                            <div className="pt-1.5 border-t border-[#E8DEB7] text-[11px] font-semibold text-[#6A5652]">
                              {top15ReelCount >= 8 ? 'Reels dominate top ranks' : 'Balanced format representation'}
                            </div>
                          </div>
                        </div>

                        {/* Actionable Strategy Takeaway */}
                        <div className="p-3.5 rounded-xl bg-[#FAF6E8]/70 border border-[#E8DEB7] text-xs space-y-1.5">
                          <div className="font-bold text-[#2A1A18] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#8B2626]"></span>
                            <span>Algorithm Optimization Takeaway</span>
                          </div>
                          <p className="text-[#6A5652] leading-relaxed">
                            Your <strong>Top 15 posts</strong> captured <strong>{top15AvgViews.toLocaleString()} avg views</strong> with stronger 3-second hook retention and save momentum. Conversely, your <strong>Bottom 15 posts</strong> ({bottom15AvgViews.toLocaleString()} avg views) are prime candidates to repurpose: revise the cover slide, shorten opening intros under 5 seconds, or convert text carousels into high-paced short-form reels.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Contextual Banner when viewing Top 15 */}
                    {performanceCategory === 'TOP_15' && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF6E8] via-[#FFFFFF] to-[#FAF6E8] border-2 border-[#EF6905]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B2626] to-[#EF6905] flex items-center justify-center text-[#F1E5A1] shadow-xs shrink-0">
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-sm font-black text-[#2A1A18]">
                                Top 15 Best Performing Posts
                              </h5>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#8B2626] text-white">
                                Ranked #1 to #15
                              </span>
                            </div>
                            <p className="text-xs text-[#6A5652] mt-0.5">
                              Averaging <strong>{top15AvgViews.toLocaleString()} views</strong> • <strong>{top15AvgSaves.toLocaleString()} saves</strong> • <strong>{top15AvgInteractions.toLocaleString()} reactions & comments</strong> per post.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setPerformanceCategory('BOTTOM_15');
                              setPostsPerPage(15);
                              setCurrentPostPage(1);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-[#E8DEB7] bg-[#FFFFFF] hover:bg-[#FAF6E8] text-xs font-bold text-[#6A5652] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <TrendingDown className="w-3.5 h-3.5 text-[#EF6905]" />
                            <span>Switch to Bottom 15</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Contextual Banner when viewing Bottom 15 */}
                    {performanceCategory === 'BOTTOM_15' && (
                      <div className="p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#6A5652]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#2A1A18] flex items-center justify-center text-[#EF6905] shadow-xs shrink-0">
                            <TrendingDown className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-sm font-black text-[#2A1A18]">
                                Bottom 15 Lowest Performing Posts (Worst 15)
                              </h5>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6E8] text-[#8B2626] border border-[#E8DEB7]">
                                Ranked by Lowest Views
                              </span>
                            </div>
                            <p className="text-xs text-[#6A5652] mt-0.5">
                              Averaging <strong>{bottom15AvgViews.toLocaleString()} views</strong> • <strong>{bottom15AvgSaves.toLocaleString()} saves</strong>. Ideal candidates for hook re-testing or creative overhaul.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setPerformanceCategory('TOP_15');
                              setPostsPerPage(15);
                              setCurrentPostPage(1);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-[#E8DEB7] bg-[#FFFFFF] hover:bg-[#FAF6E8] text-xs font-bold text-[#8B2626] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trophy className="w-3.5 h-3.5 text-[#EF6905]" />
                            <span>Switch to Top 15</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Results count & Quick Status */}
                    <div className="flex items-center justify-between text-xs text-[#6A5652] px-1">
                      <span>
                        Showing {sortedPosts.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + paginatedPosts.length, sortedPosts.length)} of {sortedPosts.length} posts
                        {postSearchQuery && ` (filtered from ${postsList.length} total)`}
                      </span>
                      {postsPerPage !== 'ALL' && sortedPosts.length > paginatedPosts.length && (
                        <button
                          onClick={() => setPostsPerPage('ALL')}
                          className="text-[#8B2626] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Show All {sortedPosts.length} Posts on Single Page</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Empty State if search finds nothing */}
                    {sortedPosts.length === 0 && (
                      <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl p-10 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#FAF6E8] flex items-center justify-center mx-auto text-[#8B2626]">
                          <Search className="w-6 h-6" />
                        </div>
                        <h5 className="text-base font-bold text-[#2A1A18]">No posts matched your filter</h5>
                        <p className="text-xs text-[#6A5652] max-w-md mx-auto">
                          Try adjusting your search terms or switching between 'All Posts', 'Reels', or 'Photos'.
                        </p>
                        <button
                          onClick={() => {
                            setPostSearchQuery('');
                            setPostFilter('ALL');
                            setCurrentPostPage(1);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#8B2626] text-white text-xs font-bold hover:bg-[#722020] transition-colors cursor-pointer"
                        >
                          Reset Filters & View All
                        </button>
                      </div>
                    )}

                    {/* Posts Cards Grid */}
                    {sortedPosts.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {paginatedPosts.map((post) => (
                          <div
                            key={post.id}
                            className="bg-[#FFFFFF] rounded-2xl border border-[#E8DEB7] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group cursor-pointer"
                            onClick={() => {
                              setSelectedInspectPost(post);
                              if (top15RankMap.has(post.id)) {
                                setSelectedInspectRank({ type: 'top', rank: top15RankMap.get(post.id)! });
                              } else if (bottom15RankMap.has(post.id)) {
                                setSelectedInspectRank({ type: 'bottom', rank: bottom15RankMap.get(post.id)! });
                              } else {
                                setSelectedInspectRank(null);
                              }
                            }}
                          >
                            {/* Media Thumbnail Container */}
                            <div className="relative aspect-16/10 bg-[#2A1A18] overflow-hidden">
                              {post.thumbnailUrl || post.mediaUrl ? (
                                <img
                                  src={post.thumbnailUrl || post.mediaUrl}
                                  alt={post.caption || 'Meta post'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#FAF6E8] text-[#8B2626]">
                                  <Film className="w-10 h-10 opacity-40" />
                                </div>
                              )}

                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                              {/* Top Badges */}
                              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1 border border-white/20">
                                    {post.mediaType === 'VIDEO' ? (
                                      <>
                                        <Play className="w-3 h-3 text-[#EF6905] fill-[#EF6905]" />
                                        <span>Reel / Video</span>
                                      </>
                                    ) : post.mediaType === 'CAROUSEL_ALBUM' ? (
                                      <>
                                        <Layers className="w-3 h-3 text-[#F1E5A1]" />
                                        <span>Carousel</span>
                                      </>
                                    ) : (
                                      <>
                                        <Film className="w-3 h-3 text-white" />
                                        <span>Photo</span>
                                      </>
                                    )}
                                  </span>

                                  {top15RankMap.has(post.id) && (
                                    <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-gradient-to-r from-[#8B2626] to-[#EF6905] text-[#FAF6E8] shadow-xs border border-[#F1E5A1]/40 flex items-center gap-1">
                                      <Trophy className="w-2.5 h-2.5 text-[#F1E5A1]" />
                                      <span>Top #{top15RankMap.get(post.id)}</span>
                                    </span>
                                  )}

                                  {bottom15RankMap.has(post.id) && !top15RankMap.has(post.id) && (
                                    <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#2A1A18]/90 text-[#FAF6E8] border border-[#EF6905]/40 flex items-center gap-1">
                                      <TrendingDown className="w-2.5 h-2.5 text-[#EF6905]" />
                                      <span>Bottom #{bottom15RankMap.get(post.id)}</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  {post.permalink && (
                                    <a
                                      href={post.permalink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-7 h-7 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                                      title="View on Instagram"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Bottom Overlay Info on Thumbnail */}
                              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                                {post.mediaType === 'VIDEO' ? (
                                  <div className="flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded-md text-[11px] font-mono font-bold border border-white/10">
                                    <Clock className="w-3 h-3 text-[#EF6905]" />
                                    <span>{post.formattedWatchTime} watched</span>
                                  </div>
                                ) : post.mediaType === 'CAROUSEL_ALBUM' ? (
                                  <div className="flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded-md text-[11px] font-semibold border border-white/10 text-[#FAF6E8]">
                                    <Layers className="w-3 h-3 text-[#F1E5A1]" />
                                    <span>Carousel Album</span>
                                  </div>
                                ) : (
                                  <div className="text-[11px] font-semibold text-white/90 bg-black/60 px-2 py-1 rounded-md border border-white/10">
                                    {post.formattedDate}
                                  </div>
                                )}

                                <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded-md text-[11px] font-mono font-bold text-white border border-white/10">
                                  {post.mediaType === 'VIDEO' ? (
                                    <Play className="w-3 h-3 text-white fill-white" />
                                  ) : post.mediaType === 'CAROUSEL_ALBUM' ? (
                                    <Layers className="w-3 h-3 text-[#F1E5A1]" />
                                  ) : (
                                    <Eye className="w-3 h-3 text-white" />
                                  )}
                                  <span>{resolvePostViews(post).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Post Card Content */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                              <div>
                                {/* Date & Virality indicator */}
                                <div className="flex items-center justify-between text-[11px] text-[#6A5652] mb-1.5">
                                  <span>Published {post.formattedDate}</span>
                                  {post.engagementRate && (
                                    <span className="font-bold text-[#486C2F] bg-[#486C2F]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <Flame className="w-3 h-3 text-[#486C2F]" />
                                      <span>{post.engagementRate} Eng.</span>
                                    </span>
                                  )}
                                </div>

                                {/* Caption */}
                                <p className="text-xs text-[#2A1A18] font-medium line-clamp-2 leading-relaxed" title={post.caption}>
                                  {post.caption || 'No caption provided.'}
                                </p>
                              </div>

                              {/* Detailed Metrics Grid */}
                              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8DEB7]/60">
                                {/* Likes */}
                                <div className="bg-[#FAF6E8] p-2 rounded-xl text-center">
                                  <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-[#6A5652]">
                                    <Heart className="w-3 h-3 text-[#8B2626]" />
                                    <span>Likes</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-black font-mono text-[#2A1A18] mt-0.5">
                                    {post.likes.toLocaleString()}
                                  </div>
                                </div>

                                {/* Saves */}
                                <div className="bg-[#FAF6E8] p-2 rounded-xl text-center">
                                  <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-[#6A5652]">
                                    <Bookmark className="w-3 h-3 text-[#486C2F]" />
                                    <span>Saves</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-black font-mono text-[#2A1A18] mt-0.5">
                                    {post.saves.toLocaleString()}
                                  </div>
                                </div>

                                {/* Comments */}
                                <div className="bg-[#FAF6E8] p-2 rounded-xl text-center">
                                  <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-[#6A5652]">
                                    <MessageSquare className="w-3 h-3 text-[#EF6905]" />
                                    <span>Comments</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-black font-mono text-[#2A1A18] mt-0.5">
                                    {post.comments.toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              {/* Diagnosis & "Why at Top / Bottom" Action Button on Every Post */}
                              <div className="pt-2 border-t border-[#E8DEB7]/60" onClick={(e) => e.stopPropagation()}>
                                {top15RankMap.has(post.id) ? (
                                  <button
                                    onClick={() => {
                                      setSelectedDiagnosisPost(post);
                                      setSelectedDiagnosisRank({ type: 'top', rank: top15RankMap.get(post.id)! });
                                    }}
                                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#8B2626] to-[#EF6905] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                                  >
                                    <Trophy className="w-3.5 h-3.5 text-[#F1E5A1]" />
                                    <span>Why Top #{top15RankMap.get(post.id)}? • Winning Formula</span>
                                  </button>
                                ) : bottom15RankMap.has(post.id) ? (
                                  <button
                                    onClick={() => {
                                      setSelectedDiagnosisPost(post);
                                      setSelectedDiagnosisRank({ type: 'bottom', rank: bottom15RankMap.get(post.id)! });
                                    }}
                                    className="w-full py-2 px-3 rounded-xl bg-[#2A1A18] hover:bg-[#3E2522] text-[#FAF6E8] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs border border-[#EF6905]/50 cursor-pointer"
                                  >
                                    <TrendingDown className="w-3.5 h-3.5 text-[#EF6905]" />
                                    <span>Why Bottom #{bottom15RankMap.get(post.id)}? + How to Fix</span>
                                    <Sparkles className="w-3.5 h-3.5 text-[#F1E5A1]" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedDiagnosisPost(post);
                                      setSelectedDiagnosisRank(null);
                                    }}
                                    className="w-full py-2 px-3 rounded-xl bg-[#FAF6E8] hover:bg-[#E8DEB7] text-[#2A1A18] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#E8DEB7] cursor-pointer"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-[#8B2626]" />
                                    <span>Why This Rank? • Diagnostic & Ideas</span>
                                  </button>
                                )}
                              </div>

                              {/* Secondary bar: Watch time + Shares + Inspect */}
                              <div className="flex items-center justify-between text-[11px] text-[#6A5652] pt-1 border-t border-[#E8DEB7]/40">
                                <div className="flex items-center gap-2">
                                  {post.shares !== undefined && (
                                    <span className="flex items-center gap-1">
                                      <Share2 className="w-3 h-3 text-[#6A5652]" />
                                      <strong>{post.shares.toLocaleString()}</strong> shares
                                    </span>
                                  )}
                                </div>

                                <span className="text-[11px] font-bold text-[#8B2626] group-hover:underline flex items-center gap-1 cursor-pointer">
                                  <span>Inspect Metrics</span>
                                  <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pagination Bar (when postsPerPage is not 'ALL' and multiple pages exist) */}
                    {postsPerPage !== 'ALL' && totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-[#E8DEB7] flex-wrap gap-3">
                        <button
                          onClick={() => setCurrentPostPage((p) => Math.max(1, p - 1))}
                          disabled={safePage <= 1}
                          className="px-3 py-1.5 rounded-xl border border-[#E8DEB7] bg-[#FFFFFF] hover:bg-[#FAF6E8] text-xs font-bold text-[#2A1A18] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-1 flex-wrap">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                            <button
                              key={pg}
                              onClick={() => setCurrentPostPage(pg)}
                              className={`w-7 h-7 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                safePage === pg
                                  ? 'bg-[#8B2626] text-white shadow-xs'
                                  : 'bg-[#FFFFFF] text-[#6A5652] hover:bg-[#FAF6E8] border border-[#E8DEB7]'
                              }`}
                            >
                              {pg}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setCurrentPostPage((p) => Math.min(totalPages, p + 1))}
                          disabled={safePage >= totalPages}
                          className="px-3 py-1.5 rounded-xl border border-[#E8DEB7] bg-[#FFFFFF] hover:bg-[#FAF6E8] text-xs font-bold text-[#2A1A18] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* POST TELEMETRY INSPECTION MODAL */}
      {/* ========================================================================= */}
      {selectedInspectPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => {
            setSelectedInspectPost(null);
            setSelectedInspectRank(null);
          }}
        >
          <div
            className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FFFFFF]/95 backdrop-blur-md px-6 py-4 border-b border-[#E8DEB7] flex items-center justify-between z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#8B2626]/10 text-[#8B2626] border border-[#8B2626]/20">
                  {selectedInspectPost.mediaType === 'VIDEO' ? 'Reel / Video' : selectedInspectPost.mediaType === 'CAROUSEL_ALBUM' ? 'Carousel Album' : 'Photo'}
                </span>
                {selectedInspectRank?.type === 'top' && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-[#8B2626] to-[#EF6905] text-[#FAF6E8] shadow-2xs border border-[#F1E5A1]/50 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-[#F1E5A1]" />
                    <span>Top #{selectedInspectRank.rank} Performer</span>
                  </span>
                )}
                {selectedInspectRank?.type === 'bottom' && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2A1A18] text-[#FAF6E8] border border-[#EF6905]/50 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-[#EF6905]" />
                    <span>Bottom #{selectedInspectRank.rank} Performer</span>
                  </span>
                )}
                <span className="text-xs text-[#6A5652]">
                  Published on {selectedInspectPost.formattedDate}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedInspectPost(null);
                  setSelectedInspectRank(null);
                }}
                className="w-8 h-8 rounded-full bg-[#FAF6E8] hover:bg-[#E8DEB7] text-[#2A1A18] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Media Preview */}
              {(selectedInspectPost.thumbnailUrl || selectedInspectPost.mediaUrl) && (
                <div className="relative rounded-2xl overflow-hidden bg-black max-h-80 flex items-center justify-center border border-[#E8DEB7]">
                  <img
                    src={selectedInspectPost.thumbnailUrl || selectedInspectPost.mediaUrl}
                    alt={selectedInspectPost.caption || 'Meta post'}
                    className="max-h-80 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {selectedInspectPost.mediaType === 'VIDEO' && (
                    <div className="absolute bottom-3 left-3 bg-black/75 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border border-white/20">
                      <Clock className="w-3.5 h-3.5 text-[#EF6905]" />
                      <span>{selectedInspectPost.formattedWatchTime} audience watch time</span>
                    </div>
                  )}
                </div>
              )}

              {/* Realistic Diagnostic & Content Revival Banner */}
              <div className="p-4 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#8B2626]">
                    {selectedInspectRank?.type === 'top' ? (
                      <Trophy className="w-4 h-4 text-[#EF6905]" />
                    ) : selectedInspectRank?.type === 'bottom' ? (
                      <TrendingDown className="w-4 h-4 text-[#EF6905]" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[#8B2626]" />
                    )}
                    <span>
                      {selectedInspectRank?.type === 'top'
                        ? `Top #${selectedInspectRank.rank} Algorithmic Diagnosis & Reusable Formula`
                        : selectedInspectRank?.type === 'bottom'
                        ? `Bottom #${selectedInspectRank.rank} Underperformance Cause & Content Revival Blueprint`
                        : 'Algorithmic Diagnostics & Content Improvement Ideas'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6A5652]">
                    {selectedInspectRank?.type === 'bottom'
                      ? 'Find out why audience retention dropped, and get 3 high-retention viral hook rewrites and scene pacing.'
                      : 'Review the retention hold rates and repeatable framework that made this post reach peak engagement.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDiagnosisPost(selectedInspectPost);
                    setSelectedDiagnosisRank(selectedInspectRank);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#8B2626] hover:bg-[#722020] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F1E5A1]" />
                  <span>{selectedInspectRank?.type === 'bottom' ? 'View Revival Blueprint' : 'View Full Diagnosis'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Full Caption */}
              <div className="space-y-1.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#6A5652]">Full Post Caption</h5>
                <div className="bg-[#FAF6E8] p-4 rounded-2xl border border-[#E8DEB7] text-xs text-[#2A1A18] leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto">
                  {selectedInspectPost.caption || 'No caption provided on this post.'}
                </div>
              </div>

              {/* Telemetry Metrics Breakdown */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#6A5652]">Performance Metrics</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#FAF6E8] p-3 rounded-xl border border-[#E8DEB7]/60">
                    <div className="text-[10px] uppercase font-bold text-[#6A5652] flex items-center gap-1">
                      {selectedInspectPost.mediaType === 'VIDEO' ? (
                        <Play className="w-3 h-3 text-[#8B2626]" />
                      ) : selectedInspectPost.mediaType === 'CAROUSEL_ALBUM' ? (
                        <Layers className="w-3 h-3 text-[#8B2626]" />
                      ) : (
                        <Eye className="w-3 h-3 text-[#8B2626]" />
                      )}
                      <span>
                        {selectedInspectPost.mediaType === 'VIDEO' ? 'Views / Plays' : 'Impressions / Views'}
                      </span>
                    </div>
                    <div className="text-lg font-black font-mono text-[#2A1A18] mt-1">
                      {resolvePostViews(selectedInspectPost).toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-[#FAF6E8] p-3 rounded-xl border border-[#E8DEB7]/60">
                    <div className="text-[10px] uppercase font-bold text-[#6A5652] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#EF6905]" />
                      <span>{selectedInspectPost.mediaType === 'VIDEO' ? 'Watch Time' : 'Media Type'}</span>
                    </div>
                    <div className="text-lg font-black font-mono text-[#2A1A18] mt-1 text-sm sm:text-base">
                      {selectedInspectPost.mediaType === 'VIDEO'
                        ? selectedInspectPost.formattedWatchTime
                        : selectedInspectPost.mediaType === 'CAROUSEL_ALBUM'
                        ? 'Carousel Album'
                        : 'Single Photo'}
                    </div>
                  </div>

                  <div className="bg-[#FAF6E8] p-3 rounded-xl border border-[#E8DEB7]/60">
                    <div className="text-[10px] uppercase font-bold text-[#6A5652] flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-[#486C2F]" />
                      <span>Saves</span>
                    </div>
                    <div className="text-lg font-black font-mono text-[#2A1A18] mt-1">
                      {selectedInspectPost.saves.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-[#FAF6E8] p-3 rounded-xl border border-[#E8DEB7]/60">
                    <div className="text-[10px] uppercase font-bold text-[#6A5652] flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#8B2626]" />
                      <span>Likes</span>
                    </div>
                    <div className="text-lg font-black font-mono text-[#2A1A18] mt-1">
                      {selectedInspectPost.likes.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-[#FAF6E8] p-3 rounded-xl border border-[#E8DEB7]/60">
                    <div className="text-[10px] uppercase font-bold text-[#6A5652] flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-[#EF6905]" />
                      <span>Comments</span>
                    </div>
                    <div className="text-lg font-black font-mono text-[#2A1A18] mt-1">
                      {selectedInspectPost.comments.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-[#FAF6E8] p-3 rounded-xl border border-[#E8DEB7]/60">
                    <div className="text-[10px] uppercase font-bold text-[#6A5652] flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-[#6A5652]" />
                      <span>Shares</span>
                    </div>
                    <div className="text-lg font-black font-mono text-[#2A1A18] mt-1">
                      {selectedInspectPost.shares !== undefined ? selectedInspectPost.shares.toLocaleString() : '0'}
                    </div>
                  </div>

                  <div className="bg-[#FAF6E8] p-3 rounded-xl border border-[#E8DEB7]/60">
                    <div className="text-[10px] uppercase font-bold text-[#6A5652] flex items-center gap-1">
                      <Eye className="w-3 h-3 text-[#486C2F]" />
                      <span>Reach</span>
                    </div>
                    <div className="text-lg font-black font-mono text-[#2A1A18] mt-1">
                      {selectedInspectPost.reach ? selectedInspectPost.reach.toLocaleString() : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-[#FAF6E8] p-3 rounded-xl border border-[#E8DEB7]/60">
                    <div className="text-[10px] uppercase font-bold text-[#6A5652] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#EF6905]" />
                      <span>Engagement</span>
                    </div>
                    <div className="text-lg font-black font-mono text-[#486C2F] mt-1">
                      {selectedInspectPost.engagementRate || '0%'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta ID & External Links */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8DEB7] text-xs text-[#6A5652]">
                <div className="font-mono text-[11px] truncate max-w-xs">
                  ID: <span className="text-[#2A1A18]">{selectedInspectPost.id}</span>
                </div>
                {selectedInspectPost.permalink && (
                  <a
                    href={selectedInspectPost.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B2626] text-white font-bold hover:bg-[#722020] transition-colors cursor-pointer w-fit"
                  >
                    <span>View on Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REALISTIC POST PERFORMANCE DIAGNOSIS & REVIVAL BLUEPRINT MODAL */}
      {/* ========================================================================= */}
      <PostDiagnosisModal
        isOpen={!!selectedDiagnosisPost}
        onClose={() => {
          setSelectedDiagnosisPost(null);
          setSelectedDiagnosisRank(null);
        }}
        post={selectedDiagnosisPost}
        rankInfo={selectedDiagnosisRank}
        resolveViews={resolvePostViews}
        onInspectFull={(post) => {
          setSelectedInspectPost(post);
          setSelectedInspectRank(selectedDiagnosisRank);
        }}
      />

      {/* ========================================================================= */}
      {/* INTERACTIVE CHECKOUT & PAYMENT MODAL */}
      {/* ========================================================================= */}
      {isCheckoutOpen && selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => {
            if (!isProcessingPayment) setIsCheckoutOpen(false);
          }}
        >
          <div
            className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {!isProcessingPayment && (
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-5 right-5 text-[#6A5652] hover:text-[#2A1A18] p-1 rounded-lg hover:bg-[#FAF6E8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Payment Successful State */}
            {paymentSuccess ? (
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#486C2F]/15 text-[#486C2F] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#2A1A18] tracking-tight">
                  Welcome to {selectedPlan.name}!
                </h3>
                <p className="text-xs sm:text-sm text-[#6A5652] max-w-sm mx-auto">
                  Your payment was verified. Your brand intelligence pipeline for <strong>{user.companyBrand || user.name}</strong> is fully activated.
                </p>

                <div className="p-4 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] text-xs text-left space-y-1.5">
                  <div className="flex justify-between font-bold text-[#2A1A18]">
                    <span>Subscription Tier:</span>
                    <span>{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between text-[#6A5652]">
                    <span>Billing:</span>
                    <span>{billingCycle === 'annual' ? 'Annual (20% off applied)' : 'Monthly'}</span>
                  </div>
                  <div className="flex justify-between text-[#486C2F] font-bold pt-1 border-t border-[#E8DEB7]">
                    <span>Status:</span>
                    <span>Active & Synced</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={<ArrowRight className="w-4 h-4" />}
                    onClick={handleFinishCheckoutAndEnterWorkspace}
                  >
                    Enter My Live Workspace Now
                  </Button>
                </div>
              </div>
            ) : (
              /* Order & Payment Form */
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1] text-[#8B2626] mb-2">
                    <Sparkles className="w-3 h-3 text-[#EF6905]" />
                    <span>START YOUR JOURNEY</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2A1A18] tracking-tight">
                    Confirm {selectedPlan.name}
                  </h3>
                  <p className="text-xs text-[#6A5652] mt-0.5">
                    Activating growth workspace for <strong>{user.companyBrand || user.name}</strong>.
                  </p>
                </div>

                {/* Plan Summary Box */}
                <div className="p-4 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#2A1A18]">{selectedPlan.name}</span>
                      <span className="text-xs text-[#6A5652] ml-1">({billingCycle})</span>
                    </div>
                    <span className="font-mono font-black text-lg text-[#2A1A18]">{selectedPlan.price}</span>
                  </div>

                  {couponApplied && couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-xs text-[#486C2F] font-bold">
                      <span>Promo Discount</span>
                      <span>-{currency === 'INR' ? `₹${couponDiscount}` : `$${couponDiscount}`}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#E8DEB7] flex items-center justify-between text-xs font-black text-[#2A1A18]">
                    <span>Total Due Today:</span>
                    <span className="font-mono text-base text-[#8B2626]">
                      {couponApplied 
                        ? (currency === 'INR' ? `₹${selectedPlan.numericPrice - couponDiscount}` : `$${selectedPlan.numericPrice - couponDiscount}`) 
                        : selectedPlan.price}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo code (try GENIE50)"
                      className="flex-grow bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl px-3 py-2 text-xs font-mono uppercase text-[#2A1A18] placeholder:normal-case placeholder:font-sans placeholder:text-[#6A5652]/40"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-[#8B2626] bg-[#F1E5A1] hover:bg-[#E8DEB7] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-[11px] mt-1 font-bold ${couponApplied ? 'text-[#486C2F]' : 'text-[#8B2626]'}`}>
                      {couponMessage}
                    </p>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#2A1A18] block">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'border-[#8B2626] bg-[#8B2626]/5 text-[#8B2626] shadow-xs'
                          : 'border-[#E8DEB7] bg-[#FFFFFF] text-[#6A5652] hover:bg-[#FAF6E8]'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-[#8B2626] bg-[#8B2626]/5 text-[#8B2626] shadow-xs'
                          : 'border-[#E8DEB7] bg-[#FFFFFF] text-[#6A5652] hover:bg-[#FAF6E8]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        paymentMethod === 'netbanking'
                          ? 'border-[#8B2626] bg-[#8B2626]/5 text-[#8B2626] shadow-xs'
                          : 'border-[#E8DEB7] bg-[#FFFFFF] text-[#6A5652] hover:bg-[#FAF6E8]'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>NetBanking</span>
                    </button>
                  </div>
                </div>

                {/* Payment Input Details */}
                {paymentMethod === 'upi' && (
                  <div>
                    <label className="text-xs font-bold text-[#2A1A18] block mb-1">
                      UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi or user@okhdfcbank"
                      className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl px-3 py-2 text-xs font-mono text-[#2A1A18] placeholder:text-[#6A5652]/40"
                    />
                    <span className="text-[10px] text-[#6A5652] mt-1 block">
                      Instant collect request will be sent to your PhonePe / GPay / Paytm app.
                    </span>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Card number (Visa, MasterCard, RuPay, Amex)"
                      className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl px-3 py-2 text-xs font-mono text-[#2A1A18] placeholder:text-[#6A5652]/40"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] rounded-xl px-3 py-2 text-xs font-mono text-[#2A1A18]"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        className="bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] rounded-xl px-3 py-2 text-xs font-mono text-[#2A1A18]"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div>
                    <select className="w-full bg-[#FFFFFF] border border-[#E8DEB7] rounded-xl px-3 py-2 text-xs text-[#2A1A18]">
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Other Bank</option>
                    </select>
                  </div>
                )}

                {/* Submit & Guarantee */}
                <div className="pt-2 space-y-3">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={isProcessingPayment}
                    onClick={handleProcessPayment}
                    icon={isProcessingPayment ? undefined : <CheckCircle2 className="w-4 h-4" />}
                  >
                    {isProcessingPayment ? 'Securing Transaction & Verifying...' : 'Pay & Activate Workspace'}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#6A5652]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#486C2F]" />
                    <span>14-day zero-risk money-back guarantee. Cancel anytime.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONNECT GRAPH API KEY MODAL */}
      {/* ========================================================================= */}
      {isConnectModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsConnectModalOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-5 right-5 text-[#6A5652] hover:text-[#2A1A18] p-1 rounded-lg hover:bg-[#FAF6E8] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8B2626]/10 border border-[#8B2626]/20 flex items-center justify-center text-[#8B2626] shrink-0">
                <KeyRound className="w-5 h-5 text-[#8B2626]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#2A1A18]">Connect Graph API Key</h3>
                <p className="text-xs text-[#6A5652] mt-0.5">
                  Fetch your Meta ad account telemetry and reel hook drop-offs.
                </p>
              </div>
            </div>

            {/* Input & Fetch Account Button */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#2A1A18]">
                Meta Graph API Access Token <span className="text-[#EF6905]">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={graphApiKeyInput}
                  onChange={(e) => {
                    setGraphApiKeyInput(e.target.value);
                    if (graphApiError) setGraphApiError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleFetchAccount();
                    }
                  }}
                  placeholder="Paste token (e.g. EAABw...)"
                  className="w-full bg-[#FAF6E8]/70 border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm font-mono text-[#2A1A18] placeholder:text-[#6A5652]/50 transition-colors shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const demoToken = 'EAABwzL1o9ZB8BALv94Y7q0DemoKeyLivev19Stream';
                    setGraphApiKeyInput(demoToken);
                    handleFetchAccount(demoToken);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#EF6905] hover:text-[#8B2626] bg-[#FFFFFF] border border-[#E8DEB7] px-2 py-1 rounded-lg hover:bg-[#FAF6E8] cursor-pointer"
                >
                  Sample Key
                </button>
              </div>

              {graphApiError && (
                <div className="p-3 rounded-xl bg-[#8B2626]/12 border border-[#8B2626]/30 text-[#8B2626] text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{graphApiError}</span>
                </div>
              )}

              {user.graphApiAccount && (
                <div className="p-3.5 rounded-2xl bg-[#FAF6E8] border border-[#486C2F]/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-[#2A1A18]">
                      {user.graphApiAccount.profilePictureUrl ? (
                        <img
                          src={user.graphApiAccount.profilePictureUrl}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-[#486C2F]/40"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#486C2F]/15 flex items-center justify-center font-bold text-xs text-[#486C2F]">
                          {(user.graphApiAccount.profileName || 'M').charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-black text-[#2A1A18]">
                          {user.graphApiAccount.profileName || user.graphApiAccount.accountName}
                        </div>
                        {user.graphApiAccount.username && (
                          <div className="text-[10px] font-mono text-[#8B2626]">
                            @{user.graphApiAccount.username}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-[#6A5652]">Followers</div>
                      <div className="text-sm font-black font-mono text-[#2A1A18]">
                        {user.graphApiAccount.formattedFollowers || (user.graphApiAccount.followersCount !== undefined ? user.graphApiAccount.followersCount.toLocaleString() : '0')}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#486C2F] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#486C2F]" />
                    <span>{user.graphApiAccount.status}</span>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="md"
                className="w-full"
                disabled={isFetchingAccount}
                onClick={() => handleFetchAccount()}
                icon={isFetchingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              >
                {isFetchingAccount ? 'Fetching Meta Account...' : 'Fetch Account'}
              </Button>
            </div>

            {/* Steps and links to obtain key */}
            <div className="border-t border-[#E8DEB7] pt-4 space-y-2.5">
              <div className="text-xs font-bold text-[#2A1A18] uppercase tracking-wide flex items-center justify-between">
                <span>Steps to create your Graph API Key:</span>
                <span className="text-[10px] font-normal text-[#6A5652] lowercase">takes ~2 mins</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#2A1A18]">1. Meta for Developers</div>
                    <p className="text-[#6A5652] text-[11px] mt-0.5">Log in and create a Business App.</p>
                  </div>
                  <a
                    href="https://developers.facebook.com/apps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#EF6905] hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#2A1A18]">2. Graph API Explorer</div>
                    <p className="text-[#6A5652] text-[11px] mt-0.5">Select your App & choose "Get User Access Token".</p>
                  </div>
                  <a
                    href="https://developers.facebook.com/tools/explorer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#EF6905] hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#2A1A18]">3. Select Permissions</div>
                    <p className="text-[#6A5652] text-[11px] mt-0.5">Check <code className="bg-white px-1 py-0.2 rounded border">ads_read</code>, <code className="bg-white px-1 py-0.2 rounded border">ads_management</code>, and <code className="bg-white px-1 py-0.2 rounded border">read_insights</code>.</p>
                  </div>
                  <a
                    href="https://developers.facebook.com/docs/graph-api/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#EF6905] hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    <span>Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7]">
                  <div className="font-bold text-[#2A1A18]">4. Copy Token & Fetch Account</div>
                  <p className="text-[#6A5652] text-[11px] mt-0.5">Click "Generate Access Token", copy the string starting with <code>EAA...</code>, paste it above, and click "Fetch Account".</p>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setIsConnectModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
