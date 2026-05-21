// → swap each function body to: return apiGet<T>('/api/home/...')
import { FEATURED_VIDEOS, ACCORDION_AD } from '../mocks/accordionPanels';

export type { FeaturedVideo, FeaturedAd } from '../mocks/accordionPanels';

// GET /api/home/featured-videos
export function getFeaturedVideos() {
  return FEATURED_VIDEOS;
}

// GET /api/home/accordion-ad
export function getAccordionAd() {
  return ACCORDION_AD;
}
