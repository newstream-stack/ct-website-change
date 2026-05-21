// → swap each function body to: return apiGet<T>('/api/ads...')
import type { AdItem } from '../types';
import { MOCK_ADS } from '../data/index';

type AdPlacement = 'header' | 'infeed' | 'inline' | 'sidebar' | 'accordion';

// GET /api/ads/{placement}
export function getAd(placement: AdPlacement): AdItem | undefined {
  return MOCK_ADS[placement];
}

// GET /api/ads/random
export function getRandomAd(): AdItem | undefined {
  const all = Object.values(MOCK_ADS);
  return all[Math.floor(Math.random() * all.length)];
}
