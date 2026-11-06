export type Inline = { type: 'text' | 'strong' | 'link'; text: string; href?: string };
/** Deliberately small Markdown subset, always rendered as React text (never raw HTML). */
export function inlineMarkdown(text: string): Inline[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^\s)]+\))/g).filter(Boolean).map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) return { type: 'strong', text: part.slice(2, -2) };
    const link = /^\[([^\]]+)\]\(([^\s)]+)\)$/.exec(part);
    if (link) {
      try { const url = new URL(link[2]); if (['https:', 'http:'].includes(url.protocol)) return { type: 'link', text: link[1], href: url.href }; } catch { /* Render unsafe or relative links as text. */ }
    }
    return { type: 'text', text: part };
  });
}
