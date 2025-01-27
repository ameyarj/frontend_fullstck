import { useState } from 'react';
import { api } from '../api';

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

    return (
        <div className="space-y-8 animate-fadeIn">
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