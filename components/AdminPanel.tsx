
import React, { useState, useMemo, useEffect } from 'react';
import { Admin, AdminPermissions, PublicUser, User, Word, Book, GalleryImage, Song, Video } from '../types';

interface AdminPanelProps {
  user: User;
  admins: Admin[];
  words: Word[];
  books: Book[];
  photos: GalleryImage[];
  songs: Song[];
  videos: Video[];
  registeredUsers: PublicUser[];
  onSaveAdmin: (admin: Admin) => void;
  onRemoveAdmin: (phoneNumber: string) => void;
  onAddWord: () => void;
  onDeleteWord: (id: string) => void;
  onAddBook: () => void;
  onAddPhoto: () => void;
  onAddSong: () => void;
  onAddVideo: () => void;
  onDeleteBook: (id: string) => void;
  onDeletePhoto: (id: string) => void;
  onDeleteSong: (id: string) => void;
  onDeleteVideo: (id: string) => void;
  onUpdateDevCredentials: (phone: string, pass: string) => void;
  currentDevPhone: string;
  stats: {
    words: number;
    books: number;
    photos: number;
    songs: number;
    videos: number;
  };
}

const PERMISSION_LABELS: Record<keyof AdminPermissions, { label: string, icon: string, color: string }> = {
  dictionary: { label: 'Dictionary', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13', color: 'blue' },
  library: { label: 'Library', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4', color: 'amber' },
  gallery: { label: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16', color: 'indigo' },
  songs: { label: 'Music', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2', color: 'emerald' },
  videos: { label: 'Videos', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764', color: 'red' },
  exams: { label: 'Exams', icon: 'M9 5H7a2 2 0 00-2 2v12', color: 'orange' }
};

type ContentType = 'words' | 'books' | 'photos' | 'songs' | 'videos';

export default function AdminPanel(props: AdminPanelProps) {
  const { user, admins, words, books, photos, songs, videos, onSaveAdmin, onRemoveAdmin, stats, onUpdateDevCredentials, currentDevPhone } = props;
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'content' | 'staff' | 'security'>('overview');
  
  const [newDevPhone, setNewDevPhone] = useState(currentDevPhone);
  const [newDevPass, setNewDevPass] = useState('');

  const CONTENT_MAP: Record<ContentType, keyof AdminPermissions> = {
    words: 'dictionary',
    books: 'library',
    photos: 'gallery',
    songs: 'songs',
    videos: 'videos'
  };

  const availableContentTypes = useMemo(() => {
    const list: ContentType[] = ['words', 'books', 'photos', 'songs', 'videos'];
    if (user.role === 'owner') return list;
    return list.filter(type => user.permissions?.[CONTENT_MAP[type]]);
  }, [user]);

  const [contentType, setContentType] = useState<ContentType>(availableContentTypes[0] || 'words');

  useEffect(() => {
    if (!availableContentTypes.includes(contentType) && availableContentTypes.length > 0) {
      setContentType(availableContentTypes[0]);
    }
  }, [availableContentTypes, contentType]);

  const isOwner = user.role === 'owner';

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3">
        <button onClick={() => setActiveSubTab('overview')} className={`p-4 md:px-8 md:py-4 rounded-2xl font-black text-xs md:text-sm transition-all ${activeSubTab === 'overview' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 shadow-sm border border-transparent dark:border-gray-800'}`}>Dashboard</button>
        <button onClick={() => setActiveSubTab('content')} className={`p-4 md:px-8 md:py-4 rounded-2xl font-black text-xs md:text-sm transition-all ${activeSubTab === 'content' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 shadow-sm border border-transparent dark:border-gray-800'}`}>Manage Content</button>
        {isOwner && (
          <>
            <button onClick={() => setActiveSubTab('staff')} className={`p-4 md:px-8 md:py-4 rounded-2xl font-black text-xs md:text-sm transition-all ${activeSubTab === 'staff' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 shadow-sm border border-transparent dark:border-gray-800'}`}>Staff Directory</button>
            <button onClick={() => setActiveSubTab('security')} className={`p-4 md:px-8 md:py-4 rounded-2xl font-black text-xs md:text-sm transition-all ${activeSubTab === 'security' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 shadow-sm border border-transparent dark:border-gray-800'}`}>Security</button>
          </>
        )}
      </div>

      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
             <h3 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-8">Asset Inventory</h3>
             <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                <div><p className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase">Words</p><p className="text-3xl font-black text-gray-900 dark:text-white">{stats.words}</p></div>
                <div><p className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase">Books</p><p className="text-3xl font-black text-gray-900 dark:text-white">{stats.books}</p></div>
                <div><p className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase">Media</p><p className="text-3xl font-black text-gray-900 dark:text-white">{stats.photos + stats.videos}</p></div>
                <div><p className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase">Music</p><p className="text-3xl font-black text-gray-900 dark:text-white">{stats.songs}</p></div>
             </div>
           </div>
           <div className="lg:col-span-2 bg-gray-900 dark:bg-gray-900 rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden flex flex-col justify-center min-h-[250px] border dark:border-gray-800">
             <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
             <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">Portal: {user.name}</h2>
             <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-lg">
               Manage the cultural digital archives. {isOwner ? 'You have full root access to the entire platform.' : 'You have been granted access to specific community modules.'}
             </p>
           </div>
        </div>
      )}

      {activeSubTab === 'content' && (
        <div className="space-y-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableContentTypes.map(type => (
              <button key={type} onClick={() => setContentType(type)} className={`whitespace-nowrap px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${contentType === type ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent dark:border-gray-800'}`}>
                {type === 'words' ? 'Dictionary' : type}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white capitalize">{contentType === 'words' ? 'Dictionary' : contentType} Database</h3>
              <button 
                onClick={() => {
                  if (contentType === 'words') props.onAddWord();
                  if (contentType === 'books') props.onAddBook();
                  if (contentType === 'photos') props.onAddPhoto();
                  if (contentType === 'songs') props.onAddSong();
                  if (contentType === 'videos') props.onAddVideo();
                }} 
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Add {contentType === 'words' ? 'New Word' : contentType.slice(0, -1)}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800"><tr className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest"><th className="px-8 py-5">Entry Details</th><th className="px-8 py-5 text-right">Action</th></tr></thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {contentType === 'words' && words.map(w => (
                      <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-8 py-5"><div className="font-black text-gray-900 dark:text-white">{w.english}</div><div className="text-emerald-600 dark:text-emerald-500 text-xs font-bold">{w.taiKhamyang}</div></td>
                        <td className="px-8 py-5 text-right"><button onClick={() => props.onDeleteWord(w.id)} className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                      </tr>
                    ))}
                    {contentType === 'books' && books.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-8 py-5"><div className="font-black text-gray-900 dark:text-white">{b.title}</div><div className="text-amber-600 dark:text-amber-500 text-xs font-bold">Author: {b.author}</div></td>
                        <td className="px-8 py-5 text-right"><button onClick={() => props.onDeleteBook(b.id)} className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                      </tr>
                    ))}
                    {contentType === 'photos' && photos.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-8 py-5 flex items-center gap-4"><img src={p.url} className="w-12 h-12 rounded-xl object-cover" /><div className="font-black text-gray-900 dark:text-white">{p.caption}</div></td>
                        <td className="px-8 py-5 text-right"><button onClick={() => props.onDeletePhoto(p.id)} className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                      </tr>
                    ))}
                    {contentType === 'songs' && songs.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-8 py-5"><div className="font-black text-gray-900 dark:text-white">{s.title}</div><div className="text-emerald-600 dark:text-emerald-500 text-xs font-bold">{s.artist}</div></td>
                        <td className="px-8 py-5 text-right"><button onClick={() => props.onDeleteSong(s.id)} className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                      </tr>
                    ))}
                    {contentType === 'videos' && videos.map(v => (
                      <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-8 py-5"><div className="font-black text-gray-900 dark:text-white">{v.title}</div><div className="text-red-600 dark:text-red-400 text-[10px] truncate max-w-xs">{v.youtubeUrl}</div></td>
                        <td className="px-8 py-5 text-right"><button onClick={() => props.onDeleteVideo(v.id)} className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'staff' && isOwner && (
        <div className="animate-in slide-in-from-right-4 duration-500">
           <StaffManager admins={admins} onSave={onSaveAdmin} onRemove={onRemoveAdmin} />
        </div>
      )}

      {activeSubTab === 'security' && isOwner && (
        <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-8">
             <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">Credential Management</h3>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Owner Phone</label>
                  <input className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold dark:text-white outline-none border-2 border-transparent focus:border-red-500" value={newDevPhone} onChange={e => setNewDevPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Root Password</label>
                  <input className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold dark:text-white outline-none border-2 border-transparent focus:border-red-500" type="password" value={newDevPass} onChange={e => setNewDevPass(e.target.value)} placeholder="Type new password" />
                </div>
                <button onClick={() => { if(!newDevPass) return alert("Password cannot be empty."); onUpdateDevCredentials(newDevPhone, newDevPass); setNewDevPass(''); }} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-all">Apply Security Updates</button>
             </div>
             
             <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed">Updating these values will change your permanent login credentials across all devices.</p>
           </div>
        </div>
      )}
    </div>
  );
}

