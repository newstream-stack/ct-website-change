import { useState, useEffect } from 'react';
import { getNewsByCategory } from '../api/news';
import { getColumnists } from '../api/columnists';
import AsyncPageState from './AsyncPageState';
import SummitBanner from './SummitBanner';
import FeaturedCarousel from './FeaturedCarousel';
import { useAsyncData } from '../hooks/useAsyncData';

interface ColumnPageProps {
  openArticle: (id: number) => void;
  initialSubCategory?: string | null;
}

const COLUMN_TABS = ['好牧人', '天路客', '國度之聲'];

export default function ColumnPage({ openArticle, initialSubCategory }: ColumnPageProps) {
  const [activeTab, setActiveTab] = useState('好牧人');

  // Header submenu links (專欄 → 天路客 etc.) land here with a specific tab
  // pre-selected; sync it since switching tabs within 專欄 doesn't remount.
  useEffect(() => {
    setActiveTab(initialSubCategory && COLUMN_TABS.includes(initialSubCategory) ? initialSubCategory : '好牧人');
  }, [initialSubCategory]);

  // Get featured articles
  const { data, error, isLoading, reload } = useAsyncData(
    'column-page',
    async (signal) => {
      const [columnNews, columnists] = await Promise.all([
        getNewsByCategory('專欄', { signal }),
        getColumnists(undefined, { signal }),
      ]);
      return { columnNews, columnists };
    },
    null,
  );
  const featuredArticles = data?.columnNews.slice(0, 3) ?? [];
  const filteredColumnists = data?.columnists.filter((columnist) => columnist.subCategory === activeTab) ?? [];

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;

  return (
    <div className="pt-[190px] md:pt-[190px] pb-40 bg-theme-bg text-theme-text min-h-screen">
      
      {/* 1. Page Header */}
      <div className="px-5 md:px-12 lg:px-20 mb-10 md:mb-12">
        <div className="max-w-[1400px] mx-auto">
           <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-theme-text border-b border-theme-text/10 pb-6 md:pb-8 flex flex-col md:flex-row md:items-baseline">
             專欄 
             <span className="text-lg md:text-2xl font-display font-light text-theme-text/40 md:ml-4 tracking-widest uppercase mt-1 md:mt-0">Columns</span>
           </h1>
        </div>
      </div>

      <div className="px-5 md:px-12 lg:px-20 mb-14 md:mb-24">
        <div className="max-w-[1400px] mx-auto">
          <SummitBanner />
        </div>
      </div>

      {/* 2. Featured Columnist spotlight */}
      <div className="px-5 md:px-12 lg:px-20 mb-14 md:mb-24">
        <FeaturedCarousel
          articles={featuredArticles}
          openArticle={openArticle}
          eyebrowLabel="Editor's Choice"
          categoryLabel="Column"
          readMoreLabel="Read Full Column"
        />
      </div>

      {/* 3. Column Navigation/Tabs */}
      <div className="px-5 md:px-12 lg:px-20 mb-12 md:mb-16">
        <div className="max-w-[1400px] mx-auto flex flex-wrap gap-4 md:gap-8 border-b border-theme-text/10 pb-6">
          {['好牧人', '天路客', '國度之聲'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-3 px-6 text-sm md:text-base font-bold tracking-widest transition-all rounded-sm ${activeTab === tab ? 'bg-theme-text text-theme-bg scale-105' : 'text-theme-text/40 hover:text-theme-text hover:bg-theme-text/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Columnist Cards - Refined Grid */}
      <div className="px-5 md:px-12 lg:px-20 mb-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-16">
          {filteredColumnists.map(author => (
            <div key={author.id} className="group flex flex-col">
              {/* Profile Frame */}
              <div className="relative mb-8 flex justify-center">
                 <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-theme-text/5 p-1.5 border border-theme-text/10 group-hover:border-brand-red/40 transition-all duration-700 overflow-hidden">
                    <img src={author.avatarUrl} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full transition-all duration-700" alt={author.name} />
                 </div>
                 <div className="absolute -bottom-2 px-4 py-1.5 bg-brand-red text-white text-[9px] font-bold tracking-widest uppercase rounded-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">認證作家</div>
              </div>
              
              {/* Info */}
              <div className="text-center group">
                 <h4 className="font-serif text-xl md:text-2xl font-black text-theme-text mb-2 group-hover:text-brand-red transition-colors">{author.name}</h4>
                 <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-[10px] font-display text-theme-text/40 tracking-wider uppercase font-bold">{author.latestArticleDate}</span>
                    <span className="w-1 h-1 bg-brand-red/30 rounded-full"></span>
                    <span className="text-[10px] font-display text-theme-text/40 tracking-wider uppercase font-bold">最新</span>
                 </div>
                 <h5 
                   className="font-bold text-sm md:text-base leading-relaxed text-theme-text/80 line-clamp-2 px-4 cursor-pointer hover:text-brand-red hover:underline underline-offset-4 decoration-1 transition-all"
                   onClick={() => openArticle(author.latestArticleId)}
                 >
                   {author.latestArticleTitle}
                 </h5>
                 
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Mission Section - Quote Area */}
      <div className="w-full py-16 md:py-24 bg-theme-text/5 border-y border-theme-text/10 relative overflow-hidden mb-16 md:mb-24">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif text-theme-text/5 leading-none pointer-events-none select-none">
            VOICE
         </div>
         <div className="max-w-[1400px] mx-auto px-5 text-center relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-theme-text leading-tight max-w-4xl mx-auto italic">
              「文字是靈魂的迴響，專欄是思想的祭壇。讓我們用最真誠的筆觸，紀錄這個時代的信仰深度。」
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-12 mb-6"></div>
         </div>
      </div>

    </div>
  );
}
