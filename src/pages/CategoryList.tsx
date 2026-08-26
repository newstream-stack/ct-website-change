import { Fragment, useEffect, useState } from 'react';
import type { NewsItem } from '../types';
import { getNewsByCategory, getPopularNews } from '../api/news';
import { getAd } from '../api/ads';

import NativeAdCard from '../components/NativeAdCard';
import StickySidebarAd from '../components/StickySidebarAd';
import PopularArticleList from '../components/PopularArticleList';
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

// 生活情報的子分類必須與 Header 的 CATEGORY_SUBMENUS 一致，否則點選單會靜默落回「全部」
const LIFE_SUB_CATEGORIES = ['全部', '找工作', '找服務', '找學習', '找活動', '論壇消息', '桌布'];
const FORUM_SUB_CATEGORIES = ['全部', ...CT_FORUM_SUBCATEGORIES];
const SUB_CATEGORY_TABS: Record<string, string[]> = {
  '生活情報': LIFE_SUB_CATEGORIES,
  '基督教論壇報': FORUM_SUB_CATEGORIES,
};

const HERO_CAROUSEL_CATEGORIES = ['生活情報', '基督教論壇報', '人物見證'];
// 生活情報走雜誌式格狀版面（無側欄），其餘分類走列表 + 側欄版面
const MAGAZINE_CATEGORY = '生活情報';

const CATEGORY_ENGLISH_LABELS: Record<string, string> = {
  '最新文章': 'Latest News',
  '基督教論壇報': 'Christian Tribune',
  '人物見證': 'Testimonies',
  '生活情報': 'Life Info',
};

// ─── Shared pieces ───────────────────────────────────────────────────────────

function CategoryHeading({ category }: { category: string }) {
  return (
    <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-theme-text border-b border-theme-text/15 pb-5 md:pb-6 flex flex-col md:flex-row md:items-baseline">
      {category}
      {CATEGORY_ENGLISH_LABELS[category] && (
        <span className="text-sm md:text-base font-display font-light text-theme-text/40 md:ml-4 tracking-[0.25em] uppercase mt-2 md:mt-0">
          {CATEGORY_ENGLISH_LABELS[category]}
        </span>
      )}
    </h1>
  );
}

interface SubCategoryTabsProps {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
}

