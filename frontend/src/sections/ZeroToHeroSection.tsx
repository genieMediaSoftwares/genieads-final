import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';

interface ZeroToHeroProps {
  onOpenEarlyAccess: () => void;
}

export const ZeroToHeroSection: React.FC<ZeroToHeroProps> = ({ onOpenEarlyAccess }) => {
  const steps = [
    { name: 'STRATEGY', desc: 'Market Positioning & Persona Modeling' },
    { name: 'CONTENT', desc: 'Hooks, Scripts & Content DNA Alignment' },
    { name: 'SHOOT', desc: 'High-Retention Visual Production' },
    { name: 'PUBLISH', desc: 'Platform Scheduling & Community Seeding' },
    { name: 'ADS', desc: 'Media Buying & Retargeting Architecture' },
    { name: 'ANALYSE', desc: 'Continuous Performance Attribution' },
    { name: 'OPTIMISE', desc: 'Iterative Hook & Budget Calibration' },
    { name: 'GROW', desc: 'Predictable Revenue Expansion' },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#FAF6E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="MANAGED EXECUTION PROGRAM"
          title="From zero to growth."
          subtitle="GenieAds gives you the intelligence. Our digital growth team can help you execute it end-to-end with high-velocity creative production."
        />

        {/* Visual Timeline Flow */}
        <div className="max-w-5xl mx-auto mt-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {steps.map((step, idx) => (
               <motion.div
                key={step.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="p-3.5 bg-[#FFFFFF] border border-[#E8DEB7] hover:border-[#EF6905] rounded-xl text-center flex flex-col justify-between group transition-colors shadow-2xs"
              >
                <div>
                  <div className="text-[10px] font-mono text-[#8B2626] font-bold mb-1">0{idx + 1}</div>
                  <div className="text-xs font-bold text-[#2A1A18] group-hover:text-[#486C2F] transition-colors font-mono">
                    {step.name}
                  </div>
                </div>
                <div className="text-[10px] text-[#6A5652] mt-2 leading-tight">
                  {step.desc}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Value Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 p-6 sm:p-8 bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-[#486C2F]/10"
          >
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-[#2A1A18] flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-[#EF6905]" />
                Want hands-off execution powered by GenieAds data?
              </h3>
              <p className="text-xs sm:text-sm text-[#6A5652] max-w-xl">
                Our creative directors, media buyers, and editors manage your entire growth pipeline while you focus on running your business.
              </p>
            </div>

            <Button
              variant="glow"
              size="md"
              onClick={onOpenEarlyAccess}
              className="shrink-0"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Inquire for Zero → Hero
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
