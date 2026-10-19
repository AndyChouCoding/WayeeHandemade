'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { productCategories, products } from '@/data/products';
import FilterTabs from '../FilterTabs';
import ProductCard from '../ProductCard';

export default function ShopGrid() {
  const [category, setCategory] = useState<(typeof productCategories)[number]>('全部');
  const list = category === '全部' ? products : products.filter((p) => p.category === category);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '40px', sm: '56px' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
        <FilterTabs label="器物分類" options={productCategories} value={category} onChange={setCategory} />
        <Typography variant="en" sx={{ fontSize: 15, color: 'sky.muted' }}>
          {String(list.length).padStart(2, '0')} items
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' },
          gap: { xs: '28px 16px', sm: '48px 28px' },
        }}
      >
        {list.map((p) => (
          <ProductCard key={p.id} product={p} href={`/shop/${p.id}`} showNote />
        ))}
      </Box>
    </Box>
  );
}
