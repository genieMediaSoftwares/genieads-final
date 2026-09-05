import fs from 'fs';
import path from 'path';
import { 
  AdminUserRecord, 
  CustomFormSubmission, 
  PaymentTransaction, 
  AdminMetricsSummary 
} from '../models/adminTypes';
import { logger } from '../utils/logger';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'adminStore.json');

// Real registered datasets - strictly zero demo data
const initialUsers: AdminUserRecord[] = [];
const initialCustomSubmissions: CustomFormSubmission[] = [];
const initialPayments: PaymentTransaction[] = [];

class AdminServiceStore {
  private users: AdminUserRecord[] = [...initialUsers];
  private submissions: CustomFormSubmission[] = [...initialCustomSubmissions];
  private payments: PaymentTransaction[] = [...initialPayments];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data.users)) {
          // Cleanly purge any residual demo/mock records from older runs
          this.users = data.users.filter((u: any) => 
            !u.id?.startsWith('usr_00') && 
            u.email !== 'aarav@lumengrowth.com' &&
            u.email !== 'priya@organicskincare.in' &&
            u.email !== 'rahul@peakd2c.com' &&
            u.email !== 'ananya@fitwear.io' &&
            u.email !== 'vikram@wealthcraft.in' &&
            u.email !== 'sameer@urbanspice.co'
          );
        }
        if (Array.isArray(data.submissions)) {
          this.submissions = data.submissions.filter((s: any) => 
            !s.id?.startsWith('cst_10') && 
            s.workEmail !== 'kabir@rawpressery.com' &&
            s.workEmail !== 'devika@theaurahome.com' &&
            s.workEmail !== 'nikhil@eduwave.io' &&
            s.workEmail !== 'shweta@zestapparel.in' &&
            s.workEmail !== 'arjun@krayonschools.com'
          );
        }
        if (Array.isArray(data.payments)) {
          this.payments = data.payments.filter((p: any) => 
            !p.id?.startsWith('pay_00') && 
            p.orderId !== 'ORD-20260901-01' &&
            p.orderId !== 'ORD-20260902-02'
          );
        }
        logger.info(`Loaded admin real data from disk: ${this.users.length} users, ${this.submissions.length} submissions, ${this.payments.length} payments.`);
      }
    } catch (err) {
      logger.error('Could not load data from disk, using clean store', err);
    }
  }

  private saveToDisk(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          {
            users: this.users,
            submissions: this.submissions,
            payments: this.payments,
          },
          null,
          2
        ),
        'utf-8'
      );
    } catch (err) {
      logger.error('Failed to persist admin store to disk', err);
    }
  }

  public getMetrics(): AdminMetricsSummary {
    const loggedInUsersCount = this.users.filter((u) => u.isLoggedIn).length;
    const totalRegisteredUsers = this.users.length;
    const subscribedUsers1499Count = this.users.filter((u) => 
      u.subscriptionTier === 'Social Intelligence (₹1,499)' || u.subscriptionTier?.includes('1,499')
    ).length;
    const subscribedUsers2499Count = this.users.filter((u) => 
      u.subscriptionTier === 'Growth Intelligence (₹2,499)' || u.subscriptionTier?.includes('2,499')
    ).length;
    const customFormSubmissionsCount = this.submissions.length;

    // Financial calculations strictly from registered payments
    const totalRevenueThisMonth = this.payments.reduce((acc, p) => acc + (p.grossAmount || 0), 0);
    const settledPaymentsThisMonth = this.payments
      .filter((p) => p.settlementStatus === 'Settled')
      .reduce((acc, p) => acc + (p.netSettlementAmount || 0), 0);
    const yetToCreditAmount = this.payments
      .filter((p) => p.settlementStatus === 'Yet to Credit')
      .reduce((acc, p) => acc + (p.netSettlementAmount || 0), 0);

    const activeMRR = (subscribedUsers1499Count * 1499) + (subscribedUsers2499Count * 2499);

    return {
      loggedInUsersCount,
      totalRegisteredUsers,
      subscribedUsers1499Count,
      subscribedUsers2499Count,
      customFormSubmissionsCount,
      totalRevenueThisMonth,
      settledPaymentsThisMonth,
      yetToCreditAmount,
      activeMRR,
      currentActiveCard: 'logged_in',
    };
  }

  public getUsers(): AdminUserRecord[] {
    return this.users;
  }

  public getSubmissions(): CustomFormSubmission[] {
    return this.submissions;
  }

  public getPayments(): PaymentTransaction[] {
    return this.payments;
  }

  public addSubmission(data: Omit<CustomFormSubmission, 'id' | 'submittedAt' | 'status'>): CustomFormSubmission {
    const newSubmission: CustomFormSubmission = {
      id: 'cst_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36),
      name: data.name.trim(),
      workEmail: data.workEmail.trim().toLowerCase(),
      phone: data.phone.trim(),
      companyBrand: data.companyBrand.trim(),
      websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : undefined,
      monthlyAdSpend: data.monthlyAdSpend || 'Not specified',
      businessCategory: data.businessCategory || 'General',
      planInterest: data.planInterest || 'Zero → Hero Managed (Custom)',
      notes: data.notes ? data.notes.trim() : '',
      submittedAt: 'Just now',
      status: 'New Lead',
    };
    this.submissions.unshift(newSubmission);
    this.saveToDisk();
    return newSubmission;
  }

  public updateSubmissionStatus(id: string, status: CustomFormSubmission['status']): CustomFormSubmission | null {
    const item = this.submissions.find((s) => s.id === id);
    if (!item) return null;
    item.status = status;
    this.saveToDisk();
    return item;
  }

  public addPayment(paymentData: Partial<PaymentTransaction>): PaymentTransaction {
    const gross = paymentData.grossAmount || 0;
    const discount = paymentData.discountAmount || 0;
    const gst = paymentData.gstAmount ?? Math.round(gross * 0.18);
    const fee = paymentData.gatewayFee ?? Number((gross * 0.02).toFixed(2));
    const net = paymentData.netSettlementAmount ?? Number((gross - fee).toFixed(2));

    const newPayment: PaymentTransaction = {
      id: 'pay_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36),
      orderId: paymentData.orderId || 'ORD-' + Date.now().toString().slice(-8),
      userId: paymentData.userId || 'usr_' + Date.now().toString(36),
      customerName: paymentData.customerName || 'Registered Customer',
      customerEmail: paymentData.customerEmail || 'user@business.in',
      companyBrand: paymentData.companyBrand || 'Direct Brand',
      planTier: paymentData.planTier || 'Social Intelligence (₹1,499)',
      planPrice: paymentData.planPrice || gross,
      grossAmount: gross,
      discountAmount: discount,
      gstAmount: gst,
      gatewayFee: fee,
      netSettlementAmount: net,
      currency: paymentData.currency || 'INR',
      paymentMethod: paymentData.paymentMethod || 'UPI',
      transactionRef: paymentData.transactionRef || 'TXN/' + Math.floor(100000000000 + Math.random() * 900000000000),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      settlementStatus: paymentData.settlementStatus || 'Yet to Credit',
      expectedCreditDate: 'Tomorrow, 5:00 PM (T+1 in Transit)',
    };

    this.payments.unshift(newPayment);

    // If customer has a registered user record, update their plan in the users list
    const existingUser = this.users.find(
      (u) => u.email.toLowerCase() === newPayment.customerEmail.toLowerCase() || u.id === newPayment.userId
    );
    if (existingUser) {
      existingUser.subscriptionTier = newPayment.planTier;
      existingUser.planPrice = newPayment.planPrice;
      existingUser.isLoggedIn = true;
      existingUser.status = 'Active Now';
    } else {
      this.users.unshift({
        id: newPayment.userId,
        name: newPayment.customerName,
        username: newPayment.customerEmail.split('@')[0] || `usr_${Date.now().toString().slice(-4)}`,
        email: newPayment.customerEmail,
        companyBrand: newPayment.companyBrand,
        role: 'user',
        subscriptionTier: newPayment.planTier,
        planPrice: newPayment.planPrice,
        isLoggedIn: true,
        lastActive: 'Active Now',
        createdAt: new Date().toISOString(),
        phone: '',
        status: 'Active Now',
      });
    }

    this.saveToDisk();
    return newPayment;
  }

  public syncRegisteredUser(user: Partial<AdminUserRecord>): AdminUserRecord {
    const existingIndex = this.users.findIndex(
      (u) => 
        (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) || 
        (u.username && user.username && u.username.toLowerCase() === user.username.toLowerCase()) ||
        (u.id && user.id && u.id === user.id)
    );

    if (existingIndex >= 0) {
      this.users[existingIndex] = {
        ...this.users[existingIndex],
        ...user,
        isLoggedIn: user.isLoggedIn !== undefined ? user.isLoggedIn : this.users[existingIndex].isLoggedIn,
        lastActive: user.isLoggedIn ? 'Active Now' : (this.users[existingIndex].lastActive || 'Offline'),
        status: user.isLoggedIn ? 'Active Now' : (this.users[existingIndex].status || 'Offline'),
      };
      this.saveToDisk();
      return this.users[existingIndex];
    } else {
      const newUser: AdminUserRecord = {
        id: user.id || 'usr_' + Date.now().toString(36),
        name: user.name || user.username || 'Registered User',
        username: user.username || 'user_' + Math.random().toString(36).substring(2, 6),
        email: user.email || '',
        companyBrand: user.companyBrand || 'Direct Brand',
        role: user.role || 'user',
        subscriptionTier: user.subscriptionTier || 'Free Trial',
        planPrice: user.planPrice || 0,
        isLoggedIn: user.isLoggedIn !== undefined ? user.isLoggedIn : true,
        lastActive: 'Active Now',
        createdAt: user.createdAt || new Date().toISOString(),
        phone: user.phone || '',
        status: user.isLoggedIn !== false ? 'Active Now' : 'Offline',
      };
      this.users.unshift(newUser);
      this.saveToDisk();
      return newUser;
    }
  }

  public updatePaymentSettlement(paymentId: string, status: 'Settled' | 'Yet to Credit'): PaymentTransaction | null {
    const p = this.payments.find((item) => item.id === paymentId);
    if (!p) return null;
    p.settlementStatus = status;
    if (status === 'Settled') {
      p.settledDate = 'Cleared ' + new Date().toLocaleDateString();
      p.settlementBatchId = 'STL-REAL-' + Date.now().toString().slice(-6);
    }
    this.saveToDisk();
    return p;
  }
}

export const adminService = new AdminServiceStore();
