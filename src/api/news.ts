// → swap each function body to: return apiGet<T>('/api/news...')
import type { NewsItem } from '../types';
import { MOCK_NEWS } from '../data/index';
import contentData from '../data/content.json';

export { NEWS_CATEGORIES } from '../data/index';

// GET /api/news
export function getNewsList(): NewsItem[] {
  return MOCK_NEWS;
}

// GET /api/news?category={category}
export function getNewsByCategory(category: string): NewsItem[] {
  return MOCK_NEWS.filter((n) => n.category === category);
}

// GET /api/news/{id}
export function getArticle(id: number): NewsItem | undefined {
  return MOCK_NEWS.find((n) => n.id === id);
}

// GET /api/news/{id}/recommended
export function getRecommended(id: number, limit = 4): NewsItem[] {
  return MOCK_NEWS.filter((n) => n.id !== id).slice(0, limit);
}

// GET /api/news/{id}/content  (full HTML body, currently shared placeholder)
export function getArticleContent(): { part1: string; part2: string } {
  return {
    part1: contentData.dummyContentPart1,
    part2: contentData.dummyContentPart2,
  };
}
