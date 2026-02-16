
import React, { useState, useRef } from 'react';
import { User, PublicUser } from '../types';

interface ProfileSectionProps {
  currentUser: User;
  registeredUsers: PublicUser[];
  onUpdateProfile: (updatedData: Partial<PublicUser>) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ currentUser, registeredUsers, onUpdateProfile }) => {
  const userDetails = registeredUsers.find(u => u.id === currentUser.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userDetails?.name || currentUser.name);
  const [editPhone, setEditPhone] = useState(userDetails?.phone || currentUser.id);
  const [editAddress, setEditAddress] = useState(userDetails?.address || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Please use a photo under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateProfile({ avatarUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editName.length < 2) return alert("Name is too short.");
    if (editPhone.length !== 10) return alert("Phone must be 10 digits.");
    
    onUpdateProfile({
      name: editName,
      phone: editPhone,
      address: editAddress
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Community Profile</h2>
        <p className="text-gray-500 font-medium">Manage your personal identity on TaiHub.</p>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col items-center relative overflow-hidden">
        {/* Profile Backdrop Decor */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-50 to-transparent"></div>

        {/* Photo Section */}
        <div className="relative z-10 mb-8">
          <div 
            onClick={handlePhotoClick}
            className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl border-4 border-white transition-all overflow-hidden ${
              isEditing ? 'cursor-pointer hover:brightness-90 hover:scale-105' : ''
            } ${userDetails?.avatarUrl ? 'bg-transparent' : 'bg-blue-600 text-white'}`}
          >
            {userDetails?.avatarUrl ? (
              <img src={userDetails.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(editName)
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Form Content */}
        <div className="w-full space-y-6 relative z-10">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Edit Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-blue-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-gray-800 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Edit Phone Number</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">+91</span>
                   <input 
                    type="tel" 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-blue-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-gray-800 tracking-widest transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Edit Address</label>
                <input 
                  type="text" 
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-blue-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-gray-800 transition-all"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl font-black transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-3xl font-black text-gray-900 leading-tight">{userDetails?.name || currentUser.name}</h3>
                <span className="inline-block mt-2 px-4 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                  Verified Member
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Mobile</span>
                  <p className="font-bold text-gray-700">+91 {userDetails?.phone || currentUser.id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Joined</span>
                  <p className="font-bold text-gray-700">
                    {userDetails ? new Date(userDetails.registeredAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-left">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Registered Address</span>
                <p className="text-sm font-medium text-gray-600 italic leading-relaxed">
                  "{userDetails?.address || 'Address not set'}"
                </p>
              </div>

              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit My Profile
              </button>
            </div>
          )}
        </div>
      </div>
      
      {!isEditing && (
        <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem] flex items-center gap-6">
          <div className="w-16 h-16 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0014 12.11V11m-4 1V8c0-2.21 1.79-4 4-4s4 1.79 4 4v4m-5 8h2a2 2 0 002-2v-3a2 2 0 00-2-2h-3l-3 4z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-black text-blue-900">Cultural Preservation</h4>
            <p className="text-blue-700/70 font-medium text-sm leading-relaxed">
              Your profile is your digital heritage footprint. By contributing to TaiHub, you ensure the Tai Khamyang culture thrives in the digital era.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
