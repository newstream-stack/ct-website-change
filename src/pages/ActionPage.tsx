import PlanCard from '../components/PlanCard';
import { getSubscriptionPage } from '../api/subscriptions';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from '../components/AsyncPageState';
import type { SubscriptionPage } from '../api/subscriptions';

// === 樣式變數化 ===
const containerStyle = "w-full min-h-[100dvh] md:h-[100dvh] md:overflow-hidden flex flex-col md:flex-row pt-[190px] md:pt-0 bg-theme-bg transition-colors duration-500";
const heroSectionStyle = "w-full md:w-[45%] h-[40vh] md:h-full bg-brand-red flex flex-col justify-end p-8 md:p-16 relative overflow-hidden border-b border-theme-text/10 md:border-b-0 md:border-r transition-colors";
const backgroundTextStyle = "absolute -right-20 md:-right-40 top-1/2 transform -translate-y-1/2 font-display text-[20vh] md:text-[30vh] font-black text-black/10 uppercase leading-none pointer-events-none";
const contentSectionStyle = "w-full md:w-[55%] h-auto md:h-full flex flex-col justify-center p-6 pb-24 md:p-16 lg:p-24 md:pb-16 overflow-y-auto";

export default function ActionPage() {
    const { data: page, error, isLoading, reload } = useAsyncData<SubscriptionPage | null>(
        'subscription-page',
        (signal) => getSubscriptionPage({ signal }),
        null,
    );

    if (error) return <AsyncPageState error={error} onRetry={reload} />;
    if (isLoading || !page) return <AsyncPageState />;

    return (
        <div className={containerStyle}>
            {/* 左側視覺區塊 */}
            <div className={heroSectionStyle}>
                <div className={backgroundTextStyle} style={{ writingMode: 'vertical-rl' }}>
                    {page.bgText}
                </div>
                <div className="relative z-10">
                    <span className="font-display text-white text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block drop-shadow-md">
                        {page.subtitle}
                    </span>
                    <h1
                        className="text-5xl sm:text-6xl md:text-[80px] lg:text-[100px] font-serif font-black leading-[0.9] text-white drop-shadow-lg"
                    >
                        {page.titleLines.map((line) => <span key={line} className="block">{line}</span>)}
                    </h1>
                </div>
            </div>

            {/* 右側表單與方案區塊 */}
            <div className={contentSectionStyle}>
                <div className="space-y-6 md:space-y-8">
                    {page.plans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </div>
            </div>
        </div>
    );
}
