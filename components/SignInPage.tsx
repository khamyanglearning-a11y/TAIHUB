
import React, { useState } from 'react';

interface SignInPageProps {
  onClose: () => void;
  onLogin: (phoneNumber: string, password: string) => void;
  intent: 'staff' | 'developer';
  showSuccess?: boolean;
}

const SignInPage: React.FC<SignInPageProps> = ({ onClose, onLogin, intent, showSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter your password.');
      return;
    }
    
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin(phoneNumber, password);
      setIsAuthenticating(false);
    }, 1000);
  };

  const isDeveloper = intent === 'developer';

  return (
    <div className="fixed inset-0 z-[150] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-10 left-10">
        <button 
          onClick={onClose}
          className="p-3 bg-white hover:bg-gray-100 rounded-full transition-all group shadow-sm border border-gray-100"
        >
          <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
      </div>

      <div className="max-w-sm w-full text-center space-y-8 animate-in fade-in zoom-in duration-500 bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-blue-900/10 border border-gray-100">
        <div>
          <div className={`w-20 h-20 ${isDeveloper ? 'bg-indigo-600 shadow-indigo-200' : 'bg-blue-600 shadow-blue-200'} rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl mx-auto mb-8 rotate-3`}>
            {isDeveloper ? 'D' : 'T'}
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            {isDeveloper ? 'Lead Developer' : 'Staff Portal'}
          </h1>
          <p className="text-gray-500 font-medium mt-2 px-4 leading-relaxed">
            {isDeveloper ? 'Authorized root access required' : 'Enter your staff credentials to manage the platform'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4 text-left">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold transition-colors text-gray-400 group-focus-within:text-blue-500`}>+91</span>
                <input
                  type="tel"
                  required
                  className={`w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white transition-all text-lg font-bold tracking-widest ${isDeveloper ? 'focus:border-indigo-500' : 'focus:border-blue-500'}`}
                  placeholder="0000000000"
                  value={phoneNumber}
                  autoFocus
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white transition-all text-lg font-bold ${isDeveloper ? 'focus:border-indigo-500' : 'focus:border-blue-500'}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isAuthenticating}
            className={`w-full py-5 ${isDeveloper ? 'bg-indigo-900' : 'bg-gray-900'} hover:opacity-90 text-white rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2`}
          >
            {isAuthenticating ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              'Secure Entry'
            )}
          </button>
        </form>

        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-4">
          {isDeveloper ? 'TaiHub Root System' : 'Verified Secure Login'}
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
