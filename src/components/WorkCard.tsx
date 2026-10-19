import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import type { Work } from '@/data/works';
import Placeholder from './Placeholder';

type Props = { work: Work; href?: string; tall?: boolean; meta?: boolean };

export default function WorkCard({ work, href = '/works', tall, meta }: Props) {
  return (
    <Link
      href={href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        gridRow: tall ? { sm: 'span 2' } : undefined,
      }}
    >
      <Placeholder
        deep={work.deep}
        sx={tall ? { flex: 1, minHeight: { xs: 0, sm: 360 }, aspectRatio: { xs: '4 / 3', sm: 'auto' } } : { aspectRatio: '4 / 3' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, fontSize: 14, letterSpacing: '.16em' }}>
        <span>{work.title}</span>
        {meta && (
          <Box component="span" sx={{ color: 'sky.muted', fontSize: 12 }}>
            {work.category}
          </Box>
        )}
      </Box>
    </Link>
  );
}
