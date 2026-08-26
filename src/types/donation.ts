export interface Plan {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  /** 列表頁卡片用的短標與摘要（詳情頁的 description 是完整長文）。 */
  subtitle?: string;
  summary?: string;
  /** 依方案帶入的建議金額；沒設定時詳情頁沿用預設級距。 */
  suggestedAmounts?: number[];
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
