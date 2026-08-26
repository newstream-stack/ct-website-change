interface SummitBannerProps {
  className?: string;
}

export default function SummitBanner({ className = '' }: SummitBannerProps) {
  return (
    <aside
      aria-label="IMPACT 2026 SUMMIT 廣告"
      className={`group relative mx-auto flex h-[128px] w-[320px] items-center justify-center overflow-hidden border border-theme-text/10 bg-theme-text/5 transition-colors md:h-[192px] md:w-[800px] ${className}`}
    >
      <img
        src="./images/impact-summit-banner.png"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        alt="IMPACT 2026 SUMMIT 活動現場"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 text-center">
        <h3 className="font-serif text-2xl font-black text-white transition-colors md:text-3xl">
          IMPACT 2026 SUMMIT
        </h3>
        <p className="mt-2 font-display text-sm font-bold uppercase tracking-widest text-white/90 transition-colors group-hover:text-white md:text-base">
          Register Now <i className="fas fa-arrow-right" />
        </p>
      </div>
    </aside>
  );
}
