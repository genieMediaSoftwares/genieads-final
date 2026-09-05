import React from 'react';
import { motion } from 'motion/react';
import { Link2, Cpu, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

export const ProductFlowSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'CONNECT',
      desc: 'Connect your marketing platforms in seconds.',
      detail: 'Instagram, Meta Ads, Google Ads, and website funnels connect via secure OAuth.',
      icon: <Link2 className="w-5 h-5 text-[#486C2F]" />,
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      desc: 'GenieAds analyses your performance.',
      detail: 'Machine learning patterns uncover engagement curves, lead quality, and spend decay.',
      icon: <Cpu className="w-5 h-5 text-[#EF6905]" />,
    },
    {
      num: '03',
      title: 'DISCOVER',
      desc: "Find what's working and why.",
      detail: 'Isolate high-converting hooks, optimal video lengths, and winning audience formulas.',
      icon: <Sparkles className="w-5 h-5 text-[#8B2626]" />,
    },
    {
      num: '04',
      title: 'ACT',
      desc: 'Get clear recommendations for next moves.',
      detail: 'Receive high-impact daily priorities to scale profitable campaigns and eliminate waste.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#486C2F]" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#FAF6E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="THE 4-STEP METHODOLOGY"
          title="From data to decisions."
          subtitle="A continuous closed-loop growth cycle engineered to turn raw platform data into clear, high-conviction actions."
        />

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#FFFFFF] border border-[#E8DEB7] hover:border-[#EF6905] rounded-2xl p-6 flex flex-col justify-between shadow-2xs relative group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-xl font-mono font-black text-[#8B2626]/30 group-hover:text-[#EF6905] transition-colors">
                    {step.num}
                  </span>
                </div>

                <div className="text-xs font-mono font-bold tracking-wider text-[#8B2626] uppercase mb-1">
                  {step.title}
                </div>
                <h3 className="text-base font-bold text-[#2A1A18] mb-2 leading-snug">
                  {step.desc}
                </h3>
                <p className="text-xs text-[#6A5652] leading-relaxed">
                  {step.detail}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#E8DEB7] flex items-center text-[10px] font-mono text-[#6A5652] group-hover:text-[#2A1A18] transition-colors">
                <span>STEP {index + 1} OF 4</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
