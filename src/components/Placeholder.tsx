import Box, { type BoxProps } from '@mui/material/Box';

type Props = BoxProps & { deep?: boolean; label?: string };

/** Image placeholder block — `.ph` / `.ph-2` in the design. */
export default function Placeholder({ deep, label = '作品照片', sx, ...props }: Props) {
  return (
    <Box
      {...props}
      sx={[
        {
          bgcolor: deep ? 'sky.paperDeep' : 'sky.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'sky.muted',
          fontSize: 12,
          letterSpacing: '.24em',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {label}
    </Box>
  );
}
