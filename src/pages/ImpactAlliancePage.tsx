import { getAllianceMembers, getAllianceArticles } from '../api/alliance';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from '../components/AsyncPageState';
import SummitBanner from '../components/SummitBanner';
import FeaturedCarousel from '../components/FeaturedCarousel';

interface ImpactAlliancePageProps {
  openArticle: (id: number) => void;
}

export default function ImpactAlliancePage({ openArticle }: ImpactAlliancePageProps) {
  const { data, error, isLoading, reload } = useAsyncData(
    'alliance-page',
    async (signal) => {
      const [sliderArticles, members] = await Promise.all([
        getAllianceArticles(3, { signal }),
        getAllianceMembers({ signal }),
      ]);
      return { sliderArticles, members };
    },
    null,
  );
  const sliderArticles = data?.sliderArticles ?? [];

  if (isLoading) return <AsyncPageState />;
  if (error || !data) return <AsyncPageState error={error ?? new Error('聯盟資料載入失敗')} onRetry={reload} />;

  return (
    <div className="pt-[190px] md:pt-[190px] pb-40 bg-theme-bg text-theme-text transition-colors duration-500 min-h-screen">
      
      {/* 1. Page Header */}
      <div className="px-5 md:px-12 lg:px-20 mb-10 md:mb-12">
        <div className="max-w-[1400px] mx-auto">
           <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-theme-text border-b border-theme-text/10 pb-6 md:pb-8 transition-colors flex flex-col md:flex-row md:items-baseline">
             影響力聯盟 
             <span className="text-lg md:text-2xl font-display font-light text-theme-text/40 md:ml-4 tracking-widest uppercase mt-1 md:mt-0">Alliance Network</span>
           </h1>
        </div>
      </div>

      <div className="px-5 md:px-12 lg:px-20 mb-14 md:mb-24">
        <div className="max-w-[1400px] mx-auto">
          <SummitBanner />
        </div>
      </div>

      {/* 2. Featured Spotlight */}
      <div className="px-5 md:px-12 lg:px-20 mb-14 md:mb-24">
        <FeaturedCarousel
          articles={sliderArticles}
          openArticle={openArticle}
          eyebrowLabel="Spotlight"
          categoryLabel="Impact Alliance"
          readMoreLabel="Read Deep Dive"
        />
      </div>

      {/* 3. Alliance Mission / Quote Area */}
      <div className="w-full py-16 md:py-24 bg-theme-text/5 border-y border-theme-text/10 relative overflow-hidden transition-colors mb-16 md:mb-24">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif text-theme-text/5 leading-none pointer-events-none select-none">
            NETWORK
         </div>
         <div className="max-w-[1400px] mx-auto px-5 text-center relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-theme-text leading-tight max-w-4xl mx-auto italic">
              「我們是一群看見影響力的同行者，透過連結與分享，讓屬靈的資源在亞洲這塊土地上自由流動。」
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-12 mb-6"></div>
         </div>
      </div>

      {/* 4. Partner Cards - Round Layout (matching ColumnPage) */}
      <div className="px-5 md:px-12 lg:px-20 mb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-12 md:mb-20 border-b border-theme-text/10 pb-6">
             <h3 className="text-xl md:text-2xl font-bold tracking-widest uppercase">合作夥伴與聯盟成員</h3>
             <span className="flex-1 h-px bg-brand-red/40"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 lg:gap-x-16">
            {data.members.map((member) => (
              <div 
                key={member.id} 
                className="group flex flex-col"
              >
                {/* Round Logo Frame */}
                <div className="relative mb-8 flex justify-center">
                   <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-theme-text/5 p-1.5 border border-theme-text/10 group-hover:border-brand-red/40 transition-all duration-700 overflow-hidden flex items-center justify-center bg-white">
                      <img src={member.logoUrl} loading="lazy" decoding="async" className="w-[70%] h-[70%] object-contain transition-all duration-700" alt={member.name} />
                   </div>
                   <div className="absolute -bottom-2 px-4 py-1.5 bg-brand-red text-white text-[9px] font-bold tracking-widest uppercase rounded-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">認證成員</div>
                </div>
                
                {/* Info Center Aligned */}
                <div className="text-center group">
                   <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-brand-red font-display text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">{member.latestArticleDate}</span>
                   </div>
                   <h4 className="font-serif text-xl md:text-2xl font-black text-theme-text mb-4 group-hover:text-brand-red transition-colors leading-snug">
                     {member.name}
                   </h4>
                   <p 
                    className="text-theme-text/60 text-xs md:text-sm line-clamp-2 leading-relaxed px-4 cursor-pointer hover:text-brand-red transition-all"
                    onClick={() => openArticle(member.latestArticleId)}
                   >
                     {member.latestArticleTitle}
                   </p>
                   
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
