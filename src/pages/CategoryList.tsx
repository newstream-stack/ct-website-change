import { Fragment, useEffect, useState } from 'react';
import { getNewsByCategory } from '../api/news';
import { getAd } from '../api/ads';

import NativeAdCard from '../components/NativeAdCard';
import StickySidebarAd from '../components/StickySidebarAd';
import AsyncPageState from '../components/AsyncPageState';
import SummitBanner from '../components/SummitBanner';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useAsyncData } from '../hooks/useAsyncData';
import { CT_FORUM_SUBCATEGORIES } from '../data/forumSubCategories';
import { formatArticleDate } from '../utils/date';

interface CategoryListProps {
  category: string;
  openArticle: (id: number) => void;
  initialSubCategory?: string | null;
}

const LIFE_SUB_CATEGORIES = ['全部', '找工作', '找服務', '找學習', '找活動', '論壇消息', '桌布'];
const FORUM_SUB_CATEGORIES = ['全部', ...CT_FORUM_SUBCATEGORIES];
const HERO_CAROUSEL_CATEGORIES = ['生活情報', '基督教論壇報', '人物見證'];

const CATEGORY_ENGLISH_LABELS: Record<string, string> = {
  '最新文章': 'Latest News',
  '基督教論壇報': 'Christian Tribune',
  '人物見證': 'Testimonies',
};

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
      const [allCategoryNews, infeedAd, sidebarAd] = await Promise.all([
        getNewsByCategory(category, { signal }),
        getAd('infeed', { signal }).catch(() => undefined),
        getAd('sidebar', { signal }).catch(() => undefined),
      ]);
      return { allCategoryNews, infeedAd, sidebarAd };
    },
    null,
  );
  const allCategoryNews = data?.allCategoryNews ?? [];
  const featuredArticles = allCategoryNews.slice(0, 3);
  const popularNews = allCategoryNews.slice(0, 5);

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
        <div className="px-5 md:px-12 lg:px-20 mb-8 md:mb-12">
          <div className="max-w-[1400px] mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-theme-text border-b border-theme-text/15 pb-5 md:pb-6 transition-colors flex flex-col md:flex-row md:items-baseline">
              {category} 
              <span className="text-sm md:text-base font-display font-light text-theme-text/40 md:ml-4 tracking-[0.25em] uppercase mt-2 md:mt-0">Life Info</span>
            </h1>
          </div>
        </div>

        <div className="px-5 md:px-12 lg:px-20 mb-12 md:mb-20">
          <div className="max-w-[1400px] mx-auto">
            <SummitBanner />
          </div>
        </div>

        {/* 2. Featured Carousel */}
        <div className="px-5 md:px-12 lg:px-20 mb-12 md:mb-20">
          <FeaturedCarousel articles={featuredArticles} openArticle={openArticle} />
        </div>

        {/* 3. Sub-category Navigation - Optimized for Mobile Scrolling */}
        <div className="px-0 md:px-12 lg:px-20 mb-8 md:mb-12">
          <div className="max-w-[1400px] mx-auto overflow-x-auto flex flex-nowrap gap-4 md:gap-8 border-b border-theme-text/10 pb-6 transition-colors scrollbar-hide px-5 md:px-0 snap-x">
            {LIFE_SUB_CATEGORIES.map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedSubCategory(tab)}
                className={`relative -mb-6 border-b-2 py-3 px-1 text-sm md:text-base font-bold tracking-wide transition-colors whitespace-nowrap snap-center ${
                  selectedSubCategory === tab 
                    ? 'border-brand-red text-theme-text' 
                    : 'border-transparent text-theme-text/40 hover:text-theme-text'
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
        <div className="px-5 md:px-12 lg:px-20 mb-24">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-x-10 lg:gap-y-12">
            {filteredNews.map((news) => (
              <div 
                key={news.id} 
                className="group flex flex-col cursor-pointer"
                onClick={() => openArticle(news.id)}
              >
                <div className="relative aspect-[832/470] overflow-hidden mb-5 bg-theme-text/5 transition-colors">
                  <img 
                    src={news.imageUrl} 
                    className="w-full h-full object-cover" 
                    alt={news.title} 
                  />
                  <div className="absolute top-0 left-0 bg-brand-red text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1">
                    {news.subCategory || news.category}
                  </div>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-bold text-theme-text mb-3 group-hover:text-brand-red transition-colors leading-snug">
                  {news.title}
                </h3>
                <p className="text-theme-text/60 text-sm font-light leading-relaxed line-clamp-3 mb-5">
                  {news.excerpt}
                </p>
                <div className="mt-auto pt-3 border-t border-theme-text/10 flex items-center justify-between transition-colors">
                  <span className="text-[10px] font-bold text-theme-text/40 tracking-widest uppercase">
                    {news.author}
                  </span>
                  <i className="fas fa-arrow-right text-[10px] text-theme-text/20 group-hover:text-brand-red transition-colors"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Mission/Quote Section */}
        <div className="w-full py-20 md:py-24 bg-theme-text/5 border-y border-theme-text/10 relative overflow-hidden transition-colors">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif text-theme-text/5 leading-none pointer-events-none select-none">
            LIFE
          </div>
          <div className="max-w-[1400px] mx-auto px-5 text-center relative z-10">
            <h2 className="text-xl md:text-3xl font-serif font-bold text-theme-text leading-relaxed max-w-3xl mx-auto">
              「生活即是事奉，美學即是禮拜。在日常的瑣碎中，尋見上帝隱藏的溫暖與真理。」
            </h2>
            <div className="w-12 h-px bg-brand-red mx-auto mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default Standard Layout for other categories
  return (
    <div className="pt-[190px] md:pt-48 pb-24 px-5 md:px-12 lg:px-20 min-h-screen bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-theme-text border-b border-theme-text/15 pb-5 md:pb-6 transition-colors flex flex-col md:flex-row md:items-baseline">
            {category}
            {CATEGORY_ENGLISH_LABELS[category] && (
              <span className="text-sm md:text-base font-display font-light text-theme-text/40 md:ml-4 tracking-[0.25em] uppercase mt-2 md:mt-0">{CATEGORY_ENGLISH_LABELS[category]}</span>
            )}
          </h1>
        </div>

        <SummitBanner className="mb-12 md:mb-20" />

        {HERO_CAROUSEL_CATEGORIES.includes(category) && featuredArticles.length > 0 && (
          <div className="mb-12 md:mb-20">
            <FeaturedCarousel articles={featuredArticles} openArticle={openArticle} categoryLabel={category} />
          </div>
        )}

        {category === '基督教論壇報' && (
          <div className="-mx-5 md:mx-0 mb-8 md:mb-12">
            <div className="overflow-x-auto flex flex-nowrap gap-3 md:gap-4 border-b border-theme-text/10 pb-6 scrollbar-hide px-5 md:px-0 snap-x">
              {FORUM_SUB_CATEGORIES.map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedSubCategory(tab)}
                  className={`shrink-0 -mb-6 border-b-2 py-2.5 px-1 text-xs md:text-sm font-bold tracking-wide transition-colors whitespace-nowrap snap-center ${
                    selectedSubCategory === tab
                      ? 'border-brand-red text-theme-text'
                      : 'border-transparent text-theme-text/40 hover:text-theme-text'
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          <div className="lg:col-span-8 flex flex-col border-t border-theme-text/10 transition-colors">
            {filteredNews.length > 0 ? (
              filteredNews.map((news, index) => (
                <Fragment key={news.id}>
                  {index === 2 && data?.infeedAd && (
                    <div className="py-6 md:py-8 border-b border-theme-text/10">
                      <NativeAdCard ad={data.infeedAd} />
                    </div>
                  )}
                  <button type="button" className="w-full text-left flex flex-col md:flex-row md:items-start gap-4 md:gap-10 py-6 md:py-7 border-b border-theme-text/10 group cursor-pointer transition-colors md:px-6 md:-mx-6" onClick={() => openArticle(news.id)}>
                    <div className="w-full md:w-[45%] lg:w-1/2 aspect-[832/470] bg-theme-text/10 overflow-hidden relative transition-colors shrink-0">
                      <img src={news.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={news.title} />
                      <div className="absolute top-0 left-0 bg-brand-red text-white text-[10px] font-display uppercase tracking-widest px-2 py-1">
                        {news.subCategory || news.category}
                      </div>
                    </div>
                    <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col justify-center mt-2 md:mt-0">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold mb-3 text-theme-text group-hover:text-brand-red transition-colors leading-[1.4] md:leading-snug tracking-normal">{news.title}</h2>
                      <p className="text-sm md:text-base font-light text-theme-text/70 mb-4 line-clamp-2 md:line-clamp-3 transition-colors leading-relaxed">{news.excerpt}</p>
                      <div className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/50 mt-auto flex items-center gap-3 transition-colors">
                        <span className="text-theme-text/80 transition-colors">{news.author}</span>
                        <span className="w-1 h-1 bg-theme-text/20 rounded-full transition-colors"></span>
                        <span>{formatArticleDate(news.date, { withYear: true })}</span>
                      </div>
                    </div>
                  </button>
                </Fragment>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-theme-text/40 font-display uppercase tracking-widest">此分類目前沒有文章。</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-10 md:space-y-12">
            {popularNews.length > 0 && (
              <div className="border-t-2 border-theme-text pt-4 transition-colors">
                <h4 className="font-serif text-base md:text-lg font-bold text-theme-text mb-5 pb-3 border-b border-theme-text/10 transition-colors">
                  熱門文章
                </h4>
                <div className="flex flex-col gap-5">
                  {popularNews.map((n, i) => (
                    <button type="button" key={n.id} className="w-full text-left flex items-start gap-4 cursor-pointer group" onClick={() => openArticle(n.id)}>
                      <span className="font-serif font-bold text-xl md:text-2xl text-theme-text/25 group-hover:text-brand-red transition-colors leading-none shrink-0 w-7">{String(i + 1).padStart(2, '0')}</span>
                      <h5 className="font-serif font-bold text-sm md:text-base text-theme-text leading-snug group-hover:text-brand-red transition-colors line-clamp-3">{n.title}</h5>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {data?.sidebarAd && <StickySidebarAd ad={data.sidebarAd} />}
          </div>
        </div>
      </div>
    </div>
  );
}
