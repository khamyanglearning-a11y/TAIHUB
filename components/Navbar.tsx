
import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  activeTab: 'dictionary' | 'library' | 'gallery' | 'songs' | 'videos' | 'dashboard';
  onTabChange: (tab: 'dictionary' | 'library' | 'gallery' | 'songs' | 'videos' | 'dashboard') => void;
  onLoginClick: (type: 'staff' | 'developer') => void;
  onLogout: () => void;
  onSyncClick: () => void;
  onMessagesClick: () => void;
  isSyncing: boolean;
  isOnline: boolean;
  unreadCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  activeTab, 
  onTabChange, 
  onLogout, 
  onLoginClick,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const allTabs: { id: typeof activeTab, label: string, icon: string, permissionKey?: string }[] = [
    { id: 'dictionary', label: 'Dictionary', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13', permissionKey: 'dictionary' },
    { id: 'library', label: 'Library', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4', permissionKey: 'library' },
    { id: 'gallery', label: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16', permissionKey: 'gallery' },
    { id: 'videos', label: 'TV', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764', permissionKey: 'videos' },
    { id: 'songs', label: 'Music', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2', permissionKey: 'songs' },
    { id: 'dashboard', label: 'Portal', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066' }
  ];

  const visibleTabs = allTabs.filter(t => {
    if (user?.role === 'owner') return true;
    if (!user) return t.id !== 'dashboard';
    
    // Staff logic
    if (user.role === 'admin') {
      if (t.id === 'dashboard') return true;
      if (t.permissionKey) return !!(user.permissions as any)[t.permissionKey];
    }
    return t.id !== 'dashboard';
  });

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-all px-4 sm:px-6">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-90"
          >
            <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('dictionary')}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 rotate-3">T</div>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">TaiHub</span>
          </div>
          
          <div className="hidden lg:flex items-center bg-gray-50/50 dark:bg-gray-800/50 p-1 rounded-2xl ml-4">
            {visibleTabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                {tab.id === 'dashboard' ? (user?.role === 'owner' ? 'Developer Hub' : 'Staff Portal') : tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Professional Theme Toggle */}
          <button 
            onClick={onToggleDarkMode}
            className="p-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl transition-all shadow-inner border border-transparent hover:border-gray-200 dark:hover:border-gray-600 active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{user.role === 'owner' ? 'Lead Developer' : 'Official Staff'}</span>
                <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{user.name}</span>
              </div>
              <button onClick={onLogout} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:text-gray-400 rounded-xl text-xs font-black transition-all">Logout</button>
            </div>
          ) : (
            <button onClick={() => onLoginClick('staff')} className="px-5 py-2.5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl text-xs font-black hover:bg-black dark:hover:bg-gray-200 transition-all shadow-xl shadow-gray-200 dark:shadow-none active:scale-95">Staff Access</button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-2xl p-4 lg:hidden animate-in slide-in-from-top duration-300 space-y-2">
          {visibleTabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => { onTabChange(tab.id); setIsMenuOpen(false); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon} /></svg>
              {tab.id === 'dashboard' ? (user?.role === 'owner' ? 'Developer Hub' : 'Staff Portal') : tab.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;