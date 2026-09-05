import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  Building2, 
  CreditCard, 
  User, 
  Globe, 
  Calendar, 
  Receipt, 
  ShieldCheck, 
  Copy, 
  Check 
} from 'lucide-react';
import { AdminUserRecord, CustomFormSubmission, PaymentTransaction } from '../../types/admin';

interface AdminRecordDetailModalProps {
  userRecord: AdminUserRecord | null;
  submissionRecord: CustomFormSubmission | null;
  paymentRecord: PaymentTransaction | null;
  onClose: () => void;
  onUpdatePaymentSettlement?: (id: string, status: 'Settled' | 'Yet to Credit') => void;
  onUpdateSubmissionStatus?: (id: string, status: CustomFormSubmission['status']) => void;
}

export const AdminRecordDetailModal: React.FC<AdminRecordDetailModalProps> = ({
  userRecord,
  submissionRecord,
  paymentRecord,
  onClose,
  onUpdatePaymentSettlement,
  onUpdateSubmissionStatus,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!userRecord && !submissionRecord && !paymentRecord) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1A18]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DEB7]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8B2626] bg-[#8B2626]/10 px-2 py-0.5 rounded-full">
              {userRecord ? 'USER ACCOUNT TELEMETRY' : submissionRecord ? 'CUSTOM PLAN LEAD' : 'PAYMENT LEDGER RECORD'}
            </span>
            <h3 className="text-xl font-bold text-[#2A1A18] mt-1">
              {userRecord ? userRecord.name : submissionRecord ? submissionRecord.name : paymentRecord?.orderId}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF6E8] hover:bg-[#E8DEB7] flex items-center justify-center text-[#2A1A18] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Record View */}
        {userRecord && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF6E8] rounded-2xl border border-[#E8DEB7]">
              <div>
                <span className="text-[#6A5652] block text-[11px]">Subscription Tier</span>
                <span className="font-bold text-[#8B2626] text-sm">{userRecord.subscriptionTier}</span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Monthly Fee</span>
                <span className="font-bold font-mono text-[#2A1A18] text-sm">₹{userRecord.planPrice.toLocaleString('en-IN')}/mo</span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Session Status</span>
                <span className="font-bold text-[#486C2F] flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${userRecord.isLoggedIn ? 'bg-[#486C2F] animate-pulse' : 'bg-[#6A5652]'}`} />
                  {userRecord.isLoggedIn ? 'Active Now' : 'Offline'}
                </span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Role</span>
                <span className="font-bold uppercase text-[#2A1A18]">{userRecord.role}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Email Address:</span>
                <span className="font-mono font-medium text-[#2A1A18]">{userRecord.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Brand / Organization:</span>
                <span className="font-bold text-[#2A1A18]">{userRecord.companyBrand}</span>
              </div>
              {userRecord.phone && (
                <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                  <span className="text-[#6A5652]">Direct Phone:</span>
                  <span className="font-mono font-medium text-[#2A1A18]">{userRecord.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Last Activity:</span>
                <span className="font-medium text-[#2A1A18]">{userRecord.lastActive}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[#6A5652]">Account Created:</span>
                <span className="font-mono text-[#6A5652]">{new Date(userRecord.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Custom Form Submission View */}
        {submissionRecord && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF6E8] rounded-2xl border border-[#E8DEB7]">
              <div>
                <span className="text-[#6A5652] block text-[11px]">Monthly Ad Spend</span>
                <span className="font-bold font-mono text-[#2A1A18] text-sm">{submissionRecord.monthlyAdSpend}</span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Plan Interest</span>
                <span className="font-bold text-[#8B2626] text-sm">{submissionRecord.planInterest}</span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Business Category</span>
                <span className="font-semibold text-[#2A1A18]">{submissionRecord.businessCategory}</span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Submitted</span>
                <span className="font-medium text-[#2A1A18]">{submissionRecord.submittedAt}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Contact Name:</span>
                <span className="font-bold text-[#2A1A18]">{submissionRecord.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Work Email:</span>
                <span className="font-mono font-medium text-[#2A1A18]">{submissionRecord.workEmail}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Phone:</span>
                <span className="font-mono font-medium text-[#2A1A18]">{submissionRecord.phone}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Company / Brand:</span>
                <span className="font-bold text-[#2A1A18]">{submissionRecord.companyBrand}</span>
              </div>
              {submissionRecord.websiteUrl && (
                <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                  <span className="text-[#6A5652]">Website / Social:</span>
                  <a href={submissionRecord.websiteUrl} target="_blank" rel="noreferrer" className="text-[#8B2626] font-mono hover:underline">
                    {submissionRecord.websiteUrl}
                  </a>
                </div>
              )}
            </div>

            {submissionRecord.notes && (
              <div className="p-3 bg-[#FAF6E8] rounded-xl border border-[#E8DEB7]">
                <span className="text-[11px] font-bold text-[#6A5652] uppercase block mb-1">
                  Applicant Notes & Growth Goals:
                </span>
                <p className="text-[#2A1A18] leading-relaxed italic">
                  "{submissionRecord.notes}"
                </p>
              </div>
            )}

            {onUpdateSubmissionStatus && (
              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-[#2A1A18]">Lead Status:</span>
                <select
                  value={submissionRecord.status}
                  onChange={(e) => onUpdateSubmissionStatus(submissionRecord.id, e.target.value as any)}
                  className="px-3 py-1.5 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl font-bold text-xs text-[#2A1A18]"
                >
                  <option value="New Lead">New Lead</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Audit Scheduled">Audit Scheduled</option>
                  <option value="Converted">Converted</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Payment Record View */}
        {paymentRecord && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF6E8] rounded-2xl border border-[#E8DEB7]">
              <div>
                <span className="text-[#6A5652] block text-[11px]">Gross Amount</span>
                <span className="font-bold font-mono text-[#2A1A18] text-base">₹{paymentRecord.grossAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Net Bank Settlement</span>
                <span className="font-bold font-mono text-[#486C2F] text-base">₹{Math.round(paymentRecord.netSettlementAmount).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Gateway Fee & GST</span>
                <span className="font-mono text-[#6A5652]">₹{(paymentRecord.gatewayFee + paymentRecord.gstAmount).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[#6A5652] block text-[11px]">Payment Method</span>
                <span className="font-bold text-[#2A1A18]">{paymentRecord.paymentMethod}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Order ID:</span>
                <span className="font-mono font-bold text-[#2A1A18]">{paymentRecord.orderId}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Customer Name:</span>
                <span className="font-bold text-[#2A1A18]">{paymentRecord.customerName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Customer Email:</span>
                <span className="font-mono text-[#2A1A18]">{paymentRecord.customerEmail}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Subscribed Tier:</span>
                <span className="font-bold text-[#8B2626]">{paymentRecord.planTier}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Transaction Ref:</span>
                <span className="font-mono text-[#2A1A18] flex items-center gap-1">
                  <span>{paymentRecord.transactionRef}</span>
                  <button onClick={() => copyToClipboard(paymentRecord.transactionRef)} className="text-[#6A5652] hover:text-[#2A1A18]">
                    {copied ? <Check className="w-3 h-3 text-[#486C2F]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8DEB7]">
                <span className="text-[#6A5652]">Settlement Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  paymentRecord.settlementStatus === 'Settled'
                    ? 'bg-[#486C2F]/15 text-[#486C2F]'
                    : 'bg-[#EF6905]/15 text-[#EF6905]'
                }`}>
                  {paymentRecord.settlementStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[#6A5652]">Payout Details:</span>
                <span className="font-mono text-[#2A1A18]">
                  {paymentRecord.settledDate || paymentRecord.expectedCreditDate || 'T+1 Schedule'}
                </span>
              </div>
            </div>

            {onUpdatePaymentSettlement && paymentRecord.settlementStatus === 'Yet to Credit' && (
              <div className="pt-3">
                <button
                  onClick={() => onUpdatePaymentSettlement(paymentRecord.id, 'Settled')}
                  className="w-full py-2.5 rounded-xl bg-[#486C2F] hover:bg-[#3B5826] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Mark as Settled (Simulate Bank Clearance)
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#FAF6E8] hover:bg-[#E8DEB7] text-[#2A1A18] font-bold text-xs transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
