import { useState, useLayoutEffect, useRef, MouseEvent, TouchEvent } from 'react';
import { getNewsByCategory } from '../api/news';
import { getFeaturedVideos, getAccordionAd, FeaturedVideo, FeaturedAd } from '../api/home';
import { NewsItem } from '../types';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from '../components/AsyncPageState';
import { getSafeExternalUrl } from '../utils/navigation';
import { buildUnsplashSrcSet } from '../utils/responsiveImage';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HomeAccordionProps {
  openArticle: (id: number) => void;
}

type PanelType = 'news' | 'video' | 'ad';

interface NewsPanel {
  type: 'news';
  group: NewsItem[];
  displayIndex: number;
}

interface VideoPanel {
  type: 'video';
  id: string;
  videos: FeaturedVideo[];
}

interface AdPanel {
  type: 'ad';
  ad: FeaturedAd;
}

type AccordionPanel = NewsPanel | VideoPanel | AdPanel;

// ─── Panel builder ────────────────────────────────────────────────────────────

const NEWS_GROUP_SIZE = 3;

// Fixed panel order: 01-最新文章 02-基督教論壇報 03-專欄 04-人物見證 影片專區 AD 05-生活情報
const HOME_ACCORDION_CATEGORIES = ['最新文章', '基督教論壇報', '專欄', '人物見證', '生活情報'];
const VIDEO_AD_AFTER_INDEX = 3; // insert 影片專區 + AD right after 04-人物見證

