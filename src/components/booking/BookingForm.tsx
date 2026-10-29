'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { addDays, bookingNote, bookingRequest, BookingError, errorMessage, formatPrice, localDate, type Availability, type Catalog, type CreatedBooking } from '@/lib/booking';
import LineButton from '../LineButton';
import BookingSummary from './BookingSummary';

const fieldSx = {
  '& .MuiInputLabel-root': { fontSize: 14, color: 'sky.muted' },
  '& .MuiInputBase-root': { fontSize: 15, color: 'sky.ink', fontWeight: 300 },
  '& .MuiInputBase-input': { py: '10px' },
  '& .MuiInput-underline:before': { borderBottomColor: 'sky.line' },
};
const menuProps = { select: { native: true } } as const;

export default function BookingForm({ catalog }: { catalog: Catalog }) {
  const { tenant, services, staff } = catalog;
  const [serviceId, setServiceId] = useState(services[0]?.id ?? '');
  const [staffId, setStaffId] = useState('');
  const today = localDate(new Date(), tenant.timezone);
  const [date, setDate] = useState(today);
  const [selected, setSelected] = useState('');
  const [revision, setRevision] = useState(0);
  const [availability, setAvailability] = useState<{ key: string; data?: Availability; error?: string }>();
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [message, setMessage] = useState('');
  const [created, setCreated] = useState<CreatedBooking>();
  const service = services.find((s) => s.id === serviceId);
  const providers = staff.filter((s) => s.serviceIds.includes(serviceId));
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today && date <= addDays(today, tenant.maxAdvanceDays);
  const key = JSON.stringify([serviceId, staffId, date, revision]);
  const current = availability?.key === key ? availability : undefined;
  const slots = current?.data?.slots ?? [];
  const slot = slots.find((s) => `${s.start}|${s.staffId}` === selected);

  useEffect(() => {
    if (!serviceId || !validDate) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ serviceId, from: date, to: date });
    if (staffId) query.set('staffId', staffId);
    bookingRequest<Availability>(`availability?${query}`, { signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setAvailability({ key, data }); })
      .catch((error) => { if (!controller.signal.aborted) setAvailability({ key, error: errorMessage(error) }); });
    return () => controller.abort();
  }, [serviceId, staffId, date, key, validDate]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !slot || !service) return;
    const form = new FormData(event.currentTarget);
    let note: string;
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    if (!name) { setMessage('請填寫姓名。'); return; }
    try { note = bookingNote(Number(form.get('people')), String(form.get('message') ?? '')); }
    catch (error) { setMessage((error as Error).message); return; }
    submitting.current = true;
    setBusy(true); setMessage('');
    try {
      setCreated(await bookingRequest<CreatedBooking>('bookings', {
        body: { serviceId, staffId: slot.staffId, start: slot.start, customer: { name, email }, note },
      }));
    } catch (error) {
      setMessage(errorMessage(error, 'book'));
      if (error instanceof BookingError && error.status === 409) { setSelected(''); setRevision((n) => n + 1); }
    } finally { setBusy(false); submitting.current = false; }
  }

  if (created) return <Stack spacing={3} role="status">
    <Alert severity="success">{created.booking.status === 'pending' ? '預約已送出，等待工作室確認。' : '預約成功。'}</Alert>
    <BookingSummary booking={created.booking} />
    <TextField label="預約管理碼" value={created.manageToken} slotProps={{ input: { readOnly: true } }} />
    <Typography>請複製並妥善保存管理碼，離開此頁後不會保留。憑此碼可查詢及取消預約，請勿公開分享。</Typography>
    <Typography variant="body2">多人需求與團體費用仍須由工作室確認。</Typography>
    <LineButton href="/booking/manage">查詢或取消預約</LineButton>
  </Stack>;

  if (!services.length) return null;
  return <Box component="form" onSubmit={submit} sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2,minmax(0,1fr))' }, gap: '32px' }}>
    <TextField variant="standard" label="姓名" name="name" required disabled={busy} autoComplete="name" slotProps={{ htmlInput: { maxLength: 100 } }} sx={fieldSx} />
    <TextField variant="standard" label="Email" name="email" type="email" required disabled={busy} autoComplete="email" slotProps={{ htmlInput: { maxLength: 254 } }} sx={fieldSx} />
    <TextField variant="standard" select label="預約項目" value={serviceId} disabled={busy} onChange={(e) => { setServiceId(e.target.value); setStaffId(''); setSelected(''); setMessage(''); }} slotProps={menuProps} sx={fieldSx}>
      {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
    </TextField>
    <TextField variant="standard" select label="老師" value={staffId} disabled={busy} onChange={(e) => { setStaffId(e.target.value); setSelected(''); }} slotProps={menuProps} sx={fieldSx}>
      <option value="">不限老師</option>{providers.map((s) => <option key={s.id} value={s.id}>{s.displayName}{s.title ? ` · ${s.title}` : ''}</option>)}
    </TextField>
    <TextField variant="standard" label="需求人數" name="people" type="number" required defaultValue={1} disabled={busy} slotProps={{ htmlInput: { min: 1, max: 999, step: 1 } }} helperText="僅記錄需求，非團體名額保證；費用另行確認。" sx={fieldSx} />
    <TextField variant="standard" label="預約日期" type="date" required value={date} disabled={busy} onChange={(e) => { setDate(e.target.value); setSelected(''); }} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today, max: addDays(today, tenant.maxAdvanceDays) } }} sx={fieldSx} />
    <TextField variant="standard" select label="可預約時段" required value={selected} disabled={busy || !slots.length} onChange={(e) => setSelected(e.target.value)} slotProps={menuProps} sx={{ ...fieldSx, gridColumn: '1 / -1' }}>
      <option value="">請選擇時段</option>
      {slots.map((s) => <option key={`${s.start}|${s.staffId}`} value={`${s.start}|${s.staffId}`}>{s.startLocal.slice(11, 16)} · {staff.find((p) => p.id === s.staffId)?.displayName ?? '老師'}</option>)}
    </TextField>
    <Stack spacing={1} sx={{ gridColumn: '1 / -1' }}>
      <Typography variant="body2">時間以工作室時區（{tenant.timezone}）顯示。最少提前 {tenant.minLeadMinutes} 分鐘，開放未來 {tenant.maxAdvanceDays} 天。</Typography>
      {service && <Typography>服務費用：{formatPrice(service.priceAmount, service.currency)} · {service.durationMin} 分鐘（多人費用另行確認）</Typography>}
      {!validDate ? <Typography role="status">請選擇開放範圍內的日期。</Typography> : !current ? <Typography role="status">正在載入可預約時段…</Typography> : current.error ? <Alert severity="warning" action={<LineButton onClick={() => { setSelected(''); setRevision((n) => n + 1); }}>重試</LineButton>}>{current.error}</Alert> : !slots.length ? <Typography role="status">這一天沒有可預約時段，請選其他日期或老師。</Typography> : null}
    </Stack>
    <TextField variant="standard" label="想說的話" name="message" multiline minRows={3} disabled={busy} slotProps={{ htmlInput: { maxLength: 900 } }} sx={{ ...fieldSx, gridColumn: '1 / -1' }} />
    <Stack spacing={2} sx={{ gridColumn: '1 / -1' }}>
      {message && <Alert severity="warning">{message}</Alert>}
      <LineButton type="submit" disabled={busy || !slot}>{busy ? '正在送出…' : '送出預約'}</LineButton>
      <Typography variant="body2">{tenant.requireConfirmation ? '送出後由工作室確認預約。' : '送出後以系統回覆的預約結果為準。'} 線上取消須在開始前 {tenant.cancelCutoffMinutes} 分鐘完成。</Typography>
    </Stack>
  </Box>;
}
