/**
 * 線下奉獻管道（劃撥／ATM／聯絡方式）。
 * 奉獻總頁與奉獻內頁都會顯示，集中在這裡避免兩邊資訊走鐘。
 */

export interface OfflinePaymentMethod {
  title: string;
  rows: { label: string; value: string }[];
}

export const OFFLINE_PAYMENT_METHODS: OfflinePaymentMethod[] = [
  {
    title: '郵政劃撥',
    rows: [
      { label: '帳號', value: '00064331' },
      { label: '戶名', value: '財團法人基督教論壇基金會' },
    ],
  },
  {
    title: 'ATM 轉帳',
    rows: [
      { label: '銀行', value: '華南商業銀行新生分行（代碼 008）' },
      { label: '帳號', value: '113-20-0391766' },
      { label: '戶名', value: '財團法人基督教論壇基金會' },
    ],
  },
];

export const DONATION_CONTACT = {
  tel: '(02) 2396-1010',
  fax: '(02) 2396-1309',
  email: 'service@ct.org.tw',
  hours: '週一至週五 09:00–18:00',
};

/** 匯款後的必要動作，兩個頁面共用同一份說明。 */
export const REMITTANCE_NOTES = [
  '匯款後請來電或來信告知帳號末五碼，以便核對與開立收據。',
  '請一併註明您支持的奉獻方案名稱。',
];
