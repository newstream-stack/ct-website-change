import React, { useState } from 'react';
import { MOCK_NEWS } from '../data/index';
import { NewsItem } from '../types';
import ReceiptModal from '../components/ReceiptModal';

interface MemberDashboardProps {
  goToCategory: (cat: string) => void;
}

export default function MemberDashboard({ goToCategory }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const savedArticles = MOCK_NEWS.slice(0, 3); // Get some dummy articles for "saved"

  return (
    <div className="pt-[140px] md:pt-[180px] pb-24 px-5 md:px-12 lg:px-20 min-h-[100dvh] bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto animate-fade-in-up">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-theme-text/10 pb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-black tracking-widest text-theme-text mb-2">會員專區</h1>
            <p className="text-sm font-sans tracking-widest text-theme-text/60 uppercase">Member Dashboard</p>
          </div>
          <div className="flex items-center gap-4 bg-theme-text/5 p-4 rounded-xl border border-theme-text/10">
            <div className="w-12 h-12 bg-brand-red/20 rounded-full flex items-center justify-center text-brand-red text-xl font-bold">
              <i className="far fa-user"></i>
            </div>
            <div>
              <p className="font-bold text-sm">王大明 (David)</p>
              <p className="text-xs text-theme-text/60">david.wang@example.com</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 flex-shrink-0 grid grid-cols-2 md:flex md:flex-col gap-2 md:gap-2 pb-2 md:pb-0">
            {[
              { id: 'overview', name: '總覽 Overview', icon: 'fas fa-home' },
              { id: 'subscription', name: '我的訂閱 My Plan', icon: 'fas fa-crown' },
              { id: 'saved', name: '收藏文章 Saved', icon: 'far fa-bookmark' },
              { id: 'donations', name: '奉獻紀錄 Donations', icon: 'fas fa-hand-holding-heart' },
              { id: 'settings', name: '帳號設定 Settings', icon: 'fas fa-cog' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-2 py-3 md:px-5 md:py-4 rounded-xl font-bold tracking-widest text-[10px] md:text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' : 'text-theme-text/70 bg-theme-text/5 md:bg-transparent hover:bg-theme-text/10 hover:text-theme-text'}`}
              >
                <i className={`${tab.icon} text-sm md:text-base w-5 text-center mb-1 md:mb-0 ${activeTab === tab.id ? 'text-white/90' : 'text-theme-text/50'}`}></i>
                <span className="text-center">{tab.name}</span>
              </button>
            ))}
            <button 
              onClick={() => goToCategory('首頁')}
              className="md:mt-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-2 py-3 md:px-5 md:py-4 rounded-xl font-bold tracking-widest text-[10px] md:text-sm text-brand-red bg-brand-red/5 md:bg-transparent hover:bg-brand-red/10 transition-colors"
            >
              <i className="fas fa-sign-out-alt text-sm md:text-base w-5 text-center mb-1 md:mb-0"></i>
              <span className="text-center">登出 Logout</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-[500px]">
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                
                {/* Subscription Status Card */}
                <div className="bg-gradient-to-br from-theme-text/5 to-transparent border border-theme-text/10 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full mix-blend-multiply blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <h3 className="text-xl font-serif font-bold mb-6">目前訂閱方案</h3>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <div className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest rounded-full mb-3">Active Plan</div>
                      <h4 className="text-2xl font-black font-display text-theme-text">數位輕享版</h4>
                      <p className="text-sm text-theme-text/60 mt-2">下一次扣款日：2026/05/15 (NT$ 150)</p>
                    </div>
                    <a href="https://ct-website-change.vercel.app/?category=%E6%9C%83%E5%93%A1%E6%8B%9B%E5%8B%9F" className="bg-theme-text text-theme-bg px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest hover:opacity-80 transition-opacity inline-block">
                      管理訂閱
                    </a>
                  </div>
                </div>

                {/* Grid for Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                     <span className="text-3xl font-display font-black text-brand-red mb-2">12</span>
                     <span className="text-xs md:text-sm font-bold text-theme-text/70 tracking-widest">收藏文章</span>
                  </div>
                  <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                     <span className="text-3xl font-display font-black text-brand-red mb-2">5</span>
                     <span className="text-xs md:text-sm font-bold text-theme-text/70 tracking-widest">參加活動</span>
                  </div>
                  <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center col-span-2 md:col-span-1">
                     <span className="text-3xl font-display font-black text-brand-red mb-2">3</span>
                     <span className="text-xs md:text-sm font-bold text-theme-text/70 tracking-widest">奉獻紀錄</span>
                  </div>
                </div>
                
                {/* Recent Saved Articles */}
                <div>
                   <div className="flex justify-between items-center mb-6 mt-4">
                     <h3 className="text-xl font-serif font-bold">最近收藏</h3>
                     <button className="text-xs font-bold text-brand-red hover:underline underline-offset-4 tracking-widest flex items-center" onClick={() => setActiveTab('saved')}>
                       查看全部 <i className="fas fa-chevron-right ml-1 text-[10px]"></i>
                     </button>
                   </div>
                   <div className="flex flex-col gap-4">
                     {savedArticles.map(article => (
                       <div key={article.id} className="flex gap-4 p-4 rounded-xl border border-theme-text/5 hover:bg-theme-text/5 transition-colors cursor-pointer group">
                         <div className="w-24 h-24 sm:w-32 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-theme-text/10">
                           <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-all duration-500" />
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

            {activeTab === 'subscription' && (
              <div className="flex flex-col gap-8 animate-fade-in-up">
                <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-1">我的訂閱方案</h3>
                      <p className="text-sm text-theme-text/60">管理您的 IMPACT 會員資格與付款方式</p>
                    </div>
                    <a href="https://ct-website-change.vercel.app/?category=%E6%9C%83%E5%93%A1%E6%8B%9B%E5%8B%9F" className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold text-sm tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap">
                      升級方案
                    </a>
                  </div>
                  
                  <div className="bg-theme-bg border border-theme-text/10 rounded-xl p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                       <div>
                         <span className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-xs font-bold uppercase tracking-widest rounded-full mb-2">使用中</span>
                         <h4 className="text-2xl font-black font-display text-theme-text">數位輕享版</h4>
                       </div>
                       <span className="text-2xl font-display font-black text-brand-red">NT$ 150 <span className="text-sm text-theme-text/60 font-sans">/ 月</span></span>
                    </div>
                    <div className="h-px bg-theme-text/10 w-full my-4"></div>
                    <p className="text-sm text-theme-text/80 mb-2 font-bold">方案權益包含：</p>
                    <ul className="text-sm text-theme-text/60 flex flex-col gap-2 mb-6">
                      <li><i className="fas fa-check text-brand-red mr-2 mt-1"></i>數位內容免費閱讀</li>
                      <li><i className="fas fa-check text-brand-red mr-2"></i>每週電子報寄送</li>
                      <li><i className="fas fa-check text-brand-red mr-2"></i>60年資料庫查詢</li>
                    </ul>
                    <div className="bg-theme-text/5 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center text-sm gap-2">
                      <span className="text-theme-text/70">下次扣款日期：<span className="font-bold text-theme-text">2026/05/15</span></span>
                      <button 
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="font-bold text-brand-red hover:underline underline-offset-4 self-start sm:self-auto"
                      >
                        更新付款資訊
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold mb-4 font-serif">扣款紀錄</h4>
                  <div className="overflow-x-auto -mx-8 px-8 md:mx-0 md:px-0">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                      <thead className="text-xs text-theme-text/60 uppercase bg-theme-bg border-y border-theme-text/10">
                        <tr>
                          <th className="px-4 py-3 font-bold">日期</th>
                          <th className="px-4 py-3 font-bold">項目</th>
                          <th className="px-4 py-3 font-bold">金額</th>
                          <th className="px-4 py-3 font-bold">狀態</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-text/5 bg-theme-bg/30">
                        <tr>
                          <td className="px-4 py-3">2026/04/15</td>
                          <td className="px-4 py-3">會員訂閱：數位輕享版 (1個月)</td>
                          <td className="px-4 py-3 font-bold">NT$ 150</td>
                          <td className="px-4 py-3 text-[#00C300] font-bold">扣款成功</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-theme-text/60">2026/03/15</td>
                          <td className="px-4 py-3 text-theme-text/60">會員訂閱：數位輕享版 (1個月)</td>
                          <td className="px-4 py-3 font-bold text-theme-text/60">NT$ 150</td>
                          <td className="px-4 py-3 text-theme-text/60 font-bold">扣款成功</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div className="flex justify-between items-end border-b border-theme-text/10 pb-4 mb-2">
                  <h3 className="text-xl font-serif font-bold">收藏文章 (12)</h3>
                  <div className="flex gap-4 text-sm">
                    <button className="font-bold text-theme-text/80 hover:text-brand-red transition-colors flex items-center gap-1">最新加入 <i className="fas fa-chevron-down text-[10px]"></i></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                  {MOCK_NEWS.slice(0, 6).map((article, i) => (
                    <div key={i} className="bg-theme-text/5 border border-theme-text/10 rounded-xl overflow-hidden group flex flex-col h-full cursor-pointer hover:shadow-xl hover:shadow-theme-text/5 transition-all">
                      <div className="h-40 overflow-hidden relative">
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        <button className="absolute top-3 right-3 w-8 h-8 bg-theme-bg/90 backdrop-blur rounded-full flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-colors z-10" title="取消收藏" onClick={(e) => e.stopPropagation()}>
                           <i className="fas fa-bookmark text-sm"></i>
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-[10px] font-bold tracking-widest text-brand-red uppercase mb-1">{article.category}</span>
                        <h4 className="font-bold text-sm leading-snug mb-3 line-clamp-2 md:line-clamp-3">{article.title}</h4>
                        <div className="mt-auto flex justify-between items-end text-xs text-theme-text/50 pt-2 border-t border-theme-text/5">
                          <span>{article.date}</span>
                          <span className="hover:text-brand-red font-bold text-brand-red group-hover:translate-x-1 transition-transform">閱讀 <i className="fas fa-arrow-right text-[10px] ml-1"></i></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                       <span className="text-3xl font-display font-black text-brand-red">NT$ 9,000</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                    <table className="w-full text-sm text-left whitespace-nowrap font-sans">
                      <thead className="text-xs text-theme-text/60 uppercase bg-theme-bg border-y border-theme-text/10">
                        <tr>
                          <th className="px-4 py-3.5 font-bold">奉獻日期</th>
                          <th className="px-4 py-3.5 font-bold">奉獻專案</th>
                          <th className="px-4 py-3.5 font-bold">奉獻方式</th>
                          <th className="px-4 py-3.5 font-bold">金額</th>
                          <th className="px-4 py-3.5 font-bold">收據</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-text/5 bg-theme-bg/30">
                        <tr className="hover:bg-theme-text/5 transition-colors">
                          <td className="px-4 py-4">2026/04/10</td>
                          <td className="px-4 py-4 font-bold text-brand-red">
                             <a href="https://ct-website-change.vercel.app/?category=%E5%A5%89%E7%8D%BB" className="hover:underline underline-offset-4">乘著愛的風出發吧！</a>
                           </td>
                          <td className="px-4 py-4 text-theme-text/60">單筆奉獻 (LinePay)</td>
                          <td className="px-4 py-4 font-bold">NT$ 8,000</td>
                          <td className="px-4 py-4"><button onClick={() => setSelectedReceipt({ id: '2026041001', date: '2026/04/10', project: '乘著愛的風出發吧！', method: '單筆奉獻 (LinePay)', amount: 'NT$ 8,000', name: '王大明' })} className="text-brand-red hover:underline text-xs font-bold underline-offset-4">下載收據</button></td>
                        </tr>
                        <tr className="hover:bg-theme-text/5 transition-colors">
                          <td className="px-4 py-4">2026/02/15</td>
                          <td className="px-4 py-4 font-bold text-brand-red">
                             <a href="https://ct-website-change.vercel.app/?category=%E5%A5%89%E7%8D%BB" className="hover:underline underline-offset-4">亞洲論壇影響力中心</a>
                           </td>
                          <td className="px-4 py-4 text-theme-text/60">單筆奉獻 (信用卡)</td>
                          <td className="px-4 py-4 font-bold">NT$ 1,000</td>
                          <td className="px-4 py-4"><button onClick={() => setSelectedReceipt({ id: '2026021509', date: '2026/02/15', project: '亞洲論壇影響力中心', method: '單筆奉獻 (信用卡)', amount: 'NT$ 1,000', name: '王大明' })} className="text-brand-red hover:underline text-xs font-bold underline-offset-4">下載收據</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-theme-text/10 flex justify-center">
                    <a href="https://ct-website-change.vercel.app/?category=%E5%A5%89%E7%8D%BB" className="border border-brand-red text-brand-red px-8 py-3 rounded-xl font-bold tracking-widest hover:bg-brand-red hover:text-white transition-colors group inline-block">
                      探索更多奉獻專案 <i className="fas fa-heart ml-2 group-hover:scale-110 transition-transform"></i>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="flex flex-col gap-6 animate-fade-in-up">
                <div className="bg-theme-text/5 border border-theme-text/10 rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl font-serif font-bold mb-6">帳號設定</h3>
                  
                  <form className="flex flex-col gap-5 max-w-lg" onSubmit={e => e.preventDefault()}>
                    <div className="flex flex-col gap-2">
                       <label className="text-xs font-bold tracking-widest text-theme-text/70">姓名 Name</label>
                       <input type="text" defaultValue="王大明" className="bg-theme-bg border border-theme-text/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-xs font-bold tracking-widest text-theme-text/70">電子信箱 Email Address</label>
                       <input type="email" defaultValue="david.wang@example.com" className="bg-theme-bg border border-theme-text/10 rounded-xl px-4 py-3.5 text-sm opacity-60 cursor-not-allowed font-sans text-theme-text" readOnly />
                       <span className="text-[10px] text-theme-text/40 mt-1"><i className="fas fa-info-circle mr-1"></i>信箱作為登入帳號，如需修改請聯繫客服。</span>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-xs font-bold tracking-widest text-theme-text/70">聯絡地址 Address</label>
                       <input type="text" defaultValue="台北市大安區新生南路三段" className="bg-theme-bg border border-theme-text/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text" />
                    </div>
                    
                    <div className="h-px w-full bg-theme-text/10 my-4"></div>
                    
                    <div className="flex flex-col gap-3">
                       <label className="text-xs font-bold tracking-widest text-theme-text/70">變更密碼 Change Password</label>
                       <input type="password" placeholder="輸入舊密碼" className="bg-theme-bg border border-theme-text/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text" />
                       <input type="password" placeholder="設定新密碼" className="bg-theme-bg border border-theme-text/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text" />
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                       <button className="bg-brand-red text-white font-bold py-3.5 px-8 rounded-xl tracking-widest text-sm hover:bg-[#b31b1b] transform hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-red/20 text-center">儲存變更 Save</button>
                       <button className="border border-theme-text/20 text-theme-text/70 font-bold py-3.5 px-8 rounded-xl tracking-widest text-sm hover:bg-theme-text/10 transition-colors text-center">取消 Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedReceipt && (
        <ReceiptModal 
          receipt={selectedReceipt} 
          onClose={() => setSelectedReceipt(null)} 
        />
      )}

      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-theme-bg/80 backdrop-blur-md" onClick={() => setIsPaymentModalOpen(false)}></div>
          <div className="bg-theme-bg border border-theme-text/10 rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl animate-fade-in-up">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 text-theme-text/40 hover:text-theme-text transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <h3 className="text-2xl font-serif font-black mb-6">更新付款資訊</h3>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text/60">卡號 Card Number</label>
                <div className="relative">
                  <i className="far fa-credit-card absolute left-4 top-1/2 -translate-y-1/2 text-theme-text/40"></i>
                  <input type="text" placeholder="**** **** **** 4242" className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 transition-all font-sans text-theme-text" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text/60">有效期 Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 transition-all font-sans text-theme-text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text/60">驗證碼 CVC</label>
                  <input type="text" placeholder="***" className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 transition-all font-sans text-theme-text" />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  alert('付款資訊預覽更新成功！');
                  setIsPaymentModalOpen(false);
                }}
                className="mt-4 w-full bg-brand-red text-white font-bold tracking-widest py-3.5 rounded-xl hover:opacity-90 transform active:scale-[0.98] transition-all shadow-lg shadow-brand-red/20"
              >
                確 認 更 新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
