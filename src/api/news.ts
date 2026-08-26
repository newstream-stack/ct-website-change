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

// GET /api/news/popular?category={category}&limit={limit}
// mock 沒有瀏覽數，用 id 反序當作「較新＝較熱門」的替身，重點是別跟分類列表同序、
// 讓側欄看起來只是把左邊前五篇再貼一次。真後端請改用實際點閱排行。
export async function getPopularNews(category?: string, limit = 5, options?: ApiRequestOptions): Promise<NewsItem[]> {
  if (!USE_MOCK_API) {
    const query = new URLSearchParams({ limit: String(limit) });
    if (category) query.set('category', category);
    return assertApiData(await apiGet<unknown>(`/api/news/popular?${query}`, options), isNewsItems, '熱門文章');
  }
  return MOCK_NEWS
    .filter((news) => !category || news.category === category)
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, limit);
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
  if (!USE_MOCK_API) {
    return assertApiData(await apiGet<unknown>(`/api/news/${id}/recommended?limit=${limit}`, options), isNewsItems, '推薦文章');
  }
  // 原本是 filter(id !== 自己).slice(0, limit)，等於不管讀哪一篇都推薦同樣的頭幾篇。
  // mock 沒有內容相似度可算，改成「同子分類 → 同分類 → 同作者 → 其餘」的優先序，
  // 至少推薦得跟當前文章有關。真後端請換成實際的相關度/推薦模型。
  const current = MOCK_NEWS.find((news) => news.id === id);
  if (!current) return MOCK_NEWS.slice(0, limit);

  const rank = (news: NewsItem): number => {
    if (current.subCategory && news.subCategory === current.subCategory) return 0;
    if (news.category === current.category) return 1;
    if (news.author === current.author) return 2;
    return 3;
  };
  return MOCK_NEWS
    .filter((news) => news.id !== id)
    .map((news, index) => ({ news, rank: rank(news), index }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.news);
}

export async function getArticleContent(id: number, options?: ApiRequestOptions): Promise<{ part1: string; part2: string }> {
  if (USE_MOCK_API) return { part1: contentData.dummyContentPart1, part2: contentData.dummyContentPart2 };
  return assertApiData(
    await apiGet<unknown>(`/api/news/${id}/content`, options),
    (value): value is { part1: string; part2: string } => isRecord(value) && typeof value.part1 === 'string' && typeof value.part2 === 'string',
    '文章內容',
  );
}
