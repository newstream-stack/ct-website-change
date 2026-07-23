import type { KnowledgeArticle } from '../types/knowledgeBase';

// Knowledge base articles are a paid archive; unsubscribed callers must never
// receive a usable article URL in the API response — only the UI's lock
// affordance (redirect to '會員招募') should be reachable without a subscription.
export function redactLockedHref(article: KnowledgeArticle, isSubscribed: boolean): KnowledgeArticle {
  return isSubscribed ? article : { ...article, href: '' };
}
