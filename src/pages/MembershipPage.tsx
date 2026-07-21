import { useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createMembershipSubscription, getMembershipPlans } from '../api/membership';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from '../components/AsyncPageState';
import { buildPaymentReturnUrl, redirectToExternalUrl } from '../utils/navigation';

interface MembershipPageProps {
  goToCategory: (cat: string, options?: { register?: boolean }) => void;
}

export default function MembershipPage({ goToCategory }: MembershipPageProps) {
  const { isLoggedIn } = useAuth();
  const [subscribeMsg, setSubscribeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submittingPlanId, setSubmittingPlanId] = useState<string | null>(null);
  const idempotencyKeys = useRef(new Map<string, string>());
  const { data: plans, error, isLoading, reload } = useAsyncData(
    'membership-plans',
    (signal) => getMembershipPlans({ signal }),
    [],
  );

  const handleSubscribe = async (planId: string) => {
    if (!isLoggedIn) {
      goToCategory('會員中心', { register: true });
      return;
    }

    try {
      setSubscribeMsg(null);
      setSubmittingPlanId(planId);
      const key = idempotencyKeys.current.get(planId) ?? crypto.randomUUID();
      idempotencyKeys.current.set(planId, key);
      const response = await createMembershipSubscription({ planId, returnUrl: buildPaymentReturnUrl('membership') }, key);
      if (response.paymentUrl) {
        redirectToExternalUrl(response.paymentUrl);
        return;
      }
      setSubscribeMsg({
        type: 'success',
        text: response.status === 'active' ? '訂閱已啟用' : '訂閱申請已建立，等待付款確認',
      });
    } catch (submitError) {
      setSubscribeMsg({
        type: 'error',
        text: submitError instanceof Error ? submitError.message : '訂閱建立失敗，請稍後再試',
      });
    } finally {
      setSubmittingPlanId(null);
    }
  };

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;

  return (
    <div className="pt-[190px] md:pt-[190px] pb-24 px-5 md:px-12 lg:px-20 min-h-[100dvh] bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto relative z-10 animate-fade-in-up">
        
        {subscribeMsg && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 text-white text-xs font-bold tracking-widest px-6 py-3 rounded-full shadow-lg animate-fade-in-up ${subscribeMsg.type === 'error' ? 'bg-red-600' : 'bg-amber-600'}`}>
            {subscribeMsg.text}
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <span className="font-display text-brand-red tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block font-bold">Membership</span>
          <h1 className="text-4xl md:text-5xl lg:text-[70px] font-serif font-black tracking-tighter text-theme-text transition-colors leading-[1.1] mb-6">加入論壇報會員</h1>
          <p className="text-sm md:text-lg text-theme-text/70 max-w-2xl mx-auto leading-relaxed">
            成為影響力夥伴，一起支持美好的價值。選擇適合您的方案，獲得無廣告閱讀體驗與專屬會員福利。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-theme-bg/60 backdrop-blur-xl border border-theme-text/10 rounded-2xl flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-theme-text/5 ${plan.isPopular ? 'md:-translate-y-4 md:shadow-2xl md:border-brand-red/50' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-red text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase z-10 shadow-md">
                  熱門推薦
                </div>
              )}
              
              <div className="p-8 md:p-10 flex flex-col h-full">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-theme-text mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl lg:text-4xl font-display font-black text-brand-red">NT$ {plan.price.toLocaleString()}</span>
                  <span className="text-sm font-sans text-theme-text/60">/ {plan.billingPeriod === 'month' ? '月' : '年'}</span>
                </div>
                <p className="text-xs sm:text-sm text-theme-text/60 mb-8 md:flex-1">{plan.description}</p>
                
                <div className="w-full h-px bg-theme-text/10 mb-8"></div>
                
                <ul className="flex flex-col gap-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex flex-start gap-4 text-sm font-bold text-theme-text/80 items-start">
                      <i className="fas fa-check text-brand-red mt-1 text-xs"></i>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => void handleSubscribe(plan.id)}
                  disabled={submittingPlanId !== null}
                  className={`mt-auto w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-wait ${plan.isPopular ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 hover:bg-[#b31b1b]' : 'bg-theme-text/5 border border-theme-text/10 text-theme-text hover:bg-theme-text/10'}`}
                >
                  {submittingPlanId === plan.id ? '建立訂閱中…' : '立即訂閱'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-20 text-center max-w-3xl mx-auto border-t border-theme-text/10 pt-10">
          <h4 className="text-lg font-serif font-bold mb-4 text-theme-text">需要協助？</h4>
          <p className="text-sm text-theme-text/60 mb-6">如果您對於會員方案有任何疑問，或需要企業大量訂閱報價，歡迎聯絡我們的客服團隊。</p>
          <button type="button" onClick={() => goToCategory('客戶服務')} className="text-brand-red border-b border-brand-red pb-1 tracking-widest font-bold text-sm hover:opacity-70 transition-opacity">
            聯絡我們 <i className="fas fa-arrow-right text-[10px] ml-1"></i>
          </button>
        </div>

      </div>
    </div>
  );
}
