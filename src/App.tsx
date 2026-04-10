import { useState, useEffect } from 'react';
import { NEWS_CATEGORIES } from './data';
import Header from './components/Header';
import FullscreenMenu from './components/FullscreenMenu';
import HomeAccordion from './components/HomeAccordion';
import CategoryList from './components/CategoryList';
import ArticleDetail from './components/ArticleDetail';
import ProductGallery from './components/ProductGallery';
import ActionPage from './components/ActionPage';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState('首頁');
  const [currentArticleId, setCurrentArticleId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const goToCategory = (cat: string) => {
    setCurrentArticleId(null);
    setCurrentCategory(cat);
    window.scrollTo(0, 0);
  };

  const openArticle = (id: number) => {
    setCurrentArticleId(id);
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

        {(currentCategory === '訂報' || currentCategory === '奉獻') && (
          <ActionPage category={currentCategory} />
        )}
      </main>
    </div>
  );
}
