import React from 'react';
import { motion } from 'motion/react';
import { Share2, Megaphone, Video, BarChart3, TrendingUp } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const pillars = [
    { label: 'Social Intelligence', icon: <Share2 className="w-4 h-4 text-[#EF6905]" /> },
    { label: 'Ads Performance', icon: <Megaphone className="w-4 h-4 text-[#8B2626]" /> },
    { label: 'Content DNA', icon: <Video className="w-4 h-4 text-[#486C2F]" /> },
    { label: 'Attribution & Quality', icon: <BarChart3 className="w-4 h-4 text-[#EF6905]" /> },
    { label: 'Growth Decisions', icon: <TrendingUp className="w-4 h-4 text-[#486C2F]" /> },
  ];

  return (
    <section className="relative py-8 border-y border-[#E8DEB7] bg-[#F1E5A1]/25 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-bold uppercase tracking-widest text-[#6A5652] shrink-0 text-center md:text-left">
            BUILT FOR MODERN GROWTH TEAMS
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-[#2A1A18]">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E8DEB7] hover:border-[#EF6905] transition-colors text-[#2A1A18] shadow-2xs"
              >
                {pillar.icon}
                <span>{pillar.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
