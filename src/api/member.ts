// → swap each function body to: return apiGet/apiPost<T>('/api/me/...')
// All endpoints require Authentication header: Bearer <token>
import type { Member, MemberStats, DonationRecord, SubscriptionRecord } from '../types/member';
import { getStoredUser } from './auth';
import {
  MOCK_MEMBER,
  MOCK_MEMBER_STATS,
  MOCK_DONATION_RECORDS,
  MOCK_SUBSCRIPTION_RECORDS,
} from '../mocks/member';

// GET /api/me
export async function getMe(): Promise<Member> {
  // TODO: return apiGet<Member>('/api/me');
  const sessionUser = getStoredUser();
  if (sessionUser) {
    return {
      ...MOCK_MEMBER,
      name: sessionUser.name || MOCK_MEMBER.name,
      displayName: sessionUser.name || MOCK_MEMBER.displayName,
      email: sessionUser.email || MOCK_MEMBER.email,
    };
  }
  return MOCK_MEMBER;
}

// GET /api/me/stats
export async function getMemberStats(): Promise<MemberStats> {
  // TODO: return apiGet<MemberStats>('/api/me/stats');
  return MOCK_MEMBER_STATS;
}

// GET /api/me/donations
export async function getDonations(): Promise<DonationRecord[]> {
  // TODO: return apiGet<DonationRecord[]>('/api/me/donations');
  return MOCK_DONATION_RECORDS;
}

// GET /api/me/subscription/billing
export async function getBillingHistory(): Promise<SubscriptionRecord[]> {
  // TODO: return apiGet<SubscriptionRecord[]>('/api/me/subscription/billing');
  return MOCK_SUBSCRIPTION_RECORDS;
}

// PUT /api/me
export async function updateMe(data: Partial<Member>): Promise<void> {
  // TODO: return apiPut('/api/me', data);
  console.log('[mock] updateMe', data);
}

