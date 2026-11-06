import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import type { Product } from '@/data/products';
import ContentImage from './ContentImage';

type Props = { product: Product; href?: string; showNote?: boolean };

export default function ProductCard({ product, href = '/shop', showNote }: Props) {
  return (
    <Link href={href} sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <ContentImage url={product.images?.[0]?.url} alt={product.name} />
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
