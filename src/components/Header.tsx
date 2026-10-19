'use client';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navItems, site } from '@/data/site';
import { fonts } from '@/theme/theme';
import Wrap from './Wrap';

const navLinkSx = {
  minHeight: 44,
  display: 'inline-flex',
  alignItems: 'center',
  borderBottom: '1px solid transparent',
  '&:hover, &[aria-current="page"]': { borderBottomColor: 'sky.ink' },
} as const;

export default function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Box
      component="header"
      sx={{ position: 'sticky', top: 0, zIndex: 20, bgcolor: 'rgba(227,238,246,0.95)', borderBottom: 1, borderColor: 'sky.line' }}
    >
      <Wrap component="nav" aria-label="主選單" sx={{ py: '18px', display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/" sx={{ display: 'flex', alignItems: 'center', gap: '14px', mr: 'auto' }}>
          <Box
            component={Image}
            src="/images/logo.jpg"
            alt={`${site.name} logo`}
            width={46}
            height={46}
            priority
            sx={{ borderRadius: '50%', objectFit: 'cover', border: 1, borderColor: 'sky.line', flexShrink: 0 }}
          />
          <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Box component="span" sx={{ fontFamily: fonts.serif, fontSize: 19, fontWeight: 600, letterSpacing: '.32em' }}>
              {site.name}
            </Box>
            <Box component="span" sx={{ typography: 'en', fontSize: 13, color: 'sky.muted' }}>
              {site.enName}
            </Box>
          </Box>
        </Link>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: '32px', fontSize: 14, letterSpacing: '.22em' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
             
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              sx={navLinkSx}
            >
              {item.label}
            </Link>
          ))}
        </Box>

        <Link
         
          href="/shop"
          sx={{ fontSize: 13, letterSpacing: '.2em', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
        >
          購物袋（0）
        </Link>

        <IconButton
          onClick={() => setMenu((v) => !v)}
          aria-label={menu ? '關閉選單' : '開啟選單'}
          aria-expanded={menu}
          sx={{ display: { xs: 'inline-flex', sm: 'none' }, width: 44, height: 44, color: 'sky.ink', borderRadius: 0 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d={menu ? 'M6 6l12 12M18 6L6 18' : 'M4 9h16M4 15h16'} />
          </svg>
        </IconButton>
      </Wrap>

      <Collapse in={menu} sx={{ display: { sm: 'none' } }}>
        <Wrap sx={{ display: 'flex', flexDirection: 'column', pb: '20px', fontSize: 16, letterSpacing: '.24em' }}>
          {[{ label: '首頁', href: '/' }, ...navItems].map((item) => (
            <Link
              key={item.href}
             
              href={item.href}
              onClick={() => setMenu(false)}
              aria-current={(item.href === '/' ? pathname === '/' : isActive(item.href)) ? 'page' : undefined}
              sx={{ ...navLinkSx, borderTop: 1, borderTopColor: 'sky.line', minHeight: 56 }}
            >
              {item.label}
            </Link>
          ))}
        </Wrap>
      </Collapse>
    </Box>
  );
}
