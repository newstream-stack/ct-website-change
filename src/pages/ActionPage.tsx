import React, { useState } from 'react';
import PlanCard from '../components/PlanCard';
import { ActionPlan } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface ActionPageProps {
    category: string;
}

// === 樣式變數化 ===
const containerStyle = "w-full min-h-[100dvh] md:h-[100dvh] md:overflow-hidden flex flex-col md:flex-row pt-[190px] md:pt-0 bg-theme-bg transition-colors duration-500";
const heroSectionStyle = "w-full md:w-[45%] h-[40vh] md:h-full bg-brand-red flex flex-col justify-end p-8 md:p-16 relative overflow-hidden border-b border-theme-text/10 md:border-b-0 md:border-r transition-colors";
const backgroundTextStyle = "absolute -right-20 md:-right-40 top-1/2 transform -translate-y-1/2 font-display text-[20vh] md:text-[30vh] font-black text-black/10 uppercase leading-none pointer-events-none";
const contentSectionStyle = "w-full md:w-[55%] h-auto md:h-full flex flex-col justify-center p-6 pb-24 md:p-16 lg:p-24 md:pb-16 overflow-y-auto";

const amountButtonStyle = (isActive: boolean) =>
    `flex-1 py-4 md:py-5 border font-display font-bold text-xl transition rounded-sm ${isActive
        ? 'border-brand-red bg-brand-red text-white'
        : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'
    }`;

export default function ActionPage({ category }: ActionPageProps) {
    const { t } = useI18n();
    const [selectedPlan, setSelectedPlan] = useState('one-time');
    const [amount, setAmount] = useState('1000');

    const isSubscription = category === '訂報';
    const pageType = isSubscription ? 'subscription' : 'donation';

    const plans: ActionPlan[] = t(`actionPage.${pageType}.plans`).map((plan: any) => ({
        ...plan,
        variant: pageType
    }));

    return (
        <div className={containerStyle}>
            {/* 左側視覺區塊 */}
            <div className={heroSectionStyle}>
                <div className={backgroundTextStyle} style={{ writingMode: 'vertical-rl' }}>
                    {t(`actionPage.${pageType}.bgText`)}
                </div>
                <div className="relative z-10">
                    <span className="font-display text-white text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block drop-shadow-md">
                        {t(`actionPage.${pageType}.subtitle`)}
                    </span>
                    <h1
                        className="text-5xl sm:text-6xl md:text-[80px] lg:text-[100px] font-serif font-black leading-[0.9] text-white drop-shadow-lg"
                        dangerouslySetInnerHTML={{ __html: t(`actionPage.${pageType}.title`) }}
                    />
                </div>
            </div>

            {/* 右側表單與方案區塊 */}
            <div className={contentSectionStyle}>
                {isSubscription ? (
                    <div className="space-y-6 md:space-y-8">
                        {plans.map(plan => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                ) : (
                    <form className="space-y-8 md:space-y-10">
                        <div className="space-y-4">
                            {plans.map(plan => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    isSelected={selectedPlan === plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                />
                            ))}
                        </div>

                        <div>
                            <label className="block font-display text-sm md:text-lg font-bold uppercase tracking-[0.2em] mb-6 text-theme-text/60 transition-colors">
                                {t('actionPage.donation.form.selectAmount')}
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {['500', '1000', '3000'].map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setAmount(amt)}
                                        className={amountButtonStyle(amount === amt)}
                                    >
                                        {amt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <input type="text" placeholder={t('actionPage.donation.form.emailPlaceholder')} className="w-full bg-transparent border-b border-theme-text/40 py-4 text-xl md:text-2xl font-display uppercase placeholder-theme-text/40 text-theme-text focus:outline-none focus:border-brand-red transition-colors" />
                        </div>
                        <button type="button" className="w-full py-5 md:py-6 bg-theme-text text-theme-bg font-display font-black text-xl uppercase tracking-[0.2em] hover:bg-brand-red hover:text-white transition-colors mt-8 rounded-sm">
                            {t('actionPage.donation.form.proceed')} <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
