import React, { useState, useEffect, useRef } from 'react';
import { MOCK_NEWS, MOCK_PRODUCTS } from '../data/index';
import { NewsItem, Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (id: number) => void;
  onSelectProduct: (id: number) => void;
}

const POPULAR_KEYWORDS = ['基督教', '十字架', '讀經', '奉獻', '論壇報', '杯', '手環'];

export default function SearchModal({
  isOpen,
  onClose,
  onSelectArticle,
  onSelectProduct
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [articleResults, setArticleResults] = useState<NewsItem[]>([]);
  const [productResults, setProductResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Real-time search filter with debounced feel
  useEffect(() => {
    if (!query.trim()) {
      setArticleResults([]);
      setProductResults([]);
      return;
    }

    const lowercaseQuery = query.toLowerCase().trim();

    // Filter News
    const filteredNews = MOCK_NEWS.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(lowercaseQuery))
    ).slice(0, 5);

    // Filter Products
    const filteredProducts = MOCK_PRODUCTS.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.englishName.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery)
    ).slice(0, 5);

    setArticleResults(filteredNews);
    setProductResults(filteredProducts);
  }, [query]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-[10vh] px-4 md:px-8 bg-theme-bg/95 backdrop-blur-lg transition-all duration-300 animate-fade-in">
      {/* Close button top right */}
      <button 
        onClick={onClose}
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
            placeholder="搜尋文章、新聞或信仰好物..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-theme-text/5 border border-theme-text/15 rounded-2xl pl-16 pr-12 py-5 text-lg md:text-2xl text-theme-text focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans font-medium placeholder-theme-text/25"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-theme-text/40 hover:text-theme-text cursor-pointer transition-colors"
            >
              <i className="fas fa-times-circle text-lg" />
            </button>
          )}
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 min-h-[50vh] overflow-y-auto max-h-[65vh] scrollbar-hide pb-12">
          {!query.trim() ? (
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
                  {MOCK_PRODUCTS.slice(0, 3).map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="bg-theme-text/3 border border-theme-text/5 rounded-xl overflow-hidden hover:bg-theme-text/5 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                    >
                      <div className="h-28 overflow-hidden bg-theme-text/5 relative">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="p-3.5 flex flex-col flex-grow">
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-theme-text line-clamp-1 group-hover:text-brand-red transition-colors">{product.name}</h5>
                        <p className="text-[10px] text-theme-text/40 mt-0.5 line-clamp-1">{product.englishName}</p>
                        <span className="text-xs font-display font-bold text-brand-red mt-2 block">NT$ {product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : articleResults.length === 0 && productResults.length === 0 ? (
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
              {/* Articles (Left Column) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-theme-text/10 pb-2.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-theme-text/40">相關文章 Articles ({articleResults.length})</h4>
                </div>
                {articleResults.length === 0 ? (
                  <p className="text-sm text-theme-text/40 py-4 italic">無相關文章</p>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {articleResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleArticleClick(item.id)}
                        className="p-3.5 rounded-xl border border-theme-text/5 hover:border-brand-red/20 bg-theme-text/2 hover:bg-theme-text/5 transition-all duration-300 cursor-pointer group flex flex-col gap-1.5"
                      >
                        <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-brand-red uppercase">
                          <span>{item.category}</span>
                          <span className="text-theme-text/40 font-normal font-sans">{item.date}</span>
                        </div>
                        <h5 className="font-bold text-sm sm:text-base text-theme-text group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h5>
                        {item.excerpt && (
                          <p className="text-xs text-theme-text/50 line-clamp-1 mt-0.5">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex gap-4 p-3 rounded-xl border border-theme-text/5 hover:border-brand-red/20 bg-theme-text/2 hover:bg-theme-text/5 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="w-16 h-20 bg-theme-text/5 border border-theme-text/10 rounded-sm overflow-hidden flex-shrink-0 relative">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
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
                      </div>
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
