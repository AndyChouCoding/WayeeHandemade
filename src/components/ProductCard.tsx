import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import type { Product } from '@/data/products';
import Placeholder from './Placeholder';

type Props = { product: Product; href?: string; showNote?: boolean };

export default function ProductCard({ product, href = '/shop', showNote }: Props) {
  return (
    <Link href={href} sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Placeholder deep={product.deep} label="商品照片" sx={{ aspectRatio: '1 / 1' }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: 14, letterSpacing: '.1em' }}>
        <span>{product.name}</span>
        <Box component="span" sx={{ color: 'sky.muted', flexShrink: 0 }}>{product.price}</Box>
      </Box>
      {showNote && (
        <Box component="span" sx={{ mt: '-6px', fontSize: 12, letterSpacing: '.12em', color: 'sky.muted' }}>
          {product.note}
        </Box>
      )}
    </Link>
  );
}
