import { AdItem } from '../data';

interface Props { ad: AdItem; }

export default function StickySidebarAd({ ad }: Props) {
  return (
    <a href={ad.link} className="sticky top-32 border border-theme-text/10 bg-theme-text/5 aspect-[3/4] sm:aspect-auto sm:h-[400px] lg:aspect-[3/4] flex flex-col items-center justify-center p-6 md:p-8 text-center relative group cursor-pointer overflow-hidden rounded-sm transition-colors block">
        <img src={ad.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700 md:grayscale md:group-hover:grayscale-0" alt={ad.title} />
        <div className="absolute inset-0 bg-gradient-to-b from-theme-bg/30 to-theme-bg/90 transition-colors"></div>
        <span className="absolute top-3 md:top-4 right-3 md:right-4 text-[9px] md:text-[10px] font-display tracking-widest uppercase border border-theme-text/20 px-1 md:px-2 py-0.5 z-10 bg-theme-bg/70 text-theme-text/70 transition-colors group-hover:text-theme-text">SPONSORED</span>
        <div className="relative z-10 bg-theme-bg/50 backdrop-blur-md p-5 md:p-6 border border-theme-text/10 group-hover:border-brand-red/50 transition-colors w-full shadow-xl">
            <span className="text-[10px] uppercase font-display tracking-widest text-brand-red block mb-2">{ad.sponsor}</span>
            <h4 className="font-serif font-black text-xl md:text-3xl text-theme-text mb-4 leading-tight transition-colors line-clamp-3">{ad.title}</h4>
            <div className="font-display text-[10px] md:text-xs font-bold uppercase tracking-widest bg-brand-red text-white px-4 py-2 group-hover:bg-theme-text group-hover:text-theme-bg transition w-full inline-block">了解詳情</div>
        </div>
    </a>
  );
}
