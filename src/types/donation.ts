export interface Plan {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
}

export interface DonationFormPayload {
  planId: number;
  paymentType: 'one-time' | 'installment';
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
