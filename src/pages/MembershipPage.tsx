import { useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createMembershipSubscription, getMembershipPlans } from '../api/membership';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from '../components/AsyncPageState';
import { buildPaymentReturnUrl, redirectToExternalUrl } from '../utils/navigation';
import type { MembershipPlan } from '../types/membership';

interface MembershipPageProps {
  goToCategory: (cat: string, options?: { register?: boolean }) => void;
}

const PERIOD_LABEL: Record<MembershipPlan['billingPeriod'], string> = {
  month: '月',
  year: '年',
};

/** 權益欄位取所有方案的聯集，依首次出現順序排列，換真實 API 資料也不必改版面。 */
function collectFeatures(plans: MembershipPlan[]): string[] {
  const rows = new Set<string>();
  plans.forEach((plan) => plan.features.forEach((feature) => rows.add(feature)));
  return [...rows];
}

function PriceTag({ plan, size }: { plan: MembershipPlan; size: 'sm' | 'lg' }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
      <span className={`font-serif font-black tabular-nums leading-none ${size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
        {plan.price.toLocaleString()}
      </span>
      <span className="text-xs text-theme-text/55">元 / {PERIOD_LABEL[plan.billingPeriod]}</span>
    </span>
  );
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

  const featureRows = collectFeatures(plans);
  const isSubmitting = submittingPlanId !== null;

  const subscribeLabel = (plan: MembershipPlan) =>
    submittingPlanId === plan.id ? '建立訂閱中…' : '立即訂閱';

  const buttonClass = (plan: MembershipPlan) =>
    `w-full py-3.5 px-4 text-sm font-bold tracking-widest transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-wait ${
      plan.isPopular
        ? 'bg-brand-red text-white hover:bg-[#7d151c]'
        : 'border border-theme-text text-theme-text hover:bg-theme-text hover:text-theme-bg'
    }`;

  return (
    <div className="pt-[150px] md:pt-40 pb-24 px-5 md:px-12 lg:px-20 min-h-[100dvh] bg-theme-bg text-theme-text">
      <div className="max-w-[1080px] mx-auto animate-fade-in-up">

        {subscribeMsg && (
          <div
            role="status"
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-xs font-bold tracking-widest border-l-4 bg-theme-bg text-theme-text shadow-[0_2px_16px_rgba(0,0,0,0.12)] ${
              subscribeMsg.type === 'error' ? 'border-brand-red' : 'border-theme-text'
            }`}
          >
            {subscribeMsg.text}
          </div>
        )}

        {/* 報頭：粗細雙線夾住標題，沿用報紙 masthead 的作法 */}
        <header className="border-t-4 border-theme-text pt-1 mb-14 md:mb-16">
          <div className="border-t border-theme-text pt-9 md:pt-12 pb-8 md:pb-10 border-b border-theme-text text-center">
            <p className="text-[11px] md:text-xs tracking-[0.35em] text-theme-text/45 mb-5">
              財團法人基督教論壇基金會
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-black tracking-[0.12em] leading-tight mb-6">
              訂閱論壇報
            </h1>
            <p className="text-sm md:text-base text-theme-text/60 leading-relaxed max-w-xl mx-auto">
              自 1965 年創刊，論壇報以文字記錄華人教會的腳蹤。
              您的訂閱，是這份記錄得以繼續的憑藉。
            </p>
          </div>
        </header>

        {/* 桌機：訂閱方案對照表 */}
        <table className="hidden md:table w-full border-collapse text-left">
          <caption className="sr-only">會員訂閱方案權益對照表</caption>
          <colgroup>
            <col className="w-[34%]" />
            {plans.map((plan) => (
              <col key={plan.id} />
            ))}
          </colgroup>

          <thead>
            <tr className="border-b-2 border-theme-text align-bottom">
              <th scope="col" className="py-5 pr-6 text-xs tracking-[0.2em] text-theme-text/45 font-normal">
                方案內容
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  className={`py-5 px-5 align-bottom ${plan.isPopular ? 'bg-theme-text/[0.04]' : ''}`}
                >
                  <span className="block h-5 mb-2">
                    {plan.isPopular && (
                      <span className="text-[10px] font-bold tracking-[0.2em] text-brand-red border border-brand-red px-2 py-0.5">
                        編輯推薦
                      </span>
                    )}
                  </span>
                  <span className="block font-serif text-xl lg:text-2xl font-bold tracking-wider mb-3 leading-snug">
                    {plan.name}
                  </span>
                  <PriceTag plan={plan} size="lg" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-theme-text/15">
              <th scope="row" className="py-5 pr-6 align-top text-xs tracking-[0.2em] text-theme-text/45 font-normal">
                方案說明
              </th>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  className={`py-5 px-5 align-top text-sm text-theme-text/65 leading-relaxed ${plan.isPopular ? 'bg-theme-text/[0.04]' : ''}`}
                >
                  {plan.description}
                </td>
              ))}
            </tr>

            {featureRows.map((feature) => (
              <tr key={feature} className="border-b border-theme-text/15">
                <th scope="row" className="py-4 pr-6 text-sm font-normal text-theme-text/85">
                  {feature}
                </th>
                {plans.map((plan) => {
                  const included = plan.features.includes(feature);
                  return (
                    <td
                      key={plan.id}
                      className={`py-4 px-5 text-center ${plan.isPopular ? 'bg-theme-text/[0.04]' : ''}`}
                    >
                      <span className={included ? 'text-brand-red' : 'text-theme-text/20'} aria-hidden="true">
                        {included ? '●' : '—'}
                      </span>
                      <span className="sr-only">{included ? '包含' : '不包含'}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td className="py-7 pr-6" />
              {plans.map((plan) => (
                <td key={plan.id} className={`py-7 px-5 ${plan.isPopular ? 'bg-theme-text/[0.04]' : ''}`}>
                  <button
                    type="button"
                    onClick={() => void handleSubscribe(plan.id)}
                    disabled={isSubmitting}
                    className={buttonClass(plan)}
                  >
                    {subscribeLabel(plan)}
                  </button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>

        {/* 手機：逐一列出的訂閱單 */}
        <div className="md:hidden border-t-2 border-theme-text">
          {plans.map((plan) => (
            <section key={plan.id} className="border-b border-theme-text/20 py-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="font-serif text-2xl font-bold tracking-wider leading-snug">{plan.name}</h2>
                {plan.isPopular && (
                  <span className="shrink-0 mt-1 text-[10px] font-bold tracking-[0.2em] text-brand-red border border-brand-red px-2 py-0.5">
                    編輯推薦
                  </span>
                )}
              </div>

              <div className="pb-4 mb-4 border-b border-theme-text/15">
                <PriceTag plan={plan} size="sm" />
              </div>

              <p className="text-sm text-theme-text/60 leading-relaxed mb-5">{plan.description}</p>

              <ul className="flex flex-col gap-2.5 mb-7">
                {featureRows.map((feature) => {
                  const included = plan.features.includes(feature);
                  return (
                    <li
                      key={feature}
                      className={`flex items-baseline gap-3 text-sm ${included ? 'text-theme-text/85' : 'text-theme-text/30'}`}
                    >
                      <span className={included ? 'text-brand-red text-[8px]' : 'text-[8px]'} aria-hidden="true">
                        {included ? '●' : '—'}
                      </span>
                      <span className="sr-only">{included ? '包含' : '不包含'}</span>
                      <span className={included ? '' : 'line-through decoration-theme-text/20'}>{feature}</span>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => void handleSubscribe(plan.id)}
                disabled={isSubmitting}
                className={buttonClass(plan)}
              >
                {subscribeLabel(plan)}
              </button>
            </section>
          ))}
        </div>

        <p className="mt-10 md:mt-12 text-xs text-theme-text/40 leading-loose">
          訂閱費用含郵資，紙本報僅寄送台灣本島與離島地區。訂閱後可於會員專區查詢配送與續訂狀態。
        </p>

      </div>
    </div>
  );
}
