import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { NEWS_CATEGORIES } from './data/index';
import Header from './components/Header';
import HomeAccordion from './pages/HomeAccordion';
import CategoryList from './pages/CategoryList';
import ArticleDetail from './pages/ArticleDetail';
import ProductGallery from './pages/ProductGallery';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import { CartItem, Product } from './types';
import ActionPage from './pages/ActionPage';
import DonationGallery from './pages/DonationGallery';
import DonationPlanDetail from './components/DonationPlanDetail';
import GlobalBottomAd from './components/GlobalBottomAd';
import LoginPage from './pages/LoginPage';
import MembershipPage from './pages/MembershipPage';
import MemberDashboard from './pages/MemberDashboard';
import EventRegistrationPage from './pages/EventRegistrationPage';
import ColumnPage from './components/ColumnPage';
import ImpactAlliancePage from './pages/ImpactAlliancePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SubmitPage from './pages/SubmitPage';
import PrivacyPage from './pages/PrivacyPage';
import FinancialPage from './pages/FinancialPage';
import CustomerServicePage from './pages/CustomerServicePage';
import PartnershipPage from './pages/PartnershipPage';
import LineStickersPage from './pages/LineStickersPage';
import BlessingCardPage from './pages/BlessingCardPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import TagResultsPage from './pages/TagResultsPage';
import AuthorResultsPage from './pages/AuthorResultsPage';
import SplashAd from './components/SplashAd';
import Footer from './components/Footer';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('category') || '首頁';
    }
    return '首頁';
  });
  
  const [currentArticleId, setCurrentArticleId] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const article = params.get('article');
      return article ? parseInt(article, 10) : null;
    }
    return null;
  });

  const [currentTag, setCurrentTag] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('tag');
    }
    return null;
  });

  const [currentAuthor, setCurrentAuthor] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('author');
    }
    return null;
  });

  const [currentPlanId, setCurrentPlanId] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get('plan');
      return plan ? parseInt(plan, 10) : null;
    }
    return null;
  });

  const [currentProductId, setCurrentProductId] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const product = params.get('product');
      return product ? parseInt(product, 10) : null;
    }
    return null;
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('impact_cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Save cart to local storage when it changes
  useEffect(() => {
    localStorage.setItem('impact_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    // Automatically open the cart drawer when a new item is added!
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentCategory !== '首頁') {
      params.set('category', currentCategory);
    }
    if (currentArticleId !== null) {
      params.set('article', currentArticleId.toString());
    }
    if (currentTag) {
      params.set('tag', currentTag);
    }
    if (currentAuthor) {
      params.set('author', currentAuthor);
    }
    if (currentPlanId !== null) {
      params.set('plan', currentPlanId.toString());
    }
    if (currentProductId !== null) {
      params.set('product', currentProductId.toString());
    }
    
    const queryString = params.toString();
    const newUrl = `${window.location.pathname}${queryString ? '?' + queryString : ''}`;
    
    // Only pushstate if URL actually changed
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', newUrl);
    }
  }, [currentCategory, currentArticleId, currentPlanId, currentProductId, currentTag, currentAuthor]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentCategory(params.get('category') || '首頁');
      const article = params.get('article');
      setCurrentArticleId(article ? parseInt(article, 10) : null);
      setCurrentTag(params.get('tag'));
      setCurrentAuthor(params.get('author'));
      const plan = params.get('plan');
      setCurrentPlanId(plan ? parseInt(plan, 10) : null);
      const product = params.get('product');
      setCurrentProductId(product ? parseInt(product, 10) : null);
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
    const params = new URLSearchParams();
    if (cat !== '首頁') params.set('category', cat);
    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    if (nextUrl !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', nextUrl);
    }

    setCurrentArticleId(null);
    setCurrentTag(null);
    setCurrentAuthor(null);
    setCurrentPlanId(null);
    setCurrentProductId(null);
    setCurrentCategory(cat);
    if (cat === '會員中心') {
      setLoginPageDefaultRegister(!!options?.register);
    }
    window.scrollTo(0, 0);
  };

  const openArticle = (id: number) => {
    setCurrentArticleId(id);
    window.scrollTo(0, 0);
  };

  const goToTag = (tag: string) => {
    setCurrentArticleId(null);
    setCurrentPlanId(null);
    setCurrentProductId(null);
    setCurrentCategory('最新文章');
    setCurrentTag(tag);
    setCurrentAuthor(null);
    window.scrollTo(0, 0);
  };

  const goToAuthor = (author: string) => {
    setCurrentArticleId(null);
    setCurrentPlanId(null);
    setCurrentProductId(null);
    setCurrentCategory('最新文章');
    setCurrentTag(null);
    setCurrentAuthor(author);
    window.scrollTo(0, 0);
  };

  const openPlan = (id: number) => {
    setCurrentPlanId(id);
    window.scrollTo(0, 0);
  };

  const showCategoryBar = (currentCategory === '首頁' || NEWS_CATEGORIES.includes(currentCategory) || !!currentArticleId);

  return (
    <div className="font-sans relative">
      <SplashAd linkUrl="https://www.ct.org.tw" />
      <Header
        user={user}
        goToCategory={goToCategory} 
        showCategoryBar={showCategoryBar} 
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />


      <main className="w-full min-h-[100dvh] page-transition" key={`${currentCategory}-${currentArticleId}-${currentTag}-${currentAuthor}`}>
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
          <ProductGallery onSelectProduct={setCurrentProductId} />
        )}

        {(currentCategory === '信仰好物' && currentProductId) && (
          <ProductDetail 
            productId={currentProductId} 
            onBack={() => { setCurrentProductId(null); window.scrollTo(0, 0); }} 
            onAddToCart={addToCart}
          />
        )}

        {(currentCategory === '訂報') && (
          <ActionPage category={currentCategory} />
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
          <MemberDashboard goToCategory={goToCategory} />
        )}

        {currentCategory === '活動報名' && (
          <EventRegistrationPage />
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
      </main>

      <Footer goToCategory={goToCategory} />

      {!['訂報', '奉獻', '信仰好物', '會員中心', '會員招募', '會員專區', '活動報名', '關於我們', '新聞連絡', '我要投稿', '申請合作', '客戶服務', '論壇Line貼圖', '祝福卡申辦/捐款', '版權隱私權聲明', '財務報表'].includes(currentCategory) && (
        <GlobalBottomAd goToCategory={goToCategory} />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        onRemoveItem={removeFromCart} 
        onUpdateQuantity={updateCartQuantity} 
        onClearCart={clearCart} 
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={(id) => {
          openArticle(id);
        }}
        onSelectProduct={(id) => {
          setCurrentArticleId(null);
          setCurrentPlanId(null);
          setCurrentCategory('信仰好物');
          setCurrentProductId(id);
          window.scrollTo(0, 0);
        }}
      />
    </div>
  );
}
