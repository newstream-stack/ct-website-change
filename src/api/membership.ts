import type { ApiRequestOptions } from './client';
import { apiGet, apiPost } from './client';
import { USE_MOCK_API } from './config';
import { MOCK_MEMBERSHIP_PLANS } from '../mocks/membershipPlans';
import type {
  CreateMembershipSubscriptionRequest,
  CreateMembershipSubscriptionResponse,
  MembershipPlan,
} from '../types/membership';
import { assertApiData, isMembershipPlan, isRecord } from './validators';

const isSubscriptionResponse = (value: unknown): value is CreateMembershipSubscriptionResponse => isRecord(value)
  && typeof value.subscriptionId === 'string'
  && (value.status === 'payment_pending' || value.status === 'active')
  && (value.paymentUrl === undefined || typeof value.paymentUrl === 'string');

export async function getMembershipPlans(options?: ApiRequestOptions): Promise<MembershipPlan[]> {
  return USE_MOCK_API
    ? MOCK_MEMBERSHIP_PLANS
    : assertApiData(
      await apiGet<unknown>('/api/membership/plans', options),
      (value): value is MembershipPlan[] => Array.isArray(value) && value.every(isMembershipPlan),
      '會員方案',
    );
}

export async function createMembershipSubscription(
  payload: CreateMembershipSubscriptionRequest,
  idempotencyKey: string,
  options?: ApiRequestOptions,
): Promise<CreateMembershipSubscriptionResponse> {
  if (!USE_MOCK_API) {
    const response = await apiPost<unknown>('/api/member/subscriptions', payload, {
      ...options,
      headers: { ...options?.headers, 'Idempotency-Key': idempotencyKey },
    });
    return assertApiData(response, isSubscriptionResponse, '建立會員訂閱');
  }

  return {
    subscriptionId: `mock-subscription-${Date.now()}`,
    status: 'payment_pending',
  };
}
