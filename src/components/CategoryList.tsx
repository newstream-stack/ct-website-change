import React, { useState, useEffect } from 'react';
import { MOCK_NEWS, MOCK_ADS } from '../data';
import NativeAdCard from './NativeAdCard';

interface CategoryListProps {
  category: string;
  openArticle: (id: number) => void;
}

const LIFE_SUB_CATEGORIES = ['全部', '找工作', '找服務', '找學習', '找活動'];

export default function CategoryList({ category, openArticle }: CategoryListProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const allCategoryNews = MOCK_NEWS.filter(n => n.category === category);
  
  // Featured articles for the hero carousel (first 4 items of the category)
  const featuredArticles = allCategoryNews.slice(0, 4);

  let filteredNews = [...allCategoryNews];
  
  // Apply sub-category filtering
  if (category === '生活情報' && selectedSubCategory !== '全部') {
    filteredNews = filteredNews.filter(n => n.subCategory === selectedSubCategory);
  }

  // Auto-slide effect for hero carousel
  useEffect(() => {
    if (category !== '生活情報' || featuredArticles.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredArticles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [category, featuredArticles.length]);

  // Premium Layout for "生活情報"
  if (category === '生活情報') {
    return (
      <div className="pt-[180px] md:pt-[190px] pb-40 bg-theme-bg text-theme-text transition-colors duration-500 min-h-screen">
        
        {/* 1. Page Header */}
        <div className="px-5 md:px-12 lg:px-20 mb-10 md:mb-16">
          <div className="max-w-[1400px] mx-auto">
            <h1 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-theme-text border-b border-theme-text/10 pb-6 md:pb-8 transition-colors flex flex-col md:flex-row md:items-baseline">
              {category} 
              <span className="text-lg md:text-2xl font-display font-light text-theme-text/40 md:ml-4 tracking-widest uppercase mt-1 md:mt-0">Life Info</span>
            </h1>
          </div>
        </div>

        {/* 2. Featured Carousel */}
        <div className="px-5 md:px-12 lg:px-20 mb-20 md:mb-32">
          <div className="max-w-[1400px] mx-auto relative overflow-hidden bg-theme-text/5 border border-theme-text/10 rounded-sm shadow-xl min-h-[720px] sm:min-h-[650px] md:min-h-[500px]">
            {featuredArticles.map((article, idx) => (
              <div 
                key={article.id}
                className={`absolute inset-0 flex flex-col lg:flex-row transition-all duration-700 ease-in-out ${
                  idx === activeIndex 
                    ? 'opacity-100 translate-x-0 z-10' 
                    : 'opacity-0 translate-x-12 -z-10'
                }`}
              >
                <div className="w-full lg:w-[55%] relative overflow-hidden h-[300px] lg:h-auto bg-black flex items-center justify-center group/img">
                  <img 
                    src={article.imageUrl} 
                    className="w-full h-full object-cover transition-all duration-1000 hover:scale-105" 
                    alt={article.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30"></div>
                </div>
                
                <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-theme-bg lg:border-l border-theme-text/10 transition-colors">
                  <div className="flex items-center gap-3 text-brand-red font-display font-bold text-xs tracking-[0.4em] mb-4 uppercase">
                    <span>Featured Selection</span>
                    <span className="w-1.5 h-px bg-brand-red"></span>
                    <span>{article.subCategory || 'Life'}</span>
                  </div>
                  <h2 
                    className="text-2xl md:text-3xl lg:text-4xl font-serif font-black mb-8 leading-tight cursor-pointer hover:text-brand-red transition-all"
                    onClick={() => openArticle(article.id)}
                  >
                    {article.title}
                  </h2>
                  <p className="text-theme-text/60 font-light leading-relaxed mb-10 text-sm md:text-base">
                    {article.excerpt}
                  </p>
                  <button 
                    onClick={() => openArticle(article.id)}
                    className="self-start text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase border-b-2 border-brand-red pb-1 hover:text-brand-red transition-all"
                  >
                    Read More <i className="fas fa-arrow-right ml-4"></i>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 flex items-center gap-4 z-30">
              <div className="flex gap-2">
                {featuredArticles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex ? 'bg-brand-red w-8' : 'bg-theme-text/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Sub-category Navigation */}
        <div className="px-5 md:px-12 lg:px-20 mb-16 md:mb-20">
          <div className="max-w-[1400px] mx-auto flex flex-wrap gap-4 md:gap-8 border-b border-theme-text/10 pb-6 transition-colors">
            {LIFE_SUB_CATEGORIES.map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedSubCategory(tab)}
                className={`relative py-3 px-6 text-sm md:text-base font-bold tracking-widest transition-all rounded-sm ${
                  selectedSubCategory === tab 
                    ? 'bg-theme-text text-theme-bg shadow-lg scale-105' 
                    : 'text-theme-text/40 hover:text-theme-text hover:bg-theme-text/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Article Grid */}
        <div className="px-5 md:px-12 lg:px-20 mb-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {filteredNews.map((news) => (
              <div 
                key={news.id} 
                className="group flex flex-col cursor-pointer"
                onClick={() => openArticle(news.id)}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6 bg-theme-text/5 transition-colors">
                  <img 
                    src={news.imageUrl} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                    alt={news.title} 
                  />
                  <div className="absolute top-4 left-4 bg-brand-red text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 shadow-lg">
                    {news.subCategory || news.category}
                  </div>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-black text-theme-text mb-4 group-hover:text-brand-red transition-all leading-snug">
                  {news.title}
                </h3>
                <p className="text-theme-text/60 text-sm font-light leading-relaxed line-clamp-3 mb-6">
                  {news.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-theme-text/5 flex items-center justify-between transition-colors">
                  <span className="text-[10px] font-bold text-theme-text/40 tracking-widest uppercase">
                    By {news.author}
                  </span>
                  <i className="fas fa-arrow-right text-[10px] text-brand-red transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Mission/Quote Section */}
        <div className="w-full py-24 md:py-32 bg-theme-text/5 border-y border-theme-text/10 relative overflow-hidden transition-colors">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif text-theme-text/5 leading-none pointer-events-none select-none">
            LIFE
          </div>
          <div className="max-w-[1400px] mx-auto px-5 text-center relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-theme-text leading-tight max-w-4xl mx-auto italic">
              「生活即是事奉，美學即是禮拜。在日常的瑣碎中，尋見上帝隱藏的溫暖與真理。」
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-12 mb-6"></div>
            <p className="text-theme-text/40 font-display text-xs md:text-sm tracking-[0.4em] uppercase">The Art of Faithful Living</p>
          </div>
        </div>
      </div>
    );
  }

  // Default Standard Layout for other categories
  if (filteredNews.length === 0 && selectedSubCategory === '全部') filteredNews = MOCK_NEWS.filter(n => n.category === category);
  
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
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700 group-hover:scale-105" alt="Ad" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/20 to-transparent opacity-50"></div>
        <span className="absolute top-2 md:top-4 right-2 md:right-4 text-[10px] md:text-xs font-display uppercase tracking-widest border border-theme-text/20 text-theme-text/70 px-1 md:px-2 py-0.5 z-10 bg-theme-bg/70 transition-colors">ADVERTISEMENT</span>
        <div className="z-10 text-center relative">
          <h3 className="font-serif font-black text-2xl md:text-4xl text-theme-text drop-shadow-lg transition-colors">IMPACT 2026 SUMMIT</h3>
          <p className="font-display text-sm md:text-base tracking-widest uppercase mt-2 font-bold text-brand-red group-hover:text-theme-text transition-colors">Register Now <i className="fas fa-arrow-right"></i></p>
        </div>
      </div>

      <div className="flex flex-col border-t border-theme-text/10 transition-colors">
        {filteredNews.length > 0 ? (
          filteredNews.map((news, index) => (
            <React.Fragment key={news.id}>
              {index === 2 && MOCK_ADS.infeed && (
                <div className="py-6 md:py-8 border-b border-theme-text/10">
                  <NativeAdCard ad={MOCK_ADS.infeed} />
                </div>
              )}
              <div className="flex flex-col md:flex-row gap-4 md:gap-12 py-6 md:py-8 border-b border-theme-text/10 group cursor-pointer hover:bg-theme-text/5 transition-colors duration-500 md:px-6 md:-mx-6" onClick={() => openArticle(news.id)}>
                <div className="w-full md:w-[35%] lg:w-1/3 aspect-[4/3] bg-theme-text/10 overflow-hidden relative border border-theme-text/5 transition-colors rounded-sm">
                  <img src={news.imageUrl} className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-700" alt={news.title} />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-brand-red text-white text-[10px] font-display uppercase tracking-widest px-2 py-1 shadow-md">
                    {news.subCategory || news.category}
                  </div>
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
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-theme-text/40 font-display uppercase tracking-widest">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
