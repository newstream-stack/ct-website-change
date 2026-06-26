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
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('impact_member');
    if (saved) {
      try {
        const customUser = JSON.parse(saved);
        return {
          ...MOCK_MEMBER,
          name: customUser.name || MOCK_MEMBER.name,
          displayName: customUser.displayName || customUser.name || MOCK_MEMBER.displayName,
          email: customUser.email || MOCK_MEMBER.email,
          address: customUser.address || MOCK_MEMBER.address,
          subscription: customUser.subscription || MOCK_MEMBER.subscription,
        };
      } catch (e) {
        console.error(e);
      }
    }
  }
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
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('impact_member');
    let currentUser = saved ? JSON.parse(saved) : {};
    currentUser = { ...currentUser, ...data };
    localStorage.setItem('impact_member', JSON.stringify(currentUser));
  }
}

