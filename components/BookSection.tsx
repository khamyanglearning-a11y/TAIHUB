
import React from 'react';
import { Book, User } from '../types';

interface BookSectionProps {
  books: Book[];
  user: User | null;
  onAddClick: () => void;
  onEditClick: (book: Book) => void;
  onDeleteClick: (id: string) => void;
}

const BookSection: React.FC<BookSectionProps> = ({ books, user, onAddClick, onEditClick, onDeleteClick }) => {
  const canUpload = user?.role === 'owner' || user?.permissions?.library;
  const canDelete = user?.role === 'owner' || user?.permissions?.library;

  const openPdf = (base64: string) => {
    try {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (e) {
      console.error("PDF preview failed", e);
      alert("Failed to open PDF. It might be corrupted or too large.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tai Library</h2>
          <p className="text-gray-500 font-medium">Read books, research papers, and cultural documents.</p>
        </div>
        {canUpload && (
          <button 
            onClick={onAddClick}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Upload Book PDF
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 shadow-inner">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <p className="text-gray-400 text-xl font-bold">The library is currently empty.</p>
          <p className="text-gray-300 text-sm mt-1">Staff members can start adding books here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div key={book.id} className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
              <div className="relative aspect-[3/4] bg-gray-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center border border-gray-100 shadow-inner group-hover:bg-blue-50 transition-colors">
                <svg className="w-20 h-20 text-gray-200 group-hover:text-blue-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900 mb-1 line-clamp-2 leading-tight">{book.title}</h3>
                <p className="text-blue-600 font-bold text-sm mb-3">by {book.author}</p>
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-6">{book.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openPdf(book.pdfUrl)}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-black text-sm hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  Read PDF
                </button>
                {canUpload && (
                   <button 
                   onClick={() => onEditClick(book)}
                   className="p-4 text-gray-500 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-gray-100"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                 </button>
                )}
                {canDelete && (
                  <button 
                    onClick={() => onDeleteClick(book.id)}
                    className="p-4 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookSection;
