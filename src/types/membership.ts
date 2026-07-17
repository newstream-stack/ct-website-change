export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'month' | 'year';
  description: string;
  features: string[];
  isPopular: boolean;
}

export interface CreateMembershipSubscriptionRequest {
  planId: string;
  returnUrl: string;
}

export interface CreateMembershipSubscriptionResponse {
  subscriptionId: string;
  status: 'payment_pending' | 'active';
  paymentUrl?: string;
}
