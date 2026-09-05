import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ActionCard } from '../components/ActionCard';

export const ActionCenterSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#FAF6E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="DAILY GROWTH WORKFLOW"
          title="Less reporting. More doing."
          subtitle="Skip 40-page monthly analytics PDFs that nobody reads. Open GenieAds to a ranked, high-impact checklist of the exact 3 actions to execute today."
        />

        <div className="max-w-4xl mx-auto mt-6">
          <ActionCard />
        </div>
      </div>
    </section>
  );
};
