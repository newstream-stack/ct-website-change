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

  return (
    <div className="accordion-container relative">
      {accordionGroups.map((group, index) => {
        const news = group[carouselIndex] || group[0];
        return (
          <div 
            key={index}
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
            {index === 4 && MOCK_ADS.accordion ? (
              <>
                <img src={MOCK_ADS.accordion.imageUrl} className="accordion-bg transition-opacity duration-1000 opacity-50 group-hover:opacity-90" alt="Cover" style={{ zIndex: 1 }} />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-b from-theme-bg/95 via-theme-bg/60 to-theme-bg/90 transition-opacity duration-500 group-hover:opacity-80 z-10"></div>
                
                <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-6 py-0 md:p-8 text-theme-text/70 gap-3 md:gap-4 transition-colors z-20">
                  <span className="font-display text-xl md:text-3xl font-bold text-theme-text transition-colors">05</span>
                  <span className="font-display tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs md:rotate-180 md:writing-vertical-rl text-brand-red transition-colors font-bold">SPONSOR</span>
                </div>

                <div className="content-expanded absolute inset-0 flex flex-col justify-end px-6 py-8 md:p-12 lg:p-16 pb-8 md:pb-24 pt-20 transition-colors z-20">
                  <div className="max-w-2xl transition-all duration-500">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-6">
                      <span className="text-white bg-brand-red font-display font-bold text-[9px] md:text-sm tracking-[0.2em] uppercase px-2 md:px-3 py-0.5 md:py-1">SPONSORED</span>
                      <span className="font-display text-[9px] md:text-xs text-theme-text/80 tracking-widest uppercase transition-colors">{MOCK_ADS.accordion.sponsor}</span>
                    </div>
                    <h2 className="text-[22px] sm:text-4xl md:text-6xl font-serif font-black text-theme-text leading-[1.4] md:leading-[1.1] tracking-wide md:tracking-normal mb-3 md:mb-6 line-clamp-2 md:line-clamp-none transition-colors drop-shadow-sm">
                      {MOCK_ADS.accordion.title}
                    </h2>
                    <p className="text-theme-text/90 font-light text-xs md:text-lg mb-4 md:mb-8 line-clamp-2 md:line-clamp-3 max-w-lg transition-colors drop-shadow-sm leading-relaxed">
                      {MOCK_ADS.accordion.description}
                    </p>
                    <a href={MOCK_ADS.accordion.link} className="font-display font-bold uppercase tracking-widest text-[10px] md:text-sm text-theme-text hover:text-brand-red transition-colors flex items-center gap-2">
                      Learn More <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                {group.map((item, i) => (
                  <img 
                    key={item.id}
                    src={item.imageUrl} 
                    className={`accordion-bg transition-opacity duration-1000 ${i === carouselIndex ? 'opacity-50 group-hover:opacity-90' : 'opacity-0'}`} 
                    alt="Cover" 
                    style={{ zIndex: i === carouselIndex ? 1 : 0 }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-b from-theme-bg/95 via-theme-bg/60 to-theme-bg/90 transition-opacity duration-500 group-hover:opacity-80 z-10"></div>
                
                <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-6 py-0 md:p-8 text-theme-text/70 gap-3 md:gap-4 transition-colors z-20">
                  <span className="font-display text-xl md:text-3xl font-bold text-theme-text transition-colors">0{index + 1}</span>
                  <span className="font-display tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs md:rotate-180 md:writing-vertical-rl text-theme-text/90 md:text-theme-text/70 transition-colors">{news.category}</span>
                </div>

                <div className="content-expanded absolute inset-0 flex flex-col justify-end px-6 py-8 md:p-12 lg:p-16 pb-8 md:pb-24 pt-20 transition-colors z-20">
                  <div className="max-w-2xl transition-all duration-500">
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
                    <h2 className="text-[22px] sm:text-4xl md:text-6xl font-serif font-black text-theme-text leading-[1.4] md:leading-[1.1] tracking-wide md:tracking-normal mb-3 md:mb-6 line-clamp-2 md:line-clamp-none transition-colors drop-shadow-sm">
                      {news.title}
                    </h2>
                    <p className="text-theme-text/90 font-light text-xs md:text-lg mb-4 md:mb-8 line-clamp-2 md:line-clamp-3 max-w-lg transition-colors drop-shadow-sm leading-relaxed">
                      {news.excerpt}
                    </p>
                    <button className="font-display font-bold uppercase tracking-widest text-[10px] md:text-sm text-theme-text hover:text-brand-red transition-colors flex items-center gap-2">
                      Read Story <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
      
      {showAd && (
        <div className="absolute bottom-4 md:bottom-10 right-4 md:right-10 z-30 w-[85vw] sm:w-[320px] border border-theme-text/20 bg-theme-bg/90 backdrop-blur-xl p-3 md:p-4 rounded-sm flex gap-3 md:gap-4 items-center group cursor-pointer hover:border-brand-red/50 transition-colors shadow-2xl">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-theme-text/10 flex-shrink-0 relative overflow-hidden border border-theme-text/10 transition-colors">
            <img src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=200" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Ad" />
          </div>
          <div className="flex-grow">
            <span className="text-[8px] md:text-[9px] font-display uppercase tracking-widest text-theme-text/60 block mb-0.5 md:mb-1 transition-colors">Advertisement</span>
            <h4 className="font-serif font-black text-theme-text text-xs md:text-sm leading-tight line-clamp-1 transition-colors">IMPACT 2026 SUMMIT</h4>
            <span className="text-[9px] md:text-[10px] font-display text-brand-red uppercase tracking-widest mt-1 block group-hover:text-theme-text transition-colors">Book Now &rarr;</span>
          </div>
          <button 
            className="absolute -top-2 -right-2 w-6 h-6 bg-theme-text border border-theme-text/20 text-theme-bg/70 hover:text-theme-bg hover:border-theme-bg rounded-full flex items-center justify-center text-[10px] transition-colors" 
            onClick={(e) => { e.stopPropagation(); setShowAd(false); }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
}
