import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { navItems, site } from '@/data/site';
import { fonts } from '@/theme/theme';
import Wrap from './Wrap';

const footLinkSx = { minHeight: 34, display: 'flex', alignItems: 'center' } as const;

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'sky.ink' }}>
      <Wrap sx={{ pt: '80px', pb: '36px', display: 'flex', flexDirection: 'column', gap: '64px' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0,1fr)',
              sm: 'repeat(2, minmax(0,1fr))',
              md: 'minmax(0,2fr) repeat(2, minmax(0,1fr)) minmax(0,2fr)',
            },
            gap: { xs: '36px', sm: '48px' },
          }}
        >
          <Stack sx={{ gap: 2 }}>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Box
                component={Image}
                src="/images/logo.jpg"
                alt=""
                width={56}
                height={56}
                sx={{ borderRadius: '50%', objectFit: 'cover', border: 1, borderColor: 'sky.line' }}
              />
              <Box component="span" sx={{ fontFamily: fonts.serif, fontSize: 24, letterSpacing: '.32em' }}>
                {site.name}
              </Box>
            </Box>
            <Typography variant="en" sx={{ fontSize: 15, color: 'sky.muted' }}>
              {site.enName}
            </Typography>
            <Typography sx={{ fontSize: 14, lineHeight: 2, color: 'sky.body' }}>
              {site.address}
              <br />
              營業時間：{site.hours}
            </Typography>
          </Stack>

          <Stack sx={{ gap: '4px', fontSize: 14, letterSpacing: '.16em' }}>
            <Typography variant="idx" sx={{ mb: 1 }}>MENU</Typography>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} sx={footLinkSx}>
                {item.label}
              </Link>
            ))}
          </Stack>

          <Stack sx={{ gap: '4px', fontSize: 14, letterSpacing: '.1em' }}>
            <Typography variant="idx" sx={{ mb: 1 }}>CONTACT</Typography>
            <Link href={site.instagram} sx={footLinkSx}>Instagram</Link>
            <Link href={site.line} sx={footLinkSx}>LINE</Link>
            <Box component="span" sx={{ ...footLinkSx, color: 'sky.muted' }}>{site.account}</Box>
          </Stack>

          {/* Newsletter: visual only for now */}
          <Stack component="form" sx={{ gap: '14px' }}>
            <Typography component="label" htmlFor="newsletter-email" variant="idx">NEWSLETTER</Typography>
            <Typography sx={{ fontSize: 14, lineHeight: 1.9, color: 'sky.body' }}>新作與課程消息，偶爾寄一封。</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: 1, borderColor: 'sky.ink' }}>
              <InputBase
                id="newsletter-email"
                type="email"
                placeholder="email"
                sx={{ flex: 1, minWidth: 0, minHeight: 46, fontSize: 15, color: 'sky.ink' }}
              />
              <Box
                component="button"
                type="button"
                sx={{
                  minHeight: 46,
                  border: 0,
                  bgcolor: 'transparent',
                  font: 'inherit',
                  fontSize: 14,
                  letterSpacing: '.2em',
                  cursor: 'pointer',
                  color: 'sky.ink',
                }}
              >
                訂閱 →
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '10px 24px',
            fontSize: 12,
            letterSpacing: '.16em',
            color: 'sky.muted',
            borderTop: 1,
            borderColor: 'sky.line',
            pt: 3,
          }}
        >
          <span>© 2026 {site.name} {site.enName}</span>
          <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', '& a': { color: 'sky.muted', textDecoration: 'underline' } }}>
            <a href="#">常見問題</a>
            <a href="#">退換貨說明</a>
            <a href="#">隱私權政策</a>
            <a href="/admin">商家後台</a>
          </Box>
        </Box>
      </Wrap>
    </Box>
  );
}
