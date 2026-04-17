import { NEWS_CATEGORIES, MOCK_ADS } from '../data';

interface HeaderProps {
  goToCategory: (cat: string) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  showCategoryBar: boolean;
}

export default function Header({ goToCategory, toggleTheme, isDarkMode, setIsMenuOpen, showCategoryBar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex flex-col pointer-events-auto bg-theme-bg/95 backdrop-blur-md border-b border-theme-text/10 transition-colors duration-500 pb-1">
      {MOCK_ADS.header && (
        <button onClick={() => goToCategory('會員招募')} className="w-full bg-brand-red text-white py-1.5 md:py-2 px-4 text-center text-[10px] md:text-xs font-display tracking-widest uppercase hover:bg-theme-text transition-colors duration-300 pointer-events-auto flex items-center justify-center gap-2 md:gap-4 relative group border-none outline-none appearance-none cursor-pointer">
          <span className="font-bold opacity-80 border border-white/30 px-1.5 py-0.5 text-[8px] md:text-[9px] rounded-sm">{MOCK_ADS.header.sponsor}</span>
          <span className="font-serif tracking-wider font-bold mb-0.5">{MOCK_ADS.header.title}</span>
          <span className="opacity-90 hidden sm:inline-block font-sans normal-case tracking-normal text-[11px] md:text-sm"> - {MOCK_ADS.header.description}</span>
          <i className="fas fa-arrow-right ml-1 md:ml-2 transform group-hover:translate-x-1 transition-transform text-[10px]"></i>
        </button>
      )}
      
      <div className="p-3 px-5 md:p-6 flex justify-between items-center text-theme-text w-full transition-colors duration-500">
        <div className="pointer-events-auto cursor-pointer flex items-center gap-4 lg:gap-8" onClick={() => goToCategory('首頁')}>
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl md:text-4xl font-bold uppercase tracking-widest leading-none">IMPACT</span>
            <div className="w-px h-6 bg-theme-text/30 hidden md:block transition-colors duration-500"></div>
            <span className="font-serif text-[10px] md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] text-brand-red hidden md:block mt-1">論壇報</span>
          </div>
          
          {/* Desktop Left Nav */}
          <div className="hidden md:flex items-center gap-6 font-sans font-bold text-sm tracking-widest text-theme-text/90 mt-1">
            <button onClick={(e) => { e.stopPropagation(); goToCategory('信仰好物'); }} className="hover:text-brand-red transition">信仰好物</button>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 font-sans font-bold text-sm tracking-widest text-theme-text/90">
            <button onClick={() => goToCategory('奉獻')} className="text-brand-red hover:text-theme-text transition flex items-center gap-2 border border-brand-red px-4 py-1.5 rounded-full">奉獻 <i className="fas fa-arrow-right text-[10px]"></i></button>
          </div>
          <div className="w-px h-5 bg-theme-text/30 hidden md:block transition-colors duration-500"></div>

          {/* Login (Icon on mobile, text on desktop) */}
          <button className="font-display font-bold text-lg md:text-sm uppercase tracking-widest hover:text-brand-red transition-colors duration-300 flex items-center" onClick={() => goToCategory('會員中心')} title="Log In">
            <i className="far fa-user md:hidden"></i>
            <span className="hidden md:block">Log In</span>
          </button>
          
          <div className="w-px h-4 bg-theme-text/30 transition-colors duration-500"></div>
          
          <button className="flex items-center justify-center w-6 md:w-8 hover:text-brand-red transition-colors text-lg" onClick={toggleTheme} title="切換日夜模式">
            {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
          </button>
        </div>
      </div>

      {/* Mobile Actions Bar - Hidden on md+ as they move to the main row */}
      <div className="md:hidden w-full flex items-center justify-between px-5 pb-3.5 font-sans font-bold tracking-widest text-theme-text/80 transition-colors duration-500">
         <div className="flex items-center gap-5 text-[12px]">
           <button onClick={() => goToCategory('信仰好物')} className="hover:text-brand-red transition">信仰好物</button>
         </div>
         <button onClick={() => goToCategory('奉獻')} className="text-brand-red hover:bg-brand-red hover:text-white transition-all flex items-center gap-2 border border-brand-red px-4 py-1.5 rounded-full text-[11px]">
           奉獻 <i className="fas fa-arrow-right text-[10px]"></i>
         </button>
      </div>

      {showCategoryBar && (
        <div className="w-full border-t border-theme-text/10 transition-colors duration-500">
          <div className="max-w-[100vw] px-4 md:px-6 py-2.5 md:py-3 flex items-center gap-5 md:gap-8 overflow-x-auto hide-scrollbar font-sans font-bold text-xs md:text-sm tracking-widest text-theme-text/70 whitespace-nowrap">
            {NEWS_CATEGORIES.map(cat => (
              <a key={cat} href="#" onClick={(e) => { e.preventDefault(); goToCategory(cat); }} className="hover:text-brand-red hover:text-theme-text transition-colors">{cat}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
