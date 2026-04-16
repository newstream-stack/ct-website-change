import React, { useState } from 'react';
import { MOCK_NEWS } from '../data';

interface MemberDashboardProps {
  goToCategory: (cat: string) => void;
}

export default function MemberDashboard({ goToCategory }: MemberDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

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
          <div className="w-full md:w-64 flex-shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
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
                className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold tracking-widest text-sm whitespace-nowrap transition-all duration-300 ${activeTab === tab.id ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' : 'text-theme-text/70 hover:bg-theme-text/5 hover:text-theme-text'}`}
              >
                <i className={`${tab.icon} w-5 text-center ${activeTab === tab.id ? 'text-white/90' : 'text-theme-text/50'}`}></i>
                {tab.name}
              </button>
            ))}
            <button 
              onClick={() => goToCategory('首頁')}
              className="md:mt-10 flex items-center gap-3 px-5 py-4 rounded-xl font-bold tracking-widest text-sm whitespace-nowrap text-brand-red hover:bg-brand-red/10 transition-colors"
            >
              <i className="fas fa-sign-out-alt w-5 text-center"></i>
              登出 Logout
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
                    <button className="bg-theme-text text-theme-bg px-6 py-2.5 rounded-lg font-bold text-sm tracking-widest hover:opacity-80 transition-opacity">
                      管理訂閱
                    </button>
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
                           <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
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

            {activeTab !== 'overview' && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-theme-text/10 border-dashed rounded-2xl text-center p-8 bg-theme-text/5 animate-fade-in-up">
                 <i className="fas fa-tools text-4xl text-theme-text/20 mb-4"></i>
                 <h3 className="text-xl font-serif font-bold mb-2">此專區建置中</h3>
                 <p className="text-sm text-theme-text/50 max-w-md">我們正在為您準備專屬的 {activeTab} 功能，即將開放，敬請期待！</p>
                 <button onClick={() => setActiveTab('overview')} className="mt-6 text-sm font-bold text-brand-red tracking-widest border border-brand-red px-6 py-2 rounded-full hover:bg-brand-red hover:text-white transition-colors">
                   返回總覽
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
