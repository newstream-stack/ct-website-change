const SECTIONS = [
  {
    num: '01',
    title: '高舉基督、連結教會、造就信徒、廣傳福音',
    en: 'Our Mission',
    body: '在台灣已走過半世紀歲月的基督教論壇報，1965年10月31日，普世教會協會為紀念台灣宣教百週年而創立。承載過往百年宣教使命，基督教論壇報期許以文字「高舉基督、連結教會、造就信徒、廣傳福音」，為當代基督徒發聲、向世人宣揚上帝的榮耀。',
  },
  {
    num: '02',
    title: '用行動傳福音',
    en: 'Digital Mission',
    body: '隨著華人教會復興世代的來臨、網際網路時代數位閱讀的崛起，基督教論壇報除繼續發揮傳統平面媒體力量，也積極結合雲端科技，與潮流同步躍升，擘劃未來「行動化閱讀」、「雲端傳揚福音」的事工，期許透過網路的無遠弗屆，未來能結合海內外眾教會與福音機構，共同打造全球華人基督徒的媒體平台，讓上帝福音的馨香，傳遍世界各地。',
  },
  {
    num: '03',
    title: '堅守信、望、愛',
    en: 'Faith · Hope · Love',
    body: '不論時代洪流如何，基督教論壇報始終堅持清新、客觀、深度、平衡、溫暖等報導原則，持守信、望、愛的三大生命價值，傳播基督救世的福音。論壇報有最完整的教會消息、靈糧供應、針對社會重要議題的信仰洞見；論壇報彰顯跟隨基督的佳美腳蹤、發掘深刻感人的雲彩見證。',
  },
  {
    num: '04',
    title: '守望真道',
    en: 'Faithful Witness',
    body: '半世紀以來的播種與耕耘，基督教論壇報在台灣已成為眾教會與福音機構宣教最重要的媒體平台，論壇報也是華人唯一跨教派、獨立經營的基督教媒體。不僅記錄了台灣宣教的起飛、變革與成長，更在關鍵時刻，代表基督徒對社會變革提出批判與反省，成為一股社會清流。',
  },
];

