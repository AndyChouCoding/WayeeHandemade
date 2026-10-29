import { proxyBooking } from '@/lib/booking-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ path: string[] }> };
async function handle(request: Request, context: Context) {
  return proxyBooking(request, (await context.params).path, {
    STUDIO_API_URL: process.env.STUDIO_API_URL,
    STUDIO_TENANT_SLUG: process.env.STUDIO_TENANT_SLUG,
  });
}
export { handle as GET, handle as POST };
