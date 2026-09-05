import React from 'react';
import { 
  Users, 
  CreditCard, 
  Sparkles, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { AdminMetricsSummary, AdminCardCategory } from '../../types/admin';

interface AdminMetricCardsProps {
  metrics: AdminMetricsSummary;
  selectedCategory: AdminCardCategory;
  onSelectCategory: (category: AdminCardCategory) => void;
}

export const AdminMetricCards: React.FC<AdminMetricCardsProps> = ({
  metrics,
  selectedCategory,
  onSelectCategory,
}) => {
  const cards = [
    {
      id: 'logged_in' as AdminCardCategory,
      title: 'Logged-in Users',
      value: metrics.loggedInUsersCount.toString(),
      subtext: `${metrics.totalRegisteredUsers} total accounts registered`,
      accentColor: 'text-[#486C2F]',
      badgeColor: 'bg-[#486C2F]/10 text-[#486C2F]',
      badgeText: 'LIVE SESSIONS',
      icon: Users,
      actionHint: 'Click to view active users',
    },
    {
      id: 'subscribers_1499' as AdminCardCategory,
      title: 'Subscribed Users (₹1,499)',
      value: metrics.subscribedUsers1499Count.toString(),
      subtext: `₹${(metrics.subscribedUsers1499Count * 1499).toLocaleString('en-IN')}/mo recurring`,
      accentColor: 'text-[#8B2626]',
      badgeColor: 'bg-[#8B2626]/10 text-[#8B2626]',
      badgeText: 'STARTER TIER',
      icon: CreditCard,
      actionHint: 'Click to view ₹1,499 subscribers',
    },
    {
      id: 'subscribers_2499' as AdminCardCategory,
      title: 'Subscribed Users (₹2,499)',
      value: metrics.subscribedUsers2499Count.toString(),
      subtext: `₹${(metrics.subscribedUsers2499Count * 2499).toLocaleString('en-IN')}/mo recurring`,
      accentColor: 'text-[#EF6905]',
      badgeColor: 'bg-[#EF6905]/10 text-[#EF6905]',
      badgeText: 'GROWTH PRO',
      icon: Sparkles,
      actionHint: 'Click to view ₹2,499 subscribers',
    },
    {
      id: 'custom_submissions' as AdminCardCategory,
      title: 'Custom Form Leads',
      value: metrics.customFormSubmissionsCount.toString(),
      subtext: 'High-intent Managed Growth inquiries',
      accentColor: 'text-[#2A1A18]',
      badgeColor: 'bg-[#F1E5A1] text-[#8B2626]',
      badgeText: 'CUSTOM INQUIRIES',
      icon: FileText,
      actionHint: 'Click to view custom form data',
    },
    {
      id: 'revenue_month' as AdminCardCategory,
      title: 'Revenue This Month',
      value: `₹${metrics.totalRevenueThisMonth.toLocaleString('en-IN')}`,
      subtext: 'Gross subscription & custom collections',
      accentColor: 'text-[#2A1A18]',
      badgeColor: 'bg-[#486C2F]/15 text-[#486C2F]',
      badgeText: 'GROSS BOOKINGS',
      icon: DollarSign,
      actionHint: 'Click to view revenue ledger',
    },
    {
      id: 'settled_payments' as AdminCardCategory,
      title: 'Settled Payments',
      value: `₹${Math.round(metrics.settledPaymentsThisMonth).toLocaleString('en-IN')}`,
      subtext: 'Net cleared directly to bank account',
      accentColor: 'text-[#486C2F]',
      badgeColor: 'bg-[#486C2F]/10 text-[#486C2F]',
      badgeText: 'BANK CREDITED',
      icon: CheckCircle2,
      actionHint: 'Click to view settled payouts',
    },
    {
      id: 'yet_to_credit' as AdminCardCategory,
      title: 'Yet to Credit',
      value: `₹${Math.round(metrics.yetToCreditAmount).toLocaleString('en-IN')}`,
      subtext: 'Captured payments in T+1 clearing cycle',
      accentColor: 'text-[#EF6905]',
      badgeColor: 'bg-[#EF6905]/10 text-[#EF6905]',
      badgeText: 'IN CLEARING',
      icon: Clock,
      actionHint: 'Click to view in-transit payouts',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6A5652]">
            Core Telemetry & Financial Cards
          </span>
          <span className="text-[11px] text-[#6A5652]/80 hidden sm:inline">
            (Select any card to filter real records)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#486C2F] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#486C2F] animate-pulse" />
          <span>Real-time Live Sync</span>
        </div>
      </div>

      {/* Grid of 7 core requested cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {cards.map((card) => {
          const isSelected = selectedCategory === card.id;
          const Icon = card.icon;

          return (
            <button
              key={card.id}
              onClick={() => onSelectCategory(card.id)}
              className={`text-left p-4 sm:p-5 rounded-2xl transition-all relative overflow-hidden group cursor-pointer border ${
                isSelected
                  ? 'bg-[#FFFFFF] border-2 border-[#8B2626] shadow-md ring-2 ring-[#8B2626]/20'
                  : 'bg-[#FFFFFF] border-[#E8DEB7] hover:border-[#EF6905]/60 hover:shadow-xs shadow-2xs'
              }`}
            >
              {/* Active Indicator Strip */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#8B2626]" />
              )}

              <div className="flex items-start justify-between gap-2 mb-2.5">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                  {card.badgeText}
                </span>
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#8B2626] text-white' : 'bg-[#FAF6E8] text-[#6A5652] group-hover:text-[#EF6905]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-xs font-semibold text-[#6A5652] truncate mb-1">
                {card.title}
              </div>

              <div className="text-2xl sm:text-[26px] font-black font-mono text-[#2A1A18] tracking-tight mb-1">
                {card.value}
              </div>

              <div className="text-[11px] text-[#6A5652] flex items-center justify-between pt-1 border-t border-[#E8DEB7]/60">
                <span className="truncate">{card.subtext}</span>
                <ArrowUpRight
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isSelected ? 'text-[#8B2626] translate-x-0.5 -translate-y-0.5' : 'text-[#6A5652]/50 group-hover:text-[#EF6905]'
                  }`}
                />
              </div>
            </button>
          );
        })}

        {/* Clean Add-on Card: MRR & Agency Payout Momentum */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#2A1A18] to-[#3B2523] text-white border border-[#2A1A18] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F1E5A1] text-[#8B2626]">
                PLATFORM MRR
              </span>
              <div className="w-2 h-2 rounded-full bg-[#486C2F] animate-ping" />
            </div>
            <div className="text-xs text-[#FAF6E8]/70">Contracted Monthly Run Rate</div>
            <div className="text-2xl font-black font-mono text-[#FAF6E8] mt-1">
              ₹{metrics.activeMRR.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="pt-2 text-[11px] text-[#FAF6E8]/80 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#F1E5A1]" />
            <span>100% gateway pipeline uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
