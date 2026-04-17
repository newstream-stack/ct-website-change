import { useState } from 'react';
import { MOCK_NEWS, COLUMNISTS, Columnist } from '../data';

interface ColumnPageProps {
  openArticle: (id: number) => void;
}

export default function ColumnPage({ openArticle }: ColumnPageProps) {
  const [activeTab, setActiveTab] = useState('好牧人');
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredArticles = MOCK_NEWS.filter(n => n.category === '專欄').slice(0, 3);
  const filteredColumnists = COLUMNISTS.filter(c => c.subCategory === activeTab);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);

  return (
    <div className="pt-[210px] md:pt-[190px] pb-40 md:pb-24 bg-theme-bg text-theme-text transition-colors duration-500 min-h-screen">
      
      {/* 1. Featured Slider */}
      <div className="px-5 md:px-12 lg:px-20 mb-10 md:mb-16">
        <h2 className="text-2xl md:text-5xl font-serif font-black tracking-widest mb-6 md:mb-10 text-theme-text border-b border-theme-text/10 pb-4 md:pb-6 transition-colors">專欄</h2>
        
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-sm group shadow-2xl">
          {/* Slides */}
          {featuredArticles.map((article, index) => (
            <div 
              key={article.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
            >
              <img 
                src={article.imageUrl} 
                className="w-full h-full object-cover md:grayscale md:opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                alt={article.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16">
                 <div className="max-w-4xl animate-fade-in-up">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[9px] md:text-xs font-display font-bold tracking-widest text-white/70 mb-3 md:mb-4 uppercase">
                      <span>2026-03-16</span>
                      <span className="w-1 h-1 bg-brand-red rounded-full"></span>
                      <span>專欄</span>
                      <span className="w-1 h-1 bg-brand-red rounded-full hidden sm:inline"></span>
                      <span className="text-brand-red break-all sm:break-normal">致福感恩文教基金會</span>
                    </div>
                    <h3 
                      className="text-lg md:text-4xl lg:text-5xl font-serif font-black text-white leading-[1.4] mb-4 md:mb-6 cursor-pointer hover:text-brand-red transition-colors line-clamp-2 md:line-clamp-none"
                      onClick={() => openArticle(article.id)}
                    >
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/40 text-[10px] md:text-xs">
                       <span className="font-display tracking-widest">gvc 致福感恩文教基金會</span>
                       <span className="w-px h-3 bg-white/20"></span>
                       <span className="font-serif">致福益人學苑總校</span>
                    </div>
                 </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows - Moved to sides for better visibility and to avoid overlapping text */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/30 backdrop-blur-md hover:bg-brand-red text-white flex items-center justify-center transition-all rounded-full z-30 group/btn"
            title="Previous Slide"
          >
            <i className="fas fa-chevron-left text-[10px] group-hover/btn:-translate-x-0.5 transition-transform"></i>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/30 backdrop-blur-md hover:bg-brand-red text-white flex items-center justify-center transition-all rounded-full z-30 group/btn"
            title="Next Slide"
          >
            <i className="fas fa-chevron-right text-[10px] group-hover/btn:translate-x-0.5 transition-transform"></i>
          </button>
          
          {/* Indicators - Repositioned to clear space */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
            {featuredArticles.map((_, i) => (
              <div 
                key={i} 
                className={`w-0.5 h-6 transition-all duration-500 ${i === currentSlide ? 'bg-brand-red' : 'bg-white/20'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <div className="px-5 md:px-12 lg:px-20 mb-12">
        <div className="flex gap-8 border-b border-theme-text/10 pb-4">
          {['好牧人', '天路客', '國度之聲'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-2 text-sm md:text-base font-bold tracking-widest transition-all ${activeTab === tab ? 'text-brand-red' : 'text-theme-text/50 hover:text-theme-text'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-17px] left-0 w-full h-[3px] bg-brand-red animate-scale-in"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Author Grid */}
      <div className="px-5 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
        {filteredColumnists.map(author => (
          <div key={author.id} className="flex gap-4 group">
            {/* Avatar */}
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 overflow-hidden rounded-full bg-theme-text/10 border-2 border-transparent group-hover:border-brand-red transition-all duration-500 shadow-lg">
               <img src={author.avatarUrl} className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-500" alt={author.name} />
            </div>
            
            {/* Info */}
            <div className="flex-1 flex flex-col justify-center">
               <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-sm md:text-base text-theme-text group-hover:text-brand-red transition-colors">{author.name}</h4>
                    <span className="text-[10px] md:text-xs text-theme-text/40">{author.latestArticleDate}</span>
                  </div>
                  <button className="text-[10px] md:text-xs font-bold border border-theme-text/20 px-3 py-1 rounded-sm hover:bg-brand-red hover:border-brand-red hover:text-white transition-all text-theme-text/60">追蹤</button>
               </div>
               <h5 
                 className="font-bold text-xs md:text-sm leading-relaxed text-theme-text/80 line-clamp-2 mt-1 cursor-pointer hover:text-brand-red hover:underline underline-offset-4 decoration-1"
                 onClick={() => openArticle(author.latestArticleId)}
               >
                 {author.latestArticleTitle}
               </h5>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Visual */}
      <div className="mt-20 flex justify-center px-5">
         <button className="w-full max-w-xs border border-theme-text/10 py-4 text-xs md:text-sm font-bold tracking-[0.3em] font-display hover:bg-theme-text hover:text-theme-bg transition-all uppercase">
           Explore More <i className="fas fa-plus ml-2"></i>
         </button>
      </div>
    </div>
  );
}
