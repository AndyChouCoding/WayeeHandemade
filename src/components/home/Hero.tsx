import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { site } from '@/data/site';
import { fonts } from '@/theme/theme';
import MoreLink from '../MoreLink';
import { rainBg } from '../rain';
import Wrap from '../Wrap';

export default function Hero() {
  return (
    <Box component="section" sx={rainBg}>
      <Wrap sx={{ pt: '96px', pb: '120px' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'auto auto', sm: 'auto auto minmax(0,1fr)' },
            gap: { xs: 3, sm: '56px' },
            alignItems: 'end',
          }}
        >
          <Box
            component="h1"
            sx={{
              m: 0,
              fontFamily: fonts.serif,
              fontWeight: 400,
              writingMode: 'vertical-rl',
              fontSize: { xs: 56, sm: 92 },
              letterSpacing: '.32em',
              lineHeight: 1,
            }}
          >
            {site.name}
          </Box>
          <Box
            component="p"
            sx={{
              m: 0,
              fontFamily: fonts.serif,
              color: 'sky.sub',
              writingMode: 'vertical-rl',
              fontSize: { xs: 14, sm: 16 },
              letterSpacing: '.5em',
              lineHeight: 2,
            }}
          >
            雨落時，
            <br />
            慢慢作。
          </Box>
          <Box sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' }, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box
              component={Image}
              src="/images/hero.jpg"
              alt={`${site.name} 雲朵與星星`}
              width={1254}
              height={1254}
              priority
              sizes="(max-width: 760px) 100vw, 760px"
              sx={{ width: '100%', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="en" sx={{ fontSize: 18, color: 'sky.muted' }}>{site.tagline}</Typography>
              <MoreLink href="/booking">預約手作時光</MoreLink>
            </Box>
          </Box>
        </Box>
      </Wrap>
    </Box>
  );
}
