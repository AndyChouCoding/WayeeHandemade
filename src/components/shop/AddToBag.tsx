'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { useState } from 'react';
import LineButton from '../LineButton';

const stepSx = { width: 44, height: 48, fontSize: 18, color: 'sky.ink', '&:disabled': { color: 'sky.line' } } as const;

/** Quantity stepper and add-to-bag button — visual only, no cart yet. */
export default function AddToBag() {
  const [qty, setQty] = useState(1);

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'sky.line' }}>
        <ButtonBase aria-label="減少數量" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} sx={stepSx}>−</ButtonBase>
        <Box component="output" aria-live="polite" sx={{ minWidth: 32, textAlign: 'center', fontSize: 15 }}>{qty}</Box>
        <ButtonBase aria-label="增加數量" onClick={() => setQty((q) => q + 1)} sx={stepSx}>+</ButtonBase>
      </Box>
      <LineButton disabled sx={{ flex: 1, minWidth: 200 }}>線上購買尚未開放</LineButton>
    </Box>
  );
}
