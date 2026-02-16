
import React from 'react';

interface TaiGroup {
  name: string;
  description: string;
  image: string;
}

const TAI_GROUPS: TaiGroup[] = [
  {
    name: "Tai Khamyang",
    description: "The Tai Khamyang (also known as Shyam) are a distinct community living mostly in the Tinsukia, Dibrugarh, and Jorhat districts. They are one of the smaller Tai groups but hold immensely deep knowledge of ancient Tai Buddhism and traditional agriculture. They speak the Khamyang language and follow the Theravada Buddhist faith.",
    image: "https://images.unsplash.com/photo-1543734057-7977a45b98a5?q=80&w=1200&auto=format&fit=crop" 
  },
  {
    name: "Tai Khamti",
    description: "The Tai Khamti are known as 'Great Tai' and were once powerful rulers in the Upper Chindwin region. Today, they primarily inhabit the Namsai and Lohit districts of Arunachal Pradesh. They are renowned for their intricate wood carvings, Buddhist literature, and vibrant festivals like Poi Pee Mau.",
    image: "https://images.unsplash.com/photo-1588065053424-df3531b7829a?q=80&w=1200&auto=format&fit=crop" 
  },
  {
    name: "Tai Phake",
    description: "Inhabiting mostly the bank of the river Buridihing, the Tai Phake community (Phakial) is famous for preserving their traditional lifestyle. Their villages like Nam Phake are living museums of Tai culture, featuring Chang-ghars (stilt houses) and beautiful hand-woven textiles made by the village women.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a593?q=80&w=1200&auto=format&fit=crop" 
  },
  {
    name: "Tai Turung",
    description: "The Tai Turung are the largest group among the Tai people of Assam. They migrated from the Mung-Ma-Lung region and have assimilated deeply with the local culture while maintaining their identity through language and religious practices. They are primarily found in the Golaghat and Karbi Anglong districts.",
    image: "https://images.unsplash.com/photo-1621359670612-4c69837a5f36?q=80&w=1200&auto=format&fit=crop" 
  }
];

const AboutSection: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Introduction Header */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Tai Heritage Archive</h2>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          The Tai community of Northeast India represents a unique cultural thread connecting the Brahmaputra valley to South East Asia. Discover the various Tai groups preserving their ancient traditions today.
        </p>
      </div>

      {/* Tai Groups Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TAI_GROUPS.map((group, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={group.image} 
                alt={group.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <div className="w-12 h-1 bg-blue-500 rounded-full mb-3"></div>
                <h3 className="text-4xl font-black text-white tracking-tighter">{group.name}</h3>
              </div>
            </div>
            <div className="p-8 flex-1">
              <p className="text-gray-600 leading-relaxed font-medium text-lg mb-6">{group.description}</p>
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Heritage Profile</span>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Historical Entry</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Village Deep Dive Feature - Simplified */}
      <div className="bg-gray-900 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">Historical Settlements</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 font-medium text-lg leading-relaxed">
            Major villages that serve as cultural hubs for the Tai people of Assam and Arunachal Pradesh.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Pather Gaon", 
              "Chalapathar", 
              "Nam Phake Village", 
              "Borkhamti", 
              "Ningroo", 
              "Tipam Phake", 
              "Borpather", 
              "Faneng Village"
            ].map((v, i) => (
              <div 
                key={i} 
                className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-gray-300"
              >
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
