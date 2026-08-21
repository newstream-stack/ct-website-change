import { AdItem } from '../types';
import { getSafeExternalUrl } from '../utils/navigation';

interface Props { ad: AdItem; }

export default function StickySidebarAd({ ad }: Props) {
  const images = [
    { src: ad.imageUrl, alt: ad.title },
    { src: './images/article-sidebar-community-ad.png', alt: '影響力聯盟交流活動' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
      {images.map((image) => (
        <a
          key={image.src}
          href={getSafeExternalUrl(ad.link)}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-[300px] h-[400px] mx-auto overflow-hidden rounded-sm border border-theme-text/10 bg-theme-text/5"
        >
          <img
            src={image.src}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={image.alt}
          />
          <span className="absolute right-3 top-3 z-10 border border-theme-text/20 bg-theme-bg/85 px-2 py-0.5 font-display text-[9px] uppercase tracking-widest text-theme-text/70 backdrop-blur-sm transition-colors group-hover:text-theme-text md:right-4 md:top-4 md:text-[10px]">
            SPONSORED
          </span>
        </a>
      ))}
    </div>
  );
}
