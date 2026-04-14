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
              <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${
                index === activeIndex 
                  ? 'bg-gradient-to-t from-theme-bg/90 via-theme-bg/30 to-transparent opacity-100' 
                  : 'bg-theme-bg/80 md:bg-gradient-to-b md:from-theme-bg/95 md:via-theme-bg/60 md:to-theme-bg/90 group-hover:opacity-80'
              }`}></div>
              
              <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-6 py-0 md:p-8 text-theme-text/70 gap-3 md:gap-4 transition-colors z-20">
                <span className="font-display text-lg md:text-3xl font-bold text-theme-text transition-colors">AD</span>
                <span className="font-display tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs md:rotate-180 md:writing-vertical-rl text-brand-red transition-colors font-bold">SPONSOR</span>
              </div>

              <div className="content-expanded absolute inset-0 flex flex-col justify-end px-6 py-8 md:p-12 lg:p-16 pb-4 md:pb-24 pt-20 transition-colors z-20">
                <div className="max-w-2xl transition-all duration-500 w-full">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-6">
                    <span className="text-white bg-brand-red font-display font-bold text-[9px] md:text-sm tracking-[0.2em] uppercase px-2 md:px-3 py-0.5 md:py-1">SPONSORED</span>
                    <span className="font-display text-[9px] md:text-xs text-theme-text/80 tracking-widest uppercase transition-colors">{ad.sponsor}</span>
                  </div>
                  <div className="min-h-[160px] md:min-h-[320px] flex flex-col justify-start">
                    <h2 className="text-[22px] sm:text-4xl md:text-6xl font-serif font-black text-theme-text leading-[1.4] md:leading-[1.1] tracking-wide md:tracking-normal mb-3 md:mb-6 line-clamp-2 md:line-clamp-none transition-colors drop-shadow-sm">
                      {ad.title}
                    </h2>
                    <p className="text-theme-text/90 font-light text-xs md:text-lg mb-4 md:mb-8 line-clamp-2 md:line-clamp-3 max-w-lg transition-colors drop-shadow-sm leading-relaxed">
                      {ad.description}
                    </p>
                    <div className="mt-auto md:mt-0">
                      <a href={ad.link} className="font-display font-bold uppercase tracking-widest text-[10px] md:text-sm text-theme-text hover:text-brand-red transition-colors flex items-center gap-2 w-fit">
                        Learn More <i className="fas fa-arrow-right"></i>
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
            <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${
              index === activeIndex 
                ? 'bg-gradient-to-t from-theme-bg/90 via-theme-bg/30 to-transparent opacity-100' 
                : 'bg-theme-bg/80 md:bg-gradient-to-b md:from-theme-bg/95 md:via-theme-bg/60 md:to-theme-bg/90 group-hover:opacity-80'
            }`}></div>
            
            <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-6 py-0 md:p-8 text-theme-text/70 gap-3 md:gap-4 transition-colors z-20">
              <span className="font-display text-lg md:text-3xl font-bold text-theme-text transition-colors">0{panel.displayIndex + 1}</span>
              <span className="font-display tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs md:rotate-180 md:writing-vertical-rl text-theme-text/90 md:text-theme-text/70 transition-colors">{news.category}</span>
            </div>

            <div className="content-expanded absolute inset-0 flex flex-col justify-end px-6 py-8 md:p-12 lg:p-16 pb-4 md:pb-24 pt-20 transition-colors z-20">
              <div className="max-w-2xl transition-all duration-500 w-full">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-6">
                  <span className="text-brand-red font-display font-bold text-[9px] md:text-sm tracking-[0.2em] uppercase border border-brand-red px-2 md:px-3 py-0.5 md:py-1">{news.category}</span>
                  <span className="font-display text-[9px] md:text-xs text-theme-text/80 tracking-widest uppercase transition-colors">0{carouselIndex + 1} / 05</span>
                  
                  <div className="flex items-center gap-1 md:gap-2 ml-2 md:ml-4 pointer-events-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCarouselIndex((prev) => (prev - 1 + 5) % 5); }}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-theme-text/30 flex items-center justify-center text-theme-text/70 hover:text-theme-bg hover:bg-theme-text hover:border-theme-text transition-all"
                      aria-label="上一篇"
                    >
                      <i className="fas fa-angle-left text-[10px] md:text-xs"></i>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCarouselIndex((prev) => (prev + 1) % 5); }}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-theme-text/30 flex items-center justify-center text-theme-text/70 hover:text-theme-bg hover:bg-theme-text hover:border-theme-text transition-all"
                      aria-label="下一篇"
                    >
                      <i className="fas fa-angle-right text-[10px] md:text-xs"></i>
                    </button>
                  </div>
                </div>
                <div className="min-h-[160px] md:min-h-[320px] flex flex-col justify-start">
                  <h2 className="text-[22px] sm:text-4xl md:text-6xl font-serif font-black text-theme-text leading-[1.4] md:leading-[1.1] tracking-wide md:tracking-normal mb-3 md:mb-6 line-clamp-2 md:line-clamp-none transition-colors drop-shadow-sm">
                    {news.title}
                  </h2>
                  <p className="text-theme-text/90 font-light text-xs md:text-lg mb-4 md:mb-8 line-clamp-2 md:line-clamp-3 max-w-lg transition-colors drop-shadow-sm leading-relaxed">
                    {news.excerpt}
                  </p>
                  <div className="mt-auto md:mt-0">
                    <button className="font-display font-bold uppercase tracking-widest text-[10px] md:text-sm text-theme-text hover:text-brand-red transition-colors flex items-center gap-2 w-fit">
                      Read Story <i className="fas fa-arrow-right"></i>
                    </button>
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
