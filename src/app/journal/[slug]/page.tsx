export const dynamic = 'force-dynamic';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MoreLink from '@/components/MoreLink';
import ContentImage from '@/components/ContentImage';
import MarkdownContent from '@/components/MarkdownContent';
import ContentMessage from '@/components/ContentMessage';
import { rainBg } from '@/components/rain';
import Wrap from '@/components/Wrap';
import { contentList, contentDetail } from '@/lib/content-server';
import { postView } from '@/lib/content';
import { fonts } from '@/theme/theme';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await contentDetail('posts', slug);
  return { title: post?.title ?? '日誌', description: post?.excerpt };
}

const article = { maxWidth: 720, mx: 'auto' } as const;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const result = await contentDetail('posts', slug);
  if (result.error === 'not-found') notFound();
  if (!result.data) return <Wrap sx={{ py: 8 }}><ContentMessage error={result.error} empty="" /></Wrap>;
  const entry = result.data;
  const posts = (await contentList('posts')).data?.map(postView) ?? [postView(entry)];
  const i = posts.findIndex((p) => p.slug === slug);
  const post = postView(entry);
  const newer = posts[i - 1];
  const older = posts[i + 1];

  return (
    <Box component="article">
      <Box component="header" sx={{ ...rainBg, borderBottom: 1, borderColor: 'sky.line' }}>
        <Wrap sx={{ pt: { xs: '56px', sm: '80px' }, pb: { xs: '56px', sm: '80px' } }}>
          <Stack sx={{ ...article, gap: 3 }}>
            <MoreLink href="/journal" sx={{ alignSelf: 'flex-start' }}>回到日誌</MoreLink>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'baseline', mt: 2 }}>
              <Typography variant="en" sx={{ fontSize: 16, color: 'sky.muted' }}>{post.date}</Typography>
              <Box component="span" sx={{ fontSize: 13, letterSpacing: '.2em', color: 'sky.muted' }}>{post.tag}</Box>
            </Box>
            <Box component="h1" sx={{ m: 0, fontFamily: fonts.serif, fontWeight: 400, fontSize: { xs: 26, sm: 34 }, lineHeight: 1.7, letterSpacing: '.1em' }}>
              {post.title}
            </Box>
          </Stack>
        </Wrap>
      </Box>

      <Wrap sx={{ py: { xs: '56px', sm: '88px' } }}>
        <Stack sx={{ ...article, gap: 4 }}>
          {entry.images.map((image) => <ContentImage key={image.id} url={image.url} alt={post.title} ratio="16 / 10" />)}
          <Typography>{post.excerpt}</Typography>
          <MarkdownContent text={entry.body} />
        </Stack>
      </Wrap>

      <Box component="nav" aria-label="其他文章" sx={{ borderTop: 1, borderColor: 'sky.line' }}>
        <Wrap sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))' } }}>
          {[
            { label: '← 較新的文章', p: newer, align: 'left' as const },
            { label: '較舊的文章 →', p: older, align: 'right' as const },
          ].map(({ label, p, align }) =>
            p ? (
              <Link
                key={label}
                href={`/journal/${p.slug}`}
                sx={{ py: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', gap: 1, textAlign: { sm: align }, '&:hover .rt': { color: 'sky.accent' } }}
              >
                <Typography variant="idx" sx={{ fontSize: 13 }}>{label}</Typography>
                <Box className="rt" component="span" sx={{ fontFamily: fonts.serif, fontSize: 17, letterSpacing: '.1em' }}>{p.title}</Box>
              </Link>
            ) : (
              <span key={label} />
            ),
          )}
        </Wrap>
      </Box>
    </Box>
  );
}
