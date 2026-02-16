
import React, { useState } from 'react';

interface GalleryFormModalProps {
  onClose: () => void;
  onSubmit: (data: { url: string; caption: string }) => void;
}

const GalleryFormModal: React.FC<GalleryFormModalProps> = ({ onClose, onSubmit }) => {
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('');
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
      if (!file.type.startsWith('image/')) {
        alert("Only image files are allowed.");
        return;
      }
      if (file.size > 3 * 1024 * 1024) { // 3MB limit
        alert("Image size exceeds 3MB limit.");
        return;
      }
      setIsUploading(true);
      try {
        const base64 = await toBase64(file);
        setUrl(base64);
      } catch (err) {
        alert("Failed to process image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!url || !caption) {
      alert("Please upload an image and provide a caption.");
      return;
    }
    onSubmit({ url, caption });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add Photo</h2>
            <p className="text-gray-400 text-sm font-medium">Share a moment with the community.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Photo Caption</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-800 shadow-sm"
              placeholder="e.g. Traditional Bihu Celebration"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Image</label>
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed transition-all overflow-hidden ${url ? 'border-emerald-200' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
                {isUploading ? (
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                ) : url ? (
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-sm font-bold text-gray-500">Tap to Upload Image</span>
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
              Add to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryFormModal;
