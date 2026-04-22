import { useState } from 'react';

interface ActionPageProps {
  category: string;
}

export default function ActionPage({ category }: ActionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('one-time');
  const [amount, setAmount] = useState('1000');

  return (
    <div className="w-full min-h-[100dvh] md:h-[100dvh] md:overflow-hidden flex flex-col md:flex-row pt-[130px] md:pt-0 bg-theme-bg transition-colors duration-500">
      <div className="w-full md:w-[45%] h-[40vh] md:h-full bg-brand-red flex flex-col justify-end p-8 md:p-16 relative overflow-hidden border-b border-theme-text/10 md:border-b-0 md:border-r transition-colors">
          <div className="absolute -right-20 md:-right-40 top-1/2 transform -translate-y-1/2 font-display text-[20vh] md:text-[30vh] font-black text-black/10 uppercase leading-none pointer-events-none" style={{ writingMode: 'vertical-rl' }}>
              {category === '訂報' ? 'SUB' : 'GIVE'}
          </div>
          <div className="relative z-10">
              <span className="font-display text-white text-xs md:text-sm tracking-[0.3em] uppercase mb-4 block drop-shadow-md">{category === '訂報' ? 'Join Us' : 'Support Us'}</span>
              <h1 className="text-5xl sm:text-6xl md:text-[80px] lg:text-[100px] font-serif font-black leading-[0.9] text-white drop-shadow-lg" dangerouslySetInnerHTML={{ __html: category === '訂報' ? 'READ<br>THE<br>TRUTH.' : 'EMPOWER<br>THE<br>VOICE.' }} />
          </div>
      </div>
      
      <div className="w-full md:w-[55%] h-auto md:h-full flex flex-col justify-center p-6 pb-24 md:p-16 lg:p-24 md:pb-16 overflow-y-auto">
          {category === '訂報' ? (
              <div className="space-y-6 md:space-y-8">
                  <div className="group border border-theme-text/20 bg-theme-text/5 p-6 md:p-8 hover:bg-theme-text hover:text-theme-bg transition-colors duration-500 cursor-pointer rounded-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-2">
                          <h3 className="text-3xl md:text-4xl font-serif font-black text-theme-text group-hover:text-theme-bg transition-colors">Digital Access</h3>
                          <span className="text-2xl font-display font-bold text-brand-red">NT$ 99</span>
                      </div>
                      <p className="font-light text-sm md:text-base opacity-70 group-hover:opacity-90 text-theme-text group-hover:text-theme-bg transition-colors">Full digital platform access, ad-free experience.</p>
                  </div>
                  
                  <div className="group border border-brand-red bg-brand-red/10 p-6 md:p-8 hover:bg-brand-red hover:text-white transition-colors duration-500 cursor-pointer relative rounded-sm">
                      <div className="absolute top-4 right-4 text-[10px] font-display uppercase tracking-widest text-brand-red group-hover:text-white border border-current px-2 py-1">Premium</div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-2 mt-4 sm:mt-0">
                          <h3 className="text-3xl md:text-4xl font-serif font-black text-theme-text group-hover:text-white transition-colors">Print + Digital</h3>
                          <span className="text-2xl font-display font-bold text-brand-red group-hover:text-white transition-colors">NT$ 200</span>
                      </div>
                      <p className="font-light text-sm md:text-base opacity-90 text-theme-text group-hover:text-white transition-colors">Bi-weekly physical print delivered + Digital Access.</p>
                  </div>
              </div>
          ) : (
              <form className="space-y-8 md:space-y-10">
                  <div className="space-y-4">
                      <div 
                          onClick={() => setSelectedPlan('one-time')}
                          className={`group border p-6 md:p-8 cursor-pointer rounded-sm transition-colors duration-500 relative ${selectedPlan === 'one-time' ? 'border-brand-red bg-brand-red/10' : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'}`}
                      >
                          {selectedPlan === 'one-time' && <div className="absolute top-4 right-4 text-[10px] font-display uppercase tracking-widest text-brand-red border border-current px-2 py-1">Selected</div>}
                          <div className="flex flex-col mb-2">
                              <h3 className="text-2xl md:text-3xl font-serif font-black text-theme-text transition-colors">單次奉獻</h3>
                              <span className="font-display text-[10px] md:text-xs tracking-[0.2em] uppercase text-theme-text/60 mt-2">One-time Gift</span>
                          </div>
                          <p className="font-light text-sm md:text-base opacity-80 text-theme-text mt-4 transition-colors">給予靈活的支持，讓媒體事工持續發聲，傳遞真理。</p>
                      </div>
                      
                      <div 
                          onClick={() => setSelectedPlan('monthly')}
                          className={`group border p-6 md:p-8 cursor-pointer rounded-sm transition-colors duration-500 relative ${selectedPlan === 'monthly' ? 'border-brand-red bg-brand-red/10' : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'}`}
                      >
                          {selectedPlan === 'monthly' && <div className="absolute top-4 right-4 text-[10px] font-display uppercase tracking-widest text-brand-red border border-current px-2 py-1">Selected</div>}
                          <div className="flex flex-col mb-2">
                              <h3 className="text-2xl md:text-3xl font-serif font-black text-theme-text transition-colors">定期定額</h3>
                              <span className="font-display text-[10px] md:text-xs tracking-[0.2em] uppercase text-theme-text/60 mt-2">Monthly Supporter</span>
                          </div>
                          <p className="font-light text-sm md:text-base opacity-80 text-theme-text mt-4 transition-colors">每月固定的支持，成為我們最堅實的後盾，穩定推動各項計畫。</p>
                      </div>

                      <div 
                          onClick={() => setSelectedPlan('angel')}
                          className={`group border p-6 md:p-8 cursor-pointer rounded-sm transition-colors duration-500 relative ${selectedPlan === 'angel' ? 'border-brand-red bg-brand-red/10' : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'}`}
                      >
                          {selectedPlan === 'angel' && <div className="absolute top-4 right-4 text-[10px] font-display uppercase tracking-widest text-brand-red border border-current px-2 py-1">Selected</div>}
                          <div className="flex flex-col mb-2">
                              <h3 className="text-2xl md:text-3xl font-serif font-black text-theme-text transition-colors">天使贊助</h3>
                              <span className="font-display text-[10px] md:text-xs tracking-[0.2em] uppercase text-theme-text/60 mt-2">Angel Sponsor</span>
                          </div>
                          <p className="font-light text-sm md:text-base opacity-80 text-theme-text mt-4 transition-colors">年度大額奉獻，深度參與我們的事工發展與未來願景。</p>
                      </div>
                  </div>

                  <div>
                      <label className="block font-display text-sm md:text-lg font-bold uppercase tracking-[0.2em] mb-6 text-theme-text/60 transition-colors">Select Amount</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                          <button 
                            type="button" 
                            onClick={() => setAmount('500')}
                            className={`flex-1 py-4 md:py-5 border font-display font-bold text-xl transition rounded-sm ${amount === '500' ? 'border-brand-red bg-brand-red text-white' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'}`}
                          >
                            500
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setAmount('1000')}
                            className={`flex-1 py-4 md:py-5 border font-display font-bold text-xl transition rounded-sm ${amount === '1000' ? 'border-brand-red bg-brand-red text-white' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'}`}
                          >
                            1000
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setAmount('3000')}
                            className={`flex-1 py-4 md:py-5 border font-display font-bold text-xl transition rounded-sm ${amount === '3000' ? 'border-brand-red bg-brand-red text-white' : 'border-theme-text/20 bg-theme-text/5 text-theme-text hover:bg-theme-text hover:text-theme-bg'}`}
                          >
                            3000
                          </button>
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
