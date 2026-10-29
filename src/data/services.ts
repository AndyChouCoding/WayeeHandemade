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
  { q: '如何確認預約是否成功？', a: '送出後請查看畫面上的預約狀態。若顯示待工作室確認，請等待工作室確認；請妥善保存管理碼以便查詢。' },
  { q: '可以改期或取消嗎？', a: '可憑管理碼查詢預約，並在顯示的取消期限前線上取消。改期或超過取消期限，請直接聯絡工作室。' },
  { q: '多人一起參加如何預約？', a: '人數欄位用來記錄需求，不代表已保留相同人數的名額。團體名額與費用須由工作室另行確認。' },
];
