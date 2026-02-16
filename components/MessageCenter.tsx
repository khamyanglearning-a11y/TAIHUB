
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PublicUser, Message, User, Word } from '../types';

interface MessageCenterProps {
  currentUser: User;
  users: PublicUser[];
  messages: Message[];
  dictionary: Word[];
  onSendMessage: (receiverId: string, text: string) => void;
  onMarkAsRead: (senderId: string) => void;
  onClose: () => void;
}

const TAI_GREETINGS = [
  { tai: "Yindi kup", en: "Welcome / Thank you" },
  { tai: "Mau sabaidi i?", en: "How are you?" },
  { tai: "Sabaidi", en: "I am fine / Hello" },
  { tai: "Kin khao i mau?", en: "Have you eaten?" },
];

const MessageCenter: React.FC<MessageCenterProps> = ({ currentUser, users, messages, dictionary, onSendMessage, onMarkAsRead, onClose }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [dictSearchQuery, setDictSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showMiniDict, setShowMiniDict] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mark messages as read when a user is selected
  useEffect(() => {
    if (selectedUserId) {
      onMarkAsRead(selectedUserId);
    }
  }, [selectedUserId, messages, onMarkAsRead]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.id !== currentUser.id && 
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }, [users, currentUser.id, userSearchQuery]);

  const userUnreadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    messages.forEach(m => {
      if (m.receiverId === currentUser.id && !m.isRead) {
        counts[m.senderId] = (counts[m.senderId] || 0) + 1;
      }
    });
    return counts;
  }, [messages, currentUser.id]);

  const activeChatMessages = useMemo(() => {
    if (!selectedUserId) return [];
    return messages.filter(m => 
      (m.senderId === currentUser.id && m.receiverId === selectedUserId) ||
      (m.senderId === selectedUserId && m.receiverId === currentUser.id)
    ).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, selectedUserId, currentUser.id]);

  const filteredDict = useMemo(() => {
    if (!dictSearchQuery.trim()) return [];
    return dictionary.filter(w => 
      w.english.toLowerCase().includes(dictSearchQuery.toLowerCase()) ||
      w.taiKhamyang.toLowerCase().includes(dictSearchQuery.toLowerCase())
    ).slice(0, 5);
  }, [dictionary, dictSearchQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatMessages]);

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleSend = (textToSubmit?: string) => {
    const finalMsg = textToSubmit || inputText;
    if (!finalMsg.trim() || !selectedUserId) return;
    onSendMessage(selectedUserId, finalMsg.trim());
    setInputText('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-none md:rounded-[2.5rem] w-full max-w-6xl h-full md:h-[85vh] shadow-2xl flex overflow-hidden border border-gray-100 animate-in zoom-in duration-300">
        
        {/* User Sidebar */}
        <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Community</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text"
                placeholder="Find a member..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none text-sm font-bold transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {filteredUsers.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest leading-relaxed">No members found</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all relative ${selectedUserId === user.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'hover:bg-white hover:shadow-md'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${selectedUserId === user.id ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>
                    {getInitials(user.name)}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-black text-sm truncate">{user.name}</div>
                    <div className={`text-[10px] truncate uppercase tracking-widest font-bold ${selectedUserId === user.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {user.address}
                    </div>
                  </div>
                  {userUnreadCounts[user.id] > 0 && selectedUserId !== user.id && (
                    <div className="bg-red-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                      {userUnreadCounts[user.id]}
                    </div>
                  )}
                  <div className={`w-2.5 h-2.5 rounded-full border-2 border-white ${selectedUserId === user.id ? 'bg-white' : 'bg-emerald-500'}`}></div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col bg-white ${selectedUserId ? 'flex' : 'hidden md:flex'}`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedUserId(null)} className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm">
                    {getInitials(selectedUser.name)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 leading-none">{selectedUser.name}</h3>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1 inline-block">Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowMiniDict(!showMiniDict)}
                    className={`p-3 rounded-xl transition-all ${showMiniDict ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    title="Quick Dictionary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </button>
                  <button onClick={onClose} className="hidden md:block p-3 text-gray-400 hover:text-gray-900 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Messages Display */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-gray-50/30 custom-scrollbar relative">
                {/* Mini Dictionary Overlay */}
                {showMiniDict && (
                  <div className="absolute top-4 right-4 z-20 w-72 bg-white rounded-3xl shadow-2xl border border-blue-100 p-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Quick Translator</h4>
                      <button onClick={() => setShowMiniDict(false)}><svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                    <input 
                      type="text"
                      autoFocus
                      placeholder="Lookup a word..."
                      value={dictSearchQuery}
                      onChange={(e) => setDictSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-200"
                    />
                    <div className="mt-4 space-y-2">
                      {filteredDict.map(w => (
                        <button 
                          key={w.id}
                          onClick={() => { handleSend(`${w.taiKhamyang} (${w.english})`); setShowMiniDict(false); setDictSearchQuery(''); }}
                          className="w-full p-2 hover:bg-blue-50 rounded-lg text-left transition-colors flex flex-col"
                        >
                          <span className="text-[10px] font-black text-emerald-700">{w.taiKhamyang}</span>
                          <span className="text-[9px] font-bold text-gray-400">{w.english}</span>
                        </button>
                      ))}
                      {dictSearchQuery && filteredDict.length === 0 && (
                        <p className="text-[9px] text-gray-400 text-center italic">Word not found in dictionary</p>
                      )}
                    </div>
                  </div>
                )}

                {activeChatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest text-gray-400">Say hello in Tai Khamyang!</p>
                  </div>
                ) : (
                  activeChatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-[1.5rem] shadow-sm text-sm font-medium relative ${
                        msg.senderId === currentUser.id 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                      }`}>
                        {msg.text}
                        <div className={`flex items-center justify-end gap-1.5 mt-1.5`}>
                          <span className="text-[8px] font-black opacity-60">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.senderId === currentUser.id && (
                            <div className="flex items-center">
                              {msg.status === 'seen' ? (
                                <div className="flex -space-x-1.5 animate-in zoom-in duration-300">
                                  <svg className="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <svg className="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <svg className="w-3.5 h-3.5 text-white/50 animate-in slide-in-from-right-1 duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 border-t border-gray-100 bg-white">
                {/* Quick Greetings */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {TAI_GREETINGS.map((g, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(g.tai)}
                      className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black border border-blue-100 hover:bg-blue-100 transition-colors"
                      title={g.en}
                    >
                      {g.tai}
                    </button>
                  ))}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3 md:gap-4">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${selectedUser.name}...`}
                    className="flex-1 px-5 md:px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-[1.5rem] outline-none text-sm font-bold shadow-inner transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-4 md:p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/20">
              <div className="w-32 h-32 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3 shadow-inner">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Member Connect</h2>
              <p className="text-gray-400 max-w-sm font-medium leading-relaxed">Choose a community member to start a private conversation or practice your Tai Khamyang skills.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;
