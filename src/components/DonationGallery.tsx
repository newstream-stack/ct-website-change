import { useState } from 'react';

interface DonationGalleryProps {
  openPlan?: (id: number) => void;
}

export default function DonationGallery({ openPlan }: DonationGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const plans = [
    { id: 1, title: '【新生的甘霖】復活草生命禮盒', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/23/69c0dc0e9dc17.jpg', subtitle: 'Revival亞洲論壇影響力中心2026年隆重獻禮', description: '生命未曾止息，只是正等待。在乾旱與沉默之中，我們有時蜷縮著...直到那一刻，甘霖沛降。' },
    { id: 2, title: '在沙漠中匯聚活水', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/13/69b3d20573950.jpg', subtitle: '將影響力推向地極', description: '這是一個充滿挑戰的時代，卻也是神正在全地興起領袖的時刻。' },
    { id: 3, title: 'The Greatest Gift from God', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/11/69b10d270667f.png', subtitle: '神的愛最美的禮物', description: '送出一份禮品，傳遞一份祝福。誠摯邀請您參與這份愛的行動。' },
    { id: 4, title: '乘著愛的風出發吧！', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/02/10/698ae5872cae3.png', subtitle: '為偏鄉孩子帶來驚喜', description: '一份捐款，為孩子帶來生命中的驚喜。在偏鄉，許多孩子需要您的關懷。' },
    { id: 5, title: '在你所在之處綻放', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2025/12/08/69366c6361bfd.png', subtitle: 'Bloom in 2026', description: '在這劇烈搖晃、不確定的時代裡，我們不是感傷時光流逝，而是充滿信心期待。' },
    { id: 6, title: '亞洲新核心', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/04/14/69ddb83f810ff.jpg', subtitle: '從亞洲開始，影響世界', description: '亞洲正站在全球轉變的中心。IAA 被呼召興起，成為亞洲教會的屬靈引擎。' }
  ];

  const featuredPlan = plans[0];

  return (
    <div className="pt-[160px] md:pt-[190px] pb-40 bg-theme-bg text-theme-text transition-colors duration-500 min-h-screen">
      
      {/* 1. Header Section */}
      <div className="px-5 md:px-12 lg:px-20 mb-12 md:mb-16">
        <div className="max-w-[1400px] mx-auto">
           <h1 className="text-4xl md:text-5xl font-serif font-black tracking-widest text-theme-text border-b border-theme-text/10 pb-6 md:pb-8 transition-colors">奉獻 <span className="text-xl md:text-2xl font-display font-light text-theme-text/40 ml-4 tracking-widest uppercase">Giving</span></h1>
        </div>
      </div>

      {/* 2. Featured Highlight */}
      <div className="px-5 md:px-12 lg:px-20 mb-24 md:mb-32">
        <div className="max-w-[1400px] mx-auto relative group overflow-hidden bg-theme-text/5 border border-theme-text/10 rounded-sm">
           <div className="flex flex-col lg:flex-row min-h-[500px]">
              {/* Image Side */}
              <div className="w-full lg:w-[60%] relative overflow-hidden h-[300px] lg:h-auto">
                 <img 
                    src={featuredPlan.imageUrl} 
                    className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                    alt={featuredPlan.title} 
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-transparent to-black/20"></div>
              </div>
              
              {/* Content Side */}
              <div className="w-full lg:w-[40%] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-theme-bg lg:border-l border-theme-text/10">
                 <span className="text-brand-red font-display font-bold text-xs tracking-[0.4em] uppercase mb-4">Featured Support</span>
                 <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black mb-6 leading-tight">{featuredPlan.title}</h2>
                 <p className="text-theme-text/60 font-light leading-relaxed mb-10 text-sm md:text-base">{featuredPlan.description}</p>
                 <button 
                    onClick={() => openPlan && openPlan(featuredPlan.id)}
                    className="self-start px-10 py-4 bg-theme-text text-theme-bg font-display font-bold text-xs tracking-widest uppercase hover:bg-brand-red hover:text-white transition-all transform hover:-translate-y-1 shadow-lg"
                 >
                    立即奉獻支持 <i className="fas fa-arrow-right ml-4"></i>
                 </button>
              </div>
           </div>
           
           {/* Background Ornament (Dotted overlay or lines) */}
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <div className="grid grid-cols-5 gap-2">
                 {[...Array(25)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-theme-text"></div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 3. The Giving List - Premium Grid */}
      <div className="px-5 md:px-12 lg:px-20 mb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-12 md:mb-16 border-b border-theme-text/10 pb-6">
             <h3 className="text-xl md:text-2xl font-bold tracking-widest uppercase">奉獻方案與支持</h3>
             <span className="w-12 h-px bg-brand-red"></span>
             <span className="text-[10px] md:text-xs text-theme-text/40 font-display tracking-widest uppercase">Impact Portfolios</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-x-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className="group cursor-pointer"
                onClick={() => openPlan && openPlan(plan.id)}
              >
                <div className="relative aspect-[4/5] bg-theme-text/5 overflow-hidden border border-theme-text/10 mb-6 group-hover:border-brand-red/30 transition-all duration-500 shadow-sm">
                   <img 
                      src={plan.imageUrl} 
                      className="w-full h-full object-cover md:grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                      alt={plan.title} 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity"></div>
                   
                   {/* Reveal on hover overlay */}
                   <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="inline-block px-3 py-1 bg-brand-red text-white text-[9px] font-bold tracking-widest uppercase mb-4">View Detail</span>
                   </div>
                </div>
                
                <div className="flex flex-col">
                   <span className="text-brand-red font-display text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-2">{plan.subtitle}</span>
                   <h4 className="text-lg md:text-xl lg:text-2xl font-serif font-black text-theme-text group-hover:text-brand-red transition-colors leading-snug mb-3">
                     {plan.title}
                   </h4>
                   <p className="text-theme-text/50 text-xs md:text-sm line-clamp-2 leading-relaxed">
                     {plan.description}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Vision Quote Area */}
      <div className="w-full py-24 md:py-32 bg-theme-text/5 border-y border-theme-text/10 relative overflow-hidden transition-colors">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] md:text-[250px] font-serif text-theme-text/5 leading-none pointer-events-none select-none">
            GIVING
         </div>
         <div className="max-w-[1400px] mx-auto px-5 text-center relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-theme-text leading-tight max-w-4xl mx-auto italic">
              「因為你們知道我們主耶穌基督的恩典：他本來富足，卻為你們成了貧窮，叫你們因他的貧窮，可以成為富足。」
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-12 mb-6"></div>
            <p className="text-theme-text/40 font-display text-xs md:text-sm tracking-[0.4em] uppercase">哥林多後書 8:9</p>
         </div>
      </div>

      {/* 5. Pagination - Minimalist */}
      <div className="mt-24 flex items-center justify-center gap-6 px-5">
         <button className="text-theme-text/40 hover:text-brand-red flex items-center gap-4 text-xs font-bold tracking-widest uppercase transition-all group">
            <i className="fas fa-chevron-left group-hover:-translate-x-1 transition-transform"></i> Prev
         </button>
         <div className="flex items-center gap-4">
            <span className="w-8 h-8 flex items-center justify-center bg-theme-text text-theme-bg font-display font-black text-xs">01</span>
            <span className="w-8 h-8 flex items-center justify-center text-theme-text/40 font-display font-black text-xs hover:text-theme-text cursor-pointer">02</span>
         </div>
         <button className="text-theme-text/40 hover:text-brand-red flex items-center gap-4 text-xs font-bold tracking-widest uppercase transition-all group">
            Next <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
         </button>
      </div>

    </div>
  );
}
