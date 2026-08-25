import { useEffect, useRef, useState } from 'react';
import { NEWS_CATEGORIES } from '../api/news';
import { getAd } from '../api/ads';
import { CartItem } from '../types';
import { useAsyncData } from '../hooks/useAsyncData';
import { CT_FORUM_SUBCATEGORIES } from '../data/forumSubCategories';

const CATEGORY_SUBMENUS: Record<string, string[]> = {
  '基督教論壇報': CT_FORUM_SUBCATEGORIES,
  '專欄': ['好牧人', '天路客', '國度之聲'],
  '生活情報': ['找工作', '找服務', '找學習', '找活動', '論壇消息', '桌布'],
};

interface HeaderProps {
  user: { name: string; email: string } | null;
  goToCategory: (cat: string, options?: { register?: boolean; subCategory?: string }) => void;
  showCategoryBar: boolean;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export default function Header({ 
  user,
  goToCategory, 
  showCategoryBar,
  cartItems,
  onOpenCart,
  onOpenSearch
}: HeaderProps) {
  const { data: headerAd } = useAsyncData('header-ad', (signal) => getAd('header', { signal }), undefined);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openSubmenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryBarRef.current && !categoryBarRef.current.contains(e.target as Node)) {
        setOpenSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openSubmenu]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex flex-col pointer-events-auto bg-theme-bg/95 backdrop-blur-md border-b border-theme-text/10 transition-colors duration-500 pb-1">
      {headerAd && (
        <button onClick={() => goToCategory('會員招募')} className="w-full bg-brand-red text-white py-1.5 md:py-2 px-4 text-center text-[10px] md:text-xs font-display tracking-widest uppercase hover:bg-theme-text transition-colors duration-300 pointer-events-auto flex items-center justify-center gap-2 md:gap-4 relative group border-none outline-none appearance-none cursor-pointer">
          <span className="font-bold opacity-80 border border-white/30 px-1.5 py-0.5 text-[8px] md:text-[9px] rounded-sm">{headerAd.sponsor}</span>
          <span className="font-serif tracking-wider font-bold mb-0.5">{headerAd.title}</span>
          <i className="fas fa-arrow-right ml-1 md:ml-2 transform group-hover:translate-x-1 transition-transform text-[10px]"></i>
        </button>
      )}
      
      <div className="p-3 px-5 md:p-6 flex justify-between items-center text-theme-text w-full transition-colors duration-500">
        <button
          type="button"
          aria-label="回到首頁"
          onClick={() => goToCategory('首頁')}
          className="relative isolate flex h-9 w-[104px] shrink-0 cursor-pointer items-center border-0 bg-transparent p-0 text-left md:h-10 md:w-40"
        >
          <img src="/S__86589483.png" alt="IMPACT 論壇報" decoding="async" fetchPriority="high" className="pointer-events-none md:hidden h-full w-full object-contain object-left" />
          <img src="/S__86589483-original.png" alt="IMPACT 論壇報" decoding="async" fetchPriority="high" className="pointer-events-none hidden md:block h-10 w-auto object-contain origin-left scale-[5.2] translate-y-3" />
        </button>

        <div className="flex items-center gap-3 md:gap-6 pointer-events-auto whitespace-nowrap">
          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 font-sans font-bold text-sm tracking-widest text-theme-text/90">
            <button onClick={() => goToCategory('奉獻')} className="text-brand-red hover:text-theme-text transition flex items-center gap-2 border border-brand-red px-4 py-1.5 rounded-full">奉獻 <i className="fas fa-arrow-right text-[10px]"></i></button>
            <button onClick={() => goToCategory('信仰好物')} className="hover:text-brand-red transition">信仰好物</button>
            <button onClick={() => goToCategory('全版閱讀')} className="hover:text-brand-red transition">全版閱讀</button>
          </div>
          <div className="w-px h-5 bg-theme-text/30 hidden md:block transition-colors duration-500"></div>

          {/* Mobile compact CTA (奉獻) */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => goToCategory('奉獻')} title="奉獻" className="text-brand-red hover:text-theme-text transition flex items-center cursor-pointer">
              <i className="fas fa-hand-holding-heart text-lg"></i>
            </button>
          </div>
          <div className="w-px h-4 bg-theme-text/30 md:hidden transition-colors duration-500"></div>

