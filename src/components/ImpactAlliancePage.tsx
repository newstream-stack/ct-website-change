import { useState } from 'react';
import { MOCK_NEWS, ALLIANCE_MEMBERS } from '../data';

interface ImpactAlliancePageProps {
  openArticle: (id: number) => void;
}

export default function ImpactAlliancePage({ openArticle }: ImpactAlliancePageProps) {
  const featuredArticles = MOCK_NEWS.filter(n => n.category === '影響力聯盟').slice(0, 3);
  
  // Use first 3 articles for slider if available, otherwise fallback
  const sliderArticles = featuredArticles.length > 0 ? featuredArticles : MOCK_NEWS.slice(0, 3);
  const featuredArticle = sliderArticles[0];
  const sideArticles = sliderArticles.slice(1);

  return (
    <div className="pt-[160px] md:pt-[190px] pb-40 bg-theme-bg text-theme-text transition-colors duration-500 min-h-screen">
      
      {/* 1. Page Header */}
      <div className="px-5 md:px-12 lg:px-20 mb-12 md:mb-16">
        <div className="max-w-[1400px] mx-auto">
           <h1 className="text-4xl md:text-5xl font-serif font-black tracking-widest text-theme-text border-b border-theme-text/10 pb-6 md:pb-8 transition-colors">影響力聯盟 <span className="text-xl md:text-2xl font-display font-light text-theme-text/40 ml-4 tracking-widest uppercase">Alliance Network</span></h1>
        </div>
      </div>

      {/* 2. Featured Spotlight (Hero Section Style) */}
      <div className="px-5 md:px-12 lg:px-20 mb-24 md:mb-32">
        <div className="max-w-[1400px] mx-auto relative group overflow-hidden bg-theme-text/5 border border-theme-text/10 rounded-sm">
           <div className="flex flex-col lg:flex-row min-h-[500px]">
              {/* Image Side */}
              <div className="w-full lg:w-[60%] relative overflow-hidden h-[300px] lg:h-auto bg-black flex items-center justify-center">
                 <img 
                    src={featuredArticle.imageUrl} 
                    className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                    alt={featuredArticle.title} 
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-transparent to-black/20 pointer-events-auto"></div>
              </div>
              
              {/* Content Side */}
              <div className="w-full lg:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-theme-bg lg:border-l border-theme-text/10">
                 <div className="flex items-center gap-3 text-brand-red font-display font-bold text-xs tracking-[0.4em] mb-4 uppercase">
                    <span>{featuredArticle.date}</span>
                    <span className="w-1.5 h-px bg-brand-red"></span>
                    <span>Spotlight</span>
                 </div>
                 <h2 
                   className="text-2xl md:text-4xl lg:text-5xl font-serif font-black mb-6 leading-tight cursor-pointer hover:text-brand-red transition-colors"
                   onClick={() => openArticle(featuredArticle.id)}
                 >
                   {featuredArticle.title}
                 </h2>
                 <p className="text-theme-text/60 font-light leading-relaxed mb-10 text-sm md:text-base line-clamp-3">
                   {featuredArticle.excerpt}
                 </p>
                 <div className="flex items-center gap-4 text-theme-text/40 text-[10px] md:text-xs">
                    <span className="font-display tracking-widest uppercase font-bold">{featuredArticle.author}</span>
                    <span className="w-px h-3 bg-theme-text/20"></span>
                    <span className="font-serif">IMPACT ALLIANCE DEEP DIVE</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Alliance Mission / Quote Area */}
      <div className="w-full py-24 md:py-32 bg-theme-text/5 border-y border-theme-text/10 relative overflow-hidden transition-colors mb-24 md:mb-32">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif text-theme-text/5 leading-none pointer-events-none select-none">
            NETWORK
         </div>
         <div className="max-w-[1400px] mx-auto px-5 text-center relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-theme-text leading-tight max-w-4xl mx-auto italic">
              「我們是一群看見影響力的同行者，透過連結與分享，讓屬靈的資源在亞洲這塊土地上自由流動。」
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-12 mb-6"></div>
            <p className="text-theme-text/40 font-display text-xs md:text-sm tracking-[0.4em] uppercase">Impact Alliance Vision Statement</p>
         </div>
      </div>

      {/* 4. Partner Cards - Premium Grid */}
      <div className="px-5 md:px-12 lg:px-20 mb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-12 md:mb-16 border-b border-theme-text/10 pb-6">
             <h3 className="text-xl md:text-2xl font-bold tracking-widest uppercase">合作夥伴與聯盟成員</h3>
             <span className="w-12 h-px bg-brand-red"></span>
             <span className="text-[10px] md:text-xs text-theme-text/40 font-display tracking-widest uppercase">Members Directory</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-16">
            {ALLIANCE_MEMBERS.map((member) => (
              <div 
                key={member.id} 
                className="group flex flex-col"
              >
                {/* Logo Frame */}
                <div className="relative aspect-video bg-white overflow-hidden border border-theme-text/10 mb-6 p-8 flex items-center justify-center group-hover:border-brand-red/30 transition-all duration-700 shadow-sm rounded-sm">
                   <img src={member.logoUrl} className="max-w-[80%] max-h-[80%] object-contain md:grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={member.name} />
                   <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-red transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
                </div>
                
                {/* Info */}
                <div className="flex flex-col">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-brand-red font-display text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">{member.latestArticleDate}</span>
                      <button className="text-[9px] font-bold border border-theme-text/20 px-3 py-1 rounded-sm hover:bg-theme-text hover:text-theme-bg transition-all uppercase tracking-widest whitespace-nowrap">Follow</button>
                   </div>
                   <h4 className="text-lg md:text-xl lg:text-2xl font-serif font-black text-theme-text group-hover:text-brand-red transition-colors leading-snug mb-3">
                     {member.name}
                   </h4>
                   <p 
                    className="text-theme-text/60 text-xs md:text-sm line-clamp-2 leading-relaxed cursor-pointer hover:underline underline-offset-4 decoration-1 decoration-brand-red/40"
                    onClick={() => openArticle(member.latestArticleId)}
                   >
                     {member.latestArticleTitle}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Load More - Minimalist */}
      <div className="mt-24 flex justify-center px-5">
         <button className="w-full max-w-sm border border-theme-text/10 py-5 text-xs md:text-sm font-bold tracking-[0.4em] font-display hover:bg-theme-text hover:text-theme-bg transition-all uppercase flex items-center justify-center gap-4 group">
           Explore More Network Members <i className="fas fa-plus text-[10px] group-hover:rotate-90 transition-transform"></i>
         </button>
      </div>

    </div>
  );
}
