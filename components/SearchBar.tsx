
import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.onresult = (event: any) => {
        onChange(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => recognitionRef.current?.stop();
  }, [onChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Browser not supported.");
    if (isListening) recognitionRef.current.stop();
    else { setIsListening(true); recognitionRef.current.start(); }
  };

  return (
    <div className="relative flex-1 group max-w-4xl mx-auto mb-10">
      <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
        <svg className={`h-6 w-6 transition-colors ${isListening ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        className={`block w-full pl-16 pr-20 py-6 bg-white dark:bg-gray-900 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 dark:focus:border-indigo-500 rounded-[2.5rem] transition-all outline-none text-xl font-bold shadow-sm dark:shadow-none group-hover:shadow-2xl dark:group-hover:shadow-indigo-500/5 dark:text-white ${isListening ? 'border-blue-200 dark:border-indigo-500 ring-4 ring-blue-50 dark:ring-indigo-900/20' : ''}`}
        placeholder={isListening ? "Listening for word..." : "Search in English, Assamese, or Tai..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      <div className="absolute inset-y-0 right-4 flex items-center gap-2">
        {value && (
          <button onClick={() => onChange('')} className="p-3 text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-300 transition-all"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button>
        )}
        <button
          onClick={toggleListening}
          className={`w-12 h-12 rounded-2xl transition-all active:scale-90 flex items-center justify-center ${
            isListening ? 'bg-red-600 text-white shadow-xl shadow-red-200 animate-pulse' : 'bg-blue-50 dark:bg-indigo-900/30 text-blue-600 dark:text-indigo-400 hover:bg-blue-100 dark:hover:bg-indigo-900/50'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
      
      <div className="flex justify-center gap-6 mt-4 opacity-40">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">English</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 assamese-font">অসমীয়া</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Tai Khamyang</span>
      </div>
    </div>
  );
};

export default SearchBar;