function buildPanels(newsByCategory: NewsItem[][], videos: FeaturedVideo[], accordionAd?: FeaturedAd): AccordionPanel[] {
  const panels: AccordionPanel[] = [];

  newsByCategory.forEach((group, i) => {
    if (group.length === 0) return;
    panels.push({ type: 'news', group, displayIndex: i });

    if (i === VIDEO_AD_AFTER_INDEX) {
      if (videos.length > 0) panels.push({ type: 'video', id: 'video-feature', videos });
      if (accordionAd) panels.push({ type: 'ad', ad: accordionAd });
    }
  });

  return panels;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeAccordion({ openArticle }: HomeAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Per-panel news carousel index, keyed by panel position — each news section
  // cycles its own photos independently so swiping/scrolling one section
  // doesn't yank the image out from under a different section on screen.
  const [carouselIndices, setCarouselIndices] = useState<Record<number, number>>({});
  const [videoCarouselIndex, setVideoCarouselIndex] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(170);
  const [isMobileLayout, setIsMobileLayout] = useState(() => window.innerWidth < 768);
  const [pinnedHeight, setPinnedHeight] = useState(() => window.innerHeight);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const pinnedHeightRef = useRef(pinnedHeight);

  const { data, error, isLoading, reload } = useAsyncData(
    'home-content',
    async (signal) => {
      const [newsByCategory, videos, accordionAd] = await Promise.all([
        Promise.all(HOME_ACCORDION_CATEGORIES.map((cat) => getNewsByCategory(cat, { signal }))),
        getFeaturedVideos({ signal }).catch(() => []),
        getAccordionAd({ signal }).catch(() => undefined),
      ]);
      return { newsByCategory: newsByCategory.map((group) => group.slice(0, NEWS_GROUP_SIZE)), videos, accordionAd };
    },
    null,
  );
  const panels: AccordionPanel[] = data ? buildPanels(data.newsByCategory, data.videos, data.accordionAd) : [];

  // Find the index of the video panel to know when it's active
  const videoPanelIndex = panels.findIndex((p) => p.type === 'video');
  const isVideoActive = videoStarted && (isMobileLayout || activeIndex === videoPanelIndex);

  // ── YouTube hook ────────────────────────────────────────────────────────────
  const { play, pause, mute } = useYouTubePlayer(
    videoRef,
    [videoCarouselIndex],
    {
      enabled: isVideoActive,
      isMuted,
      onPlayStateChange: setIsPlaying,
    },
  );

  // ── Header height measurement ───────────────────────────────────────────────
  useLayoutEffect(() => {
    // Vertical center of the collapsed panel indicators only re-pins once the
    // window height has changed meaningfully, so it doesn't drift up/down
    // while the browser window is being live-resized.
    const PIN_THRESHOLD = 120;
    const update = () => {
      const header = document.querySelector('header');
      if (header) setHeaderHeight(header.offsetHeight);
      setIsMobileLayout(window.innerWidth < 768);

      const h = window.innerHeight;
      if (Math.abs(h - pinnedHeightRef.current) > PIN_THRESHOLD) {
        pinnedHeightRef.current = h;
        setPinnedHeight(h);
      }
    };
    update();
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    const header = document.querySelector('header');
    if (header) observer.observe(header);
    return () => {
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, []);

  // ── News carousel auto-advance (per panel) ─────────────────────────────────
  useLayoutEffect(() => {
    if (panels.every((p) => p.type !== 'news')) return;
    const timer = setInterval(() => {
      setCarouselIndices((prev) => {
        const next = { ...prev };
        panels.forEach((panel, index) => {
          if (panel.type !== 'news') return;
          next[index] = ((prev[index] ?? 0) + 1) % panel.group.length;
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [panels.length]);

  const stepCarousel = (index: number, groupLength: number, delta: number) => {
    setCarouselIndices((prev) => ({
      ...prev,
      [index]: ((prev[index] ?? 0) + delta + groupLength) % groupLength,
    }));
  };

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;
  if (data && data.newsByCategory.every((group) => group.length === 0)) {
    return <div className="min-h-[100dvh] pt-[190px] flex items-center justify-center bg-theme-bg text-theme-text text-sm text-theme-text/55">目前沒有可顯示的文章</div>;
  }


  // ── Event handlers ──────────────────────────────────────────────────────────
  const handlePanelClick = (
    e: MouseEvent | TouchEvent,
    index: number,
    type: PanelType,
    newsId?: number,
  ) => {
    if (isMobileLayout) {
      if (e.type === 'touchend') {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }

      if (type === 'video') {
        if (!videoStarted) setVideoStarted(true);
        else isPlaying ? pause() : play();
      } else if (type === 'news' && newsId) {
        openArticle(newsId);
      }
      return;
    }

    if (activeIndex !== index) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      setActiveIndex(index);
      if (type === 'video') setVideoStarted(true);
      return;
    }

    if (e.type === 'touchend') {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }

    if (type === 'video') {
      if (!videoStarted) setVideoStarted(true);
      else isPlaying ? pause() : play();
    } else if (type === 'news' && newsId) {
      openArticle(newsId);
    }
  };

  const toggleMute = (e: MouseEvent | TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    const next = !isMuted;
    mute(next);
    setIsMuted(next);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="accordion-container relative md:pt-0"
      style={{
        paddingTop: isMobileLayout ? `${headerHeight}px` : 0,
        height: '100dvh',
        overflowY: isMobileLayout ? 'auto' : 'hidden',
      }}
    >
      {panels.map((panel, index) => {
        // ── Ad panel ──────────────────────────────────────────────────────────
        // 版面維持滿版 object-cover（隨手風琴 flex 動態縮放），不做固定 px 尺寸；
        // 客戶送圖建議來源解析度 1920×1080（16:9），裁切以此為準。
        if (panel.type === 'ad') {
          const { ad } = panel;
          return (
            <div
              key={`ad-${index}`}
              className={`accordion-panel group ${index === activeIndex ? 'active' : ''}`}
              onClick={(e) => handlePanelClick(e, index, 'ad')}
              onTouchEnd={(e) => handlePanelClick(e, index, 'ad')}
              style={{ touchAction: 'manipulation' }}
            >
              <img
                src={ad.imageUrl}
                srcSet={buildUnsplashSrcSet(ad.imageUrl)}
                sizes="100vw"
                loading={index === activeIndex ? undefined : 'lazy'}
                fetchPriority={index === activeIndex ? 'high' : 'low'}
                className="accordion-bg transition-all duration-1000 group-hover:!opacity-100"
                alt=""
                style={{ zIndex: 1, opacity: isMobileLayout || index === activeIndex ? 1 : 0.8 }}
              />
              <div
                className={`absolute inset-0 transition-all duration-500 z-10 pointer-events-none ${
                  isMobileLayout ? 'accordion-vignette' : index === activeIndex ? '' : 'bg-black/50 sm:bg-black/35 md:bg-black/25'
                }`}
              />
              {/* Collapsed */}
              <div
                className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-5 py-0 md:p-6 gap-3 md:gap-5 z-20"
                style={{ bottom: 'auto', height: pinnedHeight }}
              >
                <div className="md:h-11 md:flex md:items-center md:justify-center">
                  <span className="font-display text-xl md:text-[2rem] font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">AD</span>
                </div>
                <div className="hidden md:block w-5 h-px bg-brand-red/80 mx-auto" />
                <div className="md:h-24 md:flex md:items-center md:justify-center">
                  <span className="tracking-[0.25em] text-[10px] md:text-xs md:[writing-mode:vertical-rl] text-brand-red font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">贊助</span>
                </div>
              </div>
              {/* Expanded */}
              <div className="content-expanded absolute inset-0 flex flex-col justify-end px-5 pb-4 pt-0 md:px-10 md:pb-20 lg:px-14 lg:pb-24 z-20">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-3 md:mb-5">
                    <span className="bg-brand-red text-white font-bold text-[10px] tracking-[0.2em] px-2.5 py-1">贊助</span>
                    <span className="font-display text-[10px] text-white/60 tracking-[0.2em] uppercase">{ad.sponsor}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.2rem] font-serif font-black text-white leading-[1.2] tracking-tight mb-2 md:mb-4 line-clamp-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {ad.title}
                  </h2>
                  <p className="text-white/90 font-light text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 max-w-md mb-4 md:mb-8 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                    {ad.description}
                  </p>
                  <a href={getSafeExternalUrl(ad.link)} target="_blank" rel="noopener noreferrer" className="group/cta inline-flex items-center gap-3 font-display font-bold uppercase tracking-[0.25em] text-[11px] md:text-xs text-white">
                    <span className="border-b border-white/40 group-hover/cta:border-brand-red group-hover/cta:text-brand-red transition-colors pb-0.5">Learn More</span>
                    <i className="fas fa-arrow-right text-[10px] group-hover/cta:translate-x-1.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          );
        }

        // ── Video panel ───────────────────────────────────────────────────────
        if (panel.type === 'video') {
          const videoCount = panel.videos.length;
          const video = panel.videos[videoCarouselIndex % videoCount];
          return (
            <div
              key={panel.id}
              className={`accordion-panel group ${index === activeIndex ? 'active' : ''}`}
              onClick={(e) => handlePanelClick(e, index, 'video')}
              onTouchEnd={(e) => handlePanelClick(e, index, 'video')}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                {videoStarted && (isMobileLayout || index === activeIndex) ? (
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
                    />
                    <button
                      onClick={toggleMute}
                      onTouchEnd={toggleMute}
                      aria-label={isMuted ? '開啟影片聲音' : '關閉影片聲音'}
                      className="absolute top-4 right-4 z-[50] w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all sm:top-auto sm:bottom-24 lg:bottom-32 pointer-events-auto"
                    >
                      <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-sm`} />
                    </button>
                  </div>
                ) : (
                  <img
                    src={video.thumbnail}
                    loading={index === activeIndex ? undefined : 'lazy'}
                    fetchPriority={index === activeIndex ? 'high' : 'low'}
                    className="accordion-bg object-cover"
                    alt={video.title}
                    style={{ opacity: 1 }}
                  />
                )}
              </div>

              <div className={`absolute inset-0 transition-all duration-500 z-10 pointer-events-none ${
                isMobileLayout ? 'accordion-vignette' : index === activeIndex ? '' : 'bg-black/60 sm:bg-black/45 md:bg-black/35'
              }`} />

              {/* Collapsed */}
              <div
                className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-5 py-0 md:p-6 gap-3 md:gap-5 z-[40] pointer-events-none"
                style={{ bottom: 'auto', height: pinnedHeight }}
              >
                <div className="md:h-11 md:flex md:items-center md:justify-center">
                  <i className="fas fa-play-circle text-xl md:text-[2rem] text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                </div>
                <div className="hidden md:block w-5 h-px bg-white/30 mx-auto" />
                <div className="md:h-24 md:flex md:items-center md:justify-center">
                  <span className="font-display tracking-[0.25em] uppercase text-[10px] md:text-xs md:[writing-mode:vertical-rl] text-white/80 font-bold">{video.category}</span>
                </div>
              </div>

              {index !== activeIndex && <div className="absolute inset-0 z-[60] cursor-pointer pointer-events-auto bg-transparent" />}

              {/* Expanded */}
              <div className="content-expanded absolute inset-0 flex flex-col justify-end px-5 pb-6 pt-0 md:px-10 md:pb-20 lg:px-14 lg:pb-24 z-[40] pointer-events-none">
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <i className="fas fa-play text-2xl" />
                    </div>
                  </div>
                )}
                <div className="max-w-xl pointer-events-auto cursor-default" onClick={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3 mb-2 md:mb-5">
                    <span className="bg-white/10 backdrop-blur-md text-white font-bold text-[10px] md:text-[11px] tracking-[0.2em] px-2 py-0.5 md:px-2.5 md:py-1">影片專區</span>
                    <span className="hidden md:inline font-display text-[10px] text-white/60 tracking-[0.2em] uppercase">{video.category}</span>
                    <div className="flex items-center gap-1.5 ml-auto md:ml-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setVideoCarouselIndex((p) => (p - 1 + videoCount) % videoCount); }}
                        onTouchEnd={(e) => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); setVideoCarouselIndex((p) => (p - 1 + videoCount) % videoCount); }}
                        aria-label="上一部影片"
                        className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red transition-all"
                      >
                        <i className="fas fa-angle-left text-[8px]" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setVideoCarouselIndex((p) => (p + 1) % videoCount); }}
                        onTouchEnd={(e) => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); setVideoCarouselIndex((p) => (p + 1) % videoCount); }}
                        aria-label="下一部影片"
                        className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red transition-all"
                      >
                        <i className="fas fa-angle-right text-[8px]" />
                      </button>
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-[3.2rem] font-serif font-black text-white leading-[1.2] tracking-tight mb-2 md:mb-4 line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {video.title}
                  </h2>
                  <p className="hidden md:block text-white/90 font-light text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 max-w-md mb-4 md:mb-8">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex gap-1 flex-1 max-w-[120px] md:max-w-none md:gap-1.5">
                      {panel.videos.map((_, i) => (
                        <div key={i} className={`h-0.5 md:h-1 flex-1 rounded-full bg-white/20 overflow-hidden transition-all duration-500 ${i === videoCarouselIndex ? 'bg-brand-red opacity-100' : 'opacity-30'}`} />
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

        // ── News panel ────────────────────────────────────────────────────────
        const { group, displayIndex } = panel;
        const itemIndex = (carouselIndices[index] ?? 0) % group.length;
        const news = group[itemIndex];
        return (
          <div
            key={`news-${index}`}
            className={`accordion-panel group ${index === activeIndex ? 'active' : ''}`}
            onClick={(e) => handlePanelClick(e, index, 'news', news.id)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
              touchStartY.current = e.touches[0].clientY;
            }}
            onTouchEnd={(e) => {
              const deltaX = e.changedTouches[0].clientX - touchStartX.current;
              const deltaY = e.changedTouches[0].clientY - touchStartY.current;
              // 只有明顯偏水平的滑動才算左右切換，避免跟垂直滾動衝突
              const isHorizontalSwipe = Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
              if (!isHorizontalSwipe && Math.abs(deltaY) > 12) return;
              if ((window.innerWidth < 768 || index === activeIndex) && isHorizontalSwipe) {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation();
                if (deltaX < 0) {
                  stepCarousel(index, group.length, 1);
                } else {
                  stepCarousel(index, group.length, -1);
                }
                return;
              }
              handlePanelClick(e, index, 'news', news.id);
            }}
            style={{ touchAction: 'pan-y' }}
          >
            {group.map((item, i) => {
              const isCurrent = i === itemIndex;
              const opacity = !isCurrent ? 0 : isMobileLayout || index === activeIndex ? 1 : 0.8;
              const isLcpCandidate = isCurrent && index === activeIndex;
              return (
                <img
                  key={item.id}
                  src={item.imageUrl}
                  srcSet={buildUnsplashSrcSet(item.imageUrl)}
                  sizes="100vw"
                  loading={isLcpCandidate ? undefined : 'lazy'}
                  fetchPriority={isLcpCandidate ? 'high' : 'low'}
                  className={`accordion-bg transition-all duration-1000 ${isCurrent ? 'group-hover:!opacity-100' : ''}`}
                  alt=""
                  style={{ zIndex: isCurrent ? 1 : 0, opacity }}
                />
              );
            })}

            <div
              className={`absolute inset-0 transition-all duration-500 z-10 pointer-events-none ${
                isMobileLayout ? 'accordion-vignette' : index === activeIndex ? '' : 'bg-black/60 sm:bg-black/45 md:bg-black/35'
              }`}
            />

            {/* Collapsed */}
            <div
              className="content-collapsed absolute inset-0 flex flex-row md:flex-col items-center justify-start md:justify-center px-5 py-0 md:p-6 gap-3 md:gap-5 z-20"
              style={{ bottom: 'auto', height: pinnedHeight }}
            >
              <div className="md:h-11 md:flex md:items-center md:justify-center">
                <span className="font-display text-xl md:text-[2rem] font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  0{displayIndex + 1}
                </span>
              </div>
              <div className="hidden md:block w-5 h-px bg-white/30 mx-auto" />
              <div className="md:h-24 md:flex md:items-center md:justify-center">
                <span className="font-display tracking-[0.25em] uppercase text-[10px] md:text-xs md:[writing-mode:vertical-rl] text-white/80 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {news.category}
                </span>
              </div>
            </div>

            {/* Expanded */}
            <div className="content-expanded absolute inset-0 flex flex-col justify-end px-5 pb-4 pt-0 md:px-10 md:pb-20 lg:px-14 lg:pb-24 z-20">
              <div className="max-w-xl w-full">
                <div className="inline-flex w-fit items-center gap-3 rounded-sm border border-white/15 bg-black/45 px-2.5 py-2 shadow-lg backdrop-blur-sm mb-3 md:mb-4">
                  <span className="bg-brand-red text-white font-display font-bold text-[10px] tracking-[0.16em] uppercase px-2.5 py-1 whitespace-nowrap shrink-0 shadow-sm">
                    {news.category}
                  </span>
                  <span className="font-display text-[11px] font-bold text-white tracking-[0.16em] uppercase whitespace-nowrap shrink-0">
                    <span className="text-white/60 mr-1">文章</span>
                    0{itemIndex + 1}<span className="text-white/55 mx-1">/</span>0{group.length}
                  </span>
                  <div className="hidden md:flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); stepCarousel(index, group.length, -1); }}
                      aria-label="上一篇文章"
                      className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                    >
                      <i className="fas fa-angle-left text-[8px]" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); stepCarousel(index, group.length, 1); }}
                      aria-label="下一篇文章"
                      className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center text-white/60 hover:text-white hover:bg-brand-red hover:border-brand-red transition-all"
                    >
                      <i className="fas fa-angle-right text-[8px]" />
                    </button>
                  </div>
                </div>

                <div className="min-h-[5.5rem] md:min-h-[10rem] lg:min-h-[12rem] mb-2 md:mb-4 overflow-hidden">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.2rem] font-serif font-black text-white leading-[1.2] tracking-tight line-clamp-3 drop-shadow-lg">
                    {news.title}
                  </h2>
                </div>

                <div className="h-auto md:h-[4.5rem] max-w-xl mb-4 md:mb-8 overflow-visible md:overflow-hidden">
                  <p className="border-l-2 border-brand-red bg-black/40 px-3 py-2 text-white/95 font-normal text-xs sm:text-sm md:text-base leading-relaxed line-clamp-none md:line-clamp-2 shadow-md backdrop-blur-[2px]">
                    {news.excerpt}
                  </p>
                </div>

                <button className="group/cta inline-flex items-center gap-3 font-display font-bold uppercase tracking-[0.25em] text-[11px] md:text-xs text-white">
                  <span className="border-b border-white/40 group-hover/cta:border-brand-red group-hover/cta:text-brand-red transition-colors pb-0.5">Read Story</span>
                  <i className="fas fa-arrow-right text-[10px] group-hover/cta:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
