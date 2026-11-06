'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import type { Post } from '@/data/posts';
import FilterTabs from '../FilterTabs';
import PostRow from '../PostRow';

export default function JournalList({ posts }: { posts: Post[] }) {
  const postTags = ['全部', ...new Set(posts.map((post) => post.tag).filter(Boolean))];
  const [tag, setTag] = useState<(typeof postTags)[number]>('全部');
  const list = tag === '全部' ? posts : posts.filter((p) => p.tag === tag);

  return (
    <Stack sx={{ gap: { xs: '32px', sm: '40px' } }}>
      <FilterTabs label="文章分類" options={postTags} value={tag} onChange={setTag} />
      <Box sx={{ borderBottom: 1, borderColor: 'sky.line' }}>
        {list.map((post) => (
          <PostRow key={post.slug} post={post} showExcerpt />
        ))}
      </Box>
    </Stack>
  );
}
