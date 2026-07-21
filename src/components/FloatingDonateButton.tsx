interface FloatingDonateButtonProps {
  goToCategory: (cat: string) => void;
}

export default function FloatingDonateButton({ goToCategory }: FloatingDonateButtonProps) {
  return (
    <div className="fixed bottom-8 sm:bottom-10 right-3 sm:right-5 z-40">
      <span className="absolute inset-0 rounded-full bg-brand-red/50 animate-ping [animation-duration:2.5s]"></span>
      <button
        type="button"
        onClick={() => goToCategory('奉獻')}
        title="支持奉獻"
        className="group relative flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-full bg-gradient-to-b from-brand-red to-brand-red/85 text-white ring-2 ring-white/40 shadow-[0_8px_24px_rgba(198,40,40,0.55)] transition-transform duration-300 hover:scale-110 cursor-pointer"
      >
        <i className="fas fa-hand-holding-heart text-base leading-none transition-transform duration-300 group-hover:-translate-y-0.5"></i>
        <span className="font-display font-bold text-[10px] leading-none tracking-widest">支持奉獻</span>
      </button>
    </div>
  );
}