          {/* Login / Member Dashboard */}
          {user ? (
            <button 
              className="font-display font-bold text-sm uppercase tracking-widest hover:text-brand-red transition-colors duration-300 flex items-center gap-1.5 cursor-pointer" 
              onClick={() => goToCategory('會員專區')} 
              title="會員專區"
            >
              <i className="far fa-user text-brand-red"></i>
              <span className="hidden md:block truncate max-w-[80px]">{user.name || 'Member'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                className="font-display font-bold text-lg md:text-sm uppercase tracking-widest hover:text-brand-red transition-colors duration-300 flex items-center cursor-pointer" 
                onClick={() => goToCategory('會員中心')} 
                title="登入"
              >
                <i className="far fa-user md:hidden"></i>
                <span className="hidden md:block">登入</span>
              </button>
              <span className="hidden md:inline text-theme-text/30 text-xs">/</span>
              <button
                className="hidden md:block font-display font-bold text-sm uppercase tracking-widest text-brand-red hover:text-brand-red/80 transition-colors duration-300 cursor-pointer"
                onClick={() => goToCategory('會員中心', { register: true })}
              >
                註冊
              </button>
            </div>
          )}
          
          <div className="w-px h-4 bg-theme-text/30 transition-colors duration-500"></div>

          {/* Cart Icon (Icon on mobile, text on desktop) */}
          <button className="font-display font-bold text-lg md:text-sm uppercase tracking-widest hover:text-brand-red transition-colors duration-300 flex items-center relative cursor-pointer" onClick={onOpenCart} title="購物車">
            <i className="fas fa-shopping-bag md:hidden"></i>
            <span className="hidden md:block">購物車</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-red text-white text-[9px] font-sans font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-theme-bg shadow-sm">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </button>
          
          <div className="w-px h-4 bg-theme-text/30 transition-colors duration-500"></div>

          {/* Search Button */}
          <button className="font-display font-bold text-lg md:text-sm uppercase tracking-widest hover:text-brand-red transition-colors duration-300 flex items-center relative cursor-pointer" onClick={onOpenSearch} title="全站搜尋">
            <i className="fas fa-search md:hidden"></i>
            <span className="hidden md:block">搜尋</span>
          </button>

          {/* Mobile Hamburger Menu (全版閱讀 / 信仰好物) */}
          <div className="w-px h-4 bg-theme-text/30 md:hidden transition-colors duration-500"></div>
          <div ref={mobileMenuRef} className="relative md:hidden">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              title="更多"
              className="hover:text-brand-red transition flex items-center cursor-pointer"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>

            {mobileMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-theme-bg border border-theme-text/10 shadow-xl rounded-sm overflow-hidden transition-colors duration-500 z-50">
                <button
                  onClick={() => { goToCategory('信仰好物'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest text-left hover:bg-theme-text/5 hover:text-brand-red transition-colors"
                >
                  <i className="fas fa-gift w-4"></i>信仰好物
                </button>
                <button
                  onClick={() => { goToCategory('全版閱讀'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest text-left border-t border-theme-text/10 hover:bg-theme-text/5 hover:text-brand-red transition-colors"
                >
                  <i className="fas fa-newspaper w-4"></i>全版閱讀
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCategoryBar && (
        <div
          ref={categoryBarRef}
          className="relative w-full border-t border-theme-text/10 transition-colors duration-500"
          onMouseLeave={() => setOpenSubmenu((current) => (current ? null : current))}
        >
          <div className="max-w-[100vw] px-4 md:px-6 py-2.5 md:py-3 flex items-center gap-5 md:gap-8 overflow-x-auto hide-scrollbar font-sans font-bold text-xs md:text-sm tracking-widest text-theme-text/70 whitespace-nowrap">
            {NEWS_CATEGORIES.map(cat => {
              const submenuItems = CATEGORY_SUBMENUS[cat];
              return (
                <div
                  key={cat}
                  onMouseEnter={() => {
                    if (submenuItems) setOpenSubmenu(cat);
                  }}
                  className={`flex items-center gap-1 shrink-0 transition-colors ${openSubmenu === cat ? 'text-brand-red' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      goToCategory(cat);
                      setOpenSubmenu(null);
                    }}
                    className="cursor-pointer p-2 -m-2 transition-colors hover:text-brand-red"
                  >
                    {cat}
                  </button>
                  {submenuItems && (
                    <button
                      type="button"
                      onClick={() => setOpenSubmenu((current) => (current === cat ? null : cat))}
                      title={`展開${cat}子分類`}
                      className="cursor-pointer p-2 -m-2 transition-colors hover:text-brand-red"
                    >
                      <i className={`fas fa-chevron-down text-[8px] transition-transform ${openSubmenu === cat ? 'rotate-180' : ''}`}></i>
                    </button>
                  )}
                </div>
              );
            })}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  goToCategory('首頁2');
                  setOpenSubmenu(null);
                }}
                className="cursor-pointer p-2 -m-2 transition-colors hover:text-brand-red flex items-center gap-1.5"
              >
                首頁（新版）
                <span className="text-[9px] font-display text-brand-red border border-brand-red/40 rounded-full px-1.5 py-0.5">TEST</span>
              </button>
            </div>
          </div>

          {openSubmenu && CATEGORY_SUBMENUS[openSubmenu] && (
            <div className="absolute top-full left-0 w-full bg-theme-bg border-t border-b border-theme-text/10 shadow-xl transition-colors duration-500 z-50">
              <div className="max-w-4xl mx-auto px-6 py-6 md:py-8 grid grid-cols-3 gap-x-6 gap-y-4 font-sans font-bold text-xs md:text-sm tracking-widest text-theme-text/70">
                {CATEGORY_SUBMENUS[openSubmenu].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      goToCategory(openSubmenu, { subCategory: item });
                      setOpenSubmenu(null);
                    }}
                    className="cursor-pointer text-left hover:text-brand-red transition-colors whitespace-nowrap"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
