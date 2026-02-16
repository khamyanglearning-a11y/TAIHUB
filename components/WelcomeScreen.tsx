
import React from 'react';

interface WelcomeScreenProps {
  onJoinClick: () => void;
  onStudentJoinClick: () => void;
  onDevLoginClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onJoinClick, onStudentJoinClick, onDevLoginClick }) => {
  const features = [
    {
      title: "Digital Dictionary",
      desc: "Comprehensive 4-language support: Assamese, English, Tai Khamyang, and more.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Cultural Library",
      desc: "Access PDF books, research papers, and ancient cultural documents.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Traditional Gallery",
      desc: "Explore a curated collection of photos showcasing our heritage and festivals.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Community Music",
      desc: "Listen to traditional Tai Khamyang folk songs and community recordings.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 pb-20 overflow-y-auto">
      {/* Animated Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-xl w-full text-center space-y-8 py-12 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200 rotate-6 mb-8">T</div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">TaiHub</h1>
          <div className="h-1.5 w-12 bg-blue-600 rounded-full mb-6"></div>
          <p className="text-gray-500 font-medium text-lg px-4 leading-relaxed">
            The Digital Gateway to <span className="text-blue-600 font-bold">Tai Khamyang</span> Culture, Heritage & Language.
          </p>
        </div>

        {/* Unified Call to Action */}
        <div className="px-4 grid grid-cols-1 gap-4">
          <button 
            onClick={onJoinClick}
            className="w-full py-6 bg-gray-900 hover:bg-black text-white rounded-[2.5rem] font-black text-xl transition-all shadow-2xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-4 group"
          >
            Community Hub
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </button>

          <button 
            onClick={onStudentJoinClick}
            className="w-full py-5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-[2.5rem] font-black text-lg transition-all border-2 border-blue-200 active:scale-95 flex items-center justify-center gap-4 group"
          >
            Student Login
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
            </div>
          </button>
          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Login or Register to Access</p>
        </div>

        {/* Features Preview Section */}
        <div className="space-y-6 pt-8 text-left">
          <div className="flex items-center gap-4 px-2">
            <h2 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] whitespace-nowrap">What's Inside TaiHub?</h2>
            <div className="h-[1px] bg-gray-100 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((f, idx) => (
              <button
                key={idx}
                onClick={onJoinClick}
                className="group flex items-start gap-4 p-5 bg-gray-50/50 hover:bg-white border border-transparent hover:border-blue-100 rounded-3xl transition-all text-left active:scale-[0.98] shadow-sm hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                  {f.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-black text-gray-800 text-lg">{f.title}</h3>
                    <div className="flex items-center gap-1.5 bg-gray-200/50 px-2 py-1 rounded-lg">
                      <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Enter to Open</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-snug">{f.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Staff Portal Link */}
        <div className="pt-8">
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-gray-200 uppercase tracking-widest">Administrative Access</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button 
            onClick={onDevLoginClick}
            className="w-full py-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-2xl font-black text-sm transition-all border border-indigo-100 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Developer / Staff Login Portal
          </button>
        </div>

        <div className="pt-12 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Secure Community Platform</span>
          <p className="text-[9px] font-medium text-gray-500 max-w-[250px]">Preserving the digital cultural heritage of the Tai Khamyang community for future generations.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
