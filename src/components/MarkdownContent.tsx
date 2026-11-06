import Box from '@mui/material/Box';
import { inlineMarkdown } from '@/lib/markdown';
function inline(text: string) { return inlineMarkdown(text).map((part, i) => part.type === 'strong' ? <strong key={i}>{part.text}</strong> : part.type === 'link' ? <a key={i} href={part.href} rel="noopener noreferrer">{part.text}</a> : part.text); }
export default function MarkdownContent({ text }: { text: string }) {
  return <Box sx={{ overflowWrap: 'anywhere', lineHeight: 2, '& a': { textDecoration: 'underline' }, '& p': { whiteSpace: 'pre-wrap' } }}>
    {text.split(/\n\s*\n/).map((block, index) => {
      const heading = /^(#{1,3}) (.+)$/.exec(block);
      if (heading) { const Tag = heading[1].length === 1 ? 'h2' : heading[1].length === 2 ? 'h3' : 'h4'; return <Tag key={index}>{inline(heading[2])}</Tag>; }
      if (block.split('\n').every((line) => line.startsWith('- '))) return <ul key={index}>{block.split('\n').map((line, i) => <li key={i}>{inline(line.slice(2))}</li>)}</ul>;
      return <p key={index}>{inline(block)}</p>;
    })}
  </Box>;
}
