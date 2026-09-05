import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Lightbulb, TrendingUp, Bookmark, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

interface ContentIdeasProps {
  onOpenEarlyAccess: () => void;
}

export const ContentIdeasSection: React.FC<ContentIdeasProps> = ({ onOpenEarlyAccess }) => {
  const ideas = [
    {
      num: 'IDEA 01',
      title: '"3 mistakes first-time buyers make"',
      score: 91,
      reason: 'Matches your strongest historical content pattern with high educational resonance.',
      tag: 'Proven High-Performer',
      format: '28s Reel • Question Hook',
    },
    {
      num: 'IDEA 02',
      title: '"What nobody tells you before buying..."',
      score: 87,
      reason: 'Strong curiosity format combined with your highest-performing topic cluster.',
      tag: 'Curiosity Anchor',
      format: '25s Reel • Contrast Hook',
    },
    {
      num: 'IDEA 03',
      title: '"Before you spend ₹X, check this..."',
      score: 84,
      reason: 'High save potential based on previous buyer intent and decision-stage content behavior.',
      tag: 'High Save Potential',
      format: '30s Reel • Checklist CTA',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#FAF6E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="DATA-BACKED CREATIVE PIPELINE"
          title="Don't wait for inspiration. Find your next opportunity."
          subtitle="Generate high-converting content ideas calculated directly from your account's top historical retention dynamics and audience questions."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#FFFFFF] border border-[#E8DEB7] hover:border-[#EF6905] rounded-2xl p-6 flex flex-col justify-between shadow-2xs transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-[#8B2626]">{idea.num}</span>
                  <span className="text-[11px] font-semibold text-[#486C2F] bg-[#F1E5A1]/80 px-2 py-0.5 rounded-full border border-[#486C2F]/30">
                    {idea.tag}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#2A1A18] transition-colors">
                  {idea.title}
                </h3>

                <div className="text-[11px] font-mono text-[#6A5652] mt-1 mb-4">{idea.format}</div>

                {/* Score badge */}
                <div className="p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl mb-4 flex items-center justify-between">
                  <span className="text-xs text-[#6A5652]">Opportunity Score:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#2A1A18] font-mono">{idea.score}</span>
                    <span className="text-xs text-[#6A5652] font-mono">/ 100</span>
                  </div>
                </div>

                <p className="text-xs text-[#6A5652] leading-relaxed">
                  <strong className="text-[#2A1A18]">Reason:</strong> {idea.reason}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8DEB7] flex items-center justify-between text-[11px] text-[#6A5652]">
                <span>SAMPLE PREVIEW</span>
                <button
                  onClick={onOpenEarlyAccess}
                  className="text-[#EF6905] hover:text-[#8B2626] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Test in Beta</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
