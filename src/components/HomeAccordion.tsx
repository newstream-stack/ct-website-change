import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { MOCK_NEWS, MOCK_ADS } from '../data';

interface HomeAccordionProps {
  openArticle: (id: number) => void;
}

export default function HomeAccordion({ openArticle }: HomeAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [videoCarouselIndex, setVideoCarouselIndex] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamically measure header height for mobile top padding
  useLayoutEffect(() => {
    const header = document.querySelector('header') as HTMLElement | null;
    const applyPt = () => {
      const c = containerRef.current;
      if (!c) return;
      if (window.innerWidth < 768) {
        c.style.paddingTop = `${header?.offsetHeight ?? 170}px`;
      } else {
        c.style.paddingTop = '';
      }
    };
    applyPt();
    const ro = header ? new ResizeObserver(applyPt) : null;
    if (ro && header) ro.observe(header);
    window.addEventListener('resize', applyPt, { passive: true });
    return () => { ro?.disconnect(); window.removeEventListener('resize', applyPt); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarouselIndex((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearTimeout(timer);
  }, [carouselIndex]);

  useEffect(() => {
    setVideoStarted(false);
  }, [videoCarouselIndex, activeIndex]);

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
    if (newsCount === 3) {
      panels.push({
        type: 'video',
        id: 'video-feature',
        videos: [
          {
            id: 'v1',
            title: '曠野中的重生',
            url: 'https://www.youtube.com/embed/2IvNbOhBPwA?enablejsapi=1&autoplay=0&mute=0&controls=0&loop=1&playlist=2IvNbOhBPwA',
            thumbnail: 'https://img.youtube.com/vi/2IvNbOhBPwA/maxresdefault.jpg',
            category: '影片專區'
          },
          {
            id: 'v2',
            title: '日出東方',
            url: 'https://www.youtube.com/embed/ggy7Mu8tpXg?enablejsapi=1&autoplay=0&mute=0&controls=0&loop=1&playlist=ggy7Mu8tpXg',
            thumbnail: 'https://img.youtube.com/vi/ggy7Mu8tpXg/maxresdefault.jpg',
            category: '影片專區'
          },
          {
            id: 'v3',
            title: '往水深之處',
            url: 'https://www.youtube.com/embed/bph9clxfy3k?enablejsapi=1&autoplay=0&mute=0&controls=0&loop=1&playlist=bph9clxfy3k',
            thumbnail: 'https://img.youtube.com/vi/bph9clxfy3k/maxresdefault.jpg',
            category: '影片專區'
          }
        ]
      });
    }
    if (newsCount % 4 === 0 && MOCK_ADS.accordion) {
      panels.push({ type: 'ad', ad: MOCK_ADS.accordion });
    }
  });

  return (
    <div
      ref={containerRef}
      className="accordion-container relative md:pt-0 pb-[130px] md:pb-[96px] lg:pb-0"
    >
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
              <img
                src={ad.imageUrl}
                className={`accordion-bg transition-all duration-1000 ${index === activeIndex
                  ? 'opacity-100'
                  : 'opacity-50 md:opacity-80 group-hover:opacity-100'
                  }`}
                alt=""
                style={{ zIndex: 1 }}
              />

              {/* Gradient overlay — dual vignette for active, flat dark for inactive */}
              <div
                className={`absolute inset-0 transition-all duration-500 z-10 pointer-events-none ${index === activeIndex
                  ? 'accordion-vignette'
                  : 'bg-black/50 sm:bg-black/35 md:bg-black/25'
                  }`}
              />

              {/* Collapsed state */}
              <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-5 py-0 md:p-6 gap-3 md:gap-5 z-20">
                <span className="font-display text-xl md:text-[2rem] font-bold text-white tracking-tight drop-shadow">
                  AD
                </span>
                <div className="hidden md:block w-5 h-px bg-brand-red/80 mx-auto"></div>
                <span className="font-display tracking-[0.25em] uppercase text-[10px] md:rotate-180 md:writing-vertical-rl text-brand-red font-bold drop-shadow">
                  SPONSOR
                </span>
              </div>

              {/* Expanded state */}
              <div className="content-expanded absolute inset-0 flex flex-col justify-end px-5 pb-4 pt-0 md:px-10 md:pb-20 lg:px-14 lg:pb-24 z-20">
                <div className="max-w-xl">
                  {/* Tags */}
                  <div className="flex items-center gap-3 mb-3 md:mb-5">
                    <span className="bg-brand-red text-white font-display font-bold text-[10px] tracking-[0.2em] uppercase px-2.5 py-1">
                      SPONSORED
                    </span>
                    <span className="font-display text-[10px] text-white/60 tracking-[0.2em] uppercase">
                      {ad.sponsor}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-serif font-black text-white leading-[1.2] tracking-tight mb-2 md:mb-4 line-clamp-3 drop-shadow-lg">
                    {ad.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-white/75 font-light text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 max-w-md mb-4 md:mb-8">
                    {ad.description}
                  </p>

                  {/* CTA */}
                  <a
                    href={ad.link}
                    className="group/cta inline-flex items-center gap-3 font-display font-bold uppercase tracking-[0.25em] text-[11px] md:text-xs text-white"
                  >
                    <span className="border-b border-white/40 group-hover/cta:border-brand-red group-hover/cta:text-brand-red transition-colors pb-0.5">
                      Learn More
                    </span>
                    <i className="fas fa-arrow-right text-[10px] group-hover/cta:translate-x-1.5 transition-transform"></i>
                  </a>
                </div>
              </div>
            </div>
          );
        }

        if (panel.type === 'video') {
          const video = panel.videos[videoCarouselIndex];
          return (
            <div
              key={panel.id}
              className={`accordion-panel group ${index === activeIndex ? 'active' : ''}`}
              onClick={() => {
                if (activeIndex !== index) setActiveIndex(index);
              }}
            >
              {/* Thumbnail cover — removed when user clicks to play */}
              <img
                src={video.thumbnail}
                className={`accordion-bg object-cover transition-opacity duration-500 ${videoStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                alt={video.title}
              />

              {/* Iframe — always mounted when active so it loads; autoplay kicks in when cover is removed */}
              {index === activeIndex && (
                <iframe
                  className={`absolute inset-0 w-full h-[120%] -translate-y-[10%] scale-110 transition-opacity duration-500 ${videoStarted ? 'opacity-100' : 'opacity-0'}`}
                  src={`${video.url.split('?')[0]}?enablejsapi=1&autoplay=1&mute=0&controls=1&loop=1&playlist=${video.url.split('?')[0].split('/').pop()}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}

              {/* Click cover to start playback — only shows when video not yet started */}
              {!videoStarted && (
                <div
                  onClick={(e) => { e.stopPropagation(); setVideoStarted(true); }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 cursor-pointer group/play"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover/play:scale-110 group-hover/play:bg-white/35 transition-all shadow-2xl">
                    <i className="fas fa-play text-xl md:text-2xl ml-1"></i>
                  </div>
                </div>
              )}

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 transition-all duration-500 z-10 pointer-events-none ${index === activeIndex
                  ? 'bg-black/40'
                  : 'bg-black/50 sm:bg-black/35 md:bg-black/25'
                  }`}
              />

              {/* Collapsed state */}
              <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-5 py-0 md:p-6 gap-3 md:gap-5 z-20">
                <i className="fas fa-play-circle text-xl md:text-[2rem] text-white/80 drop-shadow"></i>
                <div className="hidden md:block w-5 h-px bg-white/30 mx-auto"></div>
                <span className="font-display tracking-[0.25em] uppercase text-[10px] md:rotate-180 md:writing-vertical-rl text-white/60 drop-shadow">
                  {video.category}
                </span>
              </div>

              {/* Expanded state */}
              <div className="content-expanded absolute inset-0 flex flex-col justify-end px-5 pb-4 pt-0 md:px-10 md:pb-20 lg:px-14 lg:pb-24 z-20 pointer-events-none">
                <div className="max-w-xl pointer-events-auto">
                  <div className="flex items-center gap-3 mb-3 md:mb-5">
                    <span className="bg-white/10 backdrop-blur-md text-white font-display font-bold text-[10px] tracking-[0.2em] uppercase px-2.5 py-1">
                      FEATURED VIDEO
                    </span>
                    <span className="font-display text-[10px] text-white/60 tracking-[0.2em] uppercase">
                      {video.category}
                    </span>
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setVideoCarouselIndex((p) => (p - 1 + 3) % 3); }}
                        className="w-6 h-6 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red transition-all"
                      >
                        <i className="fas fa-angle-left text-[8px]"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setVideoCarouselIndex((p) => (p + 1) % 3); }}
                        className="w-6 h-6 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red transition-all"
                      >
                        <i className="fas fa-angle-right text-[8px]"></i>
                      </button>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-serif font-black text-white leading-[1.2] tracking-tight mb-2 md:mb-4 line-clamp-2 drop-shadow-lg">
                    {video.title}
                  </h2>

                  <p className="text-white/75 font-light text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 max-w-md mb-4 md:mb-8">
                    {videoCarouselIndex === 0 ? '見證如何從曠野困境中找回重生的力量。' : 
                     videoCarouselIndex === 1 ? '感受黎明升起的盼望與城市的光。' :
                     '前往水深之處，探索更多未知的福音契機。'}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5 flex-1">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i} 
                          className={`h-1 flex-1 rounded-full bg-white/20 overflow-hidden transition-all duration-500 ${i === videoCarouselIndex ? 'bg-brand-red opacity-100' : 'opacity-30'}`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-display text-white/50 tracking-widest uppercase shrink-0">
                      Video 0{videoCarouselIndex + 1} / 03
                    </span>
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
            {/* Images (carousel) */}
            {group.map((item: any, i: number) => (
              <img
                key={item.id}
                src={item.imageUrl}
                className={`accordion-bg transition-all duration-1000 ${i === carouselIndex
                  ? (index === activeIndex
                    ? 'opacity-100'
                    : 'opacity-50 md:opacity-80 group-hover:opacity-100')
                  : 'opacity-0'
                  }`}
                alt=""
                style={{ zIndex: i === carouselIndex ? 1 : 0 }}
              />
            ))}

            {/* Gradient overlay — dual vignette for active, flat dark for inactive */}
            <div
              className={`absolute inset-0 transition-all duration-500 z-10 pointer-events-none ${index === activeIndex
                ? 'accordion-vignette'
                : 'bg-black/50 sm:bg-black/35 md:bg-black/25'
                }`}
            />

            {/* ── Collapsed (number + divider + category) ── */}
            <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-5 py-0 md:p-6 gap-3 md:gap-5 z-20">
              <span className="font-display text-xl md:text-[2rem] font-bold text-white tracking-tight drop-shadow">
                0{panel.displayIndex + 1}
              </span>
              <div className="hidden md:block w-5 h-px bg-white/30 mx-auto"></div>
              <span className="font-display tracking-[0.25em] uppercase text-[10px] md:rotate-180 md:writing-vertical-rl text-white/60 drop-shadow">
                {news.category}
              </span>
            </div>

            {/* ── Expanded (full article preview) ── */}
            <div className="content-expanded absolute inset-0 flex flex-col justify-end px-5 pb-4 pt-0 md:px-10 md:pb-20 lg:px-14 lg:pb-24 z-20">
              <div className="max-w-xl w-full">

                {/* Meta row — fixed height, never shifts */}
                <div className="flex items-center gap-3 h-8 mb-2 md:h-9 md:mb-4">
                  <span className="text-brand-red font-display font-bold text-[10px] tracking-[0.2em] uppercase border border-brand-red/50 px-2.5 py-1 whitespace-nowrap shrink-0">
                    {news.category}
                  </span>
                  <span className="font-display text-[10px] text-white/50 tracking-[0.2em] uppercase shrink-0">
                    0{carouselIndex + 1} / 05
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarouselIndex((p) => (p - 1 + 5) % 5);
                      }}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                      aria-label="Previous"
                    >
                      <i className="fas fa-angle-left text-[8px]"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarouselIndex((p) => (p + 1) % 5);
                      }}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                      aria-label="Next"
                    >
                      <i className="fas fa-angle-right text-[8px]"></i>
                    </button>
                  </div>
                </div>

                {/* Carousel dots — hidden on small mobile to prevent overflow */}
                <div className="hidden sm:flex items-center gap-1.5 h-5 mb-4 md:mb-5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCarouselIndex(i); }}
                      className={`transition-all duration-300 rounded-full ${i === carouselIndex
                        ? 'w-5 h-1.5 bg-brand-red'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                        }`}
                      aria-label={`Go to story ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Title — fixed 3-line height so layout never shifts */}
                <div className="min-h-[5.5rem] md:min-h-[8.5rem] lg:min-h-[10rem] mb-2 md:mb-4 overflow-hidden">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-serif font-black text-white leading-[1.2] tracking-tight line-clamp-3 drop-shadow-lg">
                    {news.title}
                  </h2>
                </div>

                {/* Excerpt — fixed 2-line height */}
                <div className="h-10 md:h-12 mb-4 md:mb-8 overflow-hidden">
                  <p className="text-white/70 font-light text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 max-w-md">
                    {news.excerpt}
                  </p>
                </div>

                {/* CTA */}
                <button
                  className="group/cta inline-flex items-center gap-3 font-display font-bold uppercase tracking-[0.25em] text-[11px] md:text-xs text-white"
                >
                  <span className="border-b border-white/40 group-hover/cta:border-brand-red group-hover/cta:text-brand-red transition-colors pb-0.5">
                    Read Story
                  </span>
                  <i className="fas fa-arrow-right text-[10px] group-hover/cta:translate-x-1.5 transition-transform"></i>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
