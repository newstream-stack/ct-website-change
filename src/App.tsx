import { useState, useEffect } from 'react';
import { NEWS_CATEGORIES } from './data';
import Header from './components/Header';
import FullscreenMenu from './components/FullscreenMenu';
import HomeAccordion from './components/HomeAccordion';
import CategoryList from './components/CategoryList';
import ArticleDetail from './components/ArticleDetail';
import ProductGallery from './components/ProductGallery';
import ActionPage from './components/ActionPage';
import DonationGallery from './components/DonationGallery';
import DonationPlanDetail from './components/DonationPlanDetail';
import GlobalBottomAd from './components/GlobalBottomAd';
import LoginPage from './components/LoginPage';
import MembershipPage from './components/MembershipPage';

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

  const [currentPlanId, setCurrentPlanId] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get('plan');
      return plan ? parseInt(plan, 10) : null;
    }
    return null;
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentCategory !== '首頁') {
      params.set('category', currentCategory);
    }
    if (currentArticleId !== null) {
      params.set('article', currentArticleId.toString());
    }
    if (currentPlanId !== null) {
      params.set('plan', currentPlanId.toString());
    }
    
    const queryString = params.toString();
    const newUrl = `${window.location.pathname}${queryString ? '?' + queryString : ''}`;
    
    // Only pushstate if URL actually changed
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.pushState({}, '', newUrl);
    }
  }, [currentCategory, currentArticleId, currentPlanId]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentCategory(params.get('category') || '首頁');
      const article = params.get('article');
      setCurrentArticleId(article ? parseInt(article, 10) : null);
      const plan = params.get('plan');
      setCurrentPlanId(plan ? parseInt(plan, 10) : null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const goToCategory = (cat: string) => {
    setCurrentArticleId(null);
    setCurrentPlanId(null);
    setCurrentCategory(cat);
    window.scrollTo(0, 0);
  };

  const openArticle = (id: number) => {
    setCurrentArticleId(id);
    window.scrollTo(0, 0);
  };

  const openPlan = (id: number) => {
    setCurrentPlanId(id);
    window.scrollTo(0, 0);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const showCategoryBar = (currentCategory === '首頁' || NEWS_CATEGORIES.includes(currentCategory)) && !currentArticleId;

  return (
    <div className="font-sans relative">
      <Header 
        goToCategory={goToCategory} 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        setIsMenuOpen={setIsMenuOpen} 
        showCategoryBar={showCategoryBar} 
      />

      <FullscreenMenu 
        isOpen={isMenuOpen} 
        closeMenu={() => setIsMenuOpen(false)} 
        goToCategory={goToCategory} 
      />

      <main className="w-full min-h-[100dvh] page-transition" key={`${currentCategory}-${currentArticleId}`}>
        {currentCategory === '首頁' && !currentArticleId && (
          <HomeAccordion openArticle={openArticle} />
        )}

        {NEWS_CATEGORIES.includes(currentCategory) && !currentArticleId && (
          <CategoryList category={currentCategory} openArticle={openArticle} />
        )}

        {currentArticleId && (
          <ArticleDetail articleId={currentArticleId} openArticle={openArticle} goToCategory={goToCategory} />
        )}

        {currentCategory === '信仰好物' && (
          <ProductGallery />
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
          <LoginPage />
        )}

        {currentCategory === '會員招募' && (
          <MembershipPage />
        )}
      </main>

      {!['訂報', '奉獻', '信仰好物', '會員中心', '會員招募'].includes(currentCategory) && (
        <GlobalBottomAd />
      )}
    </div>
  );
}
