
import React from 'react';
import { PublicUser } from '../types';

interface UserDirectoryModalProps {
  users: PublicUser[];
  onClose: () => void;
}

const UserDirectoryModal: React.FC<UserDirectoryModalProps> = ({ users, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registered Users</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Total Community: {users.length}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 font-bold">No users registered yet.</p>
            </div>
          ) : (
            users.map(user => (
              <div key={user.id} className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-widest">Phone</span>
                    <span className="text-sm font-bold text-gray-600">+91 {user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest">Address</span>
                    <span className="text-sm text-gray-500 font-medium">{user.address}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-black text-gray-300 uppercase block">Registered on</span>
                  <span className="text-xs font-bold text-gray-400">{new Date(user.registeredAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDirectoryModal;
