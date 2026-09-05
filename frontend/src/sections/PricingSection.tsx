import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { PricingCard } from '../components/PricingCard';
import { PricingPlan } from '../types';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface PricingSectionProps {
  onOpenEarlyAccess: (interest?: 'Social Intelligence' | 'Growth Intelligence' | 'Managed Growth') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenEarlyAccess }) => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'plan-social',
      name: 'Social Intelligence',
      tier: 'social',
      price: currency === 'INR' 
        ? (billingCycle === 'annual' ? '₹1,199' : '₹1,499') 
        : (billingCycle === 'annual' ? '$15' : '$19'),
      period: '/ month',
      description: 'For creators & brands focused on mastering organic video reach, hook retention, and audience growth.',
      features: [
        'Instagram & Reels organic diagnostics',
        '3-second hook retention scores',
        'Top vs bottom post breakdowns ("Why" engine)',
        'Content DNA Blueprint & formula extraction',
        'AI trend opportunities & content radar',
        'Live Growth Score benchmark',
        '24-hour automated data sync',
      ],
      ctaText: 'Start with Social',
    },
    {
      id: 'plan-growth',
      name: 'Growth Intelligence',
      tier: 'growth',
      price: currency === 'INR' 
        ? (billingCycle === 'annual' ? '₹1,999' : '₹2,499') 
        : (billingCycle === 'annual' ? '$31' : '$39'),
      period: '/ month',
      isPopular: true,
      badge: 'RECOMMENDED',
      description: 'For scaling brands connecting creative video performance with paid Meta & Google Ads conversion.',
      features: [
        'Everything in Social Intelligence',
        'Meta Ads & Google Ads intelligence layer',
        'Real-time ad spend fatigue alerts',
        'Daily Prioritized Action Playbook',
        'Cross-channel budget shift recommendations',
        'Lead quality & CPA drop-off tracking',
        'Priority new feature updates',
      ],
      ctaText: 'Get Growth Intelligence',
    },
    {
      id: 'plan-zero-to-hero',
      name: 'Zero → Hero Managed',
      tier: 'zero_to_hero',
      price: currency === 'INR' ? 'Custom' : 'Custom',
      period: billingCycle === 'annual' ? 'starting at ₹35,000/mo' : 'starting at ₹45,000/mo',
      description: 'Hands-on digital growth execution. Our elite team handles scripting, shooting, editing, and ad scaling for you.',
      features: [
        'Complete end-to-end growth strategy',
        'High-converting video scripting & hooks',
        'On-site video production & direction',
        'High-retention video editing & motion design',
        'Meta & Google Ads media buying management',
        'Full-funnel conversion rate optimization',
        'Dedicated growth strategist & weekly syncs',
      ],
      ctaText: 'Talk to Genie Team',
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 relative overflow-hidden bg-[#FAF6E8] border-t border-[#E8DEB7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="TRANSPARENT & PREDICTABLE PRICING"
          title="Simple pricing. Massive return on spend."
          subtitle="Stop burning ad budget on guesswork. Choose the right level of intelligence for your brand."
        />

        {/* Currency & Billing Period Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-12">
          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1 bg-[#FFFFFF] border border-[#E8DEB7] rounded-xl shadow-2xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-[#8B2626] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18]'
              }`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 rounded bg-[#F1E5A1] text-[#486C2F] text-[10px] font-black uppercase">
                Save 20%
              </span>
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="inline-flex items-center p-1 bg-[#FFFFFF] border border-[#E8DEB7] rounded-xl shadow-2xs">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-[#EF6905] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18]'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-[#EF6905] text-white shadow-xs'
                  : 'text-[#6A5652] hover:text-[#2A1A18]'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              index={index}
              onSelect={(interest) => onOpenEarlyAccess(interest)}
            />
          ))}
        </div>

        {/* Value Assurance Badges */}
        <div className="mt-12 pt-8 border-t border-[#E8DEB7] max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#6A5652]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#486C2F]" />
            <span>Read-only 256-bit secure API connection</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#EF6905]" />
            <span>Setup in under 60 seconds</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B2626]" />
            <span>Cancel or switch anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};
