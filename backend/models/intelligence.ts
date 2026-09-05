export interface GrowthScoreData {
  score: number;
  deltaPercent: number;
  period: string;
  status: 'LIVE' | 'SYNCING' | 'STABLE';
}

export interface PostPerformanceData {
  id: string;
  title: string;
  type: 'Reel' | 'Carousel' | 'Static' | 'Story';
  score: number;
  vsAveragePercent: number;
  status: 'top' | 'underperformer' | 'signal';
}

export interface CampaignData {
  id: string;
  name: string;
  status: 'Strong' | 'Needs attention' | 'Underperforming';
  score: number;
  spend: number;
  cpl: number;
  leadQualityScore: number;
}
