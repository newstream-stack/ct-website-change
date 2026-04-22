import { useState, useEffect } from 'react';
import { MOCK_NEWS, ALLIANCE_MEMBERS } from '../data/index';
import { NewsItem, AllianceMember } from '../types';

interface ImpactAlliancePageProps {
  openArticle: (id: number) => void;
}

export default function ImpactAlliancePage({ openArticle }: ImpactAlliancePageProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredArticles = MOCK_NEWS.filter(n => n.category === '影響力聯盟').slice(0, 5);
  
  const sliderArticles = featuredArticles.length > 0 ? featuredArticles : MOCK_NEWS.slice(0, 3);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderArticles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderArticles.length]);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % sliderArticles.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + sliderArticles.length) % sliderArticles.length);

  return (
    <div className="pt-[180px] md:pt-[190px] pb-40 bg-theme-bg text-theme-text transition-colors duration-500 min-h-screen">
      
      {/* 1. Page Header */}
      <div className="px-5 md:px-12 lg:px-20 mb-10 md:mb-16">
        <div className="max-w-[1400px] mx-auto">
           <h1 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-theme-text border-b border-theme-text/10 pb-6 md:pb-8 transition-colors flex flex-col md:flex-row md:items-baseline">
             影響力聯盟 
             <span className="text-lg md:text-2xl font-display font-light text-theme-text/40 md:ml-4 tracking-widest uppercase mt-1 md:mt-0">Alliance Network</span>
           </h1>
        </div>
      </div>

      {/* 2. Featured Spotlight */}
      <div className="px-5 md:px-12 lg:px-20 mb-20 md:mb-32">
        <div className="max-w-[1400px] mx-auto relative overflow-hidden bg-theme-text/5 border border-theme-text/10 rounded-sm min-h-[720px] sm:min-h-[650px] md:min-h-[500px]">
           {sliderArticles.map((article, idx) => (
             <div 
               key={article.id}
               className={`absolute inset-0 flex flex-col lg:flex-row transition-all duration-700 ease-in-out ${
                 idx === activeIndex 
                   ? 'opacity-100 translate-x-0 z-10' 
                   : 'opacity-0 translate-x-12 -z-10'
               }`}
             >
                {/* Image Side */}
                <div className="w-full lg:w-[60%] relative overflow-hidden h-[300px] lg:h-auto bg-black flex items-center justify-center group/img">
                   <img 
                      src={article.imageUrl} 
                      className="w-full h-full object-cover transition-all duration-1000 hover:scale-105" 
                      alt={article.title} 
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-auto"></div>

                   {/* Arrow Buttons */}
                   <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-brand-red hover:border-brand-red transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                      >
                         <i className="fas fa-chevron-left text-sm md:text-base"></i>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-brand-red hover:border-brand-red transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                      >
                         <i className="fas fa-chevron-right text-sm md:text-base"></i>
                      </button>
                   </div>
                </div>
                
                {/* Content Side */}
                <div className="w-full lg:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-theme-bg lg:border-l border-theme-text/10">
                   <div className="flex items-center gap-3 text-brand-red font-display font-bold text-xs tracking-[0.4em] mb-4 uppercase">
                      <span>{article.date}</span>
                      <span className="w-1.5 h-px bg-brand-red"></span>
                      <span>Spotlight</span>
                   </div>
                   <h2 
                     className="text-2xl md:text-3xl lg:text-4xl font-serif font-black mb-6 leading-tight cursor-pointer hover:text-brand-red transition-colors"
                     onClick={() => openArticle(article.id)}
                   >
                     {article.title}
                   </h2>
                   <p className="text-theme-text/60 font-light leading-relaxed mb-10 text-sm md:text-base line-clamp-3">
                     {article.excerpt}
                   </p>
                   <div className="flex items-center gap-4 text-theme-text/40 text-[10px] md:text-xs mt-auto">
                      <span className="font-display tracking-widest uppercase font-bold">{article.author}</span>
                      <span className="w-px h-3 bg-theme-text/20"></span>
                      <span className="font-serif">IMPACT ALLIANCE DEEP DIVE</span>
                   </div>
                </div>
             </div>
           ))}

           {/* Carousel Controls */}
           <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 flex items-center gap-6 z-30 bg-theme-bg/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none px-4 py-2 rounded-full border border-theme-text/10 md:border-none">
              <div className="flex gap-2">
                 {sliderArticles.map((_, idx) => (
                   <button
                     key={idx}
                     onClick={() => setActiveIndex(idx)}
                     className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                       idx === activeIndex ? 'bg-brand-red w-8' : 'bg-theme-text/20 hover:bg-theme-text/40'
                     }`}
                     aria-label={`Go to slide ${idx + 1}`}
                   />
                 ))}
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

      {/* 4. Partner Cards - Round Layout (matching ColumnPage) */}
      <div className="px-5 md:px-12 lg:px-20 mb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-16 md:mb-24 border-b border-theme-text/10 pb-6">
             <h3 className="text-xl md:text-2xl font-bold tracking-widest uppercase">合作夥伴與聯盟成員</h3>
             <span className="w-12 h-px bg-brand-red"></span>
             <span className="text-[10px] md:text-xs text-theme-text/40 font-display tracking-widest uppercase">Members Directory</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 lg:gap-x-16">
            {ALLIANCE_MEMBERS.map((member) => (
              <div 
                key={member.id} 
                className="group flex flex-col"
              >
                {/* Round Logo Frame */}
                <div className="relative mb-8 flex justify-center">
                   <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-theme-text/5 p-1.5 border border-theme-text/10 group-hover:border-brand-red/40 transition-all duration-700 shadow-xl overflow-hidden flex items-center justify-center bg-white">
                      <img src={member.logoUrl} className="w-[70%] h-[70%] object-contain transition-all duration-700 group-hover:scale-110" alt={member.name} />
                   </div>
                   <div className="absolute -bottom-2 px-4 py-1.5 bg-brand-red text-white text-[9px] font-bold tracking-widest uppercase shadow-lg rounded-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">Verified Member</div>
                </div>
                
                {/* Info Center Aligned */}
                <div className="text-center group">
                   <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-brand-red font-display text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">{member.latestArticleDate}</span>
                   </div>
                   <h4 className="font-serif text-xl md:text-2xl font-black text-theme-text mb-4 group-hover:text-brand-red transition-colors leading-snug">
                     {member.name}
                   </h4>
                   <p 
                    className="text-theme-text/60 text-xs md:text-sm line-clamp-2 leading-relaxed px-4 cursor-pointer hover:text-brand-red transition-all"
                    onClick={() => openArticle(member.latestArticleId)}
                   >
                     {member.latestArticleTitle}
                   </p>
                   
                   <div className="mt-8 pt-6 border-t border-theme-text/5 flex justify-center gap-4">
                      <button className="px-6 py-2 bg-theme-text/5 hover:bg-brand-red hover:text-white text-[10px] font-bold tracking-widest uppercase transition-all rounded-sm">Follow Member</button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Load More */}
      <div className="mt-24 flex justify-center px-5">
         <button className="w-full max-w-sm border border-theme-text/10 py-5 text-xs md:text-sm font-bold tracking-[0.4em] font-display hover:bg-theme-text hover:text-theme-bg transition-all uppercase flex items-center justify-center gap-4 group">
           Explore More Network Members <i className="fas fa-plus text-[10px] group-hover:rotate-90 transition-transform"></i>
         </button>
      </div>

    </div>
  );
}
