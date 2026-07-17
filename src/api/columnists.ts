import type { Columnist } from '../types';
import { COLUMNISTS } from '../data/index';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isColumnist } from './validators';

// GET /api/columnists
// GET /api/columnists?subCategory={subCategory}
export async function getColumnists(subCategory?: string, options?: ApiRequestOptions): Promise<Columnist[]> {
  if (!USE_MOCK_API) {
    const query = subCategory ? `?subCategory=${encodeURIComponent(subCategory)}` : '';
    return assertApiData(
      await apiGet<unknown>(`/api/columnists${query}`, options),
      (value): value is Columnist[] => Array.isArray(value) && value.every(isColumnist),
      '專欄作者',
    );
  }
  if (!subCategory) return COLUMNISTS;
  return COLUMNISTS.filter((c) => c.subCategory === subCategory);
}
