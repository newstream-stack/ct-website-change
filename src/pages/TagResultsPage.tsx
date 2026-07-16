import { getNewsByTag } from '../api/news';

interface TagResultsPageProps {
  tag: string;
  openArticle: (id: number) => void;
}

export default function TagResultsPage({ tag, openArticle }: TagResultsPageProps) {
  const articles = getNewsByTag(tag);

  return (
    <div className="pt-[190px] md:pt-48 pb-32 px-5 md:px-12 lg:px-20 min-h-screen bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16 border-b border-theme-text/15 pb-7 md:pb-9">
          <p className="font-display text-xs tracking-[0.3em] text-brand-red uppercase mb-4">Articles tagged</p>
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-widest leading-tight">#{tag.toUpperCase()}</h1>
          <p className="mt-5 text-sm text-theme-text/55">共 {articles.length} 篇相關文章</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {articles.map((article) => (
            <button key={article.id} onClick={() => openArticle(article.id)} className="group text-left">
              <div className="aspect-[832/470] overflow-hidden bg-theme-text/5 mb-5 border border-theme-text/10">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="font-display text-[10px] tracking-[0.16em] text-brand-red uppercase mb-3">{article.category}</p>
              <h2 className="font-serif text-xl md:text-2xl font-bold leading-snug group-hover:text-brand-red transition-colors">{article.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-theme-text/60 line-clamp-2">{article.excerpt}</p>
              <p className="mt-5 pt-4 border-t border-theme-text/10 font-display text-[10px] tracking-[0.16em] text-theme-text/45">{article.author}　|　{article.date}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
