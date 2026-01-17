import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search with semantic intelligence (e.g., 'minimalist blue textures')"
          className="block w-full pl-11 pr-12 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all backdrop-blur-md"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {query ? (
            <button type="button" onClick={() => setQuery('')} className="text-zinc-500 hover:text-zinc-300">
              <X size={18} />
            </button>
          ) : (
            <div className="flex items-center space-x-1 text-[10px] font-bold text-zinc-600 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
              <Sparkles size={12} className="text-indigo-400" />
              <span>AI POWERED</span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};