const API_BASE_URL = "https://backend-fullstack-wn9a.onrender.com";

export interface Influencer {
  id: string;
  name: string;
  follower_count: number;
  trust_score: number;
  platform: string;
}

export interface Claim {
  id: string;
  influencer_id: string;
  content: string;
  category: string;
  verification_status: string;
  trust_score: number;
  source: string;
  date: string;
}

export interface Stats {
  total_influencers: number;
  total_claims: number;
  verified_claims: number;
  avg_trust_score: number;
  categories: Record<string, number>;
}

export interface ResearchConfig {
  dateRange: string;
  claimLimit: number;
  journals: string[];
  categories: string[];
}

export interface AnalyticsReport {
  overall_stats: {
    total_claims: number;
    avg_trust_score: number;
    verified_percentage: number;
    claims_per_day: Record<string, number>;
  };
  trends: {
    daily_volume: Record<string, number>;
    moving_average: Record<string, number>;
    trend: string;
  };
  influencer_impact: any;
  category_analysis: any;
  trust_metrics: any;
}

export const api = {
  async getInfluencers(): Promise<Influencer[]> {
    const response = await fetch(`${API_BASE_URL}/api/influencers`);
    if (!response.ok) throw new Error('Failed to fetch influencers');
    return response.json();
  },

  async addInfluencer(name: string, platform: string): Promise<Influencer> {
    const response = await fetch(`${API_BASE_URL}/api/influencers?name=${encodeURIComponent(name)}&platform=${encodeURIComponent(platform)}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to add influencer');
    return response.json();
  },

  async getClaims(influencerId: string): Promise<Claim[]> {
    const response = await fetch(`${API_BASE_URL}/api/claims/${influencerId}`);
    if (!response.ok) throw new Error('Failed to fetch claims');
    return response.json();
  },

  async addClaim(influencerId: string, content: string): Promise<Claim> {
    const response = await fetch(`${API_BASE_URL}/api/claims?influencer_id=${encodeURIComponent(influencerId)}&content=${encodeURIComponent(content)}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to add claim');
    return response.json();
  },

  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async analyzeClaim(content: string) {
    const response = await fetch(`${API_BASE_URL}/api/analyze?content=${encodeURIComponent(content)}`);
    if (!response.ok) throw new Error('Failed to analyze claim');
    return response.json();
  },

  async updateResearchConfig(config: ResearchConfig) {
    const response = await fetch(`${API_BASE_URL}/api/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config)
    });
    if (!response.ok) throw new Error('Failed to update research configuration');
    return response.json();
  },

  async scanInfluencer(influencerId: string): Promise<{ claims: Claim[] }> {
    const response = await fetch(`${API_BASE_URL}/api/influencers/${influencerId}/scan`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to scan influencer content');
    return response.json();
  },

  async batchProcessClaims(claims: string[]): Promise<{ results: any[] }> {
    const response = await fetch(`${API_BASE_URL}/api/batch-process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claims)
    });
    if (!response.ok) throw new Error('Failed to process claims batch');
    return response.json();
  },

  async getAnalyticsReport(): Promise<AnalyticsReport> {
    const response = await fetch(`${API_BASE_URL}/api/analytics/report`);
    if (!response.ok) throw new Error('Failed to fetch analytics report');
    return response.json();
  },

  async getInfluencerAnalysis(influencerId: string) {
    const response = await fetch(`${API_BASE_URL}/api/influencers/${influencerId}/analyze`);
    if (!response.ok) throw new Error('Failed to get influencer analysis');
    return response.json();
  },
  
  async analyzePodcast(url: string) {
    const response = await fetch(`${API_BASE_URL}/api/analyze/podcast?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error('Failed to analyze podcast');
    return response.json();
  },
  
  async validateWithJournals(claim: string) {
    const response = await fetch(`${API_BASE_URL}/api/validate/journals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim })
    });
    if (!response.ok) throw new Error('Failed to validate with journals');
    return response.json();
  }
};
