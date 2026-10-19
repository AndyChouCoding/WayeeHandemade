/** Bordered list row — `.row` in the design. Title elements carry the `rt` class. */
export const rowSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: '140px minmax(0,1fr) 120px' },
  gap: { xs: '6px', sm: 3 },
  alignItems: 'baseline',
  py: { xs: '22px', sm: '28px' },
  borderTop: 1,
  borderColor: 'sky.line',
  '&:hover .rt': { color: 'sky.accent' },
} as const;
