import type { Metadata } from 'next';
import ManageBooking from '@/components/booking/ManageBooking';
import PageHeader from '@/components/PageHeader';
import Wrap, { secPadding } from '@/components/Wrap';

export const metadata: Metadata = { title: '查詢與取消預約', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default function ManageBookingPage() {
  return <><PageHeader index="BOOKING" title="管理預約" en="your handmade time"><p>輸入預約成功時取得的管理碼，查看最新狀態或取消預約。</p></PageHeader><Wrap sx={{ ...secPadding, maxWidth: 800 }}><ManageBooking /></Wrap></>;
}
