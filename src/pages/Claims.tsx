import { useState, useEffect } from 'react';
import { DocumentCheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import { api, Claim, Influencer } from '../api';

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClaim, setNewClaim] = useState({
    content: '',
    influencer_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const influencersData = await api.getInfluencers();
    setInfluencers(influencersData);
    
    const allClaims = await Promise.all(
      influencersData.map(inf => api.getClaims(inf.id))
    );
    setClaims(allClaims.flat());
  };

  const handleAddClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.addClaim(newClaim.influencer_id, newClaim.content);
        setNewClaim({ content: '', influencer_id: '' });
        setShowAddForm(false);
        loadData();
    } catch (error) {
        console.error('Error adding claim:', error);
        alert('Failed to add claim. Please try again.');
    }
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'text-emerald-400';
      case 'Questionable': return 'text-yellow-400';
      case 'Debunked': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <header>
          <h1 className="text-3xl font-bold text-white">Claims Analysis</h1>
          <p className="text-gray-400 mt-2">Review and verify health claims</p>
        </header>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Claim
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleAddClaim} className="bg-gray-800 p-6 rounded-xl space-y-4 w-96">
            <h2 className="text-xl font-bold text-white">Add New Claim</h2>
            <div>
              <label className="block text-gray-400 mb-2">Influencer</label>
              <select
                value={newClaim.influencer_id}
                onChange={(e) => setNewClaim(prev => ({ ...prev, influencer_id: e.target.value }))}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select Influencer</option>
                {influencers.map(inf => (
                  <option key={inf.id} value={inf.id}>{inf.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Claim Content</label>
              <textarea
                value={newClaim.content}
                onChange={(e) => setNewClaim(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg h-32"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                Add Claim
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {claims.map(claim => (
          <div key={claim.id} className="bg-gray-800 p-6 rounded-xl hover:ring-2 hover:ring-emerald-500/20 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <DocumentCheckIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">
                  {influencers.find(i => i.id === claim.influencer_id)?.name}
                </div>
                <div className="text-white font-medium">{claim.content}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-2 py-1 rounded-full bg-gray-700 ${getStatusColor(claim.verification_status)}`}>
                {claim.verification_status}
              </span>
              <span className="text-gray-400">{claim.category}</span>
              <span className="text-emerald-400">Trust Score: {claim.trust_score.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
