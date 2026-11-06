export const dynamic = 'force-dynamic';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import JournalList from '@/components/journal/JournalList';
import PageHeader from '@/components/PageHeader';
import ContentImage from '@/components/ContentImage';
import ContentMessage from '@/components/ContentMessage';
import Wrap, { secPadding } from '@/components/Wrap';
import { contentList } from '@/lib/content-server';
import { postView } from '@/lib/content';
import { fonts } from '@/theme/theme';

export const metadata: Metadata = { title: '日誌' };

export default async function JournalPage() {
  const result = await contentList('posts');
  const posts = result.data?.map(postView) ?? [];
  const [featured] = posts;

  return (
    <>
      <PageHeader index="JOURNAL" title="日誌" en="notes from a rainy desk">
        <p style={{ margin: 0 }}>[日誌介紹：工作室的日常、作品背後的故事、市集與課程消息]</p>
      </PageHeader>

      {/* Featured */}
      <Wrap component="section" sx={{ pt: { xs: '72px', sm: '104px' } }}>
        {featured && <Link
          href={`/journal/${featured.slug}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,7fr) minmax(0,5fr)' },
            gap: { xs: 3, md: '64px' },
            alignItems: 'center',
            '&:hover .rt': { color: 'sky.accent' },
          }}
        >
          <ContentImage url={featured.images[0]?.url} alt={featured.title} ratio="16 / 10" />
          <Stack sx={{ gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'baseline' }}>
              <Typography variant="idx">LATEST</Typography>
              <Typography variant="en" sx={{ fontSize: 16, color: 'sky.muted' }}>{featured.date}</Typography>
            </Box>
            <Box className="rt" component="h2" sx={{ m: 0, fontFamily: fonts.serif, fontWeight: 400, fontSize: { xs: 24, sm: 28 }, lineHeight: 1.6, letterSpacing: '.1em' }}>
              {featured.title}
            </Box>
            <Typography sx={{ color: 'sky.body' }}>{featured.excerpt}</Typography>
            <Box component="span" sx={{ fontSize: 13, letterSpacing: '.24em', display: 'inline-flex', gap: 1.5, alignSelf: 'flex-start', minHeight: 44, alignItems: 'center', borderBottom: 1 }}>
              閱讀全文 <span aria-hidden="true">—</span>
            </Box>
          </Stack>
        </Link>}
      </Wrap>

      <Wrap component="section" aria-label="所有文章" sx={secPadding}>
        {posts.length ? <JournalList posts={posts} /> : <ContentMessage error={result.error} empty="目前沒有已發布文章。" />}
      </Wrap>
    </>
  );
}
