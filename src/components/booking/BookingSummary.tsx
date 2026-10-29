'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { bookingStatuses, formatPrice, type Booking } from '@/lib/booking';

export default function BookingSummary({ booking }: { booking: Booking }) {
  return <Box sx={{ p: 3, border: 1, borderColor: 'sky.line', display: 'grid', gap: 1 }} aria-label="預約詳情">
    <Typography variant="h6">{booking.serviceName}</Typography>
    <Typography>預約狀態：{bookingStatuses[booking.status]}</Typography>
    <Typography>老師：{booking.staff.displayName}</Typography>
    <Typography>時間：{booking.startLocal.replace('T', ' ')}–{booking.endLocal.replace('T', ' ')}（工作室當地時間）</Typography>
    <Typography>服務費用：{formatPrice(booking.priceAmount, booking.currency)}</Typography>
    <Typography>線上取消期限：{booking.cancelDeadlineLocal.replace('T', ' ')}</Typography>
    <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>預約編號：{booking.id}</Typography>
  </Box>;
}
