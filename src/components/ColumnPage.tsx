import { useState } from 'react';
import { MOCK_NEWS, COLUMNISTS } from '../data';

interface ColumnPageProps {
  openArticle: (id: number) => void;
}

export default function ColumnPage({ openArticle }: ColumnPageProps) {
  const [activeTab, setActiveTab] = useState('好牧人');
  const featuredArticles = MOCK_NEWS.filter(n => n.category === '專欄').slice(0, 3);
  const filteredColumnists = COLUMNISTS.filter(c => c.subCategory === activeTab);
  
  const featuredArticle = featuredArticles[0];

  return (
    <div className="pt-[160px] md:pt-[190px] pb-40 bg-theme-bg text-theme-text transition-colors duration-500 min-h-screen">
      
      {/* 1. Page Header */}
      <div className="px-5 md:px-12 lg:px-20 mb-12 md:mb-16">
        <div className="max-w-[1400px] mx-auto">
           <h1 className="text-4xl md:text-5xl font-serif font-black tracking-widest text-theme-text border-b border-theme-text/10 pb-6 md:pb-8 transition-colors">專欄 <span className="text-xl md:text-2xl font-display font-light text-theme-text/40 ml-4 tracking-widest uppercase">Columns</span></h1>
        </div>
      </div>

      {/* 2. Featured Columnist spotlight (Hero Style) */}
      <div className="px-5 md:px-12 lg:px-20 mb-24 md:mb-32">
        <div className="max-w-[1400px] mx-auto relative group overflow-hidden bg-theme-text/5 border border-theme-text/10 rounded-sm shadow-xl">
           <div className="flex flex-col lg:flex-row min-h-[500px]">
              {/* Image Side */}
              <div className="w-full lg:w-[55%] relative overflow-hidden h-[300px] lg:h-auto bg-black flex items-center justify-center">
                 <img 
                    src={featuredArticle.imageUrl} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
                    alt={featuredArticle.title} 
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-transparent to-black/30 pointer-events-none"></div>
                 
                 {/* Author Badge */}
                 <div className="absolute top-8 left-8 p-4 bg-theme-bg/90 backdrop-blur-md border border-theme-text/10 flex items-center gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white font-serif italic text-lg shadow-lg">P</div>
                    <div>
                       <span className="block text-[9px] font-display font-bold tracking-[0.2em] text-theme-text/40 uppercase">Featured Author</span>
                       <span className="block text-sm font-bold text-theme-text">{featuredArticle.author}</span>
                    </div>
                 </div>
              </div>
              
              {/* Content Side */}
              <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-theme-bg lg:border-l border-theme-text/10 transition-colors">
                 <div className="flex items-center gap-3 text-brand-red font-display font-bold text-xs tracking-[0.4em] mb-4 uppercase">
                    <span>Editor's Choice</span>
                    <span className="w-1.5 h-px bg-brand-red"></span>
                    <span>Column</span>
                 </div>
                 <h2 
                   className="text-2xl md:text-3xl lg:text-4xl font-serif font-black mb-8 leading-tight cursor-pointer hover:text-brand-red transition-all"
                   onClick={() => openArticle(featuredArticle.id)}
                 >
                   {featuredArticle.title}
                 </h2>
                 <p className="text-theme-text/60 font-light leading-relaxed mb-10 text-sm md:text-base">
                   {featuredArticle.excerpt}
                 </p>
                 <button 
                  onClick={() => openArticle(featuredArticle.id)}
                  className="self-start text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase border-b-2 border-brand-red pb-1 hover:text-brand-red transition-all"
                 >
                    Read Full Column <i className="fas fa-arrow-right ml-4"></i>
                 </button>
              </div>
           </div>
           
           {/* Decorative dots */}
           <div className="absolute bottom-8 right-8 grid grid-cols-4 gap-1.5 opacity-20 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                 <div key={i} className="w-1 h-1 rounded-full bg-theme-text"></div>
              ))}
           </div>
        </div>
      </div>

      {/* 3. Column Navigation/Tabs */}
      <div className="px-5 md:px-12 lg:px-20 mb-16 md:mb-20">
        <div className="max-w-[1400px] mx-auto flex flex-wrap gap-4 md:gap-8 border-b border-theme-text/10 pb-6">
          {['好牧人', '天路客', '國度之聲'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-3 px-6 text-sm md:text-base font-bold tracking-widest transition-all rounded-sm ${activeTab === tab ? 'bg-theme-text text-theme-bg shadow-lg scale-105' : 'text-theme-text/40 hover:text-theme-text hover:bg-theme-text/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Columnist Cards - Refined Grid */}
      <div className="px-5 md:px-12 lg:px-20 mb-32">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-16">
          {filteredColumnists.map(author => (
            <div key={author.id} className="group flex flex-col">
              {/* Profile Frame */}
              <div className="relative mb-8 flex justify-center">
                 <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-theme-text/5 p-1.5 border border-theme-text/10 group-hover:border-brand-red/40 transition-all duration-700 shadow-xl overflow-hidden">
                    <img src={author.avatarUrl} className="w-full h-full object-cover rounded-full transition-all duration-700 group-hover:scale-110" alt={author.name} />
                 </div>
                 <div className="absolute -bottom-2 px-4 py-1.5 bg-brand-red text-white text-[9px] font-bold tracking-widest uppercase shadow-lg rounded-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">Verified Author</div>
              </div>
              
              {/* Info */}
              <div className="text-center group">
                 <h4 className="font-serif text-xl md:text-2xl font-black text-theme-text mb-2 group-hover:text-brand-red transition-colors">{author.name}</h4>
                 <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-[10px] font-display text-theme-text/40 tracking-wider uppercase font-bold">{author.latestArticleDate}</span>
                    <span className="w-1 h-1 bg-brand-red/30 rounded-full"></span>
                    <span className="text-[10px] font-display text-theme-text/40 tracking-wider uppercase font-bold">Latest Entry</span>
                 </div>
                 <h5 
                   className="font-bold text-sm md:text-base leading-relaxed text-theme-text/80 line-clamp-2 px-4 cursor-pointer hover:text-brand-red hover:underline underline-offset-4 decoration-1 transition-all"
                   onClick={() => openArticle(author.latestArticleId)}
                 >
                   {author.latestArticleTitle}
                 </h5>
                 
                 <div className="mt-8 pt-6 border-t border-theme-text/5 flex justify-center gap-4">
                    <button className="px-6 py-2 bg-theme-text/5 hover:bg-brand-red hover:text-white text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm">Follow Author</button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Mission Section - Quote Area */}
      <div className="w-full py-24 md:py-32 bg-theme-text/5 border-y border-theme-text/10 relative overflow-hidden transition-colors mb-24 md:mb-32">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif text-theme-text/5 leading-none pointer-events-none select-none">
            VOICE
         </div>
         <div className="max-w-[1400px] mx-auto px-5 text-center relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-theme-text leading-tight max-w-4xl mx-auto italic">
              「文字是靈魂的迴響，專欄是思想的祭壇。讓我們用最真誠的筆觸，紀錄這個時代的信仰深度。」
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-12 mb-6"></div>
            <p className="text-theme-text/40 font-display text-xs md:text-sm tracking-[0.4em] uppercase">The Mission of Columnists</p>
         </div>
      </div>

      {/* 6. Load More - Minimalist */}
      <div className="mt-24 flex justify-center px-5">
         <button className="w-full max-w-sm border border-theme-text/10 py-5 text-xs md:text-sm font-bold tracking-[0.4em] font-display hover:bg-theme-text hover:text-theme-bg transition-all uppercase flex items-center justify-center gap-4 group">
            Discover More Authors <i className="fas fa-plus text-[10px] group-hover:rotate-90 transition-transform"></i>
         </button>
      </div>
    </div>
  );
}
