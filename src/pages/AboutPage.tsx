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

        {/* Bottom tag */}
        <div className="mt-20 md:mt-28 pt-8 border-t border-theme-text/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-theme-text/30">
          <span>財團法人基督教論壇基金會｜統一編號 00965377</span>
          <span className="font-display tracking-widest uppercase">Est. October 31, 1965</span>
        </div>
      </div>
    </div>
  );
}
