'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { workCategories, works } from '@/data/works';
import FilterTabs from '../FilterTabs';
import WorkCard from '../WorkCard';

export default function WorksGallery() {
  const [category, setCategory] = useState<(typeof workCategories)[number]>('全部');
  const list = category === '全部' ? works : works.filter((w) => w.category === category);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '40px', sm: '56px' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
        <FilterTabs label="作品分類" options={workCategories} value={category} onChange={setCategory} />
        <Typography variant="en" sx={{ fontSize: 15, color: 'sky.muted' }}>
          {String(list.length).padStart(2, '0')} works
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', sm: 'repeat(3, minmax(0,1fr))' },
          gridAutoFlow: 'dense',
          gap: { xs: '28px 16px', sm: '48px 40px' },
        }}
      >
        {list.map((work, i) => (
          <WorkCard key={work.id} work={work} tall={category === '全部' && i % 5 === 0} meta />
        ))}
      </Box>
    </Box>
  );
}
