// → swap function body to: return apiGet<Columnist[]>('/api/columnists')
import type { Columnist } from '../types';
import { COLUMNISTS } from '../data/index';

// GET /api/columnists
// GET /api/columnists?subCategory={subCategory}
export function getColumnists(subCategory?: string): Columnist[] {
  if (!subCategory) return COLUMNISTS;
  return COLUMNISTS.filter((c) => c.subCategory === subCategory);
}
