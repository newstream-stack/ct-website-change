import { useState, useEffect } from 'react';
import { MOCK_NEWS, MOCK_ADS } from '../data';

interface HomeAccordionProps {
  openArticle: (id: number) => void;
}

export default function HomeAccordion({ openArticle }: HomeAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAd, setShowAd] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarouselIndex((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearTimeout(timer);
  }, [carouselIndex]);

  const accordionGroups = [
    MOCK_NEWS.slice(0, 5),
    MOCK_NEWS.slice(5, 10),
    MOCK_NEWS.slice(10, 15),
    MOCK_NEWS.slice(15, 20),
    MOCK_NEWS.slice(20, 25),
  ];

  const panels: any[] = [];
  let newsCount = 0;
  accordionGroups.forEach((group) => {
    panels.push({ type: 'news', group, displayIndex: newsCount });
    newsCount++;
    if (newsCount % 4 === 0 && MOCK_ADS.accordion) {
      panels.push({ type: 'ad', ad: MOCK_ADS.accordion });
    }
  });

  return (
    <div className="accordion-container relative pt-[160px] md:pt-0 pb-[136px] md:pb-[96px] lg:pb-0">
      {panels.map((panel, index) => {
        if (panel.type === 'ad') {
          const ad = panel.ad;
          return (
            <div
              key={`ad-${index}`}
              className={`accordion-panel group ${index === activeIndex ? 'active' : ''}`}
              onClick={(e) => {
                if (window.innerWidth < 1024) {
                  if (activeIndex !== index) {
                    e.preventDefault();
                    setActiveIndex(index);
                  }
                }
              }}
            >
              <img src={ad.imageUrl} className={`accordion-bg transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-50'} group-hover:opacity-100 grayscale md:grayscale-0`} alt="" style={{ zIndex: 1 }} />
              <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${index === activeIndex
                ? 'bg-gradient-to-t from-theme-bg/90 via-theme-bg/30 to-transparent opacity-100'
                : 'bg-theme-bg/80 md:bg-gradient-to-b md:from-theme-bg/95 md:via-theme-bg/60 md:to-theme-bg/90 group-hover:opacity-80'
                }`}></div>

              <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-6 py-0 md:p-8 text-theme-text/70 gap-3 md:gap-4 transition-colors z-20">
                <span className="font-display text-lg md:text-3xl font-bold text-theme-text transition-colors">AD</span>
                <span className="font-display tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs md:rotate-180 md:writing-vertical-rl text-brand-red transition-colors font-bold">SPONSOR</span>
              </div>

              <div className="content-expanded absolute inset-0 flex flex-col justify-end px-6 py-8 md:p-12 lg:p-16 pb-4 md:pb-24 pt-24 md:pt-28 lg:pt-32 transition-colors z-20">
                <div className="max-w-2xl transition-all duration-500 w-full">
                  <div className="flex items-center flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
                    <span className="text-white bg-brand-red font-display font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase px-2 md:px-3 py-1 whitespace-nowrap shrink-0">SPONSORED</span>
                    <span className="font-display text-[10px] md:text-xs text-theme-text/80 tracking-widest uppercase transition-colors whitespace-nowrap shrink-0">{ad.sponsor}</span>
                  </div>
                  <div className="min-h-[160px] md:min-h-[280px] flex flex-col justify-start">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-theme-text leading-[1.3] md:leading-[1.2] tracking-tight md:tracking-normal mb-3 md:mb-5 line-clamp-2 md:line-clamp-3 transition-colors drop-shadow-sm">
                      {ad.title}
                    </h2>
                    <p className="text-theme-text/90 font-light text-xs sm:text-sm md:text-base lg:text-lg mb-4 md:mb-6 line-clamp-2 md:line-clamp-2 lg:line-clamp-3 max-w-lg transition-colors drop-shadow-sm leading-relaxed">
                      {ad.description}
                    </p>
                    <div className="mt-auto pt-2 md:pt-4">
                      <a href={ad.link} className="group font-display font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm text-theme-text transition-colors flex items-center gap-2 sm:gap-3 w-fit">
                        <span className="border-b border-theme-text/40 group-hover:border-brand-red transition-colors pb-1">
                          Learn More
                        </span>
                        <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const group = panel.group;
        const news = group[carouselIndex] || group[0];
        return (
          <div
            key={`news-${index}`}
            className={`accordion-panel group ${index === activeIndex ? 'active' : ''}`}
            onClick={(e) => {
              if (window.innerWidth < 1024) {
                if (activeIndex !== index) {
                  e.preventDefault();
                  setActiveIndex(index);
                } else {
                  openArticle(news.id);
                }
              } else {
                openArticle(news.id);
              }
            }}
          >
            {group.map((item: any, i: number) => (
              <img
                key={item.id}
                src={item.imageUrl}
                className={`accordion-bg transition-opacity duration-1000 ${i === carouselIndex ? (index === activeIndex ? 'opacity-100' : 'opacity-50') + ' group-hover:opacity-100' : 'opacity-0'}`}
                alt=""
                style={{ zIndex: i === carouselIndex ? 1 : 0 }}
              />
            ))}
            <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${index === activeIndex
              ? 'bg-gradient-to-t from-theme-bg/90 via-theme-bg/30 to-transparent opacity-100'
              : 'bg-theme-bg/80 md:bg-gradient-to-b md:from-theme-bg/95 md:via-theme-bg/60 md:to-theme-bg/90 group-hover:opacity-80'
              }`}></div>

            {/* --- 1. 未展開狀態 (Collapsed)：強調數位序號與分類 --- */}
            <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-6 py-0 md:p-8 text-theme-text/70 gap-3 md:gap-4 transition-colors z-20">
              {/* 序號：使用 font-display 增加現代感 */}
              <span className="font-display text-xl md:text-3xl font-bold text-theme-text transition-colors">
                0{panel.displayIndex + 1}
              </span>
              {/* 分類名稱：手機版提升至 text-xs (12px)，並拉大字距 */}
              <span className="font-display tracking-[0.2em] md:tracking-[0.3em] uppercase text-xs md:text-xs md:rotate-180 md:writing-vertical-rl text-theme-text/90 md:text-theme-text/70 transition-colors">
                {news.category}
              </span>
            </div>

            {/* --- 2. 展開狀態 (Expanded)：典型的雜誌排版風格 --- */}
            <div className="content-expanded absolute inset-0 flex flex-col px-6 py-8 md:p-12 lg:p-16 pb-4 md:pb-24 pt-24 md:pt-28 lg:pt-32 transition-colors z-20">
              <div className="max-w-2xl transition-all duration-500 w-full">
                <div className="min-h-[220px] md:min-h-[340px] lg:min-h-[380px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 mb-6 md:mb-8 min-h-10 md:min-h-12">
                      <span className="text-brand-red font-display font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase border border-brand-red/30 px-2 py-1 transition-colors whitespace-nowrap">
                        {news.category}
                      </span>
                      <span className="font-display text-[10px] sm:text-xs text-theme-text/60 tracking-[0.2em] uppercase transition-colors whitespace-nowrap">
                        0{carouselIndex + 1} / 05
                      </span>
                      <div className="flex items-center gap-2 pointer-events-auto shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); setCarouselIndex((prev) => (prev - 1 + 5) % 5); }}
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-theme-text/20 flex items-center justify-center text-theme-text/60 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                          aria-label="Previous story"
                        >
                          <i className="fas fa-angle-left text-[10px] md:text-xs"></i>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setCarouselIndex((prev) => (prev + 1) % 5); }}
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-theme-text/20 flex items-center justify-center text-theme-text/60 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                          aria-label="Next story"
                        >
                          <i className="fas fa-angle-right text-[10px] md:text-xs"></i>
                        </button>
                      </div>
                    </div>

                    {/* 大標題：應用思源宋體 (font-serif)，縮小行高營造張力 */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-black text-theme-text leading-[1.3] md:leading-[1.2] tracking-tight md:tracking-normal mb-3 md:mb-5 line-clamp-2 md:line-clamp-3 transition-colors drop-shadow-sm">
                      {news.title}
                    </h2>

                    {/* 摘要：使用 font-sans 輕量化 (font-light)，增加行高營造空氣感 */}
                    <p className="text-theme-text/80 font-sans font-light text-xs sm:text-sm md:text-base lg:text-lg max-w-lg transition-colors leading-relaxed line-clamp-2 md:line-clamp-2 lg:line-clamp-3">
                      {news.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 md:pt-8">
                    <div className="flex items-end justify-between gap-6 min-h-[56px] md:min-h-[64px]">
                      <button className="group font-display font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm text-theme-text transition-colors flex items-center gap-2 sm:gap-3 w-fit shrink-0">
                        <span className="border-b border-theme-text/40 group-hover:border-brand-red transition-colors pb-1">
                          Read Story
                        </span>
                        <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                      </button>

                      <div className="shrink-0 ml-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}


    </div>
  );
}
