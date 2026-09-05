import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { PricingPlan } from '../types';

interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (interest: 'Social Intelligence' | 'Growth Intelligence' | 'Managed Growth') => void;
  index: number;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect, index }) => {
  const isGrowth = plan.isPopular;

  const handleCta = () => {
    if (plan.tier === 'social') onSelect('Social Intelligence');
    else if (plan.tier === 'growth') onSelect('Growth Intelligence');
    else onSelect('Managed Growth');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
        isGrowth
          ? 'bg-[#FFFFFF] border-2 border-[#EF6905] shadow-xl shadow-[#EF6905]/15 ring-1 ring-[#EF6905]/30'
          : 'bg-[#FFFFFF] border border-[#E8DEB7] hover:border-[#EF6905] shadow-2xs'
      }`}
    >
      {/* Popular Badge */}
      {isGrowth && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#8B2626] text-white shadow-md shadow-[#8B2626]/20 border border-[#8B2626] flex items-center gap-1.5 whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-[#F1E5A1]" />
          MOST POPULAR
        </div>
      )}

      <div>
        {/* Plan Header */}
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-xl font-bold text-[#2A1A18] tracking-tight">{plan.name}</h3>
          {plan.tier === 'zero_to_hero' && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F1E5A1]/80 text-[#8B2626] border border-[#E8DEB7]">
              Agency Execution
            </span>
          )}
        </div>

        <p className="text-xs text-[#6A5652] min-h-[36px] leading-relaxed mb-6">
          {plan.description}
        </p>

        {/* Pricing tag */}
        <div className="py-4 mb-6 border-y border-[#E8DEB7] flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#2A1A18] tracking-tight font-mono">
            {plan.price}
          </span>
          {plan.period && <span className="text-xs text-[#6A5652] font-medium">{plan.period}</span>}
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#2A1A18]">
            {plan.tier === 'growth' ? 'Everything in Social, plus:' : 'Included Capabilities:'}
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#6A5652]">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isGrowth ? 'bg-[#F1E5A1]/80 text-[#486C2F]' : 'bg-[#FAF6E8] border border-[#E8DEB7] text-[#486C2F]'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-4">
        <Button
          variant={isGrowth ? 'glow' : 'secondary'}
          size="md"
          className="w-full"
          onClick={handleCta}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {plan.ctaText}
        </Button>
      </div>
    </motion.div>
  );
};
