import React, { useState } from 'react';
import { Share2, Copy, CheckCircle } from 'lucide-react';

export const ReferralWidget = ({ referralCode }: { referralCode: string }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://creatorasset.ai/signup?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-2">Get More AI Credits</h3>
      <p className="text-slate-300 text-sm mb-4">
        Invite a fellow creator. When they upload their first 10 files, you both get 5GB of AI processing power.
      </p>
      
      <div className="flex items-center gap-2 bg-black/40 p-3 rounded-lg border border-slate-700">
        <code className="text-indigo-300 flex-1 truncate text-xs">{referralLink}</code>
        <button 
          onClick={copyToClipboard}
          className="p-2 hover:bg-indigo-500/20 rounded-md transition-colors"
        >
          {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} className="text-slate-400" />}
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all">
          <Share2 size={16} />
          Share on Twitter/X
        </button>
      </div>
    </div>
  );
};