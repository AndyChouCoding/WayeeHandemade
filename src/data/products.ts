export type Product = { id: string; name: string; category: string; price: string; note: string; deep?: boolean };

export const productCategories = ['全部', '[器物類別 一]', '[器物類別 二]', '[器物類別 三]'] as const;

const nums = ['一', '二', '三', '四', '五', '六', '七', '八'];

export const products: Product[] = nums.map((n, i) => ({
  id: `item-${i + 1}`,
  name: `[器物 ${n}]`,
  category: productCategories[(i % 3) + 1],
  price: 'NT$ [價格]',
  note: '[尺寸・材質]',
  deep: i % 2 === 1,
}));
