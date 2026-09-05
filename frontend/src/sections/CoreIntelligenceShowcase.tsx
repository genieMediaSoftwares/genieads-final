import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Video, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Target, 
  DollarSign, 
  BarChart3,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { Button } from '../components/Button';

interface CoreIntelligenceShowcaseProps {
  onOpenEarlyAccess: (interest?: 'Social Intelligence' | 'Growth Intelligence' | 'Managed Growth') => void;
}

export const CoreIntelligenceShowcase: React.FC<CoreIntelligenceShowcaseProps> = ({ onOpenEarlyAccess }) => {
  const [activeTab, setActiveTab] = useState<'creative' | 'campaigns' | 'playbook'>('creative');

  const tabs = [
    {
      id: 'creative' as const,
      label: 'Creative & Hook Intelligence',
      badge: 'Organic & Reels',
      icon: <Video className="w-4 h-4" />,
      tagline: 'Know exactly which video hooks convert viewers into buyers.',
    },
    {
      id: 'campaigns' as const,
      label: 'Ad Spend & Fatigue Radar',
      badge: 'Meta & Google Ads',
      icon: <DollarSign className="w-4 h-4" />,
      tagline: 'Spot rising CPAs and dying creatives before burning ad budget.',
    },
    {
      id: 'playbook' as const,
      label: 'Daily Action Playbook',
      badge: 'Prioritized Moves',
      icon: <Target className="w-4 h-4" />,
      tagline: 'A ranked morning checklist of your highest-ROI growth decisions.',
    },
  ];

  return (
    <section id="product" className="py-20 sm:py-28 relative overflow-hidden bg-[#FAF6E8] border-t border-[#E8DEB7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="CORE INTELLIGENCE CAPABILITIES"
          title="Everything you need to grow. Nothing you don't."
          subtitle="Three interconnected intelligence engines that eliminate guesswork across your creative, ad spend, and daily execution."
        />

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto mt-10 mb-8 p-1.5 bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl shadow-2xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8B2626] text-white shadow-md shadow-[#8B2626]/20'
                    : 'text-[#6A5652] hover:text-[#2A1A18] hover:bg-[#FAF6E8]'
                }`}
              >
                <span className={isActive ? 'text-[#F1E5A1]' : 'text-[#EF6905]'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {/* TAB 1: CREATIVE & HOOK INTELLIGENCE */}
            {activeTab === 'creative' && (
              <motion.div
                key="creative"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 shadow-md shadow-[#2A1A18]/4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#E8DEB7] gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1]/80 text-[#8B2626] border border-[#E8DEB7] mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#EF6905]" />
                      CREATIVE HOOK DIAGNOSTICS
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2A1A18]">
                      Decode why your videos go viral or fall flat.
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6A5652] mt-1">
                      GenieAds analyzes your 3-second retention, hook phrasing, tone, and visual framing.
                    </p>
                  </div>
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => onOpenEarlyAccess('Social Intelligence')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Test Your Content
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Winning Creative Anatomy */}
                  <div className="p-5 rounded-2xl bg-[#FAF6E8] border border-[#486C2F]/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#486C2F]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#486C2F]">
                          TOP PERFORMER (3.4× AVERAGE)
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-[#486C2F] px-2 py-0.5 bg-[#FFFFFF] rounded border border-[#486C2F]/30">
                        SCORE: 94/100
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#2A1A18]">
                      "3 Mistakes D2C Brands Make Before Spending $10k on Meta Ads"
                    </h4>

                    <div className="space-y-2 text-xs text-[#6A5652]">
                      <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E8DEB7] space-y-1">
                        <strong className="text-[#2A1A18] block">Why It Worked:</strong>
                        <p>
                          Immediate pain-point framing in the first 1.8 seconds. Visual screen-recording established instant proof without fluff.
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="p-2 bg-[#FFFFFF] rounded-lg border border-[#E8DEB7]">
                          <div className="text-[10px] text-[#6A5652]">3s Retention</div>
                          <div className="text-sm font-bold text-[#486C2F] font-mono mt-0.5">76.2%</div>
                        </div>
                        <div className="p-2 bg-[#FFFFFF] rounded-lg border border-[#E8DEB7]">
                          <div className="text-[10px] text-[#6A5652]">Save Rate</div>
                          <div className="text-sm font-bold text-[#486C2F] font-mono mt-0.5">14.8%</div>
                        </div>
                        <div className="p-2 bg-[#FFFFFF] rounded-lg border border-[#E8DEB7]">
                          <div className="text-[10px] text-[#6A5652]">Leads Added</div>
                          <div className="text-sm font-bold text-[#486C2F] font-mono mt-0.5">+48</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Underperforming Creative Diagnosis */}
                  <div className="p-5 rounded-2xl bg-[#FAF6E8] border border-[#8B2626]/25 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#8B2626]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8B2626]">
                          DROPPED REACH (-42%)
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-[#8B2626] px-2 py-0.5 bg-[#FFFFFF] rounded border border-[#8B2626]/30">
                        SCORE: 38/100
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#2A1A18]">
                      "Product Update v2.4 Feature Overview & Highlights"
                    </h4>

                    <div className="space-y-2 text-xs text-[#6A5652]">
                      <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E8DEB7] space-y-1">
                        <strong className="text-[#8B2626] block">The Diagnosis:</strong>
                        <p>
                          Talking-head intro took 6.2 seconds to reach the core value. Viewers swiped away before hearing the solution.
                        </p>
                      </div>
                      <div className="p-3 bg-[#8B2626]/8 rounded-xl border border-[#8B2626]/20 text-[#8B2626]">
                        <strong>Genie Fix:</strong> Repackage the same feature as: <em>"How we cut user onboarding from 20 mins to 90 seconds"</em>.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: AD SPEND & FATIGUE RADAR */}
            {activeTab === 'campaigns' && (
              <motion.div
                key="campaigns"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 shadow-md shadow-[#2A1A18]/4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#E8DEB7] gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1]/80 text-[#8B2626] border border-[#E8DEB7] mb-2">
                      <DollarSign className="w-3.5 h-3.5 text-[#EF6905]" />
                      REAL-TIME AD SPEND DIAGNOSTICS
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2A1A18]">
                      Protect your ad budget before money is wasted.
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6A5652] mt-1">
                      Continuous monitoring detects ad set creative fatigue and rising cost-per-lead in Meta and Google Ads.
                    </p>
                  </div>
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => onOpenEarlyAccess('Growth Intelligence')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Audit My Ad Spend
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Campaign 1: Fatigued creative alert */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6E8] border border-[#8B2626]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#8B2626]/15 text-[#8B2626] font-bold text-[10px] uppercase tracking-wide border border-[#8B2626]/30">
                          FATIGUE ALERT
                        </span>
                        <span className="text-xs font-mono text-[#6A5652]">Meta Ads • Retargeting Set 04</span>
                      </div>
                      <h4 className="text-base font-bold text-[#2A1A18]">
                        "Testimonial Carousel (30-Day Visitors)"
                      </h4>
                      <p className="text-xs text-[#6A5652]">
                        Frequency hit 4.8× with CPA jumping +44% over 5 days. Creative is exhausted.
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E8DEB7] shrink-0">
                      <div className="text-xs text-[#8B2626] font-bold font-mono">Action: PAUSE AD SET</div>
                      <div className="text-[11px] text-[#486C2F] font-semibold mt-0.5">Saves ₹14,200 / wk</div>
                    </div>
                  </div>

                  {/* Campaign 2: Scalable winner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6E8] border border-[#486C2F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#486C2F]/15 text-[#486C2F] font-bold text-[10px] uppercase tracking-wide border border-[#486C2F]/30">
                          HIGH EFFICIENCY WINNER
                        </span>
                        <span className="text-xs font-mono text-[#6A5652]">Google Search • High Intent</span>
                      </div>
                      <h4 className="text-base font-bold text-[#2A1A18]">
                        "Growth Automation Software" Keyword Group
                      </h4>
                      <p className="text-xs text-[#6A5652]">
                        Lead quality at 88% with CPL 38% below industry average. Has headroom for scale.
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E8DEB7] shrink-0">
                      <div className="text-xs text-[#486C2F] font-bold font-mono">Action: SCALE BUDGET +25%</div>
                      <div className="text-[11px] text-[#486C2F] font-semibold mt-0.5">Est. +18 qualified calls</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: DAILY ACTION PLAYBOOK */}
            {activeTab === 'playbook' && (
              <motion.div
                key="playbook"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-3xl p-6 sm:p-8 shadow-md shadow-[#2A1A18]/4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#E8DEB7] gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1]/80 text-[#8B2626] border border-[#E8DEB7] mb-2">
                      <Target className="w-3.5 h-3.5 text-[#EF6905]" />
                      ZERO-FLUFF ACTION PRIORITIES
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2A1A18]">
                      Your daily growth checklist, ranked by cash impact.
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6A5652] mt-1">
                      No drowning in raw tables. You open the app and see the exact moves to make right now.
                    </p>
                  </div>
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={() => onOpenEarlyAccess('Growth Intelligence')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Get Your Daily Moves
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Action 1 */}
                  <div className="p-4 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] hover:border-[#EF6905] transition-all flex items-start gap-3 group">
                    <div className="w-7 h-7 rounded-lg bg-[#8B2626] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      01
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#8B2626] uppercase tracking-wider">
                          CRITICAL COST-SAVER
                        </span>
                        <span className="text-[11px] text-[#486C2F] font-semibold bg-[#486C2F]/10 px-2 py-0.2 rounded">
                          Immediate Impact
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#2A1A18]">
                        Pause "Promo Reel 03" inside Meta campaign
                      </h4>
                      <p className="text-xs text-[#6A5652]">
                        Ad reached 8.1 frequency with rising CPA. Stop bleeding cash and swap with top organic Reel #2.
                      </p>
                    </div>
                  </div>

                  {/* Action 2 */}
                  <div className="p-4 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] hover:border-[#EF6905] transition-all flex items-start gap-3 group">
                    <div className="w-7 h-7 rounded-lg bg-[#EF6905] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      02
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#EF6905] uppercase tracking-wider">
                          ORGANIC MULTIPLIER
                        </span>
                        <span className="text-[11px] text-[#486C2F] font-semibold bg-[#486C2F]/10 px-2 py-0.2 rounded">
                          +2.4× Comments
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#2A1A18]">
                        Shoot "Behind-the-Scenes Automation Breakdown" Reel
                      </h4>
                      <p className="text-xs text-[#6A5652]">
                        Your audience fit for this format is 91/100. Pre-written 3-second hook is ready in your Idea Vault.
                      </p>
                    </div>
                  </div>

                  {/* Action 3 */}
                  <div className="p-4 rounded-xl bg-[#FAF6E8] border border-[#E8DEB7] hover:border-[#EF6905] transition-all flex items-start gap-3 group">
                    <div className="w-7 h-7 rounded-lg bg-[#486C2F] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      03
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#486C2F] uppercase tracking-wider">
                          BUDGET REALLOCATION
                        </span>
                        <span className="text-[11px] text-[#486C2F] font-semibold bg-[#486C2F]/10 px-2 py-0.2 rounded">
                          High Intent
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#2A1A18]">
                        Reallocate 20% budget to Google Search campaign
                      </h4>
                      <p className="text-xs text-[#6A5652]">
                        Conversion rate is holding at 14.8% with stable CPCs. Shifting ₹6,000 adds an estimated 9 qualified demo requests.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
