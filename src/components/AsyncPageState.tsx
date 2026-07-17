interface AsyncPageStateProps {
  error?: Error | null;
  onRetry?: () => void;
}

export default function AsyncPageState({ error, onRetry }: AsyncPageStateProps) {
  return (
    <div className="min-h-[100dvh] pt-[190px] md:pt-32 flex items-center justify-center bg-theme-bg text-theme-text px-6">
      <div className="text-center">
        {error ? (
          <>
            <p className="font-serif text-xl font-bold mb-3">資料載入失敗</p>
            <p className="text-sm text-theme-text/55 mb-6">{error.message}</p>
            {onRetry && <button type="button" onClick={onRetry} className="px-5 py-2.5 bg-brand-red text-white text-xs font-bold tracking-widest">重新載入</button>}
          </>
        ) : (
          <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-theme-text/50">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            Loading
          </div>
        )}
      </div>
    </div>
  );
}
