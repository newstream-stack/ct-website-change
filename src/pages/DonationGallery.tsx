import { getPlans } from '../api/plans';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from '../components/AsyncPageState';
import { OFFLINE_PAYMENT_METHODS, DONATION_CONTACT, REMITTANCE_NOTES } from '../data/donationChannels';

interface DonationGalleryProps {
  openPlan?: (id: number) => void;
}


export default function DonationGallery({ openPlan }: DonationGalleryProps) {
  const { data: plans, error, isLoading, reload } = useAsyncData(
    'donation-plans',
    (signal) => getPlans({ signal }),
    [],
  );

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;

  return (
    <div className="pt-[150px] md:pt-40 pb-24 bg-theme-bg text-theme-text min-h-screen">
      <div className="max-w-[1400px] mx-auto px-5 md:px-12 lg:px-20">
        <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-theme-text border-b border-theme-text/15 pb-5 md:pb-6">
          奉獻
          <span className="ml-3 md:ml-4 text-sm md:text-base font-display font-light text-theme-text/40 tracking-[0.25em] uppercase">Giving</span>
        </h1>

        <div className="mt-8 md:mt-12 mb-8 md:mb-12 flex items-baseline justify-between gap-4 border-b border-theme-text/10 pb-4">
          <h2 className="text-lg md:text-xl font-serif font-bold">奉獻方案與支持</h2>
          <span className="font-display text-xs tracking-widest text-theme-text/45">共 {plans.length} 個方案</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-x-10 lg:gap-y-12">
          {plans.map((plan) => {
            return (
              <div key={plan.id} className="group flex h-full flex-col border-t border-theme-text/15 pt-4">
                <button
                  type="button"
                  onClick={() => openPlan?.(plan.id)}
                  className="text-left cursor-pointer"
                  aria-label={`查看奉獻方案：${plan.title}`}
                >
                  <div className="relative aspect-video bg-theme-text/5 overflow-hidden mb-4">
                    <img src={plan.imageUrl} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={plan.title} />
                  </div>
                  {plan.subtitle && (
                    <span className="text-brand-red font-display text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase">
                      {plan.subtitle}
                    </span>
                  )}
                  <h3 className="mt-2 font-serif text-lg md:text-xl font-bold text-theme-text group-hover:text-brand-red transition-colors leading-snug">
                    {plan.title}
                  </h3>
                  <p className="mt-3 text-sm text-theme-text/60 leading-relaxed line-clamp-2">
                    {plan.summary ?? plan.description}
                  </p>
                </button>

                {/* mt-auto：卡片文字長短不一時，把 CTA 推到卡片底部，同一列的按鈕才會齊平 */}
                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    onClick={() => openPlan?.(plan.id)}
                    className="w-full py-3 text-sm font-bold tracking-widest border border-theme-text bg-theme-text text-theme-bg hover:bg-brand-red hover:border-brand-red transition-colors cursor-pointer"
                  >
                    支持這個方案
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 其他奉獻方式 */}
        <section className="mt-16 md:mt-20 border-t-2 border-theme-text pt-6">
          <h2 className="font-serif text-lg md:text-xl font-bold mb-2">其他奉獻方式</h2>
          <p className="text-sm text-theme-text/60 mb-8">不方便線上刷卡，也可以透過劃撥或轉帳支持我們。</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
            {OFFLINE_PAYMENT_METHODS.map((method) => (
              <div key={method.title} className="border-t border-theme-text/10 pt-4">
                <h3 className="font-display text-[11px] font-bold tracking-[0.2em] uppercase text-theme-text/45 mb-3">{method.title}</h3>
                {/* 固定寬度 label 欄，欄位變窄時 label 不會被壓成直排 */}
                <dl className="space-y-2">
                  {method.rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[3rem_1fr] gap-x-3 items-baseline">
                      <dt className="font-display text-xs font-bold tracking-widest text-theme-text/40 whitespace-nowrap">{row.label}</dt>
                      <dd className="text-sm md:text-base text-theme-text/80 break-words">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            <div className="border-t border-theme-text/10 pt-4">
              <h3 className="font-display text-[11px] font-bold tracking-[0.2em] uppercase text-theme-text/45 mb-3">聯絡我們</h3>
              <dl className="space-y-2">
                <div className="grid grid-cols-[3rem_1fr] gap-x-3 items-baseline">
                  <dt className="font-display text-xs font-bold tracking-widest text-theme-text/40">Tel</dt>
                  <dd className="text-sm md:text-base text-theme-text/80">{DONATION_CONTACT.tel}</dd>
                </div>
                <div className="grid grid-cols-[3rem_1fr] gap-x-3 items-baseline">
                  <dt className="font-display text-xs font-bold tracking-widest text-theme-text/40">Fax</dt>
                  <dd className="text-sm md:text-base text-theme-text/80">{DONATION_CONTACT.fax}</dd>
                </div>
                <div className="grid grid-cols-[3rem_1fr] gap-x-3 items-baseline">
                  <dt className="font-display text-xs font-bold tracking-widest text-theme-text/40">Mail</dt>
                  <dd className="text-sm md:text-base break-all">
                    <a href={`mailto:${DONATION_CONTACT.email}`} className="text-brand-red font-bold underline underline-offset-4 hover:text-theme-text transition-colors">
                      {DONATION_CONTACT.email}
                    </a>
                  </dd>
                </div>
                <div className="grid grid-cols-[3rem_1fr] gap-x-3 items-baseline">
                  <dt className="font-display text-xs font-bold tracking-widest text-theme-text/40">時間</dt>
                  <dd className="text-sm md:text-base text-theme-text/80">{DONATION_CONTACT.hours}</dd>
                </div>
              </dl>
            </div>
          </div>

          <ul className="mt-8 border-t border-theme-text/10 pt-4 text-xs md:text-sm text-theme-text/55 leading-relaxed space-y-1">
            {REMITTANCE_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
            <li>奉獻收據將於次月寄出，可指定年度彙總開立；如需更改收據抬頭或索取補發，請與客戶服務聯繫。</li>
          </ul>
        </section>
      </div>

      <div className="mt-16 md:mt-20 w-full py-16 md:py-20 bg-theme-text/5 border-y border-theme-text/10">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-xl md:text-3xl font-serif font-bold text-theme-text leading-relaxed">
            「因為你們知道我們主耶穌基督的恩典：他本來富足，卻為你們成了貧窮，叫你們因他的貧窮，可以成為富足。」
          </h2>
          <div className="w-12 h-px bg-brand-red mx-auto mt-8 mb-4" />
          <p className="text-theme-text/45 font-display text-xs tracking-[0.3em] uppercase">哥林多後書 8:9</p>
        </div>
      </div>
    </div>
  );
}
