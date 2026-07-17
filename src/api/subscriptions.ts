// Replace the function body with apiGet<SubscriptionPage>('/api/subscriptions')
// when subscription content is provided by the backend.
import type { ActionPlan } from '../types';
import subscriptionData from '../data/subscription.json';
import { apiGet, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { assertApiData, isSubscriptionPageData } from './validators';

export interface SubscriptionPage {
  bgText: string;
  subtitle: string;
  titleLines: string[];
  plans: ActionPlan[];
}

export async function getSubscriptionPage(options?: ApiRequestOptions): Promise<SubscriptionPage> {
  return USE_MOCK_API ? {
    ...subscriptionData,
    plans: subscriptionData.plans.map((plan) => ({
      ...plan,
      variant: 'subscription' as const,
    })),
  } : assertApiData(await apiGet<unknown>('/api/subscriptions', options), isSubscriptionPageData, '訂報內容');
}
