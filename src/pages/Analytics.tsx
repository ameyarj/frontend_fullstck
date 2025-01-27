import { useState, useEffect } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { api, Claim } from '../api';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const influencersData = await api.getInfluencers();
      const allClaims = await Promise.all(
        influencersData.map(inf => api.getClaims(inf.id))
      );
      setClaims(allClaims.flat());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(claims.map(claim => claim.category)));
  
  const filteredClaims = claims.filter(claim => {
    if (selectedCategories.length && !selectedCategories.includes(claim.category)) {
      return false;
    }
    if (dateRange === 'week') {
      const claimDate = new Date(claim.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return claimDate >= weekAgo;
    }
    return true;
  });

  const trustScoreDistribution = categories.map(category => ({
    category,
    avgScore: filteredClaims
      .filter(c => c.category === category)
      .reduce((acc, c) => acc + c.trust_score, 0) / 
      filteredClaims.filter(c => c.category === category).length || 0
  }));

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <header>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-2">Analyze health claims and trends</p>
        </header>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
          </select>
          <div className="relative">
            <button
              onClick={() => setShowFilterModal(true)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filter Categories
            </button>
            {showFilterModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Filter by Category</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => {
                            setSelectedCategories(prev => 
                              e.target.checked
                                ? [...prev, category]
                                : prev.filter(c => c !== category)
                            );
                          }}
                          className="rounded border-gray-600"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowFilterModal(false)}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-emerald-400">Trust Score by Category</h2>
          <div className="space-y-4">
            {trustScoreDistribution.map(({ category, avgScore }) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{category}</span>
                  <span className="text-emerald-400">{avgScore.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${avgScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6 text-emerald-400">Claims Volume</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map(category => {
              const count = filteredClaims.filter(c => c.category === category).length;
              const percentage = (count / filteredClaims.length * 100) || 0;
              return (
                <div key={category} className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">{category}</div>
                  <div className="text-2xl font-bold text-white mt-1">{count}</div>
                  <div className="text-sm text-emerald-400">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
