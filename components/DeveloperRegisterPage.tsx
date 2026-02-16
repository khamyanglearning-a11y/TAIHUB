
import React, { useState } from 'react';

interface DeveloperRegisterPageProps {
  onSetup: (phone: string, pass: string, name: string) => void;
}

const DeveloperRegisterPage: React.FC<DeveloperRegisterPageProps> = ({ onSetup }) => {
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10 || pass.length < 4 || !name) {
      alert("Complete all fields. Phone must be 10 digits.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSetup(phone, pass, name);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      
      <div className="max-w-md w-full bg-white rounded-[3.5rem] p-10 md:p-12 shadow-2xl relative z-10 animate-in zoom-in fade-in duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-6 font-black text-4xl">D</div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Developer Initiation</h1>
          <p className="text-gray-400 font-medium text-sm mt-2">One-time setup for platform owner credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold transition-all" 
              placeholder="e.g. Head Developer" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Permanent Mobile No.</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">+91</span>
              <input 
                type="tel" 
                required 
                value={phone} 
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold tracking-widest transition-all" 
                placeholder="0000000000" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Root Password</label>
            <input 
              type="password" 
              required 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-bold transition-all" 
              placeholder="Minimum 4 characters" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-6 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : 'Initialize System'}
          </button>
        </form>
        
        <p className="text-[9px] text-center font-black text-gray-300 uppercase tracking-[0.3em] mt-10">TaiHub Core v3.0 • Encrypted Vault</p>
      </div>
    </div>
  );
};

export default DeveloperRegisterPage;
