/**
 * MOCK DATA — HomeAccordion panels (video + ad)
 * TODO: Replace with real API call → GET /api/home/featured
 */

export interface FeaturedVideo {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
  category: string;
  description: string;
}

export interface FeaturedAd {
  imageUrl: string;
  title: string;
  description: string;
  sponsor: string;
  link: string;
}

export const FEATURED_VIDEOS: FeaturedVideo[] = [
  {
    id: 'v1',
    title: '曠野中的重生',
    videoId: '2IvNbOhBPwA',
    thumbnail: 'https://img.youtube.com/vi/2IvNbOhBPwA/maxresdefault.jpg',
    category: '影片專區',
    description: '見證如何從曠野困境中找回重生的力量。',
  },
  {
    id: 'v2',
    title: '日出東方',
    videoId: 'ggy7Mu8tpXg',
    thumbnail: 'https://img.youtube.com/vi/ggy7Mu8tpXg/maxresdefault.jpg',
    category: '影片專區',
    description: '感受黎明升起的盼望與城市的光。',
  },
  {
    id: 'v3',
    title: '往水深之處',
    videoId: 'bph9clxfy3k',
    thumbnail: 'https://img.youtube.com/vi/bph9clxfy3k/maxresdefault.jpg',
    category: '影片專區',
    description: '前往水深之處，探索更多未知的福音契機。',
  },
];

export const ACCORDION_AD: FeaturedAd = {
  imageUrl: 'https://media.ct.org.tw/upload/news_article_cms/2026/04/20/90064_未命名-1.jpg',
  title: '曠野中的重生',
  description: '亞洲論壇影響力國際年會2026',
  sponsor: 'IMPACT',
  link: '/?category=奉獻',
};
