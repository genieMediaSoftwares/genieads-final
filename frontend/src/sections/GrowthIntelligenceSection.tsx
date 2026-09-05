import React from 'react';
import { motion } from 'motion/react';
import { Share2, Megaphone, Target, ArrowDown, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

export const GrowthIntelligenceSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#FAF6E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="GROWTH INTELLIGENCE TIER"
          title="From content performance to business performance."
          subtitle="Understand where your marketing budget is working, where it's leaking, and where your next high-margin growth opportunity is hiding."
        />

        {/* 3-Pillar Convergence Visual */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pillar 1: Organic */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-5 bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl text-center space-y-3 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F1E5A1]/70 border border-[#E8DEB7] text-[#EF6905] flex items-center justify-center mx-auto">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold uppercase text-[#486C2F]">ORGANIC REACH</div>
              <h3 className="text-base font-bold text-[#2A1A18]">Instagram & Social</h3>
              <p className="text-xs text-[#6A5652] leading-relaxed">
                 Audience retention, creative hooks, comment engagement, and virality multipliers.
              </p>
            </motion.div>

            {/* Pillar 2: Paid */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-5 bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl text-center space-y-3 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F1E5A1]/70 border border-[#E8DEB7] text-[#EF6905] flex items-center justify-center mx-auto">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold uppercase text-[#8B2626]">PAID EFFICIENCY</div>
              <h3 className="text-base font-bold text-[#2A1A18]">Meta & Google Ads</h3>
              <p className="text-xs text-[#6A5652] leading-relaxed">
                Ad set CPA, audience decay rates, creative fatigue, and real lead acquisition costs.
              </p>
            </motion.div>

            {/* Pillar 3: Business */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-5 bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl text-center space-y-3 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F1E5A1]/70 border border-[#E8DEB7] text-[#486C2F] flex items-center justify-center mx-auto">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold uppercase text-[#486C2F]">BUSINESS IMPACT</div>
              <h3 className="text-base font-bold text-[#2A1A18]">Leads & Conversions</h3>
              <p className="text-xs text-[#6A5652] leading-relaxed">
                Qualified inquiries, sales pipeline progression, and customer lifetime value attribution.
              </p>
            </motion.div>
          </div>

          {/* Convergence arrow */}
          <div className="flex justify-center my-6">
            <div className="w-9 h-9 rounded-full bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-center text-[#6A5652] shadow-2xs">
              <ArrowDown className="w-5 h-5 text-[#EF6905]" />
            </div>
          </div>

          {/* Final Convergence Result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#EF6905] rounded-2xl sm:rounded-3xl text-center shadow-xl shadow-[#EF6905]/10 relative overflow-hidden"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1]/80 text-[#8B2626] border border-[#E8DEB7] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#EF6905]" />
              GENIE GROWTH INTELLIGENCE
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2A1A18] tracking-tight">
              One unified formula linking attention to revenue.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#6A5652] max-w-xl mx-auto leading-relaxed">
              No more wondering if an Instagram video generated clients, or whether your ad spend is cannibalizing your organic momentum.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
