import { Fragment, useEffect, useState } from 'react';
import { getNewsByCategory } from '../api/news';
import { getAd } from '../api/ads';

import NativeAdCard from '../components/NativeAdCard';
import AsyncPageState from '../components/AsyncPageState';
import SummitBanner from '../components/SummitBanner';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useAsyncData } from '../hooks/useAsyncData';
import { CT_FORUM_SUBCATEGORIES } from '../data/forumSubCategories';

interface CategoryListProps {
  category: string;
  openArticle: (id: number) => void;
  initialSubCategory?: string | null;
}

const LIFE_SUB_CATEGORIES = ['全部', '找工作', '找服務', '找學習', '找活動'];
const FORUM_SUB_CATEGORIES = ['全部', ...CT_FORUM_SUBCATEGORIES];
const HERO_CAROUSEL_CATEGORIES = ['生活情報', '基督教論壇報', '人物見證'];

export default function CategoryList({ category, openArticle, initialSubCategory }: CategoryListProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部');

  // Header submenu links land here with a specific sub-category pre-selected
  // (e.g. 生活情報 → 找工作). Sync it whenever it changes, since navigating
  // between two sub-categories of the same category doesn't remount this page.
  useEffect(() => {
    const validSubCategories = category === '生活情報'
      ? LIFE_SUB_CATEGORIES
      : category === '基督教論壇報'
      ? FORUM_SUB_CATEGORIES
      : null;
    setSelectedSubCategory(
      initialSubCategory && validSubCategories?.includes(initialSubCategory) ? initialSubCategory : '全部'
    );
  }, [category, initialSubCategory]);
  const { data, error, isLoading, reload } = useAsyncData(
    `news-category:${category}`,
    async (signal) => {
      const [allCategoryNews, infeedAd] = await Promise.all([
        getNewsByCategory(category, { signal }),
        getAd('infeed', { signal }).catch(() => undefined),
      ]);
      return { allCategoryNews, infeedAd };
    },
    null,
  );
  const allCategoryNews = data?.allCategoryNews ?? [];
  const featuredArticles = allCategoryNews.slice(0, 4);

  let filteredNews = [...allCategoryNews];
  if ((category === '生活情報' || category === '基督教論壇報') && selectedSubCategory !== '全部') {
    filteredNews = filteredNews.filter(n => n.subCategory === selectedSubCategory);
  }

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;

  // Premium Layout for "生活情報"
  if (category === '生活情報') {
    return (
      <div className="pt-[190px] md:pt-[190px] pb-40 bg-theme-bg text-theme-text transition-colors duration-500 min-h-screen">
        
        {/* 1. Page Header */}
        <div className="px-5 md:px-12 lg:px-20 mb-10 md:mb-16">
          <div className="max-w-[1400px] mx-auto">
            <h1 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-theme-text border-b border-theme-text/10 pb-6 md:pb-8 transition-colors flex flex-col md:flex-row md:items-baseline">
              {category} 
              <span className="text-lg md:text-2xl font-display font-light text-theme-text/40 md:ml-4 tracking-widest uppercase mt-1 md:mt-0">Life Info</span>
            </h1>
          </div>
        </div>

        <div className="px-5 md:px-12 lg:px-20 mb-20 md:mb-32">
          <div className="max-w-[1400px] mx-auto">
            <SummitBanner />
          </div>
        </div>

        {/* 2. Featured Carousel */}
        <div className="px-5 md:px-12 lg:px-20 mb-20 md:mb-32">
          <FeaturedCarousel articles={featuredArticles} openArticle={openArticle} />
        </div>

        {/* 3. Sub-category Navigation - Optimized for Mobile Scrolling */}
        <div className="px-0 md:px-12 lg:px-20 mb-10 md:mb-20">
          <div className="max-w-[1400px] mx-auto overflow-x-auto flex flex-nowrap gap-4 md:gap-8 border-b border-theme-text/10 pb-6 transition-colors scrollbar-hide px-5 md:px-0 snap-x">
            {LIFE_SUB_CATEGORIES.map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedSubCategory(tab)}
                className={`relative py-3 px-6 text-sm md:text-base font-bold tracking-widest transition-all rounded-sm whitespace-nowrap snap-center ${
                  selectedSubCategory === tab 
                    ? 'bg-theme-text text-theme-bg shadow-lg scale-105' 
                    : 'text-theme-text/40 hover:text-theme-text hover:bg-theme-text/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}} />
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
                <div className="relative aspect-[832/470] overflow-hidden rounded-sm mb-6 bg-theme-text/5 transition-colors">
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
      
      <SummitBanner className="mb-12 md:mb-20" />

      {HERO_CAROUSEL_CATEGORIES.includes(category) && featuredArticles.length > 0 && (
        <div className="mb-12 md:mb-20">
          <FeaturedCarousel articles={featuredArticles} openArticle={openArticle} categoryLabel={category} />
        </div>
      )}

      {category === '基督教論壇報' && (
        <div className="-mx-5 md:mx-0 mb-10 md:mb-16">
          <div className="overflow-x-auto flex flex-nowrap gap-3 md:gap-4 border-b border-theme-text/10 pb-6 scrollbar-hide px-5 md:px-0 snap-x">
            {FORUM_SUB_CATEGORIES.map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedSubCategory(tab)}
                className={`shrink-0 py-2.5 px-5 text-xs md:text-sm font-bold tracking-widest transition-all rounded-full whitespace-nowrap snap-center ${
                  selectedSubCategory === tab
                    ? 'bg-theme-text text-theme-bg shadow-lg'
                    : 'text-theme-text/40 border border-theme-text/15 hover:text-theme-text hover:bg-theme-text/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />
        </div>
      )}

      <div className="flex flex-col border-t border-theme-text/10 transition-colors">
        {filteredNews.length > 0 ? (
          filteredNews.map((news, index) => (
            <Fragment key={news.id}>
              {index === 2 && data?.infeedAd && (
                <div className="py-6 md:py-8 border-b border-theme-text/10">
                  <NativeAdCard ad={data.infeedAd} />
                </div>
              )}
              <button type="button" className="w-full text-left flex flex-col md:flex-row md:items-start gap-4 md:gap-12 py-6 md:py-8 border-b border-theme-text/10 group cursor-pointer hover:bg-theme-text/5 transition-colors duration-500 md:px-6 md:-mx-6" onClick={() => openArticle(news.id)}>
                <div className="w-full md:w-[45%] lg:w-1/2 aspect-[832/470] bg-theme-text/10 overflow-hidden relative border border-theme-text/5 transition-colors rounded-sm shrink-0">
                  <img src={news.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-700" alt={news.title} />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-brand-red text-white text-[10px] font-display uppercase tracking-widest px-2 py-1 shadow-md">
                    {news.subCategory || news.category}
                  </div>
                </div>
                <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col justify-center mt-2 md:mt-0">
                  <h2 className="text-[22px] sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black mb-3 text-theme-text group-hover:text-brand-red transition-colors leading-[1.4] md:leading-tight tracking-wide md:tracking-normal">{news.title}</h2>
                  <p className="text-sm md:text-lg font-light text-theme-text/70 mb-4 line-clamp-2 md:line-clamp-3 transition-colors leading-relaxed">{news.excerpt}</p>
                  <div className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/50 mt-auto flex items-center gap-3 transition-colors">
                    <span>By <span className="text-theme-text/80 transition-colors">{news.author}</span></span>
                    <span className="w-1 h-1 bg-theme-text/20 rounded-full transition-colors"></span>
                    <span>{news.date}, 2026</span>
                  </div>
                </div>
              </button>
            </Fragment>
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
