
import React from 'react';

interface CommunityChoiceModalProps {
  onClose: () => void;
  onRegisterSelect: () => void;
  onLoginSelect: () => void;
}

const CommunityChoiceModal: React.FC<CommunityChoiceModalProps> = ({ onClose, onRegisterSelect, onLoginSelect }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Community Hub</h2>
            <p className="text-gray-400 text-sm font-medium">Welcome to the TaiHub platform.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onLoginSelect}
            className="w-full p-6 bg-blue-50 hover:bg-blue-100 border-2 border-transparent hover:border-blue-200 rounded-3xl transition-all text-left flex items-center gap-5 group"
          >
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-blue-900">Member Sign In</h3>
              <p className="text-sm font-medium text-blue-600/70 italic">Access your existing account</p>
            </div>
          </button>

          <button 
            onClick={onRegisterSelect}
            className="w-full p-6 bg-emerald-50 hover:bg-emerald-100 border-2 border-transparent hover:border-emerald-200 rounded-3xl transition-all text-left flex items-center gap-5 group"
          >
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-900">New Registration</h3>
              <p className="text-sm font-medium text-emerald-600/70 italic">Join our community hub</p>
            </div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Secure & Private Access</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-gray-900 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityChoiceModal;
