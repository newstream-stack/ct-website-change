import React, { useState } from 'react';

export default function EventRegistrationPage() {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(1); // Default to standard ticket
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const tickets = [
    {
      id: 1,
      name: '一般報名 Standard',
      price: 'NT$ 6,000',
      features: ['包含三天實體論壇門票', '大會限定提袋與筆記本', '提供每日午餐與茶點', '會後數位版精華影片觀看權 (30天)']
    },
    {
      id: 2,
      name: 'VIP 尊榮票 Premium VIP',
      price: 'NT$ 12,000',
      features: ['包含三天實體論壇門票 (前三排保留席)', 'VIP 專屬報到通道與休息室', '大會限定提袋與筆記本', '大師面對面：專屬講員晚宴', '會後完整影音資料庫永久觀看權']
    },
    {
      id: 3,
      name: '線上參與 Online',
      price: 'NT$ 2,000',
      features: ['包含三天線上直播觀看權', '會後數位版精華影片觀看權 (30天)', '線上專屬互動問答區']
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="pt-[140px] md:pt-[180px] pb-24 px-5 min-h-[100dvh] flex items-center justify-center bg-theme-bg text-theme-text transition-colors duration-500">
        <div className="max-w-xl w-full text-center p-12 border border-theme-text/10 rounded-2xl bg-theme-text/5 backdrop-blur-md animate-fade-in-up">
          <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg shadow-brand-red/30">
            <i className="fas fa-check"></i>
          </div>
          <h2 className="text-3xl font-serif font-black mb-4">報名成功！</h2>
          <p className="text-theme-text/70 mb-8 leading-relaxed">
            感謝您報名參加「IMPACT 2026 全球華人影響力高峰會」。<br />
            您的報名確認信與電子票券已發送至您的電子信箱，請留意查收。期待與您相見！
          </p>
          <button onClick={() => window.location.href = '?category=首頁'} className="bg-brand-red text-white px-8 py-3 rounded-full font-bold tracking-widest hover:bg-brand-red/90 transition-colors">
            回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[100px] md:pt-[140px] pb-24 min-h-[100dvh] bg-theme-bg text-theme-text transition-colors duration-500 relative">
      
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000" 
          alt="Event Background" 
          className="w-full h-full object-cover grayscale-[0.5] object-center scale-105 transform origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-theme-bg/80 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center px-4 md:px-12 pt-20 animate-fade-in-up">
          <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4">Premium Sponsorship / Annual Summit</span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black tracking-widest mb-6 leading-tight drop-shadow-2xl">
            IMPACT 2026 <br className="md:hidden" />全球華人影響力高峰會
          </h1>
          <p className="max-w-2xl text-sm md:text-base font-sans leading-relaxed text-theme-text/80 drop-shadow-md">
            結合理性與靈性的視野，邀請重量級講員獨家探討未來的企業倫理。在急遽變化的世代中，尋找不變的真理與前進的動力。
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-12 lg:px-20 flex flex-col lg:grid lg:grid-cols-12 gap-12">
        
        {/* Left Column: Event Details & Form */}
        <div className="lg:col-span-7 flex flex-col gap-10 order-2 lg:order-1">
          
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-theme-text/5 border border-theme-text/10 p-5 rounded-2xl flex flex-col items-center text-center">
              <i className="far fa-calendar-alt text-2xl text-brand-red mb-3"></i>
              <h4 className="font-bold text-sm tracking-widest uppercase mb-1">活動日期</h4>
              <p className="text-xs text-theme-text/70">2026/10/20 (二)<br/>至 10/22 (四)</p>
            </div>
            <div className="bg-theme-text/5 border border-theme-text/10 p-5 rounded-2xl flex flex-col items-center text-center">
              <i className="fas fa-map-marker-alt text-2xl text-brand-red mb-3"></i>
              <h4 className="font-bold text-sm tracking-widest uppercase mb-1">活動地點</h4>
              <p className="text-xs text-theme-text/70">台北國際會議中心<br/>(TICC 大會堂)</p>
            </div>
          </div>

          <h3 className="text-2xl font-serif font-bold border-b border-theme-text/10 pb-4">報名資料填寫</h3>
          
          <form id="registration-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 relative group">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">姓名 Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-text/40">
                    <i className="far fa-user text-sm"></i>
                  </div>
                  <input type="text" required className="w-full bg-theme-text/5 border border-theme-text/20 focus:border-brand-red/50 text-theme-text text-sm rounded-xl block pl-11 p-3.5 outline-none transition-all focus:ring-1 focus:ring-brand-red/50" placeholder="王大明" />
                </div>
              </div>
              <div className="flex flex-col gap-2 relative group">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">稱謂 Title</label>
                <div className="relative">
                  <select className="w-full bg-theme-text/5 border border-theme-text/20 focus:border-brand-red/50 text-theme-text text-sm rounded-xl block p-3.5 outline-none transition-all appearance-none cursor-pointer">
                    <option value="mr">先生</option>
                    <option value="ms">女士</option>
                    <option value="pastor">牧師</option>
                    <option value="elder">長老</option>
                    <option value="other">其他</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-theme-text/40 pointer-events-none"></i>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">電子信箱 Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-text/40">
                  <i className="far fa-envelope text-sm"></i>
                </div>
                <input type="email" required className="w-full bg-theme-text/5 border border-theme-text/20 focus:border-brand-red/50 text-theme-text text-sm rounded-xl block pl-11 p-3.5 outline-none transition-all focus:ring-1 focus:ring-brand-red/50" placeholder="david@example.com" />
              </div>
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">聯絡電話 Phone *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-text/40">
                  <i className="fas fa-phone-alt text-sm"></i>
                </div>
                <input type="tel" required className="w-full bg-theme-text/5 border border-theme-text/20 focus:border-brand-red/50 text-theme-text text-sm rounded-xl block pl-11 p-3.5 outline-none transition-all focus:ring-1 focus:ring-brand-red/50" placeholder="0912-345-678" />
              </div>
            </div>

            <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">所屬教會 / 機構 / 公司名稱 Organization</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-text/40">
                  <i className="far fa-building text-sm"></i>
                </div>
                <input type="text" className="w-full bg-theme-text/5 border border-theme-text/20 focus:border-brand-red/50 text-theme-text text-sm rounded-xl block pl-11 p-3.5 outline-none transition-all focus:ring-1 focus:ring-brand-red/50" placeholder="填寫所屬單位名稱" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 relative group mt-2">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">給大會的留言或特殊需求 (如有) Remarks</label>
              <textarea rows={3} className="w-full bg-theme-text/5 border border-theme-text/20 focus:border-brand-red/50 text-theme-text text-sm rounded-xl block p-3.5 outline-none transition-all focus:ring-1 focus:ring-brand-red/50 resize-none" placeholder="例如：飲食禁忌 (素食) 等..."></textarea>
            </div>
          </form>

          {/* Mobile Checkout Section (Visible only on mobile) */}
          <div className="lg:hidden border-t border-theme-text/10 pt-8 mt-2">
             <div className="flex justify-between items-center mb-6">
               <span className="font-bold tracking-widest uppercase text-sm">總計 Total</span>
               <span className="font-display font-black text-3xl text-brand-red">{tickets.find(t => t.id === selectedTicket)?.price}</span>
             </div>
             
             <button 
              type="submit" 
              form="registration-form"
              disabled={isSubmitting}
              className={`w-full bg-brand-red text-white py-4 rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-brand-red/40 relative overflow-hidden ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:-translate-y-0.5 focus:-translate-y-0.5'}`}
             >
               {isSubmitting ? (
                 <span className="flex items-center justify-center gap-2">
                   <i className="fas fa-circle-notch fa-spin"></i> 處理中 Processing...
                 </span>
               ) : (
                 <span className="flex items-center justify-center gap-2">
                   確認報名 Checkout <i className="fas fa-arrow-right"></i>
                 </span>
               )}
             </button>
             <p className="text-[10px] text-theme-text/50 text-center mt-4">點擊報名即表示您同意本會之隱私權政策與活動條款。</p>
          </div>

        </div>

        {/* Right Column: Ticket Selection & Checkout */}
        <div className="lg:col-span-5 relative order-1 lg:order-2">
          <div className="sticky top-[100px] flex flex-col gap-6">
            <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 backdrop-blur-md">
              <h3 className="text-xl font-serif font-bold text-brand-red mb-2">請選擇您的票種</h3>
              
              <div className="flex flex-col gap-4">
                {tickets.map((t) => (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTicket(t.id)}
                    className={`border-2 p-5 rounded-xl cursor-pointer transition-all ${selectedTicket === t.id ? 'border-brand-red bg-brand-red/5 shadow-[0_0_15px_rgba(179,27,27,0.15)]' : 'border-theme-text/10 hover:border-theme-text/30 hover:bg-theme-text/5'}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className={`font-bold tracking-widest ${selectedTicket === t.id ? 'text-brand-red text-lg' : 'text-base'}`}>{t.name}</h4>
                      <span className={`font-display font-black text-xl ${selectedTicket === t.id ? 'text-brand-red' : 'text-theme-text'}`}>{t.price}</span>
                    </div>
                    <ul className="text-xs text-theme-text/60 flex flex-col gap-2">
                       {t.features.map((feature, i) => (
                         <li key={i} className="flex"><i className={`fas fa-check mt-0.5 mr-2 ${selectedTicket === t.id ? 'text-brand-red/80' : 'text-brand-red/40'}`}></i> {feature}</li>
                       ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block border-t border-theme-text/10 pt-6 mt-2">
                 <div className="flex justify-between items-center mb-6">
                   <span className="font-bold tracking-widest uppercase text-sm">總計 Total</span>
                   <span className="font-display font-black text-3xl text-brand-red">{tickets.find(t => t.id === selectedTicket)?.price}</span>
                 </div>
                 
                 <button 
                  type="submit" 
                  form="registration-form"
                  disabled={isSubmitting}
                  className={`w-full bg-brand-red text-white py-4 rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-brand-red/40 relative overflow-hidden ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:-translate-y-0.5 focus:-translate-y-0.5'}`}
                 >
                   {isSubmitting ? (
                     <span className="flex items-center justify-center gap-2">
                       <i className="fas fa-circle-notch fa-spin"></i> 處理中 Processing...
                     </span>
                   ) : (
                     <span className="flex items-center justify-center gap-2">
                       確認報名 Checkout <i className="fas fa-arrow-right"></i>
                     </span>
                   )}
                 </button>
                 <p className="text-[10px] text-theme-text/50 text-center mt-4">點擊報名即表示您同意本會之隱私權政策與活動條款。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
