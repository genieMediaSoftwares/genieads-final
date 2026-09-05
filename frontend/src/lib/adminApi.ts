import { 
  AdminUserRecord, 
  CustomFormSubmission, 
  PaymentTransaction, 
  AdminMetricsSummary 
} from '../types/admin';

export async function fetchAdminMetrics(): Promise<AdminMetricsSummary> {
  try {
    const res = await fetch('/api/admin/metrics');
    if (!res.ok) throw new Error('Failed to fetch metrics');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Backend metrics fetch failed, computing from local storage cache', err);
    return getLocalMetricsFallback();
  }
}

export async function fetchAdminUsers(): Promise<AdminUserRecord[]> {
  try {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using local users', err);
    return getLocalUsersFallback();
  }
}

export async function fetchCustomSubmissions(): Promise<CustomFormSubmission[]> {
  try {
    const res = await fetch('/api/admin/submissions');
    if (!res.ok) throw new Error('Failed to fetch submissions');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using local submissions', err);
    return getLocalSubmissionsFallback();
  }
}

export async function postCustomFormSubmission(data: {
  name: string;
  workEmail: string;
  phone: string;
  companyBrand: string;
  websiteUrl?: string;
  monthlyAdSpend: string;
  businessCategory: string;
  planInterest: 'Zero → Hero Managed (Custom)' | 'Custom Enterprise' | 'Growth Consulting';
  notes: string;
}): Promise<CustomFormSubmission> {
  try {
    const res = await fetch('/api/custom-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit form');
    const json = await res.json();
    
    // Also mirror to local storage
    saveLocalSubmission(json.data);
    return json.data;
  } catch (err) {
    console.warn('Fallback to local submission save', err);
    const localEntry: CustomFormSubmission = {
      id: 'cst_loc_' + Date.now().toString(36),
      name: data.name,
      workEmail: data.workEmail,
      phone: data.phone,
      companyBrand: data.companyBrand,
      websiteUrl: data.websiteUrl,
      monthlyAdSpend: data.monthlyAdSpend,
      businessCategory: data.businessCategory,
      planInterest: data.planInterest,
      notes: data.notes,
      submittedAt: 'Just now',
      status: 'New Lead',
    };
    saveLocalSubmission(localEntry);
    return localEntry;
  }
}

export async function updateSubmissionStatusApi(id: string, status: CustomFormSubmission['status']): Promise<void> {
  try {
    await fetch(`/api/admin/submissions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (e) {
    console.warn(e);
  }
}

export async function fetchAdminPayments(): Promise<PaymentTransaction[]> {
  try {
    const res = await fetch('/api/admin/payments');
    if (!res.ok) throw new Error('Failed to fetch payments');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using local payments', err);
    return getLocalPaymentsFallback();
  }
}

export async function recordPaymentApi(paymentData: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
  try {
    const res = await fetch('/api/admin/payments/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) throw new Error('Failed to record payment');
    const json = await res.json();
    saveLocalPayment(json.data);
    return json.data;
  } catch (err) {
    console.warn('Fallback to local payment record', err);
    const localPay: PaymentTransaction = {
      id: 'pay_loc_' + Date.now().toString(36),
      orderId: 'ORD-' + Date.now().toString().slice(-8),
      userId: paymentData.userId || 'usr_direct',
      customerName: paymentData.customerName || 'Direct Subscriber',
      customerEmail: paymentData.customerEmail || 'user@business.in',
      companyBrand: paymentData.companyBrand || 'Growth Brand',
      planTier: paymentData.planTier || 'Social Intelligence (₹1,499)',
      planPrice: paymentData.planPrice || 1499,
      grossAmount: paymentData.grossAmount || 1499,
      discountAmount: paymentData.discountAmount || 0,
      gstAmount: paymentData.gstAmount || Math.round((paymentData.grossAmount || 1499) * 0.18),
      gatewayFee: paymentData.gatewayFee || Number(((paymentData.grossAmount || 1499) * 0.02).toFixed(2)),
      netSettlementAmount: paymentData.netSettlementAmount || Number(((paymentData.grossAmount || 1499) * 0.98).toFixed(2)),
      currency: 'INR',
      paymentMethod: paymentData.paymentMethod || 'UPI',
      transactionRef: 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      settlementStatus: paymentData.settlementStatus || 'Yet to Credit',
      expectedCreditDate: 'Tomorrow, 5:00 PM (T+1 in Transit)',
    };
    saveLocalPayment(localPay);
    return localPay;
  }
}

export async function updatePaymentSettlementApi(paymentId: string, status: 'Settled' | 'Yet to Credit'): Promise<void> {
  try {
    await fetch(`/api/admin/payments/${paymentId}/settlement`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (e) {
    console.warn(e);
  }
}

export async function syncUserAccountApi(user: Partial<AdminUserRecord>): Promise<AdminUserRecord | null> {
  try {
    const res = await fetch('/api/admin/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('Failed to sync user');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Sync user failed', err);
    return null;
  }
}

export async function syncBatchUsersApi(users: Partial<AdminUserRecord>[]): Promise<void> {
  try {
    await fetch('/api/admin/users/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users),
    });
  } catch (err) {
    console.warn('Batch sync users failed', err);
  }
}

// -------------------------------------------------------------
// LOCALSTORAGE FALLBACK & PERSISTENCE HELPERS
// -------------------------------------------------------------

function getLocalUsersFallback(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem('genieads_admin_users');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function getLocalSubmissionsFallback(): CustomFormSubmission[] {
  try {
    const raw = localStorage.getItem('genieads_admin_submissions');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function getLocalPaymentsFallback(): PaymentTransaction[] {
  try {
    const raw = localStorage.getItem('genieads_admin_payments');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveLocalSubmission(sub: CustomFormSubmission) {
  try {
    const list = getLocalSubmissionsFallback();
    list.unshift(sub);
    localStorage.setItem('genieads_admin_submissions', JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

function saveLocalPayment(pay: PaymentTransaction) {
  try {
    const list = getLocalPaymentsFallback();
    list.unshift(pay);
    localStorage.setItem('genieads_admin_payments', JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

function getLocalMetricsFallback(): AdminMetricsSummary {
  const users = getLocalUsersFallback();
  const subs = getLocalSubmissionsFallback();
  const pays = getLocalPaymentsFallback();

  const loggedInUsersCount = users.filter(u => u.isLoggedIn).length;
  const subscribedUsers1499Count = users.filter(u => u.subscriptionTier?.includes('1,499')).length;
  const subscribedUsers2499Count = users.filter(u => u.subscriptionTier?.includes('2,499')).length;

  const totalRevenueThisMonth = pays.reduce((acc, p) => acc + (p.grossAmount || 0), 0);
  const settledPaymentsThisMonth = pays.filter(p => p.settlementStatus === 'Settled').reduce((acc, p) => acc + (p.netSettlementAmount || 0), 0);
  const yetToCreditAmount = pays.filter(p => p.settlementStatus === 'Yet to Credit').reduce((acc, p) => acc + (p.netSettlementAmount || 0), 0);

  return {
    loggedInUsersCount,
    totalRegisteredUsers: users.length,
    subscribedUsers1499Count,
    subscribedUsers2499Count,
    customFormSubmissionsCount: subs.length,
    totalRevenueThisMonth,
    settledPaymentsThisMonth,
    yetToCreditAmount,
    activeMRR: (subscribedUsers1499Count * 1499) + (subscribedUsers2499Count * 2499),
    currentActiveCard: 'logged_in',
  };
}
