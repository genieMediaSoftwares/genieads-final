import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ContentDNACard } from '../components/ContentDNACard';

export const ContentDNASection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="ALGORITHMIC PATTERN RECOGNITION"
          title="Discover your winning content formula."
          subtitle="GenieAds identifies the recurring patterns behind your strongest content so you can stop guessing what to post and scale predictable engagement."
        />

        <div className="max-w-4xl mx-auto mt-6">
          <ContentDNACard />
        </div>
      </div>
    </section>
  );
};
