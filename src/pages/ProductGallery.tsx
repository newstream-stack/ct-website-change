import { getProducts } from '../api/products';
import type { Product } from '../types';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from '../components/AsyncPageState';
import { useRef } from 'react';

interface ProductGalleryProps {
  onSelectProduct: (id: number) => void;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onSelect: (id: number) => void;
}

function ProductCard({ product, index, onSelect }: ProductCardProps) {
  const isSoldOut = product.stock <= 0;
  const hasDiscount = typeof product.originalPrice === 'number' && product.originalPrice > product.price;

  return (
    <button
      type="button"
      className="gallery-item w-[85vw] md:w-[400px] flex-shrink-0 group cursor-pointer text-left"
      onClick={() => onSelect(product.id)}
    >
      <div className="w-full aspect-[3/4] bg-theme-text/5 relative overflow-hidden mb-6 border border-theme-text/10 rounded-sm transition-colors">
        <img
          src={product.imageUrl}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${isSoldOut ? 'grayscale opacity-60' : ''}`}
          alt={product.name}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={index === 0 ? 'high' : 'auto'}
        />
        <div className="absolute top-6 left-6 font-display text-4xl font-black text-theme-text/30 transition-colors">
          {String(index + 1).padStart(2, '0')}
        </div>
        {isSoldOut && (
          <div className="absolute top-6 right-6 font-display text-xs font-bold uppercase tracking-widest text-white bg-theme-text/70 px-3 py-1 rounded-sm">
            已售完
          </div>
        )}
        <div className="absolute inset-0 bg-theme-text/0 group-hover:bg-theme-text/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all font-display font-bold uppercase tracking-widest bg-theme-bg px-6 py-3 text-theme-text text-sm rounded-sm">
            View Item
          </span>
        </div>
      </div>
      <div className="flex justify-between items-start gap-4 border-t border-theme-text/20 pt-4 transition-colors">
        <h3 className="font-serif font-black text-2xl text-theme-text transition-colors">{product.englishName}</h3>
        <span className="flex items-baseline gap-2 whitespace-nowrap">
          {hasDiscount && (
            <span className="font-display text-sm text-theme-text/40 line-through">
              NT$ {product.originalPrice!.toLocaleString()}
            </span>
          )}
          <span className="font-display font-bold text-xl text-brand-red">
            NT$ {product.price.toLocaleString()}
          </span>
        </span>
      </div>
    </button>
  );
}

export default function ProductGallery({ onSelectProduct }: ProductGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const { data: products, error, isLoading, reload } = useAsyncData(
    'products',
    (signal) => getProducts(undefined, { signal }),
    [],
  );

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;

  return (
    <div className="pt-[190px] md:pt-[190px] pb-24 min-h-screen flex flex-col bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="px-6 md:px-12 lg:px-20 mb-8 md:mb-12 flex justify-between items-end border-b border-theme-text/20 pb-6 md:pb-10 transition-colors">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-widest text-theme-text transition-colors">信仰好物 <span className="text-xl md:text-2xl font-display font-light text-theme-text/40 ml-4 tracking-widest uppercase">Product</span></h1>
        </div>
        <div className="hidden md:flex gap-4">
          <button type="button" onClick={() => galleryRef.current?.scrollBy({ left: -440, behavior: 'smooth' })} aria-label="Previous products" className="w-12 h-12 rounded-full border border-theme-text/30 flex items-center justify-center text-theme-text/60 hover:bg-theme-text hover:text-theme-bg hover:border-theme-text transition"><i className="fas fa-arrow-left" /></button>
          <button type="button" onClick={() => galleryRef.current?.scrollBy({ left: 440, behavior: 'smooth' })} aria-label="Next products" className="w-12 h-12 rounded-full border border-theme-text/30 flex items-center justify-center text-theme-text/60 hover:bg-theme-text hover:text-theme-bg hover:border-theme-text transition"><i className="fas fa-arrow-right" /></button>
        </div>
      </div>

      <div ref={galleryRef} className="gallery-track flex gap-6 md:gap-12 px-6 md:px-12 lg:px-20 pb-20 flex-grow items-center">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} onSelect={onSelectProduct} />
        ))}
        <div className="w-[10vw] md:w-[100px] flex-shrink-0" />
      </div>
    </div>
  );
}
