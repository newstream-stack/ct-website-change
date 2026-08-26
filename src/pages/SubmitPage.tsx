const SECTIONS = [
  [
    {
      icon: 'fa-file-alt',
      title: '稿件長度',
      items: ['一般文章：700–2000 字', '短篇文章：400–600 字'],
    },
    {
      icon: 'fa-list-check',
      title: '來稿須附',
      items: ['真實姓名（如刊登筆名請一併註明）', '連絡電話', '通訊與戶籍地址', '所屬教會'],
    },
  ],
  [
    {
      icon: 'fa-triangle-exclamation',
      title: '重要提醒',
      items: [
        '投稿文章必須未曾在任何媒體及社群發表',
        '禁止抄襲或一稿兩投',
        '投稿視為授權論壇報刊登於報紙、網站與相關電子刊物',
        '本報對來稿保留審稿、修改與刊登與否之權利',
        '審稿結果將於一個月內通知',
      ],
    },
    {
      icon: 'fa-newspaper',
      title: '可投稿版位',
      items: ['見證版', '雅歌版', '愛家版', '旅遊版', '靈修版'],
    },
  ],
];

const WELCOME = '歡迎個人信主見證、生命更新見證，以及宣教經驗分享。';

export default function SubmitPage() {
  return (
    <div className="pt-[190px] md:pt-48 pb-32 bg-theme-bg text-theme-text min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-5 md:px-10">

        {/* Hero */}
        <div className="mb-14 md:mb-20">
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tight leading-tight mb-5">
            我要投稿
          </h1>
          <p className="text-theme-text/55 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            {WELCOME}
          </p>
        </div>

        {/* How to submit */}
        <div className="mb-14 md:mb-20 p-6 md:p-8 border border-brand-red/30 bg-brand-red/5">
          <p className="font-display text-[10px] tracking-[0.25em] text-brand-red uppercase mb-4">投稿方式</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <i className="fas fa-envelope text-brand-red mt-0.5 w-4 shrink-0" />
              <div>
                <p className="text-theme-text text-sm font-medium">news@ct.org.tw</p>
                <p className="text-theme-text/45 text-xs mt-0.5">Email 主旨請填寫：「投稿：文章篇名」</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <i className="fas fa-paperclip text-brand-red mt-0.5 w-4 shrink-0" />
              <p className="text-theme-text/60 text-sm">每封信箱容量限制 10MB 以內，超過請分次寄送</p>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="flex flex-col gap-10 md:gap-14">
          {SECTIONS.map((row, ri) => (
            <div key={ri} className="grid md:grid-cols-2 gap-8 md:gap-12">
              {row.map((block) => (
                <div key={block.title}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                      <i className={`fas ${block.icon} text-brand-red text-xs`} />
                    </div>
                    <h2 className="font-serif text-lg font-bold tracking-wider">{block.title}</h2>
                  </div>
                  <ul className="flex flex-col gap-2 pl-11">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-theme-text/60 leading-relaxed">
                        <span className="text-brand-red/50 mt-1.5 shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-20 md:mt-28 pt-8 border-t border-theme-text/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-theme-text/30">
          <span>財團法人基督教論壇基金會｜統一編號 00965377</span>
          <span className="font-display tracking-widest uppercase">Christian Tribune Foundation</span>
        </div>
      </div>
    </div>
  );
}
