import { useState } from 'react';
import { getAd } from '../api/ads';
import { useAsyncData } from '../hooks/useAsyncData';
import { getSafeExternalUrl } from '../utils/navigation';

export default function FloatingImageAd() {
  const { data: ad } = useAsyncData('floating-ad', (signal) => getAd('floating', { signal }), undefined);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!ad || isDismissed) return null;

  return (
    <a
      href={getSafeExternalUrl(ad.link)}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-3 sm:bottom-5 left-3 right-3 sm:left-5 sm:right-auto z-40 block sm:w-[340px] overflow-hidden rounded-lg border border-theme-text/10 bg-theme-text shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-slide-up"
    >
      <div className="relative h-32 sm:h-40 w-full overflow-hidden">
        <img
          src={ad.imageUrl}
          alt={ad.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDismissed(true);
          }}
          title="關閉廣告"
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-theme-bg/80 hover:bg-brand-red text-theme-text hover:text-white transition-colors cursor-pointer"
        >
          <i className="fas fa-times text-[11px]"></i>
        </button>
      </div>
    </a>
  );
}
