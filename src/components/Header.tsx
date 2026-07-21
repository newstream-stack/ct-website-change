import { NEWS_CATEGORIES } from '../api/news';
import { getAd } from '../api/ads';
import { CartItem } from '../types';
import { useAsyncData } from '../hooks/useAsyncData';

interface HeaderProps {
  user: { name: string; email: string } | null;
  goToCategory: (cat: string, options?: { register?: boolean }) => void;
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
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex flex-col pointer-events-auto bg-theme-bg/95 backdrop-blur-md border-b border-theme-text/10 transition-colors duration-500 pb-1">
      {headerAd && (
        <button onClick={() => goToCategory('會員招募')} className="w-full bg-brand-red text-white py-1.5 md:py-2 px-4 text-center text-[10px] md:text-xs font-display tracking-widest uppercase hover:bg-theme-text transition-colors duration-300 pointer-events-auto flex items-center justify-center gap-2 md:gap-4 relative group border-none outline-none appearance-none cursor-pointer">
          <span className="font-bold opacity-80 border border-white/30 px-1.5 py-0.5 text-[8px] md:text-[9px] rounded-sm">{headerAd.sponsor}</span>
          <span className="font-serif tracking-wider font-bold mb-0.5">{headerAd.title}</span>
          <span className="opacity-90 hidden sm:inline-block font-sans normal-case tracking-normal text-[11px] md:text-sm"> - {headerAd.description}</span>
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

        <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 font-sans font-bold text-sm tracking-widest text-theme-text/90">
            <button onClick={() => goToCategory('奉獻')} className="text-brand-red hover:text-theme-text transition flex items-center gap-2 border border-brand-red px-4 py-1.5 rounded-full">奉獻 <i className="fas fa-arrow-right text-[10px]"></i></button>
            <button onClick={() => goToCategory('信仰好物')} className="hover:text-brand-red transition">信仰好物</button>
          </div>
          <div className="w-px h-5 bg-theme-text/30 hidden md:block transition-colors duration-500"></div>

          {/* Mobile compact CTAs (奉獻 pill + 信仰好物 icon) */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => goToCategory('奉獻')} title="奉獻" className="text-brand-red hover:text-theme-text transition flex items-center cursor-pointer">
              <i className="fas fa-hand-holding-heart text-lg"></i>
            </button>
            <div className="w-px h-4 bg-theme-text/30 transition-colors duration-500"></div>
            <button onClick={() => goToCategory('信仰好物')} title="信仰好物" className="hover:text-brand-red transition flex items-center cursor-pointer">
              <i className="fas fa-gift text-lg"></i>
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
        </div>
      </div>

      {showCategoryBar && (
        <div className="w-full border-t border-theme-text/10 transition-colors duration-500">
          <div className="max-w-[100vw] px-4 md:px-6 py-2.5 md:py-3 flex items-center gap-5 md:gap-8 overflow-x-auto hide-scrollbar font-sans font-bold text-xs md:text-sm tracking-widest text-theme-text/70 whitespace-nowrap">
            {NEWS_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => goToCategory(cat)}
                className="cursor-pointer hover:text-brand-red hover:text-theme-text transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
