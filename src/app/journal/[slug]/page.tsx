import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MoreLink from '@/components/MoreLink';
import Placeholder from '@/components/Placeholder';
import { rainBg } from '@/components/rain';
import Wrap from '@/components/Wrap';
import { posts } from '@/data/posts';
import { fonts } from '@/theme/theme';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return { title: post?.title ?? '日誌', description: post?.excerpt };
}

const article = { maxWidth: 720, mx: 'auto' } as const;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const i = posts.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const post = posts[i];
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
          <Placeholder label="文章照片" sx={{ aspectRatio: '16 / 10' }} />
          <Stack sx={{ gap: 3, color: 'sky.body' }}>
            <Typography>{post.excerpt}</Typography>
            <Typography>[內文段落：寫下這篇的內容。段落之間保留呼吸的空間，讓文字像雨一樣慢慢落下。]</Typography>
            <Box component="h2" sx={{ m: 0, mt: 2, fontFamily: fonts.serif, fontWeight: 400, fontSize: 22, letterSpacing: '.12em', color: 'sky.ink' }}>
              [小標題]
            </Box>
            <Typography>[內文段落]</Typography>
            <Box
              component="blockquote"
              sx={{ m: 0, pl: 3, borderLeft: 1, borderColor: 'sky.ink', fontFamily: fonts.serif, fontSize: 18, lineHeight: 2, letterSpacing: '.08em', color: 'sky.ink' }}
            >
              [引言：一句想被記住的話。]
            </Box>
            <Typography>[內文段落]</Typography>
          </Stack>
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
