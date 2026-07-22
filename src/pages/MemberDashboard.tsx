import { useState, useEffect, useRef, type FormEvent } from 'react';
import { changePassword, logout } from '../api/auth';
import { createPortal } from 'react-dom';
import ReceiptModal from '../components/ReceiptModal';
import { createPaymentMethodSession, getMe, getMemberStats, getDonations, getBillingHistory, updateMe } from '../api/member';
import { getOrders } from '../api/orders';
import { getSavedArticles, removeSavedArticle } from '../api/savedArticles';
import type { Member, MemberStats, DonationRecord, SubscriptionRecord } from '../types/member';
import type { NewsItem, Order } from '../types';
import { getSafeExternalUrl, redirectToExternalUrl } from '../utils/navigation';
import AsyncPageState from '../components/AsyncPageState';

interface MemberDashboardProps {
  goToCategory: (cat: string) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',      name: '總覽 Overview',          icon: 'fas fa-home' },
  { id: 'subscription',  name: '我的訂閱 My Plan',        icon: 'fas fa-crown' },
  { id: 'saved',         name: '收藏文章 Saved',           icon: 'far fa-bookmark' },
  { id: 'donations',     name: '奉獻紀錄 Donations',       icon: 'fas fa-hand-holding-heart' },
  { id: 'orders',        name: '購買商品 Purchased',      icon: 'fas fa-shopping-bag' },
  { id: 'settings',      name: '帳號設定 Settings',        icon: 'fas fa-cog' },
] as const;

type TabId = typeof TABS[number]['id'];

type DashboardStat = {
  value: number;
  label: string;
  tab: TabId;
};

