import { fetchContent, type ContentEntry, type ContentKind } from './content';
const env = () => ({ STUDIO_API_URL: process.env.STUDIO_API_URL, STUDIO_TENANT_SLUG: process.env.STUDIO_TENANT_SLUG });
export const contentList = (kind: ContentKind) => fetchContent<ContentEntry[]>(kind, undefined, env());
export const contentDetail = (kind: ContentKind, slug: string) => fetchContent<ContentEntry>(kind, slug, env());
