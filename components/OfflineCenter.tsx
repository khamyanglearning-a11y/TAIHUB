import React from 'react';
import { Word, OfflinePack } from '../types';

interface OfflineCenterProps {
  words: Word[];
  packs: OfflinePack[];
  onTogglePack: (id: string) => void;
  isOnline: boolean;
}

const OfflineCenter: React.FC<OfflineCenterProps> = ({ words, packs, onTogglePack, isOnline }) => {
  // Aggregate data for UI
  // Explicitly type categories as string[] to ensure 'cat' is not inferred as 'unknown' in map operations
  const categories: string[] = Array.from(new Set(words.map(w => w.category)));
  
  const getCategoryStats = (cat: string) => {
    const catWords = words.filter(w => w.category === cat);
    return {
      count: catWords.length,
      downloaded: catWords.filter(w => w.isOfflineReady).length
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="bg-gray-900 rounded-[3.5rem] p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-900/40">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Smart Offline Management</h2>
          <p className="text-gray-400 max-w-lg mx-auto font-medium leading-relaxed">
            Download specific categories or language packs to access them without internet. This keeps your device storage lean.
          </p>
          
          <div className="mt-12 flex justify-center gap-8">
             <div className="text-center">
               <div className="text-3xl font-black text-white">{words.filter(w => w.isOfflineReady).length}</div>
               <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Saved Words</div>
             </div>
             <div className="h-10 w-[1px] bg-white/10 mt-2"></div>
             <div className="text-center">
               <div className="text-3xl font-black text-blue-400">{Math.round((words.filter(w => w.isOfflineReady).length / (words.length || 1)) * 100)}%</div>
               <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Coverage</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Download by Category</h3>
          <div className="space-y-3">
            {categories.map((cat: string) => {
              const stats = getCategoryStats(cat);
              const isFullyDownloaded = stats.count === stats.downloaded && stats.count > 0;
              
              return (
                <div key={cat} className={`bg-white p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${isFullyDownloaded ? 'border-emerald-100 shadow-sm' : 'border-gray-100 hover:shadow-xl'}`}>
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isFullyDownloaded ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                      {cat.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 leading-none mb-1">{cat}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {stats.count} Words • {Math.round((stats.count * 150) / 1024)} KB
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onTogglePack(cat)}
                    disabled={!isOnline && !isFullyDownloaded}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isFullyDownloaded ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-300 hover:bg-blue-600 hover:text-white disabled:opacity-50'}`}
                  >
                    {isFullyDownloaded ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Full Language Packs</h3>
          <div className="space-y-4">
             {[
               { id: 'all', name: 'Complete Dictionary', desc: 'All 4 languages + Media assets', size: '2.4 MB' },
               { id: 'essential', name: 'Essential Pack', desc: 'Top 500 English-Tai translations', size: '480 KB' },
               { id: 'heritage', name: 'Heritage Pack', desc: 'Villages & History archives', size: '1.2 MB' }
             ].map(pack => (
               <div key={pack.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform"></div>
                 <div className="relative z-10 flex flex-col h-full">
                   <h4 className="text-xl font-black text-gray-900 mb-2">{pack.name}</h4>
                   <p className="text-sm font-medium text-gray-400 mb-6 leading-relaxed">{pack.desc}</p>
                   
                   <div className="mt-auto flex items-center justify-between">
                     <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{pack.size}</span>
                     <button 
                       onClick={() => onTogglePack(pack.id)}
                       className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                     >
                       Download Pack
                     </button>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-10 rounded-[3rem] text-center space-y-6">
        <h4 className="text-2xl font-black text-blue-900">How Offline Sync Works</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto text-blue-600 font-black shadow-sm">1</div>
             <p className="text-sm font-bold text-blue-800">Pin Content</p>
             <p className="text-xs text-blue-600/70 font-medium leading-relaxed">Choose categories you need daily to save locally.</p>
           </div>
           <div className="space-y-2">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto text-blue-600 font-black shadow-sm">2</div>
             <p className="text-sm font-bold text-blue-800">Auto-Update</p>
             <p className="text-xs text-blue-600/70 font-medium leading-relaxed">Packs update automatically whenever you're on Wi-Fi.</p>
           </div>
           <div className="space-y-2">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto text-blue-600 font-black shadow-sm">3</div>
             <p className="text-sm font-bold text-blue-800">Travel Ready</p>
             <p className="text-xs text-blue-600/70 font-medium leading-relaxed">Search, listen, and learn even in remote villages with no signal.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineCenter;
