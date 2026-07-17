import type { Member, MemberStats, DonationRecord, SubscriptionRecord } from '../types/member';

/**
 * MOCK DATA — Member used when VITE_USE_MOCK_API=true.
 */
export const MOCK_MEMBER: Member = {
  name: '王大明',
  displayName: 'David',
  email: 'david.wang@example.com',
  address: '台北市大安區新生南路三段',
  subscription: {
    plan: '數位輕享版',
    price: 150,
    nextBillingDate: '2026/05/15',
    status: 'active',
  },
};

/**
 * MOCK DATA — Member stats used when VITE_USE_MOCK_API=true.
 */
export const MOCK_MEMBER_STATS: MemberStats = {
  savedArticles: 12,
  attendedEvents: 5,
  donationCount: 3,
  totalDonated: 9000,
};

/**
 * MOCK DATA — Donation records used when VITE_USE_MOCK_API=true.
 */
export const MOCK_DONATION_RECORDS: DonationRecord[] = [
  {
    id: '2026041001',
    date: '2026/04/10',
    project: '乘著愛的風出發吧！',
    projectUrl: 'https://ct-website-change.vercel.app/?category=%E5%A5%89%E7%8D%BB',
    method: '單筆奉獻 (LinePay)',
    amount: 'NT$ 8,000',
    name: '王大明',
  },
  {
    id: '2026021509',
    date: '2026/02/15',
    project: '亞洲論壇影響力中心',
    projectUrl: 'https://ct-website-change.vercel.app/?category=%E5%A5%89%E7%8D%BB',
    method: '單筆奉獻 (信用卡)',
    amount: 'NT$ 1,000',
    name: '王大明',
  },
];

/**
 * MOCK DATA — Billing records used when VITE_USE_MOCK_API=true.
 */
export const MOCK_SUBSCRIPTION_RECORDS: SubscriptionRecord[] = [
  {
    date: '2026/04/15',
    item: '會員訂閱：數位輕享版 (1個月)',
    amount: 'NT$ 150',
    status: '扣款成功',
  },
  {
    date: '2026/03/15',
    item: '會員訂閱：數位輕享版 (1個月)',
    amount: 'NT$ 150',
    status: '扣款成功',
  },
];
