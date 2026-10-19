import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { Post } from '@/data/posts';
import { fonts } from '@/theme/theme';
import { rowSx } from './rows';

type Props = { post: Post; showExcerpt?: boolean };

export default function PostRow({ post, showExcerpt }: Props) {
  return (
    <Link href={`/journal/${post.slug}`} sx={rowSx}>
      <Typography variant="en" sx={{ fontSize: 16, color: 'sky.muted' }}>{post.date}</Typography>
      <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box className="rt" component="span" sx={{ fontFamily: fonts.serif, fontSize: 19, letterSpacing: '.1em' }}>
          {post.title}
        </Box>
        {showExcerpt && (
          <Box component="span" sx={{ fontSize: 14, lineHeight: 1.9, color: 'sky.muted' }}>{post.excerpt}</Box>
        )}
      </Box>
      <Box component="span" sx={{ fontSize: 13, letterSpacing: '.2em', color: 'sky.muted' }}>{post.tag}</Box>
    </Link>
  );
}
