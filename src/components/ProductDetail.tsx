import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/index';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSpec, setSelectedSpec] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const foundProduct = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.imageUrl);
      if (foundProduct.specs.length > 0) {
        setSelectedSpec(foundProduct.specs[0]);
      }
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-theme-bg text-theme-text transition-colors duration-500">
        <div className="w-12 h-12 border-4 border-theme-text/20 border-t-brand-red rounded-full animate-spin mb-4" />
        <p className="font-display tracking-widest text-sm text-theme-text/60">載入商品中...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }, 800);
  };

  return (
    <div className="w-full min-h-[100dvh] pt-[140px] md:pt-32 pb-24 bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="px-6 md:px-12 lg:px-20">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="group mb-8 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-theme-text/60 hover:text-brand-red transition-colors"
        >
          <div className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center group-hover:border-brand-red transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          返回好物畫廊
        </button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Main Image View */}
            <div className="w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] bg-theme-text/5 border border-theme-text/10 rounded-sm relative overflow-hidden transition-colors group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 font-display text-2xl font-black text-theme-text/30 bg-theme-bg/60 backdrop-blur-md px-3 py-1 rounded-sm border border-theme-text/10">
                0{product.id}
              </div>
            </div>

            {/* Thumbnail Selection */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 md:w-28 aspect-[4/3] flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all duration-300 ${
                      activeImage === imgUrl 
                        ? 'border-brand-red scale-95 shadow-lg' 
                        : 'border-theme-text/10 hover:border-theme-text/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Config & Purchase */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Product Meta */}
            <span className="font-display text-brand-red text-xs md:text-sm tracking-[0.4em] uppercase mb-3 block font-bold">
              {product.englishName}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-black leading-tight mb-4 text-theme-text">
              {product.name}
            </h1>
            
            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-theme-text/10">
              <span className="font-display font-black text-3xl text-brand-red">
                NT$ {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-theme-text/40 tracking-wider">含稅與基本配送費</span>
            </div>

            {/* Description */}
            <p className="text-theme-text/80 font-light text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Backstory Accordion */}
            <div className="mb-8 border border-theme-text/10 bg-theme-text/5 rounded-sm p-5 transition-colors">
              <h3 className="font-bold text-sm text-theme-text mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                好物故事
              </h3>
              <p className="text-xs text-theme-text/70 leading-relaxed font-light">
                {product.details}
              </p>
            </div>

            {/* Spec Options */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-bold text-theme-text/80 block">商品規格與特點</label>
              <div className="space-y-2 bg-theme-text/[0.02] border border-theme-text/10 rounded-sm p-4 text-sm text-theme-text/80 leading-relaxed">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 flex-shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 mb-8 pt-4 border-t border-theme-text/10">
              <span className="text-sm font-bold text-theme-text/80">購買數量</span>
              <div className="flex items-center border border-theme-text/20 bg-theme-text/5 rounded-sm overflow-hidden h-11">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-full flex items-center justify-center text-theme-text/60 hover:bg-theme-text/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-display font-bold text-base">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-full flex items-center justify-center text-theme-text/60 hover:bg-theme-text/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || addedSuccess}
                className={`py-4 border font-display font-bold text-sm uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 ${
                  addedSuccess
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-theme-text/30 bg-transparent text-theme-text hover:bg-theme-text/10'
                }`}
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-theme-text/30 border-t-theme-text rounded-full animate-spin" />
                ) : addedSuccess ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    已加入購物車
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    加入購物車
                  </>
                )}
              </button>

              <button
                onClick={() => alert(`立即購買：${product.name} x ${quantity}，共 NT$ ${(product.price * quantity).toLocaleString()} 元`)}
                className="py-4 bg-theme-text text-theme-bg font-display font-black text-sm uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all transform hover:-translate-y-0.5 hover:shadow-lg rounded-sm"
              >
                立即購買
              </button>
            </div>
            
            <p className="text-center text-xs text-theme-text/40 mt-4">全站使用金流安全加密技術，保障您的交易資訊。</p>

          </div>

        </div>

      </div>
    </div>
  );
}
