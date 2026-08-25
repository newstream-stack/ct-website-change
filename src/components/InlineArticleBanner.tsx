import { AdItem } from '../types';
import { getSafeExternalUrl } from '../utils/navigation';

interface Props { ad: AdItem; className?: string; }

export default function InlineArticleBanner({ ad, className = 'my-10 md:my-14' }: Props) {
  return (
    <a href={getSafeExternalUrl(ad.link)} target="_blank" rel="noopener noreferrer" className={`w-full border border-theme-text/10 py-6 md:py-10 flex flex-col md:flex-row items-center justify-between bg-theme-text/5 hover:bg-theme-text/10 backdrop-blur-sm relative group cursor-pointer transition-colors duration-500 gap-6 px-6 md:px-10 ${className}`}>
      <span className="absolute top-2 right-3 md:top-3 md:right-4 text-[9px] md:text-[10px] tracking-widest border border-theme-text/20 text-theme-text/50 px-2 py-0.5 group-hover:text-theme-text/90 transition-colors">贊助</span>
      
      <div className="flex-1 w-full flex flex-col justify-center mt-6 md:mt-0">
        <span className="text-[10px] font-display uppercase tracking-widest text-brand-red mb-2">{ad.sponsor}</span>
        <h4 className="font-serif font-black text-xl md:text-3xl text-theme-text group-hover:text-brand-red transition-colors leading-snug">{ad.title}</h4>
        <p className="mt-2 md:mt-3 text-sm md:text-base text-theme-text/70">{ad.description}</p>
      </div>

      <div className="w-[320px] h-[180px] md:h-[200px] mx-auto md:mx-0 relative overflow-hidden bg-theme-text/10 shrink-0 border border-theme-text/5 rounded-sm">
        <img src={ad.imageUrl} alt={ad.title} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
      </div>
    </a>
  );
}
