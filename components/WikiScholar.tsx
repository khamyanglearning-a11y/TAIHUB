
import React, { useState } from 'react';
import { searchTaiHeritage } from '../services/geminiService';
import { User } from '../types';

interface HeritageResult {
  title: string;
  englishContent: string;
  assameseContent: string;
  culturalSignificance: string;
  relatedTopics: string[];
}

interface WikiScholarProps {
  user: User;
  starters: string[];
  onUpdateStarters: (starters: string[]) => void;
  isOnline: boolean;
}

const WikiScholar: React.FC<WikiScholarProps> = ({ user, starters, onUpdateStarters, isOnline }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<HeritageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingStarters, setIsEditingStarters] = useState(false);
  const [newStarter, setNewStarter] = useState('');

  const isAuthorized = user.role === 'owner' || user.permissions?.heritage;

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim() || isLoading) return;
    if (!isOnline) return alert("Internet required for Scholar AI research.");

    setIsLoading(true);
    setResult(null);
    try {
      const data = await searchTaiHeritage(finalQuery);
      if (data) setResult(data);
      else alert("No detailed records found for this query.");
    } catch (e) {
      alert("Scholar AI encountered an error.");
    } finally {
      setIsLoading(false);
    }
  };

  const addStarter = () => {
    if (!newStarter.trim()) return;
    if (starters.includes(newStarter.trim())) return alert("Option already exists.");
    onUpdateStarters([...starters, newStarter.trim()]);
    setNewStarter('');
  };

  const removeStarter = (index: number) => {
    onUpdateStarters(starters.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      {/* Scholar Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-100 rotate-3">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Wiki Scholar AI</h2>
          {isAuthorized && (
            <button 
              onClick={() => setIsEditingStarters(!isEditingStarters)}
              className={`p-2 rounded-xl transition-all ${isEditingStarters ? 'bg-amber-100 text-amber-600 shadow-inner' : 'bg-gray-100 text-gray-400 hover:text-blue-600'}`}
              title="Customize Options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          )}
        </div>
        <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
          Deep research hub for Tai Khamyang history, language, and cultural heritage.
        </p>
      </div>

      {/* Starters Customization Panel (Authorized Only) */}
      {isAuthorized && isEditingStarters && (
        <div className="bg-amber-50/50 border-2 border-dashed border-amber-200 p-8 rounded-[3rem] animate-in zoom-in duration-300">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
             <h3 className="text-xl font-black text-amber-900 tracking-tight">Customize Discovery Options</h3>
           </div>
           
           <div className="flex flex-wrap gap-2 mb-6">
              {starters.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-100 rounded-full text-xs font-bold text-amber-800 shadow-sm">
                  {s}
                  <button onClick={() => removeStarter(i)} className="text-amber-300 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                </div>
              ))}
           </div>

           <div className="flex gap-3">
              <input 
                type="text" 
                value={newStarter} 
                onChange={e => setNewStarter(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addStarter()}
                placeholder="Type a new discovery phrase..."
                className="flex-1 px-6 py-4 bg-white border-2 border-amber-100 rounded-2xl outline-none focus:border-amber-500 font-bold text-sm transition-all"
              />
              <button 
                onClick={addStarter}
                className="px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-900/10 active:scale-95 transition-all"
              >
                Add Option
              </button>
           </div>
           <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-4 ml-2">Changes are saved to your database instantly.</p>
        </div>
      )}

      {/* Improved Search Interface */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search community history, rituals, or language..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none font-bold text-gray-800 transition-all shadow-inner"
          />
        </div>
        <button 
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shrink-0"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.69.345a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 001.217 3.395l1.168.116a2 2 0 001.217-.547l1.168-1.168a2 2 0 011.414-.586h.172a2 2 0 011.414.586l1.168 1.168a2 2 0 001.217.547l1.168-.116a2 2 0 001.217-3.395l-1.168-1.168z" /></svg>
              Research Now
            </>
          )}
        </button>
      </div>

      {/* Discovery Starter Chips */}
      <div className="flex flex-wrap justify-center gap-3 px-4">
        {starters.map((s, i) => (
          <button 
            key={i}
            onClick={() => { setQuery(s); handleSearch(s); }}
            className="px-5 py-2.5 bg-white border border-gray-100 hover:border-blue-300 hover:text-blue-600 rounded-full text-xs font-black text-gray-500 transition-all active:scale-95 shadow-sm"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Result Display */}
      {result ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -translate-y-20 translate-x-20"></div>
            
            <header className="relative z-10 mb-10 pb-8 border-b border-gray-50">
               <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Research Entry</span>
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter mt-2">{result.title}</h3>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Detailed Insight (English)</h4>
                  <p className="text-lg text-gray-700 leading-relaxed font-medium">
                    {result.englishContent}
                  </p>
               </div>
               <div className="space-y-4 bg-blue-50/30 p-8 rounded-[2rem] border border-blue-50">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">সাংস্কৃতিক তথ্য (Assamese)</h4>
                  <p className="text-xl text-gray-800 leading-relaxed font-bold assamese-font">
                    {result.assameseContent}
                  </p>
               </div>
            </div>

            <div className="mt-12 p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full translate-x-10 translate-y-10"></div>
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Cultural Significance</h4>
                  <p className="text-lg font-medium italic opacity-90 leading-relaxed">
                    "{result.culturalSignificance}"
                  </p>
               </div>
            </div>
          </div>

          {/* Related Explorations */}
          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
               <h4 className="font-black text-blue-900 uppercase tracking-tighter">Explore More:</h4>
             </div>
             <div className="flex flex-wrap gap-2">
                {result.relatedTopics.map((topic, i) => (
                  <button 
                    key={i}
                    onClick={() => { setQuery(topic); handleSearch(topic); }}
                    className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    {topic}
                  </button>
                ))}
             </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="py-24 text-center space-y-6">
           <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto shadow-xl shadow-blue-100"></div>
           <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Digitizing Cultural Archives...</p>
        </div>
      ) : (
        <div className="py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
           <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">Ready to explore community knowledge</p>
        </div>
      )}
    </div>
  );
};

export default WikiScholar;
