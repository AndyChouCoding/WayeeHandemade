'use client';

import { createTheme } from '@mui/material/styles';
import NextLink from 'next/link';
import type { CSSProperties } from 'react';

// Design tokens from docs/晴空 · 首頁-html/SkyMain.dc.html
export const sky = {
  bg: '#E3EEF6',
  bgSoft: '#EEF6FB',
  paper: '#F2F8FC',
  paperDeep: '#D3E4EF',
  line: '#B9CEDE',
  ink: '#1E2833',
  accent: '#2F4A63',
  muted: '#4C5D6D',
  body: '#34414F',
  sub: '#3B4856',
} as const;

export const fonts = {
  sans: "var(--font-sans), 'Noto Sans TC', system-ui, sans-serif",
  serif: "var(--font-serif), 'Noto Serif TC', serif",
  en: "var(--font-en), 'Cormorant Garamond', serif",
} as const;

declare module '@mui/material/styles' {
  interface Palette {
    sky: typeof sky;
  }
  interface PaletteOptions {
    sky?: typeof sky;
  }
  interface TypographyVariants {
    idx: CSSProperties;
    en: CSSProperties;
    sectionTitle: CSSProperties;
  }
  interface TypographyVariantsOptions {
    idx?: CSSProperties;
    en?: CSSProperties;
    sectionTitle?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    idx: true;
    en: true;
    sectionTitle: true;
  }
}

const theme = createTheme({
  // Design breakpoints: max-width 760px (mobile) and 1000px (tablet)
  breakpoints: {
    values: { xs: 0, sm: 761, md: 1001, lg: 1200, xl: 1536 },
  },
  palette: {
    mode: 'light',
    primary: { main: sky.accent, contrastText: sky.bg },
    text: { primary: sky.ink, secondary: sky.muted },
    background: { default: sky.bg, paper: sky.paper },
    divider: sky.line,
    sky,
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: fonts.sans,
    fontWeightLight: 300,
    fontWeightRegular: 300,
    body1: { fontSize: 16, lineHeight: 2.2, fontWeight: 300 },
    body2: { fontSize: 14, lineHeight: 1.9, fontWeight: 300 },
    idx: {
      fontFamily: fonts.en,
      fontSize: 15,
      letterSpacing: '.24em',
      color: sky.muted,
    },
    en: {
      fontFamily: fonts.en,
      fontStyle: 'italic',
      letterSpacing: '.06em',
    },
    sectionTitle: {
      fontFamily: fonts.serif,
      fontSize: 34,
      fontWeight: 400,
      letterSpacing: '.16em',
      lineHeight: 1.7,
      margin: 0,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: sky.bg, color: sky.ink, fontWeight: 300, lineHeight: 'normal', letterSpacing: 'normal' },
        a: { color: sky.ink },
        'a:hover': { color: sky.accent },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: { idx: 'span', en: 'span', sectionTitle: 'h2' },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: true, LinkComponent: NextLink },
    },
    MuiLink: {
      // Route every MUI Link through next/link
      defaultProps: { underline: 'none', color: 'inherit', component: NextLink },
    },
  },
});

export default theme;
