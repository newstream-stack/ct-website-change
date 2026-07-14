const LINK_GROUPS = [
  {
    title: '關於',
    links: ['關於我們', '新聞連絡', '財務報表'],
  },
  {
    title: '服務',
    links: ['我要投稿', '申請合作', '客戶服務'],
  },
  {
    title: '更多',
    links: ['版權隱私權聲明', '祝福卡申辦/捐款', '論壇Line貼圖'],
  },
];

const SOCIALS = [
  { label: 'Instagram', icon: 'fa-instagram', href: 'https://www.instagram.com/christian_tribune/' },
  { label: 'Facebook', icon: 'fa-facebook-f', href: 'https://www.facebook.com/ctnewsfans/' },
  { label: 'YouTube', icon: 'fa-youtube', href: 'https://www.youtube.com/@ImpactChristianTribune' },
];

interface FooterProps {
  goToCategory: (cat: string) => void;
}

export default function Footer({ goToCategory }: FooterProps) {
  return (
    <footer className="bg-[#111111] text-white">
      {/* 主體 */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12">

          {/* 左：品牌區 */}
          <div className="flex flex-col gap-6 max-w-xs">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-2xl font-bold tracking-widest text-white">IMPACT</span>
                <span className="w-px h-4 bg-brand-red inline-block mx-1"></span>
                <span className="font-serif text-base text-brand-red tracking-wider">論壇報</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed">
                基督教論壇報，以信仰的眼光看見世界，<br/>用文字陪伴每一個在路上的靈魂。
              </p>
            </div>

            {/* 社群 */}
            <div className="flex gap-3">
              {SOCIALS.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-brand-red hover:text-brand-red transition-colors"
                >
                  <i className={`fab ${icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* 右：連結群組 */}
          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {LINK_GROUPS.map(({ title, links }) => (
              <div key={title}>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-4 font-display">{title}</p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <button
                        onClick={() => {
                          if (link === '關於我們') goToCategory('關於我們');
                          else if (link === '新聞連絡') goToCategory('新聞連絡');
                          else if (link === '我要投稿') goToCategory('我要投稿');
                          else if (link === '申請合作') goToCategory('申請合作');
                          else if (link === '客戶服務') goToCategory('客戶服務');
                          else if (link === '論壇Line貼圖') goToCategory('論壇Line貼圖');
                          else if (link === '祝福卡申辦/捐款') goToCategory('祝福卡申辦/捐款');
                          else if (link === '版權隱私權聲明') goToCategory('版權隱私權聲明');
                          else if (link === '財務報表') goToCategory('財務報表');
                        }}
                        className="text-white/55 text-xs hover:text-white transition-colors leading-none text-left"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部條 */}
      <div className="border-t border-white/8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[11px] text-white/25">
          <span>© 2026 基督教論壇報 All Rights Reserved. 版權所有 盜用必究</span>
          <span>財團法人基督教論壇基金會｜統一編號 00965377</span>
        </div>
      </div>
    </footer>
  );
}
