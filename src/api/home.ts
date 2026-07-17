import { FEATURED_VIDEOS, ACCORDION_AD } from '../mocks/accordionPanels';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import type { FeaturedAd, FeaturedVideo } from '../mocks/accordionPanels';
import { assertApiData, isFeaturedAd, isFeaturedVideo } from './validators';

export type { FeaturedVideo, FeaturedAd } from '../mocks/accordionPanels';

// GET /api/home/featured-videos
export async function getFeaturedVideos(options?: ApiRequestOptions): Promise<FeaturedVideo[]> {
  return USE_MOCK_API ? FEATURED_VIDEOS : assertApiData(
    await apiGet<unknown>('/api/home/featured-videos', options),
    (value): value is FeaturedVideo[] => Array.isArray(value) && value.every(isFeaturedVideo),
    '首頁影片',
  );
}

// GET /api/home/accordion-ad
export async function getAccordionAd(options?: ApiRequestOptions): Promise<FeaturedAd> {
  return USE_MOCK_API ? ACCORDION_AD : assertApiData(await apiGet<unknown>('/api/home/accordion-ad', options), isFeaturedAd, '首頁廣告');
}
