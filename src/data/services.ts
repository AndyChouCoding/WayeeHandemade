export type Service = { id: string; title: string; summary: string; details: { label: string; value: string }[] };

export const services: Service[] = [
  {
    id: 'workshop',
    title: '手作體驗課',
    summary: '[課程內容・時長・人數・費用]',
    details: [
      { label: '時長', value: '[約 2–3 小時]' },
      { label: '人數', value: '[1–6 人]' },
      { label: '費用', value: 'NT$ [價格] / 人' },
    ],
  },
  {
    id: 'custom',
    title: '客製化諮詢',
    summary: '[可客製品項・製作期・報價方式]',
    details: [
      { label: '品項', value: '[可客製品項]' },
      { label: '製作期', value: '[約 X 週]' },
      { label: '報價', value: '[依需求報價]' },
    ],
  },
  {
    id: 'group',
    title: '包場・團體',
    summary: '[人數與時間另議]',
    details: [
      { label: '人數', value: '[7 人以上]' },
      { label: '時間', value: '[另議]' },
      { label: '費用', value: '[依人數報價]' },
    ],
  },
];

export const bookingFaqs = [
  { q: '[需要事先準備什麼嗎？]', a: '[回答：材料與工具由工作室準備，穿著輕便即可。]' },
  { q: '[可以改期或取消嗎？]', a: '[回答：改期與退費規則。]' },
  { q: '[作品可以當天帶走嗎？]', a: '[回答：完成時間與取件方式。]' },
];
