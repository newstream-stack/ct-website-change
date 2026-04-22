import React, { useState } from 'react';
import PlanCard from '../components/PlanCard';
import { ActionPlan } from '../types';

interface ActionPageProps {
  category: string;
}

// === 樣式變數化 ===
const containerStyle = "w-full min-h-[100dvh] md:h-[100dvh] md:overflow-hidden flex flex-col md:flex-row pt-[130px] md:pt-0 bg-theme-bg transition-colors duration-500";
const heroSectionStyle = "w-full md:w-[45%] h-[40vh] md:h-full bg-brand-red flex flex-col justify-end p-8 md:p-16 relative overflow-hidden border-b border-theme-text/10 md:border-b-0 md:border-r transition-colors";
const backgroundTextStyle = "absolute -right-20 md:-right-40 top-1/2 transform -translate-y-1/2 font-display text-[20vh] md:text-[30vh] font-black text-black/10 uppercase leading-none pointer-events-none";
const contentSectionStyle = "w-full md:w-[55%] h-auto md:h-full flex flex-col justify-center p-6 pb-24 md:p-16 lg:p-24 md:pb-16 overflow-y-auto";

const amountButtonStyle = (isActive: boolean) => 
  `flex-1 py-4 md:py-5 border font-display font-bold text-xl transition rounded-sm ${
    isActive 
      ? 'border-brand-red bg-brand-red text-white' 
      : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'
  }`;

// === 資料宣告 (從 interface 傳入) ===
const SUBSCRIPTION_PLANS: ActionPlan[] = [
  {
    id: 'digital',
    title: 'Digital Access',
    price: 'NT$ 99',
    description: 'Full digital platform access, ad-free experience.',
    variant: 'subscription',
  },
  {
    id: 'premium',
    title: 'Print + Digital',
    price: 'NT$ 200',
    description: 'Bi-weekly physical print delivered + Digital Access.',
    isPremium: true,
    variant: 'subscription',
  }
];

const DONATION_PLANS: ActionPlan[] = [
  {
    id: 'one-time',
    title: '單次奉獻',
    subtitle: 'One-time Gift',
    description: '給予靈活的支持，讓媒體事工持續發聲，傳遞真理。',
    variant: 'donation',
  },
  {
    id: 'monthly',
    title: '定期定額',
    subtitle: 'Monthly Supporter',
    description: '每月固定的支持，成為我們最堅實的後盾，穩定推動各項計畫。',
    variant: 'donation',
  },
  {
    id: 'angel',
    title: '天使贊助',
    subtitle: 'Angel Sponsor',
    description: '年度大額奉獻，深度參與我們的事工發展與未來願景。',
    variant: 'donation',
  }
];

export default function ActionPage({ category }: ActionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('one-time');
  const [amount, setAmount] = useState('1000');

  const isSubscription = category === '訂報';

  return (
    <div className={containerStyle}>
      {/* 左側視覺區塊 */}
      <div className={heroSectionStyle}>
          <div className={backgroundTextStyle} style={{ writingMode: 'vertical-rl' }}>
              {isSubscription ? 'SUB' : 'GIVE'}
          </div>
          <div className="relative z-10">
              <span className="font-display text-white text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block drop-shadow-md">
                {isSubscription ? 'Join Us' : 'Support Us'}
              </span>
              <h1 
                className="text-5xl sm:text-6xl md:text-[80px] lg:text-[100px] font-serif font-black leading-[0.9] text-white drop-shadow-lg" 
                dangerouslySetInnerHTML={{ __html: isSubscription ? 'READ<br>THE<br>TRUTH.' : 'EMPOWER<br>THE<br>VOICE.' }} 
              />
          </div>
      </div>
      
      {/* 右側表單與方案區塊 */}
      <div className={contentSectionStyle}>
          {isSubscription ? (
              <div className="space-y-6 md:space-y-8">
                  {SUBSCRIPTION_PLANS.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
              </div>
          ) : (
              <form className="space-y-8 md:space-y-10">
                  <div className="space-y-4">
                      {DONATION_PLANS.map(plan => (
                        <PlanCard 
                          key={plan.id} 
                          plan={plan} 
                          isSelected={selectedPlan === plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                        />
                      ))}
                  </div>

                  <div>
                      <label className="block font-display text-sm md:text-lg font-bold uppercase tracking-[0.2em] mb-6 text-theme-text/60 transition-colors">Select Amount</label>
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
                      <input type="text" placeholder="YOUR EMAIL" className="w-full bg-transparent border-b border-theme-text/40 py-4 text-xl md:text-2xl font-display uppercase placeholder-theme-text/40 text-theme-text focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                  <button type="button" className="w-full py-5 md:py-6 bg-theme-text text-theme-bg font-display font-black text-xl uppercase tracking-[0.2em] hover:bg-brand-red hover:text-white transition-colors mt-8 rounded-sm">
                      Proceed <i className="fas fa-arrow-right ml-2"></i>
                  </button>
              </form>
          )}
      </div>
    </div>
  );
}
