import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { getArticle, getRecommended, getArticleContent, getNewsList } from '../api/news';
import { getRandomAd, getAd } from '../api/ads';
import InlineArticleBanner from '../components/InlineArticleBanner';
import StickySidebarAd from '../components/StickySidebarAd';

interface ArticleDetailProps {
    articleId: number;
    openArticle: (id: number) => void;
    goToCategory: (cat: string) => void;
}

export default function ArticleDetail({ articleId, openArticle, goToCategory }: ArticleDetailProps) {
    const article = getArticle(articleId) ?? getNewsList()[0];
    const recommendedNews = getRecommended(articleId);
    const popularNews = getRecommended(articleId, 5);

    const [randomAd] = useState(() => getRandomAd() ?? null);
    const topAd = getAd('infeed');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 2500);
    };

    useEffect(() => {
        const saved: number[] = JSON.parse(localStorage.getItem('impact_saved_articles') || '[]');
        setIsSaved(saved.includes(article.id));
    }, [article.id]);

    const { part1: dummyContentPart1, part2: dummyContentPart2 } = getArticleContent();
    let firstPart = dummyContentPart1;
    let secondPart = '';
    if (!article.content) {
        const match = dummyContentPart1.match(new RegExp("(.*?</p>\\s*.*?</p>)(.*)", "s"));
        if (match) {
            firstPart = match[1];
            secondPart = match[2];
        }
    }

    // 放在 return ( 之前
    const handleShare = (type: 'fb' | 'ig' | 'lin') => {
        const url = encodeURIComponent(window.location.href);
        switch (type) {
            case 'fb':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
                break;
            case 'lin':
                window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank', 'width=600,height=400');
                break;
            case 'ig':
                navigator.clipboard.writeText(window.location.href);
                showToast('網址已複製，快去 IG 分享！');
                break;
        }
    };

    const handleToggleSave = () => {
        const saved: number[] = JSON.parse(localStorage.getItem('impact_saved_articles') || '[]');
        const next = isSaved ? saved.filter((id) => id !== article.id) : [...saved, article.id];
        localStorage.setItem('impact_saved_articles', JSON.stringify(next));
        setIsSaved(!isSaved);
        showToast(isSaved ? '已取消收藏' : '已加入收藏！');
    };

    return (
        <>
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-theme-text text-theme-bg text-xs font-bold tracking-widest px-5 py-3 rounded-full shadow-lg pointer-events-none">
                    {toastMessage}
                </div>
            )}

            <div className="pt-[190px] md:pt-32 px-5 sm:px-6 md:px-12 lg:px-20 bg-theme-bg transition-colors duration-500">
                <div className="max-w-[90rem] mx-auto w-full">
                    <div className="w-full aspect-[832/470] bg-theme-text/5 overflow-hidden border border-theme-text/10 rounded-sm mb-8 md:mb-10 transition-colors duration-500">
                        <img src={article.imageUrl} className="w-full h-full object-cover transition-opacity duration-700" alt="Cover" />
                    </div>

                    <span className="inline-block bg-brand-red text-white font-display font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase mb-4 px-2 md:px-4 py-1 md:py-1.5 shadow-lg shadow-brand-red/20 rounded-sm">{article.category}</span>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-[80px] font-serif font-black text-theme-text leading-[1.3] md:leading-[1.1] tracking-wide md:tracking-tight mb-4 md:mb-6 max-w-5xl transition-colors duration-500">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-theme-text/80 font-display uppercase tracking-widest text-[9px] md:text-sm font-bold bg-theme-text/5 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 w-fit border border-theme-text/10 rounded-sm transition-colors duration-500">
                        <span>Words by <strong className="text-brand-red">{article.author}</strong></span>
                        <span className="text-theme-text/30 transition-colors">|</span>
                        <span>Published {article.date}, 2026</span>
                    </div>
                </div>
            </div>

            <div className="bg-theme-bg py-8 md:py-24 pb-20 md:pb-24 text-theme-text transition-colors duration-500">
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 relative">

                    <div className="lg:col-span-8 article-content">
                        {topAd && (
                            <a href={topAd.link} className="relative overflow-hidden bg-theme-text text-theme-bg flex flex-col sm:flex-row items-center gap-4 md:gap-6 px-5 md:px-8 py-6 md:py-7 mb-10 md:mb-14 group transition-colors duration-500 rounded-sm">
                                <div
                                    className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none transition-transform duration-1000 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${topAd.imageUrl})` }}
                                ></div>
                                <div className="relative flex items-center gap-4 flex-1 w-full min-w-0">
                                    <div className="w-1.5 h-12 md:h-14 bg-brand-red hidden sm:block shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[9px] md:text-[10px] font-display tracking-[0.3em] uppercase text-theme-bg/60 font-bold block mb-1">{topAd.sponsor} · Sponsored</span>
                                        <h3 className="font-serif font-black text-base md:text-xl tracking-wide text-theme-bg leading-snug">{topAd.title}</h3>
                                        <p className="text-xs md:text-sm text-theme-bg/70 font-light mt-1.5 hidden md:block max-w-xl">{topAd.description}</p>
                                    </div>
                                </div>
                                <div className="relative shrink-0 w-full sm:w-auto">
                                    <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red text-white font-display text-[10px] md:text-xs tracking-widest uppercase font-bold py-2.5 md:py-3 px-6 md:px-8 group-hover:bg-white group-hover:text-brand-red transition-colors duration-300 ring-1 ring-brand-red rounded-sm">
                                        了解更多 <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                                    </span>
                                </div>
                            </a>
                        )}

                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-theme-text/10 transition-colors">
                            {/* 1. Share 文字 */}
                            <span className="font-display text-[10px] tracking-widest uppercase text-theme-text/60 transition-colors">
                                Share
                            </span>

                            {/* 2. 圖示容器：刪除了多餘的層級與 mt-6 */}
                            <div className="flex gap-3">
                                {/* Facebook */}
                                <div
                                    onClick={() => handleShare('fb')}
                                    className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition bg-theme-text/5 cursor-pointer text-theme-text/80"
                                >
                                    <i className="fab fa-facebook-f text-xs"></i>
                                </div>

                                {/* Instagram */}
                                <div
                                    onClick={() => handleShare('ig')}
                                    className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition bg-theme-text/5 cursor-pointer text-theme-text/80"
                                >
                                    <i className="fab fa-instagram text-xs"></i>
                                </div>

                                {/* Line */}
                                <div
                                    onClick={() => handleShare('lin')}
                                    className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#06C755] hover:text-white hover:border-[#06C755] transition bg-theme-text/5 cursor-pointer text-theme-text/80"
                                >
                                    <i className="fab fa-line text-xs"></i>
                                </div>
                            </div>

                            {/* 3. 收藏 */}
                            <div className="w-px h-5 bg-theme-text/10 mx-1"></div>
                            <div
                                onClick={handleToggleSave}
                                className={`flex items-center gap-2 px-3 h-8 rounded-full border transition cursor-pointer font-display text-[10px] font-bold uppercase tracking-widest ${isSaved
                                    ? 'bg-brand-red border-brand-red text-white'
                                    : 'border-theme-text/20 bg-theme-text/5 text-theme-text/80 hover:bg-brand-red hover:text-white hover:border-brand-red'
                                    }`}
                            >
                                <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark text-xs`}></i>
                                {isSaved ? '已收藏' : '收藏'}
                            </div>
                        </div>

                        {article.content ? (
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                        ) : (
                            <>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(firstPart) }} />

                                {randomAd && <InlineArticleBanner ad={randomAd} />}

                                {secondPart && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(secondPart) }} />}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-10 md:my-16">
                                    <div className="w-full aspect-[4/5] bg-theme-text/5 border border-theme-text/10 overflow-hidden transition-colors"><img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover hover:scale-105 transition-all duration-700" alt="Content 1" /></div>
                                    <div className="w-full aspect-[4/5] bg-theme-text/5 border border-theme-text/10 overflow-hidden md:mt-12 transition-colors"><img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover hover:scale-105 transition-all duration-700" alt="Content 2" /></div>
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dummyContentPart2) }} />
                            </>
                        )}

                        <div className="mt-12 md:mt-16 pt-8 border-t border-theme-text/10 flex flex-col sm:flex-row justify-between items-center gap-6 transition-colors">
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="font-display text-[10px] font-bold uppercase tracking-widest border border-theme-text/20 text-theme-text/80 px-3 py-1 hover:bg-theme-text hover:text-theme-bg cursor-pointer transition rounded-full">#Faith</span>
                                <span className="font-display text-[10px] font-bold uppercase tracking-widest border border-theme-text/20 text-theme-text/80 px-3 py-1 hover:bg-theme-text hover:text-theme-bg cursor-pointer transition rounded-full">#ModernSociety</span>
                            </div>
                            <div className="flex lg:hidden">
                                <button onClick={() => window.scrollTo(0, 0)} className="text-[10px] font-display tracking-widest uppercase text-theme-text/60 hover:text-theme-text transition-colors"><i className="fas fa-arrow-up mr-2"></i>Back to top</button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-10 md:space-y-12 mt-8 lg:mt-0">
                        <div className="border border-theme-text/10 bg-theme-text/5 backdrop-blur-md rounded-sm p-6 md:p-8 transition-colors">
                            <h4 className="font-display text-xs md:text-sm font-black uppercase tracking-[0.2em] text-theme-text mb-6 pb-4 border-b border-theme-text/10 flex items-center gap-2 transition-colors">
                                <span className="w-1.5 h-1.5 bg-brand-red rounded-full"></span>
                                熱門文章
                            </h4>
                            <div className="flex flex-col gap-5">
                                {popularNews.map((n, i) => (
                                    <div key={n.id} className="flex items-start gap-4 cursor-pointer group" onClick={() => openArticle(n.id)}>
                                        <span className="font-serif font-black text-2xl md:text-3xl text-theme-text/15 group-hover:text-brand-red/40 transition-colors leading-none shrink-0 w-8">{String(i + 1).padStart(2, '0')}</span>
                                        <h5 className="font-serif font-bold text-sm md:text-base text-theme-text leading-snug group-hover:text-brand-red transition-colors line-clamp-3">{n.title}</h5>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {getAd('sidebar') && <StickySidebarAd ad={getAd('sidebar')!} />}
                    </div>
                </div>

                <div className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20 mt-16 md:mt-20 pt-16 border-t border-theme-text/10 transition-colors">
                    <div className="flex items-end justify-between mb-8 md:mb-10">
                        <h3 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter text-theme-text transition-colors">推薦文章 <span className="text-theme-text/40 font-light text-xl md:text-3xl ml-2 transition-colors">/ UP NEXT</span></h3>
                        <a href="#" className="font-display text-xs md:text-sm font-bold uppercase tracking-widest text-brand-red hover:text-theme-text transition hidden md:block">View All Features &rarr;</a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendedNews.map(n => (
                            <div key={n.id} className="group cursor-pointer flex flex-col h-full" onClick={() => openArticle(n.id)}>
                                <div className="w-full aspect-[4/3] bg-theme-text/10 overflow-hidden mb-4 border border-theme-text/5 transition-colors rounded-sm">
                                    <img src={n.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={n.title} />
                                </div>
                                <span className="text-brand-red font-display font-bold text-[10px] uppercase tracking-widest mb-2">{n.category}</span>
                                <h4 className="text-lg md:text-xl font-serif font-black text-theme-text leading-[1.4] md:leading-snug group-hover:text-brand-red transition-colors line-clamp-2 mb-3 tracking-wide md:tracking-normal">{n.title}</h4>
                                <div className="mt-auto font-display text-[9px] uppercase tracking-widest text-theme-text/60 pt-4 border-t border-theme-text/10 transition-colors">
                                    By {n.author} &nbsp;|&nbsp; {n.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full bg-theme-text text-theme-bg py-24 md:py-40 px-6 text-center group cursor-pointer border-t border-theme-text/10 transition-colors duration-500" onClick={() => goToCategory('首頁')}>
                <span className="font-display text-brand-red font-bold text-xs md:text-sm tracking-[0.2em] uppercase block mb-6 md:mb-10">Return to Cover</span>
                <h2 className="text-4xl sm:text-6xl md:text-[100px] font-serif font-black text-outline-inverse group-hover:text-theme-bg transition-all duration-500 leading-none">
                    Back to Index <i className="fas fa-long-arrow-alt-right ml-2 md:ml-4 inline-block transform md:group-hover:translate-x-12 transition-transform duration-500 text-brand-red"></i>
                </h2>
            </div>
        </>
    );
}
