import Box, { type BoxProps } from '@mui/material/Box';

/** Centered content column — `.wrap` in the design. */
export default function Wrap({ sx, ...props }: BoxProps) {
  return (
    <Box
      {...props}
      sx={[
        { width: '100%', maxWidth: 1160, mx: 'auto', px: { xs: '22px', sm: '40px' } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

/** Vertical section rhythm — `.sec` in the design. */
export const secPadding = { py: { xs: '88px', sm: '136px' } } as const;
