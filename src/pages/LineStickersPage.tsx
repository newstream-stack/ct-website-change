const LINE_STORE_URL = 'https://store.line.me/stickershop/author/524175';

const STICKERS = [
  { title: '一起成為有福的人－可愛小插圖', image: 'https://ct.org.tw/upload/static_app_line_cms/%E7%A4%BE%E7%BE%A4%E6%8E%A8%E5%BB%A3_%E4%B8%80%E8%B5%B7%E6%88%90%E7%82%BA%E6%9C%89%E7%A6%8F%E7%9A%84%E4%BA%BA%EF%BC%8D%E5%8F%AF%E6%84%9B%E5%B0%8F%E6%8F%92%E5%9C%96.png' },
  { title: '一起成為有福的人－大字版', image: 'https://ct.org.tw/upload/static_app_line_cms/%E7%A4%BE%E7%BE%A4%E6%8E%A8%E5%BB%A3_%E4%B8%80%E8%B5%B7%E6%88%90%E7%82%BA%E6%9C%89%E7%A6%8F%E7%9A%84%E4%BA%BA%EF%BC%8D%E5%A4%A7%E5%AD%97%E7%89%88.png' },
  { title: '寵鵝日常 1 ☆初登場☆', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E5%AF%B5%E9%B5%9D%E6%97%A5%E5%B8%B8%201%20%E2%98%86%E5%88%9D%E7%99%BB%E5%A0%B4%E2%98%86.png' },
  { title: '寵鵝日常 2 ☆鵝言鵝語☆', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95.jpg' },
  { title: '寵鵝日常 3 ☆你看起來好好吃☆', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E5%AF%B5%E9%B5%9D%E6%97%A5%E5%B8%B8.jpg' },
  { title: '寵鵝日常 3 ☆大大才過癮☆', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E5%AF%B5%E9%B5%9D%E6%97%A5%E5%B8%B8_BIG.jpg' },
  { title: '寵鵝日常 4 ☆名人名畫美術館☆', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E5%AF%B5%E9%B5%9D%E4%B8%96%E7%95%8C%E5%90%8D%E7%95%AB2.png' },
  { title: '寵鵝日常 4 ☆隨你填美術館☆', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E5%AF%B5%E9%B5%9D%E4%B8%96%E7%95%8C%E5%90%8D%E7%95%AB.jpg' },
  { title: '寵鵝日常 5 ☆全年節日好用貼圖大集合☆', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E5%AF%B5%E9%B5%9D_%E5%85%A8%E5%B9%B4%E7%AF%80%E6%97%A5%E8%B2%BC%E5%9C%96%E5%A4%A7%E9%9B%86%E5%90%88.png' },
  { title: '影響力習慣：鼓勵的話', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E5%BD%B1%E9%9F%BF%E5%8A%9B%E7%BF%92%E6%85%A3%EF%BC%9A%E9%BC%93%E5%8B%B5%E7%9A%84%E8%A9%B1.png' },
  { title: '給媽媽：妳值得被愛', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E7%B5%A6%E5%AA%BD%E5%AA%BD%EF%BC%9A%E5%A6%B3%E5%80%BC%E5%BE%97%E8%A2%AB%E6%84%9B.png' },
  { title: '給爸爸：你是最棒的', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E7%88%B6%E8%A6%AA%E7%AF%80.png' },
  { title: '早安貼圖 用微笑開始每一天', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E6%97%A9%E5%AE%89%E8%B2%BC%E5%9C%96%201.png' },
  { title: '信心地圖 1 ♡暖心語錄♡', image: 'https://ct.org.tw/upload/static_app_line_cms/IG%E9%99%90%E5%8B%95_%E6%9A%96%E5%BF%83%E8%AA%9E%E9%8C%84%E9%99%AA%E4%BC%B4%E4%BD%A0%E6%AF%8F%E4%B8%80%E5%A4%A9.png' },
];

const WHATSAPP_STICKERS = [
  ['寵鵝日常 1 ☆初登場☆', 'https://whatsticker.online/p/765095VBn0uoc/HK/zh'],
  ['寵鵝日常 2 ☆鵝言鵝語☆', 'https://whatsticker.online/p/765099QJsDJ1P/HK/zh'],
  ['寵鵝日常 3 ☆你看起來好好吃☆', 'https://whatsticker.online/p/765100njAaRkK/HK/zh'],
  ['寵鵝日常 4 ☆名人名畫美術館☆', 'https://whatsticker.online/p/765106v2NdcWV/HK/zh'],
  ['寵鵝日常 5 ☆全年節日好用貼圖大集合☆', 'https://whatsticker.online/p/765112W2Uiw2o/HK/zh'],
  ['寵鵝日常 6 ☆給你滿滿情緒價值☆', 'https://whatsticker.online/p/765113hGjhePu/HK/zh'],
] as const;

export default function LineStickersPage() {
  return (
    <div className="pt-[150px] md:pt-40 pb-32 bg-theme-bg text-theme-text min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="mb-12 md:mb-12">
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tight leading-tight mb-5">論壇LINE貼圖</h1>
          <p className="text-theme-text/55 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            把祝福、鼓勵與日常的可愛帶進每一段對話。
          </p>
        </div>

        <div className="flex items-center justify-between gap-5 mb-7">
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-wider">《IMPACT》LINE 貼圖</h2>
          <a href={LINE_STORE_URL} target="_blank" rel="noreferrer" className="shrink-0 bg-brand-red px-4 py-2.5 text-white font-display text-xs font-bold tracking-[0.12em] hover:bg-brand-red/85 transition-colors">
            點我購買
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {STICKERS.map((sticker) => (
            <a key={sticker.title} href={LINE_STORE_URL} target="_blank" rel="noreferrer" className="group border border-theme-text/10 hover:border-brand-red transition-colors duration-300 bg-theme-text/[0.02]">
              <div className="aspect-[4/5] overflow-hidden bg-theme-text/5">
                <img src={sticker.image} alt={sticker.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <p className="p-4 text-sm font-medium leading-relaxed group-hover:text-brand-red transition-colors">{sticker.title}</p>
            </a>
          ))}
        </div>

        <section className="mt-16 md:mt-20 pt-10 border-t border-theme-text/10">
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-wider mb-7">《IMPACT》WhatsApp 貼圖</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {WHATSAPP_STICKERS.map(([title, href]) => (
              <a key={title} href={href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 border border-theme-text/10 p-4 text-sm hover:border-brand-red hover:text-brand-red transition-colors">
                <span>{title}</span>
                <i className="fas fa-arrow-up-right-from-square text-[10px] shrink-0" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
