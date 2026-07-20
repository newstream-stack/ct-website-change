import type { AdItem } from '../types';
import { MOCK_ADS } from '../data/index';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isAdItem } from './validators';

type AdPlacement = 'header' | 'infeed' | 'inline' | 'sidebar' | 'accordion' | 'floating';

// GET /api/ads/{placement}
export async function getAd(placement: AdPlacement, options?: ApiRequestOptions): Promise<AdItem | undefined> {
  return USE_MOCK_API ? MOCK_ADS[placement] : assertApiData(await apiGet<unknown>(`/api/ads/${placement}`, options), isAdItem, '廣告');
}

// GET /api/ads/random
export async function getRandomAd(options?: ApiRequestOptions): Promise<AdItem | undefined> {
  if (!USE_MOCK_API) return assertApiData(await apiGet<unknown>('/api/ads/random', options), isAdItem, '廣告');
  const all = Object.values(MOCK_ADS);
  return all[Math.floor(Math.random() * all.length)];
}
