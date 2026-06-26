const CONTACT_SECTIONS = [
  {
    icon: 'fa-bullhorn',
    title: '採訪通告',
    body: '歡迎各教會、機構、政府單位及公司企業提供各類新聞及活動採訪通知，我們樂意協助傳遞神國資訊。',
  },
  {
    icon: 'fa-church',
    title: '教會、機構通訊',
    body: '《教會機構通訊》單元歡迎教會與福音機構提供消息，使讀者能參與並代禱，在主裡成就美好。各樣消息來稿請於每週三下午五時三十分前提供，並註明「教會通訊版收」，本報對來函保留審稿權。',
    list: [
      '教會機構迫切代禱需要',
      '教會機構人事異動',
      '教會機構舉辦活動消息',
    ],
    listNote: '刊登優先順序',
  },
  {
    icon: 'fa-pen-nib',
    title: '公民新聞',
    body: '本報邀請教會、機構文字工作者或弟兄姊妹成為文字尖兵。舉凡在各教會、機構舉辦的現場活動，都可以用文字、圖片傳給我們，讓我們一起關心「神國的事」，也透過文字圖片，讓其他弟兄姊妹同蒙祝福。本報對投稿保留使用及修改權。',
  },
];

const CONTACT_METHODS = [
  {
    label: '報紙新聞來稿',
    value: 'ct@ct.org.tw',
    icon: 'fa-envelope',
    href: 'mailto:ct@ct.org.tw',
  },
  {
    label: '網路新聞來稿',
    value: 'web@ct.org.tw',
    icon: 'fa-globe',
    href: 'mailto:web@ct.org.tw',
  },
  {
    label: '傳真',
    value: '(02) 2356-3232',
    icon: 'fa-fax',
    href: 'tel:0223563232',
  },
];

export default function ContactPage() {
  return (
    <div className="pt-[190px] md:pt-48 pb-32 bg-theme-bg text-theme-text min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-5 md:px-10">

        {/* Hero header */}
        <div className="mb-16 md:mb-20">
          <p className="font-display text-xs tracking-[0.3em] text-brand-red uppercase mb-4">News Contact</p>
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-widest leading-tight mb-5">
            新聞連絡
          </h1>
          <p className="text-theme-text/55 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            我們歡迎教會、機構及弟兄姊妹提供新聞線索與投稿，一起用文字高舉基督、廣傳福音。
          </p>
        </div>

        {/* Contact methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 md:mb-20">
          {CONTACT_METHODS.map((m) => (
            <a
              key={m.label}
              href={m.href}
              className="group flex flex-col gap-3 p-5 border border-theme-text/10 hover:border-brand-red transition-colors duration-300"
            >
              <i className={`fas ${m.icon} text-brand-red text-lg`} />
              <div>
                <p className="font-display text-[10px] tracking-[0.2em] text-theme-text/35 uppercase mb-1">{m.label}</p>
                <p className="text-theme-text text-sm font-medium group-hover:text-brand-red transition-colors">{m.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Submission sections */}
        <div className="flex flex-col gap-12 md:gap-14">
          {CONTACT_SECTIONS.map((s, i) => (
            <div key={s.title} className="grid md:grid-cols-[40px_1fr] gap-5 md:gap-8 items-start">
              <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2 md:pt-1">
                <div className="w-9 h-9 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                  <i className={`fas ${s.icon} text-brand-red text-sm`} />
                </div>
                <span className="font-display text-brand-red/30 text-xs tracking-widest md:hidden">0{i + 1}</span>
              </div>
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold tracking-wider mb-3">{s.title}</h2>
                <p className="text-theme-text/60 text-sm md:text-base leading-loose mb-4">{s.body}</p>
                {s.list && (
                  <div>
                    <p className="font-display text-[10px] tracking-[0.2em] text-theme-text/30 uppercase mb-2">{s.listNote}</p>
                    <ol className="flex flex-col gap-2">
                      {s.list.map((item, idx) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-theme-text/60">
                          <span className="font-display text-brand-red shrink-0 w-4">{idx + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tag */}
        <div className="mt-20 md:mt-28 pt-8 border-t border-theme-text/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-theme-text/30">
          <span>財團法人基督教論壇基金會｜統一編號 00965377</span>
          <span className="font-display tracking-widest uppercase">Christian Tribune Foundation</span>
        </div>
      </div>
    </div>
  );
}
