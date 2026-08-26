import React, { useState, useEffect } from 'react';
import { forgotPassword, login, register, socialLogin as apiSocialLogin, saveSession } from '../api/auth';
import { redirectToExternalUrl } from '../utils/navigation';

interface LoginPageProps {
  onLoginSuccess: () => void;
  initialRegister?: boolean;
  /** Changes on every header 登入／註冊 click, so the form switches mode even when the route stays put. */
  resetKey?: number;
}

export default function LoginPage({ onLoginSuccess, initialRegister = false, resetKey = 0 }: LoginPageProps) {
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setIsRegister(initialRegister);
    setIsForgotPassword(false);
    setError('');
    setNotice('');
  }, [initialRegister, resetKey]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      saveSession(res, rememberMe);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('請完整填寫註冊資料');
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError('密碼需為 8 至 128 個字元');
      return;
    }
    if (password !== confirmPassword) {
      setError('設定密碼與確認密碼不一致');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await register({ name: name.trim(), email: email.trim(), password });
      saveSession(res, rememberMe);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '註冊失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    setError('');
    setIsLoading(true);
    try {
      const res = await apiSocialLogin(provider);
      if ('authorizationUrl' in res) {
        redirectToExternalUrl(res.authorizationUrl);
      } else {
        saveSession(res, rememberMe);
        onLoginSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setIsLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      setNotice('若此信箱已註冊，您將收到密碼重設信件。');
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法送出重設請求，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[150px] md:pt-40 pb-24 px-5 md:px-12 lg:px-20 min-h-[100dvh] bg-theme-bg text-theme-text flex items-center justify-center relative overflow-hidden">
      
      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Main Card */}
        <div className="bg-theme-bg border border-theme-text/15 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-red"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-black tracking-tight text-theme-text mb-2">
              {isForgotPassword ? '重設密碼' : isRegister ? '註冊帳號' : '會員登入'}
            </h1>
            <p className="text-xs md:text-sm font-display tracking-widest text-brand-red/80 uppercase mt-2">
              {isForgotPassword ? 'Reset Password' : isRegister ? 'Register to Impact' : 'Log In to Impact'}
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={isForgotPassword ? handleForgotPassword : isRegister ? handleRegister : handleLogin}>
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-wide px-4 py-3 rounded-sm">
                <i className="fas fa-exclamation-circle shrink-0" />
                {error}
              </div>
            )}
            {notice && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-bold tracking-wide px-4 py-3 rounded-sm">
                <i className="fas fa-circle-check shrink-0" />
                {notice}
              </div>
            )}
            
            {isRegister && (
              <div className="flex flex-col gap-1.5 relative group text-left">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">姓名 Name</label>
                <div className="relative">
                  <i className="far fa-user absolute left-4 top-1/2  -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                  <input 
                    type="text" 
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-theme-text/5 border border-theme-text/10 rounded-sm pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                    placeholder="真實姓名"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5 relative group text-left">
              <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">帳號 Email</label>
              <div className="relative">
                <i className="far fa-envelope absolute left-4 top-1/2  -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                <input 
                  type="email" 
                  required
                  maxLength={254}
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/10 rounded-sm pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                  placeholder="helloworld@example.com"
                />
              </div>
            </div>
            
            {!isForgotPassword && <div className="flex flex-col gap-1.5 relative group text-left">
               <div className="flex justify-between items-center ml-1">
                 <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70">密碼 Password</label>
                 {!isRegister && (
                   <button type="button" onClick={() => { setIsForgotPassword(true); setError(''); setNotice(''); }} className="text-[10px] sm:text-xs text-theme-text/55 hover:text-brand-red transition-colors underline-offset-2 hover:underline">忘記密碼？</button>
                 )}
               </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2  -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                <input 
                  type="password" 
                  required
                  minLength={isRegister ? 8 : undefined}
                  maxLength={128}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/10 rounded-sm pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                  placeholder="••••••••"
                />
              </div>
              {!isRegister && (
                <label className="flex items-center gap-2 mt-1 ml-1 text-xs text-theme-text/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-theme-text/30 text-brand-red focus:ring-brand-red/50 cursor-pointer"
                  />
                  記住我
                </label>
              )}
            </div>}

            {isRegister && (
              <>
                <div className="flex flex-col gap-1.5 relative group text-left">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-theme-text/70 ml-1">確認密碼 Confirm Password</label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-4 top-1/2  -translate-y-1/2 text-theme-text/40 group-focus-within:text-brand-red transition-colors"></i>
                    <input 
                      type="password" 
                      required
                      minLength={8}
                      maxLength={128}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-theme-text/5 border border-theme-text/10 rounded-sm pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-sans text-theme-text placeholder-theme-text/30"
                      placeholder="再次輸入密碼"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-brand-red text-white font-bold tracking-widest py-3.5 rounded-sm hover:bg-[#b31b1b]  active:translate-y-0 transition-all group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <><i className="fas fa-circle-notch fa-spin mr-2" />{isForgotPassword ? '送出中...' : isRegister ? '註冊中...' : '登入中...'}</>
              ) : (
                <>{isForgotPassword ? '寄送重設信' : isRegister ? '註冊帳號' : '登入'} <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {!isRegister && !isForgotPassword && (
            <>
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-theme-text/10"></div>
                <span className="text-[10px] font-display tracking-widest text-theme-text/40">或使用以下方式登入</span>
                <div className="h-px flex-1 bg-theme-text/10"></div>
              </div>

              <div className="mt-4 flex flex-col gap-2.5">
                 <button onClick={() => handleSocialLogin('facebook')} disabled={isLoading} className="w-full bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 text-theme-text py-3.5 rounded-sm flex items-center justify-center gap-3 transition-colors font-bold text-sm tracking-widest group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                   <i className="fab fa-facebook-f text-[#1877F2] text-lg lg:text-xl transition-transform"></i>
                   Facebook 登入
                 </button>
                 <button onClick={() => handleSocialLogin('google')} disabled={isLoading} className="w-full bg-theme-text/5 border border-theme-text/10 hover:bg-theme-text/10 text-theme-text py-3.5 rounded-sm flex items-center justify-center gap-3 transition-colors font-bold text-sm tracking-widest group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                   <i className="fab fa-google text-lg lg:text-xl text-[#DB4437] transition-transform"></i>
                   Google 登入
                 </button>
              </div>
            </>
          )}

          <div className="mt-8 text-center text-xs tracking-widest text-theme-text/60">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setError(''); setNotice(''); }}
                className="font-bold text-brand-red hover:text-brand-red/80 transition-colors underline underline-offset-4 cursor-pointer"
              >
                返回會員登入
              </button>
            ) : isRegister ? (
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