const ORDER_STATUS_LABEL: Record<Order['status'], string> = {
  pending: '處理中',
  payment_pending: '待付款',
  paid: '已付款',
  failed: '付款失敗',
  cancelled: '已取消',
  refunded: '已退款',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function PaymentModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleManagePayment = async () => {
    try {
      setMessage('');
      setIsLoading(true);
      const returnUrl = new URL(window.location.pathname, window.location.origin);
      returnUrl.searchParams.set('category', '會員專區');
      const response = await createPaymentMethodSession(returnUrl.toString());
      if (!response.managementUrl) {
        setMessage('Mock 模式不會連接真實金流；正式 API 回傳管理網址後會自動導向。');
        return;
      }
      redirectToExternalUrl(response.managementUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '無法開啟付款方式管理，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-theme-bg/80 backdrop-blur-md" onClick={onClose} />
      <div className="bg-theme-bg border border-theme-text/10 rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-theme-text/40 hover:text-theme-text transition-colors">
          <i className="fas fa-times text-xl" />
        </button>
        <h3 className="text-2xl font-serif font-black mb-2">更新付款資訊</h3>
        <p className="text-xs text-theme-text/50 tracking-wide mb-6">Payment method management</p>

        <div className="flex flex-col items-center gap-4 py-10 border border-dashed border-theme-text/20 rounded-xl bg-theme-text/3">
          <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center">
            <i className="far fa-credit-card text-2xl text-brand-red/60" />
          </div>
          <div className="text-center">
            <p className="font-bold text-sm tracking-widest text-theme-text/80 mb-1">安全管理付款方式</p>
            <p className="text-xs text-theme-text/40 leading-relaxed">
              將前往第三方金流的安全頁面進行設定，<br />本站不會接收或保存您的完整卡號。
            </p>
          </div>
        </div>

        {message && <p role="status" className="mt-4 text-xs leading-relaxed text-amber-600">{message}</p>}

        <button
          onClick={() => void handleManagePayment()}
          disabled={isLoading}
          className="mt-6 w-full bg-brand-red text-white font-bold tracking-widest py-3.5 rounded-xl hover:bg-brand-red/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? '建立安全連線中…' : '前往管理付款方式'}
        </button>
      </div>
    </div>
  );
}

function OrderReceiptModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const handlePrint = () => {
    window.print();
  };

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in text-black">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-4xl h-[calc(100dvh-2rem)] sm:h-[calc(100dvh-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">
        
        {/* Action Bar (Not printed) */}
        <div className="sticky top-0 bg-gray-50 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 print:hidden flex-none w-full z-30 flex justify-between items-center gap-3">
          <h3 className="font-bold text-gray-700 font-sans text-sm md:text-base m-0">電子出貨單與收據</h3>
          <div className="flex gap-2 md:gap-3 items-center shrink-0">
            <button 
              onClick={handlePrint}
              className="bg-brand-red text-white h-9 md:h-10 px-4 md:px-5 rounded-lg text-xs md:text-sm font-bold tracking-widest hover:bg-[#b31b1b] transition-all flex items-center gap-2 shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-download"></i> <span>下載 / 列印</span>
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 cursor-pointer bg-white border border-gray-100"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-5 sm:p-8 md:p-12 bg-white print:overflow-visible print:p-0" id="printable-order-receipt">
          
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-start lg:items-center border-b-2 border-brand-red pb-4 mb-6 gap-4 lg:gap-6">
            <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="h-10 px-3 bg-brand-red text-white font-black font-serif flex items-center justify-center text-base rounded-lg tracking-widest">
                IMPACT
              </div>
              <div className="text-left min-w-0">
                <h2 className="text-base sm:text-lg font-serif font-black tracking-widest text-brand-red mb-0.5 leading-snug break-words">財團法人基督教論壇基金會</h2>
                <p className="text-[10px] sm:text-xs text-gray-500 tracking-widest uppercase">Product Purchase Invoice 購物收據</p>
              </div>
            </div>
            <div className="w-full lg:w-auto min-w-0 text-xs font-sans text-gray-600 space-y-0.5">
              <p className="grid grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_auto] gap-x-2 items-baseline lg:justify-end">
                <span className="font-bold text-gray-400 uppercase tracking-widest">Order No.</span>
                <span className="break-all lg:text-right">{order.orderNumber}</span>
              </p>
              <p className="grid grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_auto] gap-x-2 items-baseline lg:justify-end">
                <span className="font-bold text-gray-400 uppercase tracking-widest">Date</span>
                <span className="break-all lg:text-right">{order.date}</span>
              </p>
            </div>
          </div>

          <h1 className="text-center font-serif text-2xl font-bold tracking-[0.2em] mb-8">電子購物收據</h1>

          {/* Customer & Shipping Info */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6 text-xs sm:text-sm text-left">
            <h3 className="font-serif font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">購買與收件資訊</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <span className="text-gray-400 font-medium mr-2">收件人：</span>
                <span className="font-bold text-gray-800">{order.name}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium mr-2">聯絡電話：</span>
                <span className="font-bold text-gray-800">{order.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium mr-2">電子郵件：</span>
                <span className="font-bold text-gray-800">{order.email}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium mr-2">付款方式：</span>
                <span className="font-bold text-gray-800">{order.paymentMethod === 'credit-card' ? '信用卡' : 'Line Pay'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-400 font-medium mr-2">寄送地址：</span>
                <span className="font-bold text-gray-800">{order.address}</span>
              </div>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="border border-gray-200 rounded-xl overflow-x-auto mb-6 text-xs sm:text-sm">
            <table className="w-full min-w-[560px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[10px] sm:text-xs text-gray-400 font-bold uppercase">
                  <th className="px-4 py-3">商品項目 Item</th>
                  <th className="px-4 py-3 text-center">單價 Unit Price</th>
                  <th className="px-4 py-3 text-center">數量 Qty</th>
                  <th className="px-4 py-3 text-right">小計 Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {order.items.map((item) => (
                  <tr key={item.product.id}>
                    <td className="px-4 py-3.5">
                      <div className="font-bold">{item.product.name}</div>
                      <div className="text-[10px] text-gray-400 font-sans mt-0.5">{item.product.englishName}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-display font-medium">NT$ {item.product.price.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-center font-display font-medium">{item.quantity}</td>
                    <td className="px-4 py-3.5 text-right font-display font-bold">NT$ {(item.product.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Calculation */}
          <div className="flex flex-col items-stretch sm:items-end gap-2 text-xs sm:text-sm mb-8 sm:pr-4">
            <div className="flex justify-between w-full sm:w-48 text-gray-500">
              <span>小計：</span>
              <span className="font-display font-medium">NT$ {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-full sm:w-48 text-gray-500">
              <span>運費：</span>
              <span className="font-display font-medium">
                {order.shippingFee === 0 ? '免運費' : `NT$ ${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between w-full sm:w-48 font-bold text-brand-red border-t border-gray-200 pt-2 text-base">
              <span>實付總額：</span>
              <span className="font-display font-black">NT$ {order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer & Stamp */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mt-8 pt-6 border-t border-gray-200 relative">
            <div className="text-[10px] sm:text-xs text-gray-500 leading-relaxed max-w-sm font-sans z-10 w-full sm:w-auto text-left">
              <p className="font-bold text-gray-700 mb-1 tracking-widest">注意事項：</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>本收據為電子購物明細及交易憑證，出貨商品均已完成付款。</li>
                <li>如需退換貨，請於收到商品 7 日鑑賞期內保持商品完整並聯絡客服。</li>
              </ol>
            </div>
            <div className="self-end pointer-events-none z-0">
              <div className="w-24 h-24 rounded-full border-4 border-red-600/30 flex items-center justify-center transform rotate-12 bg-white">
                <div className="w-20 h-20 rounded-full border border-red-600/30 flex flex-col items-center justify-center text-red-600/50">
                  <span className="font-serif font-black tracking-widest text-xs">IMPACT</span>
                  <span className="text-[6px] font-bold tracking-widest leading-tight text-center scale-90">基督教論壇基金會</span>
                  <span className="text-[7px] font-sans mt-0.5">出貨專用章</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-order-receipt, #printable-order-receipt * {
            visibility: visible;
          }
          #printable-order-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: 100vh;
            padding: 1.5cm !important;
            box-sizing: border-box;
          }
        }
      `}} />
    </div>
  );

  return createPortal(modal, document.body);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MemberDashboard({ goToCategory }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<DonationRecord | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<Order | null>(null);
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const settingsMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsFormVersion, setSettingsFormVersion] = useState(0);

  const [member, setMember] = useState<Member | null>(null);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);
  const [subscriptionRecords, setSubscriptionRecords] = useState<SubscriptionRecord[]>([]);
  const [savedArticles, setSavedArticles] = useState<NewsItem[]>([]);
  const [savedArticlesError, setSavedArticlesError] = useState('');
  const [removingSavedId, setRemovingSavedId] = useState<number | null>(null);
  const [savedSortDirection, setSavedSortDirection] = useState<'newest' | 'oldest'>('newest');
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<Error | null>(null);
  const [dashboardReloadToken, setDashboardReloadToken] = useState(0);

  useEffect(() => () => {
    if (settingsMsgTimer.current) clearTimeout(settingsMsgTimer.current);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsDashboardLoading(true);
    setDashboardError(null);

    const load = async () => {
      try {
        const [loadedMember, loadedStats] = await Promise.all([
          getMe({ signal: controller.signal }),
          getMemberStats({ signal: controller.signal }),
        ]);
        const [donations, billing, orderResult, savedResult] = await Promise.allSettled([
          getDonations({ signal: controller.signal }),
          getBillingHistory({ signal: controller.signal }),
          getOrders({ signal: controller.signal }),
          getSavedArticles(true, { signal: controller.signal }),
        ]);
        if (controller.signal.aborted) return;
        setMember(loadedMember);
        setStats(loadedStats);
        if (donations.status === 'fulfilled') setDonationRecords(donations.value);
        if (billing.status === 'fulfilled') setSubscriptionRecords(billing.value);
        if (orderResult.status === 'fulfilled') setOrders(orderResult.value);
        if (savedResult.status === 'fulfilled') setSavedArticles(savedResult.value);
        else setSavedArticlesError(savedResult.reason instanceof Error ? savedResult.reason.message : '收藏文章載入失敗');
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setDashboardError(loadError instanceof Error ? loadError : new Error('會員資料載入失敗'));
        }
      } finally {
        if (!controller.signal.aborted) setIsDashboardLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [dashboardReloadToken]);

  const handleRemoveSavedArticle = async (articleId: number) => {
    if (removingSavedId !== null) return;
    try {
      setSavedArticlesError('');
      setRemovingSavedId(articleId);
      await removeSavedArticle(articleId, true);
      setSavedArticles((articles) => articles.filter((article) => article.id !== articleId));
    } catch (removeError) {
      setSavedArticlesError(removeError instanceof Error ? removeError.message : '取消收藏失敗，請稍後再試');
    } finally {
      setRemovingSavedId(null);
    }
  };

  const handleSettingsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingSettings) return;
    const formData = new FormData(event.currentTarget);
    const updatedName = String(formData.get('name') ?? '').trim();
    const updatedAddress = String(formData.get('address') ?? '').trim();
    const currentPassword = String(formData.get('currentPassword') ?? '');
    const newPassword = String(formData.get('newPassword') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');
    const wantsPasswordChange = Boolean(currentPassword || newPassword || confirmPassword);
    const profileChanged = updatedName !== member?.name || updatedAddress !== member?.address;

    if (!updatedName || !updatedAddress) {
      setSettingsMsg({ type: 'error', text: '姓名與地址不可為空' });
      return;
    }
    if (wantsPasswordChange && (!currentPassword || !newPassword || !confirmPassword)) {
      setSettingsMsg({ type: 'error', text: '變更密碼時請完整填寫三個密碼欄位' });
      return;
    }
    if (wantsPasswordChange && newPassword.length < 8) {
      setSettingsMsg({ type: 'error', text: '新密碼至少需要 8 個字元' });
      return;
    }
    if (wantsPasswordChange && newPassword !== confirmPassword) {
      setSettingsMsg({ type: 'error', text: '新密碼與確認密碼不一致' });
      return;
    }
    if (wantsPasswordChange && profileChanged) {
      setSettingsMsg({ type: 'error', text: '為避免部分更新，請分開儲存基本資料與密碼' });
      return;
    }
    if (!wantsPasswordChange && !profileChanged) {
      setSettingsMsg({ type: 'success', text: '目前沒有需要儲存的變更' });
      return;
    }

    try {
      setIsSavingSettings(true);
      if (wantsPasswordChange) {
        await changePassword({ currentPassword, newPassword });
      } else {
        const updatedMember = await updateMe({ name: updatedName, displayName: updatedName, address: updatedAddress });
        setMember(updatedMember);
      }
      setSettingsFormVersion((version) => version + 1);
      setSettingsMsg({ type: 'success', text: wantsPasswordChange ? '帳號資料與密碼更新成功' : '帳號設定更新成功' });
    } catch (settingsError) {
      setSettingsMsg({ type: 'error', text: settingsError instanceof Error ? settingsError.message : '帳號設定更新失敗' });
    } finally {
      setIsSavingSettings(false);
      if (settingsMsgTimer.current) clearTimeout(settingsMsgTimer.current);
      settingsMsgTimer.current = setTimeout(() => setSettingsMsg(null), 3000);
    }
  };

  if (isDashboardLoading) return <AsyncPageState />;
  if (dashboardError || !member || !stats) {
    return <AsyncPageState error={dashboardError ?? new Error('會員資料不完整')} onRetry={() => setDashboardReloadToken((token) => token + 1)} />;
  }
  const { subscription } = member;
  const dashboardStats: DashboardStat[] = [
    { value: savedArticles.length, label: '收藏文章', tab: 'saved' },
    { value: stats.attendedEvents, label: '參加活動', tab: 'overview' },
    { value: stats.donationCount, label: '奉獻紀錄', tab: 'donations' },
    { value: orders.reduce((acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0), 0), label: '已購商品', tab: 'orders' },
  ];
  const displayedSavedArticles = savedSortDirection === 'newest' ? savedArticles : [...savedArticles].reverse();

  return (
    <div className="pt-[190px] md:pt-[180px] pb-24 px-5 md:px-12 lg:px-20 min-h-[100dvh] bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto animate-fade-in-up">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-theme-text/10 pb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-theme-text mb-2">會員專區</h1>
            <p className="text-sm font-sans tracking-widest text-theme-text/60 uppercase">Member Dashboard</p>
          </div>
          <div className="flex items-center gap-4 bg-theme-text/5 p-4 rounded-xl border border-theme-text/10">
            <div className="w-12 h-12 bg-brand-red/20 rounded-full flex items-center justify-center text-brand-red text-xl font-bold">
              <i className="far fa-user" />
            </div>
            <div>
              <p className="font-bold text-sm">{member.name} ({member.displayName})</p>
              <p className="text-xs text-theme-text/60">{member.email}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">

          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 grid grid-cols-2 md:flex md:flex-col gap-2 pb-2 md:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-2 py-3 md:px-5 md:py-4 rounded-xl font-bold tracking-widest text-[10px] md:text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                    : 'text-theme-text/70 bg-theme-text/5 md:bg-transparent hover:bg-theme-text/10 hover:text-theme-text'
                }`}
              >
                <i className={`${tab.icon} text-sm md:text-base w-5 text-center mb-1 md:mb-0 ${activeTab === tab.id ? 'text-white/90' : 'text-theme-text/50'}`} />
                <span className="text-center">{tab.name}</span>
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                goToCategory('首頁');
              }}
              className="md:mt-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-2 py-3 md:px-5 md:py-4 rounded-xl font-bold tracking-widest text-[10px] md:text-sm text-brand-red bg-brand-red/5 md:bg-transparent hover:bg-brand-red/10 transition-colors cursor-pointer"
            >
              <i className="fas fa-sign-out-alt text-sm md:text-base w-5 text-center mb-1 md:mb-0" />
              <span className="text-center">登出 Logout</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-[500px]">

            {/* ── Overview ── */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                {/* Subscription card */}
                <div className="bg-gradient-to-br from-theme-text/5 to-transparent border border-theme-text/10 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full mix-blend-multiply blur-3xl translate-x-1/2 -translate-y-1/2" />
                  <h3 className="text-xl font-serif font-bold mb-6">目前訂閱方案</h3>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <div className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest rounded-full mb-3">Active Plan</div>
                      <h4 className="text-2xl font-black font-display text-theme-text">{subscription.plan}</h4>
                      <p className="text-sm text-theme-text/60 mt-2">下一次扣款日：{subscription.nextBillingDate} (NT$ {subscription.price})</p>
                    </div>
                    <button onClick={() => goToCategory('會員招募')} className="bg-theme-text text-theme-bg px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest hover:opacity-80 transition-opacity">
                      管理訂閱
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {dashboardStats.map(({ value, label, tab }) => (
                    <button
                      key={label}
                      disabled={tab === 'overview'}
                      onClick={() => {
                        if (tab !== 'overview') setActiveTab(tab);
                      }}
                      className={`bg-theme-text/5 border border-theme-text/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center transition-all ${
                        tab === 'overview' ? 'cursor-default' : 'hover:bg-theme-text/10 hover:border-brand-red/30 cursor-pointer active:scale-95'
                      }`}
                    >
                      <span className="text-3xl font-display font-black text-brand-red mb-2">{value}</span>
                      <span className="text-xs md:text-sm font-bold text-theme-text/70 tracking-widest">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Recent saved */}
                <div>
                  <div className="flex justify-between items-center mb-6 mt-4">
                    <h3 className="text-xl font-serif font-bold">最近收藏</h3>
                    <button className="text-xs font-bold text-brand-red hover:underline underline-offset-4 tracking-widest flex items-center" onClick={() => setActiveTab('saved')}>
                      查看全部 <i className="fas fa-chevron-right ml-1 text-[10px]" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {savedArticles.slice(0, 3).map((article) => (
                      <div key={article.id} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border border-theme-text/5 hover:bg-theme-text/5 transition-colors cursor-pointer group">
                        <div className="w-full sm:w-48 md:w-56 aspect-[832/470] flex-shrink-0 overflow-hidden rounded-lg bg-theme-text/10">
                          <img src={article.imageUrl} alt={article.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-all duration-500" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[10px] font-bold text-brand-red tracking-widest uppercase mb-1">{article.category}</span>
                          <h4 className="font-bold text-sm sm:text-base line-clamp-2 md:line-clamp-1">{article.title}</h4>
                          <span className="text-xs text-theme-text/50 mt-2 block">{article.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Subscription ── */}
            {activeTab === 'subscription' && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-1">我的訂閱方案</h3>
                      <p className="text-sm text-theme-text/60">管理您的 IMPACT 會員資格與付款方式</p>
                    </div>
                    <button onClick={() => goToCategory('會員招募')} className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold text-sm tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap">
                      升級方案
                    </button>
                  </div>

                  <div className="bg-theme-bg border border-theme-text/10 rounded-xl p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest rounded-full mb-2">使用中</span>
                        <h4 className="text-2xl font-black font-display text-theme-text">{subscription.plan}</h4>
                      </div>
                      <span className="text-2xl font-display font-black text-brand-red">NT$ {subscription.price} <span className="text-sm text-theme-text/60 font-sans">/ 月</span></span>
                    </div>
                    <div className="h-px bg-theme-text/10 w-full my-4" />
                    <p className="text-sm text-theme-text/80 mb-2 font-bold">方案權益包含：</p>
                    <ul className="text-sm text-theme-text/60 flex flex-col gap-2 mb-6">
                      {['數位內容免費閱讀', '每週電子報寄送', '60年資料庫查詢'].map((benefit) => (
                        <li key={benefit}><i className="fas fa-check text-brand-red mr-2" />{benefit}</li>
                      ))}
                    </ul>
                    <div className="bg-theme-text/5 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center text-sm gap-2">
                      <span className="text-theme-text/70">下次扣款日期：<span className="font-bold text-theme-text">{subscription.nextBillingDate}</span></span>
                      <button onClick={() => setIsPaymentModalOpen(true)} className="font-bold text-brand-red hover:underline underline-offset-4 self-start sm:self-auto">
                        更新付款資訊
                      </button>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold mb-4 font-serif">扣款紀錄</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="text-xs text-theme-text/60 uppercase bg-theme-bg border-y border-theme-text/10">
                        <tr>
                          {['日期', '項目', '金額', '狀態'].map((h) => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-text/5 bg-theme-bg/30">
                        {subscriptionRecords.map((rec) => (
                          <tr key={rec.date}>
                            <td className="px-4 py-3">{rec.date}</td>
                            <td className="px-4 py-3">{rec.item}</td>
                            <td className="px-4 py-3 font-bold">{rec.amount}</td>
                            <td className="px-4 py-3 font-bold text-[#00C300]">{rec.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Saved Articles ── */}
            {activeTab === 'saved' && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div className="flex justify-between items-end border-b border-theme-text/10 pb-4 mb-2">
                  <h3 className="text-xl font-serif font-bold">收藏文章 ({savedArticles.length})</h3>
                  <button
                    type="button"
                    onClick={() => setSavedSortDirection((direction) => direction === 'newest' ? 'oldest' : 'newest')}
                    className="font-bold text-theme-text/80 hover:text-brand-red transition-colors flex items-center gap-1 text-sm"
                  >
                    {savedSortDirection === 'newest' ? '最新加入' : '最早加入'} <i className="fas fa-chevron-down text-[10px]" />
                  </button>
                </div>
                {savedArticlesError && <p role="alert" className="text-sm font-bold text-red-500">{savedArticlesError}</p>}
                {savedArticles.length === 0 && !savedArticlesError && (
                  <div className="min-h-64 rounded-2xl border border-theme-text/10 bg-theme-text/5 flex items-center justify-center text-sm text-theme-text/50">
                    尚無收藏文章
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {displayedSavedArticles.map((article) => (
                    <div key={article.id} className="bg-theme-text/5 border border-theme-text/10 rounded-xl overflow-hidden group flex flex-col h-full cursor-pointer hover:shadow-xl hover:shadow-theme-text/5 transition-all">
                      <div className="aspect-[832/470] overflow-hidden relative">
                        <img src={article.imageUrl} alt={article.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button
                          type="button"
                          aria-label="取消收藏"
                          disabled={removingSavedId !== null}
                          className="absolute top-3 right-3 w-8 h-8 bg-theme-bg/90 backdrop-blur rounded-full flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-colors z-10 disabled:opacity-50 disabled:cursor-wait"
                          onClick={(event) => { event.stopPropagation(); void handleRemoveSavedArticle(article.id); }}
                        >
                          <i className="fas fa-bookmark text-sm" />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase mb-1">{article.category}</span>
                        <h4 className="font-bold text-sm leading-snug mb-3 line-clamp-2 md:line-clamp-3">{article.title}</h4>
                        <div className="mt-auto flex justify-between items-end text-xs text-theme-text/50 pt-2 border-t border-theme-text/5">
                          <span>{article.date}</span>
                          <span className="font-bold text-brand-red group-hover:translate-x-1 transition-transform">閱讀 <i className="fas fa-arrow-right text-[10px] ml-1" /></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Donations ── */}
            {activeTab === 'donations' && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between mb-8 gap-6 md:gap-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-1">我的奉獻紀錄</h3>
                      <p className="text-sm text-theme-text/60">感謝您用行動支持我們的看見與影響力。</p>
                    </div>
                    <div className="bg-brand-red/10 p-5 rounded-xl border border-brand-red/20 flex flex-col items-start md:items-end justify-center min-w-[200px]">
                      <span className="text-xs text-brand-red/70 font-bold tracking-widest uppercase mb-1">2026 年度累積奉獻</span>
                      <span className="text-3xl font-display font-black text-brand-red">NT$ {stats.totalDonated.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap font-sans">
                      <thead className="text-xs text-theme-text/60 uppercase bg-theme-bg border-y border-theme-text/10">
                        <tr>
                          {['奉獻日期', '奉獻專案', '奉獻方式', '金額', '收據'].map((h) => (
                            <th key={h} className="px-4 py-3.5 font-bold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-text/5 bg-theme-bg/30">
                        {donationRecords.map((rec) => (
                          <tr key={rec.id} className="hover:bg-theme-text/5 transition-colors">
                            <td className="px-4 py-4">{rec.date}</td>
                            <td className="px-4 py-4 font-bold text-brand-red">
                              <a href={getSafeExternalUrl(rec.projectUrl)} className="hover:underline underline-offset-4">{rec.project}</a>
                            </td>
                            <td className="px-4 py-4 text-theme-text/60">{rec.method}</td>
                            <td className="px-4 py-4 font-bold">{rec.amount}</td>
                            <td className="px-4 py-4">
                              <button onClick={() => setSelectedReceipt(rec)} className="text-brand-red hover:underline text-xs font-bold underline-offset-4">
                                下載收據
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 pt-6 border-t border-theme-text/10 flex justify-center">
                    <button onClick={() => goToCategory('奉獻')} className="border border-brand-red text-brand-red px-8 py-3 rounded-xl font-bold tracking-widest hover:bg-brand-red hover:text-white transition-colors group">
                      探索更多奉獻專案 <i className="fas fa-heart ml-2 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Settings ── */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl font-serif font-bold mb-6">帳號設定</h3>
                  <form
                    key={settingsFormVersion}
                    className="flex flex-col gap-5 max-w-lg"
                    onSubmit={handleSettingsSubmit}
                  >
                    {[
                      { nameAttr: 'name', label: '姓名 Name', type: 'text', defaultValue: member.name, readOnly: false },
                      { nameAttr: 'email', label: '電子信箱 Email Address', type: 'email', defaultValue: member.email, readOnly: true },
                      { nameAttr: 'address', label: '聯絡地址 Address', type: 'text', defaultValue: member.address, readOnly: false },
                    ].map(({ nameAttr, label, type, defaultValue, readOnly }) => (
                      <div key={label} className="flex flex-col gap-2">
                        <label className="text-xs font-bold tracking-widest text-theme-text/70">{label}</label>
                        <input
                          name={nameAttr}
                          type={type}
                          defaultValue={defaultValue}
                          readOnly={readOnly}
                          required={!readOnly}
                          maxLength={nameAttr === 'address' ? 300 : nameAttr === 'email' ? 254 : 100}
                          autoComplete={nameAttr === 'address' ? 'street-address' : nameAttr === 'email' ? 'email' : 'name'}
                          className={`bg-theme-bg border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text ${readOnly ? 'border-theme-text/10 opacity-60 cursor-not-allowed' : 'border-theme-text/20'}`}
                        />
                        {readOnly && <span className="text-[10px] text-theme-text/40 mt-1"><i className="fas fa-info-circle mr-1" />信箱作為登入帳號，如需修改請聯繫客服。</span>}
                      </div>
                    ))}

                    <div className="h-px w-full bg-theme-text/10 my-4" />

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold tracking-widest text-theme-text/70">變更密碼 Change Password</label>
                      <input name="currentPassword" type="password" maxLength={128} autoComplete="current-password" placeholder="輸入舊密碼" className="bg-theme-bg border border-theme-text/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text" />
                      <input name="newPassword" type="password" minLength={8} maxLength={128} autoComplete="new-password" placeholder="設定新密碼（至少 8 個字元）" className="bg-theme-bg border border-theme-text/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text" />
                      <input name="confirmPassword" type="password" minLength={8} maxLength={128} autoComplete="new-password" placeholder="再次輸入新密碼" className="bg-theme-bg border border-theme-text/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text" />
                    </div>

                    {settingsMsg && (
                      <div className={`flex items-center gap-2 text-xs font-bold tracking-wide px-4 py-3 rounded-xl ${settingsMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-600' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                        <i className={`fas ${settingsMsg.type === 'success' ? 'fa-circle-check' : 'fa-exclamation-circle'} shrink-0`} />
                        {settingsMsg.text}
                      </div>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <button type="submit" disabled={isSavingSettings} className="bg-brand-red text-white font-bold py-3.5 px-8 rounded-xl tracking-widest text-sm hover:bg-[#b31b1b] hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-red/20 disabled:opacity-50 disabled:cursor-wait">{isSavingSettings ? '儲存中…' : '儲存變更 Save'}</button>
                      <button type="button" disabled={isSavingSettings} onClick={() => { setSettingsFormVersion((version) => version + 1); setSettingsMsg(null); }} className="border border-theme-text/20 text-theme-text/70 font-bold py-3.5 px-8 rounded-xl tracking-widest text-sm hover:bg-theme-text/10 transition-colors">取消 Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ── Purchased Orders ── */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div className="flex justify-between items-end border-b border-theme-text/10 pb-4 mb-2">
                  <h3 className="text-xl font-serif font-bold">購買商品 ({orders.reduce((acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0), 0)})</h3>
                  <div className="text-xs text-theme-text/50 font-sans">
                    共 {orders.length} 筆訂單
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red flex items-center justify-center mb-6">
                      <i className="fas fa-shopping-bag text-2xl" />
                    </div>
                    <h4 className="text-lg font-serif font-bold mb-2">尚無購買紀錄</h4>
                    <p className="text-sm text-theme-text/50 max-w-sm mb-8 leading-relaxed">
                      您目前在 IMPACT 信仰好物中還沒有任何購買紀錄。快去選購精美的信仰生活好物吧！
                    </p>
                    <button 
                      onClick={() => goToCategory('信仰好物')}
                      className="bg-brand-red text-white px-8 py-3 rounded-xl font-bold tracking-widest text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-brand-red/20 cursor-pointer"
                    >
                      前往信仰好物選購
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                      <div key={order.orderNumber} className="bg-theme-text/5 border border-theme-text/10 rounded-2xl overflow-hidden transition-all duration-300">
                        {/* Order Header */}
                        <div className="bg-theme-text/3 px-6 py-4 border-b border-theme-text/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-sans">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="font-bold text-theme-text/50 uppercase">訂單編號</span>
                            <span className="font-display font-black text-theme-text text-sm sm:text-base">{order.orderNumber}</span>
                            <span className="px-2 py-0.5 bg-[#00C300]/10 text-[#00C300] text-[10px] font-bold rounded-full">
                              {ORDER_STATUS_LABEL[order.status] ?? order.status}
                            </span>
                          </div>
                          <div className="text-theme-text/60">
                            交易時間：{order.date}
                          </div>
                        </div>

                        {/* Order Body - Items */}
                        <div className="p-6 divide-y divide-theme-text/5 text-left">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                              <div className="w-16 h-20 sm:w-20 sm:h-24 bg-theme-text/5 border border-theme-text/10 rounded-sm overflow-hidden flex-shrink-0">
                                <img src={item.product.imageUrl} alt={item.product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-left">
                                  <h5 className="font-bold text-sm sm:text-base line-clamp-2 leading-snug">{item.product.name}</h5>
                                  {item.product.specs && item.product.specs.length > 0 && (
                                    <div className="text-[10px] sm:text-xs text-theme-text/55 mt-1">
                                      規格：{item.product.specs.join(' / ')}
                                    </div>
                                  )}
                                  <span className="text-[10px] sm:text-xs text-theme-text/40 font-display block mt-1 text-left">
                                    NT$ {item.product.price.toLocaleString()} x {item.quantity}
                                  </span>
                                </div>
                                <div className="text-right flex-shrink-0 self-end sm:self-auto">
                                  <span className="font-display font-black text-sm sm:text-base text-theme-text">
                                    NT$ {(item.product.price * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="bg-theme-text/2 px-6 py-5 border-t border-theme-text/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs sm:text-sm text-left">
                          <div className="space-y-1 text-theme-text/60 max-w-md text-left">
                            <div><span className="font-bold text-theme-text/40 mr-2">收件人</span> {order.name} ({order.phone})</div>
                            <div className="line-clamp-1"><span className="font-bold text-theme-text/40 mr-2">收件地址</span> {order.address}</div>
                            <div><span className="font-bold text-theme-text/40 mr-2">付款方式</span> {order.paymentMethod === 'credit-card' ? '信用卡' : 'Line Pay'}</div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
                            <div className="text-right">
                              <div className="text-[10px] text-theme-text/50 uppercase tracking-widest">實付總金額 Total</div>
                              <div className="font-display font-black text-xl text-brand-red mt-0.5">
                                NT$ {order.total.toLocaleString()}
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedOrderReceipt(order)}
                              className="border border-brand-red text-brand-red px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest hover:bg-brand-red hover:text-white transition-all duration-300 cursor-pointer w-full sm:w-auto"
                            >
                              {order.status === 'paid' ? '下載收據 / 出貨單' : '查看訂單'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}

      {isPaymentModalOpen && <PaymentModal onClose={() => setIsPaymentModalOpen(false)} />}

      {selectedOrderReceipt && (
        <OrderReceiptModal order={selectedOrderReceipt} onClose={() => setSelectedOrderReceipt(null)} />
      )}
    </div>
  );
}
