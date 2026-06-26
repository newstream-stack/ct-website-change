import { useState, useEffect } from 'react';

interface SplashAdProps {
  desktopImageUrl: string;
  mobileImageUrl: string;
  linkUrl?: string;
  onClose?: () => void;
}

export default function SplashAd({ desktopImageUrl, mobileImageUrl, linkUrl, onClose }: SplashAdProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    document.body.style.overflow = '';
    onClose?.();
  };

  const content = (
    <>
      {/* 手機圖 */}
      <img
        src={mobileImageUrl}
        alt="廣告"
        className="block md:hidden w-full h-full object-contain"
      />
      {/* 電腦圖 */}
      <img
        src={desktopImageUrl}
        alt="廣告"
        className="hidden md:block w-full h-full object-contain"
      />
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80"
      onClick={close}
    >
      <div
        className="relative w-full h-full max-w-[500px] max-h-[85dvh] md:max-w-[800px] md:max-h-[80dvh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            {content}
          </a>
        ) : content}

        <button
          onClick={close}
          aria-label="關閉廣告"
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-colors text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
