import React, { useState, useEffect, useRef } from 'react';
import type { Plan, DonationFormPayload } from '../types/donation';
import { getPlan, submitDonation } from '../api/plans';

// ─── Types ──────────────────────────────────────────────────────────────────

interface DonationPlanDetailProps {
  planId: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PRESET_AMOUNTS = [1000, 3000, 5000, 10000, 50000];
const INSTALLMENT_PERIODS = [6, 12, 18];
const RECEIPT_OPTIONS = ['年度匯開', '按月寄送', '不需收據'] as const;

const DEFAULT_FORM: Omit<DonationFormPayload, 'planId'> = {
  paymentType: 'one-time',
  amount: 1000,
  installmentPeriod: 6,
  paymentMethod: 'credit-card',
  donor: { name: '', phone: '', email: '', address: '' },
  receipt: { address: '', option: '年度匯開', title: '', taxId: '' },
  gift: { address: '' },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-theme-bg text-theme-text">
      <div className="w-12 h-12 border-4 border-theme-text/20 border-t-brand-red rounded-full animate-spin mb-4" />
      <p className="font-display tracking-widest text-sm text-theme-text/60">載入方案資料中...</p>
    </div>
  );
}

function StepLabel({ step, label }: { step: string; label: string }) {
  return (
    <label className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60">
      <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">{step}</span>
      {label}
    </label>
  );
}

