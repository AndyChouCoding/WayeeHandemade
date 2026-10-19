import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { fonts } from '@/theme/theme';
import { rainBg } from './rain';
import Split from './Split';
import Wrap from './Wrap';

type Props = { index: string; title: string; en: string; children?: ReactNode };

/** Inner-page masthead: rain backdrop, index, large serif title and intro copy. */
export default function PageHeader({ index, title, en, children }: Props) {
  return (
    <Box component="section" sx={{ ...rainBg, borderBottom: 1, borderColor: 'sky.line' }}>
      <Wrap sx={{ pt: { xs: '72px', sm: '96px' }, pb: { xs: '64px', sm: '88px' } }}>
        <Split sx={{ alignItems: 'end' }}>
          <Stack sx={{ gap: '20px' }}>
            <Typography variant="idx">{index}</Typography>
            <Box
              component="h1"
              sx={{ m: 0, fontFamily: fonts.serif, fontWeight: 400, fontSize: { xs: 40, sm: 56 }, letterSpacing: '.24em', lineHeight: 1.3 }}
            >
              {title}
            </Box>
            <Typography variant="en" sx={{ fontSize: 18, color: 'sky.muted' }}>{en}</Typography>
          </Stack>
          {children && (
            <Stack sx={{ gap: '14px', fontSize: 16, lineHeight: 2.2, color: 'sky.body' }}>{children}</Stack>
          )}
        </Split>
      </Wrap>
    </Box>
  );
}
