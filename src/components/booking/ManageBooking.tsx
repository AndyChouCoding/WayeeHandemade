'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { type FormEvent, useRef, useState } from 'react';
import { bookingRequest, errorMessage, type Booking } from '@/lib/booking';
import LineButton from '../LineButton';
import BookingSummary from './BookingSummary';

export default function ManageBooking() {
  const [token, setToken] = useState('');
  const [booking, setBooking] = useState<Booking>();
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [reason, setReason] = useState('');

  async function manage(cancel: boolean) {
    if (lock.current) return;
    if (!/^[A-Za-z0-9_-]{43}$/.test(token.trim())) { setMessage('請輸入完整的 43 字元管理碼。'); return; }
    lock.current = true; setBusy(true); setMessage('');
    if (!cancel) setBooking(undefined);
    try {
      setBooking(await bookingRequest<Booking>(cancel ? 'manage/cancel' : 'manage', { body: { token: token.trim(), ...(cancel ? { reason: reason.trim() } : {}) } }));
    } catch (error) { setMessage(errorMessage(error, 'manage')); if (cancel) setBooking(undefined); }
    finally { lock.current = false; setBusy(false); setConfirm(false); }
  }

  function submit(event: FormEvent) { event.preventDefault(); void manage(false); }
  return <Stack spacing={3}>
    <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 3 }}>
      <TextField label="預約管理碼" required value={token} disabled={busy} onChange={(e) => { setToken(e.target.value); setBooking(undefined); setMessage(''); setReason(''); }} autoComplete="off" slotProps={{ htmlInput: { maxLength: 43, spellCheck: false, autoCapitalize: 'none' } }} helperText="請貼上預約成功時提供的管理碼。預約結束後管理碼即失效。" />
      <LineButton type="submit" disabled={busy}>{busy ? '處理中…' : '查詢預約'}</LineButton>
    </Box>
    {message && <Alert severity="warning">{message}</Alert>}
    {booking && <><BookingSummary booking={booking} />{booking.cancellable ? <LineButton onClick={() => setConfirm(true)} disabled={busy}>取消預約</LineButton> : <Alert severity="info">這筆預約目前無法線上取消。如需協助，請聯絡工作室。</Alert>}</>}
    <Dialog open={confirm} onClose={() => { if (!busy) setConfirm(false); }} aria-labelledby="cancel-title" fullWidth maxWidth="sm">
      <DialogTitle id="cancel-title">確定要取消預約？</DialogTitle>
      <DialogContent><TextField label="取消原因（選填）" fullWidth multiline value={reason} disabled={busy} onChange={(e) => setReason(e.target.value)} slotProps={{ htmlInput: { maxLength: 500 } }} sx={{ mt: 1 }} /></DialogContent>
      <DialogActions><LineButton disabled={busy} onClick={() => setConfirm(false)}>保留預約</LineButton><LineButton disabled={busy} onClick={() => void manage(true)}>{busy ? '取消中…' : '確定取消'}</LineButton></DialogActions>
    </Dialog>
  </Stack>;
}
