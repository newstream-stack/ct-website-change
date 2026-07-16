export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  content?: string;
  subCategory?: string;
  tags?: string[];
}

export interface AdItem {
  id: string;
  sponsor: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface Columnist {
  id: string;
  name: string;
  avatarUrl: string;
  subCategory: string;
  latestArticleTitle: string;
  latestArticleDate: string;
  latestArticleId: number;
}

export interface AllianceMember {
  id: string;
  name: string;
  logoUrl: string;
  latestArticleTitle: string;
  latestArticleDate: string;
  latestArticleId: number;
}

export interface ActionPlan {
  id: string;
  title: string;
  subtitle?: string;
  price?: string;
  description: string;
  isPremium?: boolean;
  variant: 'subscription' | 'donation';
}
