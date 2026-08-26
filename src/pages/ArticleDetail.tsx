import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { getArticle, getArticleContent, getArticleTags, getPopularNews, getRecommended } from '../api/news';
import { getAd } from '../api/ads';
import StickySidebarAd from '../components/StickySidebarAd';
import PopularArticleList from '../components/PopularArticleList';
import InlineArticleBanner from '../components/InlineArticleBanner';
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
            const [article, recommendedNews, popular, content, saved, topAd, inlineAd, sidebarAd] = await Promise.all([
                getArticle(articleId, { signal }),
                getRecommended(articleId, 4, { signal }),
                // 側欄是全站熱門排行，跟頁尾「這篇的推薦文章」是不同來源；
                // 兩邊都打 getRecommended 的話會拿到一模一樣的清單。多抓一篇，扣掉自己後仍有 5 筆。
                getPopularNews(undefined, 6, { signal }).catch(() => []),
                getArticleContent(articleId, { signal }),
                getArticleSavedStatus(articleId, isLoggedIn, { signal }).catch(() => false),
                getAd('infeed', { signal }).catch(() => undefined),
                getAd('inline', { signal }).catch(() => undefined),
                getAd('sidebar', { signal }).catch(() => undefined),
            ]);
            if (!article) throw new Error('找不到文章');
            const popularNews = popular.filter((news) => news.id !== articleId).slice(0, 5);
            return { article, recommendedNews, popularNews, content, saved, topAd, inlineAd, sidebarAd };
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

    const { article, recommendedNews, popularNews, content, topAd, inlineAd, sidebarAd } = data;
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
    const handleShare = async (type: 'fb' | 'ig' | 'lin') => {
        const url = encodeURIComponent(window.location.href);
        switch (type) {
            case 'fb':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
                break;
            case 'lin':
                window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, '_blank', 'width=600,height=400');
                break;
            case 'ig':
                // 非 HTTPS 或使用者拒絕權限時 clipboard 會 reject，別報「已複製」騙人
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    showToast('網址已複製，快去 IG 分享！');
                } catch {
                    showToast('複製失敗，請手動複製網址');
                }
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

            <div className="pt-[190px] md:pt-52 px-5 sm:px-6 md:px-12 lg:px-20 bg-theme-bg">
                <div className="max-w-[90rem] mx-auto w-full">
                    <div className="w-full aspect-[832/470] bg-theme-text/5 overflow-hidden border border-theme-text/10 rounded-sm mb-8 md:mb-10">
                        <img src={article.imageUrl} decoding="async" fetchPriority="high" className="w-full h-full object-cover" alt={article.title} />
                    </div>

                    <button onClick={() => goToCategory(article.category)} className="inline-flex items-center gap-2 bg-brand-red text-white font-display font-bold text-[10px] md:text-sm tracking-[0.16em] uppercase mb-4 px-2 md:px-4 py-1 md:py-1.5 rounded-sm hover:bg-brand-red/85 transition-colors">
                        {article.category}
                        {article.subCategory && <><span className="h-3 w-px bg-white/50" />{article.subCategory}</>}
                    </button>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-black text-theme-text leading-[1.28] md:leading-[1.16] tracking-wide md:tracking-tight mb-4 md:mb-6 max-w-6xl">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-theme-text/80 tracking-widest text-[10px] md:text-sm font-bold bg-theme-text/5 px-3 md:px-4 py-1.5 md:py-2 w-fit border border-theme-text/10 rounded-sm">
                        <button onClick={() => goToAuthor(article.author)} className="text-brand-red hover:underline underline-offset-2">{article.author}</button>
                        <span className="text-theme-text/30">|</span>
                        <span>{formatArticleDate(article.date, { withYear: true })}</span>
                    </div>
                </div>
            </div>

            <div className="bg-theme-bg py-8 md:py-20 pb-20 md:pb-24 text-theme-text">
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">

                    <div className="lg:col-span-8 article-content">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-theme-text/10">
                            {/* 1. 分享文字 */}
                            <span className="text-[11px] tracking-widest text-theme-text/60">
                                分享
                            </span>

                            {/* 2. 圖示容器：刪除了多餘的層級與 mt-6 */}
                            <div className="flex gap-3">
                                {/* Facebook */}
                                <button
                                    type="button"
                                    onClick={() => handleShare('fb')}
                                    aria-label="分享到 Facebook"
                                    className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition bg-theme-text/5 cursor-pointer text-theme-text/80"
                                >
                                    <i className="fab fa-facebook-f text-xs" aria-hidden="true"></i>
                                </button>

                                {/* Instagram */}
                                <button
                                    type="button"
                                    onClick={() => handleShare('ig')}
                                    aria-label="分享到 Instagram"
                                    className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition bg-theme-text/5 cursor-pointer text-theme-text/80"
                                >
                                    <i className="fab fa-instagram text-xs" aria-hidden="true"></i>
                                </button>

                                {/* Line */}
                                <button
                                    type="button"
                                    onClick={() => handleShare('lin')}
                                    aria-label="分享到 LINE"
                                    className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#06C755] hover:text-white hover:border-[#06C755] transition bg-theme-text/5 cursor-pointer text-theme-text/80"
                                >
                                    <i className="fab fa-line text-xs" aria-hidden="true"></i>
                                </button>
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
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/5" />
                                    <div className="relative min-w-0 max-w-[72%]">
                                        <span className="mb-1 block font-display text-[8px] font-bold uppercase tracking-[0.25em] text-white/60 md:text-[9px]">{topAd.sponsor} · 贊助</span>
                                        <p className="line-clamp-2 font-serif text-sm font-bold leading-snug tracking-wide text-white md:text-lg">{topAd.title}</p>
                                    </div>
                                </a>
                            </div>
                        )}

                        {article.content ? (
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                        ) : (
                            <>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(firstPart) }} />

                                {inlineAd && <InlineArticleBanner ad={inlineAd} />}

                                {secondPart && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(secondPart) }} />}

                                {/* 上下各一張全寬圖，取代原本左右並排（並排在窄欄寬會擠成兩條細長圖）*/}
                                <div className="my-10 md:my-16 flex flex-col gap-4 md:gap-6">
                                    <div className="w-full aspect-[832/470] bg-theme-text/5 border border-theme-text/10 overflow-hidden rounded-sm">
                                        <img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1600" loading="lazy" decoding="async" className="w-full h-full object-cover" alt="文章內容圖片一" />
                                    </div>
                                    <div className="w-full aspect-[832/470] bg-theme-text/5 border border-theme-text/10 overflow-hidden rounded-sm">
                                        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1600" loading="lazy" decoding="async" className="w-full h-full object-cover" alt="文章內容圖片二" />
                                    </div>
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(dummyContentPart2) }} />
                            </>
                        )}

                        <div className="mt-12 md:mt-16 pt-8 border-t border-theme-text/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex flex-wrap justify-center gap-2">
                                {articleTags.map((tag) => (
                                    <button key={tag} onClick={() => goToTag(tag)} className="font-display text-[10px] font-bold uppercase tracking-widest border border-theme-text/20 text-theme-text/80 px-3 py-1 hover:bg-theme-text hover:text-theme-bg cursor-pointer transition rounded-full">
                                        #{tag.replace(/\s+/g, '')}
                                    </button>
                                ))}
                            </div>
                            <div className="flex lg:hidden">
                                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[10px] font-display tracking-widest uppercase text-theme-text/60 hover:text-theme-text transition-colors"><i className="fas fa-arrow-up mr-2"></i>回到頂端</button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-10 md:space-y-12 mt-8 lg:mt-0">
                        <PopularArticleList items={popularNews} openArticle={openArticle} />

                        {sidebarAd && <StickySidebarAd ad={sidebarAd} />}
                    </div>
                </div>

                <div className="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20 mt-16 md:mt-20 pt-16 border-t border-theme-text/10">
                    <div className="flex items-end justify-between mb-8 md:mb-10">
                        <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter text-theme-text">推薦文章 <span className="text-theme-text/40 font-light text-xl md:text-3xl ml-2">/ UP NEXT</span></h2>
                        <button type="button" onClick={() => goToCategory('最新文章')} className="font-display text-xs md:text-sm font-bold uppercase tracking-widest text-brand-red hover:text-theme-text transition hidden md:block">View All Features &rarr;</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recommendedNews.map(n => (
                            <button type="button" key={n.id} className="group cursor-pointer flex flex-col h-full text-left" onClick={() => openArticle(n.id)}>
                                <div className="w-full aspect-[832/470] bg-theme-text/10 overflow-hidden mb-4 border border-theme-text/5 rounded-sm">
                                    <img src={n.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={n.title} />
                                </div>
                                <span className="text-brand-red font-display font-bold text-[10px] uppercase tracking-widest mb-2">{n.category}</span>
                                <h3 className="text-lg md:text-xl font-serif font-bold text-theme-text leading-[1.4] md:leading-snug group-hover:text-brand-red transition-colors line-clamp-2 mb-3 tracking-wide md:tracking-normal">{n.title}</h3>
                                <div className="mt-auto font-display text-[9px] uppercase tracking-widest text-theme-text/60 pt-4 border-t border-theme-text/10">
                                    {n.author} &nbsp;|&nbsp; {formatArticleDate(n.date)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button type="button" className="w-full bg-theme-text text-theme-bg py-16 md:py-40 px-6 text-center group cursor-pointer border-t border-theme-text/10" onClick={() => goToCategory('首頁')}>
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black text-theme-bg group-hover:text-brand-red transition-colors duration-500 leading-none">
                    Back to Index <i className="fas fa-long-arrow-alt-right ml-2 md:ml-4 inline-block transform md:group-hover:translate-x-12 transition-transform duration-500 text-brand-red"></i>
                </h2>
            </button>
        </>
    );
}
