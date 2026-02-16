
import React, { useState } from 'react';

interface RegisterModalProps {
  onClose: () => void;
  onRegister: (name: string, address: string, phone: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 2 || address.length < 5 || phone.length !== 10) {
      alert("Please fill all fields correctly. Phone must be 10 digits.");
      return;
    }
    onRegister(name, address, phone);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Registration</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Join the TaiHub community today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-800"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Complete Address</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-800"
              placeholder="e.g. Village, District, State"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold transition-colors group-focus-within:text-blue-500">+91</span>
              <input
                type="tel"
                required
                className="w-full pl-14 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-800 tracking-widest"
                placeholder="0000000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              Complete Registration
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
