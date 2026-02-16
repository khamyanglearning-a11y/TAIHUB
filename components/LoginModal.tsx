
import React, { useState, useEffect } from 'react';
import { generateSmsMessage } from '../services/geminiService';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (phoneNumber: string, otp: string) => void;
  expectedOtp: string | null;
  onOtpGenerated: (otp: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin, expectedOtp, onOtpGenerated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpEntry, setOtpEntry] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSending, setIsSending] = useState(false);
  const [smsNotification, setSmsNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    
    setIsSending(true);
    
    // 1. Generate a random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    onOtpGenerated(newOtp);

    // 2. Use Gemini to generate a realistic SMS message
    const message = await generateSmsMessage(newOtp);

    // 3. Simulate network delay
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
      
      // 4. Show the "Realistic" SMS Notification
      setSmsNotification({ show: true, message });
      
      // Auto-hide notification after 8 seconds
      setTimeout(() => {
        setSmsNotification(prev => ({ ...prev, show: false }));
      }, 8000);
    }, 1500);
  };

  const handleVerify = () => {
    if (otpEntry.length !== 6) {
      alert('Please enter a 6-digit OTP.');
      return;
    }
    onLogin(phoneNumber, otpEntry);
  };

  return (
    <>
      {/* REALISTIC SMS NOTIFICATION BUBBLE */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm transition-all duration-700 transform ${smsNotification.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-black/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Messages • Now</span>
              <button onClick={() => setSmsNotification({ ...smsNotification, show: false })} className="text-gray-500 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm font-medium leading-tight">{smsNotification.message}</p>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Access Panel</h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              {step === 'phone' ? 'Enter your phone to receive a code' : 'Code sent to your device'}
            </p>
          </div>

          <div className="space-y-6">
            {step === 'phone' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold transition-colors group-focus-within:text-blue-500">+91</span>
                  <input
                    type="tel"
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-xl font-bold tracking-widest shadow-sm"
                    placeholder="0000000000"
                    value={phoneNumber}
                    autoFocus
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Verification Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all text-center text-3xl font-black tracking-[0.4em] shadow-sm"
                  placeholder="------"
                  value={otpEntry}
                  autoFocus
                  onChange={(e) => setOtpEntry(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
            )}
            
            <div className="pt-4 flex flex-col gap-4">
              <button 
                onClick={step === 'phone' ? handleSendOtp : handleVerify}
                disabled={isSending}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  step === 'phone' ? 'Send OTP' : 'Login Securely'
                )}
              </button>
              
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white text-gray-400 rounded-2xl font-bold hover:text-gray-600 transition-colors text-sm"
              >
                Cancel Access
              </button>
            </div>
            
            <div className="mt-6 flex items-center gap-2 justify-center opacity-40">
              <div className="h-[1px] bg-gray-300 flex-1"></div>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Secure Protocol v2.0</span>
              <div className="h-[1px] bg-gray-300 flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
