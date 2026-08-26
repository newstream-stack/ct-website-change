import { Fragment, useRef } from 'react';
import { getNewsByCategory } from '../api/news';
import { getAd } from '../api/ads';
import { getColumnists } from '../api/columnists';
import NativeAdCard from '../components/NativeAdCard';
import SummitBanner from '../components/SummitBanner';
import AsyncPageState from '../components/AsyncPageState';
import { useAsyncData } from '../hooks/useAsyncData';
import { NewsItem, Columnist } from '../types';
import { formatArticleDate } from '../utils/date';

interface HomeNewsGridProps {
  openArticle: (id: number) => void;
  goToCategory: (category: string) => void;
}

// 傳統新聞入口網站版型的分區順序（跟手風琴首頁的分類組合保持一致，方便比較）
const SECTION_CATEGORIES = ['基督教論壇報', '人物見證', '專欄', '生活情報'];
const COLUMN_TABS = ['好牧人', '天路客', '國度之聲'];

const TODAY_LABEL = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

interface NewsSection {
  category: string;
  articles: NewsItem[];
}

function NewsSectionBlock({
  section,
  number,
  openArticle,
  goToCategory,
}: {
  section: NewsSection;
  number: number;
  openArticle: (id: number) => void;
  goToCategory: (category: string) => void;
}) {
  return (
    <div>
      <div className="flex items-end justify-between mb-6 md:mb-8 pb-4 border-b-2 border-theme-text">
        <div className="flex items-baseline gap-4">
          <span className="font-serif text-3xl md:text-4xl font-black text-brand-red/20 leading-none">{String(number).padStart(2, '0')}</span>
          <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-widest text-theme-text">{section.category}</h3>
        </div>
        <button
          type="button"
          onClick={() => goToCategory(section.category)}
          className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/50 hover:text-brand-red transition-colors flex items-center gap-2 shrink-0"
        >
          更多 <i className="fas fa-arrow-right text-[9px]" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {section.articles.map((news) => (
          <button
            type="button"
            key={news.id}
            className="w-full text-left flex flex-col group cursor-pointer border border-transparent hover:border-theme-text/10 transition-all duration-300 p-3 -m-3 rounded-sm"
            onClick={() => openArticle(news.id)}
          >
            <div className="relative aspect-[832/470] overflow-hidden rounded-sm mb-4 bg-theme-text/5 border border-theme-text/10">
              <img src={news.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover transition-all duration-700" alt={news.title} />
              <div className="absolute top-3 left-3 bg-theme-bg/90 text-brand-red text-[9px] font-display font-bold uppercase tracking-widest px-2 py-1">
                {news.subCategory || news.category}
              </div>
            </div>
            <h4 className="font-serif text-base md:text-lg font-black text-theme-text group-hover:text-brand-red transition-colors leading-snug mb-2 line-clamp-2">
              {news.title}
            </h4>
            <div className="mt-auto pt-3 border-t border-theme-text/5 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-widest text-theme-text/40">{news.author}</span>
              <i className="fas fa-arrow-right text-[9px] text-brand-red transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ColumnistRow({ columnists, openArticle }: { columnists: Columnist[]; openArticle: (id: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (delta: number) => scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' });

  return (
    <div className="relative group/row">
      <div ref={scrollRef} className="flex gap-5 md:gap-6 overflow-x-auto hide-scrollbar scroll-smooth snap-x px-1 py-1">
        {columnists.map((c) => (
          <button
            type="button"
            key={c.id}
            onClick={() => openArticle(c.latestArticleId)}
            className="shrink-0 w-[200px] md:w-[220px] snap-start text-left group/card border border-theme-text/10 hover:border-brand-red/30 transition-all duration-300 rounded-sm p-5 bg-theme-bg"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border border-theme-text/10 mb-4 bg-theme-text/5">
              <img src={c.avatarUrl} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt={c.name} />
            </div>
            <h5 className="font-serif font-black text-base text-theme-text group-hover/card:text-brand-red transition-colors mb-2">{c.name}</h5>
            <span className="text-[9px] font-display uppercase tracking-widest text-brand-red/70 block mb-1.5">最新文章</span>
            <p className="text-xs text-theme-text/70 leading-relaxed line-clamp-2">{c.latestArticleTitle}</p>
          </button>
        ))}
      </div>
      {columnists.length > 3 && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-240)}
            aria-label="往前看更多專欄作家"
            className="hidden md:flex absolute -left-4 top-[52px] w-9 h-9 rounded-full bg-theme-bg border border-theme-text/15 items-center justify-center text-theme-text/60 hover:text-brand-red hover:border-brand-red transition-all opacity-0 group-hover/row:opacity-100"
          >
            <i className="fas fa-chevron-left text-xs" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(240)}
            aria-label="往後看更多專欄作家"
            className="hidden md:flex absolute -right-4 top-[52px] w-9 h-9 rounded-full bg-theme-bg border border-theme-text/15 items-center justify-center text-theme-text/60 hover:text-brand-red hover:border-brand-red transition-all opacity-0 group-hover/row:opacity-100"
          >
            <i className="fas fa-chevron-right text-xs" />
          </button>
        </>
      )}
    </div>
  );
}

export default function HomeNewsGrid({ openArticle, goToCategory }: HomeNewsGridProps) {
  const { data, error, isLoading, reload } = useAsyncData(
    'home-news-grid',
    async (signal) => {
      const [latest, sections, infeedAd, columnistGroups] = await Promise.all([
        getNewsByCategory('最新文章', { signal }),
        Promise.all(SECTION_CATEGORIES.map((cat) => getNewsByCategory(cat, { signal }))),
        getAd('infeed', { signal }).catch(() => undefined),
        Promise.all(COLUMN_TABS.map((tab) => getColumnists(tab, { signal }))),
      ]);
      return { latest, sections, infeedAd, columnistGroups };
    },
    null,
  );

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;
  if (!data || data.latest.length === 0) {
    return <div className="min-h-[100dvh] pt-[190px] flex items-center justify-center bg-theme-bg text-theme-text text-sm text-theme-text/55">目前沒有可顯示的文章</div>;
  }

  const [leadStory, ...secondaryStories] = data.latest;
  const headlineList = secondaryStories.slice(0, 5);
  const sections = SECTION_CATEGORIES
    .map((category, i) => ({ category, articles: data.sections[i].slice(0, 6) }))
    .filter((section) => section.articles.length > 0);
  const columnistGroups = COLUMN_TABS
    .map((tab, i) => ({ tab, columnists: data.columnistGroups[i] }))
    .filter((group) => group.columnists.length > 0);
  const leadingSections = sections.slice(0, -1);
  const lastSection = sections.length > 0 ? sections[sections.length - 1] : null;

  return (
    <div className="pt-[190px] md:pt-48 pb-24 px-5 md:px-12 lg:px-20 min-h-screen bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto">
        {/* Masthead */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center justify-between font-display text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-theme-text/40 pb-4 border-b border-theme-text/15">
            <span>EST. 1965 · IMPACT</span>
            <span>{TODAY_LABEL}</span>
          </div>
          <div className="text-center py-8 md:py-10 border-b-4 border-theme-text">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black tracking-[0.05em] text-theme-text">
              今日焦點
            </h1>
            <p className="mt-3 font-display text-xs md:text-sm font-light text-theme-text/40 tracking-[0.5em] uppercase">
              Today's Headlines
            </p>
          </div>
        </div>

        {/* Hero: lead story + headline list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-12 md:mb-20 border border-theme-text/10">
          <button
            type="button"
            className="lg:col-span-7 w-full text-left group cursor-pointer p-6 md:p-10"
            onClick={() => openArticle(leadStory.id)}
          >
            <div className="relative aspect-[832/470] overflow-hidden rounded-sm mb-5 bg-theme-text/5 border border-theme-text/10">
              <img src={leadStory.imageUrl} loading="eager" decoding="async" className="w-full h-full object-cover transition-all duration-700" alt={leadStory.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-brand-red text-white text-[10px] font-display font-bold uppercase tracking-widest px-2.5 py-1">頭條</span>
                <span className="bg-black/50 text-white text-[10px] font-display uppercase tracking-widest px-2.5 py-1">
                  {leadStory.subCategory || leadStory.category}
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black mb-3 text-theme-text group-hover:text-brand-red transition-colors leading-tight">
              {leadStory.title}
            </h2>
            <p className="text-sm md:text-base font-light text-theme-text/70 line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed">
              {leadStory.excerpt}
            </p>
            <div className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/50 flex items-center gap-3">
              <span className="text-theme-text/80">{leadStory.author}</span>
              <span className="w-1 h-1 bg-theme-text/20 rounded-full" />
              <span>{formatArticleDate(leadStory.date, { withYear: true })}</span>
              <span className="ml-auto text-brand-red opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                閱讀全文 <i className="fas fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>

          <div className="lg:col-span-5 flex flex-col divide-y divide-theme-text/10 bg-theme-text/[0.03] border-t lg:border-t-0 lg:border-l border-theme-text/10 p-6 md:p-8">
            <h3 className="font-display text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-brand-red mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full" /> 即時要聞
            </h3>
            {headlineList.map((news, i) => (
              <button
                type="button"
                key={news.id}
                className="w-full text-left flex items-start gap-4 py-4 first:pt-0 last:pb-0 group cursor-pointer"
                onClick={() => openArticle(news.id)}
              >
                <span className="font-serif font-black text-xl text-theme-text/15 group-hover:text-brand-red/50 transition-colors leading-none shrink-0 w-6 pt-1">{String(i + 1).padStart(2, '0')}</span>
                <div className="w-20 h-14 md:w-24 md:h-16 shrink-0 overflow-hidden rounded-sm border border-theme-text/10 bg-theme-text/5">
                  <img src={news.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover transition-all duration-700" alt={news.title} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-display uppercase tracking-widest text-brand-red block mb-1.5">{news.subCategory || news.category}</span>
                  <h3 className="font-serif font-bold text-sm md:text-base leading-snug text-theme-text group-hover:text-brand-red transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12 md:mb-20">
          <SummitBanner />
        </div>

        {/* Sections — 專欄作家跟最後一個分類（生活情報）對調順序 */}
        <div className="flex flex-col gap-12 md:gap-20">
          {leadingSections.map((section, sIndex) => (
            <Fragment key={section.category}>
              <NewsSectionBlock section={section} number={sIndex + 1} openArticle={openArticle} goToCategory={goToCategory} />
              {sIndex === 0 && data.infeedAd && (
                <div className="max-w-2xl mx-auto w-full">
                  <NativeAdCard ad={data.infeedAd} />
                </div>
              )}
            </Fragment>
          ))}

          {columnistGroups.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-6 md:mb-8 pb-4 border-b-2 border-theme-text">
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-3xl md:text-4xl font-black text-brand-red/20 leading-none">{String(leadingSections.length + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-widest text-theme-text">專欄作家</h3>
                </div>
                <button
                  type="button"
                  onClick={() => goToCategory('專欄')}
                  className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/50 hover:text-brand-red transition-colors flex items-center gap-2 shrink-0"
                >
                  更多 <i className="fas fa-arrow-right text-[9px]" />
                </button>
              </div>
              <div className="flex flex-col gap-10 md:gap-12">
                {columnistGroups.map((group) => (
                  <div key={group.tab}>
                    <h4 className="font-display text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-brand-red mb-4">{group.tab}</h4>
                    <ColumnistRow columnists={group.columnists} openArticle={openArticle} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastSection && (
            <NewsSectionBlock
              section={lastSection}
              number={leadingSections.length + (columnistGroups.length > 0 ? 2 : 1)}
              openArticle={openArticle}
              goToCategory={goToCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
}
