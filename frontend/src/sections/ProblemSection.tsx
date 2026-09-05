import React from 'react';
import { motion } from 'motion/react';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-20 sm:py-24 relative overflow-hidden bg-[#FAF6E8] border-t border-[#E8DEB7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="THE GROWTH GAP"
          title="Why scaling ad spend usually leads to wasted budget."
          subtitle="Most brands don't lack data. They lack the intelligence to know which hooks convert and when ad fatigue is killing their ROAS."
        />

        {/* 2-Column Comparison Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
          {/* Column 1: The Broken Way */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-[#FFFFFF] border border-[#8B2626]/30 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B2626] mb-3">
              <XCircle className="w-4 h-4 text-[#8B2626]" />
              THE OLD WAY (GUESSWORK & CHAOS)
            </div>
            <h3 className="text-xl font-bold text-[#2A1A18] tracking-tight mb-4">
              Jumping between 5 dashboards with no clear direction
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#6A5652]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#8B2626] font-bold mt-0.5">✕</span>
                <span>
                  <strong>Vanity Views Over Sales:</strong> Reels get thousands of views, but nobody buys and you have no idea why.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8B2626] font-bold mt-0.5">✕</span>
                <span>
                  <strong>Silent Ad Fatigue:</strong> Winning Meta and Google ad sets quietly decay, driving up CPA while burning daily spend.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8B2626] font-bold mt-0.5">✕</span>
                <span>
                  <strong>Data Overload:</strong> Spreadsheets, CTRs, and CPM tables that require hours of analysis just to figure out what to post next.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#8B2626] font-bold mt-0.5">✕</span>
                <span>
                  <strong>Disconnected Teams:</strong> Creative creators shooting random trends while media buyers struggle with high lead acquisition costs.
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Column 2: The GenieAds Way */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#FFFFFF] border-2 border-[#EF6905] rounded-3xl p-6 sm:p-8 shadow-lg shadow-[#EF6905]/10 relative overflow-hidden ring-1 ring-[#EF6905]/20"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#486C2F] mb-3">
              <CheckCircle2 className="w-4 h-4 text-[#486C2F]" />
              THE GENIEADS WAY (UNIFIED INTELLIGENCE)
            </div>
            <h3 className="text-xl font-bold text-[#2A1A18] tracking-tight mb-4">
              One unified formula linking organic creative to ad revenue
            </h3>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#2A1A18]">
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#F1E5A1] text-[#486C2F] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-[#486C2F]" />
                </div>
                <span>
                  <strong>Hook & Retention Diagnostics:</strong> Understand the exact 3-second hook structures that retain high-intent buyers.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#F1E5A1] text-[#486C2F] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-[#486C2F]" />
                </div>
                <span>
                  <strong>Proactive Fatigue Radar:</strong> Instant alerts the day an ad fatigues, with exact guidance to reallocate budget into scaling assets.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#F1E5A1] text-[#486C2F] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-[#486C2F]" />
                </div>
                <span>
                  <strong>Daily Prioritized Moves:</strong> A simple, prioritized morning checklist: exactly what to pause, test, and scale today.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#F1E5A1] text-[#486C2F] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-[#486C2F]" />
                </div>
                <span>
                  <strong>Zero Guesswork:</strong> Creative and performance media teams work from the same validated playbook.
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
