export interface GrowthScore {
  score: number;
  deltaPercent: number;
  period: string;
  status: 'LIVE' | 'SYNCING' | 'STABLE';
}

export interface PostPerformance {
  id: string;
  title: string;
  type: 'Reel' | 'Post' | 'Carousel';
  performanceScore: number;
  vsAveragePercent: number;
  statusLabel?: string;
  details?: string;
}

export interface ContentDNA {
  format: string;
  length: string;
  hook: string;
  topic: string;
  emotion: string;
  cta: string;
  formulaSummary: string[];
}

export interface ContentIdea {
  id: string;
  number: string;
  title: string;
  opportunityScore: number;
  reason: string;
  tag: string;
}

export interface TrendOpportunity {
  topic: string;
  trendScore: number;
  accountFit: number;
  competition: 'Low' | 'Medium' | 'High';
  opportunity: 'HIGH' | 'MEDIUM' | 'EMERGING';
  description: string;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  status: 'Strong' | 'Needs attention' | 'Underperforming';
  barPercentage: number;
  cpl: string;
  leadQuality: string;
}

export interface ActionItem {
  id: string;
  priority: 'HIGH' | 'RECOMMENDED' | 'OPPORTUNITY';
  title: string;
  expectedImpact: 'HIGH' | 'MEDIUM';
  description: string;
  status: 'pending' | 'completed' | 'reviewed';
  actionLabel: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tier: 'social' | 'growth' | 'zero_to_hero';
  price: string;
  period?: string;
  description: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
}

export interface EarlyAccessFormData {
  name: string;
  workEmail: string;
  companyBrand: string;
  url: string;
  interest: 'Social Intelligence' | 'Growth Intelligence' | 'Managed Growth' | 'Not sure yet';
}

export interface MetaPostItem {
  id: string;
  caption?: string;
  mediaType: 'VIDEO' | 'IMAGE' | 'CAROUSEL_ALBUM';
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink?: string;
  timestamp: string;
  formattedDate: string;
  likes: number;
  comments: number;
  saves: number;
  shares?: number;
  reach?: number;
  views?: number;
  watchTimeSeconds?: number;
  formattedWatchTime?: string;
  engagementRate?: string;
}

export interface PostsDiagnosticInfo {
  realPostsCount: number;
  hasRealPosts: boolean;
  status: 'live_posts_fetched' | 'empty_account' | 'missing_permissions' | 'demo_preview';
  message: string;
  testedSource?: string;
  missingPermissions?: string[];
  grantedPermissions?: string[];
  pagesFound?: string[];
  linkedInstagramFound?: boolean;
  linkedInstagramUsername?: string;
  metaRawLog?: string;
  permissionsAdvice?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  email: string;
  companyBrand?: string;
  instagramHandle?: string;
  instagramData?: {
    handle: string;
    followers: string;
    reelsCount: number;
    category: string;
    verified?: boolean;
  };
  role: 'admin' | 'user';
  subscriptionTier?: 'Social Intelligence' | 'Growth Intelligence' | 'Managed Growth' | 'trial';
  graphApiKey?: string;
  graphApiAccount?: {
    profileName?: string;
    followersCount?: number;
    formattedFollowers?: string;
    username?: string;
    profilePictureUrl?: string;
    accountType?: string;
    mediaCount?: number;
    accountId?: string;
    accountName?: string;
    adAccountId?: string;
    adAccountName?: string;
    businessManagerId?: string;
    currency?: string;
    status: string;
    syncedAt: string;
    isDemo?: boolean;
    posts?: MetaPostItem[];
    postsDiagnostic?: PostsDiagnosticInfo;
  };
  createdAt: string;
}
