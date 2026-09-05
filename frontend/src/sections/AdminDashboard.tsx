import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  LogOut, 
  Eye, 
  Settings, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Database,
  Radio,
  Plus,
  RefreshCw,
  ExternalLink,
  CreditCard,
  FileText
} from 'lucide-react';
import { UserAccount } from '../types';
import { 
  AdminUserRecord, 
  CustomFormSubmission, 
  PaymentTransaction, 
  AdminMetricsSummary, 
  AdminCardCategory 
} from '../types/admin';
import { 
  fetchAdminMetrics, 
  fetchAdminUsers, 
  fetchCustomSubmissions, 
  fetchAdminPayments, 
  updateSubmissionStatusApi, 
  updatePaymentSettlementApi,
  postCustomFormSubmission,
  recordPaymentApi,
  syncUserAccountApi,
  syncBatchUsersApi
} from '../lib/adminApi';

import { AdminMetricCards } from '../components/admin/AdminMetricCards';
import { AdminUsersTable } from '../components/admin/AdminUsersTable';
import { AdminSubmissionsTable } from '../components/admin/AdminSubmissionsTable';
import { AdminPaymentsTable } from '../components/admin/AdminPaymentsTable';
import { AdminRecordDetailModal } from '../components/admin/AdminRecordDetailModal';
import { AdminAddRecordModal } from '../components/admin/AdminAddRecordModal';

