export interface AppRoute {
  category: string;
  articleId: number | null;
  tag: string | null;
  author: string | null;
  planId: number | null;
  productId: number | null;
  subCategory?: string | null;
  paymentType?: 'order' | 'membership' | 'donation' | 'event' | null;
  paymentReference?: string | null;
}

const toPositiveInteger = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

export function readRoute(search: string): AppRoute {
  const params = new URLSearchParams(search);
  const rawPaymentType = params.get('payment');
  const paymentType = rawPaymentType === 'order' || rawPaymentType === 'membership' || rawPaymentType === 'donation' || rawPaymentType === 'event'
    ? rawPaymentType
    : null;

  return {
    category: paymentType ? '付款結果' : params.get('category') || '首頁',
    articleId: paymentType ? null : toPositiveInteger(params.get('article')),
    tag: paymentType ? null : params.get('tag'),
    author: paymentType ? null : params.get('author'),
    planId: paymentType ? null : toPositiveInteger(params.get('plan')),
    productId: paymentType ? null : toPositiveInteger(params.get('product')),
    subCategory: paymentType ? null : params.get('sub'),
    paymentType,
    paymentReference: params.get('reference')?.slice(0, 200) ?? null,
  };
}

export function buildRouteUrl(pathname: string, route: AppRoute): string {
  const params = new URLSearchParams();
  if (route.paymentType) {
    params.set('payment', route.paymentType);
    if (route.paymentReference) params.set('reference', route.paymentReference);
  } else {
    if (route.category !== '首頁') params.set('category', route.category);
    if (route.articleId !== null) params.set('article', String(route.articleId));
    if (route.tag) params.set('tag', route.tag);
    if (route.author) params.set('author', route.author);
    if (route.planId !== null) params.set('plan', String(route.planId));
    if (route.productId !== null) params.set('product', String(route.productId));
    if (route.subCategory) params.set('sub', route.subCategory);
  }

  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ''}`;
}
