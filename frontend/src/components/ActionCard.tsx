import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Sparkles, Clock, Check, Eye, ChevronRight, X } from 'lucide-react';
import { Button } from './Button';

export interface ActionItemData {
  id: string;
  priority: 'HIGH' | 'RECOMMENDED' | 'OPPORTUNITY';
  title: string;
  expectedImpact: 'HIGH' | 'MEDIUM';
  description: string;
  details: string;
  category: string;
}

export const ActionCard: React.FC = () => {
  const [actions, setActions] = useState<
    (ActionItemData & { isDone: boolean; isReviewed: boolean })[]
  >([
    {
      id: 'act-1',
      priority: 'HIGH',
      title: 'Reduce Campaign B budget',
      expectedImpact: 'HIGH',
      description: 'Trim daily spend by 30% on underperforming lookalike ad set.',
      details: 'Decreased audience quality detected over past 14 days. Trimming ₹8,500/week saves budget leakage.',
      category: 'Paid Advertising',
      isDone: false,
      isReviewed: false,
    },
    {
      id: 'act-2',
      priority: 'RECOMMENDED',
      title: 'Create 2 educational Reels',
      expectedImpact: 'MEDIUM',
      description: 'Leverage Question Hook + Educational breakdown format.',
      details: 'Historical pattern indicates 24-32s educational videos generate 3.4x higher organic shares.',
      category: 'Organic Social',
      isDone: false,
      isReviewed: false,
    },
    {
      id: 'act-3',
      priority: 'OPPORTUNITY',
      title: 'Test customer testimonial campaign',
      expectedImpact: 'HIGH',
      description: 'Deploy proof-focused creative to warm retargeting audiences.',
      details: 'Similar brands in your industry experience a 38% conversion surge using video testimonials.',
      category: 'Growth Opportunity',
      isDone: false,
      isReviewed: false,
    },
  ]);

  const [activeReview, setActiveReview] = useState<ActionItemData | null>(null);

  const toggleDone = (id: string) => {
    setActions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  const getPriorityBadge = (priority: ActionItemData['priority']) => {
    switch (priority) {
      case 'HIGH':
        return {
          label: '🔴 HIGH PRIORITY',
          bg: 'bg-[#8B2626]/15 text-[#8B2626] border-[#8B2626]/30',
        };
      case 'RECOMMENDED':
        return {
          label: '🟠 RECOMMENDED',
          bg: 'bg-[#EF6905]/15 text-[#EF6905] border-[#EF6905]/35',
        };
      case 'OPPORTUNITY':
        return {
          label: '🟢 OPPORTUNITY',
          bg: 'bg-[#F1E5A1]/80 text-[#486C2F] border-[#486C2F]/30',
        };
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#2A1A18]/5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#E8DEB7]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8B2626]">ACTION MATRIX</div>
          <h3 className="text-lg sm:text-xl font-bold text-[#2A1A18]">Today's Priority Growth Actions</h3>
        </div>
        <div className="text-xs text-[#6A5652] flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-[#486C2F]" />
          <span>Updated 14 mins ago</span>
        </div>
      </div>

      {/* Action List */}
      <div className="space-y-4 my-6">
        {actions.map((item, index) => {
          const p = getPriorityBadge(item.priority);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 shadow-2xs ${
                item.isDone
                  ? 'bg-[#F1E5A1]/30 border-[#486C2F]/40 opacity-75'
                  : 'bg-[#FAF6E8] border-[#E8DEB7] hover:border-[#EF6905]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${p.bg}`}>
                      {p.label}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[#6A5652] border border-[#E8DEB7]">
                      Expected Impact: <strong className="text-[#2A1A18]">{item.expectedImpact}</strong>
                    </span>
                    <span className="text-[11px] text-[#6A5652]">{item.category}</span>
                  </div>

                  <h4 className={`text-base font-bold text-[#2A1A18] ${item.isDone ? 'line-through text-[#6A5652]' : ''}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#6A5652]">{item.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 shrink-0">
                  <button
                    onClick={() => setActiveReview(item)}
                    className="px-3 py-1.5 text-xs font-medium text-[#6A5652] hover:text-[#2A1A18] bg-[#FFFFFF] hover:bg-[#FAF6E8] border border-[#E8DEB7] rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review</span>
                  </button>

                  <button
                    onClick={() => toggleDone(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      item.isDone
                        ? 'bg-[#F1E5A1] border-[#486C2F]/40 text-[#486C2F]'
                        : 'bg-[#486C2F] hover:bg-[#3B5926] text-white border-[#486C2F]'
                    }`}
                  >
                    {item.isDone ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{item.isDone ? 'Done' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-xs text-[#6A5652] flex items-center justify-between shadow-2xs">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#EF6905]" />
          Action checklist: Mark items as complete or view AI optimization recommendations.
        </span>
        <span className="font-mono text-[11px] text-[#486C2F] font-semibold">3 of 3 ready</span>
      </div>

      {/* Review Modal Backdrop & Card */}
      {activeReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setActiveReview(null)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl p-6 max-w-md w-full shadow-2xl text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEB7]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF6905]" />
                <span className="text-xs font-semibold text-[#8B2626] uppercase tracking-wider">
                  Genie Recommendation
                </span>
              </div>
              <button
                onClick={() => setActiveReview(null)}
                className="p-1 rounded-lg text-[#6A5652] hover:text-[#2A1A18] hover:bg-[#FAF6E8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#2A1A18]">{activeReview.title}</h4>
              <div className="mt-2 text-xs text-[#486C2F] bg-[#F1E5A1]/80 border border-[#486C2F]/35 px-2.5 py-1 rounded-lg inline-block font-semibold">
                Expected Impact: {activeReview.expectedImpact}
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF6E8] border border-[#E8DEB7] rounded-xl text-xs text-[#6A5652] space-y-2">
              <p className="font-semibold text-[#2A1A18]">Full Intelligence Rationale:</p>
              <p className="leading-relaxed text-[#6A5652]">{activeReview.details}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => setActiveReview(null)}>
                Close
              </Button>
              <Button
                size="sm"
                variant="glow"
                onClick={() => {
                  toggleDone(activeReview.id);
                  setActiveReview(null);
                }}
              >
                Accept & Mark Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
