import React, { useState } from 'react';

interface DonationPlanDetailProps {
  planId: number;
}

const PLAN_DATA = [
  { 
    id: 1, 
    title: '【新生的甘霖】復活草生命禮盒', 
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    description: '在這瞬息萬變的世界中，我們常感到枯竭與疲憊。復活草展現了生命的奇蹟，即使在最嚴苛的環境中，只需一滴甘霖便能重獲新生。這份禮盒象徵著信仰中的希望與復甦，邀請您透過奉獻，將這份生命的禮物傳遞給更多需要的靈魂。'
  },
  { 
    id: 2, 
    title: '在沙漠中匯聚活水，將影響力推向地極', 
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800',
    description: '荒漠中若有活泉，便能孕育出綠洲。我們的每一筆奉獻，就如同一滴滴水滴，匯聚成川，流入那些心靈乾渴的地帶。加入我們，將這份具有無遠弗屆影響力的活水，推向世界的每一個角落。'
  },
  { 
    id: 3, 
    title: 'The Greatest Gift from God｜神的愛最美的禮物', 
    imageUrl: 'https://images.unsplash.com/photo-1600697395543-ef3ee6e9af7b?auto=format&fit=crop&q=80&w=800',
    description: '神賜給我們最美的禮物，便是那無條件的愛與救恩。透過您的支持與奉獻，我們得以將這份至高的禮物分享給尚未聽聞福音的人們。讓我們攜手，成為傳遞好消息的使者。'
  },
  { 
    id: 4, 
    title: '乘著愛的風出發吧！', 
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    description: '愛是一股驅動力，帶領我們突破疆界，迎向挑戰。這項方案旨在支持青年培力與跨文化宣教。讓我們一同乘上這股屬靈的風，帶著愛與使命，前往神所指引的目的地。'
  },
  { 
    id: 5, 
    title: '在你所在之處綻放', 
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    description: '每個人都被呼召成為所在之處的光與鹽。我們致力於推動職場與社區轉化，您的奉獻將幫助我們提供更多資源，裝備弟兄姊妹在家庭、職場及社會中為主發光，綻放獨特的生命影響力。'
  },
  { 
    id: 6, 
    title: '亞洲新核心', 
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    description: '我們看見亞洲在神國度藍圖中的關鍵角色。透過成立媒體中心、培訓基地與資源網絡，我們將立足亞洲，展望世界。邀請您參與這項深具戰略意義的建設計畫，共同打造亞洲新核心。'
  }
];

