
import React, { useState, useEffect } from 'react';
import { Word, User, Admin, Book, PublicUser, GalleryImage, Song, Video, StudentRequest } from './types';
import { INITIAL_WORDS } from './constants';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import WordList from './components/WordList';
import WordFormModal from './components/WordFormModal';
import AdminPanel from './components/AdminPanel';
import SignInPage from './components/SignInPage';
import BookSection from './components/BookSection';
import BookFormModal from './components/BookFormModal';
import GallerySection from './components/GallerySection';
import GalleryFormModal from './components/GalleryFormModal';
import SongSection from './components/SongSection';
import SongFormModal from './components/SongFormModal';
import VideoSection from './components/VideoSection';
import VideoFormModal from './components/VideoFormModal';
import PublicStatsHeader from './components/PublicStatsHeader';
import PronunciationPracticeModal from './components/PronunciationPracticeModal';
import DeveloperRegisterPage from './components/DeveloperRegisterPage';
import { db } from './services/supabaseService';
import { generateWordImage } from './services/geminiService';

const App: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<PublicUser[]>([]);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]); 
  
  const [devConfig, setDevConfig] = useState<{ phone: string, password: string, name: string } | null>(null);
  const [isDevChecking, setIsDevChecking] = useState(true);

  const [activeTab, setActiveTab] = useState<'dictionary' | 'library' | 'gallery' | 'songs' | 'videos' | 'dashboard'>('dictionary');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginIntent, setLoginIntent] = useState<'staff' | 'developer'>('developer');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [practiceWord, setPracticeWord] = useState<Word | null>(null);
  const [editingWord, setEditingWord] = useState<Word | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('taihub_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taihub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taihub_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const loadCoreData = async () => {
      if (!isOnline) return;
      setIsSyncing(true);
      try {
        const [devAuth, cloudWords, cloudBooks, cloudGallery, cloudSongs, cloudVideos, cloudUsers, cloudRequests, cloudStaff] = await Promise.all([
          db.devAuth.get(),
          db.words.fetchAll(),
          db.books.fetchAll(),
          db.gallery.fetchAll(),
          db.songs.fetchAll(),
          db.videos.fetchAll(),
          db.users.fetchAll(),
          db.studentRequests.fetchAll(),
          db.staff.fetchAll()
        ]);
        setDevConfig(devAuth);
        setWords(cloudWords.length > 0 ? cloudWords : INITIAL_WORDS);
        setBooks(cloudBooks);
        setGallery(cloudGallery);
        setSongs(cloudSongs);
        setVideos(cloudVideos);
        setRegisteredUsers(cloudUsers);
        setStudentRequests(cloudRequests);
        setAdmins(cloudStaff);
      } catch (err) {
        console.error("Cloud load failed:", err);
      } finally {
        setIsSyncing(false);
        setIsDevChecking(false);
      }
    };
    loadCoreData();
  }, [isOnline]);

  useEffect(() => {
    const savedSession = localStorage.getItem('dictionary_current_session');
    if (savedSession) {
      try { setCurrentUser(JSON.parse(savedSession)); } catch (e) { setCurrentUser(null); }
    }
  }, []);

  useEffect(() => {
    if (currentUser) localStorage.setItem('dictionary_current_session', JSON.stringify(currentUser));
    else localStorage.removeItem('dictionary_current_session');
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('dictionary_current_session');
    setCurrentUser(null);
    setIsLogoutModalOpen(false);
    setActiveTab('dictionary');
  };

  const handleLoginSuccess = (p: string, pass: string) => {
    const cleanPhone = p.replace(/\D/g, '');
    
    // Developer login logic
    if (devConfig && cleanPhone.endsWith(devConfig.phone.slice(-10)) && pass === devConfig.password) {
      setCurrentUser({ id: cleanPhone, username: cleanPhone, name: devConfig.name, role: 'owner', permissions: { dictionary: true, library: true, gallery: true, songs: true, videos: true, exams: true } });
      setActiveTab('dashboard');
      setIsLoggingIn(false);
      return;
    }

    // Staff login logic
    const staff = admins.find(a => a.phone.endsWith(cleanPhone.slice(-10)));
    if (staff && staff.password === pass) { 
      setCurrentUser({ id: cleanPhone, username: cleanPhone, name: staff.name, role: 'admin', permissions: staff.permissions }); 
      setActiveTab('dashboard'); 
      setIsLoggingIn(false);
    } else {
      alert("Invalid Credentials. Please check phone and password.");
    }
  };

  const handleDevSetup = async (phone: string, pass: string, name: string) => {
    try {
      await db.devAuth.setup(phone, pass, name);
      setDevConfig({ phone, password: pass, name });
    } catch (e) {
      alert("Failed to setup Developer credentials.");
    }
  };

  const handleUpdateDevSecurity = async (phone: string, pass: string) => {
    if (!devConfig) return;
    try {
      await db.devAuth.setup(phone, pass, devConfig.name);
      setDevConfig({ ...devConfig, phone, password: pass });
      alert("Developer credentials updated successfully.");
    } catch (e) {
      alert("Update failed.");
    }
  };

  const handleSaveAdmin = async (admin: Admin) => {
    try {
      await db.staff.upsert(admin);
      setAdmins(prev => prev.find(p => p.phone === admin.phone) ? prev.map(p => p.phone === admin.phone ? admin : p) : [...prev, admin]);
    } catch (e) {
      alert("Failed to save staff member.");
    }
  };

  const handleRemoveAdmin = async (phone: string) => {
    try {
      await db.staff.delete(phone);
      setAdmins(prev => prev.filter(a => a.phone !== phone));
    } catch (e) {
      alert("Failed to remove staff member.");
    }
  };

  const handleWordSubmit = async (data: Partial<Word>) => {
    const finalWord = { ...data, id: editingWord?.id || Date.now().toString(), createdAt: editingWord?.createdAt || Date.now(), addedBy: currentUser?.name || 'Owner', category: data.category || 'General' } as Word;
    try { 
      await db.words.upsert(finalWord); 
      setWords(prev => editingWord ? prev.map(w => w.id === finalWord.id ? finalWord : w) : [finalWord, ...prev]); 
      setIsWordModalOpen(false); 
      setEditingWord(undefined); 
    } catch (e) { 
      alert("Save failed."); 
    }
  };

  // Fix: Implemented handleBookSubmit to save new book entries to the database
  const handleBookSubmit = async (data: Partial<Book>) => {
    const finalBook = { 
      ...data, 
      id: Date.now().toString(), 
      createdAt: Date.now(), 
      addedBy: currentUser?.name || 'Staff' 
    } as Book;
    try {
      await db.books.upsert(finalBook);
      setBooks(prev => [finalBook, ...prev]);
      setIsBookModalOpen(false);
    } catch (e) {
      alert("Book upload failed.");
    }
  };

  // Fix: Implemented handleGallerySubmit to save new gallery images to the database
  const handleGallerySubmit = async (data: { url: string; caption: string }) => {
    const finalImage = {
      id: Date.now().toString(),
      url: data.url,
      caption: data.caption,
      addedBy: currentUser?.name || 'Staff',
      createdAt: Date.now()
    } as GalleryImage;
    try {
      await db.gallery.upsert(finalImage);
      setGallery(prev => [finalImage, ...prev]);
      setIsGalleryModalOpen(false);
    } catch (e) {
      alert("Gallery upload failed.");
    }
  };

  // Fix: Implemented handleSongSubmit to save new songs to the database
  const handleSongSubmit = async (data: { title: string; artist: string; audioUrl: string }) => {
    const finalSong = {
      id: Date.now().toString(),
      title: data.title,
      artist: data.artist,
      audioUrl: data.audioUrl,
      addedBy: currentUser?.name || 'Staff',
      createdAt: Date.now()
    } as Song;
    try {
      await db.songs.upsert(finalSong);
      setSongs(prev => [finalSong, ...prev]);
      setIsSongModalOpen(false);
    } catch (e) {
      alert("Song upload failed.");
    }
  };

  // Fix: Implemented handleVideoSubmit to save new YouTube videos to the database
  const handleVideoSubmit = async (data: { title: string; youtubeUrl: string }) => {
    const finalVideo = {
      id: Date.now().toString(),
      title: data.title,
      youtubeUrl: data.youtubeUrl,
      addedBy: currentUser?.name || 'Staff',
      createdAt: Date.now()
    } as Video;
    try {
      await db.videos.upsert(finalVideo);
      setVideos(prev => [finalVideo, ...prev]);
      setIsVideoModalOpen(false);
    } catch (e) {
      alert("Video link failed.");
    }
  };

  const handleGenerateImage = async (wordId: string) => {
    const wordObj = words.find(w => w.id === wordId);
    if (!wordObj) return;
    try {
      const imageUrl = await generateWordImage({ english: wordObj.english, assamese: wordObj.assamese, tai: wordObj.taiKhamyang, category: wordObj.category });
      if (imageUrl) {
        const updatedWord = { ...wordObj, imageUrl };
        await db.words.upsert(updatedWord);
        setWords(prev => prev.map(w => w.id === wordId ? updatedWord : w));
      } else alert("AI failed to paint.");
    } catch (error) { alert("Visual AI error."); }
  };

  if (isDevChecking) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!devConfig) {
    return <DeveloperRegisterPage onSetup={handleDevSetup} />;
  }

  const canEditDictionary = currentUser?.role === 'owner' || !!currentUser?.permissions?.dictionary;

  return (
    <div className="min-h-screen pb-12 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar user={currentUser} activeTab={activeTab} onTabChange={setActiveTab} onLoginClick={(i) => { setLoginIntent(i); setIsLoggingIn(true); }} onLogout={() => setIsLogoutModalOpen(true)} onSyncClick={() => {}} onMessagesClick={() => {}} isSyncing={isSyncing} isOnline={isOnline} unreadCount={0} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />

      {isLoggingIn && <SignInPage onClose={() => setIsLoggingIn(false)} onLogin={handleLoginSuccess} intent={loginIntent} />}

      <main className="max-w-6xl mx-auto px-4 mt-10">
        {activeTab === 'dashboard' && currentUser && (
          <AdminPanel user={currentUser} admins={admins} words={words} books={books} photos={gallery} songs={songs} videos={videos} registeredUsers={registeredUsers} stats={{ words: words.length, books: books.length, photos: gallery.length, songs: songs.length, videos: videos.length }} onSaveAdmin={handleSaveAdmin} onRemoveAdmin={handleRemoveAdmin} onAddWord={() => setIsWordModalOpen(true)} onDeleteWord={(id) => { db.words.delete(id); setWords(prev => prev.filter(w => w.id !== id)); }} onAddBook={() => setIsBookModalOpen(true)} onDeleteBook={(id) => { db.books.delete(id); setBooks(prev => prev.filter(b => b.id !== id)); }} onAddPhoto={() => setIsGalleryModalOpen(true)} onDeletePhoto={(id) => { db.gallery.delete(id); setGallery(prev => prev.filter(g => g.id !== id)); }} onAddSong={() => setIsSongModalOpen(true)} onDeleteSong={(id) => { db.songs.delete(id); setSongs(prev => prev.filter(s => s.id !== id)); }} onAddVideo={() => setIsVideoModalOpen(true)} onDeleteVideo={(id) => { db.videos.delete(id); setVideos(prev => prev.filter(v => v.id !== id)); }} onUpdateDevCredentials={handleUpdateDevSecurity} currentDevPhone={devConfig.phone} />
        )}

        {activeTab === 'dictionary' && (
          <>
            <PublicStatsHeader stats={{ words: words.length, books: books.length, photos: gallery.length, songs: songs.length, videos: videos.length }} />
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <WordList words={words.filter(w => w.english.toLowerCase().includes(searchQuery.toLowerCase()) || w.assamese.includes(searchQuery))} canEdit={canEditDictionary} canDelete={currentUser?.role === 'owner'} onEdit={(w) => {setEditingWord(w); setIsWordModalOpen(true);}} onDelete={(id) => { db.words.delete(id); setWords(prev => prev.filter(w => w.id !== id)); }} onGenerateImage={handleGenerateImage} onPracticeSpeech={setPracticeWord} isOnline={isOnline} />
          </>
        )}

        {activeTab === 'library' && <BookSection books={books} user={currentUser} onAddClick={() => setIsBookModalOpen(true)} onEditClick={() => {}} onDeleteClick={(id) => { db.books.delete(id); setBooks(prev => prev.filter(b => b.id !== id)); }} />}
        {activeTab === 'gallery' && <GallerySection images={gallery} user={currentUser} onAddClick={() => setIsGalleryModalOpen(true)} onDeleteClick={(id) => { db.gallery.delete(id); setGallery(prev => prev.filter(i => i.id !== id)); }} />}
        {activeTab === 'videos' && <VideoSection videos={videos} user={currentUser} onAddClick={() => setIsVideoModalOpen(true)} onDeleteClick={(id) => { db.videos.delete(id); setVideos(prev => prev.filter(v => v.id !== id)); }} />}
        {activeTab === 'songs' && <SongSection songs={songs} user={currentUser} onAddClick={() => setIsSongModalOpen(true)} onDeleteClick={(id) => { db.songs.delete(id); setSongs(prev => prev.filter(s => s.id !== id)); }} />}
      </main>

      {isLogoutModalOpen && <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"><div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-sm shadow-2xl p-10 text-center"><h2 className="text-3xl font-black mb-10 dark:text-white">Sign Out?</h2><div className="space-y-3"><button onClick={handleLogout} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black">Yes, Logout</button><button onClick={() => setIsLogoutModalOpen(false)} className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black">Cancel</button></div></div></div>}
      {isWordModalOpen && <WordFormModal onClose={() => { setIsWordModalOpen(false); setEditingWord(undefined); }} onSubmit={handleWordSubmit} canDelete={currentUser?.role === 'owner' || false} existingWords={words} isOnline={isOnline} initialData={editingWord} />}
      {isBookModalOpen && <BookFormModal onClose={() => setIsBookModalOpen(false)} onSubmit={handleBookSubmit} />}
      {isGalleryModalOpen && <GalleryFormModal onClose={() => setIsGalleryModalOpen(false)} onSubmit={handleGallerySubmit} />}
      {isSongModalOpen && <SongFormModal onClose={() => setIsSongModalOpen(false)} onSubmit={handleSongSubmit} />}
      {isVideoModalOpen && <VideoFormModal onClose={() => setIsVideoModalOpen(false)} onSubmit={handleVideoSubmit} />}
      {practiceWord && <PronunciationPracticeModal word={practiceWord} onClose={() => setPracticeWord(null)} />}
    </div>
  );
};

export default App;
