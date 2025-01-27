import { useState, useEffect } from 'react';
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { api, Influencer } from '../api';

export default function Influencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInfluencer, setNewInfluencer] = useState({ name: '', platform: '' });

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = async () => {
    const data = await api.getInfluencers();
    setInfluencers(data);
  };

  const handleAddInfluencer = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addInfluencer(newInfluencer.name, newInfluencer.platform);
    setNewInfluencer({ name: '', platform: '' });
    setShowAddForm(false);
    loadInfluencers();
  };

  const handleScanContent = async (influencerId: string) => {
    try {
      const result = await api.scanInfluencer(influencerId);
      loadInfluencers(); // Refresh the list
      alert(`Found ${result.claims.length} new claims`);
    } catch (error) {
      console.error('Error scanning content:', error);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <header>
          <h1 className="text-3xl font-bold text-white">Influencers</h1>
          <p className="text-gray-400 mt-2">Monitor and analyze health influencers</p>
        </header>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Influencer
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleAddInfluencer} className="bg-gray-800 p-6 rounded-xl space-y-4 w-96">
            <h2 className="text-xl font-bold text-white">Add New Influencer</h2>
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={newInfluencer.name}
                onChange={(e) => setNewInfluencer(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Platform</label>
              <select
                value={newInfluencer.platform}
                onChange={(e) => setNewInfluencer(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select Platform</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter">Twitter</option>
              </select>
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
                Add Influencer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {influencers.map(influencer => (
          <div key={influencer.id} className="bg-gray-800 p-6 rounded-xl hover:ring-2 hover:ring-emerald-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{influencer.name}</h3>
                  <div className="text-sm text-gray-400">{influencer.platform}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Trust Score</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {influencer.trust_score.toFixed(1)}%
                </div>
              </div>
            </div>
            <button
              onClick={() => handleScanContent(influencer.id)}
              className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
            >
              Scan Latest Content
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
