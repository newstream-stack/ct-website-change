import type { KnowledgeArticle } from '../types/knowledgeBase';
import { MOCK_KNOWLEDGE_ARTICLES } from '../mocks/knowledgeBase';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isKnowledgeArticles } from './validators';
import { getStoredUser } from './auth';
import { getMe } from './member';
import { redactLockedHref } from '../utils/knowledgeBaseHref';

// There's no real backend yet (see docs/api-contract.md), so this API layer
// is the only thing standing between an unsubscribed visitor and a usable
// article URL — entitlement must be checked here, not left to the calling UI.
async function isSubscriber(options?: ApiRequestOptions): Promise<boolean> {
  if (!getStoredUser()) return false;
  const member = await getMe(options);
  return member.subscription.status === 'active';
}

export async function getKnowledgeArticles(year?: number, options?: ApiRequestOptions): Promise<KnowledgeArticle[]> {
  const isSubscribed = await isSubscriber(options);
  if (USE_MOCK_API) {
    const articles = year ? MOCK_KNOWLEDGE_ARTICLES.filter((article) => article.year === year) : MOCK_KNOWLEDGE_ARTICLES;
    return [...articles]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((article) => redactLockedHref(article, isSubscribed));
  }
  const query = year ? `?year=${year}` : '';
  const articles = assertApiData(await apiGet<unknown>(`/api/knowledge-base${query}`, options), isKnowledgeArticles, '信仰知識庫文章');
  return articles.map((article) => redactLockedHref(article, isSubscribed));
}

export async function searchKnowledgeBase(query: string, year?: number, limit = 5, options?: ApiRequestOptions): Promise<KnowledgeArticle[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-TW');
  if (!normalizedQuery || limit <= 0) return [];

  const isSubscribed = await isSubscriber(options);

  if (!USE_MOCK_API) {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    if (year) params.set('year', String(year));
    const articles = assertApiData(await apiGet<unknown>(`/api/knowledge-base/search?${params}`, options), isKnowledgeArticles, '信仰知識庫搜尋');
    return articles.map((article) => redactLockedHref(article, isSubscribed));
  }

  return MOCK_KNOWLEDGE_ARTICLES
    .filter((article) => !year || article.year === year)
    .filter((article) =>
      [article.title, article.source, article.author]
        .some((value) => value.toLocaleLowerCase('zh-TW').includes(normalizedQuery)),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((article) => redactLockedHref(article, isSubscribed));
}
