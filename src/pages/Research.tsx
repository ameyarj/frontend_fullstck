import { useState } from 'react';
import { api } from '../api';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ResearchResults {
  influencer: {
    name: string;
    platform: string;
    trust_score: number;
  };
  total_claims: number;
  categories: Record<string, number>;
  verification_status: Record<string, number>;
  avg_trust_score: number;
  recent_claims: Array<{
    content: string;
    category: string;
    verification_status: string;
    trust_score: number;
  }>;
}

const defaultConfig = {
    dateRange: '7d',
    claimLimit: 50,
    journals: ['pubmed', 'sciencedirect', 'nejm'],
    categories: ['Nutrition', 'Medicine', 'Mental Health', 'Fitness'],
    sources: {
        scientific_journals: ['pubmed', 'sciencedirect', 'nejm'],
        social_media: ['twitter', 'youtube', 'instagram'],
        claim_types: ['explicit', 'implicit'],
        min_confidence: 0.7
    }
};

export default function Research() {
  const [config, setConfig] = useState(defaultConfig);
  const [influencerHandle, setInfluencerHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResearchResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateResearchConfig(config);
  };

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // First add influencer
      const influencer = await api.addInfluencer(influencerHandle, 'twitter');
      
      // Then scan their content
      await api.scanInfluencer(influencer.id);
      
      // Finally get the analysis
      const analysis = await api.getInfluencerAnalysis(influencer.id);
      setResults(analysis);
    } catch (error) {
      console.error('Research error:', error);
      setError('Failed to complete research. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-bold text-white">Research Influencer</h1>
        <p className="text-gray-400 mt-2">Analyze health claims from any influencer</p>
      </header>

      <form onSubmit={handleResearch} className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">Influencer Handle</label>
          <input
            type="text"
            value={influencerHandle}
            onChange={(e) => setInfluencerHandle(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            placeholder="Enter username (e.g., RujutaDiwekar)"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Start Research'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center gap-2">
          <ExclamationCircleIcon className="w-5 h-5" />
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">Research Results</h2>
            
            <div className="grid gap-6">
              {/* Influencer Overview */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-medium text-white mb-2">Influencer Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Name</div>
                    <div className="text-white">{results.influencer.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Platform</div>
                    <div className="text-white">{results.influencer.platform}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Trust Score</div>
                    <div className="text-emerald-400">{results.influencer.trust_score.toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              {/* Analysis Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Total Claims</div>
                  <div className="text-2xl font-bold text-white">{results.total_claims}</div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Avg Trust Score</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {results.avg_trust_score.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Verified Claims</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {results.verification_status?.Verified || 0}
                  </div>
                </div>
              </div>

              {/* Recent Claims */}
              {results.recent_claims && results.recent_claims.length > 0 && (
                <div>
                  <h3 className="font-medium text-white mb-3">Recent Claims</h3>
                  <div className="space-y-3">
                    {results.recent_claims.map((claim, index) => (
                      <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="text-white mb-2">{claim.content}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded-full ${
                            claim.verification_status === 'Verified' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {claim.verification_status}
                          </span>
                          <span className="text-gray-400">{claim.category}</span>
                          <span className="text-emerald-400">
                            Trust Score: {claim.trust_score.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {results.categories && Object.keys(results.categories).length > 0 && (
                <div>
                  <h3 className="font-medium text-white mb-3">Category Distribution</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(results.categories).map(([category, count]) => (
                      <div key={category} className="bg-gray-700/50 p-3 rounded-lg flex justify-between">
                        <span className="text-gray-300">{category}</span>
                        <span className="text-emerald-400">{count} claims</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header>
        <h1 className="text-3xl font-bold text-white">Research Configuration</h1>
        <p className="text-gray-400 mt-2">Configure claim analysis parameters</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Date Range */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <label className="block text-gray-400 mb-2">Analysis Period</label>
          <select
            value={config.dateRange}
            onChange={(e) => updateConfig('dateRange', e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Claim Limit */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <label className="block text-gray-400 mb-2">Claims Limit</label>
          <input
            type="number"
            value={config.claimLimit}
            onChange={(e) => updateConfig('claimLimit', parseInt(e.target.value))}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            min="10"
            max="1000"
          />
        </div>

        {/* Scientific Journals */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <label className="block text-gray-400 mb-2">Scientific Journals</label>
          <div className="space-y-2">
            {['PubMed', 'ScienceDirect', 'NEJM', 'The Lancet'].map(journal => (
              <label key={journal} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.journals.includes(journal.toLowerCase())}
                  onChange={(e) => updateConfig('journals', e.target.checked ? [...config.journals, journal.toLowerCase()] : config.journals.filter(j => j !== journal.toLowerCase()))}
                />
                <span className="text-white">{journal}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Social Media Sources */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <label className="block text-gray-400 mb-2">Social Media Sources</label>
          <div className="space-y-2">
            {['Twitter', 'YouTube', 'Instagram'].map(source => (
              <label key={source} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.sources.social_media.includes(source.toLowerCase())}
                  onChange={(e) => updateConfig('sources', {
                    ...config.sources,
                    social_media: e.target.checked ? [...config.sources.social_media, source.toLowerCase()] : config.sources.social_media.filter(s => s !== source.toLowerCase())
                  })}
                />
                <span className="text-white">{source}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Claim Types */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <label className="block text-gray-400 mb-2">Claim Types</label>
          <div className="space-y-2">
            {['Explicit', 'Implicit'].map(type => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.sources.claim_types.includes(type.toLowerCase())}
                  onChange={(e) => updateConfig('sources', {
                    ...config.sources,
                    claim_types: e.target.checked ? [...config.sources.claim_types, type.toLowerCase()] : config.sources.claim_types.filter(t => t !== type.toLowerCase())
                  })}
                />
                <span className="text-white">{type} Claims</span>
              </label>
            ))}
          </div>
        </div>

        {/* Minimum Confidence */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <label className="block text-gray-400 mb-2">Minimum Confidence Score</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.sources.min_confidence}
            onChange={(e) => updateConfig('sources', {
              ...config.sources,
              min_confidence: parseFloat(e.target.value)
            })}
            className="w-full"
          />
          <div className="text-right text-gray-400">
            {(config.sources.min_confidence * 100).toFixed(0)}%
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
}