const COOPERATION_TYPES = [
  {
    icon: 'fa-newspaper',
    title: '內容合作',
    body: '網站投稿、開設專欄、新聞內容合作。',
  },
  {
    icon: 'fa-handshake',
    title: '專案合作',
    body: '各項活動、行銷合作。',
  },
];

const COOPERATION_EMAIL = 'service@ct.org.tw';

export default function PartnershipPage() {
  return (
    <div className="pt-[150px] md:pt-40 pb-32 bg-theme-bg text-theme-text min-h-screen">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <div className="mb-14 md:mb-16">
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tight leading-tight mb-5">申請合作</h1>
          <p className="text-theme-text/55 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            基督教論壇報歡迎各項內容與專案合作，期待與您一同傳遞有影響力的訊息。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {COOPERATION_TYPES.map((type) => (
            <a
              key={type.title}
              href={`mailto:${COOPERATION_EMAIL}`}
              className="group flex flex-col p-7 md:p-8 border border-theme-text/10 hover:border-brand-red transition-colors duration-300"
            >
              <span className="w-11 h-11 rounded-full bg-brand-red/10 flex items-center justify-center mb-8">
                <i className={`fas ${type.icon} text-brand-red`} />
              </span>
              <h2 className="font-serif text-2xl font-bold tracking-wider mb-3">{type.title}</h2>
              <p className="text-theme-text/60 text-sm leading-relaxed mb-8">{type.body}</p>
              <span className="mt-auto inline-flex items-center gap-2 font-display text-xs font-bold tracking-[0.15em] text-brand-red uppercase">
                聯繫我們
                <i className="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 md:mt-16 pt-8 border-t border-theme-text/10">
          <p className="font-display text-[10px] tracking-[0.25em] text-theme-text/35 uppercase mb-2">合作洽詢信箱</p>
          <a href={`mailto:${COOPERATION_EMAIL}`} className="font-serif text-xl md:text-2xl font-bold hover:text-brand-red transition-colors">
            {COOPERATION_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
