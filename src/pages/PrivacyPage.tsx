const COPYRIGHT_CLAUSES = [
  {
    num: '01',
    title: '著作權保護',
    body: '本網站所有內容、視聽資料及網頁設計等智慧財產權，均屬基督教論壇基金會所有。未經書面授權，任何人皆不得以任何型式進行複製、改作或其他目的加以使用，違者須負相關法律責任。',
  },
  {
    num: '02',
    title: '程式保護',
    body: '禁止未授權使用者對本站程式進行反向工程、解編或反向組譯等技術操作，違者須負相關法律責任。',
  },
  {
    num: '03',
    title: '第三方內容',
    body: '本站轉貼文章之版權歸原作者所有。若內容涉及侵犯他人著作權，請通知管理員進行授權處理或予以刪除。',
  },
  {
    num: '04',
    title: '轉載規範',
    body: '經同意後可複製本站原創內容，惟須於顯著位置註明「轉載自【基督教論壇基金會網站】」並附上原始連結。',
  },
  {
    num: '05',
    title: '商業使用限制',
    body: '本站註明原創的內容，未經書面授權不得用於任何圖利行為，違者將追究法律及經濟責任。',
  },
  {
    num: '06',
    title: '免責聲明',
    body: '本站對使用者自行使用或傳播本站內容所造成的任何損失，不承擔法律責任。',
  },
  {
    num: '07',
    title: '準據法',
    body: '本聲明未盡事宜，以本站最新公告及中華民國相關法律規定為準。',
  },
];

const PRIVACY_GROUPS = [
  {
    type: '非公開性資料蒐集',
    icon: 'fa-lock',
    items: [
      {
        title: '會員註冊資料',
        body: '包含姓名、生日、電子信箱、地址、電話、帳號、密碼、身分證字號或信用卡號等個人資訊。',
      },
      {
        title: '線上活動資料',
        body: '參與贈獎活動時，須提供姓名、身份證字號、電話、電子信箱及地址等必要資料。',
      },
    ],
  },
  {
    type: '公開性資料蒐集',
    icon: 'fa-globe',
    items: [
      {
        title: '一般瀏覽紀錄',
        body: '伺服器自動記錄 IP 位址、使用時間、瀏覽器類型及點選紀錄等非識別性資訊。',
      },
      {
        title: '通訊紀錄',
        body: '來信內容及線上意見回饋，用於回覆及改善服務品質。',
      },
    ],
  },
];

const PRIVACY_PRINCIPLES = [
  '本站不會任意揭露、出售、交換或轉讓個人資料予第三人，法律規定或獲使用者同意者除外。',
  '可在合理範圍內與合作夥伴分享資訊，以提供相關活動及優惠訊息。',
  '符合法律要求或政府機關要求時，方可提供個人資料。',
  '使用者應妥善保管帳號及密碼，所有以帳號進行的操作均視為本人行為。',
];

export default function PrivacyPage() {
  return (
    <div className="pt-[190px] md:pt-48 pb-32 bg-theme-bg text-theme-text min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-5 md:px-10">

        {/* Hero */}
        <div className="mb-14 md:mb-20">
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tight leading-tight mb-5">
            版權隱私權聲明
          </h1>
          <p className="text-theme-text/55 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            本聲明適用於基督教論壇基金會官方網站，說明版權保護範圍及個人資料蒐集、使用與保護原則。
          </p>
        </div>

        {/* Copyright section */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-wider">版權聲明</h2>
            <div className="flex-1 h-px bg-theme-text/10" />
          </div>
          <div className="flex flex-col gap-8">
            {COPYRIGHT_CLAUSES.map((c) => (
              <div key={c.num} className="grid grid-cols-[40px_1fr] md:grid-cols-[56px_1fr] gap-4 md:gap-6 items-start">
                <span className="font-display text-2xl md:text-3xl font-bold text-brand-red/20 leading-none pt-0.5 select-none">
                  {c.num}
                </span>
                <div>
                  <h3 className="font-serif text-base md:text-lg font-bold tracking-wider mb-2">{c.title}</h3>
                  <p className="text-theme-text/60 text-sm md:text-base leading-loose">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 border border-theme-text/10 bg-theme-text/3">
            <p className="text-theme-text/50 text-xs leading-relaxed">
              授權申請請來信：
              <a href="mailto:service@ct.org.tw" className="text-brand-red hover:underline ml-1">service@ct.org.tw</a>
            </p>
          </div>
        </div>

        {/* Privacy section */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-wider">隱私權保護聲明</h2>
            <div className="flex-1 h-px bg-theme-text/10" />
          </div>

          {/* Data collection */}
          <div className="flex flex-col gap-10 mb-12">
            {PRIVACY_GROUPS.map((g) => (
              <div key={g.type}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                    <i className={`fas ${g.icon} text-brand-red text-xs`} />
                  </div>
                  <p className="font-display text-xs tracking-[0.2em] text-theme-text/40 uppercase">{g.type}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-5 pl-10">
                  {g.items.map((item) => (
                    <div key={item.title} className="p-5 border border-theme-text/10">
                      <p className="font-serif text-sm font-bold tracking-wide mb-2">{item.title}</p>
                      <p className="text-theme-text/55 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Principles */}
          <div>
            <p className="font-display text-[10px] tracking-[0.25em] text-theme-text/35 uppercase mb-5">資料保護原則</p>
            <ul className="flex flex-col gap-4">
              {PRIVACY_PRINCIPLES.map((p, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="font-display text-brand-red text-xs shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-theme-text/60 text-sm leading-loose">{p}</p>
                </li>
              ))}
            </ul>
          </div>
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
