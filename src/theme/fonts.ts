import { Cormorant_Garamond, Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';

export const notoSans = Noto_Sans_TC({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const notoSerif = Noto_Serif_TC({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const cormorant = Cormorant_Garamond({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-en',
});
