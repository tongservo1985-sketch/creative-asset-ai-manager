import React from 'react';
import { LayoutDashboard, Image, Film, Music, Settings, Hash, HardDrive } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'All Assets', active: true },
  { icon: Image, label: 'Images' },
  { icon: Film, label: 'Videos' },
  { icon: Music, label: 'Audio' },
];

const collectionItems = ['Branding 2024', 'Client: Nike', 'Instagram Assets', 'Personal Sketches'];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-zinc-800 h-screen sticky top-0 bg-black p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
        </div>
        <span className="font-bold text-lg tracking-tight">CreatorAI</span>
      </div>

      <nav className="space-y-1">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Library</p>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.active ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-10">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">Collections</p>
        <div className="space-y-1">
          {collectionItems.map((item) => (
            <button key={item} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
              <Hash size={16} />
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-zinc-800">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Storage</span>
            <span className="text-xs font-medium text-zinc-200">72%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[72%]" />
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-semibold py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
            <HardDrive size={14} />
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
};