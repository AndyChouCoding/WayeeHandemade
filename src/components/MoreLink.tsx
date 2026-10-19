import Link, { type LinkProps } from '@mui/material/Link';

type Props = Omit<LinkProps, 'href'> & { href: string };

/** Underlined text link with a trailing dash — `.more` in the design. */
export default function MoreLink({ children, sx, ...props }: Props) {
  return (
    <Link
     
      {...props}
      sx={[
        {
          fontSize: 13,
          letterSpacing: '.24em',
          minHeight: 44,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: 1,
          borderColor: 'sky.ink',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children} <span aria-hidden="true">—</span>
    </Link>
  );
}
