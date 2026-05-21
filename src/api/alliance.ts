// → swap each function body to: return apiGet<T>('/api/alliance/...')
import type { AllianceMember, NewsItem } from '../types';
import { ALLIANCE_MEMBERS, MOCK_NEWS } from '../data/index';

// GET /api/alliance/members
export function getAllianceMembers(): AllianceMember[] {
  return ALLIANCE_MEMBERS;
}

// GET /api/alliance/articles?limit={limit}
export function getAllianceArticles(limit = 5): NewsItem[] {
  return MOCK_NEWS.filter((n) => n.category === '影響力聯盟').slice(0, limit);
}
