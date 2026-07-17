export type PaymentResourceType = 'order' | 'membership' | 'donation' | 'event';
export type PaymentResourceStatus = 'pending' | 'payment_pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'confirmed' | 'active';

export interface PaymentStatusResponse {
  type: PaymentResourceType;
  reference: string;
  status: PaymentResourceStatus;
  message?: string;
}