function SubCategoryTabs({ tabs, selected, onSelect }: SubCategoryTabsProps) {
  return (
    <div className="overflow-x-auto flex flex-nowrap gap-4 md:gap-8 border-b border-theme-text/10 pb-6 hide-scrollbar px-5 md:px-0 snap-x">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelect(tab)}
          className={`shrink-0 -mb-6 border-b-2 py-3 px-1 text-sm md:text-base font-bold tracking-wide transition-colors whitespace-nowrap snap-center cursor-pointer ${
            selected === tab
              ? 'border-brand-red text-theme-text'
              : 'border-transparent text-theme-text/40 hover:text-theme-text'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function EmptyNotice() {
  return (
    <div className="py-20 text-center">
      <p className="text-theme-text/40 font-display uppercase tracking-widest">此分類目前沒有文章。</p>
    </div>
  );
}

interface ArticleProps {
  news: NewsItem;
  openArticle: (id: number) => void;
}

/** 雜誌式格狀卡片（生活情報） */
function MagazineCard({ news, openArticle }: ArticleProps) {
  return (
    <button type="button" className="group flex flex-col text-left cursor-pointer" onClick={() => openArticle(news.id)}>
      <div className="relative aspect-[832/470] overflow-hidden mb-5 bg-theme-text/5">
        <img src={news.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={news.title} />
        <div className="absolute top-0 left-0 bg-brand-red text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1">
          {news.subCategory || news.category}
        </div>
      </div>
      <h3 className="font-serif text-lg md:text-xl font-bold text-theme-text mb-3 group-hover:text-brand-red transition-colors leading-snug">
        {news.title}
      </h3>
      <p className="text-theme-text/60 text-sm font-light leading-relaxed line-clamp-3 mb-5">{news.excerpt}</p>
      <div className="mt-auto pt-3 border-t border-theme-text/10 flex items-center justify-between gap-3">
        <span className="font-display text-[10px] font-bold text-theme-text/40 tracking-widest uppercase truncate">{news.author}</span>
        <span className="font-display text-[10px] font-bold text-theme-text/40 tracking-widest uppercase shrink-0">
          {formatArticleDate(news.date, { withYear: true })}
        </span>
      </div>
    </button>
  );
}

/** 圖文並排列表列（其餘分類） */
function ArticleRow({ news, openArticle }: ArticleProps) {
  return (
    <button
      type="button"
      className="w-full text-left flex flex-col md:flex-row md:items-start gap-4 md:gap-10 py-6 md:py-7 border-b border-theme-text/10 group cursor-pointer md:px-6 md:-mx-6"
      onClick={() => openArticle(news.id)}
    >
      <div className="w-full md:w-[45%] lg:w-1/2 aspect-[832/470] bg-theme-text/10 overflow-hidden relative shrink-0">
        <img src={news.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={news.title} />
        <div className="absolute top-0 left-0 bg-brand-red text-white text-[10px] font-display uppercase tracking-widest px-2 py-1">
          {news.subCategory || news.category}
        </div>
      </div>
      <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col justify-center mt-2 md:mt-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold mb-3 text-theme-text group-hover:text-brand-red transition-colors leading-[1.4] md:leading-snug tracking-normal">
          {news.title}
        </h2>
        <p className="text-sm md:text-base font-light text-theme-text/70 mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
          {news.excerpt}
        </p>
        <div className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/50 mt-auto flex items-center gap-3">
          <span className="text-theme-text/80">{news.author}</span>
          <span className="w-1 h-1 bg-theme-text/20 rounded-full" />
          <span>{formatArticleDate(news.date, { withYear: true })}</span>
        </div>
      </div>
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CategoryList({ category, openArticle, initialSubCategory }: CategoryListProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部');
  const subCategoryTabs = SUB_CATEGORY_TABS[category];
  const isMagazineLayout = category === MAGAZINE_CATEGORY;

  // Header submenu links land here with a specific sub-category pre-selected
  // (e.g. 生活情報 → 找工作). Sync it whenever it changes, since navigating
  // between two sub-categories of the same category doesn't remount this page.
  useEffect(() => {
    setSelectedSubCategory(
      initialSubCategory && subCategoryTabs?.includes(initialSubCategory) ? initialSubCategory : '全部'
    );
  }, [category, initialSubCategory, subCategoryTabs]);

  const { data, error, isLoading, reload } = useAsyncData(
    `news-category:${category}`,
    async (signal) => {
      const [allCategoryNews, infeedAd, sidebarAd, popularNews] = await Promise.all([
        getNewsByCategory(category, { signal }),
        getAd('infeed', { signal }).catch(() => undefined),
        // 雜誌版面沒有側欄，別為了不會顯示的版位多打一支請求
        isMagazineLayout ? Promise.resolve(undefined) : getAd('sidebar', { signal }).catch(() => undefined),
        isMagazineLayout ? Promise.resolve([]) : getPopularNews(category, 5, { signal }).catch(() => []),
      ]);
      return { allCategoryNews, infeedAd, sidebarAd, popularNews };
    },
    null,
  );

  const allCategoryNews = data?.allCategoryNews ?? [];
  const filteredNews = subCategoryTabs && selectedSubCategory !== '全部'
    ? allCategoryNews.filter((news) => news.subCategory === selectedSubCategory)
    : allCategoryNews;

  // 輪播是分類層級的頭條，篩了子分類就收起來；否則會出現「列表剩 1 篇、
  // 上面卻還輪播 3 篇無關文章」。展開時列表跳過已輪播的前 3 篇，避免重複。
  const showCarousel = HERO_CAROUSEL_CATEGORIES.includes(category) && selectedSubCategory === '全部';
  const heroArticles = showCarousel ? filteredNews.slice(0, 3) : [];
  const listArticles = showCarousel ? filteredNews.slice(3) : filteredNews;

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;

  // ── 雜誌式格狀版面（生活情報）────────────────────────────────────────────
  if (isMagazineLayout) {
    return (
      <div className="pt-[190px] pb-40 px-5 md:px-12 lg:px-20 bg-theme-bg text-theme-text min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 md:mb-12">
            <CategoryHeading category={category} />
          </div>

          <SummitBanner className="mb-12 md:mb-20" />

          {heroArticles.length > 0 && (
            <div className="mb-12 md:mb-20">
              <FeaturedCarousel articles={heroArticles} openArticle={openArticle} categoryLabel={category} />
            </div>
          )}

          {subCategoryTabs && (
            <div className="-mx-5 md:mx-0 mb-8 md:mb-12">
              <SubCategoryTabs tabs={subCategoryTabs} selected={selectedSubCategory} onSelect={setSelectedSubCategory} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-x-10 lg:gap-y-12">
            {listArticles.map((news, index) => (
              <Fragment key={news.id}>
                {index === 3 && data?.infeedAd && <NativeAdCard ad={data.infeedAd} />}
                <MagazineCard news={news} openArticle={openArticle} />
              </Fragment>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="border-t border-theme-text/10">
              <EmptyNotice />
            </div>
          )}

          <div className="mt-20 md:mt-24 border-t border-theme-text/10 pt-16 md:pt-20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl md:text-3xl font-serif font-bold text-theme-text leading-relaxed">
                「生活即是事奉，美學即是禮拜。在日常的瑣碎中，尋見上帝隱藏的溫暖與真理。」
              </h2>
              <div className="w-12 h-px bg-brand-red mx-auto mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 列表 + 側欄版面（其餘分類）──────────────────────────────────────────
  return (
    <div className="pt-[190px] md:pt-48 pb-24 px-5 md:px-12 lg:px-20 min-h-screen bg-theme-bg text-theme-text">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 md:mb-12">
          <CategoryHeading category={category} />
        </div>

        <SummitBanner className="mb-12 md:mb-20" />

        {heroArticles.length > 0 && (
          <div className="mb-12 md:mb-20">
            <FeaturedCarousel articles={heroArticles} openArticle={openArticle} categoryLabel={category} />
          </div>
        )}

        {subCategoryTabs && (
          <div className="-mx-5 md:mx-0 mb-8 md:mb-12">
            <SubCategoryTabs tabs={subCategoryTabs} selected={selectedSubCategory} onSelect={setSelectedSubCategory} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          <div className="lg:col-span-8 flex flex-col border-t border-theme-text/10">
            {filteredNews.length === 0 ? (
              <EmptyNotice />
            ) : (
              listArticles.map((news, index) => (
                <Fragment key={news.id}>
                  {index === 2 && data?.infeedAd && (
                    <div className="py-6 md:py-8 border-b border-theme-text/10">
                      <NativeAdCard ad={data.infeedAd} />
                    </div>
                  )}
                  <ArticleRow news={news} openArticle={openArticle} />
                </Fragment>
              ))
            )}
          </div>

          <div className="lg:col-span-4 space-y-10 md:space-y-12">
            <PopularArticleList items={data?.popularNews ?? []} openArticle={openArticle} />
            {data?.sidebarAd && <StickySidebarAd ad={data.sidebarAd} />}
          </div>
        </div>
      </div>
    </div>
  );
}
