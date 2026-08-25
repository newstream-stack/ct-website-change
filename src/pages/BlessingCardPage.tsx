const CARD_IMAGE = 'https://ct.org.tw/upload/static_cooperation_cms/%E8%B3%87%E7%94%A2%201.png';
const APPLICATION_URL = 'https://cbank.bot.com.tw/Effect/OA_CreditCard1';
const REBATE_DETAILS_URL = 'https://docs.google.com/spreadsheets/d/1VN2hBtdNg6rDZvWtZcym1zelflA2o6UCG0uAhOzFuJg/edit?usp=sharing';

export default function BlessingCardPage() {
  return (
    <div className="pt-[190px] md:pt-48 pb-32 bg-theme-bg text-theme-text min-h-screen transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-5 md:px-10">
        <div className="mb-12 md:mb-16">
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-widest leading-tight mb-5">祝福卡申辦／捐款</h1>
          <p className="text-theme-text/55 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            使用祝福卡，讓每一次日常消費都成為支持信仰媒體與公益推展的力量。
          </p>
        </div>

        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 md:gap-14 items-center">
          <div className="border border-theme-text/10 bg-theme-text/[0.02] p-3 md:p-5">
            <img src={CARD_IMAGE} alt="臺灣銀行詩篇23篇祝福卡" loading="lazy" decoding="async" className="w-full h-auto" />
          </div>

          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wider leading-tight mb-6">臺灣銀行<br />詩篇23篇祝福卡</h2>
            <p className="text-theme-text/65 text-sm md:text-base leading-loose mb-6">
              基督教論壇基金會與臺灣銀行合作，共同發行全國第一張「詩篇23篇祝福卡」。凡使用祝福卡刷卡消費，臺灣銀行將自每一筆消費中提撥 0.3% 回饋金予基督教論壇基金會，作為公益推展使用。
            </p>
            <p className="text-theme-text/65 text-sm md:text-base leading-loose">
              期待透過您的支持與投入，讓以信、望、愛為本的媒體傳播者，結合信仰與公益的平台力量，成為淨化社會的另一個聲音，並提升社會道德與文化。
            </p>
          </div>
        </div>

        <section className="mt-14 md:mt-20 pt-9 md:pt-10 border-t border-theme-text/10">
          <p className="text-theme-text/60 text-sm md:text-base leading-relaxed mb-6">歡迎至臺灣銀行各分行洽辦，或透過線上服務申辦。</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={APPLICATION_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 bg-brand-red px-5 py-3.5 text-white font-display text-xs font-bold tracking-[0.14em] hover:bg-brand-red/85 transition-colors">
              詩篇23篇祝福卡線上申辦
              <i className="fas fa-arrow-up-right-from-square text-[10px]" />
            </a>
            <a href={REBATE_DETAILS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 border border-theme-text/20 px-5 py-3.5 text-theme-text font-display text-xs font-bold tracking-[0.14em] hover:border-brand-red hover:text-brand-red transition-colors">
              認同卡回饋金明細
              <i className="fas fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
