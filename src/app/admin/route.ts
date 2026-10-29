import { adminPage } from '@/lib/admin-page';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET() {
  return adminPage(process.env.STUDIO_ADMIN_URL);
}
