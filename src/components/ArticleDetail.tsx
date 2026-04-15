import { useState } from 'react';
import { MOCK_NEWS, MOCK_ADS, dummyContentPart1, dummyContentPart2 } from '../data';
import InlineArticleBanner from './InlineArticleBanner';
import StickySidebarAd from './StickySidebarAd';

interface ArticleDetailProps {
    articleId: number;
    openArticle: (id: number) => void;
    goToCategory: (cat: string) => void;
}

export default function ArticleDetail({ articleId, openArticle, goToCategory }: ArticleDetailProps) {
    const article = MOCK_NEWS.find(n => n.id === articleId) || MOCK_NEWS[0];
    const recommendedNews = MOCK_NEWS.filter(n => n.id !== articleId).slice(0, 4);

    // 取得隨機廣告
    const [randomAd] = useState(() => {
        const adValues = Object.values(MOCK_ADS);
        return adValues.length > 0 ? adValues[Math.floor(Math.random() * adValues.length)] : null;
    });

    // 嘗試在第二段後切割內容
    let firstPart = dummyContentPart1;
    let secondPart = '';
    if (!article.content) {
        const match = dummyContentPart1.match(new RegExp("(.*?</p>\\s*.*?</p>)(.*)", "s"));
        if (match) {
            firstPart = match[1];
            secondPart = match[2];
        }
    }

    return (
        <>
            <div className="relative w-full h-[65svh] md:h-[70svh] bg-theme-text/5 overflow-hidden border-b border-theme-text/10 transition-colors duration-500">
                <img src={article.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale transition-opacity duration-700" alt="Cover" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-12 lg:p-20 pb-10 md:pb-16 bg-gradient-to-t from-theme-bg via-theme-bg/90 to-theme-bg/30 transition-colors duration-500">
                    <div className="max-w-[90rem] mx-auto w-full z-10 translate-y-2 md:translate-y-10">
                        <span className="inline-block bg-brand-red text-white font-display font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase mb-4 px-2 md:px-4 py-1 md:py-1.5 shadow-lg shadow-brand-red/20 rounded-sm">{article.category}</span>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[80px] font-serif font-black text-theme-text leading-[1.35] md:leading-[1.1] tracking-wide md:tracking-tight mb-5 md:mb-6 max-w-5xl transition-colors duration-500 drop-shadow-md">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-theme-text/80 font-display uppercase tracking-widest text-[9px] md:text-sm font-bold bg-theme-text/5 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 w-fit border border-theme-text/10 rounded-sm transition-colors duration-500">
                            <span>Words by <strong className="text-brand-red">{article.author}</strong></span>
                            <span className="text-theme-text/30 transition-colors">|</span>
                            <span>Published {article.date}, 2026</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-theme-bg py-8 md:py-24 text-theme-text transition-colors duration-500">
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 relative">

                    <div className="lg:col-span-8 article-content">
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-theme-text/10 transition-colors">
                            <span className="font-display text-[10px] tracking-widest uppercase text-theme-text/60 transition-colors">Share</span>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition bg-theme-text/5 cursor-pointer text-theme-text/80">
                                    <i className="fab fa-facebook-f text-xs"></i>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition bg-theme-text/5 cursor-pointer text-theme-text/80">
                                    <i className="fab fa-instagram text-xs"></i>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center hover:bg-[#06C755] hover:text-white hover:border-[#06C755] transition bg-theme-text/5 cursor-pointer text-theme-text/80">
                                    <i className="fab fa-line text-xs"></i>
                                </div>
                            </div>
                        </div>

                        {article.content ? (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        ) : (
                            <>
                                <div dangerouslySetInnerHTML={{ __html: firstPart }} />

                                {randomAd && <InlineArticleBanner ad={randomAd} />}

                                {secondPart && <div dangerouslySetInnerHTML={{ __html: secondPart }} />}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-10 md:my-16">
                                    <div className="w-full aspect-[4/5] bg-theme-text/5 border border-theme-text/10 overflow-hidden transition-colors"><img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-700" alt="Content 1" /></div>
                                    <div className="w-full aspect-[4/5] bg-theme-text/5 border border-theme-text/10 overflow-hidden md:mt-12 transition-colors"><img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-700" alt="Content 2" /></div>
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: dummyContentPart2 }} />
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
                        <div className="border border-theme-text/10 p-6 md:p-8 bg-theme-text/5 backdrop-blur-md relative group rounded-sm mt-6 lg:mt-0 transition-colors">
                            <div className="absolute -top-6 left-6 lg:-top-5 lg:-left-5 w-12 md:w-14 h-12 md:h-14 bg-brand-red rounded-full flex items-center justify-center text-white text-lg md:text-xl border-4 border-theme-bg group-hover:scale-110 shadow-lg shadow-brand-red/30 transition-transform z-10"><i className="fas fa-pen-nib"></i></div>
                            <span className="font-display text-[10px] tracking-widest uppercase text-theme-text/60 block mb-1 mt-2 transition-colors">Author Profile</span>
                            <h4 className="font-serif font-black text-2xl md:text-3xl mb-3 text-theme-text transition-colors">{article.author}</h4>
                            <p className="font-light text-sm md:text-base opacity-80 mb-6 text-theme-text leading-relaxed transition-colors">Dedicated to exploring the intersection of faith, culture, and modern society through an avant-garde lens.</p>
                            <button className="w-full py-3 border border-theme-text/20 font-display text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/90 hover:bg-theme-text hover:text-theme-bg hover:border-theme-text transition rounded-sm">View All Articles</button>
                        </div>

                        {MOCK_ADS.sidebar && <StickySidebarAd ad={MOCK_ADS.sidebar} />}
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
                                    <img src={n.imageUrl} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={n.title} />
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
