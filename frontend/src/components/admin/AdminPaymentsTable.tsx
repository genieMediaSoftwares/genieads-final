import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Building2, 
  ArrowUpRight, 
  Plus, 
  RefreshCw, 
  Receipt 
} from 'lucide-react';
import { PaymentTransaction, AdminCardCategory } from '../../types/admin';

interface AdminPaymentsTableProps {
  payments: PaymentTransaction[];
  category: AdminCardCategory;
  onSelectPayment: (payment: PaymentTransaction) => void;
  onUpdateSettlement: (id: string, status: 'Settled' | 'Yet to Credit') => void;
  onOpenAddPaymentModal: () => void;
}

export const AdminPaymentsTable: React.FC<AdminPaymentsTableProps> = ({
  payments,
  category,
  onSelectPayment,
  onUpdateSettlement,
  onOpenAddPaymentModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Settled' | 'Yet to Credit'>('all');

  // Filter based on active category
  let categoryFiltered = payments;
  let tableTitle = 'Financial Ledger — Revenue Generated This Month';
  let tableDescription = 'All client subscription transactions, custom plan retainers, and payment collections';

  if (category === 'settled_payments') {
    categoryFiltered = payments.filter((p) => p.settlementStatus === 'Settled');
    tableTitle = 'Settled Payments (Credited to Bank Account)';
    tableDescription = 'Payments cleared and reconciled with bank settlement batch references';
  } else if (category === 'yet_to_credit') {
    categoryFiltered = payments.filter((p) => p.settlementStatus === 'Yet to Credit');
    tableTitle = 'Yet to Credit (Pending Bank Settlement)';
    tableDescription = 'Funds captured via UPI/Cards in clearing cycle awaiting standard T+1 payout';
  }

  const filtered = categoryFiltered.filter((p) => {
    const matchesQuery = 
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companyBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesQuery;
    return matchesQuery && p.settlementStatus === statusFilter;
  });

  const totalGross = filtered.reduce((acc, p) => acc + p.grossAmount, 0);
  const totalNet = filtered.reduce((acc, p) => acc + p.netSettlementAmount, 0);

  const handleExportCSV = () => {
    const headers = ['Order ID,Customer,Email,Company,Plan Tier,Gross (INR),GST,Gateway Fee,Net Settlement (INR),Method,Ref,Settlement Status,Date,Settled Details'];
    const rows = filtered.map((p) => 
      `"${p.orderId}","${p.customerName}","${p.customerEmail}","${p.companyBrand}","${p.planTier}","${p.grossAmount}","${p.gstAmount}","${p.gatewayFee}","${p.netSettlementAmount}","${p.paymentMethod}","${p.transactionRef}","${p.settlementStatus}","${p.date}","${p.settledDate || p.expectedCreditDate || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `genieads_payments_${category}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E8DEB7]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#2A1A18] tracking-tight">{tableTitle}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F1E5A1] text-[#8B2626]">
              {filtered.length} Transactions
            </span>
          </div>
          <p className="text-xs text-[#6A5652] mt-0.5">{tableDescription}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[#6A5652] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order, customer, ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#EF6905] text-[#2A1A18]"
            />
          </div>

          {/* Quick settlement filter when on revenue view */}
          {category === 'revenue_month' && (
            <div className="inline-flex items-center p-1 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-[#8B2626] text-white' : 'text-[#6A5652] hover:text-[#2A1A18]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Settled')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'Settled' ? 'bg-[#486C2F] text-white' : 'text-[#6A5652] hover:text-[#2A1A18]'
                }`}
              >
                Settled
              </button>
              <button
                onClick={() => setStatusFilter('Yet to Credit')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'Yet to Credit' ? 'bg-[#EF6905] text-white' : 'text-[#6A5652] hover:text-[#2A1A18]'
                }`}
              >
                Yet to Credit
              </button>
            </div>
          )}

          {/* Record New Payment */}
          <button
            onClick={onOpenAddPaymentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B2626] hover:bg-[#6D1E1E] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6E8] hover:bg-[#E8DEB7] border border-[#E8DEB7] text-xs font-bold text-[#2A1A18] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#EF6905]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Micro Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-2xl text-xs">
        <div>
          <span className="text-[#6A5652] text-[11px] block">Total Gross Collections</span>
          <span className="font-mono font-bold text-[#2A1A18] text-sm">
            ₹{totalGross.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[#6A5652] text-[11px] block">Net Bank Payout Value</span>
          <span className="font-mono font-bold text-[#486C2F] text-sm">
            ₹{Math.round(totalNet).toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[#6A5652] text-[11px] block">Gateway Fees & Tax</span>
          <span className="font-mono font-semibold text-[#6A5652] text-sm">
            ₹{Math.round(totalGross - totalNet).toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[#6A5652] text-[11px] block">Settlement Health</span>
          <span className="font-bold text-[#486C2F] text-sm flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            T+1 Auto Payout
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      {filtered.length === 0 ? (
        <div className="py-14 text-center text-xs text-[#6A5652] space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-center mx-auto text-[#8B2626]">
            <DollarSign className="w-5 h-5 opacity-60" />
          </div>
          <p className="font-bold text-[#2A1A18] text-sm">
            {category === 'settled_payments'
              ? 'No settled payments found'
              : category === 'yet_to_credit'
                ? 'No pending settlement credits found'
                : 'No payment transactions recorded yet'}
          </p>
          <p className="text-[12px] max-w-sm mx-auto">
            {category === 'settled_payments'
              ? 'When captured payments clear and are marked as settled to bank, they appear here.'
              : category === 'yet_to_credit'
                ? 'Captured payments currently in transit (T+1 clearing) appear here.'
                : 'Real customer subscription payments recorded via checkout or added manually appear in this financial ledger.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#6A5652] uppercase tracking-wider border-b border-[#E8DEB7] text-[11px]">
                <th className="pb-3 font-bold">Transaction / Order</th>
                <th className="pb-3 font-bold">Customer & Brand</th>
                <th className="pb-3 font-bold">Plan Tier</th>
                <th className="pb-3 font-bold">Gross & Net</th>
                <th className="pb-3 font-bold">Payment Method</th>
                <th className="pb-3 font-bold">Settlement Status</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DEB7]">
              {filtered.map((pay) => (
                <tr 
                  key={pay.id}
                  onClick={() => onSelectPayment(pay)}
                  className="hover:bg-[#FAF6E8]/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5">
                    <div className="font-mono font-bold text-[#2A1A18] text-[12px] flex items-center gap-1.5">
                      <Receipt className="w-3 h-3 text-[#EF6905]" />
                      <span>{pay.orderId}</span>
                    </div>
                    <div className="text-[#6A5652] font-mono text-[11px] mt-0.5 truncate max-w-[160px]">
                      {pay.transactionRef}
                    </div>
                    <div className="text-[10px] text-[#6A5652] mt-0.5">{pay.date}</div>
                  </td>

                  <td className="py-3.5">
                    <div className="font-bold text-[#2A1A18]">{pay.customerName}</div>
                    <div className="font-medium text-[#6A5652] text-[11px]">{pay.companyBrand}</div>
                    <div className="font-mono text-[#6A5652] text-[10px]">{pay.customerEmail}</div>
                  </td>

                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      pay.planTier.includes('2,499')
                        ? 'bg-[#EF6905]/15 text-[#EF6905]'
                        : pay.planTier.includes('1,499')
                        ? 'bg-[#8B2626]/15 text-[#8B2626]'
                        : 'bg-[#F1E5A1] text-[#8B2626]'
                    }`}>
                      {pay.planTier}
                    </span>
                  </td>

                  <td className="py-3.5 font-mono">
                    <div className="font-bold text-[#2A1A18] text-[13px]">
                      ₹{pay.grossAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-[#486C2F] font-semibold">
                      Net: ₹{Math.round(pay.netSettlementAmount).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-[#6A5652]">
                      Fee + Tax: ₹{(pay.gatewayFee + pay.gstAmount).toFixed(0)}
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span className="px-2 py-1 rounded-lg bg-[#FAF6E8] border border-[#E8DEB7] font-medium text-[#2A1A18] text-[11px] inline-flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#6A5652]" />
                      {pay.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3.5">
                    {pay.settlementStatus === 'Settled' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F] font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          SETTLED
                        </span>
                        <div className="text-[10px] text-[#486C2F] mt-0.5 font-mono">
                          {pay.settledDate || 'Bank Credited'}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EF6905]/15 text-[#EF6905] font-bold text-[10px]">
                          <Clock className="w-3 h-3" />
                          YET TO CREDIT
                        </span>
                        <div className="text-[10px] text-[#6A5652] mt-0.5">
                          {pay.expectedCreditDate || 'T+1 in transit'}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    {pay.settlementStatus === 'Yet to Credit' ? (
                      <button
                        onClick={() => onUpdateSettlement(pay.id, 'Settled')}
                        className="px-2.5 py-1 rounded-lg bg-[#486C2F] hover:bg-[#3B5826] text-white font-bold text-[10px] transition-colors cursor-pointer shadow-2xs"
                        title="Mark payment cleared into bank account"
                      >
                        Clear & Settle
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectPayment(pay)}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF6E8] group-hover:bg-[#E8DEB7] border border-[#E8DEB7] text-[#2A1A18] font-bold text-[10px] cursor-pointer"
                      >
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
