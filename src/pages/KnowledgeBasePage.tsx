const KNOWLEDGE_ARTICLES = [
  {
    date: '2023-10-17',
    source: 'IMPACT x Malaysia',
    author: '馬來西亞IAA',
    title: '讓Z世代在創新中找到歸屬感！陳南權牧師：事工鐵三角牧養助青年門徒紮根',
    href: 'https://ct.org.tw/html/news/3-3.php?article=1396835&cat=10',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200',
  },
  {
    date: '2022-02-25',
    source: '基督教論壇報',
    author: '記者李容珍',
    title: '俄烏戰火升高　烏克蘭俄羅斯眾召會和當地福音機構為兩國人民、宣教士守望禱告',
    href: 'https://ct.org.tw/html/news/3-3.php?article=1389507&cat=10',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=80&w=1200',
  },
  {
    date: '2021-02-26',
    source: '基督教論壇報',
    author: '論壇報編採',
    title: '論壇報全新改版！再現文字美學深度　重拾讀報好心情',
    href: 'https://ct.org.tw/html/news/3-3.php?article=1379506&cat=12',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200',
  },
];

const ARCHIVE_YEARS = ['2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007'];

export default function KnowledgeBasePage() {
  return (
    <div className="pt-[190px] md:pt-48 pb-32 bg-theme-bg text-theme-text min-h-screen transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="mb-12 md:mb-16 border-b border-theme-text/15 pb-7 md:pb-9">
          <p className="font-display text-xs tracking-[0.3em] text-brand-red uppercase mb-4">Faith Archive</p>
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-widest leading-tight">信仰知識庫</h1>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-12 lg:gap-16">
          <section>
            <div className="flex items-center gap-4 mb-7">
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-wider">最新收錄</h2>
              <span className="h-px flex-1 bg-theme-text/10" />
            </div>
            <div className="flex flex-col border-t border-theme-text/10">
              {KNOWLEDGE_ARTICLES.map((article) => (
                <a key={article.title} href={article.href} target="_blank" rel="noreferrer" className="group grid sm:grid-cols-[190px_1fr] gap-5 md:gap-7 py-6 md:py-8 border-b border-theme-text/10 hover:bg-theme-text/[0.03] transition-colors md:px-4 md:-mx-4">
                  <div className="aspect-[16/10] overflow-hidden bg-theme-text/5">
                    <img src={article.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-display text-[10px] md:text-xs tracking-[0.16em] text-brand-red uppercase mb-3">{article.date}　{article.source}／{article.author}</p>
                    <h3 className="font-serif text-xl md:text-2xl font-bold leading-snug group-hover:text-brand-red transition-colors">{article.title}</h3>
                    <span className="mt-4 font-display text-[10px] font-bold tracking-[0.2em] text-theme-text/45 group-hover:text-brand-red transition-colors">閱讀原文　<i className="fas fa-arrow-up-right-from-square ml-1" /></span>
                  </div>
                </a>
              ))}
            </div>

            <a href="https://ct.org.tw/html/news/3-2-8-2.php?channel=43" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 border border-theme-text/20 px-5 py-3 font-display text-xs font-bold tracking-[0.16em] hover:border-brand-red hover:text-brand-red transition-colors">
              全版閱讀
              <i className="fas fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </section>

          <aside className="lg:border-l lg:border-theme-text/10 lg:pl-8">
            <p className="font-display text-[10px] tracking-[0.25em] text-brand-red uppercase mb-4">Archive</p>
            <h2 className="font-serif text-2xl font-bold tracking-wider mb-5">搜尋知識庫</h2>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
              {ARCHIVE_YEARS.map((year) => (
                <a key={year} href="https://ct.org.tw/html/news/7-1.php" target="_blank" rel="noreferrer" className="border border-theme-text/10 px-3 py-2 text-center font-display text-xs text-theme-text/55 hover:border-brand-red hover:text-brand-red transition-colors">
                  {year}
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-theme-text/45">更多歷年內容可前往原始知識庫瀏覽。</p>

            <div className="mt-12 pt-8 border-t border-theme-text/10">
              <p className="font-display text-[10px] tracking-[0.25em] text-brand-red uppercase mb-4">Featured</p>
              <a href="https://ct.org.tw/html/news/3-3.php?article=1368725&cat=10" target="_blank" rel="noreferrer" className="group block">
                <h3 className="font-serif text-lg font-bold leading-relaxed group-hover:text-brand-red transition-colors">〖願為風的翅膀傳福音到地極〗論壇報55週年 成立亞洲論壇影響力中心</h3>
                <span className="mt-4 inline-block font-display text-[10px] tracking-[0.16em] text-theme-text/45 group-hover:text-brand-red transition-colors">精選文章　<i className="fas fa-arrow-up-right-from-square ml-1" /></span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
