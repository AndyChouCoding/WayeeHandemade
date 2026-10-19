import Button, { type ButtonProps } from '@mui/material/Button';

/** Outlined button that fills on hover — `.btn-line` in the design. */
export default function LineButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      variant="outlined"
      {...props}
      sx={[
        (theme) => ({
          gap: '16px',
          minHeight: 50,
          px: '30px',
          borderRadius: 0,
          border: `1px solid ${theme.palette.sky.ink}`,
          color: theme.palette.sky.ink,
          fontSize: 14,
          fontWeight: 300,
          letterSpacing: '.24em',
          bgcolor: 'transparent',
          transition: 'background .3s, color .3s',
          '&:hover': { bgcolor: theme.palette.sky.ink, color: theme.palette.sky.bg, borderColor: theme.palette.sky.ink },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
