'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { AssetCard } from '@/components/AssetCard';
import { Asset } from '@/types/asset';
import { UploadCloud, Filter } from 'lucide-react';

// Mock data to demonstrate visualization
const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    filename: 'desert-vibes.jpg',
    originalName: 'DSC02394_final.jpg',
    mimeType: 'image/jpeg',
    fileSize: 2400000,
    s3Url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=400&q=80',
    status: 'ready',
    createdAt: new Date().toISOString(),
    aiAnalysis: {
      tags: ['minimalist', 'nature', 'warm'],
      dominantColors: ['#D2B48C', '#87CEEB'],
      description: 'A serene desert landscape under a clear blue sky.',
      detectedObjects: ['sand', 'sky']
    }
  },
  {
    id: '2',
    filename: 'ui-design-v1.png',
    originalName: 'dashboard_final_final.png',
    mimeType: 'image/png',
    fileSize: 1200000,
    s3Url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80',
    status: 'processing',
    createdAt: new Date().toISOString()
  }
];

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);

  const handleAssetClick = (asset: Asset) => {
    console.log('Open detail view for:', asset.id);
  };

  const handleSearch = (query: string) => {
    console.log('Performing semantic search for:', query);
    // In production, this would call our pgvector backend
  };

  return (
    <div className="flex min-h-screen bg-black text-zinc-100">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-bold">Your Assets</h1>
            <p className="text-sm text-zinc-500">Organized by AI, powered by your creativity.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              <UploadCloud size={16} />
              Upload Assets
            </button>
          </div>
        </div>

        {/* Search & Visualization */}
        <div className="mb-10">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {assets.map((asset) => (
            <AssetCard 
              key={asset.id} 
              asset={asset} 
              onClick={handleAssetClick} 
            />
          ))}
          
          {/* Empty State / Drag Zone Placeholder */}
          <div className="border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:border-zinc-700 transition-colors group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="text-zinc-500" size={20} />
            </div>
            <p className="text-xs font-medium text-zinc-400">Drag more chaos here</p>
          </div>
        </div>
      </main>
    </div>
  );
}