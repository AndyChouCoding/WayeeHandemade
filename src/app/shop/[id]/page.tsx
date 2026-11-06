export const dynamic = 'force-dynamic';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MoreLink from '@/components/MoreLink';
import ContentImage from '@/components/ContentImage';
import ContentMessage from '@/components/ContentMessage';
import MarkdownContent from '@/components/MarkdownContent';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import AddToBag from '@/components/shop/AddToBag';
import ShopInfo from '@/components/shop/ShopInfo';
import Wrap, { secPadding } from '@/components/Wrap';
import { contentList, contentDetail } from '@/lib/content-server';
import { productView } from '@/lib/content';
import { fonts } from '@/theme/theme';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: (await contentDetail('products', id)).data?.title ?? '器物' };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const result = await contentDetail('products', id);
  if (result.error === 'not-found') notFound();
  if (!result.data) return <Wrap sx={{ py: 8 }}><ContentMessage error={result.error} empty="" /></Wrap>;
  const entry = result.data;
  const product = productView(entry);
  const products = (await contentList('products')).data?.map(productView) ?? [];
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Wrap component="section" sx={{ pt: { xs: '40px', sm: '64px' }, pb: { xs: '88px', sm: '120px' } }}>
        <MoreLink href="/shop" sx={{ mb: { xs: 4, sm: 6 } }}>回到器物</MoreLink>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,7fr) minmax(0,5fr)' },
            gap: { xs: 5, md: '80px' },
          }}
        >
          <Stack sx={{ gap: 2 }}>
            <ContentImage url={entry.images[0]?.url} alt={product.name} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 2 }}>
              {entry.images.slice(1).map((image) => (
                <ContentImage key={image.id} url={image.url} alt={product.name} />
              ))}
            </Box>
          </Stack>

          <Stack sx={{ gap: 4, pt: { md: 2 } }}>
            <Stack sx={{ gap: '14px' }}>
              <Typography variant="idx">{product.category}</Typography>
              <Box component="h1" sx={{ m: 0, fontFamily: fonts.serif, fontWeight: 400, fontSize: 34, letterSpacing: '.16em' }}>
                {product.name}
              </Box>
              <Typography variant="en" sx={{ fontSize: 22, color: 'sky.muted' }}>{product.price}</Typography>
            </Stack>
            <Typography sx={{ color: 'sky.body' }}>{entry.excerpt}</Typography>
            <MarkdownContent text={entry.body} />
            <Box component="dl" sx={{ m: 0, borderBottom: 1, borderColor: 'sky.line' }}>
              {[
                ['尺寸', entry.dimensions || '未提供'],
                ['材質', entry.material || '未提供'],
                ['製作期', entry.productionTime || '請洽工作室'],
              ].map(([k, v]) => (
                <Box key={k} sx={{ display: 'grid', gridTemplateColumns: '96px minmax(0,1fr)', py: 2, borderTop: 1, borderColor: 'sky.line', fontSize: 14 }}>
                  <Box component="dt" sx={{ letterSpacing: '.2em', color: 'sky.muted' }}>{k}</Box>
                  <Box component="dd" sx={{ m: 0, letterSpacing: '.1em' }}>{v}</Box>
                </Box>
              ))}
            </Box>
            <AddToBag />
            <Typography variant="body2" sx={{ color: 'sky.muted' }}>
              每件皆為手作，顏色與紋理會略有不同。
            </Typography>
          </Stack>
        </Box>
      </Wrap>

      <Box component="section" sx={{ borderTop: 1, borderColor: 'sky.line' }}>
        <Wrap sx={{ ...secPadding, display: 'flex', flexDirection: 'column', gap: '56px' }}>
          <SectionHeading index="MORE" title="其他器物" more={{ label: '進入小舖', href: '/shop' }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' },
              gap: { xs: '28px 16px', sm: '40px 28px' },
            }}
          >
            {related.map((p) => (
              <ProductCard key={p.id} product={p} href={`/shop/${p.id}`} />
            ))}
          </Box>
        </Wrap>
      </Box>

      <ShopInfo />
    </>
  );
}
