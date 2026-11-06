export const dynamic = 'force-dynamic';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Hero from '@/components/home/Hero';
import MoreLink from '@/components/MoreLink';
import PostRow from '@/components/PostRow';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';
import ServiceCatalog from '@/components/booking/ServiceCatalog';
import Split from '@/components/Split';
import WorkCard from '@/components/WorkCard';
import Wrap, { secPadding } from '@/components/Wrap';
import { contentList } from '@/lib/content-server';
import { postView, productView } from '@/lib/content';
import ContentMessage from '@/components/ContentMessage';
import { works } from '@/data/works';

const sectionStack = { ...secPadding, display: 'flex', flexDirection: 'column' } as const;

export default async function HomePage() {
  const [postResult, productResult] = await Promise.all([contentList('posts'), contentList('products')]);
  const posts = postResult.data?.map(postView) ?? [];
  const products = productResult.data?.map(productView) ?? [];
  return (
    <>
      <Hero />

      {/* 01 About */}
      <Wrap component="section" sx={secPadding}>
        <Split>
          <Stack sx={{ gap: '20px' }}>
            <Typography variant="idx">01 — ABOUT</Typography>
            <Typography variant="sectionTitle" sx={{ letterSpacing: '.12em' }}>
              在細雨裡，
              <br />
              做一件安靜的東西。
            </Typography>
          </Stack>
          <Stack sx={{ gap: '22px', color: 'sky.body', pt: { md: '44px' } }}>
            <Typography>[關於我：你是誰、怎麼開始手作、「微雨漫作」名字的由來]</Typography>
            <Typography>[工作室的材料、做法，以及想帶給大家的感覺]</Typography>
            <MoreLink href="/works" sx={{ alignSelf: 'flex-start', mt: 1 }}>看看作品</MoreLink>
          </Stack>
        </Split>
      </Wrap>

      {/* 02 Works */}
      <Box component="section" sx={{ borderTop: 1, borderColor: 'sky.line' }}>
        <Wrap sx={{ ...sectionStack, gap: '56px' }}>
          <SectionHeading index="02 — WORKS" title="作品" more={{ label: '全部作品', href: '/works' }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', sm: 'repeat(3, minmax(0,1fr))' },
              gap: { xs: '28px 16px', sm: '48px 40px' },
            }}
          >
            {works.slice(0, 5).map((work, i) => (
              <WorkCard key={work.id} work={work} tall={i === 0} />
            ))}
          </Box>
        </Wrap>
      </Box>

      {/* 03 Shop */}
      <Box component="section" sx={{ borderTop: 1, borderColor: 'sky.line' }}>
        <Wrap sx={{ ...sectionStack, gap: '56px' }}>
          <SectionHeading index="03 — SHOP" title="器物" more={{ label: '進入小舖', href: '/shop' }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' },
              gap: { xs: '28px 16px', sm: '40px 28px' },
            }}
          >
            {!products.length && <ContentMessage error={productResult.error} empty="目前沒有上架商品。" />}
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} href={`/shop/${p.id}`} />
            ))}
          </Box>
        </Wrap>
      </Box>

      {/* 04 Booking */}
      <Box component="section" sx={{ bgcolor: 'sky.bgSoft', borderTop: 1, borderBottom: 1, borderColor: 'sky.line' }}>
        <Wrap sx={secPadding}>
          <Split>
            <Stack sx={{ gap: '20px' }}>
              <Typography variant="idx">04 — BOOKING</Typography>
              <Typography variant="sectionTitle" sx={{ letterSpacing: '.12em' }}>
                留一段時間，
                <br />
                給雙手。
              </Typography>
            </Stack>
            <Stack>
              <ServiceCatalog />
            </Stack>
          </Split>
        </Wrap>
      </Box>

      {/* 05 Journal */}
      <Wrap component="section" sx={{ ...sectionStack, gap: 6 }}>
        <SectionHeading index="05 — JOURNAL" title="日誌" more={{ label: '所有文章', href: '/journal' }} />
        <Stack sx={{ borderBottom: 1, borderColor: 'sky.line' }}>
          {!posts.length && <ContentMessage error={postResult.error} empty="目前沒有已發布文章。" />}
          {posts.slice(0, 3).map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </Stack>
      </Wrap>
    </>
  );
}
