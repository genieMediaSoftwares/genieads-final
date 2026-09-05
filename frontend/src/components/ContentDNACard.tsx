import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dna, Sparkles, Check, ArrowRight, Layers } from 'lucide-react';

export const ContentDNACard: React.FC = () => {
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>('hook');

  const dnaAttributes = [
    {
      id: 'format',
      label: 'Format',
      value: 'Reel',
      status: '96% consistency',
      details: 'Short-form vertical video drives 3.4× higher discovery compared to static posts.',
    },
    {
      id: 'length',
      label: 'Length',
      value: '24–32 sec',
      status: 'Optimal retention',
      details: '78% average completion rate in this sweet spot before viewer attention decay.',
    },
    {
      id: 'hook',
      label: 'Hook',
      value: 'Question',
      status: '+42% hold rate',
      details: 'Opening with an unresolved question anchors viewers in the first 3 seconds.',
    },
    {
      id: 'topic',
      label: 'Topic',
      value: 'Educational',
      status: 'Highest shareability',
      details: 'Actionable breakdowns and tactical how-tos outperform broad promotional content.',
    },
    {
      id: 'emotion',
      label: 'Emotion',
      value: 'Curiosity',
      status: 'Strongest trigger',
      details: 'Information gap framing triggers active listening and comments.',
    },
    {
      id: 'cta',
      label: 'CTA',
      value: 'Save',
      status: 'Algorithm multiplier',
      details: 'Saves signal high replay value to Meta and Instagram ranking algorithms.',
    },
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#2A1A18]/5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#E8DEB7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F1E5A1]/70 border border-[#E8DEB7] flex items-center justify-center text-[#EF6905]">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8B2626]">PATTERN SYNTHESIS</div>
            <h3 className="text-lg font-bold text-[#2A1A18]">Account Content DNA</h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F1E5A1]/70 border border-[#486C2F]/30 rounded-full text-xs font-medium text-[#486C2F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#486C2F] animate-pulse" />
          Pattern Confirmed
        </div>
      </div>

      {/* Grid of DNA Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
        {dnaAttributes.map((item) => {
          const isSelected = selectedAttribute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedAttribute(item.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#FAF6E8] border-[#EF6905] shadow-2xs ring-1 ring-[#EF6905]/60'
                  : 'bg-[#FFFFFF] border-[#E8DEB7] hover:border-[#EF6905] hover:bg-[#FAF6E8]'
              }`}
            >
              <div className="text-[11px] font-medium text-[#6A5652] uppercase tracking-wider">{item.label}</div>
              <div className="text-base font-bold text-[#2A1A18] mt-0.5">{item.value}</div>
              <div className="text-[11px] text-[#486C2F] mt-1 flex items-center gap-1 font-medium">
                <Check className="w-3 h-3 text-[#486C2F]" />
                <span>{item.status}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Insight Box for selected item */}
      {selectedAttribute && (
        <motion.div
          key={selectedAttribute}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl mb-6 text-xs text-[#6A5652] flex items-start gap-2.5 shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#EF6905] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#2A1A18] capitalize">
              {dnaAttributes.find((a) => a.id === selectedAttribute)?.label} insight:
            </strong>{' '}
            {dnaAttributes.find((a) => a.id === selectedAttribute)?.details}
          </span>
        </motion.div>
      )}

      {/* Winning Formula Highlight */}
      <div className="p-4 sm:p-5 bg-[#FAF6E8] border-2 border-[#EF6905] rounded-xl relative overflow-hidden shadow-2xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B2626] mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#EF6905]" />
          Verified Winning Formula
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#2A1A18]">
          <span className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E8DEB7] shadow-2xs">Question Hook</span>
          <span className="text-[#EF6905]">+</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E8DEB7] shadow-2xs">Educational Topic</span>
          <span className="text-[#EF6905]">+</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E8DEB7] shadow-2xs">24–32 sec</span>
          <span className="text-[#EF6905]">+</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#E8DEB7] shadow-2xs">Save CTA</span>
        </div>
      </div>
    </div>
  );
};
