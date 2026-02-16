
import React from 'react';

interface PublicStatsHeaderProps {
  stats: {
    words: number;
    books: number;
    photos: number;
    songs: number;
    videos: number;
  };
}

const PublicStatsHeader: React.FC<PublicStatsHeaderProps> = ({ stats }) => {
  const statItems = [
    { label: "Words", value: stats.words, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Books", value: stats.books, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Photos", value: stats.photos, icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Songs", value: stats.songs, icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Videos", value: stats.videos, icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "text-red-600", bg: "bg-red-50" }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {statItems.map((item, idx) => (
        <div 
          key={idx} 
          className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 group"
        >
          <div className={`w-8 h-8 ${item.bg} ${item.color} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900 leading-none">{item.value}</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicStatsHeader;
