'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

type Props<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

/** Text tabs with an underline on the selected option. */
export default function FilterTabs<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <Box role="group" aria-label={label} sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: '4px 20px', sm: '4px 32px' } }}>
      {options.map((opt) => {
        const selected = opt === value;
        return (
          <ButtonBase
            key={opt}
            aria-pressed={selected}
            onClick={() => onChange(opt)}
            sx={{
              minHeight: 44,
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 300,
              letterSpacing: '.22em',
              color: selected ? 'sky.ink' : 'sky.muted',
              borderBottom: 1,
              borderColor: selected ? 'sky.ink' : 'transparent',
              transition: 'color .2s, border-color .2s',
              '&:hover': { color: 'sky.ink' },
              '&.Mui-focusVisible': { outline: '1px solid', outlineOffset: 4 },
            }}
          >
            {opt}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
