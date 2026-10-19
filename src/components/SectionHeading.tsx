import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import MoreLink from './MoreLink';

type Props = {
  index: string;
  title: ReactNode;
  more?: { label: string; href: string };
};

/** Section index + serif title, with an optional "more" link on the right. */
export default function SectionHeading({ index, title, more }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
      <Stack sx={{ gap: '14px' }}>
        <Typography variant="idx">{index}</Typography>
        <Typography variant="sectionTitle">{title}</Typography>
      </Stack>
      {more && <MoreLink href={more.href}>{more.label}</MoreLink>}
    </Box>
  );
}