export default function DonationPlanDetail({ planId }: DonationPlanDetailProps) {
  const plan = PLAN_DATA.find(p => p.id === planId) || PLAN_DATA[0];

  const [paymentType, setPaymentType] = useState<'one-time' | 'installment'>('one-time');
  const [selectedPreset, setSelectedPreset] = useState<string>('1000');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'line-pay'>('credit-card');

  const presetAmounts = ['1000', '3000', '5000', '10000', '50000'];

  return (
    <div className="w-full min-h-[100dvh] md:h-[100dvh] md:overflow-hidden flex flex-col md:flex-row pt-[90px] md:pt-0 bg-theme-bg transition-colors duration-500">
      
      {/* Left Area - Main Image & Copywriting */}
      <div className="w-full md:w-[45%] h-[50vh] md:h-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={plan.imageUrl} 
          alt={plan.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <span className="font-display text-white/80 text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block drop-shadow-md">Support Plan</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-serif font-black leading-[1.1] text-white drop-shadow-lg mb-6">
            {plan.title}
          </h1>
          <p className="text-white/90 font-light text-sm md:text-base leading-relaxed md:leading-loose">
            {plan.description}
          </p>
        </div>
      </div>
      
      {/* Right Area - Form Form  */}
      <div className="w-full md:w-[55%] h-auto md:h-full flex flex-col p-6 pb-24 md:p-16 lg:p-24 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
        <div className="w-full max-w-xl mx-auto md:mx-0 xl:mr-auto space-y-10 md:space-y-12 pb-10">
          
          {/* Header */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-theme-text mb-2 transition-colors">奉獻方案支持</h2>
            <p className="text-theme-text/60 font-light transition-colors">請選擇您的奉獻方式與金額，支持我們的事工發展。</p>
          </div>

          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            
            {/* Step 1: Payment Type (單次/分期) */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60 transition-colors">
                <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">1</span>
                捐款頻率
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => { setPaymentType('one-time'); setCustomAmount(''); }}
                  className={`py-4 md:py-6 border rounded-sm font-serif font-black text-xl transition-all duration-300 relative overflow-hidden ${paymentType === 'one-time' ? 'border-brand-red bg-brand-red/5 text-brand-red shadow-[0_0_0_1px_rgba(200,20,20,1)]' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text/10'}`}
                >
                  單次奉獻
                  {paymentType === 'one-time' && <div className="absolute top-2 right-2 text-[10px] font-display uppercase tracking-widest text-brand-red border border-brand-red/30 bg-white dark:bg-black px-1.5 py-0.5 rounded-sm">Selected</div>}
                </button>
                <button 
                  type="button"
                  onClick={() => { setPaymentType('installment'); setCustomAmount(''); }}
                  className={`py-4 md:py-6 border rounded-sm font-serif font-black text-xl transition-all duration-300 relative overflow-hidden ${paymentType === 'installment' ? 'border-brand-red bg-brand-red/5 text-brand-red shadow-[0_0_0_1px_rgba(200,20,20,1)]' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text/10'}`}
                >
                   定期定額
                  {paymentType === 'installment' && <div className="absolute top-2 right-2 text-[10px] font-display uppercase tracking-widest text-brand-red border border-brand-red/30 bg-white dark:bg-black px-1.5 py-0.5 rounded-sm">Selected</div>}
                </button>
              </div>
            </div>

            {/* Step 2: Amount */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60 transition-colors">
                <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">2</span>
                選擇金額
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                {presetAmounts.map((amt) => (
                  <button 
                    key={amt}
                    type="button" 
                    onClick={() => { setSelectedPreset(amt); setCustomAmount(''); }}
                    className={`py-3 md:py-4 border font-display font-bold text-lg md:text-xl transition-all duration-300 rounded-sm ${selectedPreset === amt && customAmount === '' ? 'border-brand-red bg-brand-red text-white shadow-md transform -translate-y-0.5' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'}`}
                  >
                    {amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount for Single Time */}
              {paymentType === 'one-time' && (
                <div className={`mt-4 pt-4 border-t border-theme-text/10 transition-all duration-500 overflow-hidden`}>
                  <p className="text-theme-text/60 text-sm mb-3">或自行輸入金額 (至少 NT$ 100)</p>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-theme-text/40 group-focus-within:text-brand-red transition-colors">NT$</span>
                    <input 
                      type="number" 
                      placeholder="自訂金額" 
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedPreset('');
                      }}
                      className="w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-4 pl-14 pr-4 text-lg font-display text-theme-text focus:outline-none focus:border-brand-red focus:bg-transparent transition-colors disabled:opacity-50" 
                      min="100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 text-theme-text/60 transition-colors">
                <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">3</span>
                付款方式
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('credit-card')}
                  className={`border p-4 cursor-pointer rounded-sm flex items-center gap-4 transition-all duration-300 ${paymentMethod === 'credit-card' ? 'border-brand-red bg-brand-red/5' : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-colors ${paymentMethod === 'credit-card' ? 'border-brand-red' : 'border-theme-text/40'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-brand-red transition-transform duration-300 ${paymentMethod === 'credit-card' ? 'scale-100' : 'scale-0'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-theme-text">信用卡付款</span>
                    <span className="text-xs text-theme-text/50">Credit Card</span>
                  </div>
                  <i className="fas fa-credit-card ml-auto text-theme-text/30 text-xl"></i>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('line-pay')}
                  className={`border p-4 cursor-pointer rounded-sm flex items-center gap-4 transition-all duration-300 ${paymentMethod === 'line-pay' ? 'border-[#00B900] bg-[#00B900]/5' : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-colors ${paymentMethod === 'line-pay' ? 'border-[#00B900]' : 'border-theme-text/40'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-[#00B900] transition-transform duration-300 ${paymentMethod === 'line-pay' ? 'scale-100' : 'scale-0'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-theme-text">Line Pay</span>
                    <span className="text-xs text-theme-text/50">Mobile Payment</span>
                  </div>
                  {/* Since line-pay logo might not be in fas, using a stylized icon or fallback */}
                  <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-[#00B900] text-white">
                    <i className="fab fa-line text-lg"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Email / Donor Info stub */}
            <div className="pt-6 border-t border-theme-text/10">
                <input type="text" placeholder="YOUR EMAIL" className="w-full bg-transparent border-b border-theme-text/40 py-4 text-xl md:text-2xl font-display uppercase placeholder-theme-text/40 text-theme-text focus:outline-none focus:border-brand-red transition-colors" />
            </div>

            {/* Submit */}
            <button type="submit" className="w-full py-5 md:py-6 bg-theme-text text-theme-bg font-display font-black text-xl uppercase tracking-[0.2em] hover:bg-brand-red hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-xl mt-8 rounded-sm flex items-center justify-center gap-3">
                前往結帳 
                <span className="font-sans font-light text-sm opacity-80">(NT$ {customAmount || selectedPreset})</span>
                <i className="fas fa-arrow-right ml-2"></i>
            </button>
            <p className="text-center text-xs text-theme-text/40 mt-4">
              點擊結帳即表示您同意我們的服務條款與隱私權政策。
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
