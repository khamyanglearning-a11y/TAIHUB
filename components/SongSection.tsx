
import React, { useState, useRef } from 'react';
import { Song, User } from '../types';

interface SongSectionProps {
  songs: Song[];
  user: User | null;
  onAddClick: () => void;
  onDeleteClick: (id: string) => void;
}

const SongSection: React.FC<SongSectionProps> = ({ songs, user, onAddClick, onDeleteClick }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canManage = user?.role === 'owner' || user?.permissions?.songs;

  const handlePlayPause = (song: Song) => {
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.play();
        setPlayingId(song.id);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cultural Music</h2>
          <p className="text-gray-500 font-medium">Listen to traditional songs and community voices.</p>
        </div>
        {canManage && (
          <button 
            onClick={onAddClick}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
            Add New Song
          </button>
        )}
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-inner">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          </div>
          <p className="text-gray-400 text-xl font-bold">No music yet.</p>
          <p className="text-gray-300 text-sm mt-1">Staff can start adding songs to this collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {songs.map((song) => (
            <div key={song.id} className={`group bg-white rounded-[1.5rem] p-5 border-2 transition-all duration-300 flex items-center gap-4 ${playingId === song.id ? 'border-blue-200 shadow-lg shadow-blue-50' : 'border-transparent hover:border-gray-100 shadow-sm'}`}>
              <button 
                onClick={() => handlePlayPause(song)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 ${playingId === song.id ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-900 text-white hover:bg-blue-600'}`}
              >
                {playingId === song.id ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-gray-900 truncate">{song.title}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{song.artist}</p>
              </div>

              {canManage && (
                <button 
                  onClick={() => onDeleteClick(song.id)}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SongSection;
