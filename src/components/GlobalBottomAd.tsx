import { useState } from 'react';

interface GlobalBottomAdProps {
  goToCategory: (cat: string) => void;
}

export default function GlobalBottomAd({ goToCategory }: GlobalBottomAdProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-theme-text text-theme-bg overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.15)] group animate-slide-up">
      {/* 質感背景紋理 (使用高質感黑白抽象圖解疊加) */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay pointer-events-none transition-transform duration-1000 group-hover:scale-105"></div>
      
      <div className="relative max-w-[100vw] mx-auto px-4 sm:px-6 md:px-12 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8 backdrop-blur-md bg-theme-text/60">
        
        {/* 左側標籤與標題 */}
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="w-1.5 h-10 bg-brand-red hidden md:block"></div>
          <div className="flex-1">
            <span className="text-[9px] md:text-[10px] font-display tracking-[0.3em] uppercase text-theme-bg/60 font-bold block mb-0.5 md:mb-1">Premium Sponsorship</span>
            <h4 className="font-serif font-black text-sm md:text-lg tracking-wider text-theme-bg line-clamp-1">IMPACT 2026 全球華人影響力高峰會</h4>
          </div>
        </div>

        {/* 右側按鈕與描述 */}
        <div className="flex items-center justify-end gap-5 md:gap-8 w-full sm:w-auto mt-1 sm:mt-0">
          <p className="text-xs md:text-sm text-theme-bg/80 font-light hidden lg:block max-w-[320px] line-clamp-1">
            結合理性與靈性的視野，邀請重量級講員獨家探討未來的企業倫理。
          </p>
          <div className="flex items-center gap-3 md:gap-6 ml-auto">
            <button 
              onClick={() => goToCategory('活動報名')} 
              className="relative overflow-hidden bg-brand-red text-white font-display text-[10px] md:text-xs tracking-widest uppercase font-bold py-2 md:py-3 px-6 md:px-8 hover:bg-white hover:text-brand-red transition-colors duration-300 ring-1 ring-brand-red hover:ring-white group/btn"
            >
              <span className="relative flex items-center gap-2">
                即刻報名 <i className="fas fa-arrow-right text-[10px] transform group-hover/btn:translate-x-1 transition-transform"></i>
              </span>
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-theme-bg/10 hover:bg-brand-red text-theme-bg hover:text-white transition-all cursor-pointer border border-theme-bg/20"
              title="關閉廣告"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
