import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import type { Service } from '@/data/services';
import { fonts } from '@/theme/theme';
import { rowSx } from './rows';

type Props = { service: Service; last?: boolean };

export default function ServiceRow({ service, last }: Props) {
  return (
    <Link
      href={`/booking#${service.id}`}
      sx={{
        ...rowSx,
        gridTemplateColumns: 'minmax(0,1fr) auto',
        ...(last && { borderBottom: 1, borderBottomColor: 'sky.line' }),
      }}
    >
      <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box className="rt" component="span" sx={{ fontFamily: fonts.serif, fontSize: 22, letterSpacing: '.14em' }}>
          {service.title}
        </Box>
        <Box component="span" sx={{ fontSize: 14, color: 'sky.muted', lineHeight: 1.9 }}>{service.summary}</Box>
      </Box>
      <Box component="span" aria-hidden="true" sx={{ fontSize: 20 }}>→</Box>
    </Link>
  );
}
