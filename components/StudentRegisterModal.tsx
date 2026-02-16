
import React, { useState, useRef } from 'react';
import { StudentRequest } from '../types';

interface StudentRegisterModalProps {
  onClose: () => void;
  onRegister: (data: { name: string, phone: string, password?: string, email: string, address: string, photoUrl: string }) => void;
  studentRequests: StudentRequest[];
  onLoginRequested: () => void;
  ownerPhone?: string;
}

const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({ onClose, onRegister, studentRequests, onLoginRequested, ownerPhone }) => {
  const [viewMode, setViewMode] = useState<'register' | 'checkStatus'>('register');
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [checkPhone, setCheckPhone] = useState('');
  const [checkResult, setCheckResult] = useState<StudentRequest | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert("Photo too large. Please use a passport photo under 1MB.");
        return;
      }
      setIsUploading(true);
      try {
        const base64 = await toBase64(file);
        setPhotoUrl(base64);
      } catch (err) {
        alert("Failed to process photo.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !password || !email || !address || !photoUrl) {
      alert("All fields including password and passport photo are mandatory.");
      return;
    }
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    onRegister({ name, phone, password, email, address, photoUrl });
    setCheckPhone(phone);
    setViewMode('checkStatus');
  };

  const handleCheckStatus = (e: React.FormEvent | null, phoneOverride?: string) => {
    if (e) e.preventDefault();
    const targetPhone = phoneOverride || checkPhone;
    if (targetPhone.length < 10) {
      alert("Please enter a 10-digit phone number.");
      return;
    }

    if (ownerPhone && targetPhone.endsWith(ownerPhone.slice(-10))) {
      setCheckResult({
        id: 'OWNER-STUDENT',
        name: 'Developer Student',
        phone: targetPhone,
        email: 'developer@taihub.com',
        address: 'TaiHub Digital Center',
        photoUrl: 'https://images.unsplash.com/photo-1543734057-7977a45b98a5?q=80&w=200&auto=format&fit=crop',
        status: 'approved',
        requestedAt: Date.now()
      });
      setHasSearched(true);
      return;
    }

    const found = studentRequests.find(r => r.phone.endsWith(targetPhone.slice(-10)));
    setCheckResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[3.5rem] w-full max-w-lg shadow-2xl p-8 my-8 transform transition-all animate-in fade-in zoom-in duration-300">
        
        {viewMode === 'register' ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Academic Admission</h2>
              <p className="text-gray-500 text-sm font-medium mt-1">Join the digital Tai Khamyang learning hall.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col items-center mb-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-32 h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${photoUrl ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'}`}
                >
                  {isUploading ? (
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : photoUrl ? (
                    <img src={photoUrl} alt="Passport" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight">Passport Photo</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl font-bold focus:bg-white focus:border-blue-500 border-2 transition-all outline-none shadow-inner" placeholder="Student Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl font-bold focus:bg-white focus:border-blue-500 border-2 transition-all outline-none tracking-widest shadow-inner" placeholder="10 Digits" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Create Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl font-bold focus:bg-white focus:border-blue-500 border-2 transition-all outline-none shadow-inner" placeholder="Secure Password" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl font-bold focus:bg-white focus:border-blue-500 border-2 transition-all outline-none shadow-inner" placeholder="example@gmail.com" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Complete Address</label>
                <textarea required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl font-medium focus:bg-white focus:border-blue-500 border-2 transition-all outline-none h-20 shadow-inner" placeholder="Address..." />
              </div>

              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95">
                  Submit Admission Request
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setViewMode('checkStatus')}
                  className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-100"
                >
                  Already applied? Check Status
                </button>

                <button type="button" onClick={onClose} className="w-full py-2 text-gray-300 font-bold hover:text-gray-600 transition-colors text-[10px] uppercase tracking-widest">
                  Discard & Close
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Verify Admission</h2>
              <p className="text-gray-500 text-sm font-medium mt-1">Check the progress of your application.</p>
            </div>

            <form onSubmit={handleCheckStatus} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Application Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  value={checkPhone} 
                  onChange={e => setCheckPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                  className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl font-black text-xl text-center focus:bg-white focus:border-emerald-500 border-2 transition-all outline-none tracking-[0.2em]" 
                  placeholder="0000000000" 
                />
              </div>

              <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-gray-200">
                Refresh Status
              </button>

              {hasSearched && (
                <div className="mt-8 p-6 rounded-[2.5rem] border border-gray-100 bg-gray-50 animate-in zoom-in duration-300">
                  {checkResult ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-24 mx-auto rounded-xl overflow-hidden border-4 border-white shadow-lg mb-2">
                        <img src={checkResult.photoUrl} alt="Student" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-gray-900">{checkResult.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">+91 {checkResult.phone}</p>
                      </div>
                      
                      {checkResult.status === 'approved' ? (
                        <div className="space-y-4 pt-2">
                          <div className="bg-emerald-100/50 border border-emerald-200 p-4 rounded-2xl">
                            <p className="text-emerald-700 font-black text-xs uppercase tracking-widest">✅ Status: APPROVED</p>
                          </div>
                          <button 
                            type="button"
                            onClick={onLoginRequested}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95"
                          >
                            Login to Portal
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                          </button>
                        </div>
                      ) : checkResult.status === 'rejected' ? (
                        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                          <p className="text-red-700 font-black text-xs uppercase tracking-widest">❌ Status: REJECTED</p>
                          <p className="text-red-600/70 text-[10px] mt-2 font-medium">Admission was not approved.</p>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                          <div className="flex justify-center mb-3">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                          <p className="text-blue-700 font-black text-xs uppercase tracking-widest">⏳ Status: PENDING</p>
                          <p className="text-blue-600/70 text-[10px] mt-2 font-medium leading-tight">Review in progress by lead developer.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest italic">Application not found.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button 
                  type="button" 
                  onClick={() => setViewMode('register')}
                  className="w-full py-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-blue-600 transition-colors"
                >
                  Return to Form
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRegisterModal;
