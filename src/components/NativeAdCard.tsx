import { AdItem } from '../data';

interface NativeAdCardProps {
  ad: AdItem;
}

export default function NativeAdCard({ ad }: NativeAdCardProps) {
  return (
    <a href={ad.link} className="group relative flex flex-col sm:flex-row md:flex-col overflow-hidden bg-theme-text/5 hover:bg-theme-text/10 transition-colors border border-brand-red/20 shadow-sm cursor-pointer col-span-1">
      <div className="w-full sm:w-2/5 md:w-full h-48 sm:h-auto md:h-64 flex-shrink-0 relative overflow-hidden bg-theme-text/10">
        <img src={ad.imageUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={ad.title} />
        <div className="absolute top-3 left-3 bg-brand-red text-white text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold animate-pulse">Sponsored</div>
      </div>
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <span className="text-[10px] font-display uppercase tracking-[0.2em] text-brand-red block mb-2">{ad.sponsor}</span>
          <h3 className="font-serif font-bold text-lg md:text-xl leading-snug mb-3 text-theme-text group-hover:text-brand-red transition-colors line-clamp-2">
            {ad.title}
          </h3>
          <p className="text-sm text-theme-text/70 line-clamp-2 md:line-clamp-3">
            {ad.description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-widest text-theme-text/50 font-display">
          <span>Promoted Content</span>
          <i className="fas fa-arrow-right group-hover:text-brand-red group-hover:translate-x-1 transition-all"></i>
        </div>
      </div>
    </a>
  );
}
