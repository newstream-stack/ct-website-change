import type { KnowledgeArticle } from '../types/knowledgeBase';

// The knowledge base is a closed historical archive (2007-2018) — every
// year in it requires an active subscription, unlike the ongoing news feed
// (2019-present) which is free.
export const EARLIEST_ARCHIVE_YEAR = 2007;
export const LATEST_ARCHIVE_YEAR = 2018;

export const ARCHIVE_YEARS = Array.from(
  { length: LATEST_ARCHIVE_YEAR - EARLIEST_ARCHIVE_YEAR + 1 },
  (_, i) => LATEST_ARCHIVE_YEAR - i,
);

export const MOCK_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 1,
    year: 2018,
    date: '2018-10-17',
    source: 'IMPACT x Malaysia',
    author: '馬來西亞IAA',
    title: '讓Z世代在創新中找到歸屬感！陳南權牧師：事工鐵三角牧養助青年門徒紮根',
    href: 'https://ct.org.tw/html/news/3-3.php?article=1396835&cat=10',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 2,
    year: 2015,
    date: '2015-02-25',
    source: '基督教論壇報',
    author: '記者李容珍',
    title: '俄烏戰火升高　烏克蘭俄羅斯眾召會和當地福音機構為兩國人民、宣教士守望禱告',
    href: 'https://ct.org.tw/html/news/3-3.php?article=1389507&cat=10',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 3,
    year: 2011,
    date: '2011-02-26',
    source: '基督教論壇報',
    author: '論壇報編採',
    title: '論壇報全新改版！再現文字美學深度　重拾讀報好心情',
    href: 'https://ct.org.tw/html/news/3-3.php?article=1379506&cat=12',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 4,
    year: 2007,
    date: '2007-06-14',
    source: '基督教論壇報',
    author: '記者林亞歆',
    title: '〖願為風的翅膀傳福音到地極〗論壇報55週年 成立亞洲論壇影響力中心',
    href: 'https://ct.org.tw/html/news/3-3.php?article=1368725&cat=10',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1200',
  },
];
