import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { PerformanceCard } from '../components/PerformanceCard';

export const PerformanceSection: React.FC = () => {
  return (
    <section id="product" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="AUTOMATED PERFORMANCE AUDIT"
          title="See what's actually working."
          subtitle="Instant separation of top-tier creative winners, audience drop-off points, and latent growth triggers across your entire content history."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
          {/* CARD 1: Top Performers */}
          <PerformanceCard
            type="top"
            title="#1 REEL OF THE MONTH"
            subtitle="Educational Breakdown Format"
            score={94}
            metricChange="+184% vs average"
            isPositive={true}
            tag="Top Performer"
            description="High initial retention driven by an unsolved question hook. Viewers completed 82% of the runtime and accounted for 430+ organic saves."
            delay={0}
          />

          {/* CARD 2: Underperformers */}
          <PerformanceCard
            type="underperformer"
            title="POST #127 (PROMO)"
            subtitle="Discount Announcement Static"
            score={31}
            metricChange="-42% vs average"
            isPositive={false}
            tag="Underperformer"
            description="Immediate audience fatigue detected within 1.5 seconds. Lacks educational value, leading to algorithm suppression and minimal share velocity."
            delay={0.1}
          />

          {/* CARD 3: Growth Signals */}
          <PerformanceCard
            type="signal"
            title="CONTENT SIGNALS"
            subtitle="Latent Patterns Detected"
            score={3}
            metricChange="High Confidence"
            isPositive={true}
            tag="3 New Opportunities"
            description="Identified 3 untapped sub-topics with high audience comment inquiries that match your highest-performing Content DNA profile."
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
};
