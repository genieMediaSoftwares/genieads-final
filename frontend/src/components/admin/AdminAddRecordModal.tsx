import React, { useState } from 'react';
import { X, Plus, Building2, Mail, Phone, DollarSign, User, Sparkles, Receipt } from 'lucide-react';
import { CustomFormSubmission, PaymentTransaction } from '../../types/admin';

interface AdminAddRecordModalProps {
  initialType?: 'lead' | 'payment';
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (data: Omit<CustomFormSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  onAddPayment: (data: Partial<PaymentTransaction>) => void;
}

export const AdminAddRecordModal: React.FC<AdminAddRecordModalProps> = ({
  initialType = 'lead',
  isOpen,
  onClose,
  onAddLead,
  onAddPayment,
}) => {
  const [modalType, setModalType] = useState<'lead' | 'payment'>(initialType);

  // Lead fields
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadSpend, setLeadSpend] = useState('₹5,00,000 / month');
  const [leadCategory, setLeadCategory] = useState('D2C / E-Commerce');
  const [leadPlan, setLeadPlan] = useState<'Zero → Hero Managed (Custom)' | 'Custom Enterprise' | 'Growth Consulting'>('Zero → Hero Managed (Custom)');
  const [leadNotes, setLeadNotes] = useState('');

  // Payment fields
  const [payCustomer, setPayCustomer] = useState('');
  const [payEmail, setPayEmail] = useState('');
  const [payCompany, setPayCompany] = useState('');
  const [payTier, setPayTier] = useState<'Social Intelligence (₹1,499)' | 'Growth Intelligence (₹2,499)' | 'Zero → Hero Managed (Custom)'>('Growth Intelligence (₹2,499)');
  const [payAmount, setPayAmount] = useState('2499');
  const [payMethod, setPayMethod] = useState<'UPI' | 'Credit Card' | 'NetBanking' | 'Razorpay'>('UPI');
  const [payStatus, setPayStatus] = useState<'Settled' | 'Yet to Credit'>('Yet to Credit');

  if (!isOpen) return null;

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadCompany) return;
    onAddLead({
      name: leadName.trim(),
      workEmail: leadEmail.trim(),
      phone: leadPhone.trim() || '+91 98200 00000',
      companyBrand: leadCompany.trim(),
      monthlyAdSpend: leadSpend,
      businessCategory: leadCategory,
      planInterest: leadPlan,
      notes: leadNotes.trim(),
    });
    onClose();
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payCustomer || !payEmail) return;
    const amountNum = parseFloat(payAmount) || 2499;
    onAddPayment({
      customerName: payCustomer.trim(),
      customerEmail: payEmail.trim(),
      companyBrand: payCompany.trim() || 'Direct Account',
      planTier: payTier,
      planPrice: amountNum,
      grossAmount: amountNum,
      discountAmount: 0,
      gstAmount: Math.round(amountNum * 0.18),
      gatewayFee: Number((amountNum * 0.02).toFixed(2)),
      netSettlementAmount: Number((amountNum * 0.98).toFixed(2)),
      paymentMethod: payMethod,
      settlementStatus: payStatus,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1A18]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DEB7]">
          <div>
            <h3 className="text-lg font-bold text-[#2A1A18]">Admin Quick Action</h3>
            <p className="text-xs text-[#6A5652]">Record new telemetry into the system</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF6E8] hover:bg-[#E8DEB7] flex items-center justify-center text-[#2A1A18] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF6E8] rounded-xl border border-[#E8DEB7] text-xs">
          <button
            type="button"
            onClick={() => setModalType('lead')}
            className={`py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              modalType === 'lead' ? 'bg-[#8B2626] text-white shadow-xs' : 'text-[#6A5652]'
            }`}
          >
            + Add Custom Form Lead
          </button>
          <button
            type="button"
            onClick={() => setModalType('payment')}
            className={`py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              modalType === 'payment' ? 'bg-[#8B2626] text-white shadow-xs' : 'text-[#6A5652]'
            }`}
          >
            + Record Payment Entry
          </button>
        </div>

        {modalType === 'lead' ? (
          <form onSubmit={handleSubmitLead} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#2A1A18] mb-1">Applicant Name *</label>
              <input
                type="text"
                required
                placeholder="Rohan Sengupta"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs focus:ring-1 focus:ring-[#EF6905]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="rohan@brand.in"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs focus:ring-1 focus:ring-[#EF6905]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98201 22334"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs focus:ring-1 focus:ring-[#EF6905]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Company / Brand *</label>
                <input
                  type="text"
                  required
                  placeholder="Aether Botanicals"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs focus:ring-1 focus:ring-[#EF6905]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Monthly Ad Spend</label>
                <input
                  type="text"
                  placeholder="₹5,00,000 / mo"
                  value={leadSpend}
                  onChange={(e) => setLeadSpend(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs focus:ring-1 focus:ring-[#EF6905]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Plan Interest</label>
                <select
                  value={leadPlan}
                  onChange={(e) => setLeadPlan(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs font-semibold"
                >
                  <option value="Zero → Hero Managed (Custom)">Zero → Hero Managed</option>
                  <option value="Custom Enterprise">Custom Enterprise</option>
                  <option value="Growth Consulting">Growth Consulting</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Category</label>
                <input
                  type="text"
                  value={leadCategory}
                  onChange={(e) => setLeadCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#2A1A18] mb-1">Growth Requirements / Notes</label>
              <textarea
                rows={2}
                placeholder="Looking for Meta instant form CPA reduction and TikTok creatives"
                value={leadNotes}
                onChange={(e) => setLeadNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#8B2626] hover:bg-[#6D1E1E] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Save Custom Form Submission
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitPayment} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Karan Singhal"
                  value={payCustomer}
                  onChange={(e) => setPayCustomer(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Customer Email *</label>
                <input
                  type="email"
                  required
                  placeholder="karan@singhal.com"
                  value={payEmail}
                  onChange={(e) => setPayEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Company / Brand</label>
                <input
                  type="text"
                  placeholder="Singhal Foods"
                  value={payCompany}
                  onChange={(e) => setPayCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Plan Tier</label>
                <select
                  value={payTier}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setPayTier(val);
                    if (val.includes('1,499')) setPayAmount('1499');
                    else if (val.includes('2,499')) setPayAmount('2499');
                    else setPayAmount('35000');
                  }}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs font-semibold"
                >
                  <option value="Social Intelligence (₹1,499)">Social Intelligence (₹1,499)</option>
                  <option value="Growth Intelligence (₹2,499)">Growth Intelligence (₹2,499)</option>
                  <option value="Zero → Hero Managed (Custom)">Zero → Hero Managed (Custom)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Gross Amount (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs"
                >
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="NetBanking">NetBanking</option>
                  <option value="Razorpay">Razorpay</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#2A1A18] mb-1">Settlement</label>
                <select
                  value={payStatus}
                  onChange={(e) => setPayStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-[#2A1A18] text-xs font-bold"
                >
                  <option value="Yet to Credit">Yet to Credit</option>
                  <option value="Settled">Settled</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#8B2626] hover:bg-[#6D1E1E] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Record Payment Transaction
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
