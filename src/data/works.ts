export type Work = { id: string; title: string; category: string; year: string; deep?: boolean };

export const workCategories = ['全部', '[類別 一]', '[類別 二]', '[類別 三]'] as const;

const nums = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

export const works: Work[] = nums.map((n, i) => ({
  id: `work-${i + 1}`,
  title: `[作品名稱 ${n}]`,
  category: workCategories[(i % 3) + 1],
  year: '[2026]',
  deep: i % 3 === 1,
}));
