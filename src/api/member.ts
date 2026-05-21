// → swap each function body to: return apiGet/apiPost<T>('/api/me/...')
// All endpoints require Authentication header: Bearer <token>
import type { Member, MemberStats, DonationRecord, SubscriptionRecord } from '../types/member';
import {
  MOCK_MEMBER,
  MOCK_MEMBER_STATS,
  MOCK_DONATION_RECORDS,
  MOCK_SUBSCRIPTION_RECORDS,
} from '../mocks/member';

// GET /api/me
export async function getMe(): Promise<Member> {
  return MOCK_MEMBER;
}

// GET /api/me/stats
export async function getMemberStats(): Promise<MemberStats> {
  return MOCK_MEMBER_STATS;
}

// GET /api/me/donations
export async function getDonations(): Promise<DonationRecord[]> {
  return MOCK_DONATION_RECORDS;
}

// GET /api/me/subscription/billing
export async function getBillingHistory(): Promise<SubscriptionRecord[]> {
  return MOCK_SUBSCRIPTION_RECORDS;
}

// PUT /api/me
// Body: Partial<Member>
export async function updateMe(data: Partial<Member>): Promise<void> {
  console.log('[mock] updateMe', data);
}

// PUT /api/me/subscription/payment
// Body: { paymentMethod: string }
export async function updatePaymentMethod(paymentMethod: string): Promise<void> {
  console.log('[mock] updatePaymentMethod', paymentMethod);
}