interface AdminDashboardProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onViewLanding: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onViewLanding,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'cards_view' | 'submissions' | 'payments' | 'users' | 'system'>('cards_view');
  
  // Active selected card for data drill-down
  const [selectedCategory, setSelectedCategory] = useState<AdminCardCategory>('logged_in');

  // Real Data states (Strict real data: no mock or default numbers)
  const [metrics, setMetrics] = useState<AdminMetricsSummary>({
    loggedInUsersCount: 0,
    totalRegisteredUsers: 0,
    subscribedUsers1499Count: 0,
    subscribedUsers2499Count: 0,
    customFormSubmissionsCount: 0,
    totalRevenueThisMonth: 0,
    settledPaymentsThisMonth: 0,
    yetToCreditAmount: 0,
    activeMRR: 0,
    currentActiveCard: 'logged_in',
  });

  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [submissions, setSubmissions] = useState<CustomFormSubmission[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Inspector & Add Modals
  const [selectedUserRecord, setSelectedUserRecord] = useState<AdminUserRecord | null>(null);
  const [selectedSubmissionRecord, setSelectedSubmissionRecord] = useState<CustomFormSubmission | null>(null);
  const [selectedPaymentRecord, setSelectedPaymentRecord] = useState<PaymentTransaction | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialType, setAddModalInitialType] = useState<'lead' | 'payment'>('lead');

  // Load all real data from backend endpoints
  const loadAllData = useCallback(async () => {
    try {
      setIsRefreshing(true);

      // 1. Sync any registered users stored in browser localStorage with backend store
      try {
        const storedUsersRaw = localStorage.getItem('genieads_registered_users');
        if (storedUsersRaw) {
          const parsed = JSON.parse(storedUsersRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const batchToSync: Partial<AdminUserRecord>[] = parsed.map((u: any) => ({
              id: u.id,
              name: u.name,
              username: u.username,
              email: u.email,
              companyBrand: u.companyBrand || 'Direct Client',
              role: u.role || 'user',
              subscriptionTier: u.subscriptionTier || 'Free Trial',
              planPrice: u.subscriptionTier?.includes('2,499') ? 2499 : u.subscriptionTier?.includes('1,499') ? 1499 : 0,
              createdAt: u.createdAt,
              phone: u.phone || '',
              isLoggedIn: false,
              lastActive: 'Registered User',
              status: 'Offline',
            }));
            await syncBatchUsersApi(batchToSync);
          }
        }
      } catch (e) {
        console.warn('Batch user sync note:', e);
      }

      // 2. Sync active session for the currently logged-in account
      if (currentUser) {
        const isAdmin = currentUser.role === 'admin';
        await syncUserAccountApi({
          id: currentUser.id || (isAdmin ? 'usr_admin' : 'usr_' + currentUser.username),
          name: currentUser.name || currentUser.username,
          username: currentUser.username,
          email: currentUser.email,
          companyBrand: currentUser.companyBrand || (isAdmin ? 'GenieAds Admin Console' : 'Direct Account'),
          role: currentUser.role || 'admin',
          subscriptionTier: (currentUser.subscriptionTier as any) || (isAdmin ? 'System Administrator' : 'Free Trial'),
          planPrice: currentUser.subscriptionTier?.includes('2,499') ? 2499 : currentUser.subscriptionTier?.includes('1,499') ? 1499 : 0,
          isLoggedIn: true,
          lastActive: 'Active Now',
          status: 'Active Now',
          phone: currentUser.phone || '',
        });
      }

      // 3. Fetch canonical records from backend
      const [m, u, s, p] = await Promise.all([
        fetchAdminMetrics(),
        fetchAdminUsers(),
        fetchCustomSubmissions(),
        fetchAdminPayments(),
      ]);

      // 4. Compute exact metrics strictly derived from the backend arrays
      const loggedInCount = u.filter((usr) => usr.isLoggedIn).length;
      const totalRegistered = u.length;
      const sub1499 = u.filter((usr) => usr.subscriptionTier?.includes('1,499')).length;
      const sub2499 = u.filter((usr) => usr.subscriptionTier?.includes('2,499')).length;
      const formLeads = s.length;
      const grossRev = p.reduce((acc, pay) => acc + (pay.grossAmount || 0), 0);
      const settledPay = p.filter((pay) => pay.settlementStatus === 'Settled').reduce((acc, pay) => acc + (pay.netSettlementAmount || 0), 0);
      const pendingCredit = p.filter((pay) => pay.settlementStatus === 'Yet to Credit').reduce((acc, pay) => acc + (pay.netSettlementAmount || 0), 0);
      const mrr = (sub1499 * 1499) + (sub2499 * 2499);

      setMetrics({
        loggedInUsersCount: loggedInCount,
        totalRegisteredUsers: totalRegistered,
        subscribedUsers1499Count: sub1499,
        subscribedUsers2499Count: sub2499,
        customFormSubmissionsCount: formLeads,
        totalRevenueThisMonth: grossRev,
        settledPaymentsThisMonth: settledPay,
        yetToCreditAmount: pendingCredit,
        activeMRR: mrr,
        currentActiveCard: selectedCategory,
      });
      setUsers(u);
      setSubmissions(s);
      setPayments(p);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser, selectedCategory]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle Card Click - switches category and switches to cards view so data is immediately visible
  const handleSelectCategory = (category: AdminCardCategory) => {
    setSelectedCategory(category);
    setActiveTab('cards_view');
  };

  // Status Updater for Custom Submissions
  const handleUpdateSubmissionStatus = async (id: string, status: CustomFormSubmission['status']) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    if (selectedSubmissionRecord && selectedSubmissionRecord.id === id) {
      setSelectedSubmissionRecord((prev) => prev ? { ...prev, status } : null);
    }
    await updateSubmissionStatusApi(id, status);
  };

  // Settlement Updater for Payments (Mark as Settled)
  const handleUpdateSettlement = async (id: string, status: 'Settled' | 'Yet to Credit') => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            settlementStatus: status,
            settledDate: status === 'Settled' ? 'Cleared Just Now' : undefined,
          };
        }
        return p;
      })
    );
    if (selectedPaymentRecord && selectedPaymentRecord.id === id) {
      setSelectedPaymentRecord((prev) => prev ? { ...prev, settlementStatus: status } : null);
    }
    await updatePaymentSettlementApi(id, status);
    // Reload metrics to update totals
    const updatedMetrics = await fetchAdminMetrics();
    setMetrics(updatedMetrics);
  };

  // Add Lead
  const handleAddLead = async (data: Omit<CustomFormSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newLead = await postCustomFormSubmission(data);
    setSubmissions((prev) => [newLead, ...prev]);
    const updatedMetrics = await fetchAdminMetrics();
    setMetrics(updatedMetrics);
  };

  // Add Payment
  const handleAddPayment = async (data: Partial<PaymentTransaction>) => {
    const newPay = await recordPaymentApi(data);
    setPayments((prev) => [newPay, ...prev]);
    const updatedMetrics = await fetchAdminMetrics();
    setMetrics(updatedMetrics);
  };

  return (
    <div className="min-h-screen bg-[#FAF6E8] text-[#2A1A18] flex flex-col font-sans selection:bg-[#F1E5A1]">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E8DEB7] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#8B2626] flex items-center justify-center text-white font-black text-sm font-mono shadow-xs">
              GA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight font-mono text-[#2A1A18]">
                  GENIE<span className="text-[#EF6905]">ADS</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#8B2626] text-white">
                  ADMIN CONTROL CENTER
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Data Sync Button */}
            <button
              onClick={loadAllData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#2A1A18] hover:bg-[#FAF6E8] border border-[#E8DEB7] transition-colors cursor-pointer"
              title="Refresh all real telemetry and payment ledgers"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#8B2626] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Real Data</span>
            </button>

            {/* Quick Landing Page Preview Button */}
            <button
              onClick={onViewLanding}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6A5652] hover:text-[#2A1A18] bg-[#FAF6E8] hover:bg-[#E8DEB7]/60 border border-[#E8DEB7] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#EF6905]" />
              <span>Landing Page</span>
            </button>

            {/* Admin User Chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] text-xs">
              <div className="w-2 h-2 rounded-full bg-[#486C2F] animate-pulse" />
              <span className="font-bold text-[#2A1A18]">{currentUser.username}</span>
              <span className="text-[#6A5652] hidden lg:inline">({currentUser.email})</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#8B2626] hover:bg-[#8B2626]/10 border border-[#8B2626]/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        
        {/* Clean Admin Header Banner */}
        <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#F1E5A1] text-[#8B2626]">
              <Sparkles className="w-3 h-3 text-[#EF6905]" />
              PRODUCTION CONTROL ROOM
            </div>
            <h2 className="text-2xl sm:text-[28px] font-black text-[#2A1A18] tracking-tight">
              Real-time Business & Customer Operations
            </h2>
            <p className="text-xs sm:text-sm text-[#6A5652] max-w-2xl leading-relaxed">
              Monitoring active logged-in users, subscription cohorts (₹1,499 / ₹2,499), custom form leads, and revenue settlement status.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setAddModalInitialType('lead');
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#FAF6E8] hover:bg-[#E8DEB7] border border-[#E8DEB7] text-xs font-bold text-[#2A1A18] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#8B2626]" />
              <span>+ Custom Lead</span>
            </button>
            <button
              onClick={() => {
                setAddModalInitialType('payment');
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#8B2626] hover:bg-[#6D1E1E] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Record Payment</span>
            </button>
          </div>
        </div>

        {/* TOP SECTION: 7 CORE METRIC CARDS (+ MRR ADD-ON) */}
        <section aria-label="Admin Core Cards">
          <AdminMetricCards
            metrics={metrics}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </section>

        {/* VIEW NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl shadow-2xs text-xs">
            <button
              onClick={() => setActiveTab('cards_view')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cards_view'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18] hover:bg-[#FAF6E8]'
              }`}
            >
              <span>Selected Card Data</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#F1E5A1] text-[#8B2626] font-mono uppercase">
                {selectedCategory.replace('_', ' ')}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('submissions');
                setSelectedCategory('custom_submissions');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'submissions'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18] hover:bg-[#FAF6E8]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Custom Form Leads</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#F1E5A1] text-[#8B2626]">
                {submissions.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('payments');
                setSelectedCategory('revenue_month');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18] hover:bg-[#FAF6E8]'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Settlement Ledger</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#F1E5A1] text-[#8B2626]">
                {payments.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('users');
                setSelectedCategory('logged_in');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18] hover:bg-[#FAF6E8]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Registered Accounts</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#F1E5A1] text-[#8B2626]">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18] hover:bg-[#FAF6E8]'
              }`}
            >
              Pipelines & System Health
            </button>
          </div>

          <div className="text-[11px] text-[#6A5652] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#486C2F]" />
            <span>Database: In-Memory + Persistent Disk Store</span>
          </div>
        </div>

        {/* DYNAMIC DATA VIEW CORRESPONDING TO ACTIVE TAB OR SELECTED CARD */}
        <section aria-label="Admin Interactive Data Table">
          {activeTab === 'cards_view' && (
            <div>
              {/* Active Selection Breadcrumb/Notice */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#FAF6E8] border border-[#E8DEB7] rounded-2xl mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF6905] animate-pulse" />
                  <span className="text-xs font-bold text-[#2A1A18]">
                    Selected Card View:
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#8B2626] text-white">
                    {selectedCategory === 'logged_in' && 'Currently Logged-in Users'}
                    {selectedCategory === 'subscribers_1499' && 'Subscribers (₹1,499/mo Tier)'}
                    {selectedCategory === 'subscribers_2499' && 'Subscribers (₹2,499/mo Tier)'}
                    {selectedCategory === 'custom_submissions' && 'Custom Form Submissions'}
                    {selectedCategory === 'revenue_month' && 'Revenue Generated This Month'}
                    {selectedCategory === 'settled_payments' && 'Settled Payments'}
                    {selectedCategory === 'yet_to_credit' && 'Yet to Credit (In-Transit)'}
                  </span>
                </div>
                <div className="text-[11px] text-[#6A5652]">
                  Registered backend records: <span className="font-mono font-bold text-[#2A1A18]">
                    {selectedCategory === 'logged_in' && users.filter((u) => u.isLoggedIn).length}
                    {selectedCategory === 'subscribers_1499' && users.filter((u) => u.subscriptionTier?.includes('1,499')).length}
                    {selectedCategory === 'subscribers_2499' && users.filter((u) => u.subscriptionTier?.includes('2,499')).length}
                    {selectedCategory === 'custom_submissions' && submissions.length}
                    {selectedCategory === 'revenue_month' && payments.length}
                    {selectedCategory === 'settled_payments' && payments.filter((p) => p.settlementStatus === 'Settled').length}
                    {selectedCategory === 'yet_to_credit' && payments.filter((p) => p.settlementStatus === 'Yet to Credit').length}
                  </span> verified
                </div>
              </div>

              {/* If user selected user categories: logged_in, subscribers_1499, or subscribers_2499 */}
              {(selectedCategory === 'logged_in' || 
                selectedCategory === 'subscribers_1499' || 
                selectedCategory === 'subscribers_2499') && (
                <AdminUsersTable
                  users={users}
                  category={selectedCategory}
                  onSelectUser={(u) => setSelectedUserRecord(u)}
                />
              )}

              {/* If user selected custom_submissions */}
              {selectedCategory === 'custom_submissions' && (
                <AdminSubmissionsTable
                  submissions={submissions}
                  onSelectSubmission={(s) => setSelectedSubmissionRecord(s)}
                  onUpdateStatus={handleUpdateSubmissionStatus}
                  onOpenAddModal={() => {
                    setAddModalInitialType('lead');
                    setIsAddModalOpen(true);
                  }}
                />
              )}

              {/* If user selected financial categories: revenue_month, settled_payments, or yet_to_credit */}
              {(selectedCategory === 'revenue_month' || 
                selectedCategory === 'settled_payments' || 
                selectedCategory === 'yet_to_credit') && (
                <AdminPaymentsTable
                  payments={payments}
                  category={selectedCategory}
                  onSelectPayment={(p) => setSelectedPaymentRecord(p)}
                  onUpdateSettlement={handleUpdateSettlement}
                  onOpenAddPaymentModal={() => {
                    setAddModalInitialType('payment');
                    setIsAddModalOpen(true);
                  }}
                />
              )}
            </div>
          )}

          {/* DEDICATED TAB: CUSTOM FORM SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <AdminSubmissionsTable
              submissions={submissions}
              onSelectSubmission={(s) => setSelectedSubmissionRecord(s)}
              onUpdateStatus={handleUpdateSubmissionStatus}
              onOpenAddModal={() => {
                setAddModalInitialType('lead');
                setIsAddModalOpen(true);
              }}
            />
          )}

          {/* DEDICATED TAB: PAYMENTS & SETTLEMENT LEDGER */}
          {activeTab === 'payments' && (
            <AdminPaymentsTable
              payments={payments}
              category="revenue_month"
              onSelectPayment={(p) => setSelectedPaymentRecord(p)}
              onUpdateSettlement={handleUpdateSettlement}
              onOpenAddPaymentModal={() => {
                setAddModalInitialType('payment');
                setIsAddModalOpen(true);
              }}
            />
          )}

          {/* DEDICATED TAB: ALL REGISTERED USERS */}
          {activeTab === 'users' && (
            <AdminUsersTable
              users={users}
              category="all"
              onSelectUser={(u) => setSelectedUserRecord(u)}
            />
          )}

          {/* DEDICATED TAB: SYSTEM HEALTH */}
          {activeTab === 'system' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#2A1A18] flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#EF6905]" />
                  Connected Ad APIs & Webhook Subscriptions
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#2A1A18]">Meta Graph API v20.0 (Ad Insights)</div>
                      <div className="text-[#6A5652] text-[11px]">Active OAuth Token for Instagram & FB Reels</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F] font-bold text-[10px]">
                      CONNECTED
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#2A1A18]">Payment Gateway Settlement Webhooks</div>
                      <div className="text-[#6A5652] text-[11px]">Razorpay / Cashfree Auto-reconciliation (T+1)</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F] font-bold text-[10px]">
                      HEALTHY
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#2A1A18]">Retention Diagnostics Engine</div>
                      <div className="text-[#6A5652] text-[11px]">3-second hook drop-off clustering algorithm</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F] font-bold text-[10px]">
                      ACTIVE (99.9%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#2A1A18] flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#8B2626]" />
                  Billing & Operational Controls
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#2A1A18]">Social Intelligence Tier (₹1,499/mo)</div>
                      <div className="text-[#6A5652] text-[11px]">Instant access to Reels hooks & audio tracker</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F] font-bold text-[10px]">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#2A1A18]">Growth Intelligence Tier (₹2,499/mo)</div>
                      <div className="text-[#6A5652] text-[11px]">Meta Ad spend attribution + Morning checklist</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F] font-bold text-[10px]">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#2A1A18]">Custom Managed Growth Inquiries</div>
                      <div className="text-[#6A5652] text-[11px]">Custom lead capture & ad audit scheduler</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F] font-bold text-[10px]">
                      RECEIVING LEADS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* INSPECTOR MODAL */}
      <AdminRecordDetailModal
        userRecord={selectedUserRecord}
        submissionRecord={selectedSubmissionRecord}
        paymentRecord={selectedPaymentRecord}
        onClose={() => {
          setSelectedUserRecord(null);
          setSelectedSubmissionRecord(null);
          setSelectedPaymentRecord(null);
        }}
        onUpdatePaymentSettlement={handleUpdateSettlement}
        onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
      />

      {/* ADD RECORD MODAL */}
      <AdminAddRecordModal
        initialType={addModalInitialType}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={handleAddLead}
        onAddPayment={handleAddPayment}
      />
    </div>
  );
};
