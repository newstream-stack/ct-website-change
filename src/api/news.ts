// → swap each function body to: return apiGet<T>('/api/news...')
import type { NewsItem } from '../types';
import { MOCK_NEWS } from '../data/index';
import contentData from '../data/content.json';

export { NEWS_CATEGORIES } from '../data/index';

const ARTICLE_TAGS: Record<number, string[]> = {
  1: ['Faith', 'Modern Society'],
  2: ['Modern Society'],
  7: ['Faith', 'Modern Society'],
  8: ['Faith'],
  9: ['Faith', 'Modern Society'],
  10: ['Faith', 'Modern Society'],
  11: ['Modern Society'],
  12: ['Faith', 'Modern Society'],
  13: ['Faith'],
  14: ['Faith', 'Modern Society'],
  24: ['Faith'],
  25: ['Faith'],
};

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

export function getArticleTags(article: NewsItem): string[] {
  return article.tags ?? ARTICLE_TAGS[article.id] ?? ['Faith'];
}

export function getNewsByTag(tag: string): NewsItem[] {
  return MOCK_NEWS.filter((article) => getArticleTags(article).some((articleTag) => articleTag.toLowerCase() === tag.toLowerCase()));
}

export function getNewsByAuthor(author: string): NewsItem[] {
  return MOCK_NEWS.filter((article) => article.author === author);
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
