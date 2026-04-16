import React, { useState } from 'react';

interface LoginPageProps {
  goToCategory: (cat: string) => void;
}

export default function LoginPage({ goToCategory }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    goToCategory('會員專區');
  };

  return (
    <div className="pt-[140px] md:pt-[190px] pb-24 px-5 md:px-12 lg:px-20 min-h-[100dvh] bg-theme-bg text-theme-text transition-colors duration-500 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-32 sm:left-0 w-80 h-80 bg-brand-red/10 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 pointer-events-none transition-colors duration-500"></div>
      <div className="absolute bottom-1/4 -right-32 sm:right-0 w-80 h-80 bg-theme-text/5 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 pointer-events-none transition-colors duration-500"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Main Card */}
        <div className="bg-theme-bg/60 backdrop-blur-2xl border border-theme-text/10 rounded-2xl shadow-xl p-8 md:p-10 relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red/40 via-brand-red to-brand-red/40"></div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-3xl lg:text-4xl font-serif font-black tracking-widest text-theme-text transition-colors mb-2">會員登入</h1>
            <p className="text-xs md:text-sm font-display tracking-widest text-brand-red/80 uppercase mt-2">Log In to Impact</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1 transition-colors">帳號 Email</label>
              <div className="relative">
                <i className="far fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text"
                  placeholder="helloworld@example.com"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 relative group">
               <div className="flex justify-between items-center ml-1">
                 <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 transition-colors">密碼 Password</label>
                 <a href="#" className="text-[10px] sm:text-xs text-theme-text/50 hover:text-brand-red transition-colors underline-offset-2 hover:underline">忘記密碼？</a>
               </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 accent-brand-red cursor-pointer rounded border-theme-text/20 transition-colors" defaultChecked />
                <span className="text-xs text-theme-text/70 group-hover:text-theme-text transition-colors select-none font-bold tracking-widest mt-[1px]">保持登入 Remember me</span>
              </label>
            </div>

            <button type="submit" className="mt-4 w-full bg-brand-red text-white font-bold tracking-widest py-3.5 rounded-xl hover:bg-[#b31b1b] transform hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-brand-red/20 group">
              登入 <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-theme-text/10 transition-colors"></div>
            <span className="text-[10px] font-display tracking-widest text-theme-text/40 transition-colors">或使用以下方式登入</span>
            <div className="h-px flex-1 bg-theme-text/10 transition-colors"></div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
             <button onClick={handleLogin} className="w-full bg-[#00C300]/10 border border-[#00C300]/20 hover:bg-[#00C300]/20 text-theme-text py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors font-bold text-sm tracking-widest group">
               <i className="fab fa-line text-[#00C300] text-lg lg:text-xl group-hover:scale-110 transition-transform"></i>
               Line 快速登入
             </button>
             <button onClick={handleLogin} className="w-full bg-theme-text/5 border border-theme-text/10 hover:bg-theme-text/10 text-theme-text py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors font-bold text-sm tracking-widest group">
               <i className="fab fa-google text-lg lg:text-xl text-[#DB4437] group-hover:scale-110 transition-transform"></i>
               Google 登入
             </button>
          </div>

          <div className="mt-10 text-center text-xs tracking-widest text-theme-text/60 transition-colors">
            還沒有帳號嗎？ <a href="#" className="font-bold text-brand-red hover:text-brand-red/80 transition-colors underline underline-offset-4">立即註冊</a>
          </div>
        </div>
        
      </div>
    </div>
  );
}
