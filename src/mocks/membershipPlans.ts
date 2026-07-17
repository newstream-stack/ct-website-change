import type { MembershipPlan } from '../types/membership';

export const MOCK_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-a',
    name: '數位輕享版',
    price: 150,
    billingPeriod: 'month',
    description: '適合喜愛數位閱讀的你，隨時隨地掌握最新消息。',
    features: ['數位內容免費閱讀', '每週電子報寄送', '60年資料庫查詢', '論壇報活動優先報名與禮品折扣或搶先購'],
    isPopular: false,
  },
  {
    id: 'plan-b',
    name: '尊榮會員年約',
    price: 1600,
    billingPeriod: 'year',
    description: '給予我們最堅定的支持，享有完整數位資源與獨家實體禮品。',
    features: ['數位內容免費閱讀', '每週電子報寄送', '60年資料庫查詢', '本報設計寵鵝好禮', '會員專屬禱告卡或禱告書', '論壇報活動優先報名與禮品折扣或搶先購'],
    isPopular: true,
  },
  {
    id: 'plan-c',
    name: '全典藏年約版',
    price: 2400,
    billingPeriod: 'year',
    description: '完美結合實體與數位，不漏接任何信仰養分，深度閱讀愛好者首選。',
    features: ['數位內容免費閱讀', '每週電子報寄送', '60年資料庫查詢', '紙本論壇報', '本報設計寵鵝好禮', '會員專屬禱告卡或禱告書', '論壇報活動優先報名與禮品折扣或搶先購'],
    isPopular: false,
  },
];
