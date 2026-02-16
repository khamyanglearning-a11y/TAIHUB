
import React from 'react';

interface StaffChoiceModalProps {
  onClose: () => void;
  onStaffSelect: () => void;
  onDeveloperSelect: () => void;
}

const StaffChoiceModal: React.FC<StaffChoiceModalProps> = ({ onClose, onStaffSelect, onDeveloperSelect }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-8 transform transition-all animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Administrative Access</h2>
            <p className="text-gray-400 text-sm font-medium">Please select your authorization level.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onStaffSelect}
            className="w-full p-6 bg-blue-50 hover:bg-blue-100 border-2 border-transparent hover:border-blue-200 rounded-3xl transition-all text-left flex items-center gap-5 group"
          >
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-blue-900">Staff Member</h3>
              <p className="text-sm font-medium text-blue-600/70 italic">Administrator portal access</p>
            </div>
          </button>

          <button 
            onClick={onDeveloperSelect}
            className="w-full p-6 bg-indigo-50 hover:bg-indigo-100 border-2 border-transparent hover:border-indigo-200 rounded-3xl transition-all text-left flex items-center gap-5 group"
          >
            <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-indigo-900">Lead Developer</h3>
              <p className="text-sm font-medium text-indigo-600/70 italic">Full platform control access</p>
            </div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Encrypted Authorization Required</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-gray-900 font-bold transition-colors"
          >
            Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffChoiceModal;
