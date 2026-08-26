import type { NewsItem } from '../types';

interface PopularArticleListProps {
  items: NewsItem[];
  openArticle: (id: number) => void;
  title?: string;
}

/** 編號式熱門文章清單；分類頁與文章頁側欄共用。 */
export default function PopularArticleList({ items, openArticle, title = '熱門文章' }: PopularArticleListProps) {
  if (items.length === 0) return null;

  return (
    <div className="border-t-2 border-theme-text pt-4">
      <h2 className="font-serif text-base md:text-lg font-bold text-theme-text mb-5 pb-3 border-b border-theme-text/10">
        {title}
      </h2>
      <div className="flex flex-col gap-5">
        {items.map((news, index) => (
          <button
            type="button"
            key={news.id}
            className="w-full text-left flex items-start gap-4 cursor-pointer group"
            onClick={() => openArticle(news.id)}
          >
            <span className="font-serif font-bold text-xl md:text-2xl text-theme-text/25 group-hover:text-brand-red transition-colors leading-none shrink-0 w-7">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="font-serif font-bold text-sm md:text-base text-theme-text leading-snug group-hover:text-brand-red transition-colors line-clamp-3">
              {news.title}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
}
