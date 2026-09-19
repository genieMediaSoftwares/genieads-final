import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, TrendingUp, AlertTriangle, ArrowDown, Activity, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';

interface HeroProps {
  onOpenEarlyAccess: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEarlyAccess }) => {
  const [scoreCount, setScoreCount] = useState(0);

  // Animated counter for the Growth Score
  useEffect(() => {
    let start = 0;
    const end = 82;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setScoreCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const scrollToPricing = () => {
    const el = document.querySelector('#pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const el = document.querySelector('#how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background data ambient pattern */}
      <div className="absolute inset-0 data-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EF6905]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#F1E5A1]/40 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F1E5A1]/70 text-[#8B2626] border border-[#E8DEB7] shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#EF6905] animate-pulse" />
              AI Growth Intelligence
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-[#2A1A18] tracking-tight leading-[1.08]"
            >
              Stop Guessing. <br />
              <span className="bg-gradient-to-r from-[#8B2626] via-[#EF6905] to-[#8B2626] bg-clip-text text-transparent">
                Start Growing.
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-[#6A5652] max-w-2xl leading-relaxed"
            >
              GenieAds turns your social media and advertising data into clear growth decisions — what worked, what failed, why it happened, and what you should do next.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <Button
                id="hero-view-pricing"
                variant="primary"
                size="lg"
                onClick={scrollToPricing}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View Pricing & Plans
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                How It Works
              </Button>
            </motion.div>

            {/* Micro Trust Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6A5652]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#486C2F]" />
                <span>Zero guesswork reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#486C2F]" />
                <span>Engineered for Meta & Google</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#486C2F]" />
                <span>Action-first recommendations</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Premium Interactive Mockup */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl p-5 sm:p-6 shadow-xl shadow-[#2A1A18]/6 overflow-hidden"
            >
              {/* Top Bar of Interface */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DEB7]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#486C2F] animate-pulse" />
                  <span className="font-mono text-xs font-bold tracking-wider text-[#2A1A18]">
                    GENIE INTELLIGENCE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F1E5A1]/70 border border-[#E8DEB7] text-[10px] font-bold text-[#486C2F]">
                  <span>● LIVE</span>
                </div>
              </div>

              {/* Growth Score & Trend Line */}
              <div className="py-4 border-b border-[#E8DEB7] grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <div className="text-[11px] font-semibold text-[#6A5652] uppercase tracking-wider">
                    Growth Score
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-[#2A1A18] tracking-tight font-mono my-1">
                    {scoreCount}
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#486C2F]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+8.4% this cycle</span>
                  </div>
                </div>

                {/* Simulated Sparkline / Chart Visualization */}
                <div className="col-span-7 h-16 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 160 50">
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF6905" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#EF6905" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 40 Q 30 45, 50 30 T 90 22 T 130 15 T 160 8"
                      fill="none"
                      stroke="#EF6905"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 40 Q 30 45, 50 30 T 90 22 T 130 15 T 160 8 L 160 50 L 0 50 Z"
                      fill="url(#heroGradient)"
                    />
                    <circle cx="160" cy="8" r="4" fill="#8B2626" className="animate-ping" />
                    <circle cx="160" cy="8" r="3" fill="#8B2626" />
                  </svg>
                </div>
              </div>

              {/* Three Intelligence Feed Blocks */}
              <div className="space-y-3 pt-4">
                {/* 1. What's Working */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="p-3 rounded-xl bg-[#F1E5A1]/40 border border-[#486C2F]/30 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-[#486C2F] uppercase tracking-wider">
                      WHAT'S WORKING
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#2A1A18]">
                      Educational Reels
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#486C2F] px-2 py-0.5 rounded bg-[#F1E5A1]/80 border border-[#486C2F]/40">
                      2.7× above average
                    </span>
                  </div>
                </motion.div>

                {/* 2. What's Hurting */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="p-3 rounded-xl bg-[#8B2626]/10 border border-[#8B2626]/25 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-[#8B2626] uppercase tracking-wider">
                      WHAT'S HURTING
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#2A1A18]">
                      Promotional posts
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#8B2626] px-2 py-0.5 rounded bg-[#8B2626]/15 border border-[#8B2626]/30">
                      -31% reach
                    </span>
                  </div>
                </motion.div>

                {/* 3. Next Move */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="p-3.5 rounded-xl bg-[#FAF6E8] border border-[#EF6905]/40 hover:border-[#EF6905] flex items-center justify-between gap-3 transition-colors shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-[#EF6905] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#EF6905]" />
                      NEXT MOVE
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#2A1A18]">
                      Create 3 educational Reels
                    </div>
                  </div>
                  <button
                    onClick={onOpenEarlyAccess}
                    className="p-1.5 rounded-lg bg-[#EF6905]/15 hover:bg-[#EF6905]/25 text-[#EF6905] transition-colors cursor-pointer"
                    aria-label="View recommended action"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>

              {/* System Intelligence Indicator */}
              <div className="mt-4 pt-3 border-t border-[#E8DEB7] flex items-center justify-between text-[10px] text-[#6A5652]">
                <span>PERFORMANCE INTELLIGENCE ENGINE</span>
                <span className="font-mono text-[#8B2626] font-semibold">GENIE-CORE-V1</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
