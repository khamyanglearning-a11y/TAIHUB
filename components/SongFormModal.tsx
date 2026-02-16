
import React, { useState } from 'react';

interface SongFormModalProps {
  onClose: () => void;
  onSubmit: (data: { title: string; artist: string; audioUrl: string }) => void;
}

const SongFormModal: React.FC<SongFormModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert("Only audio files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size exceeds 5MB limit. Please upload a smaller MP3.");
        return;
      }
      setIsUploading(true);
      try {
        const base64 = await toBase64(file);
        setAudioUrl(base64);
      } catch (err) {
        alert("Failed to process audio file.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!title || !artist || !audioUrl) {
      alert("Please provide Title, Artist, and Upload the Song.");
      return;
    }
    onSubmit({ title, artist, audioUrl });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add Music</h2>
            <p className="text-gray-400 text-sm font-medium">Add a traditional song to the hub.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Song Title</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-800 shadow-sm"
              placeholder="e.g. Traditional Folk Song"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Artist / Singer</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-800 shadow-sm"
              placeholder="e.g. Community Voices"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Audio File (MP3 Max 5MB)</label>
            <div className="relative">
              <input 
                type="file" 
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex flex-col items-center justify-center py-8 rounded-2xl border-2 border-dashed transition-all overflow-hidden ${audioUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
                {isUploading ? (
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                ) : audioUrl ? (
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-emerald-500 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    <span className="text-xs font-black text-emerald-600 uppercase">Ready to Upload</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    <span className="text-sm font-bold text-gray-500">Select MP3 File</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl font-black transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              Upload Song
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongFormModal;
