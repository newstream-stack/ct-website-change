import { useState, useEffect } from 'react';

interface SplashAdProps {
  linkUrl?: string;
  onClose?: () => void;
}

function DesktopAd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="w-full h-full">
      <defs>
        <linearGradient id="dgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a0000" stopOpacity="1"/>
          <stop offset="100%" stopColor="#8E2D3D" stopOpacity="0.25"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="#0a0a0a"/>
      <rect x="0" y="0" width="800" height="4" fill="#8E2D3D"/>
      <rect x="0" y="496" width="800" height="4" fill="#8E2D3D"/>
      <line x1="0" y1="0" x2="800" y2="500" stroke="#181818" strokeWidth="1"/>
      <line x1="0" y1="150" x2="800" y2="500" stroke="#181818" strokeWidth="1"/>
      <line x1="200" y1="0" x2="800" y2="500" stroke="#181818" strokeWidth="1"/>
      <rect x="60" y="60" width="5" height="380" fill="#8E2D3D"/>
      <text x="88" y="155" fontFamily="Georgia, serif" fontSize="78" fontWeight="bold" fill="#ffffff" letterSpacing="6">IMPACT</text>
      <text x="90" y="200" fontFamily="Georgia, serif" fontSize="28" fill="#8E2D3D" letterSpacing="4">論壇報</text>
      <rect x="88" y="228" width="300" height="1" fill="#333333"/>
      <text x="88" y="272" fontFamily="Arial, sans-serif" fontSize="21" fill="#cccccc">2026 全球華人影響力高峰會</text>
      <text x="88" y="308" fontFamily="Arial, sans-serif" fontSize="13" fill="#777777">結合理性與靈性的視野，邀請重量級講員獨家探討</text>
      <text x="88" y="328" fontFamily="Arial, sans-serif" fontSize="13" fill="#777777">未來的企業倫理與信仰實踐。</text>
      <text x="88" y="355" fontFamily="Arial, sans-serif" fontSize="12" fill="#555555">2026.09.20｜台北國際會議中心</text>
      <rect x="88" y="380" width="158" height="46" rx="23" fill="#8E2D3D"/>
      <text x="167" y="408" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="bold" fill="#ffffff" textAnchor="middle">立即報名 →</text>
      <rect x="480" y="55" width="262" height="390" rx="4" fill="url(#dgrad)"/>
      <text x="611" y="200" fontFamily="Georgia, serif" fontSize="120" fill="#ffffff" textAnchor="middle" opacity="0.06">十</text>
      <text x="611" y="270" fontFamily="Arial, sans-serif" fontSize="12" fill="#666666" textAnchor="middle">2026.09.20</text>
      <text x="611" y="295" fontFamily="Georgia, serif" fontSize="17" fill="#8E2D3D" textAnchor="middle" letterSpacing="3">PREMIUM</text>
      <text x="611" y="318" fontFamily="Georgia, serif" fontSize="17" fill="#8E2D3D" textAnchor="middle" letterSpacing="3">SPONSORSHIP</text>
    </svg>
  );
}

function MobileAd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 750" className="w-full h-full">
      <defs>
        <linearGradient id="mgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8E2D3D" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1"/>
        </linearGradient>
      </defs>
      <rect width="500" height="750" fill="#0a0a0a"/>
      <rect x="0" y="0" width="500" height="4" fill="#8E2D3D"/>
      <rect x="0" y="746" width="500" height="4" fill="#8E2D3D"/>
      <line x1="0" y1="0" x2="500" y2="750" stroke="#181818" strokeWidth="1"/>
      <line x1="0" y1="200" x2="500" y2="750" stroke="#181818" strokeWidth="1"/>
      <line x1="150" y1="0" x2="500" y2="500" stroke="#181818" strokeWidth="1"/>
      <rect x="0" y="0" width="500" height="290" fill="url(#mgrad)"/>
      <text x="250" y="220" fontFamily="Georgia, serif" fontSize="160" fill="#ffffff" textAnchor="middle" opacity="0.05">十</text>
      <text x="250" y="125" fontFamily="Georgia, serif" fontSize="52" fontWeight="bold" fill="#ffffff" textAnchor="middle" letterSpacing="5">IMPACT</text>
      <text x="250" y="165" fontFamily="Georgia, serif" fontSize="21" fill="#8E2D3D" textAnchor="middle" letterSpacing="4">論壇報</text>
      <rect x="80" y="305" width="340" height="1" fill="#2a2a2a"/>
      <rect x="48" y="335" width="4" height="255" fill="#8E2D3D"/>
      <text x="70" y="370" fontFamily="Georgia, serif" fontSize="20" fill="#ffffff">2026 全球華人</text>
      <text x="70" y="400" fontFamily="Georgia, serif" fontSize="20" fill="#ffffff">影響力高峰會</text>
      <text x="70" y="443" fontFamily="Arial, sans-serif" fontSize="13" fill="#777777">結合理性與靈性的視野</text>
      <text x="70" y="463" fontFamily="Arial, sans-serif" fontSize="13" fill="#777777">邀請重量級講員獨家探討</text>
      <text x="70" y="483" fontFamily="Arial, sans-serif" fontSize="13" fill="#777777">未來的企業倫理與信仰實踐。</text>
      <text x="70" y="520" fontFamily="Arial, sans-serif" fontSize="12" fill="#484848">2026.09.20｜台北國際會議中心</text>
      <rect x="80" y="548" width="340" height="1" fill="#1e1e1e"/>
      <rect x="80" y="578" width="340" height="52" rx="26" fill="#8E2D3D"/>
      <text x="250" y="610" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#ffffff" textAnchor="middle">立即報名 →</text>
      <text x="250" y="690" fontFamily="Arial, sans-serif" fontSize="11" fill="#333333" textAnchor="middle">ct.org.tw｜PREMIUM SPONSORSHIP</text>
    </svg>
  );
}

export default function SplashAd({ linkUrl, onClose }: SplashAdProps) {
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

  const adContent = (
    <>
      <div className="block md:hidden w-full h-full"><MobileAd /></div>
      <div className="hidden md:block w-full h-full"><DesktopAd /></div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80"
      onClick={close}
    >
      <div
        className="relative flex items-center justify-center
          w-[92vw] h-[75dvh]
          md:w-[800px] md:h-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        {linkUrl ? (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            {adContent}
          </a>
        ) : adContent}

        <button
          onClick={close}
          aria-label="關閉廣告"
          className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:bg-black transition-colors text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
