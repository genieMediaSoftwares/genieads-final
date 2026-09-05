import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, TrendingUp, ShieldCheck, Flame, ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

export const TrendIntelligenceSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#FAF6E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="CONTEXTUAL TREND RADAR"
          title="Turn trends into opportunities."
          subtitle="GenieAds doesn't just tell you what's trending. It isolates the exact cultural waves that authentically align with your audience, industry authority, and brand tone."
        />

        {/* Big Trend Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xs relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#E8DEB7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1E5A1]/70 border border-[#E8DEB7] flex items-center justify-center text-[#EF6905]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8B2626]">
                  TREND RADAR OPPORTUNITY
                </div>
                <h3 className="text-xl font-bold text-[#2A1A18]">"AI POV & Workflow Reels"</h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F1E5A1]/80 text-[#486C2F] border border-[#486C2F]/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#EF6905]" />
              OPPORTUNITY: HIGH
            </span>
          </div>

          {/* 4 Quantitative Signals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-4 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-[#6A5652] font-semibold">Trend Score</div>
              <div className="text-3xl font-extrabold text-[#2A1A18] font-mono mt-1">88</div>
              <div className="text-[10px] text-[#486C2F] mt-1 flex items-center gap-0.5 font-semibold">
                <ArrowUpRight className="w-3 h-3" /> Velocity +34%
              </div>
            </div>

            <div className="p-4 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-[#6A5652] font-semibold">Your Account Fit</div>
              <div className="text-3xl font-extrabold text-[#486C2F] font-mono mt-1">91</div>
              <div className="text-[10px] text-[#486C2F] mt-1 font-semibold">High Brand Synergy</div>
            </div>

            <div className="p-4 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-[#6A5652] font-semibold">Competition</div>
              <div className="text-2xl font-bold text-[#2A1A18] mt-1">Medium</div>
              <div className="text-[10px] text-[#6A5652] mt-1">First-Mover Window</div>
            </div>

            <div className="p-4 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl">
              <div className="text-[11px] uppercase tracking-wider text-[#6A5652] font-semibold">Lifecycle Stage</div>
              <div className="text-2xl font-bold text-[#486C2F] mt-1">Growth</div>
              <div className="text-[10px] text-[#6A5652] mt-1">Pre-Saturation</div>
            </div>
          </div>

          {/* Bottom Rationale Box */}
          <div className="p-4 sm:p-5 bg-[#FAF6E8] border border-[#EF6905]/40 rounded-xl text-xs sm:text-sm text-[#6A5652] leading-relaxed">
            <p>
              <strong className="text-[#2A1A18]">Why this trend matters for your brand:</strong> Viewers in your tech and services audience are rewarding transparent workflow breakdowns. Adapting this format gives you 2.4× higher comment velocity without degrading brand authority.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
