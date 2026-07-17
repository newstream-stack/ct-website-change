import type { NewsItem } from '../types';
import { MOCK_NEWS } from '../data/index';
import contentData from '../data/content.json';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isNewsItem, isNewsItems, isRecord } from './validators';

export { NEWS_CATEGORIES } from '../data/index';

const ARTICLE_TAGS: Record<number, string[]> = {
  1: ['Faith', 'Modern Society'], 2: ['Modern Society'], 7: ['Faith', 'Modern Society'],
  8: ['Faith'], 9: ['Faith', 'Modern Society'], 10: ['Faith', 'Modern Society'],
  11: ['Modern Society'], 12: ['Faith', 'Modern Society'], 13: ['Faith'],
  14: ['Faith', 'Modern Society'], 24: ['Faith'], 25: ['Faith'],
};

export async function getNewsList(options?: ApiRequestOptions): Promise<NewsItem[]> {
  return USE_MOCK_API ? MOCK_NEWS : assertApiData(await apiGet<unknown>('/api/news', options), isNewsItems, '新聞列表');
}

export async function getNewsByCategory(category: string, options?: ApiRequestOptions): Promise<NewsItem[]> {
  return USE_MOCK_API
    ? MOCK_NEWS.filter((news) => news.category === category)
    : assertApiData(await apiGet<unknown>(`/api/news?category=${encodeURIComponent(category)}`, options), isNewsItems, '分類新聞');
}

export async function getArticle(id: number, options?: ApiRequestOptions): Promise<NewsItem | undefined> {
  return USE_MOCK_API ? MOCK_NEWS.find((news) => news.id === id) : assertApiData(await apiGet<unknown>(`/api/news/${id}`, options), isNewsItem, '文章');
}

export function getArticleTags(article: NewsItem): string[] {
  return article.tags ?? ARTICLE_TAGS[article.id] ?? ['Faith'];
}

export async function getNewsByTag(tag: string, options?: ApiRequestOptions): Promise<NewsItem[]> {
  return USE_MOCK_API
    ? MOCK_NEWS.filter((article) => getArticleTags(article).some((articleTag) => articleTag.toLowerCase() === tag.toLowerCase()))
    : assertApiData(await apiGet<unknown>(`/api/news?tag=${encodeURIComponent(tag)}`, options), isNewsItems, '標籤文章');
}

export async function getNewsByAuthor(author: string, options?: ApiRequestOptions): Promise<NewsItem[]> {
  return USE_MOCK_API
    ? MOCK_NEWS.filter((article) => article.author === author)
    : assertApiData(await apiGet<unknown>(`/api/news?author=${encodeURIComponent(author)}`, options), isNewsItems, '作者文章');
}

export async function searchNews(query: string, limit = 5, options?: ApiRequestOptions): Promise<NewsItem[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-TW');
  if (!normalizedQuery || limit <= 0) return [];
  if (!USE_MOCK_API) return assertApiData(await apiGet<unknown>(`/api/news/search?q=${encodeURIComponent(query)}&limit=${limit}`, options), isNewsItems, '新聞搜尋');

  return MOCK_NEWS.filter((article) =>
    [article.title, article.category, article.excerpt, article.author]
      .filter((value): value is string => typeof value === 'string')
      .some((value) => value.toLocaleLowerCase('zh-TW').includes(normalizedQuery)),
  ).slice(0, limit);
}

export async function getRecommended(id: number, limit = 4, options?: ApiRequestOptions): Promise<NewsItem[]> {
  return USE_MOCK_API
    ? MOCK_NEWS.filter((news) => news.id !== id).slice(0, limit)
    : assertApiData(await apiGet<unknown>(`/api/news/${id}/recommended?limit=${limit}`, options), isNewsItems, '推薦文章');
}

export async function getArticleContent(id: number, options?: ApiRequestOptions): Promise<{ part1: string; part2: string }> {
  if (USE_MOCK_API) return { part1: contentData.dummyContentPart1, part2: contentData.dummyContentPart2 };
  return assertApiData(
    await apiGet<unknown>(`/api/news/${id}/content`, options),
    (value): value is { part1: string; part2: string } => isRecord(value) && typeof value.part1 === 'string' && typeof value.part2 === 'string',
    '文章內容',
  );
}
