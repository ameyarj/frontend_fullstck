import { useEffect, useState } from 'react';
import { ChartBarIcon, UserGroupIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import StatCard from '../components/StatCard';
import { api, Stats } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total_influencers: 0,
    total_claims: 0,
    verified_claims: 0,
    avg_trust_score: 0,
    categories: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Monitor health claims and influencer analytics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Influencers"
          value={stats.total_influencers}
          icon={<UserGroupIcon className="w-6 h-6 text-emerald-400" />}
        />
        <StatCard 
          title="Claims Analyzed"
          value={stats.total_claims}
          icon={<DocumentCheckIcon className="w-6 h-6 text-emerald-400" />}
        />
        <StatCard 
          title="Avg Trust Score"
          value={`${stats.avg_trust_score.toFixed(1)}%`}
          icon={<ChartBarIcon className="w-6 h-6 text-emerald-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown categories={stats.categories} />
        <ClaimStatusDistribution stats={stats} />
      </div>
    </div>
  );
}

function CategoryBreakdown({ categories }: { categories: Record<string, number> }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">Category Breakdown</h2>
      <div className="space-y-4">
        {Object.entries(categories).map(([category, count]) => (
          <div key={category} className="flex items-center justify-between">
            <span className="text-gray-300">{category}</span>
            <span className="text-emerald-400">{count} claims</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClaimStatusDistribution({ stats }: { stats: any }) {
  const total = stats.total_claims;
  const verified = stats.verified_claims;
  const questionable = total - verified;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">Claim Verification Status</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Verified</span>
          <span className="text-emerald-400">{verified} claims</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Questionable</span>
          <span className="text-yellow-400">{questionable} claims</span>
        </div>
      </div>
    </div>
  );
}
