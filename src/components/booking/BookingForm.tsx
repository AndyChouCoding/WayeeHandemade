'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { type FormEvent, useState } from 'react';
import { services } from '@/data/services';
import LineButton from '../LineButton';

const fieldSx = {
  '& .MuiInputLabel-root': { fontSize: 14, letterSpacing: '.2em', color: 'sky.muted' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'sky.ink' },
  '& .MuiInputBase-root': { fontSize: 15, color: 'sky.ink', fontWeight: 300 },
  '& .MuiInputBase-input': { py: '10px' },
  '& .MuiInput-underline:before': { borderBottomColor: 'sky.line' },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'sky.ink', borderBottomWidth: 1 },
  '& .MuiInput-underline:after': { borderBottomColor: 'sky.ink', borderBottomWidth: 1 },
} as const;

/** Booking request form — visual only, submission is not wired up yet. */
export default function BookingForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))' }, gap: '36px 32px' }}
    >
      <TextField variant="standard" label="姓名" name="name" required sx={fieldSx} />
      <TextField variant="standard" label="Email" name="email" type="email" required sx={fieldSx} />
      <TextField
        variant="standard"
        select
        label="預約項目"
        name="service"
        defaultValue={services[0].id}
        sx={fieldSx}
        slotProps={{ select: { MenuProps: { slotProps: { paper: { sx: { bgcolor: 'sky.paper', borderRadius: 0 } } } } } }}
      >
        {services.map((s) => (
          <MenuItem key={s.id} value={s.id} sx={{ fontSize: 15, letterSpacing: '.12em' }}>
            {s.title}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        variant="standard"
        label="人數"
        name="people"
        type="number"
        defaultValue={1}
        slotProps={{ htmlInput: { min: 1 } }}
        sx={fieldSx}
      />
      <TextField
        variant="standard"
        label="希望日期"
        name="date"
        type="date"
        slotProps={{ inputLabel: { shrink: true } }}
        sx={fieldSx}
      />
      <TextField
        variant="standard"
        label="希望時段"
        name="time"
        select
        defaultValue="afternoon"
        sx={fieldSx}
        slotProps={{ select: { MenuProps: { slotProps: { paper: { sx: { bgcolor: 'sky.paper', borderRadius: 0 } } } } } }}
      >
        <MenuItem value="morning" sx={{ fontSize: 15 }}>上午</MenuItem>
        <MenuItem value="afternoon" sx={{ fontSize: 15 }}>下午</MenuItem>
        <MenuItem value="evening" sx={{ fontSize: 15 }}>晚上</MenuItem>
      </TextField>
      <TextField
        variant="standard"
        label="想說的話"
        name="message"
        multiline
        minRows={3}
        sx={{ ...fieldSx, gridColumn: '1 / -1' }}
      />
      <Box sx={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <LineButton type="submit">
          送出預約 <span aria-hidden="true">→</span>
        </LineButton>
        <Typography role="status" variant="body2" sx={{ color: 'sky.muted' }}>
          {sent ? '已收到（示意）—線上預約即將開放，目前請先透過 Email 聯繫。' : '收到後會在 [X] 個工作天內回覆確認。'}
        </Typography>
      </Box>
    </Box>
  );
}
