import { NewsItem } from '../types';
import { useCarousel } from '../hooks/useCarousel';

interface FeaturedCarouselProps {
  articles: NewsItem[];
  openArticle: (id: number) => void;
  eyebrowLabel?: string;
  categoryLabel?: string;
  readMoreLabel?: string;
}

export default function FeaturedCarousel({
  articles,
  openArticle,
  eyebrowLabel = 'Featured Selection',
  categoryLabel,
  readMoreLabel = 'Read More',
}: FeaturedCarouselProps) {
  const { activeIndex, setActiveIndex, next, prev } = useCarousel(articles.length, { enabled: articles.length > 0 });

  if (articles.length === 0) return null;

  return (
    <div className="max-w-[1400px] mx-auto relative overflow-hidden bg-theme-text/5 border border-theme-text/10 rounded-sm shadow-xl">
      <div className="relative w-full aspect-[832/470] bg-black overflow-hidden group/img">
        {articles.map((article, idx) => (
          <img
            key={article.id}
            src={article.imageUrl}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
              idx === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            alt={article.title}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

        {/* Progress segments — signal auto-advancing carousel at a glance */}
        {articles.length > 1 && (
          <div className="absolute top-4 md:top-6 inset-x-4 md:inset-x-6 z-20 flex items-center gap-1.5">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="relative h-1 flex-1 rounded-full bg-white/25 overflow-hidden"
              >
                <span
                  key={`${idx}-${idx === activeIndex ? activeIndex : 'static'}`}
                  className={`absolute inset-y-0 left-0 bg-brand-red rounded-full ${
                    idx < activeIndex
                      ? 'w-full'
                      : idx === activeIndex
                      ? 'w-full animate-carousel-progress'
                      : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {articles.length > 1 && (
          <div className="absolute top-8 md:top-11 left-4 md:left-6 z-20 font-display text-[10px] md:text-xs font-bold tracking-widest text-white/80 uppercase">
            {String(activeIndex + 1).padStart(2, '0')} / {String(articles.length).padStart(2, '0')}
          </div>
        )}

        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 opacity-100 md:opacity-0 md:group-hover/img:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="上一則精選文章"
            className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-brand-red hover:border-brand-red transition-all transform hover:scale-110 active:scale-95 shadow-xl"
          >
            <i className="fas fa-chevron-left text-sm md:text-base"></i>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="下一則精選文章"
            className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-brand-red hover:border-brand-red transition-all transform hover:scale-110 active:scale-95 shadow-xl"
          >
            <i className="fas fa-chevron-right text-sm md:text-base"></i>
          </button>
        </div>
      </div>

      {articles.map((article, idx) => (
        <div key={article.id} className={idx === activeIndex ? 'block' : 'hidden'}>
          <div className="p-6 md:p-10 lg:p-12">
            <div className="flex items-center gap-3 text-brand-red font-display font-bold text-xs tracking-[0.4em] mb-4 uppercase">
              <span>{eyebrowLabel}</span>
              <span className="w-1.5 h-px bg-brand-red"></span>
              <span>{categoryLabel ?? article.subCategory ?? article.category}</span>
            </div>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-serif font-black mb-4 leading-tight cursor-pointer hover:text-brand-red transition-all"
              onClick={() => openArticle(article.id)}
            >
              {article.title}
            </h2>
            <p className="text-theme-text/60 font-light leading-relaxed mb-6 text-sm md:text-base max-w-3xl">
              {article.excerpt}
            </p>
            <button
              onClick={() => openArticle(article.id)}
              className="self-start text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase border-b-2 border-brand-red pb-1 hover:text-brand-red transition-all"
            >
              {readMoreLabel} <i className="fas fa-arrow-right ml-4"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
