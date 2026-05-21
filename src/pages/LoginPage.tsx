import React, { useState } from 'react';

interface LoginPageProps {
  goToCategory: (cat: string) => void;
}

export default function LoginPage({ goToCategory }: LoginPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Simulate login persistence
    if (email) {
      const customUser = {
        name: '郭測試',
        displayName: '郭測試',
        email: email,
        address: '台北市大安區新生南路三段30號'
      };
      localStorage.setItem('impact_member', JSON.stringify(customUser));
    }
    
    goToCategory('會員專區');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !address) {
      alert('請填寫所有欄位');
      return;
    }
    if (password !== confirmPassword) {
      alert('設定密碼與確認密碼不一致！');
      return;
    }

    // Save register user to localStorage
    const customUser = {
      name: name,
      displayName: name,
      email: email,
      address: address
    };
    
    localStorage.setItem('impact_member', JSON.stringify(customUser));
    alert('註冊成功！已為您自動登入。');
    goToCategory('會員專區');
  };

  const socialLogin = () => {
    const customUser = {
      name: '社群夥伴',
      displayName: '社群夥伴',
      email: 'social-partner@impact.org',
      address: '台灣好地'
    };
    localStorage.setItem('impact_member', JSON.stringify(customUser));
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
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-black tracking-widest text-theme-text transition-colors mb-2">
              {isRegister ? '註冊帳號' : '會員登入'}
            </h1>
            <p className="text-xs md:text-sm font-display tracking-widest text-brand-red/80 uppercase mt-2">
              {isRegister ? 'Register to Impact' : 'Log In to Impact'}
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={isRegister ? handleRegister : handleLogin}>
            
            {isRegister && (
              <div className="flex flex-col gap-1.5 relative group text-left">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1 transition-colors">姓名 Name</label>
                <div className="relative">
                  <i className="far fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                    placeholder="真實姓名"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 relative group text-left">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1 transition-colors">帳號 Email</label>
              <div className="relative">
                <i className="far fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                  placeholder="helloworld@example.com"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 relative group text-left">
               <div className="flex justify-between items-center ml-1">
                 <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 transition-colors">密碼 Password</label>
                 {!isRegister && (
                   <a href="#" onClick={(e) => { e.preventDefault(); alert('請輸入您的註冊信箱，我們將寄送密碼重設信。'); }} className="text-[10px] sm:text-xs text-theme-text/55 hover:text-brand-red transition-colors underline-offset-2 hover:underline">忘記密碼？</a>
                 )}
               </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div className="flex flex-col gap-1.5 relative group text-left">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1 transition-colors">確認密碼 Confirm Password</label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                      placeholder="再次輸入密碼"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative group text-left">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1 transition-colors">聯絡地址 Address</label>
                  <div className="relative">
                    <i className="fas fa-map-marker-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                    <input 
                      type="text" 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-theme-text/5 border border-theme-text/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                      placeholder="台北市大安區..."
                    />
                  </div>
                </div>
              </>
            )}

            {!isRegister && (
              <div className="flex items-center px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 accent-brand-red cursor-pointer rounded border-theme-text/20 transition-colors" defaultChecked />
                  <span className="text-xs text-theme-text/70 group-hover:text-theme-text transition-colors select-none font-bold tracking-widest mt-[1px]">保持登入 Remember me</span>
                </label>
              </div>
            )}

            <button type="submit" className="mt-4 w-full bg-brand-red text-white font-bold tracking-widest py-3.5 rounded-xl hover:bg-[#b31b1b] transform hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-brand-red/20 group cursor-pointer">
              {isRegister ? '註冊帳號' : '登入'}{' '}
              <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </button>
          </form>

          {!isRegister && (
            <>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-theme-text/10 transition-colors"></div>
                <span className="text-[10px] font-display tracking-widest text-theme-text/40 transition-colors">或使用以下方式登入</span>
                <div className="h-px flex-1 bg-theme-text/10 transition-colors"></div>
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                 <button onClick={socialLogin} className="w-full bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 text-theme-text py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors font-bold text-sm tracking-widest group cursor-pointer">
                   <i className="fab fa-facebook-f text-[#1877F2] text-lg lg:text-xl group-hover:scale-110 transition-transform"></i>
                   Facebook 登入
                 </button>
                 <button onClick={socialLogin} className="w-full bg-theme-text/5 border border-theme-text/10 hover:bg-theme-text/10 text-theme-text py-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors font-bold text-sm tracking-widest group cursor-pointer">
                   <i className="fab fa-google text-lg lg:text-xl text-[#DB4437] group-hover:scale-110 transition-transform"></i>
                   Google 登入
                 </button>
              </div>
            </>
          )}

          <div className="mt-8 text-center text-xs tracking-widest text-theme-text/60 transition-colors">
            {isRegister ? (
              <>
                已經有帳號了嗎？{' '}
                <button 
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-brand-red hover:text-brand-red/80 transition-colors underline underline-offset-4 cursor-pointer"
                >
                  立即登入
                </button>
              </>
            ) : (
              <>
                還沒有帳號嗎？{' '}
                <button 
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-brand-red hover:text-brand-red/80 transition-colors underline underline-offset-4 cursor-pointer"
                >
                  立即註冊
                </button>
              </>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
