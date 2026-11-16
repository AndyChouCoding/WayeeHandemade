export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { contentList } from '@/lib/content-server';
import { productView } from '@/lib/content';
import ContentMessage from '@/components/ContentMessage';
import PageHeader from '@/components/PageHeader';
import ShopGrid from '@/components/shop/ShopGrid';
import ShopInfo from '@/components/shop/ShopInfo';
import Wrap, { secPadding } from '@/components/Wrap';

export const metadata: Metadata = { title: '器物' };

export default async function ShopPage() {
  const result = await contentList('products');
  const products = result.data?.map(productView) ?? [];
  return (
    <>
      <PageHeader index="SHOP" title="器物" en="objects for everyday">
        <p style={{ margin: 0 }}>一針一線、一筆一點完成的手作器物，每件都保留獨一無二的細節。</p>
      </PageHeader>
      <Wrap component="section" sx={secPadding}>
        {products.length ? <ShopGrid products={products} /> : <ContentMessage error={result.error} empty="目前沒有上架商品。" />}
      </Wrap>
      <ShopInfo />
    </>
  );
}
