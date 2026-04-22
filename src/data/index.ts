import { NewsItem, AdItem, AllianceMember, Columnist } from '../types';
import newsData from './news.json';
import adsData from './ads.json';
import allianceMembersData from './alliance_members.json';
import columnistsData from './columnists.json';
import contentData from './content.json';

export const NEWS_CATEGORIES = ['最新文章', '基督教論壇報', '人物見證', '專欄', '影響力聯盟', '生活情報', '信仰知識庫'];

export const MOCK_NEWS: NewsItem[] = newsData as NewsItem[];

export const MOCK_ADS: Record<string, AdItem> = adsData as Record<string, AdItem>;

export const dummyContentPart1 = contentData.dummyContentPart1;
export const dummyContentPart2 = contentData.dummyContentPart2;

export const ALLIANCE_MEMBERS: AllianceMember[] = allianceMembersData as AllianceMember[];

export const COLUMNISTS: Columnist[] = columnistsData as Columnist[];
