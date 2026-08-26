import { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { getProduct, getRelatedProducts } from '../api/products';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from './AsyncPageState';

const RETURN_POLICY = '商品享有到貨後 7 天猶豫期（不含例假日），期間內可辦理退換貨，退回商品須保持全新狀態、吊牌及包裝完整。退貨運費由買家負擔（商品瑕疵或運送損壞除外）。退款將於收到退回商品並驗收無誤後 7 個工作天內原路退回；若商品有瑕疵或運送損壞，請於到貨 3 日內聯繫客服辦理免費換貨。';

const BULK_ORDER_CONTACT = {
  phone: '02-2396-1010 林姊妹',
  email: 'shop@ct.org.tw',
  hours: '週一至週五 08:30–17:30',
};

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: string) => void;
  onSelectProduct: (productId: number) => void;
}

export default function ProductDetail({ productId, onBack, onAddToCart, onSelectProduct }: ProductDetailProps) {
  const { data: product, error, isLoading, reload } = useAsyncData<Product | null>(
    `product:${productId}`,
    async (signal) => (await getProduct(productId, { signal })) ?? null,
    null,
  );
  const { data: relatedProducts } = useAsyncData<Product[]>(
    `related-products:${productId}`,
    (signal) => getRelatedProducts(productId, 4, { signal }),
    [],
  );
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl);
      setSelectedVariant(null);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => () => {
    if (successTimer.current) clearTimeout(successTimer.current);
  }, []);

  if (error) return <AsyncPageState error={error} onRetry={reload} />;
  if (isLoading || !product) return <AsyncPageState />;

  const isSoldOut = product.stock <= 0;
  const isLowStock = !isSoldOut && product.stock <= 10;
  const hasDiscount = typeof product.originalPrice === 'number' && product.originalPrice > product.price;
  const needsVariant = Boolean(product.variants && product.variants.length > 0);
  const canPurchase = !isSoldOut && (!needsVariant || Boolean(selectedVariant));

  const handleAddToCart = () => {
    if (!canPurchase) return;
    onAddToCart(product, quantity, selectedVariant ?? undefined);
    setAddedSuccess(true);
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="w-full min-h-[100dvh] pt-[140px] md:pt-32 pb-24 bg-theme-bg text-theme-text">
      <div className="px-6 md:px-12 lg:px-20">

        {/* Back Button */}
        <button
          onClick={onBack}
          aria-label="返回好物畫廊"
          className="group mt-6 md:mt-8 mb-8 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-theme-text/60 hover:text-brand-red transition-colors"
        >
          <div className="w-8 h-8 rounded-full border border-theme-text/20 flex items-center justify-center group-hover:border-brand-red transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4  group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          返回好物畫廊
        </button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Main Image View */}
            <div className="w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] bg-theme-text/5 border border-theme-text/10 rounded-sm relative overflow-hidden group">
              <img 
                src={activeImage} 
                alt={product.name} 
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute top-6 left-6 font-display text-2xl font-black text-theme-text/30 bg-theme-bg/60 px-3 py-1 rounded-sm border border-theme-text/10">
                0{product.id}
              </div>
            </div>

            {/* Thumbnail Selection */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    aria-label={`查看商品圖片 ${idx + 1}`}
                    className={`w-20 md:w-28 aspect-[4/3] flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all duration-300 ${
                      activeImage === imgUrl 
                        ? 'border-brand-red scale-95' 
                        : 'border-theme-text/10 hover:border-theme-text/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
            <div className="mb-6 pb-6 border-b border-theme-text/10">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display font-black text-3xl text-brand-red">
                  NT$ {product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="font-display text-base text-theme-text/40 line-through">
                    NT$ {product.originalPrice!.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-theme-text/40 tracking-wider">含稅與基本配送費</span>
              </div>
              <div className="mt-3">
                {isSoldOut ? (
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-theme-text/60 px-3 py-1 rounded-sm">
                    已售完
                  </span>
                ) : isLowStock ? (
                  <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-red/10 px-3 py-1 rounded-sm">
                    僅剩 {product.stock} 件，售完為止
                  </span>
                ) : (
                  <span className="inline-block text-xs font-medium text-theme-text/50">
                    庫存 {product.stock} 件
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-theme-text/80 font-light text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Backstory Accordion */}
            <div className="mb-8 border border-theme-text/10 bg-theme-text/5 rounded-sm p-5">
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

            {/* Product Info Table */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-bold text-theme-text/80 block">商品資訊</label>
              <div className="bg-theme-text/[0.02] border border-theme-text/10 rounded-sm divide-y divide-theme-text/10 text-sm">
                {(product.infoTable ?? product.specs.map((spec) => {
                  const [label, ...rest] = spec.split('：');
                  return { label, value: rest.join('：') || label };
                })).map((row, i) => (
                  <div key={i} className="flex gap-4 px-4 py-3">
                    <span className="w-20 md:w-24 flex-shrink-0 font-bold text-theme-text/60">{row.label}</span>
                    <span className="text-theme-text/80">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-theme-text/50 leading-relaxed">
                <span className="font-bold text-theme-text/70">團購洽詢：</span>
                {BULK_ORDER_CONTACT.phone}／{BULK_ORDER_CONTACT.email}
                <br />
                <span className="font-bold text-theme-text/70">客服服務時間：</span>
                {BULK_ORDER_CONTACT.hours}
              </p>
            </div>

            {/* Variant Selector */}
            {needsVariant && (
              <div className="space-y-3 mb-6">
                <label className="text-sm font-bold text-theme-text/80 block">
                  選擇規格{!selectedVariant && <span className="text-brand-red font-normal ml-1">（請選擇）</span>}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants!.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      aria-pressed={selectedVariant === variant}
                      className={`px-4 py-2 text-sm rounded-sm border transition-all ${
                        selectedVariant === variant
                          ? 'border-brand-red bg-brand-red/10 text-brand-red font-bold'
                          : 'border-theme-text/20 text-theme-text/70 hover:border-theme-text/50'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 mb-8 pt-4 border-t border-theme-text/10">
              <span className="text-sm font-bold text-theme-text/80">購買數量</span>
              <div className="flex items-center border border-theme-text/20 bg-theme-text/5 rounded-sm overflow-hidden h-11">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  aria-label="減少購買數量"
                  className="w-10 h-full flex items-center justify-center text-theme-text/60 hover:bg-theme-text/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-display font-bold text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="增加購買數量"
                  className="w-10 h-full flex items-center justify-center text-theme-text/60 hover:bg-theme-text/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                disabled={addedSuccess || !canPurchase}
                className={`py-4 border font-display font-bold text-sm uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                  addedSuccess
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-theme-text/30 bg-transparent text-theme-text hover:bg-theme-text/10'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    已加入購物車
                  </>
                ) : isSoldOut ? (
                  '已售完'
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
                onClick={() => canPurchase && onAddToCart(product, quantity, selectedVariant ?? undefined)}
                disabled={!canPurchase}
                className="py-4 bg-theme-text text-theme-bg font-display font-black text-sm uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all  rounded-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isSoldOut ? '已售完' : '立即購買'}
              </button>
            </div>

            <p className="text-center text-xs text-theme-text/40 mt-4">付款將導向金流託管頁面，本站不接收或儲存完整卡號與安全碼。</p>

            {/* Return / Exchange Policy */}
            <div className="mt-6 border border-theme-text/10 bg-theme-text/[0.02] rounded-sm p-5">
              <h3 className="font-bold text-sm text-theme-text mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                退換貨資訊
              </h3>
              <p className="text-xs text-theme-text/70 leading-relaxed font-light">
                {RETURN_POLICY}
              </p>
            </div>

          </div>

        </div>

        {/* Product Story */}
        {product.story && (
          <div className="mt-20 pt-16 border-t border-theme-text/10 max-w-2xl mx-auto text-center">
            <div className="space-y-8">
              {product.story.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-theme-text/80 font-light leading-loose whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex items-center gap-4 my-10">
              <span className="flex-1 h-px bg-theme-text/15" />
              <span className="text-brand-red text-sm">✝</span>
              <span className="flex-1 h-px bg-theme-text/15" />
            </div>

            {product.story.highlight && (
              <p className="text-brand-red font-bold leading-relaxed mb-10">
                {product.story.highlight}
              </p>
            )}

            <div className="flex items-center gap-4 mb-12">
              <span className="flex-1 h-px bg-theme-text/15" />
              <span className="text-brand-red text-sm">✝</span>
              <span className="flex-1 h-px bg-theme-text/15" />
            </div>

            {product.story.image && (
              <div className="aspect-[832/470] rounded-sm overflow-hidden border border-theme-text/10">
                <img
                  src={product.story.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-theme-text/10">
            <h2 className="text-2xl md:text-3xl font-serif font-black text-theme-text mb-8">
              你可能也喜歡
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() => onSelectProduct(related.id)}
                  className="group text-left"
                >
                  <div className="w-full aspect-[3/4] bg-theme-text/5 border border-theme-text/10 rounded-sm overflow-hidden mb-3">
                    <img
                      src={related.imageUrl}
                      alt={related.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-all duration-700"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-sm md:text-base text-theme-text group-hover:text-brand-red transition-colors">
                    {related.englishName}
                  </h3>
                  <span className="font-display font-bold text-sm text-brand-red">
                    NT$ {related.price.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
