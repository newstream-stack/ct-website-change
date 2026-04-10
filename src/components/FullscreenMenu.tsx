interface FullscreenMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
  goToCategory: (cat: string) => void;
}

export default function FullscreenMenu({ isOpen, closeMenu, goToCategory }: FullscreenMenuProps) {
  const handleNav = (cat: string) => {
    goToCategory(cat);
    closeMenu();
  };

  return (
    <nav className={`fixed inset-0 bg-theme-bg z-50 flex flex-col justify-center px-6 md:px-20 overflow-y-auto hide-scrollbar text-theme-text transition-all duration-800 ease-[cubic-bezier(0.77,0,0.175,1)] ${isOpen ? 'clip-path-open' : 'clip-path-closed'}`}
         style={{ clipPath: isOpen ? 'circle(150% at 100% 0%)' : 'circle(0% at 100% 0%)' }}>
      <button onClick={closeMenu} className="absolute top-6 right-6 md:top-10 md:right-10 text-theme-text/60 text-3xl md:text-4xl hover:text-brand-red transition z-20">
        <i className="fas fa-times"></i>
      </button>

      <div className="flex flex-col gap-4 md:gap-6 mt-20 md:mt-12 relative z-10 max-w-6xl mx-auto w-full pb-32 md:pb-20">
        <a href="#" onClick={(e) => { e.preventDefault(); handleNav('首頁'); }} className="text-[13vw] sm:text-7xl md:text-8xl lg:text-[110px] font-serif font-black uppercase text-outline-theme hover:text-theme-text transition-all duration-300 leading-tight md:leading-none tracking-tighter">01. 新聞</a>
        <a href="#" onClick={(e) => { e.preventDefault(); handleNav('信仰好物'); }} className="text-[13vw] sm:text-7xl md:text-8xl lg:text-[110px] font-serif font-black uppercase text-outline-theme hover:text-theme-text transition-all duration-300 leading-tight md:leading-none tracking-tighter">02. 信仰好物</a>
        <a href="#" onClick={(e) => { e.preventDefault(); handleNav('訂報'); }} className="text-[13vw] sm:text-7xl md:text-8xl lg:text-[110px] font-serif font-black uppercase text-outline-theme hover:text-theme-text transition-all duration-300 leading-tight md:leading-none tracking-tighter">03. 訂閱</a>
        <a href="#" onClick={(e) => { e.preventDefault(); handleNav('奉獻'); }} className="text-[13vw] sm:text-7xl md:text-8xl lg:text-[110px] font-serif font-black uppercase text-outline-theme hover:text-brand-red transition-all duration-300 leading-tight md:leading-none tracking-tighter">04. 奉獻 <i className="fas fa-arrow-right text-[8vw] sm:text-5xl md:text-7xl align-middle ml-2 md:ml-6 text-brand-red"></i></a>
        
        <div className="mt-10 md:mt-16 border-t border-theme-text/10 pt-8">
          <span className="font-display font-bold uppercase tracking-[0.2em] text-xs md:text-sm text-theme-text/50 block mb-5 md:mb-6">Explore Categories</span>
          <div className="flex flex-wrap gap-2.5 md:gap-6 font-sans font-bold text-sm md:text-xl text-theme-text/80">
            {['最新文章', '基督教論壇報', '人物見證', '專欄', '影響力聯盟', '生活情報', '信仰知識庫'].map(cat => (
              <a key={cat} href="#" onClick={(e) => { e.preventDefault(); handleNav(cat); }} className="hover:text-theme-bg hover:border-brand-red hover:bg-brand-red transition border border-theme-text/20 px-4 md:px-5 py-1.5 md:py-2 rounded-full">{cat}</a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
