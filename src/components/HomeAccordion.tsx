import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { MOCK_NEWS, MOCK_ADS } from '../data';

interface HomeAccordionProps {
  openArticle: (id: number) => void;
}

export default function HomeAccordion({ openArticle }: HomeAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [videoCarouselIndex, setVideoCarouselIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(170);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  // Dynamically measure header height for mobile top padding
  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };
    
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    const observer = new ResizeObserver(updateHeaderHeight);
    const header = document.querySelector('header');
    if (header) observer.observe(header);
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarouselIndex((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearTimeout(timer);
  }, [carouselIndex]);

  // Initialize YouTube Iframe API
  useEffect(() => {
    // Only load the script once
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Handle Player State Changes
  const onPlayerStateChange = (event: any) => {
    if (event.data === (window as any).YT?.PlayerState?.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === (window as any).YT?.PlayerState?.PAUSED) {
      setIsPlaying(false);
    }
  };

  // Re-initialize player when video changes
  useEffect(() => {
    if (videoRef.current && (window as any).YT && activeIndex === 3) {
      const initPlayer = () => {
        try {
          if (playerRef.current) {
            playerRef.current.destroy();
            playerRef.current = null;
          }
          playerRef.current = new (window as any).YT.Player(videoRef.current, {
            events: {
              onReady: (event: any) => {
                try {
                  event.target.playVideo();
                  if (isMuted) event.target.mute();
                  else event.target.unMute();
                } catch (e) {}
              },
              onStateChange: onPlayerStateChange
            }
          });
        } catch (err) {
          console.error("YT Init Error:", err);
        }
      };

      if (!(window as any).YT.Player) {
        (window as any).onYouTubeIframeAPIReady = initPlayer;
      } else {
        initPlayer();
      }
    }
    
    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [videoCarouselIndex, activeIndex]);

  const handlePanelClick = (e: React.MouseEvent, index: number, type?: string) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
      return;
    }

    // Toggle logic for active video panel
    if (type === 'video' && playerRef.current) {
      e.stopPropagation();
      try {
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
      } catch (err) {}
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    
    const newState = !isMuted;
    try {
      if (newState) playerRef.current.mute();
      else playerRef.current.unMute();
      setIsMuted(newState);
    } catch (err) {}
  };

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
            videoId: '2IvNbOhBPwA',
            thumbnail: 'https://img.youtube.com/vi/2IvNbOhBPwA/maxresdefault.jpg',
            category: '影片專區'
          },
          {
            id: 'v2',
            title: '日出東方',
            videoId: 'ggy7Mu8tpXg',
            thumbnail: 'https://img.youtube.com/vi/ggy7Mu8tpXg/maxresdefault.jpg',
            category: '影片專區'
          },
          {
            id: 'v3',
            title: '往水深之處',
            videoId: 'bph9clxfy3k',
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
      className="accordion-container relative md:pt-0"
      style={{ paddingTop: window.innerWidth < 768 ? `${headerHeight}px` : 0 }}
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
              onClick={(e) => handlePanelClick(e, index, 'video')}
            >
              {/* Media Container */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                {index === activeIndex ? (
                  /* Active Panel: Show Auto-playing Video with Click-to-Pause */
                  <div className="relative w-full h-full">
                    <iframe
                      id={`youtube-player-${index}`}
                      key={`${video.videoId}-${videoCarouselIndex}`}
                      ref={videoRef}
                      className="absolute inset-0 w-full h-[120%] -translate-y-[10%] scale-110 pointer-events-none"
                      src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&playsinline=1`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                    {/* Mute toggle button — Level 50 */}
                    <button
                      onClick={toggleMute}
                      className="absolute top-4 right-4 z-[50] w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all sm:top-auto sm:bottom-24 lg:bottom-32 pointer-events-auto"
                    >
                      <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-sm`}></i>
                    </button>
                  </div>
                ) : (
                  /* Collapsed Panel: Show Thumbnail Image */
                  <img
                    src={video.thumbnail}
                    className="accordion-bg object-cover opacity-100"
                    alt={video.title}
                  />
                )}
              </div>

              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 transition-all duration-500 z-10 pointer-events-none ${index === activeIndex
                  ? 'bg-black/40'
                  : 'bg-black/50 sm:bg-black/35 md:bg-black/25'
                  }`}
              />

              {/* Collapsed state — Level 40 */}
              <div className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-5 py-0 md:p-6 gap-3 md:gap-5 z-[40] pointer-events-none">
                <i className="fas fa-play-circle text-xl md:text-[2rem] text-white/80 drop-shadow"></i>
                <div className="hidden md:block w-5 h-px bg-white/30 mx-auto"></div>
                <span className="font-display tracking-[0.25em] uppercase text-[10px] md:rotate-180 md:writing-vertical-rl text-white/60 drop-shadow">
                  {video.category}
                </span>
              </div>

              {/* Expanded state — Level 40 */}
              <div className="content-expanded absolute inset-0 flex flex-col justify-end px-5 pb-6 pt-0 md:px-10 md:pb-20 lg:px-14 lg:pb-24 z-[40] pointer-events-none">
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <i className="fas fa-play text-2xl"></i>
                    </div>
                  </div>
                )}
                
                <div className="max-w-xl pointer-events-auto cursor-default" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3 mb-2 md:mb-5">
                    <span className="bg-white/10 backdrop-blur-md text-white font-display font-bold text-[9px] md:text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 md:px-2.5 md:py-1">
                      FEATURED VIDEO
                    </span>
                    <span className="hidden md:inline font-display text-[10px] text-white/60 tracking-[0.2em] uppercase">
                      {video.category}
                    </span>
                    <div className="flex items-center gap-1.5 ml-auto md:ml-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setVideoCarouselIndex((p) => (p - 1 + 3) % 3); }}
                        className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red transition-all"
                      >
                        <i className="fas fa-angle-left text-[8px]"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setVideoCarouselIndex((p) => (p + 1) % 3); }}
                        className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red transition-all"
                      >
                        <i className="fas fa-angle-right text-[8px]"></i>
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.6rem] font-serif font-black text-white leading-[1.2] tracking-tight mb-2 md:mb-4 line-clamp-2 drop-shadow-lg">
                    {video.title}
                  </h2>

                  <p className="hidden md:block text-white/75 font-light text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 max-w-md mb-4 md:mb-8">
                    {videoCarouselIndex === 0 ? '見證如何從曠野困境中找回重生的力量。' : 
                     videoCarouselIndex === 1 ? '感受黎明升起的盼望與城市的光。' :
                     '前往水深之處，探索更多未知的福音契機。'}
                  </p>

                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex gap-1 flex-1 max-w-[120px] md:max-w-none md:gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div 
                          key={i} 
                          className={`h-0.5 md:h-1 flex-1 rounded-full bg-white/20 overflow-hidden transition-all duration-500 ${i === videoCarouselIndex ? 'bg-brand-red opacity-100' : 'opacity-30'}`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-[9px] md:text-[10px] font-display text-white/50 tracking-widest uppercase shrink-0">
                      V. 0{videoCarouselIndex + 1}
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
