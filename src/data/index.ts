import { NewsItem, AdItem, AllianceMember, Columnist, Product } from '../types';
import newsData from './news.json';
import adsData from './ads.json';
import allianceMembersData from './alliance_members.json';
import columnistsData from './columnists.json';
import productsData from './products.json';

export const NEWS_CATEGORIES = ['最新文章', '基督教論壇報', '人物見證', '專欄', '影響力聯盟', '生活情報'];

export const MOCK_NEWS: NewsItem[] = newsData as NewsItem[];

export const MOCK_ADS: Record<string, AdItem> = adsData as Record<string, AdItem>;

export const ALLIANCE_MEMBERS: AllianceMember[] = allianceMembersData as AllianceMember[];

export const COLUMNISTS: Columnist[] = columnistsData as Columnist[];

export const MOCK_PRODUCTS: Product[] = productsData as Product[];
