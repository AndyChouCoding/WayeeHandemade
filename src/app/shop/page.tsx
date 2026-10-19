import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ShopGrid from '@/components/shop/ShopGrid';
import ShopInfo from '@/components/shop/ShopInfo';
import Wrap, { secPadding } from '@/components/Wrap';

export const metadata: Metadata = { title: '器物' };

export default function ShopPage() {
  return (
    <>
      <PageHeader index="SHOP" title="器物" en="objects for everyday">
        <p style={{ margin: 0 }}>[小舖介紹：器物的用途、每件都是手作、數量不多]</p>
      </PageHeader>
      <Wrap component="section" sx={secPadding}>
        <ShopGrid />
      </Wrap>
      <ShopInfo />
    </>
  );
}