const TIMELINE_ERAS = [
  {
    era: '論壇誕生',
    range: '1965',
    events: [
      {
        year: '1965',
        text: '普世教會協會（WCC）以文字與文學委員會為紀念台灣宣教百週年，籌款在台開辦基督教論壇週刊，邀聘教牧針對信仰、靈命各層面，由基督教會、聖潔信會、浸信會共同參與經營。',
      },
    ],
  },
  {
    era: '整頓再起',
    range: '1981–1985',
    events: [
      {
        year: '1981',
        text: '第五任社長顏碧姑新聘，改組董事會，擴充編制至31人。辦公室使用期屆滿，機構基金會提供部分辦公室供論壇報使用；並請中央廣播電台協助提供主播，重新發展報務。',
      },
      {
        year: '1985',
        text: '購買台北市松江路22號7樓約35坪的辦公室，正式成立「財團法人基督教論壇基金會」。第一屆董事會包括顏清基、雷法臺、吳業慶、黎世芳、殷穎、陳定川和蘇仁理等人。',
      },
    ],
  },
  {
    era: '擴張帳幕',
    range: '1989–2006',
    events: [
      {
        year: '1989',
        text: '召開新任編輯委員第一次會議，決議論壇報應持守「高舉基督、傳媒見證、造就信徒」的目標，亦應廣傳福音，加強服務教會與社會，並逐步探討信仰如何與工作、生活結合。',
      },
      {
        year: '1990',
        text: '資深顧問林意玲以義工方式任社長特別助理，論壇報陸續發展為三大版，加入彩色版。',
      },
      {
        year: '1993',
        text: '林意玲接任社長職務。',
      },
      {
        year: '2003',
        text: '購買新生南路一段50號8樓一百坪的新辦公室。',
      },
    ],
  },
  {
    era: '從新得力',
    range: '2007–2010',
    events: [
      {
        year: '2007',
        text: '召開第八屆董事會，由洪善群擔任董事長。會中核准社長林意玲退休，黃清一接任社長。',
      },
      {
        year: '2008',
        text: '出售台北市仁愛路辦公室，購遷回台北市新生南路辦公室，另購買台北市中華路辦公室。',
      },
      {
        year: '2009',
        text: '鄭忠信新任總編輯，強化機構與教會聯結、開拓新疆域。8月1日論壇報步入數位化，「論壇e報」上線，每日更新內容；實體報改為三日報，增加週末版，強化生活資訊及深度報導。',
      },
      {
        year: '2010',
        text: '黃清一社長卸任，鄭忠信接任社長。回應讀者閱讀習慣，改為週三、週六出報，並強化週末專題報導，以「新聞臉」形態呈現。',
      },
    ],
  },
  {
    era: '飛向雲端',
    range: '2011–2015',
    events: [
      {
        year: '2011',
        text: '5月11日董事會通過基金會組織調整，鄭忠信升任基金會執行長兼任社長，因應數位閱讀新趨勢，設立數位部負責網站、社群、APP的開發與經營。10月開始經營論壇報粉絲頁及微博，並進行網站全新改版工程。',
      },
      {
        year: '2012',
        text: '4月全新網站上線，以人性化介面、圖像化設計，快速化搜尋，讓新聞閱覽更舒適便利。鄭忠信擔任文協理事長，推動以色列文化展，引領多元文化與歷史之旅。',
      },
      {
        year: '2013',
        text: '「論壇閱讀」電腦書桌APP上線，全球讀者閱讀論壇報零時差，並連結各基督出版社共同發展電子書市場。手機網站上線，讓行動上網族群更快捷方便閱讀論壇報當日新聞。',
      },
      {
        year: '2014',
        text: '推出少年大奮起，為神國培育未來青年領袖。發展全球華人基督徒媒體平台「基督論壇報」。社群經營有成，5月臉書粉絲破百萬，9月網站訪客數超百萬，12月讀者粉絲突破千萬人。',
      },
      {
        year: '2015',
        text: '執行長鄭忠信應邀出席馬來西亞「2015東南亞區域企業高峰論壇」，連結海內外教會致力打造全球華人媒體平台。完成跨平台全新響應式網站。論壇報APP上架App Store及Google Play。開啟LINE生活圈官方帳號，觸及人數超過百萬人。',
      },
    ],
  },
  {
    era: '全球連結',
    range: '2016–2020',
    events: [
      {
        year: '2016',
        text: '啟動影音事工，在LINE社群推出「論壇報頻道」，以短片傳遞信仰短講。聖公會主教接任全球基督論壇基金會董事長。舉辦以「新天新地」為主題的基督徒書展暨文化展。',
      },
      {
        year: '2017',
        text: '第三屆微電影金鏡獎主題為「突破」，於台南舉辦頒獎典禮。6月起推出多元影音，包括《30秒分享愛》及《咖啡享》短片，最高觸及40萬觀看次數，年度影片累計觀覽破百萬。10月論壇報直播節目上線，推出《心靈咖啡課》、《王者之愛》及《Oh My Darling》節目。開創「論壇學院」課程系列。',
      },
      {
        year: '2018',
        text: '著手建置連結全球教會新聞資訊的新平台。臉書粉絲突破18萬，LINE好友突破7萬。與台灣銀行合作，推出基督信仰「詩篇23篇」祝福賀年卡。帶領參加者從神的眼光探訪以色列的創意與創見。',
      },
      {
        year: '2019',
        text: 'CRAZY FOR JESUS！針對亞太基督徒企業家舉辦「為主瘋狂」特會，2019年1月4–7日在馬來西亞檳城舉行。',
      },
      {
        year: '2020',
        text: '10月31日論壇報55週年社慶，11月24日舉行55週年感恩餐會，鄭忠信執行長正式宣告「亞洲論壇影響力中心」啟動，向前對齊，預備亞洲論壇影響力中心到來。',
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="pt-[190px] md:pt-48 pb-32 bg-theme-bg text-theme-text min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-5 md:px-10">

        {/* Hero header */}
        <div className="mb-16 md:mb-24">
          <p className="font-display text-xs tracking-[0.3em] text-brand-red uppercase mb-4">Since 1965</p>
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-widest leading-tight mb-5">
            關於我們
          </h1>
          <p className="font-display text-base md:text-lg tracking-[0.15em] text-theme-text/40 uppercase mb-8">
            Preach to the World
          </p>
          <p className="text-theme-text/60 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            超過半世紀，從報紙到數位媒體全新改版，分享美好生活，把福音傳向全世界。
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-16 md:gap-20">
          {SECTIONS.map((s) => (
            <div key={s.num} className="grid md:grid-cols-[80px_1fr] gap-4 md:gap-10 items-start">
              <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1">
                <span className="font-display text-4xl md:text-5xl font-bold text-brand-red/20 leading-none select-none">
                  {s.num}
                </span>
                <div className="h-px md:h-12 w-8 md:w-px bg-brand-red/30 self-center md:self-auto mt-1 md:mt-2" />
              </div>
              <div>
                <p className="font-display text-[10px] tracking-[0.25em] text-theme-text/35 uppercase mb-2">
                  {s.en}
                </p>
                <h2 className="font-serif text-xl md:text-2xl font-bold tracking-wider mb-4 leading-snug">
                  {s.title}
                </h2>
                <p className="text-theme-text/65 text-sm md:text-base leading-loose">
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline section */}
        <div className="mt-24 md:mt-32">
          <div className="mb-12">
            <p className="font-display text-xs tracking-[0.3em] text-brand-red uppercase mb-3">History</p>
            <h2 className="font-serif text-3xl md:text-4xl font-black tracking-widest">論壇大事紀</h2>
          </div>

          <div className="flex flex-col gap-12">
            {TIMELINE_ERAS.map((era) => (
              <div key={era.era} className="grid md:grid-cols-[160px_1fr] gap-6 md:gap-10">
                {/* Era label */}
                <div className="md:text-right md:pt-1">
                  <p className="font-serif text-lg font-bold text-theme-text">{era.era}</p>
                  <p className="font-display text-xs tracking-widest text-brand-red">{era.range}</p>
                </div>

                {/* Events */}
                <div className="relative border-l border-theme-text/15 pl-6 flex flex-col gap-8">
                  {era.events.map((ev) => (
                    <div key={ev.year} className="relative">
                      {/* dot */}
                      <span className="absolute -left-[25px] top-[5px] w-3 h-3 rounded-full bg-brand-red ring-4 ring-theme-bg" />
                      <p className="font-display text-brand-red text-sm tracking-[0.15em] mb-1">{ev.year}</p>
                      <p className="text-theme-text/65 text-sm leading-loose">{ev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div className="mt-20 md:mt-28 pt-8 border-t border-theme-text/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-theme-text/30">
          <span>財團法人基督教論壇基金會｜統一編號 00965377</span>
          <span className="font-display tracking-widest uppercase">Est. October 31, 1965</span>
        </div>
      </div>
    </div>
  );
}
