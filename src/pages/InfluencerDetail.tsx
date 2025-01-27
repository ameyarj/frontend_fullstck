// frontend/src/pages/InfluencerDetail.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';
import { api, Claim, Influencer } from '../api';
import StatCard from '../components/StatCard';

export default function InfluencerDetail() {
    const { influencerId } = useParams();
    const [influencer, setInfluencer] = useState<Influencer | null>(null);
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Change getInfluencer to use getInfluencers and find
            const allInfluencers = await api.getInfluencers();
            const influencerData = allInfluencers.find(inf => inf.id === influencerId);
            setInfluencer(influencerData || null);

            const claimsData = await api.getClaims(influencerId!);
            setClaims(claimsData);
        } catch (error) {
            console.error('Error loading influencer data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">{influencer?.name}</h1>
                <p className="text-gray-400 mt-2"> @{influencer?.platform}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Trust Score"
                    value={`${influencer?.trust_score?.toFixed(1)}%`}
                    icon={<DocumentCheckIcon className="w-6 h-6 text-emerald-400" />}
                />
                <StatCard 
                    title="Total Claims"
                    value={claims.length}
                    icon={<DocumentCheckIcon className="w-6 h-6 text-emerald-400" />}
                />
                <StatCard 
                    title="Verified Claims"
                    value={claims.filter(c => c.verification_status === 'Verified').length}
                    icon={<DocumentCheckIcon className="w-6 h-6 text-emerald-400" />}
                />
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-emerald-400">Claims Analysis</h2>
                <div className="space-y-4">
                    {claims.map(claim => (
                        <div key={claim.id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="text-white mb-2">{claim.content}</div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className={`px-2 py-1 rounded-full ${claim.verification_status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {claim.verification_status}
                                </span>
                                <span className="text-gray-400">Trust Score: {claim.trust_score.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
