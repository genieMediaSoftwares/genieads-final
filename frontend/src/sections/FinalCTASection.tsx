import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

interface FinalCTAProps {
  onOpenEarlyAccess: () => void;
}

export const FinalCTASection: React.FC<FinalCTAProps> = ({ onOpenEarlyAccess }) => {
  const scrollToPricing = () => {
    const el = document.querySelector('#pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-28 relative overflow-hidden bg-[#FAF6E8] border-t border-[#E8DEB7]">
      {/* Background radial data pattern */}
      <div className="absolute inset-0 data-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#EF6905]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F1E5A1]/80 text-[#8B2626] border border-[#E8DEB7] mx-auto shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EF6905]" />
          START TURNING DATA INTO DECISIONS
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2A1A18] tracking-tight leading-[1.12]"
        >
          Your next growth move <br />
          <span className="bg-gradient-to-r from-[#8B2626] via-[#EF6905] to-[#486C2F] bg-clip-text text-transparent">
            is already hiding in your data.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-[#6A5652] max-w-xl mx-auto leading-relaxed"
        >
          GenieAds helps you find it. Join the waitlist for priority access to the intelligence layer designed for high-growth brands.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <Button
            id="final-cta-view-pricing"
            variant="glow"
            size="lg"
            onClick={scrollToPricing}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Plans & Pricing
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-6 flex items-center justify-center gap-6 text-xs text-[#6A5652]"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#486C2F]" />
            <span>Instant workspace activation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#486C2F]" />
            <span>Direct founder support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
