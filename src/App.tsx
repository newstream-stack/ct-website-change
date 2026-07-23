import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { NEWS_CATEGORIES } from './data/index';
import Header from './components/Header';
import HomeAccordion from './pages/HomeAccordion';
import { CartItem, Product } from './types';
import FloatingImageAd from './components/FloatingImageAd';
import FloatingDonateButton from './components/FloatingDonateButton';
import SplashAd from './components/SplashAd';
import Footer from './components/Footer';
import { buildRouteUrl, readRoute, type AppRoute } from './routing';
import { backfillLegacyProductStock, readJsonStorage, writeJsonStorage } from './utils/storage';

const ProductGallery = lazy(() => import('./pages/ProductGallery'));
const CategoryList = lazy(() => import('./pages/CategoryList'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const SearchModal = lazy(() => import('./components/SearchModal'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const DonationGallery = lazy(() => import('./pages/DonationGallery'));
const DonationPlanDetail = lazy(() => import('./components/DonationPlanDetail'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const EventRegistrationPage = lazy(() => import('./pages/EventRegistrationPage'));
const ColumnPage = lazy(() => import('./components/ColumnPage'));
const ImpactAlliancePage = lazy(() => import('./pages/ImpactAlliancePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SubmitPage = lazy(() => import('./pages/SubmitPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const FinancialPage = lazy(() => import('./pages/FinancialPage'));
const CustomerServicePage = lazy(() => import('./pages/CustomerServicePage'));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage'));
const LineStickersPage = lazy(() => import('./pages/LineStickersPage'));
const BlessingCardPage = lazy(() => import('./pages/BlessingCardPage'));
const TagResultsPage = lazy(() => import('./pages/TagResultsPage'));
const AuthorResultsPage = lazy(() => import('./pages/AuthorResultsPage'));
const PaymentResultPage = lazy(() => import('./pages/PaymentResultPage'));
const EpaperPage = lazy(() => import('./pages/EpaperPage'));

const BOTTOM_AD_EXCLUDED_CATEGORIES = ['奉獻', '信仰好物', '會員中心', '會員招募', '會員專區', '活動報名', '全版閱讀', '關於我們', '新聞連絡', '我要投稿', '申請合作', '客戶服務', '論壇Line貼圖', '祝福卡申辦/捐款', '版權隱私權聲明', '財務報表'];

const SPECIAL_CATEGORIES = new Set([
  '首頁', '信仰好物', '奉獻', '會員中心', '會員招募', '會員專區', '活動報名', '全版閱讀',
  '關於我們', '新聞連絡', '我要投稿', '版權隱私權聲明', '財務報表', '客戶服務',
  '申請合作', '論壇Line貼圖', '祝福卡申辦/捐款',
]);

const getBrowserRoute = () => readRoute(typeof window === 'undefined' ? '' : window.location.search);

const isCartItems = (value: unknown): value is CartItem[] => Array.isArray(value) && value.every((item) => {
  if (typeof item !== 'object' || item === null) return false;
  const candidate = item as Partial<CartItem>;
  return Number.isInteger(candidate.quantity) && (candidate.quantity ?? 0) > 0 && (candidate.quantity ?? 0) <= 999
    && (candidate.variant === undefined || typeof candidate.variant === 'string')
    && typeof candidate.product === 'object' && candidate.product !== null
    && Number.isInteger(candidate.product.id)
    && typeof candidate.product.name === 'string'
    && typeof candidate.product.price === 'number'
    && Number.isInteger(candidate.product.stock) && (candidate.product.stock ?? -1) >= 0;
});

function RouteFallback() {
  return (
    <div className="min-h-[100dvh] pt-[190px] md:pt-32 flex items-center justify-center bg-theme-bg text-theme-text">
      <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-theme-text/50">
        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
        Loading
      </div>
    </div>
  );
}

function NotFoundPage({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="min-h-[100dvh] pt-[190px] pb-24 flex items-center justify-center bg-theme-bg text-theme-text px-6">
      <div className="text-center">
        <p className="font-display text-brand-red text-sm tracking-[0.3em] font-bold mb-3">404</p>
        <h1 className="font-serif text-3xl font-black mb-4">找不到這個頁面</h1>
        <button type="button" onClick={onGoHome} className="bg-brand-red text-white px-7 py-3 text-sm font-bold tracking-widest">回到首頁</button>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(getBrowserRoute);
  const {
    category: currentCategory,
    articleId: currentArticleId,
    tag: currentTag,
    author: currentAuthor,
    planId: currentPlanId,
    productId: currentProductId,
    subCategory: currentSubCategory,
    paymentType,
    paymentReference,
  } = route;
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      return readJsonStorage(localStorage, 'impact_cart', [], isCartItems, backfillLegacyProductStock);
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasOpenedCart, setHasOpenedCart] = useState(false);
  const [hasOpenedSearch, setHasOpenedSearch] = useState(false);

  // Save cart to local storage when it changes
  useEffect(() => {
    writeJsonStorage(localStorage, 'impact_cart', cartItems);
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, variant?: string) => {
    const safeQuantity = Math.max(1, Math.min(product.stock, Math.trunc(quantity)));
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.variant === variant);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.variant === variant
            ? { ...item, quantity: Math.min(product.stock, item.quantity + safeQuantity) }
            : item
        );
      }
      return [...prev, { product, quantity: safeQuantity, variant }];
    });
    // Automatically open the cart drawer when a new item is added!
    setHasOpenedCart(true);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, variant?: string) => {
    setCartItems((prev) => prev.filter((item) => !(item.product.id === productId && item.variant === variant)));
  };

  const updateCartQuantity = (productId: number, qty: number, variant?: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId || item.variant !== variant) return item;
        const safeQuantity = Math.max(1, Math.min(item.product.stock, Math.trunc(qty)));
        return { ...item, quantity: safeQuantity };
      })
    );
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Sync state to URL
  useEffect(() => {
    const newUrl = buildRouteUrl(window.location.pathname, route);
    
    // Only pushstate if URL actually changed
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', newUrl);
    }
  }, [route]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setRoute(readRoute(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [loginPageDefaultRegister, setLoginPageDefaultRegister] = useState(false);
  const [preLoginRoute, setPreLoginRoute] = useState<AppRoute | null>(null);
  const { user, refreshUser } = useAuth();

  // Re-check auth state after navigation (e.g. after login redirects back)
  useEffect(() => {
    refreshUser();
  }, [currentCategory, refreshUser]);

  const goToCategory = (cat: string, options?: { register?: boolean; subCategory?: string }) => {
    // Update the route as part of the navigation event.  Relying solely on the
    // state-sync effect leaves a short interval where a header click can be
    // followed by the old (home) route being rendered again.
    const nextUrl = buildRouteUrl(window.location.pathname, {
      category: cat,
      articleId: null,
      tag: null,
      author: null,
      planId: null,
      productId: null,
      subCategory: options?.subCategory ?? null,
    });
    if (nextUrl !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', nextUrl);
    }

    if (cat === '會員中心' && route.category !== '會員中心') {
      setPreLoginRoute(route);
      setLoginPageDefaultRegister(!!options?.register);
    }

    setRoute({ category: cat, articleId: null, tag: null, author: null, planId: null, productId: null, subCategory: options?.subCategory ?? null });
    window.scrollTo(0, 0);
  };

  const returnAfterLogin = () => {
    const target: AppRoute = preLoginRoute && preLoginRoute.category !== '會員中心' && preLoginRoute.category !== '會員招募'
      ? preLoginRoute
      : { category: '會員專區', articleId: null, tag: null, author: null, planId: null, productId: null };

    const nextUrl = buildRouteUrl(window.location.pathname, target);
    if (nextUrl !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', nextUrl);
    }

    setRoute(target);
    setPreLoginRoute(null);
    window.scrollTo(0, 0);
  };

  const openArticle = (id: number) => {
    setRoute((current) => ({ ...current, articleId: id, tag: null, author: null, planId: null, productId: null }));
    window.scrollTo(0, 0);
  };

  const goToTag = (tag: string) => {
    setRoute({ category: '最新文章', articleId: null, tag, author: null, planId: null, productId: null });
    window.scrollTo(0, 0);
  };

  const goToAuthor = (author: string) => {
    setRoute({ category: '最新文章', articleId: null, tag: null, author, planId: null, productId: null });
    window.scrollTo(0, 0);
  };

  const openPlan = (id: number) => {
    setRoute((current) => ({ ...current, planId: id }));
    window.scrollTo(0, 0);
  };

  const showCategoryBar = (currentCategory === '首頁' || NEWS_CATEGORIES.includes(currentCategory) || !!currentArticleId);
  const isUnknownRoute = !currentArticleId && !currentTag && !currentAuthor
    && !paymentType && !NEWS_CATEGORIES.includes(currentCategory) && !SPECIAL_CATEGORIES.has(currentCategory);

  return (
    <div className="font-sans relative">
      <SplashAd linkUrl="https://www.ct.org.tw" />
      <Header
        user={user}
        goToCategory={goToCategory} 
        showCategoryBar={showCategoryBar} 
        cartItems={cartItems}
        onOpenCart={() => { setHasOpenedCart(true); setIsCartOpen(true); }}
        onOpenSearch={() => { setHasOpenedSearch(true); setIsSearchOpen(true); }}
      />


      <main className="w-full min-h-[100dvh] page-transition" key={`${currentCategory}-${currentArticleId}-${currentTag}-${currentAuthor}`}>
        <Suspense fallback={<RouteFallback />}>
        {currentAuthor && !currentArticleId && (
          <AuthorResultsPage author={currentAuthor} openArticle={openArticle} />
        )}

        {currentTag && !currentAuthor && !currentArticleId && (
          <TagResultsPage tag={currentTag} openArticle={openArticle} />
        )}

        {currentCategory === '首頁' && !currentArticleId && !currentTag && !currentAuthor && (
          <HomeAccordion openArticle={openArticle} />
        )}

        {currentCategory === '專欄' && !currentArticleId && !currentTag && !currentAuthor && (
          <ColumnPage openArticle={openArticle} initialSubCategory={currentSubCategory} />
        )}

        {currentCategory === '影響力聯盟' && !currentArticleId && !currentTag && !currentAuthor && (
          <ImpactAlliancePage openArticle={openArticle} />
        )}

        {NEWS_CATEGORIES.includes(currentCategory) && !currentArticleId && !currentTag && !currentAuthor && currentCategory !== '專欄' && currentCategory !== '影響力聯盟' && (
          <CategoryList category={currentCategory} openArticle={openArticle} initialSubCategory={currentSubCategory} />
        )}

        {currentArticleId && (
          <ArticleDetail articleId={currentArticleId} openArticle={openArticle} goToCategory={goToCategory} goToTag={goToTag} goToAuthor={goToAuthor} />
        )}

        {(currentCategory === '信仰好物' && !currentProductId) && (
          <ProductGallery onSelectProduct={(productId) => setRoute((current) => ({ ...current, productId }))} />
        )}

        {(currentCategory === '信仰好物' && currentProductId) && (
          <ProductDetail
            productId={currentProductId}
            onBack={() => { setRoute((current) => ({ ...current, productId: null })); window.scrollTo(0, 0); }}
            onAddToCart={addToCart}
            onSelectProduct={(productId) => { setRoute((current) => ({ ...current, productId })); window.scrollTo(0, 0); }}
          />
        )}

        {(currentCategory === '奉獻' && !currentPlanId) && (
          <DonationGallery openPlan={openPlan} />
        )}

        {(currentCategory === '奉獻' && currentPlanId) && (
          <DonationPlanDetail planId={currentPlanId} />
        )}

        {currentCategory === '會員中心' && (
          <LoginPage onLoginSuccess={returnAfterLogin} initialRegister={loginPageDefaultRegister} />
        )}

        {currentCategory === '會員招募' && (
          <MembershipPage goToCategory={goToCategory} />
        )}

        {currentCategory === '會員專區' && (
          user
            ? <MemberDashboard goToCategory={goToCategory} />
            : <LoginPage onLoginSuccess={returnAfterLogin} />
        )}

        {currentCategory === '活動報名' && (
          <EventRegistrationPage goToCategory={goToCategory} />
        )}

        {currentCategory === '全版閱讀' && (
          <EpaperPage goToCategory={goToCategory} />
        )}

        {currentCategory === '關於我們' && (
          <AboutPage />
        )}

        {currentCategory === '新聞連絡' && (
          <ContactPage />
        )}

        {currentCategory === '我要投稿' && (
          <SubmitPage />
        )}

        {currentCategory === '版權隱私權聲明' && (
          <PrivacyPage />
        )}

        {currentCategory === '財務報表' && (
          <FinancialPage />
        )}

        {currentCategory === '客戶服務' && (
          <CustomerServicePage />
        )}

        {currentCategory === '申請合作' && (
          <PartnershipPage />
        )}

        {currentCategory === '論壇Line貼圖' && (
          <LineStickersPage />
        )}

        {currentCategory === '祝福卡申辦/捐款' && (
          <BlessingCardPage />
        )}

        {currentCategory === '付款結果' && paymentType && (
          <PaymentResultPage
            type={paymentType}
            reference={paymentReference ?? null}
            onOrderPaid={clearCart}
            goToCategory={goToCategory}
          />
        )}

        {isUnknownRoute && <NotFoundPage onGoHome={() => goToCategory('首頁')} />}
        </Suspense>
      </main>

      <Footer goToCategory={goToCategory} />

      {!BOTTOM_AD_EXCLUDED_CATEGORIES.includes(currentCategory) && (
        <>
          <FloatingImageAd />
          <FloatingDonateButton goToCategory={goToCategory} />
        </>
      )}

      <Suspense fallback={null}>
        {hasOpenedCart && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
            onClearCart={clearCart}
          />
        )}

        {hasOpenedSearch && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectArticle={(id) => {
              openArticle(id);
            }}
            onSelectProduct={(id) => {
              setRoute({ category: '信仰好物', articleId: null, tag: null, author: null, planId: null, productId: id });
              window.scrollTo(0, 0);
            }}
            goToCategory={goToCategory}
          />
        )}
      </Suspense>
    </div>
  );
}
