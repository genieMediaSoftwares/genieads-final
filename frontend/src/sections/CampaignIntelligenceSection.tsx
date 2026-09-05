import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { CampaignCard } from '../components/CampaignCard';

export const CampaignIntelligenceSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="PORTFOLIO BUDGET OPTIMIZATION"
          title="Campaign Intelligence Preview"
          subtitle="Stop burning ad budget on deteriorating lookalikes. GenieAds correlates front-end CPL with downstream lead quality to recommend precise capital reallocations."
        />

        <div className="max-w-3xl mx-auto mt-6">
          <CampaignCard />
        </div>
      </div>
    </section>
  );
};
