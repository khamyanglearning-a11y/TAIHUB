
import React, { useState } from 'react';

interface VideoFormModalProps {
  onClose: () => void;
  onSubmit: (data: { title: string; youtubeUrl: string }) => void;
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSave = () => {
    if (!title.trim() || !url.trim()) {
      alert("Please enter both a title and a YouTube URL.");
      return;
    }
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      alert("Please provide a valid YouTube link.");
      return;
    }
    onSubmit({ title: title.trim(), youtubeUrl: url.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Feature Video</h2>
            <p className="text-gray-400 text-sm font-medium">Add a YouTube link to the community gallery.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Video Title</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-red-500 focus:bg-white transition-all font-bold text-gray-800 shadow-sm"
              placeholder="e.g. Tai Khamyang New Year Celebration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">YouTube URL</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-red-500 focus:bg-white transition-all font-bold text-gray-800 shadow-sm"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
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
              className="flex-2 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-red-100 transition-all active:scale-95"
            >
              Add Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoFormModal;
