import React from 'react';

interface DonationGalleryProps {
  openPlan?: (id: number) => void;
}

export default function DonationGallery({ openPlan }: DonationGalleryProps) {
  const items = [
    { id: 1, title: '【新生的甘霖】復活草生命禮盒', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/23/69c0dc0e9dc17.jpg' },
    { id: 2, title: '在沙漠中匯聚活水，將影響力推向地極', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/13/69b3d20573950.jpg' },
    { id: 3, title: 'The Greatest Gift from God｜神的愛最美的禮物', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/03/11/69b10d270667f.png' },
    { id: 4, title: '乘著愛的風出發吧！', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/02/10/698ae5872cae3.png' },
    { id: 5, title: '在你所在之處綻放', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2025/12/08/69366c6361bfd.png' },
    { id: 6, title: '亞洲新核心', imageUrl: 'https://media.ct.org.tw/upload/dedication_article/2026/04/14/69ddb83f810ff.jpg' }
  ];

  return (
    <div className="pt-[190px] md:pt-40 pb-24 px-5 md:px-12 lg:px-20 min-h-screen bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-theme-text/80 mb-10 text-left font-bold border-b border-theme-text/20 pb-6 transition-colors">奉獻</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-x-12 w-full mb-20">
          {items.map(item => (
            <div 
              key={item.id} 
              className="cursor-pointer group flex flex-col"
              onClick={() => openPlan && openPlan(item.id)}
            >
              <div className="w-full aspect-video md:aspect-video bg-theme-text/5 overflow-hidden border border-theme-text/10 mb-4 rounded-sm">
                <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
              </div>
              <h3 className="font-serif font-black text-xl md:text-[22px] text-theme-text leading-snug group-hover:text-brand-red transition-colors flex-grow">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3">
          <button className="w-10 h-10 border border-theme-text/30 flex items-center justify-center hover:bg-theme-text/10 transition-colors text-theme-text">
            <span>&lt;</span>
          </button>
          <button className="w-10 h-10 bg-[#4A4A4A] text-white flex items-center justify-center font-display">1</button>
          <button className="w-10 h-10 border border-theme-text/30 flex items-center justify-center hover:bg-theme-text/10 transition-colors text-theme-text font-display">2</button>
          <button className="w-10 h-10 border border-theme-text/30 flex items-center justify-center hover:bg-theme-text/10 transition-colors text-theme-text">
            <span>&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
