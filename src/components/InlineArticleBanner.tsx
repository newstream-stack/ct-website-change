import { AdItem } from '../types';

interface Props { ad: AdItem; }

export default function InlineArticleBanner({ ad }: Props) {
  return (
    <a href={ad.link} className="w-full border border-theme-text/10 py-6 md:py-10 my-10 md:my-14 flex flex-col md:flex-row items-center justify-between bg-theme-text/5 hover:bg-theme-text/10 backdrop-blur-sm relative group cursor-pointer transition-colors duration-500 gap-6 px-6 md:px-10">
      <span className="absolute top-2 right-3 md:top-3 md:right-4 text-[8px] md:text-[9px] font-display tracking-widest uppercase border border-theme-text/20 text-theme-text/50 px-2 py-0.5 group-hover:text-theme-text/90 transition-colors">SPONSORED</span>
      
      <div className="flex-1 w-full flex flex-col justify-center mt-6 md:mt-0">
        <span className="text-[10px] font-display uppercase tracking-widest text-brand-red mb-2">{ad.sponsor}</span>
        <h4 className="font-serif font-black text-xl md:text-3xl text-theme-text group-hover:text-brand-red transition-colors leading-snug">{ad.title}</h4>
        <p className="mt-2 md:mt-3 text-sm md:text-base text-theme-text/70">{ad.description}</p>
      </div>

      <div className="w-full md:w-[40%] aspect-video md:aspect-[16/10] relative overflow-hidden bg-theme-text/10 shrink-0 border border-theme-text/5 rounded-sm">
        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
      </div>
    </a>
  );
}
