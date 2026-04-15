import React from 'react';
import { MOCK_NEWS, MOCK_ADS } from '../data';
import NativeAdCard from './NativeAdCard';

interface CategoryListProps {
  category: string;
  openArticle: (id: number) => void;
}

export default function CategoryList({ category, openArticle }: CategoryListProps) {
  let filteredNews = MOCK_NEWS.filter(n => n.category === category);
  if (filteredNews.length === 0) filteredNews = MOCK_NEWS;

  return (
    <div className="pt-[190px] md:pt-48 pb-24 px-5 md:px-12 lg:px-20 min-h-screen bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="mb-12 md:mb-16 border-b border-theme-text/20 pb-6 md:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-colors">
        <div>
          <span className="font-display text-brand-red tracking-[0.2em] uppercase text-xs md:text-sm mb-3 md:mb-4 block">Category</span>
          <h1 className="text-5xl md:text-[80px] lg:text-[100px] font-serif font-black tracking-tighter leading-none text-theme-text transition-colors">{category}</h1>
        </div>
        <div className="text-sm font-display font-bold uppercase tracking-widest text-theme-text/60 border border-theme-text/20 px-4 py-2 rounded-full hidden md:block transition-colors">
          {filteredNews.length} Articles
        </div>
      </div>
      
      <div className="w-full h-32 md:h-48 border border-theme-text/10 bg-theme-text/5 backdrop-blur-sm mb-12 md:mb-20 flex items-center justify-center relative cursor-pointer group overflow-hidden transition-colors">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700 group-hover:scale-105 grayscale" alt="Ad" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/20 to-transparent opacity-50"></div>
        <span className="absolute top-2 md:top-4 right-2 md:right-4 text-[10px] md:text-xs font-display uppercase tracking-widest border border-theme-text/20 text-theme-text/70 px-1 md:px-2 py-0.5 z-10 bg-theme-bg/70 transition-colors">ADVERTISEMENT</span>
        <div className="z-10 text-center relative">
          <h3 className="font-serif font-black text-2xl md:text-4xl text-theme-text drop-shadow-lg transition-colors">IMPACT 2026 SUMMIT</h3>
          <p className="font-display text-sm md:text-base tracking-widest uppercase mt-2 font-bold text-brand-red group-hover:text-theme-text transition-colors">Register Now <i className="fas fa-arrow-right"></i></p>
        </div>
      </div>

      <div className="flex flex-col border-t border-theme-text/10 transition-colors">
        {filteredNews.map((news, index) => (
          <React.Fragment key={news.id}>
            {index === 2 && MOCK_ADS.infeed && (
              <div className="py-6 md:py-8 border-b border-theme-text/10">
                <NativeAdCard ad={MOCK_ADS.infeed} />
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 py-6 md:py-8 border-b border-theme-text/10 group cursor-pointer hover:bg-theme-text/5 transition-colors duration-500 md:px-6 md:-mx-6" onClick={() => openArticle(news.id)}>
            <div className="w-full md:w-[35%] lg:w-1/3 aspect-[4/3] bg-theme-text/10 overflow-hidden relative border border-theme-text/5 transition-colors rounded-sm">
              <img src={news.imageUrl} className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={news.title} />
              <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-brand-red text-white text-[10px] font-display uppercase tracking-widest px-2 py-1 shadow-md">{news.category}</div>
            </div>
            <div className="w-full md:w-[65%] lg:w-2/3 flex flex-col justify-center mt-2 md:mt-0">
              <h2 className="text-[22px] sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black mb-3 text-theme-text group-hover:text-brand-red transition-colors leading-[1.4] md:leading-tight tracking-wide md:tracking-normal">{news.title}</h2>
              <p className="text-sm md:text-lg font-light text-theme-text/70 mb-4 line-clamp-2 md:line-clamp-3 transition-colors leading-relaxed">{news.excerpt}</p>
              <div className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/50 mt-auto flex items-center gap-3 transition-colors">
                <span>By <span className="text-theme-text/80 transition-colors">{news.author}</span></span>
                <span className="w-1 h-1 bg-theme-text/20 rounded-full transition-colors"></span>
                <span>{news.date}, 2026</span>
              </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
