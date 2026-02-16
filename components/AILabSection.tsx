
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// Fixed: Initialization is now handled within handleSend to ensure the most up-to-date API key is used.

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AILabSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prompts = [
    "How can we use AI to teach Tai Khamyang to kids?",
    "Plan a digital museum for our heritage.",
    "Ideas for a Tai Khamyang VR experience.",
    "How to preserve our traditional songs digitally?"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', text } as Message];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Fixed: Instantiate GoogleGenAI here to ensure the most up-to-date API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: "You are the 'TaiHub Future Developer AI'. Your goal is to help the Tai Khamyang community brainstorm futuristic ways to preserve their language, culture, and heritage using modern technology like AI, VR, Blockchain, and Apps. Be creative, encouraging, and visionary."
        }
      });

      setMessages([...newMessages, { role: 'ai', text: response.text || "I'm thinking of great ideas... try asking again!" }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'ai', text: "Error connecting to the future. Please check your internet." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative overflow-hidden bg-gray-900 rounded-[3rem] p-8 md:p-12 text-center shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">Future Lab</h2>
          <p className="text-gray-400 max-w-xl mx-auto font-medium text-lg leading-relaxed mb-10">
            Collaborate with our AI to build the future of the <span className="text-cyan-400 font-bold">Tai Khamyang</span> community.
          </p>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] h-[450px] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-left">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40">
                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Start a future session below</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-white/10 text-gray-200 border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-white/5">
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {prompts.map((p, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(p)}
                    disabled={isLoading}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the AI Future Developer..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-500 transition-all"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  Innovate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.69.345a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 001.217 3.395l1.168.116a2 2 0 001.217-.547l1.168-1.168a2 2 0 011.414-.586h.172a2 2 0 011.414.586l1.168 1.168a2 2 0 001.217.547l1.168-.116a2 2 0 001.217-3.395l-1.168-1.168z" /></svg>
          </div>
          <h3 className="font-black text-gray-900 mb-2">Preservation</h3>
          <p className="text-xs text-gray-500 font-medium">Digital twins of traditional architecture and sites.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg>
          </div>
          <h3 className="font-black text-gray-900 mb-2">Education</h3>
          <p className="text-xs text-gray-500 font-medium">AI-driven gamified learning for the youth.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.952 11.952 0 0112 13.5c-2.998 0-5.74 1.1-7.843 2.918m7.843-2.918a11.953 11.953 0 00-7.843-2.918" /></svg>
          </div>
          <h3 className="font-black text-gray-900 mb-2">Global Reach</h3>
          <p className="text-xs text-gray-500 font-medium">Sharing our unique culture with the global digital world.</p>
        </div>
      </div>
    </div>
  );
};

export default AILabSection;
