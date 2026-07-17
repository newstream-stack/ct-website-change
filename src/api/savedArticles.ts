import { apiDel, apiGet, apiPost, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { MOCK_NEWS } from '../data/index';
import type { NewsItem } from '../types/news';
import { readJsonStorage, writeJsonStorage } from '../utils/storage';
import { assertApiData, isNewsItems, isRecord } from './validators';

const GUEST_SAVED_KEY = 'impact_saved_articles';

function readGuestSavedIds(): number[] {
  return readJsonStorage(localStorage, GUEST_SAVED_KEY, [], (value): value is number[] => (
    Array.isArray(value) && value.every((id) => Number.isInteger(id) && id > 0)
  ));
}

function writeGuestSavedIds(ids: number[]) {
  writeJsonStorage(localStorage, GUEST_SAVED_KEY, [...new Set(ids)]);
}

function useLocalSavedArticles(isLoggedIn: boolean) {
  return USE_MOCK_API || !isLoggedIn;
}

export async function getSavedArticles(
  isLoggedIn: boolean,
  options?: ApiRequestOptions,
): Promise<NewsItem[]> {
  if (!useLocalSavedArticles(isLoggedIn)) {
    return assertApiData(await apiGet<unknown>('/api/me/saved-articles', options), isNewsItems, '收藏文章');
  }
  const ids = new Set(readGuestSavedIds());
  return MOCK_NEWS.filter((article) => ids.has(article.id));
}

export async function getArticleSavedStatus(
  articleId: number,
  isLoggedIn: boolean,
  options?: ApiRequestOptions,
): Promise<boolean> {
  if (!useLocalSavedArticles(isLoggedIn)) {
    const response = assertApiData(
      await apiGet<unknown>(`/api/me/saved-articles/${articleId}/status`, options),
      (value): value is { saved: boolean } => isRecord(value) && typeof value.saved === 'boolean',
      '收藏狀態',
    );
    return response.saved;
  }
  return readGuestSavedIds().includes(articleId);
}

export async function saveArticle(articleId: number, isLoggedIn: boolean): Promise<void> {
  if (!useLocalSavedArticles(isLoggedIn)) {
    await apiPost<void>('/api/me/saved-articles', { articleId });
    return;
  }
  writeGuestSavedIds([...readGuestSavedIds(), articleId]);
}

export async function removeSavedArticle(articleId: number, isLoggedIn: boolean): Promise<void> {
  if (!useLocalSavedArticles(isLoggedIn)) {
    await apiDel<void>(`/api/me/saved-articles/${articleId}`);
    return;
  }
  writeGuestSavedIds(readGuestSavedIds().filter((id) => id !== articleId));
}
