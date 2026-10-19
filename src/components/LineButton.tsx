import Button, { type ButtonProps } from '@mui/material/Button';

/** Outlined button that fills on hover — `.btn-line` in the design. */
export default function LineButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      variant="outlined"
      {...props}
      sx={[
        {
          gap: 2,
          minHeight: 50,
          px: '30px',
          borderRadius: 0,
          border: '1px solid',
          borderColor: 'sky.ink',
          color: 'sky.ink',
          fontSize: 14,
          fontWeight: 300,
          letterSpacing: '.24em',
          bgcolor: 'transparent',
          transition: 'background .3s, color .3s',
          '&:hover': { bgcolor: 'sky.ink', color: 'sky.bg', borderColor: 'sky.ink' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
