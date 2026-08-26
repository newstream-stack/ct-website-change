import { getProducts } from '../api/products';
import type { Product } from '../types';
import { useAsyncData } from '../hooks/useAsyncData';
import AsyncPageState from '../components/AsyncPageState';

interface ProductGalleryProps {
  onSelectProduct: (id: number) => void;
  onAddToCart: (product: Product, quantity: number, variant?: string) => void;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onSelect: (id: number) => void;
  onAddToCart: (product: Product, quantity: number, variant?: string) => void;
}

const LOW_STOCK_THRESHOLD = 10;

function ProductCard({ product, index, onSelect, onAddToCart }: ProductCardProps) {
  const isSoldOut = product.stock <= 0;
  const isLowStock = !isSoldOut && product.stock <= LOW_STOCK_THRESHOLD;
  const hasDiscount = typeof product.originalPrice === 'number' && product.originalPrice > product.price;
  // 有規格的商品不能直接丟進購物車，要先到詳情頁選規格。
  const needsVariantChoice = Array.isArray(product.variants) && product.variants.length > 0;

  return (
    <div className="group flex flex-col border-t border-theme-text/15 pt-4">
      <button
        type="button"
        onClick={() => onSelect(product.id)}
        className="text-left cursor-pointer"
        aria-label={`查看 ${product.name}`}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-theme-text/5 mb-4">
          <img
            src={product.imageUrl}
            className={`w-full h-full object-cover ${isSoldOut ? 'grayscale opacity-60' : ''}`}
            alt={product.name}
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
          {hasDiscount && !isSoldOut && (
            <span className="absolute top-0 left-0 bg-brand-red text-white font-display text-[10px] font-bold tracking-widest uppercase px-2 py-1">
              特價
            </span>
          )}
          {isSoldOut && (
            <span className="absolute top-0 left-0 bg-theme-text text-theme-bg font-display text-[10px] font-bold tracking-widest uppercase px-2 py-1">
              已售完
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg md:text-xl font-bold leading-snug text-theme-text group-hover:text-brand-red transition-colors">
          {product.name}
        </h3>
        <p className="font-display text-[11px] uppercase tracking-[0.2em] text-theme-text/40 mt-1">
          {product.englishName}
        </p>
        <p className="text-sm text-theme-text/60 leading-relaxed line-clamp-2 mt-3">
          {product.description}
        </p>
      </button>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display font-bold text-xl text-brand-red">
          NT$ {product.price.toLocaleString()}
        </span>
        {hasDiscount && (
          <span className="font-display text-sm text-theme-text/40 line-through">
            NT$ {product.originalPrice!.toLocaleString()}
          </span>
        )}
      </div>

      <p className="mt-1 text-[11px] font-bold tracking-widest text-theme-text/45">
        {isSoldOut ? '目前缺貨' : isLowStock ? `僅剩 ${product.stock} 件` : '庫存充足'}
      </p>

      <button
        type="button"
        disabled={isSoldOut}
        onClick={() => (needsVariantChoice ? onSelect(product.id) : onAddToCart(product, 1))}
        className="mt-4 w-full py-3 text-sm font-bold tracking-widest border border-theme-text bg-theme-text text-theme-bg hover:bg-brand-red hover:border-brand-red transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-transparent disabled:text-theme-text/35 disabled:border-theme-text/15"
      >
        {isSoldOut ? '已售完' : needsVariantChoice ? '選購規格' : '加入購物車'}
      </button>
    </div>
  );
}

export default function ProductGallery({ onSelectProduct, onAddToCart }: ProductGalleryProps) {
  const { data: products, error, isLoading, reload } = useAsyncData(
    'products',
    (signal) => getProducts(undefined, { signal }),
    [],
  );

  if (isLoading) return <AsyncPageState />;
  if (error) return <AsyncPageState error={error} onRetry={reload} />;

  return (
    <div className="pt-[150px] md:pt-40 pb-24 min-h-screen bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-5 md:px-12 lg:px-20">
        <div className="mb-8 md:mb-12 flex flex-wrap items-baseline justify-between gap-3 border-b border-theme-text/15 pb-5 md:pb-6">
          <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-theme-text">
            信仰好物
            <span className="ml-3 md:ml-4 text-sm md:text-base font-display font-light text-theme-text/40 tracking-[0.25em] uppercase">Product</span>
          </h1>
          <p className="font-display text-xs tracking-widest text-theme-text/45">全部 {products.length} 件</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-x-10 lg:gap-y-12">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-theme-text/40 tracking-widest">目前沒有商品。</div>
        )}

        <p className="mt-12 md:mt-16 border-t border-theme-text/10 pt-5 text-xs text-theme-text/45 leading-relaxed">
          單筆訂單滿 NT$ 1,000 免運費，未達免運門檻酌收 NT$ 80 物流費。商品規格與出貨時間請見各商品頁說明。
        </p>
      </div>
    </div>
  );
}
