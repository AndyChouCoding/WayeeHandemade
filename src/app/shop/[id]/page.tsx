import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MoreLink from '@/components/MoreLink';
import Placeholder from '@/components/Placeholder';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import AddToBag from '@/components/shop/AddToBag';
import ShopInfo from '@/components/shop/ShopInfo';
import Wrap, { secPadding } from '@/components/Wrap';
import { products } from '@/data/products';
import { fonts } from '@/theme/theme';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: products.find((p) => p.id === id)?.name ?? '器物' };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
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
            <Placeholder deep={product.deep} label="商品照片" sx={{ aspectRatio: '1 / 1' }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 2 }}>
              {[0, 1, 2, 3].map((i) => (
                <Placeholder key={i} deep={i % 2 === 1} label="" sx={{ aspectRatio: '1 / 1' }} />
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
            <Typography sx={{ color: 'sky.body' }}>[商品介紹：這件器物的故事、使用方式與保養]</Typography>
            <Box component="dl" sx={{ m: 0, borderBottom: 1, borderColor: 'sky.line' }}>
              {[
                ['尺寸', '[尺寸]'],
                ['材質', '[材質]'],
                ['製作期', '[現貨 / 約 X 週]'],
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
