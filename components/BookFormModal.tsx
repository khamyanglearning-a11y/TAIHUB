
import React, { useState, useEffect } from 'react';
import { Book } from '../types';

interface BookFormModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Book>) => void;
  initialData?: Book;
}

const BookFormModal: React.FC<BookFormModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    description: '',
    pdfUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        description: initialData.description,
        pdfUrl: initialData.pdfUrl
      });
    }
  }, [initialData]);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Only PDF files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size exceeds 5MB limit. Please compress your PDF.");
        return;
      }
      setIsUploading(true);
      try {
        const base64 = await toBase64(file);
        setFormData(prev => ({ ...prev, pdfUrl: base64 }));
      } catch (err) {
        alert("Failed to process file.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.author || !formData.pdfUrl) {
      alert("Title, Author, and PDF file are all required.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {initialData ? 'Edit Book' : 'Add to Library'}
            </h2>
            <p className="text-gray-400 text-sm font-medium">Publish a new PDF book for everyone.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Book Title</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-800 shadow-sm"
              placeholder="e.g. History of Tai Peoples"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Author Name</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-800 shadow-sm"
              placeholder="e.g. Dr. K. Borah"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
            <textarea
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-gray-700 shadow-sm h-32"
              placeholder="Brief summary of the book content..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PDF Document (Max 5MB)</label>
            <div className="relative">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all ${formData.pdfUrl ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
                {isUploading ? (
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                ) : formData.pdfUrl ? (
                  <svg className="w-10 h-10 text-emerald-500 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                ) : (
                  <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                )}
                <span className={`text-sm font-bold ${formData.pdfUrl ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {formData.pdfUrl ? 'PDF Attached Successfully' : 'Select PDF File'}
                </span>
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
              {initialData ? 'Update Book' : 'Confirm Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFormModal;
