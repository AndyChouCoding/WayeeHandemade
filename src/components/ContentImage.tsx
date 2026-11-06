import Box from '@mui/material/Box';
import Placeholder from './Placeholder';
export default function ContentImage({ url, alt, ratio = '1 / 1' }: { url?: string; alt: string; ratio?: string }) {
  if (!url) return <Placeholder label="尚無圖片" sx={{ aspectRatio: ratio }} />;
  return <Box component="img" src={url} alt={alt} sx={{ width: '100%', aspectRatio: ratio, objectFit: 'cover', display: 'block' }} />;
}
