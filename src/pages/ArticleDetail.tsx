import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { getArticle, getArticleContent, getArticleTags, getRecommended } from '../api/news';
import { getAd } from '../api/ads';
import StickySidebarAd from '../components/StickySidebarAd';
import AsyncPageState from '../components/AsyncPageState';
import { useAsyncData } from '../hooks/useAsyncData';
import { getArticleSavedStatus, removeSavedArticle, saveArticle } from '../api/savedArticles';
import { useAuth } from '../hooks/useAuth';
import { getSafeExternalUrl } from '../utils/navigation';
import { formatArticleDate } from '../utils/date';

interface ArticleDetailProps {
    articleId: number;
    openArticle: (id: number) => void;
    goToCategory: (cat: string) => void;
    goToTag: (tag: string) => void;
    goToAuthor: (author: string) => void;
}

export default function ArticleDetail({ articleId, openArticle, goToCategory, goToTag, goToAuthor }: ArticleDetailProps) {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isLoggedIn } = useAuth();
    const { data, error, isLoading, reload } = useAsyncData(
        `article:${articleId}:auth:${isLoggedIn}`,
        async (signal) => {
            const [article, recommendedNews, popularNews, content, saved, topAd, sidebarAd] = await Promise.all([
                getArticle(articleId, { signal }),
                getRecommended(articleId, 4, { signal }),
                getRecommended(articleId, 5, { signal }),
                getArticleContent(articleId, { signal }),
                getArticleSavedStatus(articleId, isLoggedIn, { signal }).catch(() => false),
                getAd('infeed', { signal }).catch(() => undefined),
                getAd('sidebar', { signal }).catch(() => undefined),
            ]);
            if (!article) throw new Error('找不到文章');
            return { article, recommendedNews, popularNews, content, saved, topAd, sidebarAd };
        },
        null,
    );

    const showToast = (message: string) => {
        setToastMessage(message);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastMessage(null), 2500);
    };

    useEffect(() => () => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
    }, []);

    useEffect(() => {
        if (!data) return;
        setIsSaved(data.saved);
    }, [data]);

    if (error) return <AsyncPageState error={error} onRetry={reload} />;
    if (isLoading || !data) return <AsyncPageState />;

    const { article, recommendedNews, popularNews, content, topAd, sidebarAd } = data;
    const articleTags = getArticleTags(article);

    const { part1: dummyContentPart1, part2: dummyContentPart2 } = content;
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

    const handleToggleSave = async () => {
        if (isSaving) return;
        try {
            setIsSaving(true);
            if (isSaved) await removeSavedArticle(article.id, isLoggedIn);
            else await saveArticle(article.id, isLoggedIn);
            setIsSaved((value) => !value);
            showToast(isSaved ? '已取消收藏' : '已加入收藏！');
        } catch (saveError) {
            showToast(saveError instanceof Error ? saveError.message : '收藏操作失敗，請稍後再試');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-theme-text text-theme-bg text-xs font-bold tracking-widest px-5 py-3 rounded-full shadow-lg pointer-events-none">
                    {toastMessage}
                </div>
            )}

            <div className="pt-[190px] md:pt-52 px-5 sm:px-6 md:px-12 lg:px-20 bg-theme-bg transition-colors duration-500">
                <div className="max-w-[90rem] mx-auto w-full">
                    <div className="w-full aspect-[832/470] bg-theme-text/5 overflow-hidden border border-theme-text/10 rounded-sm mb-8 md:mb-10 transition-colors duration-500">
                        <img src={article.imageUrl} decoding="async" fetchPriority="high" className="w-full h-full object-cover transition-opacity duration-700" alt={article.title} />
                    </div>

                    <button onClick={() => goToCategory(article.category)} className="inline-flex items-center gap-2 bg-brand-red text-white font-display font-bold text-[10px] md:text-sm tracking-[0.16em] uppercase mb-4 px-2 md:px-4 py-1 md:py-1.5 shadow-lg shadow-brand-red/20 rounded-sm hover:bg-brand-red/85 transition-colors">
                        {article.category}
                        {article.subCategory && <><span className="h-3 w-px bg-white/50" />{article.subCategory}</>}
                    </button>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-black text-theme-text leading-[1.28] md:leading-[1.16] tracking-wide md:tracking-tight mb-4 md:mb-6 max-w-6xl transition-colors duration-500">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-theme-text/80 tracking-widest text-[10px] md:text-sm font-bold bg-theme-text/5 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 w-fit border border-theme-text/10 rounded-sm transition-colors duration-500">
                        <span>文｜<button onClick={() => goToAuthor(article.author)} className="text-brand-red hover:underline underline-offset-2">{article.author}</button></span>
                        <span className="text-theme-text/30 transition-colors">|</span>
                        <span>{formatArticleDate(article.date, { withYear: true })}</span>
                    </div>
                </div>
            </div>

            <div className="bg-theme-bg py-8 md:py-24 pb-20 md:pb-24 text-theme-text transition-colors duration-500">
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 relative">

                    <div className="lg:col-span-8 article-content">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-theme-text/10 transition-colors">
                            {/* 1. 分享文字 */}
                            <span className="text-[11px] tracking-widest text-theme-text/60 transition-colors">
                                分享
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
                            <button
                                type="button"
                                onClick={handleToggleSave}
                                disabled={isSaving}
                                className={`flex items-center gap-2 px-3 h-8 rounded-full border transition cursor-pointer disabled:opacity-50 disabled:cursor-wait text-[11px] font-bold tracking-widest ${isSaved
                                    ? 'bg-brand-red border-brand-red text-white'
                                    : 'border-theme-text/20 bg-theme-text/5 text-theme-text/80 hover:bg-brand-red hover:text-white hover:border-brand-red'
                                    }`}
                            >
                                <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark text-xs`}></i>
                                {isSaved ? '已收藏' : '收藏'}
                            </button>
                        </div>

                        {topAd && (
                            <div className="mb-10 md:mb-14">
                                <div className="mb-2 flex items-center gap-2 font-display text-[9px] font-bold uppercase tracking-[0.2em] text-theme-text/45 md:text-[10px]">
                                    <span className="h-px w-6 bg-brand-red" />
                                    <span>廣告</span>
                                </div>
                                <a
                                    href={getSafeExternalUrl(topAd.link)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative mx-auto flex h-[112px] w-full max-w-[320px] items-end overflow-hidden rounded-sm border border-theme-text/10 bg-black px-4 py-4 text-white md:h-[144px] md:max-w-[720px] md:px-6 md:py-5"
                                >
                                    <img
                                        src={topAd.imageUrl}
                                        alt={topAd.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/5" />
                                    <div className="relative min-w-0 max-w-[72%]">
                                        <span className="mb-1 block font-display text-[8px] font-bold uppercase tracking-[0.25em] text-white/60 md:text-[9px]">{topAd.sponsor} · 贊助</span>
                                        <h3 className="line-clamp-2 font-serif text-sm font-bold leading-snug tracking-wide text-white drop-shadow-lg md:text-lg">{topAd.title}</h3>
                                    </div>
                                </a>
                            </div>
                        )}

                        {article.content ? (
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                        ) : (
                            <>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(firstPart) }} />

                                {secondPart && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(secondPart) }} />}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-10 md:my-16">
                                    <div className="w-full aspect-[4/5] bg-theme-text/5 border border-theme-text/10 overflow-hidden transition-colors"><img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-all duration-700" alt="文章內容圖片一" /></div>
                                    <div className="w-full aspect-[4/5] bg-theme-text/5 border border-theme-text/10 overflow-hidden md:mt-12 transition-colors"><img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-all duration-700" alt="文章內容圖片二" /></div>
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dummyContentPart2) }} />
                            </>
                        )}

                        <div className="mt-12 md:mt-16 pt-8 border-t border-theme-text/10 flex flex-col sm:flex-row justify-between items-center gap-6 transition-colors">
                            <div className="flex flex-wrap justify-center gap-2">
                                {articleTags.map((tag) => (
                                    <button key={tag} onClick={() => goToTag(tag)} className="font-display text-[10px] font-bold uppercase tracking-widest border border-theme-text/20 text-theme-text/80 px-3 py-1 hover:bg-theme-text hover:text-theme-bg cursor-pointer transition rounded-full">
                                        #{tag.replace(/\s+/g, '')}
                                    </button>
                                ))}
                            </div>
                            <div className="flex lg:hidden">
                                <button onClick={() => window.scrollTo(0, 0)} className="text-[10px] font-display tracking-widest uppercase text-theme-text/60 hover:text-theme-text transition-colors"><i className="fas fa-arrow-up mr-2"></i>回到頂端</button>
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
                                    <button type="button" key={n.id} className="w-full text-left flex items-start gap-4 cursor-pointer group" onClick={() => openArticle(n.id)}>
                                        <span className="font-serif font-black text-2xl md:text-3xl text-theme-text/15 group-hover:text-brand-red/40 transition-colors leading-none shrink-0 w-8">{String(i + 1).padStart(2, '0')}</span>
                                        <h5 className="font-serif font-bold text-sm md:text-base text-theme-text leading-snug group-hover:text-brand-red transition-colors line-clamp-3">{n.title}</h5>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {sidebarAd && <StickySidebarAd ad={sidebarAd} />}
                    </div>
                </div>

                <div className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20 mt-16 md:mt-20 pt-16 border-t border-theme-text/10 transition-colors">
                    <div className="flex items-end justify-between mb-8 md:mb-10">
                        <h3 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter text-theme-text transition-colors">推薦文章 <span className="text-theme-text/40 font-light text-xl md:text-3xl ml-2 transition-colors">/ UP NEXT</span></h3>
                        <button type="button" onClick={() => goToCategory('最新文章')} className="font-display text-xs md:text-sm font-bold uppercase tracking-widest text-brand-red hover:text-theme-text transition hidden md:block">View All Features &rarr;</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendedNews.map(n => (
                            <button type="button" key={n.id} className="group cursor-pointer flex flex-col h-full text-left" onClick={() => openArticle(n.id)}>
                                <div className="w-full aspect-[832/470] bg-theme-text/10 overflow-hidden mb-4 border border-theme-text/5 transition-colors rounded-sm">
                                    <img src={n.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={n.title} />
                                </div>
                                <span className="text-brand-red font-display font-bold text-[10px] uppercase tracking-widest mb-2">{n.category}</span>
                                <h4 className="text-lg md:text-xl font-serif font-black text-theme-text leading-[1.4] md:leading-snug group-hover:text-brand-red transition-colors line-clamp-2 mb-3 tracking-wide md:tracking-normal">{n.title}</h4>
                                <div className="mt-auto font-display text-[9px] uppercase tracking-widest text-theme-text/60 pt-4 border-t border-theme-text/10 transition-colors">
                                    文｜{n.author} &nbsp;|&nbsp; {formatArticleDate(n.date)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button type="button" className="w-full bg-theme-text text-theme-bg py-24 md:py-40 px-6 text-center group cursor-pointer border-t border-theme-text/10 transition-colors duration-500" onClick={() => goToCategory('首頁')}>
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black text-theme-bg group-hover:text-brand-red transition-colors duration-500 leading-none">
                    Back to Index <i className="fas fa-long-arrow-alt-right ml-2 md:ml-4 inline-block transform md:group-hover:translate-x-12 transition-transform duration-500 text-brand-red"></i>
                </h2>
            </button>
        </>
    );
}
