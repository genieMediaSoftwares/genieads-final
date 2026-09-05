import React from 'react';
import { motion } from 'motion/react';
import { Target, AlertTriangle, ArrowDownRight, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const CampaignCard: React.FC = () => {
  const campaigns = [
    {
      id: 'A',
      name: 'Campaign A — Retargeting & Warm Audiences',
      status: 'Strong',
      fillPercent: 92,
      color: 'bg-[#486C2F]',
      badgeClass: 'bg-[#F1E5A1]/80 text-[#486C2F] border-[#486C2F]/30',
      metric: 'CPL ₹142 • 88% Lead Quality Score',
    },
    {
      id: 'B',
      name: 'Campaign B — Broad Lookalike Scale',
      status: 'Needs attention',
      fillPercent: 54,
      color: 'bg-[#EF6905]',
      badgeClass: 'bg-[#EF6905]/15 text-[#EF6905] border-[#EF6905]/35',
      metric: 'CPL ₹158 • 41% Lead Quality (Down 28%)',
    },
    {
      id: 'C',
      name: 'Campaign C — Cold Interest Stacking',
      status: 'Underperforming',
      fillPercent: 28,
      color: 'bg-[#8B2626]',
      badgeClass: 'bg-[#8B2626]/15 text-[#8B2626] border-[#8B2626]/30',
      metric: 'CPL ₹310 • High CPA Leakage',
    },
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#2A1A18]/5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#E8DEB7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F1E5A1]/70 border border-[#E8DEB7] flex items-center justify-center text-[#EF6905]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8B2626]">PAID EFFICIENCY</div>
            <h3 className="text-lg font-bold text-[#2A1A18]">Campaign Intelligence</h3>
          </div>
        </div>

        <span className="text-xs text-[#6A5652] font-mono">META + GOOGLE ADS</span>
      </div>

      {/* Campaign Bars */}
      <div className="space-y-4 my-6">
        {campaigns.map((camp) => (
          <div key={camp.id} className="p-3.5 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#2A1A18] truncate max-w-[240px] sm:max-w-xs">{camp.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0 ${camp.badgeClass}`}>
                {camp.status}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2.5 bg-[#E8DEB7]/60 rounded-full overflow-hidden border border-[#E8DEB7]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${camp.fillPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${camp.color}`}
              />
            </div>

            <div className="text-[11px] text-[#6A5652] font-mono flex items-center justify-between">
              <span>{camp.metric}</span>
              <span>{camp.fillPercent}% Efficiency</span>
            </div>
          </div>
        ))}
      </div>

      {/* Genie Recommendation Box */}
      <div className="p-4 sm:p-5 bg-[#FAF6E8] border-2 border-[#EF6905] rounded-xl space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8B2626] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#EF6905]" />
            Genie Recommendation
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-[#F1E5A1] text-[#8B2626] font-semibold border border-[#E8DEB7]">
            HIGH IMPACT
          </span>
        </div>

        <p className="text-sm font-semibold text-[#2A1A18]">
          Reduce Campaign B budget by approximately 30%
        </p>

        <p className="text-xs text-[#6A5652] leading-relaxed">
          <strong className="text-[#2A1A18]">Reason:</strong> Declining lead quality despite stable CPL. Reallocate surplus ₹8,500/week to Campaign A (Retargeting) where lead-to-conversion rate is 2.8× higher.
        </p>
      </div>
    </div>
  );
};
