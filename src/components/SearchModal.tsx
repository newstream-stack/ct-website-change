import { useState, useEffect, useRef } from 'react';
import { searchNews } from '../api/news';
import { getProducts, searchProducts } from '../api/products';
import { searchKnowledgeBase } from '../api/knowledgeBase';
import { NewsItem, Product } from '../types';
import type { KnowledgeArticle } from '../types/knowledgeBase';
import { ARCHIVE_YEARS, EARLIEST_ARCHIVE_YEAR, LATEST_ARCHIVE_YEAR } from '../mocks/knowledgeBase';
import { useAsyncData } from '../hooks/useAsyncData';
import { useKnowledgeBaseAccess } from '../hooks/useKnowledgeBaseAccess';
import { getSafeExternalUrl } from '../utils/navigation';
import { formatArticleDate } from '../utils/date';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (id: number) => void;
  onSelectProduct: (id: number) => void;
  goToCategory: (cat: string, options?: { register?: boolean }) => void;
}

const POPULAR_KEYWORDS = ['基督教', '十字架', '讀經', '奉獻', '論壇報', '杯', '手環'];

type SearchScope = 'news' | 'knowledge';

export default function SearchModal({
  isOpen,
  onClose,
  onSelectArticle,
  onSelectProduct,
  goToCategory,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('news');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [articleResults, setArticleResults] = useState<NewsItem[]>([]);
  const [knowledgeResults, setKnowledgeResults] = useState<KnowledgeArticle[]>([]);
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: featuredProducts } = useAsyncData(
    `search-featured-products:${isOpen}`,
    (signal) => isOpen ? getProducts(3, { signal }) : Promise.resolve([]),
    [],
  );
  const { isSubscribed } = useKnowledgeBaseAccess();

  // Auto focus input when modal opens
  useEffect(() => {
    let focusTimer: ReturnType<typeof setTimeout> | null = null;
    if (isOpen) {
      focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (focusTimer) clearTimeout(focusTimer);
      if (isOpen) document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Real-time search filter with debounced feel
  useEffect(() => {
    if (!query.trim()) {
      setArticleResults([]);
      setKnowledgeResults([]);
      setProductResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    setSearchError(null);
    setIsSearching(true);

    const primaryResults = scope === 'news'
      ? searchNews(query, 5, { signal: controller.signal })
      : searchKnowledgeBase(query, selectedYear ?? undefined, 5, { signal: controller.signal });

    Promise.all([
      primaryResults,
      searchProducts(query, 5, { signal: controller.signal }),
    ]).then(([primary, products]) => {
      if (scope === 'news') {
        setArticleResults(primary as NewsItem[]);
        setKnowledgeResults([]);
      } else {
        setKnowledgeResults(primary as KnowledgeArticle[]);
        setArticleResults([]);
      }
      setProductResults(products);
      setIsSearching(false);
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) {
        setSearchError(error instanceof Error ? error.message : '搜尋失敗');
        setIsSearching(false);
      }
    });

    return () => controller.abort();
  }, [query, scope, selectedYear]);

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
  };

  const handleArticleClick = (id: number) => {
    onSelectArticle(id);
    setQuery('');
    onClose();
  };

  const handleProductClick = (id: number) => {
    onSelectProduct(id);
    setQuery('');
    onClose();
  };

  const handleKnowledgeArticleClick = (article: KnowledgeArticle) => {
    if (isSubscribed) {
      const safeHref = getSafeExternalUrl(article.href);
      if (safeHref) window.open(safeHref, '_blank', 'noopener,noreferrer');
      setQuery('');
      onClose();
      return;
    }
    goToCategory('會員招募');
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="網站搜尋" className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-[10vh] px-4 md:px-8 bg-theme-bg/95 backdrop-blur-lg transition-all duration-300 animate-fade-in">
      {/* Close button top right */}
      <button 
        onClick={onClose}
        aria-label="關閉搜尋"
        className="absolute top-6 right-6 w-12 h-12 rounded-full border border-theme-text/10 flex items-center justify-center text-theme-text/60 hover:text-theme-text hover:border-theme-text/30 hover:rotate-90 transition-all duration-300 cursor-pointer z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Search Panel */}
      <div className="w-full max-w-4xl flex flex-col gap-8 animate-fade-in-up">
        {/* Large Input Area */}
        <div className="relative group">
          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-theme-text/30 text-xl group-focus-within:text-brand-red transition-colors" />
          <input
            ref={inputRef}
            type="text"
            placeholder={scope === 'news' ? '搜尋文章、新聞或信仰好物...' : '搜尋信仰知識庫或信仰好物...'}
            value={query}
            maxLength={200}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-theme-text/5 border border-theme-text/15 rounded-2xl pl-16 pr-12 py-5 text-lg md:text-2xl text-theme-text focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans font-medium placeholder-theme-text/25"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              aria-label="清除搜尋文字"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-theme-text/40 hover:text-theme-text cursor-pointer transition-colors"
            >
              <i className="fas fa-times-circle text-lg" />
            </button>
          )}
        </div>

        {/* Search Scope Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex bg-theme-text/5 rounded-full p-1">
            {([
              { value: 'news' as const, label: '最新新聞' },
              { value: 'knowledge' as const, label: '信仰知識庫' },
            ]).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => { setScope(tab.value); setSelectedYear(null); }}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors cursor-pointer ${
                  scope === tab.value ? 'bg-brand-red text-white' : 'text-theme-text/50 hover:text-theme-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {scope === 'knowledge' && (
            <div className="relative">
              <select
                value={selectedYear ?? 'all'}
                onChange={(e) => setSelectedYear(e.target.value === 'all' ? null : Number(e.target.value))}
                className="appearance-none bg-theme-text/5 border border-theme-text/15 rounded-full pl-4 pr-9 py-2 text-xs sm:text-sm font-bold text-theme-text focus:outline-none focus:border-brand-red/50 cursor-pointer"
              >
                <option value="all">全部年份</option>
                {ARCHIVE_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}{!isSubscribed ? '（訂閱解鎖）' : ''}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-theme-text/50 pointer-events-none" />
            </div>
          )}
        </div>

        {scope === 'knowledge' && !isSubscribed && (
          <p className="text-xs leading-relaxed text-theme-text/45 -mt-4">
            信仰知識庫收錄 {EARLIEST_ARCHIVE_YEAR}－{LATEST_ARCHIVE_YEAR} 年歷史報導，
            <button type="button" onClick={() => { goToCategory('會員招募'); onClose(); }} className="text-brand-red font-bold hover:underline">訂閱方案</button>
            後即可查看完整內容。
          </p>
        )}

        {/* Dynamic Content Area */}
        <div className="flex-1 min-h-[50vh] overflow-y-auto max-h-[65vh] scrollbar-hide pb-12">
          {isSearching ? (
            <div className="flex items-center justify-center py-20 gap-3 font-display text-xs font-bold uppercase tracking-widest text-theme-text/50">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" /> 搜尋中
            </div>
          ) : searchError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h4 className="font-serif font-black text-xl mb-2">搜尋暫時無法使用</h4>
              <p className="text-sm text-theme-text/50">{searchError}</p>
            </div>
          ) : !query.trim() ? (
            /* Recommendations & Popular keywords */
            <div className="flex flex-col gap-8 py-4">
              <div className="space-y-3.5 text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-theme-text/40">熱門搜尋 Popular Searches</h4>
                <div className="flex flex-wrap gap-2.5">
                  {POPULAR_KEYWORDS.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleKeywordClick(keyword)}
                      className="px-4 py-2 bg-theme-text/5 hover:bg-brand-red hover:text-white rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer active:scale-95 border border-theme-text/5"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Featured Goods */}
              <div className="space-y-4 text-left mt-4 border-t border-theme-text/5 pt-8">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-theme-text/40">精選信仰好物 Featured Goods</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {featuredProducts.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full text-left bg-theme-text/3 border border-theme-text/5 rounded-xl overflow-hidden hover:bg-theme-text/5 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                    >
                      <div className="h-28 overflow-hidden bg-theme-text/5 relative">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="p-3.5 flex flex-col flex-grow">
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-theme-text line-clamp-1 group-hover:text-brand-red transition-colors">{product.name}</h5>
                        <p className="text-[10px] text-theme-text/40 mt-0.5 line-clamp-1">{product.englishName}</p>
                        <span className="text-xs font-display font-bold text-brand-red mt-2 block">NT$ {product.price.toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : articleResults.length === 0 && knowledgeResults.length === 0 && productResults.length === 0 ? (
            /* No Results Found */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-theme-text/5 flex items-center justify-center border border-theme-text/10 text-theme-text/30 mb-6 animate-pulse">
                <i className="fas fa-search-minus text-2xl" />
              </div>
              <h4 className="font-serif font-black text-xl mb-2">查無搜尋結果</h4>
              <p className="text-sm text-theme-text/50 font-light max-w-xs leading-relaxed">
                我們找不到與「<span className="font-bold text-brand-red">{query}</span>」相關的內容。請嘗試使用其他關鍵字或減少字數。
              </p>
            </div>
          ) : (
            /* Search Results Display Split Columns */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4 text-left">
              {/* Articles / Knowledge Base (Left Column) */}
              {scope === 'news' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-theme-text/10 pb-2.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-theme-text/40">相關文章 Articles ({articleResults.length})</h4>
                  </div>
                  {articleResults.length === 0 ? (
                    <p className="text-sm text-theme-text/40 py-4 italic">無相關文章</p>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {articleResults.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => handleArticleClick(item.id)}
                          className="w-full text-left p-3.5 rounded-xl border border-theme-text/5 hover:border-brand-red/20 bg-theme-text/2 hover:bg-theme-text/5 transition-all duration-300 cursor-pointer group flex flex-col gap-1.5"
                        >
                          <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-brand-red uppercase">
                            <span>{item.category}</span>
                            <span className="text-theme-text/40 font-normal font-sans">{formatArticleDate(item.date)}</span>
                          </div>
                          <h5 className="font-bold text-sm sm:text-base text-theme-text group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h5>
                          {item.excerpt && (
                            <p className="text-xs text-theme-text/50 line-clamp-1 mt-0.5">
                              {item.excerpt}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-theme-text/10 pb-2.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-theme-text/40">信仰知識庫 Knowledge Base ({knowledgeResults.length})</h4>
                  </div>
                  {knowledgeResults.length === 0 ? (
                    <p className="text-sm text-theme-text/40 py-4 italic">無相關收錄</p>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {knowledgeResults.map((item) => {
                        const isLocked = !isSubscribed;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => handleKnowledgeArticleClick(item)}
                            className="w-full text-left p-3.5 rounded-xl border border-theme-text/5 hover:border-brand-red/20 bg-theme-text/2 hover:bg-theme-text/5 transition-all duration-300 cursor-pointer group flex flex-col gap-1.5"
                          >
                            <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-brand-red uppercase">
                              <span>{item.source}</span>
                              <span className="text-theme-text/40 font-normal font-sans">{formatArticleDate(item.date)}</span>
                            </div>
                            <h5 className="font-bold text-sm sm:text-base text-theme-text group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h5>
                            <span className="text-xs text-theme-text/50 mt-0.5 flex items-center gap-1.5">
                              {isLocked ? (
                                <><i className="fas fa-lock text-[10px] text-brand-red" /> 訂閱後可解鎖</>
                              ) : (
                                <>{item.author}</>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Products (Right Column) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-theme-text/10 pb-2.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-theme-text/40">信仰好物 Goods ({productResults.length})</h4>
                </div>
                {productResults.length === 0 ? (
                  <p className="text-sm text-theme-text/40 py-4 italic">無相關商品</p>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {productResults.map((product) => (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full text-left flex gap-4 p-3 rounded-xl border border-theme-text/5 hover:border-brand-red/20 bg-theme-text/2 hover:bg-theme-text/5 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="w-16 h-20 bg-theme-text/5 border border-theme-text/10 rounded-sm overflow-hidden flex-shrink-0 relative">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h5 className="font-serif font-bold text-sm text-theme-text group-hover:text-brand-red transition-colors line-clamp-1 leading-snug">
                            {product.name}
                          </h5>
                          <p className="text-[10px] text-theme-text/45 mt-0.5 uppercase tracking-wide font-sans line-clamp-1">
                            {product.englishName}
                          </p>
                          <span className="font-display font-black text-brand-red text-xs mt-2 block">
                            NT$ {product.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center pr-2 text-theme-text/20 group-hover:text-brand-red transition-colors">
                          <i className="fas fa-chevron-right text-xs" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
