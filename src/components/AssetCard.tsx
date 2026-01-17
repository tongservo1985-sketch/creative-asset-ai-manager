import React from 'react';
import { FileIcon, ImageIcon, VideoIcon, MoreVertical, Tag } from 'lucide-react';
import { Asset } from '@/types/asset';

interface AssetCardProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onClick }) => {
  const isImage = asset.mimeType.startsWith('image/');
  const isVideo = asset.mimeType.startsWith('video/');

  return (
    <div 
      className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all cursor-pointer"
      onClick={() => onClick(asset)}
    >
      {/* Thumbnail / Icon Area */}
      <div className="aspect-square w-full bg-zinc-800 flex items-center justify-center relative">
        {asset.status === 'processing' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-[10px] text-zinc-300 uppercase tracking-widest">AI Analyzing</span>
          </div>
        )}
        
        {isImage && asset.thumbnailUrl ? (
          <img 
            src={asset.thumbnailUrl} 
            alt={asset.filename} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : isVideo ? (
          <VideoIcon className="w-12 h-12 text-zinc-600" />
        ) : (
          <FileIcon className="w-12 h-12 text-zinc-600" />
        )}
      </div>

      {/* Info Area */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-zinc-200 truncate pr-4">
            {asset.originalName}
          </p>
          <button className="text-zinc-500 hover:text-zinc-200">
            <MoreVertical size={16} />
          </button>
        </div>
        
        {/* AI Tags Preview */}
        <div className="mt-2 flex flex-wrap gap-1">
          {asset.aiAnalysis?.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag} 
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700"
            >
              <Tag size={8} className="mr-1" />
              {tag}
            </span>
          ))}
          {(asset.aiAnalysis?.tags.length ?? 0) > 2 && (
            <span className="text-[10px] text-zinc-500">+{asset.aiAnalysis!.tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};