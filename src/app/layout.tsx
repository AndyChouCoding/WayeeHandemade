import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { cormorant, notoSans, notoSerif } from '@/theme/fonts';
import theme from '@/theme/theme';

export const metadata: Metadata = {
  title: { default: '微雨漫作｜wayee handmade', template: '%s｜微雨漫作' },
  description: '微雨漫作 wayee handmade — 手作工作室與小舖。雨落時，慢慢作。',
  icons: { icon: '/images/logo.jpg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${notoSans.variable} ${notoSerif.variable} ${cormorant.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <Box component="main" sx={{ flex: '1 0 auto' }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
