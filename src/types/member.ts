export interface Member {
  name: string;
  displayName: string;
  email: string;
  address: string;
  avatarUrl?: string;
  subscription: {
    plan: string;
    price: number;
    nextBillingDate: string;
    status: 'active' | 'cancelled' | 'expired';
  };
}

export interface MemberStats {
  savedArticles: number;
  attendedEvents: number;
  donationCount: number;
  totalDonated: number;
}

export interface DonationRecord {
  id: string;
  date: string;
  project: string;
  projectUrl?: string;
  method: string;
  amount: string;
  name: string;
}

export interface SubscriptionRecord {
  date: string;
  item: string;
  amount: string;
  status: '扣款成功' | '扣款失敗';
}

export interface UpdateMemberRequest {
  name: string;
  displayName: string;
  address: string;
}

export interface PaymentMethodSessionResponse {
  managementUrl?: string;
}
