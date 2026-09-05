export interface AdminUserRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  companyBrand: string;
  role: 'admin' | 'user';
  subscriptionTier: 'Free Trial' | 'Social Intelligence (₹1,499)' | 'Growth Intelligence (₹2,499)' | 'Zero → Hero Managed (Custom)';
  planPrice: number;
  isLoggedIn: boolean;
  lastActive: string;
  createdAt: string;
  phone?: string;
  status: 'Active Now' | 'Recently Active' | 'Offline';
}

export interface CustomFormSubmission {
  id: string;
  name: string;
  workEmail: string;
  phone: string;
  companyBrand: string;
  websiteUrl?: string;
  monthlyAdSpend: string;
  businessCategory: string;
  planInterest: 'Zero → Hero Managed (Custom)' | 'Custom Enterprise' | 'Growth Consulting';
  notes: string;
  submittedAt: string;
  status: 'New Lead' | 'In Discussion' | 'Audit Scheduled' | 'Converted' | 'Archived';
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  companyBrand: string;
  planTier: 'Social Intelligence (₹1,499)' | 'Growth Intelligence (₹2,499)' | 'Zero → Hero Managed (Custom)';
  planPrice: number;
  grossAmount: number;
  discountAmount: number;
  gstAmount: number;
  gatewayFee: number;
  netSettlementAmount: number;
  currency: 'INR' | 'USD';
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'Razorpay' | 'Stripe';
  transactionRef: string;
  settlementBatchId?: string;
  date: string;
  timestamp: number;
  settlementStatus: 'Settled' | 'Yet to Credit';
  settledDate?: string;
  expectedCreditDate?: string;
}

export interface AdminMetricsSummary {
  loggedInUsersCount: number;
  totalRegisteredUsers: number;
  subscribedUsers1499Count: number;
  subscribedUsers2499Count: number;
  customFormSubmissionsCount: number;
  totalRevenueThisMonth: number;
  settledPaymentsThisMonth: number;
  yetToCreditAmount: number;
  activeMRR: number;
  currentActiveCard: string;
}
