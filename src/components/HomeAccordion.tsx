import { useState, useEffect } from 'react';
import { MOCK_NEWS, MOCK_ADS } from '../data';

interface HomeAccordionProps {
  openArticle: (id: number) => void;
}

export default function HomeAccordion({ openArticle }: HomeAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  // For desktop below-content: show hovered panel, fallback to active
  const displayIndex = hoverIndex !== null ? hoverIndex : activeIndex;
  const displayPanel = panels[displayIndex];
  const displayNews =
    displayPanel?.type === 'news'
      ? displayPanel.group[carouselIndex] || displayPanel.group[0]
      : null;
  const displayAd = displayPanel?.type === 'ad' ? displayPanel.ad : null;

  const handlePanelChange = (index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  return (
    <div className="home-hero-wrapper">
      {/* ─── Accordion Panels ─── */}
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
                      handlePanelChange(index);
                    }
                  }
                }}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <img
                  src={ad.imageUrl}
                  className={`accordion-bg transition-all duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-50 grayscale'} group-hover:opacity-100 group-hover:grayscale-0`}
                  alt=""
                  style={{ zIndex: 1 }}
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-500 z-10 ${
                    index === activeIndex
                      ? 'bg-gradient-to-t from-theme-bg/90 via-theme-bg/30 to-transparent opacity-100'
                      : 'bg-theme-bg/70 md:bg-gradient-to-b md:from-theme-bg/95 md:via-theme-bg/60 md:to-theme-bg/90 group-hover:opacity-60'
                  }`}
                ></div>

                {/* Collapsed */}
                <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-6 py-0 md:p-8 text-theme-text/70 gap-3 md:gap-4 transition-colors z-20">
                  <span className="font-display text-xl md:text-3xl font-bold text-theme-text transition-colors">
                    AD
                  </span>
                  <span className="font-display tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs md:rotate-180 md:writing-vertical-rl text-brand-red transition-colors font-bold">
                    SPONSOR
                  </span>
                </div>

                {/* Expanded (mobile/tablet only — hidden on desktop via CSS) */}
                <div className="content-expanded absolute inset-0 flex flex-col justify-end px-6 py-8 md:p-12 pb-4 md:pb-24 pt-24 md:pt-28 transition-colors z-20">
                  <div className="max-w-2xl w-full">
                    <div className="flex items-center flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
                      <span className="text-white bg-brand-red font-display font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase px-2 md:px-3 py-1 whitespace-nowrap shrink-0">
                        SPONSORED
                      </span>
                      <span className="font-display text-[10px] md:text-xs text-theme-text/80 tracking-widest uppercase transition-colors whitespace-nowrap shrink-0">
                        {ad.sponsor}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-theme-text leading-tight tracking-tight mb-3 md:mb-5 line-clamp-2 md:line-clamp-3 transition-colors drop-shadow-sm">
                      {ad.title}
                    </h2>
                    <p className="text-theme-text/90 font-light text-xs sm:text-sm md:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 max-w-lg transition-colors drop-shadow-sm leading-relaxed">
                      {ad.description}
                    </p>
                    <a
                      href={ad.link}
                      className="group/btn font-display font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm text-theme-text flex items-center gap-2 sm:gap-3 w-fit"
                    >
                      <span className="border-b border-theme-text/40 group-hover/btn:border-brand-red transition-colors pb-1">
                        Learn More
                      </span>
                      <i className="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                    </a>
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
                    handlePanelChange(index);
                  } else {
                    openArticle(news.id);
                  }
                } else {
                  openArticle(news.id);
                }
              }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {group.map((item: any, i: number) => (
                <img
                  key={item.id}
                  src={item.imageUrl}
                  className={`accordion-bg transition-all duration-1000 ${
                    i === carouselIndex
                      ? (index === activeIndex
                          ? 'opacity-100'
                          : 'opacity-55 grayscale') +
                        ' group-hover:opacity-100 group-hover:grayscale-0'
                      : 'opacity-0'
                  }`}
                  alt=""
                  style={{ zIndex: i === carouselIndex ? 1 : 0 }}
                />
              ))}

              <div
                className={`absolute inset-0 transition-opacity duration-500 z-10 ${
                  index === activeIndex
                    ? 'bg-gradient-to-t from-theme-bg/90 via-theme-bg/20 to-transparent opacity-100'
                    : 'bg-theme-bg/70 md:bg-gradient-to-b md:from-theme-bg/95 md:via-theme-bg/60 md:to-theme-bg/90 group-hover:opacity-60'
                }`}
              ></div>

              {/* ── Collapsed label (number + category) ── */}
              <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-5 py-0 md:p-8 text-theme-text/60 gap-3 md:gap-5 transition-colors z-20">
                <span className="font-display text-xl md:text-4xl font-bold text-theme-text transition-colors tracking-tight">
                  0{panel.displayIndex + 1}
                </span>
                <div className="hidden md:block w-4 h-px bg-theme-text/30 mx-auto"></div>
                <span className="font-display tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-[11px] md:rotate-180 md:writing-vertical-rl text-theme-text/80 md:text-theme-text/60 transition-colors">
                  {news.category}
                </span>
              </div>

              {/* ── Expanded content (mobile/tablet only) ── */}
              <div className="content-expanded absolute inset-0 flex flex-col px-6 py-8 md:p-12 pb-4 md:pb-24 pt-24 md:pt-28 transition-colors z-20">
                <div className="max-w-2xl w-full h-full flex flex-col justify-between">
                  <div>
                    {/* Meta row */}
                    <div className="flex items-center gap-2 sm:gap-4 mb-5 md:mb-8">
                      <span className="text-brand-red font-display font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase border border-brand-red/40 px-2 py-1 whitespace-nowrap">
                        {news.category}
                      </span>
                      <span className="font-display text-[10px] sm:text-xs text-theme-text/50 tracking-[0.2em] uppercase whitespace-nowrap">
                        0{carouselIndex + 1} / 05
                      </span>
                      <div className="flex items-center gap-1.5 ml-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCarouselIndex((p) => (p - 1 + 5) % 5);
                          }}
                          className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-theme-text/25 flex items-center justify-center text-theme-text/60 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                          aria-label="Previous"
                        >
                          <i className="fas fa-angle-left text-[9px] md:text-xs"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCarouselIndex((p) => (p + 1) % 5);
                          }}
                          className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-theme-text/25 flex items-center justify-center text-theme-text/60 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                          aria-label="Next"
                        >
                          <i className="fas fa-angle-right text-[9px] md:text-xs"></i>
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-theme-text leading-[1.25] tracking-tight mb-3 md:mb-4 line-clamp-3 md:line-clamp-3 transition-colors drop-shadow-sm">
                      {news.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-theme-text/80 font-light text-xs sm:text-sm md:text-base max-w-lg transition-colors leading-relaxed line-clamp-2 md:line-clamp-3">
                      {news.excerpt}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="pt-5 md:pt-6">
                    <button className="group/btn font-display font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm text-theme-text flex items-center gap-2 sm:gap-3 w-fit">
                      <span className="border-b border-theme-text/40 group-hover/btn:border-brand-red transition-colors pb-1">
                        Read Story
                      </span>
                      <i className="fas fa-arrow-right text-[10px] group-hover/btn:translate-x-1 transition-transform"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Desktop: Content Below Accordion ─── */}
      <div className="accordion-below">
        {/* Left: panel indicators */}
        <div className="accordion-below-indicators">
          {panels.map((panel, index) => (
            <button
              key={index}
              className={`accordion-indicator-btn ${index === displayIndex ? 'is-active' : ''}`}
              onClick={() => {
                handlePanelChange(index);
                setHoverIndex(null);
              }}
              aria-label={`Switch to panel ${index + 1}`}
            >
              <span className="font-display text-xs font-bold leading-none">
                {panel.type === 'ad' ? 'AD' : `0${panel.displayIndex + 1}`}
              </span>
              <div className="accordion-indicator-bar"></div>
            </button>
          ))}
        </div>

        {/* Right: article / ad detail */}
        <div className="accordion-below-content">
          {displayNews && (
            <div
              className="accordion-below-article"
              key={`news-${displayIndex}-${carouselIndex}`}
            >
              {/* Meta */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-brand-red font-display font-bold text-[11px] tracking-[0.2em] uppercase border border-brand-red/40 px-2.5 py-1 whitespace-nowrap">
                  {displayNews.category}
                </span>
                <span className="font-display text-[11px] text-theme-text/45 tracking-widest uppercase">
                  0{carouselIndex + 1} / 05
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCarouselIndex((p) => (p - 1 + 5) % 5)}
                    className="w-7 h-7 rounded-full border border-theme-text/20 flex items-center justify-center text-theme-text/50 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                  >
                    <i className="fas fa-angle-left text-[9px]"></i>
                  </button>
                  <button
                    onClick={() => setCarouselIndex((p) => (p + 1) % 5)}
                    className="w-7 h-7 rounded-full border border-theme-text/20 flex items-center justify-center text-theme-text/50 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                  >
                    <i className="fas fa-angle-right text-[9px]"></i>
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2
                className={`font-serif font-black text-2xl xl:text-3xl 2xl:text-4xl text-theme-text leading-tight tracking-tight mb-3 line-clamp-2 transition-colors ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                style={{ transition: 'opacity 0.3s ease' }}
              >
                {displayNews.title}
              </h2>

              {/* Excerpt */}
              <p className="text-theme-text/65 font-light text-sm xl:text-base leading-relaxed line-clamp-2 max-w-2xl mb-5">
                {displayNews.excerpt}
              </p>

              {/* CTA */}
              <button
                onClick={() => openArticle(displayNews.id)}
                className="group/btn font-display font-bold uppercase tracking-[0.25em] text-xs text-theme-text flex items-center gap-3 w-fit"
              >
                <span className="border-b-2 border-brand-red pb-0.5 group-hover/btn:text-brand-red transition-colors">
                  Read Story
                </span>
                <i className="fas fa-arrow-right text-[10px] text-brand-red group-hover/btn:translate-x-1.5 transition-transform"></i>
              </button>
            </div>
          )}

          {displayAd && (
            <div
              className="accordion-below-article"
              key={`ad-${displayIndex}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-white bg-brand-red font-display font-bold text-[11px] tracking-[0.2em] uppercase px-2.5 py-1 whitespace-nowrap">
                  SPONSORED
                </span>
                <span className="font-display text-[11px] text-theme-text/45 tracking-widest uppercase">
                  {displayAd.sponsor}
                </span>
              </div>
              <h2 className="font-serif font-black text-2xl xl:text-3xl 2xl:text-4xl text-theme-text leading-tight tracking-tight mb-3 line-clamp-2 transition-colors">
                {displayAd.title}
              </h2>
              <p className="text-theme-text/65 font-light text-sm xl:text-base leading-relaxed line-clamp-2 max-w-2xl mb-5">
                {displayAd.description}
              </p>
              <a
                href={displayAd.link}
                className="group/btn font-display font-bold uppercase tracking-[0.25em] text-xs text-theme-text flex items-center gap-3 w-fit"
              >
                <span className="border-b-2 border-brand-red pb-0.5 group-hover/btn:text-brand-red transition-colors">
                  Learn More
                </span>
                <i className="fas fa-arrow-right text-[10px] text-brand-red group-hover/btn:translate-x-1.5 transition-transform"></i>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
