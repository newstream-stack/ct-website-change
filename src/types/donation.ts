export interface Plan {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
}

export interface DonationFormPayload {
  planId: number;
  returnUrl?: string;
  paymentType: 'one-time' | 'installment';
  /** Total pledged amount (for installment, the sum across all periods — not the per-period charge). */
  amount: number;
  installmentPeriod: number;
  paymentMethod: 'credit-card' | 'line-pay';
  donor: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  receipt: {
    address: string;
    option: string;
    title: string;
    taxId: string;
  };
  gift: {
    address: string;
  };
}

export interface DonationResponse {
  success: boolean;
  donationId: string;
  status: 'pending' | 'paid' | 'failed';
  paymentUrl?: string;
}
