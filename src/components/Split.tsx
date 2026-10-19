import Box, { type BoxProps } from '@mui/material/Box';

/** 5 : 7 two-column layout — `.split` in the design. */
export default function Split({ sx, ...props }: BoxProps) {
  return (
    <Box
      {...props}
      sx={[
        {
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,5fr) minmax(0,7fr)' },
          gap: { xs: '40px', md: '80px' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