const StaffManager: React.FC<{ admins: Admin[], onSave: (a: Admin) => void, onRemove: (p: string) => void }> = ({ admins, onSave, onRemove }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [perms, setPerms] = useState<AdminPermissions>({ dictionary: true, library: false, gallery: false, songs: false, videos: false, exams: false });

  const PERMISSION_KEYS: (keyof AdminPermissions)[] = ['dictionary', 'library', 'gallery', 'songs', 'videos'];

  const handleSaveNew = () => {
    if (!name || phone.length !== 10 || !password) return alert("All fields are mandatory.");
    onSave({ name, phone, password, permissions: perms });
    setName(''); setPhone(''); setPassword(''); setIsAdding(false);
    setPerms({ dictionary: true, library: false, gallery: false, songs: false, videos: false, exams: false });
  };

  const handleTogglePermission = (adminPhone: string, key: keyof AdminPermissions) => {
    const admin = admins.find(a => a.phone === adminPhone);
    if (admin) {
      onSave({ ...admin, permissions: { ...admin.permissions, [key]: !admin.permissions[key] } });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div><h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Staff Directory</h3><p className="text-gray-400 dark:text-gray-500 font-medium text-sm">Control precisely what your team can manage.</p></div>
        <button onClick={() => setIsAdding(!isAdding)} className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95">{isAdding ? 'Close Registration' : 'Appoint New Staff'}</button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3rem] border border-indigo-50 dark:border-indigo-900/30 shadow-2xl animate-in zoom-in duration-300 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Staff Name</label><input className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold dark:text-white outline-none border-2 border-transparent focus:border-indigo-500" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Phone</label><input className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold dark:text-white outline-none border-2 border-transparent focus:border-indigo-500 tracking-widest" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 Digits" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Portal Password</label><input className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl font-bold dark:text-white outline-none border-2 border-transparent focus:border-indigo-500" value={password} onChange={e => setPassword(e.target.value)} placeholder="Secure Key" /></div>
           </div>

           <div className="space-y-4">
             <label className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] block text-center">Module Access Rights</label>
             <div className="flex flex-wrap justify-center gap-2">
               {PERMISSION_KEYS.map(key => (
                 <button key={key} onClick={() => setPerms(prev => ({...prev, [key]: !prev[key]}))} className={`px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${perms[key] ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'}`}>{PERMISSION_LABELS[key].label}</button>
               ))}
             </div>
           </div>

           <button onClick={handleSaveNew} className="w-full py-6 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-black dark:hover:bg-gray-200 transition-all">Register Official Staff</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {admins.map(admin => (
          <div key={admin.phone} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:shadow-2xl dark:hover:shadow-indigo-500/10 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-black text-lg">{admin.name.charAt(0)}</div>
                <div><h4 className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{admin.name}</h4><p className="text-[10px] font-black text-indigo-400 dark:text-indigo-600 uppercase tracking-widest">+91 {admin.phone}</p></div>
              </div>
              <button onClick={() => onRemove(admin.phone)} className="p-2 text-gray-200 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
            
            <div className="space-y-4 relative z-10">
               <div className="h-[1px] bg-gray-50 dark:bg-gray-800 w-full"></div>
               <div className="flex flex-wrap gap-2">
                 {PERMISSION_KEYS.map(key => (
                   <button key={key} onClick={() => handleTogglePermission(admin.phone, key)} className={`px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-tighter transition-all ${admin.permissions[key] ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-700 border border-transparent grayscale'}`}>
                     {PERMISSION_LABELS[key].label}
                   </button>
                 ))}
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:scale-150 transition-all duration-1000"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
