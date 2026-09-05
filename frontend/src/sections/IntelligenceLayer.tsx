import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Instagram, Facebook, Megaphone, Search, Globe, Users, ArrowUpRight, Cpu } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

export const IntelligenceLayer: React.FC = () => {
  const satellites = [
    { name: 'Instagram', detail: 'Organic & Reels', icon: <Instagram className="w-5 h-5 text-[#EF6905]" /> },
    { name: 'Facebook', detail: 'Pages & Reach', icon: <Facebook className="w-5 h-5 text-[#8B2626]" /> },
    { name: 'Meta Ads', detail: 'Campaigns & ROAS', icon: <Megaphone className="w-5 h-5 text-[#EF6905]" /> },
    { name: 'Google Ads', detail: 'Search & Intent', icon: <Search className="w-5 h-5 text-[#8B2626]" /> },
    { name: 'Website', detail: 'Traffic & Funnels', icon: <Globe className="w-5 h-5 text-[#486C2F]" /> },
    { name: 'Leads & Sales', detail: 'Quality & Close Rates', icon: <Users className="w-5 h-5 text-[#486C2F]" /> },
  ];

  return (
    <section id="intelligence" className="py-24 relative overflow-hidden bg-[#FAF6E8]">
      <div className="absolute inset-0 intelligence-glow opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="UNIFIED ARCHITECTURE"
          title="Your marketing team just got an intelligence layer."
          subtitle="GenieAds sits above your marketing platforms and transforms fragmented performance data into one clear, connected picture of growth."
        />

        {/* Central Intelligence Node Grid Layout */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left Satellite Column (3 channels) */}
            <div className="space-y-4">
              {satellites.slice(0, 3).map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-4 bg-[#FFFFFF] border border-[#E8DEB7] hover:border-[#EF6905] rounded-xl flex items-center justify-between transition-colors group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#2A1A18]">{item.name}</div>
                      <div className="text-xs text-[#6A5652]">{item.detail}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#486C2F] bg-[#F1E5A1]/70 px-2 py-0.5 rounded border border-[#486C2F]/30 font-semibold">
                    DATA STREAM
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Center: The Core GenieAds Intelligence Brain Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#EF6905] rounded-3xl shadow-xl shadow-[#EF6905]/10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F1E5A1]/40 rounded-full blur-2xl pointer-events-none" />

              <div className="w-16 h-16 rounded-2xl bg-[#F1E5A1]/70 border border-[#E8DEB7] text-[#EF6905] flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <Cpu className="w-8 h-8 text-[#EF6905]" />
              </div>

              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B2626] mb-1">
                SYNTHESIS ENGINE
              </div>
              <h3 className="text-2xl font-extrabold text-[#2A1A18] tracking-tight font-mono">
                GENIE<span className="text-[#EF6905]">ADS</span>
              </h3>
              <p className="mt-2 text-xs text-[#6A5652] leading-relaxed max-w-xs mx-auto">
                Correlating creative velocity, ad spend efficiency, and pipeline conversion in real-time.
              </p>

              <div className="mt-6 pt-5 border-t border-[#E8DEB7] grid grid-cols-2 gap-3 text-left">
                <div className="p-2.5 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl">
                  <div className="text-[10px] text-[#6A5652] uppercase">Analysis Cycle</div>
                  <div className="text-xs font-bold text-[#2A1A18] mt-0.5 font-mono">Continuous</div>
                </div>
                <div className="p-2.5 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl">
                  <div className="text-[10px] text-[#6A5652] uppercase">Clarity Engine</div>
                  <div className="text-xs font-bold text-[#486C2F] mt-0.5 font-mono">Prescriptive</div>
                </div>
              </div>
            </motion.div>

            {/* Right Satellite Column (3 channels) */}
            <div className="space-y-4">
              {satellites.slice(3, 6).map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-4 bg-[#FFFFFF] border border-[#E8DEB7] hover:border-[#EF6905] rounded-xl flex items-center justify-between transition-colors group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#2A1A18]">{item.name}</div>
                      <div className="text-xs text-[#6A5652]">{item.detail}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#486C2F] bg-[#F1E5A1]/70 px-2 py-0.5 rounded border border-[#486C2F]/30 font-semibold">
                    DATA STREAM
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