function SelectButton({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border rounded-sm font-bold transition-all duration-300 ${
        active
          ? 'border-brand-red bg-brand-red text-white shadow-md -translate-y-0.5'
          : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function PaymentMethodCard({
  active,
  onClick,
  label,
  sublabel,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={`border p-4 cursor-pointer rounded-sm flex items-center gap-4 transition-all duration-300 ${
        active
          ? 'border-brand-red bg-brand-red text-white shadow-md -translate-y-0.5'
          : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${active ? 'border-white' : 'border-theme-text/40'}`}>
        <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 ${active ? 'scale-100' : 'scale-0'}`} />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${active ? 'text-white' : 'text-theme-text'}`}>{label}</span>
        <span className={`text-xs ${active ? 'text-white/70' : 'text-theme-text/50'}`}>{sublabel}</span>
      </div>
      <div className="ml-auto">{icon}</div>
    </div>
  );
}

// ─── Container (邏輯層) ───────────────────────────────────────────────────────

export default function DonationPlanDetail({ planId }: DonationPlanDetailProps) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customAmountStr, setCustomAmountStr] = useState('');
  const [perPeriodStr, setPerPeriodStr] = useState('');
  const isEditingPerPeriod = useRef(false);
  const [formData, setFormData] = useState<DonationFormPayload>({ planId, ...DEFAULT_FORM });
  const [submitMsg, setSubmitMsg] = useState('');

  const updateForm = (updates: Partial<DonationFormPayload>) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const updateDonor = (field: keyof DonationFormPayload['donor'], value: string) =>
    setFormData((prev) => ({ ...prev, donor: { ...prev.donor, [field]: value } }));

  const updateReceipt = (field: keyof DonationFormPayload['receipt'], value: string) =>
    setFormData((prev) => ({ ...prev, receipt: { ...prev.receipt, [field]: value } }));

  // 同步每期金額顯示（非使用者直接編輯時才更新）
  useEffect(() => {
    if (isEditingPerPeriod.current) return;
    if (formData.paymentType === 'installment' && formData.installmentPeriod) {
      setPerPeriodStr(String(Math.ceil(formData.amount / formData.installmentPeriod)));
    }
  }, [formData.amount, formData.installmentPeriod, formData.paymentType]);

  // 切換到定期定額時，若已選 Line Pay 則自動改為信用卡
  useEffect(() => {
    if (formData.paymentType === 'installment' && formData.paymentMethod === 'line-pay') {
      updateForm({ paymentMethod: 'credit-card' });
    }
  }, [formData.paymentType]);

  // ── Data fetching ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const data = await getPlan(planId);
        if (data) {
          setPlan(data);
          updateForm({ planId: data.id });
        }
      } catch (err) {
        console.error('Failed to fetch plan:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitDonation(formData);
    // TODO: replace with real payment flow; submitDonation will call POST /api/donations
    setSubmitMsg('表單已送出，感謝您的奉獻！');
  };

  if (isLoading || !plan) return <LoadingScreen />;

  const inputCls =
    'w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-3 px-4 text-base text-theme-text focus:outline-none focus:border-brand-red focus:bg-transparent transition-colors placeholder-theme-text/30';

  // ── View ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-[100dvh] md:h-[100dvh] md:overflow-hidden flex flex-col md:flex-row pt-[90px] md:pt-0 bg-theme-bg transition-colors duration-500">
      
      {/* ── Left: Plan Info ─────────────────────────────────────────────── */}
      <div className="w-full md:w-[45%] h-auto md:h-full flex flex-col bg-theme-bg md:border-r border-theme-text/10 overflow-y-auto scrollbar-hide md:pt-[130px]">
        <div className="w-full md:min-h-[40vh] md:max-h-[55vh] relative flex-shrink-0 overflow-hidden flex items-center justify-center">
          <img src={plan.imageUrl} alt={plan.title} className="w-full h-auto md:h-full object-cover" />
        </div>
        <div className="p-8 md:p-12 lg:p-16 flex flex-col text-theme-text flex-grow">
          <span className="font-display text-brand-red text-xs md:text-sm tracking-[0.4em] uppercase mb-4 block font-bold">
            Support Plan
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-serif font-black leading-[1.2] text-theme-text mb-8">
            {plan.title.split('——').map((part, i) => (
              <React.Fragment key={i}>
                {part}
                {i === 0 && '——'}
                <br className="hidden md:block" />
              </React.Fragment>
            ))}
          </h1>
          <div className="text-theme-text/80 font-light text-base md:text-lg leading-relaxed md:leading-loose space-y-6 max-w-2xl">
            {plan.description.split('\n').map((line, idx) =>
              line.trim() ? <p key={idx}>{line}</p> : null
            )}
          </div>
        </div>
      </div>

      {/* ── Right: Donation Form ─────────────────────────────────────────── */}
      <div className="w-full md:w-[55%] h-auto md:h-full flex flex-col p-6 pb-24 md:px-16 md:pb-16 md:pt-[130px] lg:px-24 lg:pb-24 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="w-full max-w-xl mx-auto md:mx-0 xl:mr-auto space-y-10 md:space-y-12 pb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-theme-text mb-2">奉獻方案支持</h2>
            <p className="text-theme-text/60 font-light">請選擇您的奉獻方式與金額，支持我們的事工發展。</p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>

            {/* Step 1: Payment Type */}
            <div className="space-y-4">
              <StepLabel step="1" label="捐款頻率" />
              <div className="grid grid-cols-2 gap-4">
                <SelectButton active={formData.paymentType === 'one-time'} onClick={() => updateForm({ paymentType: 'one-time' })} className="py-4 md:py-6 font-serif text-xl">
                  單次奉獻
                </SelectButton>
                <SelectButton active={formData.paymentType === 'installment'} onClick={() => updateForm({ paymentType: 'installment' })} className="py-4 md:py-6 font-serif text-xl">
                  定期定額
                </SelectButton>
              </div>
            </div>

            {/* Step 2: Amount */}
            <div className="space-y-4">
              <StepLabel step="2" label="選擇金額" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {PRESET_AMOUNTS.map((amt) => (
                  <SelectButton
                    key={amt}
                    active={formData.amount === amt && !customAmountStr}
                    onClick={() => { updateForm({ amount: amt }); setCustomAmountStr(''); }}
                    className="py-3 md:py-4 font-display text-lg md:text-xl"
                  >
                    {amt}
                  </SelectButton>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-theme-text/10">
                <p className="text-theme-text/60 text-sm mb-3">或自行輸入金額 (至少 NT$ 100)</p>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-theme-text/40 group-focus-within:text-brand-red transition-colors">NT$</span>
                  <input
                    type="number"
                    placeholder="自訂金額"
                    value={customAmountStr}
                    min="100"
                    onChange={(e) => {
                      setCustomAmountStr(e.target.value);
                      updateForm({ amount: Number(e.target.value) || 0 });
                    }}
                    className="w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-4 pl-14 pr-4 text-lg font-display text-theme-text focus:outline-none focus:border-brand-red focus:bg-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Installment periods */}
              {formData.paymentType === 'installment' && (
                <div className="mt-8 pt-4 border-t border-theme-text/10 space-y-6">
                  <div>
                    <StepLabel step="2.1" label="選擇分期期數" />
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      {INSTALLMENT_PERIODS.map((period) => (
                        <SelectButton
                          key={period}
                          active={formData.installmentPeriod === period}
                          onClick={() => {
                            isEditingPerPeriod.current = false;
                            updateForm({ installmentPeriod: period });
                          }}
                          className="py-3 md:py-4 font-display text-lg"
                        >
                          {period} 期
                        </SelectButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-theme-text/60 text-sm mb-3">每期扣款金額（可自行調整）</p>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-theme-text/40 group-focus-within:text-brand-red transition-colors">NT$</span>
                      <input
                        type="number"
                        min="1"
                        value={perPeriodStr}
                        onChange={(e) => {
                          isEditingPerPeriod.current = true;
                          setPerPeriodStr(e.target.value);
                          const val = Number(e.target.value);
                          if (val > 0) {
                            updateForm({ amount: val * (formData.installmentPeriod ?? 6) });
                          }
                        }}
                        onBlur={() => { isEditingPerPeriod.current = false; }}
                        className="w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-4 pl-14 pr-4 text-lg font-display text-theme-text focus:outline-none focus:border-brand-red focus:bg-transparent transition-colors"
                      />
                    </div>
                    <p className="text-theme-text/40 text-xs mt-2">
                      總金額：NT$ {formData.amount}（{formData.installmentPeriod} 期）
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-4">
              <StepLabel step="3" label="付款方式" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentMethodCard
                  active={formData.paymentMethod === 'credit-card'}
                  onClick={() => updateForm({ paymentMethod: 'credit-card' })}
                  label="信用卡付款"
                  sublabel="Credit Card"
                  icon={<i className={`fas fa-credit-card text-xl ${formData.paymentMethod === 'credit-card' ? 'text-white' : 'text-theme-text/30'}`} />}
                />
                {formData.paymentType === 'installment' ? (
                  <div className="border border-theme-text/10 p-4 rounded-sm flex items-center gap-4 opacity-40 cursor-not-allowed select-none">
                    <div className="w-5 h-5 rounded-full border-2 border-theme-text/30 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-bold text-theme-text">Line Pay</span>
                      <span className="text-xs text-theme-text/50">定期定額不支援</span>
                    </div>
                    <div className="ml-auto">
                      <div className="w-8 h-8 rounded-full bg-[#00B900]/40 text-white flex items-center justify-center"><i className="fab fa-line text-lg" /></div>
                    </div>
                  </div>
                ) : (
                  <PaymentMethodCard
                    active={formData.paymentMethod === 'line-pay'}
                    onClick={() => updateForm({ paymentMethod: 'line-pay' })}
                    label="Line Pay"
                    sublabel="Mobile Payment"
                    icon={<div className="w-8 h-8 rounded-full bg-[#00B900] text-white flex items-center justify-center"><i className="fab fa-line text-lg" /></div>}
                  />
                )}
              </div>
            </div>

            {/* Step 4: Donor Info */}
            <div className="space-y-6 pt-8 border-t border-theme-text/10">
              <StepLabel step="4" label="填寫資料" />
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-theme-text/80">姓名 <span className="text-brand-red">*</span></label>
                    <input type="text" placeholder="真實姓名" value={formData.donor.name} onChange={(e) => updateDonor('name', e.target.value)} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-theme-text/80">電話 <span className="text-brand-red">*</span></label>
                    <input type="tel" placeholder="聯絡電話" value={formData.donor.phone} onChange={(e) => updateDonor('phone', e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-theme-text/80">Email <span className="text-brand-red">*</span></label>
                  <input type="email" placeholder="電子信箱" value={formData.donor.email} onChange={(e) => updateDonor('email', e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-theme-text/80">聯絡地址 <span className="text-brand-red">*</span></label>
                  <input type="text" placeholder="聯絡地址" value={formData.donor.address} onChange={(e) => updateDonor('address', e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-theme-text/80">奉獻收據地址 <span className="text-brand-red">*</span></label>
                    <button type="button" onClick={() => updateReceipt('address', formData.donor.address)} className="text-[12px] font-bold text-brand-red hover:bg-brand-red hover:text-white border border-brand-red/30 px-3 py-1 rounded-sm transition-colors">同聯絡地址</button>
                  </div>
                  <input type="text" placeholder="收據寄送地址" value={formData.receipt.address} onChange={(e) => updateReceipt('address', e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-theme-text/80">奉獻贈禮寄送地址 <span className="text-xs opacity-60 ml-2 font-normal">(選填)</span></label>
                    <button type="button" onClick={() => setFormData((prev) => ({ ...prev, gift: { address: prev.donor.address } }))} className="text-[12px] font-bold text-brand-red hover:bg-brand-red hover:text-white border border-brand-red/30 px-3 py-1 rounded-sm transition-colors">同聯絡地址</button>
                  </div>
                  <input type="text" placeholder="贈禮寄送地址" value={formData.gift.address} onChange={(e) => setFormData((prev) => ({ ...prev, gift: { address: e.target.value } }))} className={inputCls} />
                </div>
                <div className="space-y-3 pt-4 border-t border-theme-text/10">
                  <label className="text-sm font-bold text-theme-text/80">收據寄送選項 <span className="text-brand-red">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {RECEIPT_OPTIONS.map((opt) => (
                      <SelectButton key={opt} active={formData.receipt.option === opt} onClick={() => updateReceipt('option', opt)} className="py-3 text-sm md:text-base">
                        {opt}
                      </SelectButton>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-theme-text/80">收據抬頭 <span className="text-xs opacity-60 ml-2 font-normal">(選填)</span></label>
                    <input type="text" placeholder="收據抬頭" value={formData.receipt.title} onChange={(e) => updateReceipt('title', e.target.value)} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-theme-text/80">統一編號 <span className="text-xs opacity-60 ml-2 font-normal">(選填)</span></label>
                    <input type="text" placeholder="統一編號" value={formData.receipt.taxId} onChange={(e) => updateReceipt('taxId', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            {(() => {
              const isInstallment = formData.paymentType === 'installment';
              const perPeriod = isInstallment
                ? Math.ceil(formData.amount / (formData.installmentPeriod ?? 6))
                : null;
              return (
                <>
                  {submitMsg && (
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-bold tracking-wide px-4 py-3 rounded-xl mt-6">
                      <i className="fas fa-circle-check shrink-0" />
                      {submitMsg}
                    </div>
                  )}
                  <button type="submit" className="w-full py-5 md:py-6 bg-theme-text text-theme-bg font-display font-black text-xl uppercase tracking-[0.2em] hover:bg-brand-red hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-xl mt-8 rounded-sm flex items-center justify-center gap-3">
                    前往結帳
                    <span className="font-sans font-light text-sm opacity-80">
                      {isInstallment
                        ? `(NT$ ${perPeriod} × ${formData.installmentPeriod} 期)`
                        : `(NT$ ${formData.amount})`}
                    </span>
                    <i className="fas fa-arrow-right ml-2" />
                  </button>
                </>
              );
            })()}
            <p className="text-center text-xs text-theme-text/40 mt-4">點擊結帳即表示您同意我們的服務條款與隱私權政策。</p>

            {/* Alternative Payment Methods */}
            <div className="mt-16 pt-12 border-t border-theme-text/10 space-y-10">
              <h3 className="text-2xl md:text-3xl font-serif font-black text-theme-text/90">其他付款方式</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-brand-red/30 rounded-full" />
                    <h4 className="text-lg font-bold text-theme-text">郵政劃撥</h4>
                  </div>
                  <div className="text-theme-text/70 space-y-2 text-base md:text-lg pl-4">
                    <p className="flex items-center gap-2"><span className="text-theme-text/40 text-sm font-display font-bold">帳號</span> 00064331</p>
                    <p className="flex items-start gap-2"><span className="text-theme-text/40 text-sm font-display font-bold whitespace-nowrap mt-1">戶名</span> 財團法人基督教論壇基金會</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-brand-red/30 rounded-full" />
                    <h4 className="text-lg font-bold text-theme-text">ATM轉帳</h4>
                  </div>
                  <div className="text-theme-text/70 space-y-2 text-base md:text-lg pl-4">
                    <p className="flex items-center gap-x-3"><span className="text-theme-text/40 text-sm font-display font-bold">銀行代碼</span> <span className="font-bold">008</span> <span className="text-theme-text/50 text-sm">華南商業銀行新生分行</span></p>
                    <p className="flex items-center gap-2"><span className="text-theme-text/40 text-sm font-display font-bold">帳號</span> 113-20-0391766</p>
                    <p className="flex items-start gap-2"><span className="text-theme-text/40 text-sm font-display font-bold whitespace-nowrap mt-1">戶名</span> 財團法人基督教論壇基金會</p>
                  </div>
                </div>
              </div>
              <div className="bg-brand-red/[0.03] border border-brand-red/10 p-8 rounded-sm space-y-4">
                <p className="text-brand-red font-black text-lg flex items-center gap-2"><i className="fas fa-exclamation-circle text-base" />匯款後請來電告知帳號末五碼</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-brand-red/80 text-base md:text-lg font-medium">
                  <div className="flex items-center gap-3"><i className="fas fa-phone-alt text-sm opacity-60" /><p>Tel: (02) 2396-1010</p></div>
                  <div className="flex items-center gap-3"><i className="fas fa-fax text-sm opacity-60" /><p>Fax: (02) 2396-1309</p></div>
                </div>
                <p className="text-brand-red/80 text-base md:text-lg font-medium flex items-center gap-3">
                  <i className="fas fa-envelope text-sm opacity-60" />
                  <span>或來信告知後五碼：<a href="mailto:service@ct.org.tw" className="underline hover:text-brand-red font-bold">service@ct.org.tw</a></span>
                </p>
                <div className="pt-4 mt-4 border-t border-brand-red/10">
                  <p className="text-brand-red font-black text-xl flex items-center gap-2"><i className="fas fa-check-circle text-base" />並請註明奉獻方案</p>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
