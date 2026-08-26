import { useEffect } from 'react';
import { getPaymentStatus } from '../api/payments';
import AsyncPageState from '../components/AsyncPageState';
import { useAsyncData } from '../hooks/useAsyncData';
import type { PaymentResourceType } from '../types/payment';

interface PaymentResultPageProps {
  type: PaymentResourceType;
  reference: string | null;
  onOrderPaid: () => void;
  goToCategory: (category: string) => void;
}

const SUCCESS_STATUS = new Set(['paid', 'confirmed', 'active']);
const FAILURE_STATUS = new Set(['failed', 'cancelled', 'refunded']);

export default function PaymentResultPage({ type, reference, onOrderPaid, goToCategory }: PaymentResultPageProps) {
  const { data, error, isLoading, reload } = useAsyncData(
    `payment:${type}:${reference ?? ''}`,
    async (signal) => {
      if (!reference) throw new Error('缺少交易參考編號，請由原付款頁重新返回');
      return getPaymentStatus(type, reference, { signal });
    },
    null,
  );

  const isSuccess = data ? SUCCESS_STATUS.has(data.status) : false;
  const isFailure = data ? FAILURE_STATUS.has(data.status) : false;

  useEffect(() => {
    if (type === 'order' && isSuccess) onOrderPaid();
  }, [isSuccess, onOrderPaid, type]);

  if (isLoading) return <AsyncPageState />;
  if (error || !data) return <AsyncPageState error={error ?? new Error('無法取得交易狀態')} onRetry={reload} />;

  return (
    <div className="min-h-[100dvh] pt-[150px] md:pt-40 pb-24 flex items-center justify-center bg-theme-bg text-theme-text px-6">
      <div className="max-w-lg w-full text-center border border-theme-text/10 bg-theme-text/5 rounded-sm p-8 md:p-12">
        <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${isSuccess ? 'bg-green-500/10 text-green-600' : isFailure ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-600'}`}>
          <i className={`fas ${isSuccess ? 'fa-check' : isFailure ? 'fa-times' : 'fa-clock'} text-2xl`} />
        </div>
        <h1 className="font-serif text-3xl font-black mb-3">{isSuccess ? '交易已確認' : isFailure ? '交易未完成' : '等待付款確認'}</h1>
        <p className="text-sm text-theme-text/60 mb-3">{data.message ?? (isSuccess ? '後端已確認交易狀態。' : isFailure ? '付款失敗或已取消，款項不會由本頁自行認定。' : '金流結果尚未同步，請稍後再次查詢。')}</p>
        <p className="font-display text-xs text-theme-text/40 break-all mb-8">REFERENCE: {data.reference}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {!isSuccess && !isFailure && <button type="button" onClick={reload} className="bg-brand-red text-white px-6 py-3 text-sm font-bold tracking-widest">重新查詢</button>}
          <button type="button" onClick={() => goToCategory(type === 'membership' ? '會員專區' : type === 'order' ? '信仰好物' : '首頁')} className="border border-theme-text/20 px-6 py-3 text-sm font-bold tracking-widest">返回網站</button>
        </div>
      </div>
    </div>
  );
}
