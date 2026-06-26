import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (productId: number) => void;
  onUpdateQuantity: (productId: number, qty: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart
}: CartDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'line-pay'>('credit-card');
  const [orderNumber, setOrderNumber] = useState('');
  const [formError, setFormError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 80;
  const total = subtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !address) {
      setFormError('請填寫所有必填欄位');
      return;
    }
    setFormError('');
    
    // Generate random order number
    const rand = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newOrderNumber = `IMPACT-${dateStr}-${rand}`;
    setOrderNumber(newOrderNumber);

    // Save order to localStorage
    const newOrder = {
      orderNumber: newOrderNumber,
      date: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
      name,
      phone,
      email,
      address,
      paymentMethod,
      items: [...cartItems],
      subtotal,
      shippingFee,
      total,
      status: '已付款'
    };

    try {
      const savedOrdersStr = localStorage.getItem('impact_orders');
      const savedOrders = savedOrdersStr ? JSON.parse(savedOrdersStr) : [];
      savedOrders.unshift(newOrder);
      localStorage.setItem('impact_orders', JSON.stringify(savedOrders));
    } catch (err) {
      console.error('Error saving order to localStorage:', err);
    }

    setStep(3);
  };

  const handleFinish = () => {
    onClearCart();
    setStep(1);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-[450px] max-w-[100vw] bg-theme-bg text-theme-text shadow-[-10px_0_40px_rgba(0,0,0,0.3)] border-l border-theme-text/10 transition-transform duration-500 transform flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-theme-text/10 flex justify-between items-center bg-theme-text/2 flex-shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="font-serif font-black text-xl tracking-wider">
              {step === 1 && `購物車 (${cartItems.reduce((acc, i) => acc + i.quantity, 0)})`}
              {step === 2 && '填寫寄送資料'}
              {step === 3 && '結帳完成'}
            </h2>
          </div>
          <button 
            onClick={step === 3 ? handleFinish : onClose} 
            className="w-8 h-8 rounded-full border border-theme-text/10 flex items-center justify-center text-theme-text/60 hover:text-theme-text hover:border-theme-text/30 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          
          {/* STEP 1: CART LISTING */}
          {step === 1 && (
            <>
              {cartItems.length === 0 ? (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-theme-text/5 flex items-center justify-center text-theme-text/30 mb-6 border border-theme-text/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-serif font-black text-xl mb-2">購物車是空的</h3>
                  <p className="text-sm text-theme-text/50 font-light mb-8 max-w-xs">您的購物車中目前沒有任何信仰好物。快去尋找為你預備的信仰美學禮物吧！</p>
                  <button 
                    onClick={onClose} 
                    className="font-display font-bold uppercase tracking-widest text-xs border border-theme-text/30 px-6 py-3 text-theme-text hover:bg-theme-text hover:text-theme-bg transition cursor-pointer rounded-sm"
                  >
                    前往選購
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 pb-6 border-b border-theme-text/10 last:border-0">
                      <div className="w-20 h-24 bg-theme-text/5 border border-theme-text/10 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif font-bold text-base leading-snug line-clamp-2">{item.product.name}</h4>
                            <button 
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-theme-text/35 hover:text-brand-red transition-colors cursor-pointer"
                              title="移除商品"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          <span className="font-display text-brand-red text-sm font-bold block mt-1">NT$ {item.product.price.toLocaleString()}</span>
                        </div>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-theme-text/20 bg-theme-text/5 rounded-sm overflow-hidden h-8">
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-full flex items-center justify-center text-theme-text/60 hover:bg-theme-text/10 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 text-center font-display text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-full flex items-center justify-center text-theme-text/60 hover:bg-theme-text/10 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          <span className="font-display font-black text-sm text-theme-text">NT$ {(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 2 && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-text/60">收件人姓名 *</label>
                <input 
                  type="text" 
                  required
                  placeholder="真實姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-2.5 px-3.5 text-base text-theme-text focus:outline-none focus:border-brand-red transition-colors placeholder-theme-text/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-text/60">聯絡電話 *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="聯絡電話"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-2.5 px-3.5 text-base text-theme-text focus:outline-none focus:border-brand-red transition-colors placeholder-theme-text/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-text/60">電子郵件 *</label>
                <input 
                  type="email" 
                  required
                  placeholder="電子信箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-2.5 px-3.5 text-base text-theme-text focus:outline-none focus:border-brand-red transition-colors placeholder-theme-text/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-text/60">寄送地址 *</label>
                <input 
                  type="text" 
                  required
                  placeholder="收件地址"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-theme-text/5 border border-theme-text/20 rounded-sm py-2.5 px-3.5 text-base text-theme-text focus:outline-none focus:border-brand-red transition-colors placeholder-theme-text/30"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-theme-text/60 block">付款方式 *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit-card')}
                    className={`border p-3.5 cursor-pointer rounded-sm flex flex-col items-center gap-2 transition-all duration-300 font-bold ${
                      paymentMethod === 'credit-card'
                        ? 'border-brand-red bg-brand-red text-white shadow-md'
                        : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'
                    }`}
                  >
                    <i className="fas fa-credit-card text-lg" />
                    <span className="text-xs">信用卡付款</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('line-pay')}
                    className={`border p-3.5 cursor-pointer rounded-sm flex flex-col items-center gap-2 transition-all duration-300 font-bold ${
                      paymentMethod === 'line-pay'
                        ? 'border-brand-red bg-[#00B900] text-white shadow-md'
                        : 'border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10'
                    }`}
                  >
                    <i className="fab fa-line text-xl text-green-500 group-hover:text-white" style={{ color: paymentMethod === 'line-pay' ? 'white' : '#00B900' }} />
                    <span className="text-xs">Line Pay</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS PAGE */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6 border border-green-500/25 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif font-black text-2xl mb-2 text-green-600 dark:text-green-400">訂購成功！</h3>
              <p className="text-sm text-theme-text/60 font-light mb-8 max-w-xs">感謝您的支持。我們已收到您的訂單，隨後將發送明細至您的 Email 信箱。</p>
              
              {/* Order Box */}
              <div className="w-full bg-theme-text/5 border border-theme-text/10 rounded-sm p-5 text-left mb-10 space-y-3.5">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-theme-text/10">
                  <span className="font-bold text-theme-text/50">訂單編號</span>
                  <span className="font-display font-bold">{orderNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-theme-text/50 font-medium">收件人</span>
                  <span className="font-bold">{name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-theme-text/50 font-medium">寄送地址</span>
                  <span className="font-bold">{address}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-theme-text/50 font-medium">付款方式</span>
                  <span className="font-bold">{paymentMethod === 'credit-card' ? '信用卡' : 'Line Pay'}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-theme-text/10">
                  <span className="font-bold text-brand-red">實付金額</span>
                  <span className="font-display font-black text-brand-red text-base">NT$ {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Sum & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-theme-text/10 bg-theme-text/2 flex-shrink-0 transition-colors">
            {step === 1 && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-theme-text/60 font-light">
                  <span>小計</span>
                  <span className="font-display">NT$ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-theme-text/60 font-light">
                  <span>運費</span>
                  <span className="font-display">
                    {shippingFee === 0 ? '免運費' : `NT$ ${shippingFee}`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-theme-text/45 text-right font-light italic">消費滿 NT$ 1,000 即可享有免運費優惠</p>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-theme-text/10">
                  <span className="font-bold text-base">總計</span>
                  <span className="font-display font-black text-2xl text-brand-red">NT$ {total.toLocaleString()}</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-bold text-base">應付總額</span>
                <span className="font-display font-black text-2xl text-brand-red">NT$ {total.toLocaleString()}</span>
              </div>
            )}

            {/* Actions */}
            {step === 1 && (
              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 bg-theme-text text-theme-bg font-display font-black text-sm uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all transform hover:-translate-y-0.5 hover:shadow-lg rounded-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                前往填寫資料
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {step === 2 && formError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-wide px-4 py-3 rounded-xl mb-2">
                <i className="fas fa-exclamation-circle shrink-0" />
                {formError}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-3 gap-3">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="col-span-1 py-4 border border-theme-text/20 text-theme-text/75 font-display font-bold text-xs uppercase tracking-wider hover:bg-theme-text/5 transition-all rounded-sm cursor-pointer"
                >
                  返回
                </button>
                <button 
                  onClick={handleCheckoutSubmit}
                  className="col-span-2 py-4 bg-theme-text text-theme-bg font-display font-black text-sm uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all transform hover:-translate-y-0.5 hover:shadow-lg rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  確認付款
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            )}

            {step === 3 && (
              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-theme-text text-theme-bg font-display font-black text-sm uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all transform hover:-translate-y-0.5 hover:shadow-lg rounded-sm cursor-pointer"
              >
                繼續選購
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
