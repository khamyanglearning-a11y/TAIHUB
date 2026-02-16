
import React from 'react';
import { GalleryImage, User } from '../types';

interface GallerySectionProps {
  images: GalleryImage[];
  user: User | null;
  onAddClick: () => void;
  onDeleteClick: (id: string) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images, user, onAddClick, onDeleteClick }) => {
  const canManage = user?.role === 'owner' || user?.permissions?.gallery;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cultural Gallery</h2>
          <p className="text-gray-500 font-medium">Capturing the beauty of Tai Khamyang traditions.</p>
        </div>
        {canManage && (
          <button 
            onClick={onAddClick}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Add Photo
          </button>
        )}
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-inner">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-gray-400 text-xl font-bold">No photos yet.</p>
          <p className="text-gray-300 text-sm mt-1">Staff can start adding photos to this collection.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image) => (
            <div key={image.id} className="relative group break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500">
              <img 
                src={image.url} 
                alt={image.caption} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-white font-bold text-lg leading-tight mb-2">{image.caption}</p>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">By {image.addedBy}</span>
                   {canManage && (
                     <button 
                      onClick={() => onDeleteClick(image.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-lg transition-all backdrop-blur-md"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GallerySection;
