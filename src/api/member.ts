import type { Member, MemberStats, DonationRecord, PaymentMethodSessionResponse, SubscriptionRecord, UpdateMemberRequest } from '../types/member';
import { getStoredUser } from './auth';
import { apiGet, apiPost, apiPut, type ApiRequestOptions } from './client';
import { USE_MOCK_API } from './config';
import { MOCK_MEMBER, MOCK_MEMBER_STATS, MOCK_DONATION_RECORDS, MOCK_SUBSCRIPTION_RECORDS } from '../mocks/member';
import { assertApiData, isDonationRecord, isMember, isMemberStats, isRecord, isSubscriptionRecord } from './validators';

export async function getMe(options?: ApiRequestOptions): Promise<Member> {
  if (!USE_MOCK_API) return assertApiData(await apiGet<unknown>('/api/me', options), isMember, '會員資料');
  const sessionUser = getStoredUser();
  return sessionUser ? {
    ...MOCK_MEMBER,
    name: sessionUser.name || MOCK_MEMBER.name,
    displayName: sessionUser.name || MOCK_MEMBER.displayName,
    email: sessionUser.email || MOCK_MEMBER.email,
  } : MOCK_MEMBER;
}

export async function getMemberStats(options?: ApiRequestOptions): Promise<MemberStats> {
  return USE_MOCK_API ? MOCK_MEMBER_STATS : assertApiData(await apiGet<unknown>('/api/me/stats', options), isMemberStats, '會員統計');
}

export async function getDonations(options?: ApiRequestOptions): Promise<DonationRecord[]> {
  return USE_MOCK_API ? MOCK_DONATION_RECORDS : assertApiData(
    await apiGet<unknown>('/api/me/donations', options),
    (value): value is DonationRecord[] => Array.isArray(value) && value.every(isDonationRecord),
    '奉獻紀錄',
  );
}

export async function getBillingHistory(options?: ApiRequestOptions): Promise<SubscriptionRecord[]> {
  return USE_MOCK_API ? MOCK_SUBSCRIPTION_RECORDS : assertApiData(
    await apiGet<unknown>('/api/me/subscription/billing', options),
    (value): value is SubscriptionRecord[] => Array.isArray(value) && value.every(isSubscriptionRecord),
    '扣款紀錄',
  );
}

export async function updateMe(data: UpdateMemberRequest, options?: ApiRequestOptions): Promise<Member> {
  if (!USE_MOCK_API) return assertApiData(await apiPut<unknown>('/api/me', data, options), isMember, '會員資料');
  return { ...MOCK_MEMBER, ...data };
}

export async function createPaymentMethodSession(returnUrl: string, options?: ApiRequestOptions): Promise<PaymentMethodSessionResponse> {
  if (!USE_MOCK_API) return assertApiData(
    await apiPost<unknown>('/api/me/payment-method/session', { returnUrl }, options),
    (value): value is PaymentMethodSessionResponse => isRecord(value) && (value.managementUrl === undefined || typeof value.managementUrl === 'string'),
    '付款方式管理',
  );
  return {};
}
