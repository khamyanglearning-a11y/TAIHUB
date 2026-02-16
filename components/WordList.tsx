
import React, { useState } from 'react';
import { Word } from '../types';

interface WordListProps {
  words: Word[];
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
  onGenerateImage: (id: string) => Promise<void>;
  onPracticeSpeech: (word: Word) => void;
  isOnline: boolean;
}

const WordCard: React.FC<{
  word: Word;
  index: number;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
  onGenerateImage: (id: string) => Promise<void>;
  onPracticeSpeech: (word: Word) => void;
  isOnline: boolean;
}> = ({ word, index, canEdit, canDelete, onEdit, onDelete, onGenerateImage, onPracticeSpeech, isOnline }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleManualGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Logic: Only generate if not already generating and no image exists
    if (isGenerating || word.imageUrl) return;
    if (!isOnline) {
      alert("Internet connection is required for AI visual generation.");
      return;
    }
    
    setIsGenerating(true);
    try {
      await onGenerateImage(word.id);
    } catch (error) {
      console.error("Visual generation failed:", error);
      alert("AI was unable to generate an image. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!word.audioUrl) return;
    const audio = new Audio(word.audioUrl);
    audio.play().catch(err => console.error("Audio failed", err));
  };

  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl dark:hover:shadow-indigo-500/10 transition-all duration-500 relative group flex flex-col h-full animate-card-entry overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[16/10] bg-gray-50 dark:bg-gray-800 overflow-hidden">
        {word.imageUrl ? (
          <img src={word.imageUrl} alt={word.english} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
             <div className={`w-14 h-14 bg-indigo-50 dark:bg-gray-700/50 text-indigo-300 dark:text-gray-600 rounded-2xl flex items-center justify-center transition-all ${isGenerating ? 'animate-pulse scale-110' : ''}`}>
               {isGenerating ? (
                 <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               ) : (
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               )}
             </div>
             
             {/* Button visible only if user can edit and no image exists */}
             {canEdit && !word.imageUrl && (
               <button 
                 onClick={handleManualGenerate} 
                 disabled={isGenerating || !isOnline} 
                 className="group/ai flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95"
               >
                 <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'group-hover/ai:rotate-12'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                 </svg>
                 {isGenerating ? 'Painting...' : 'Generate AI Image'}
               </button>
             )}
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">{word.category}</span>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          {word.audioUrl && (
            <button onClick={playAudio} className="w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-blue-600 dark:text-indigo-400 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-white dark:border-gray-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
          )}
          <button onClick={() => onPracticeSpeech(word)} className="w-12 h-12 bg-indigo-600 dark:bg-indigo-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border border-indigo-400 dark:border-indigo-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[8px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest block">English</span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter truncate">{word.english}</h3>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[8px] font-black text-emerald-300 dark:text-emerald-800 uppercase tracking-widest block">Tai Khamyang</span>
            <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-500 tracking-tight truncate">{word.taiKhamyang}</h3>
          </div>
          <div className="col-span-2 h-[1px] bg-gray-50 dark:bg-gray-800"></div>
          <div className="space-y-1">
            <span className="text-[8px] font-black text-blue-300 dark:text-blue-800 uppercase tracking-widest block">Assamese</span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 assamese-font truncate">{word.assamese}</h3>
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[8px] font-black text-amber-300 dark:text-amber-800 uppercase tracking-widest block">Additional</span>
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-500 truncate">{word.additionalLang || '—'}</h3>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3">
          {word.pronunciation && (
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Speak:</span>
              <span className="text-sm italic font-medium text-gray-600 dark:text-gray-400">/{word.pronunciation}/</span>
            </div>
          )}
          {word.exampleSentence && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-relaxed italic line-clamp-2">"{word.exampleSentence}"</p>
              {word.sentenceMeaning && <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-snug">{word.sentenceMeaning}</p>}
            </div>
          )}
        </div>

        <div className="pt-4 mt-auto border-t border-gray-50 dark:border-gray-800 flex items-center justify-end">
          {(canEdit || canDelete) && (
            <div className="flex gap-1">
              {canEdit && (
                <button onClick={() => onEdit(word)} className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-all" title="Edit Entry"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
              )}
              {canDelete && (
                <button onClick={() => onDelete(word.id)} className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 rounded-xl transition-all" title="Delete Entry"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function WordList({ words, ...props }: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="py-32 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-gray-200 dark:border-gray-800">
           <svg className="w-10 h-10 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">No words found</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {words.map((word, i) => (
        <WordCard key={word.id} word={word} index={i} {...props} />
      ))}
    </div>
  );
}
