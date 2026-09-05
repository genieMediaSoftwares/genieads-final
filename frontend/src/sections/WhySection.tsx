import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Sparkles, CheckCircle2, TrendingUp, Clock, FileVideo, Lightbulb, Target } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

export const WhySection: React.FC = () => {
  const reasons = [
    {
      num: '01',
      title: 'Strong opening hook',
      stat: '+42% retention',
      description: 'Opening question paused feed scroll in first 1.8 seconds, keeping drop-off below 12%.',
    },
    {
      num: '02',
      title: 'Topic relevance',
      stat: 'High audience interest',
      description: 'Addressed top search keyword and repeated inquiry topic from recent buyer DMs.',
    },
    {
      num: '03',
      title: 'Format efficiency',
      stat: 'Reels outperforming account average',
      description: 'Vertical 9:16 short form captures 3.1× higher algorithmic distribution than static carousels.',
    },
    {
      num: '04',
      title: 'Optimal posting timing',
      stat: 'Peak active engagement window',
      description: 'Published Tuesday 7:30 PM, matching your core followers’ highest activity cohort.',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#FAF6E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="DEEP ATTRIBUTION DIAGNOSTICS"
          title="Numbers tell you what happened. GenieAds tells you why."
          subtitle="Moving past basic vanity charts. GenieAds decomposes every creative into the psychological and algorithmic triggers that dictated its success or failure."
        />

        {/* Large Analysis Mock Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#2A1A18]/5 relative overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DEB7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F1E5A1]/70 border border-[#E8DEB7] flex items-center justify-center text-[#EF6905]">
                <FileVideo className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8B2626]">
                  DEEP ANALYSIS • REEL #48
                </div>
                <h3 className="text-xl font-bold text-[#2A1A18]">"3 Mistakes First-Time Buyers Make"</h3>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-[#F1E5A1]/70 border border-[#486C2F]/30 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#486C2F]" />
              <span className="text-sm font-extrabold text-[#486C2F] font-mono">3.4× Higher Reach</span>
            </div>
          </div>

          {/* Section: Why it worked */}
          <div className="my-8">
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#6A5652] mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EF6905]" />
              WHY IT WORKED
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reasons.map((r) => (
                <div
                  key={r.num}
                  className="p-4 bg-[#FAF6E8] border border-[#E8DEB7] hover:border-[#EF6905] rounded-xl transition-colors space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#8B2626]">{r.num}</span>
                    <span className="text-[11px] font-semibold text-[#486C2F] bg-[#F1E5A1]/80 px-2 py-0.5 rounded border border-[#486C2F]/30">
                      {r.stat}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#2A1A18] pt-1">{r.title}</h4>
                  <p className="text-xs text-[#6A5652] leading-relaxed">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Genie Recommendation Box */}
          <div className="p-5 sm:p-6 bg-[#FAF6E8] border-2 border-[#EF6905] rounded-2xl relative overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8B2626] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#EF6905]" />
                GENIE RECOMMENDATION
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1E5A1] text-[#8B2626] border border-[#E8DEB7] font-semibold">
                CONFIDENCE: 96%
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-[#2A1A18]">
              Double down on educational Reels with question-based hooks.
            </h4>
            <p className="mt-1.5 text-xs text-[#6A5652] leading-relaxed">
              Schedule 2 upcoming scripts following this exact 28-second structure to reinforce high audience retention and maximize organic algorithm distribution.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
