import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { NEWS_CATEGORIES } from './data/index';
import Header from './components/Header';
import HomeAccordion from './pages/HomeAccordion';
import { CartItem, Product } from './types';
import GlobalBottomAd from './components/GlobalBottomAd';
import SplashAd from './components/SplashAd';
import Footer from './components/Footer';
import { buildRouteUrl, readRoute, type AppRoute } from './routing';
import { readJsonStorage, writeJsonStorage } from './utils/storage';

const ProductGallery = lazy(() => import('./pages/ProductGallery'));
const CategoryList = lazy(() => import('./pages/CategoryList'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const SearchModal = lazy(() => import('./components/SearchModal'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const ActionPage = lazy(() => import('./pages/ActionPage'));
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
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage'));
const TagResultsPage = lazy(() => import('./pages/TagResultsPage'));
const AuthorResultsPage = lazy(() => import('./pages/AuthorResultsPage'));
const PaymentResultPage = lazy(() => import('./pages/PaymentResultPage'));

const SPECIAL_CATEGORIES = new Set([
  '首頁', '信仰好物', '訂報', '奉獻', '會員中心', '會員招募', '會員專區', '活動報名',
  '關於我們', '新聞連絡', '我要投稿', '版權隱私權聲明', '財務報表', '客戶服務',
  '申請合作', '論壇Line貼圖', '祝福卡申辦/捐款',
]);

const getBrowserRoute = () => readRoute(typeof window === 'undefined' ? '' : window.location.search);

const isCartItems = (value: unknown): value is CartItem[] => Array.isArray(value) && value.every((item) => {
  if (typeof item !== 'object' || item === null) return false;
  const candidate = item as Partial<CartItem>;
  return Number.isInteger(candidate.quantity) && (candidate.quantity ?? 0) > 0 && (candidate.quantity ?? 0) <= 99
    && typeof candidate.product === 'object' && candidate.product !== null
    && Number.isInteger(candidate.product.id)
    && typeof candidate.product.name === 'string'
    && typeof candidate.product.price === 'number';
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
    paymentType,
    paymentReference,
  } = route;
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      return readJsonStorage(localStorage, 'impact_cart', [], isCartItems);
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

  const addToCart = (product: Product, quantity: number) => {
    const safeQuantity = Math.max(1, Math.min(99, Math.trunc(quantity)));
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(99, item.quantity + safeQuantity) }
            : item
        );
      }
      return [...prev, { product, quantity: safeQuantity }];
    });
    // Automatically open the cart drawer when a new item is added!
    setHasOpenedCart(true);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, qty: number) => {
    const safeQuantity = Math.max(1, Math.min(99, Math.trunc(qty)));
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: safeQuantity } : item
      )
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
  const { user, refreshUser } = useAuth();

  // Re-check auth state after navigation (e.g. after login redirects back)
  useEffect(() => {
    refreshUser();
  }, [currentCategory, refreshUser]);

  const goToCategory = (cat: string, options?: { register?: boolean }) => {
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
    });
    if (nextUrl !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', nextUrl);
    }

    setRoute({ category: cat, articleId: null, tag: null, author: null, planId: null, productId: null });
    if (cat === '會員中心') {
      setLoginPageDefaultRegister(!!options?.register);
    }
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
          <ColumnPage openArticle={openArticle} />
        )}

        {currentCategory === '影響力聯盟' && !currentArticleId && !currentTag && !currentAuthor && (
          <ImpactAlliancePage openArticle={openArticle} />
        )}

        {currentCategory === '信仰知識庫' && !currentArticleId && !currentTag && !currentAuthor && (
          <KnowledgeBasePage />
        )}

        {NEWS_CATEGORIES.includes(currentCategory) && !currentArticleId && !currentTag && !currentAuthor && currentCategory !== '專欄' && currentCategory !== '影響力聯盟' && currentCategory !== '信仰知識庫' && (
          <CategoryList category={currentCategory} openArticle={openArticle} />
        )}

        {currentArticleId && (
          <ArticleDetail articleId={currentArticleId} openArticle={openArticle} goToCategory={goToCategory} goToTag={goToTag} goToAuthor={goToAuthor} />
        )}

        {(currentCategory === '信仰好物' && !currentProductId) && (
          <ProductGallery onSelectProduct={(productId) => setRoute((current) => ({ ...current, productId }))} goToCategory={goToCategory} />
        )}

        {(currentCategory === '信仰好物' && currentProductId) && (
          <ProductDetail 
            productId={currentProductId} 
            onBack={() => { setRoute((current) => ({ ...current, productId: null })); window.scrollTo(0, 0); }}
            onAddToCart={addToCart}
          />
        )}

        {(currentCategory === '訂報') && (
          <ActionPage />
        )}

        {(currentCategory === '奉獻' && !currentPlanId) && (
          <DonationGallery openPlan={openPlan} />
        )}

        {(currentCategory === '奉獻' && currentPlanId) && (
          <DonationPlanDetail planId={currentPlanId} />
        )}

        {currentCategory === '會員中心' && (
          <LoginPage goToCategory={goToCategory} initialRegister={loginPageDefaultRegister} />
        )}

        {currentCategory === '會員招募' && (
          <MembershipPage goToCategory={goToCategory} />
        )}

        {currentCategory === '會員專區' && (
          user
            ? <MemberDashboard goToCategory={goToCategory} />
            : <LoginPage goToCategory={goToCategory} />
        )}

        {currentCategory === '活動報名' && (
          <EventRegistrationPage goToCategory={goToCategory} />
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

      {!['訂報', '奉獻', '信仰好物', '會員中心', '會員招募', '會員專區', '活動報名', '關於我們', '新聞連絡', '我要投稿', '申請合作', '客戶服務', '論壇Line貼圖', '祝福卡申辦/捐款', '版權隱私權聲明', '財務報表'].includes(currentCategory) && (
        <GlobalBottomAd goToCategory={goToCategory} />
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
          />
        )}
      </Suspense>
    </div>
  );
}
