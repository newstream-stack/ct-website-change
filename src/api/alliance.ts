import type { AllianceMember, NewsItem } from '../types';
import { ALLIANCE_MEMBERS, MOCK_NEWS } from '../data/index';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isAllianceMember, isNewsItems } from './validators';

// GET /api/alliance/members
export async function getAllianceMembers(options?: ApiRequestOptions): Promise<AllianceMember[]> {
  return USE_MOCK_API ? ALLIANCE_MEMBERS : assertApiData(
    await apiGet<unknown>('/api/alliance/members', options),
    (value): value is AllianceMember[] => Array.isArray(value) && value.every(isAllianceMember),
    '聯盟成員',
  );
}

// GET /api/alliance/articles?limit={limit}
export async function getAllianceArticles(limit = 5, options?: ApiRequestOptions): Promise<NewsItem[]> {
  return USE_MOCK_API
    ? MOCK_NEWS.filter((n) => n.category === '影響力聯盟').slice(0, limit)
    : assertApiData(await apiGet<unknown>(`/api/alliance/articles?limit=${limit}`, options), isNewsItems, '聯盟文章');
}
