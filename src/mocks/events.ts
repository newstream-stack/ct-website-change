import type { EventDetail } from '../types/event';

export const MOCK_EVENTS: EventDetail[] = [
  {
    id: 'impact-2026',
    name: 'IMPACT 2026 全球華人影響力高峰會',
    eyebrow: 'Premium Sponsorship / Annual Summit',
    description: '結合理性與靈性的視野，邀請重量級講員獨家探討未來的企業倫理。在急遽變化的世代中，尋找不變的真理與前進的動力。',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000',
    dateLabel: '2026/10/20 (二)\n至 10/22 (四)',
    venue: '台北國際會議中心\n(TICC 大會堂)',
    tickets: [
      {
        id: 'standard',
        name: '一般報名 Standard',
        price: 6000,
        features: ['包含三天實體論壇門票', '大會限定提袋與筆記本', '提供每日午餐與茶點', '會後數位版精華影片觀看權 (30天)'],
      },
      {
        id: 'vip',
        name: 'VIP 尊榮票 Premium VIP',
        price: 12000,
        features: ['包含三天實體論壇門票 (前三排保留席)', 'VIP 專屬報到通道與休息室', '大會限定提袋與筆記本', '大師面對面：專屬講員晚宴', '會後完整影音資料庫永久觀看權'],
      },
      {
        id: 'online',
        name: '線上參與 Online',
        price: 2000,
        features: ['包含三天線上直播觀看權', '會後數位版精華影片觀看權 (30天)', '線上專屬互動問答區'],
      },
    ],
  },
];
