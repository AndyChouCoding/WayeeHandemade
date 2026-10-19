export type Post = { slug: string; date: string; title: string; tag: string; excerpt: string };

export const postTags = ['全部', '日常', '作品', '公告'] as const;

export const posts: Post[] = [
  { slug: 'rainy-desk', date: '[2026.10.—]', title: '[文章標題：雨天的工作桌]', tag: '日常', excerpt: '[文章摘要：一兩句話，說說這篇在寫什麼。]' },
  { slug: 'birth-of-a-work', date: '[2026.09.—]', title: '[文章標題：一件作品的誕生]', tag: '作品', excerpt: '[文章摘要：一兩句話，說說這篇在寫什麼。]' },
  { slug: 'market-news', date: '[2026.09.—]', title: '[文章標題：市集與課程消息]', tag: '公告', excerpt: '[文章摘要：一兩句話，說說這篇在寫什麼。]' },
  { slug: 'materials', date: '[2026.08.—]', title: '[文章標題：關於材料]', tag: '日常', excerpt: '[文章摘要：一兩句話，說說這篇在寫什麼。]' },
  { slug: 'new-series', date: '[2026.08.—]', title: '[文章標題：新系列的草稿]', tag: '作品', excerpt: '[文章摘要：一兩句話，說說這篇在寫什麼。]' },
  { slug: 'holiday', date: '[2026.07.—]', title: '[文章標題：夏季休息公告]', tag: '公告', excerpt: '[文章摘要：一兩句話，說說這篇在寫什麼。]' },
];
