const SERVICE_DETAILS = [
  {
    icon: 'fa-phone',
    label: '電話',
    value: '(02) 2396-1010',
    href: 'tel:0223961010',
  },
  {
    icon: 'fa-fax',
    label: '傳真',
    value: '(02) 2396-1309',
    href: 'tel:0223961309',
  },
  {
    icon: 'fa-headset',
    label: '客服專線',
    value: '0800-096-101',
    href: 'tel:0800096101',
  },
  {
    icon: 'fa-envelope',
    label: '客服信箱',
    value: 'service@ct.org.tw',
    href: 'mailto:service@ct.org.tw',
  },
];

export default function CustomerServicePage() {
  return (
    <div className="pt-[190px] md:pt-48 pb-32 bg-theme-bg text-theme-text min-h-screen transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <div className="mb-14 md:mb-20">
          <h1 className="font-serif text-4xl md:text-6xl font-black tracking-widest leading-tight mb-5">客戶服務</h1>
          <p className="text-theme-text/55 text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-brand-red pl-5">
            若您有奉獻或網站服務相關問題，歡迎於服務時間來電或來信與我們聯繫。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 md:mb-16">
          {SERVICE_DETAILS.map((detail) => (
            <a
              key={detail.label}
              href={detail.href}
              className="group flex items-center gap-4 p-5 border border-theme-text/10 hover:border-brand-red transition-colors duration-300"
            >
              <span className="w-10 h-10 shrink-0 rounded-full bg-brand-red/10 flex items-center justify-center">
                <i className={`fas ${detail.icon} text-brand-red text-sm`} />
              </span>
              <span>
                <span className="block font-display text-[10px] tracking-[0.2em] text-theme-text/35 uppercase mb-1">{detail.label}</span>
                <span className="text-theme-text text-sm md:text-base font-medium group-hover:text-brand-red transition-colors">{detail.value}</span>
              </span>
            </a>
          ))}
        </div>

        <section className="border-t border-theme-text/10 pt-10 md:pt-12">
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-wider mb-6">財團法人基督教論壇基金會</h2>
          <div className="grid gap-4 text-sm md:text-base leading-relaxed text-theme-text/60">
            <p>統一編號：00965377</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=100510%20%E5%8F%B0%E7%81%A3%E5%8F%B0%E5%8C%97%E5%B8%82%E4%B8%AD%E6%AD%A3%E5%8D%80%E6%96%B0%E7%94%9F%E5%8D%97%E8%B7%AF%E4%B8%80%E6%AE%B550%E8%99%9F8%E6%A8%93%E4%B9%8B3"
              target="_blank"
              rel="noreferrer"
              className="w-fit hover:text-brand-red transition-colors"
            >
              100510 台灣台北市中正區新生南路一段50號8樓之3
            </a>
            <p>服務時間：週一至週五 08:30–17:30</p>
          </div>
        </section>
      </div>
    </div>
  );
}
