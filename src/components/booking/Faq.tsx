'use client';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { bookingFaqs } from '@/data/services';
import { fonts } from '@/theme/theme';

export default function Faq() {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'sky.line' }}>
      {bookingFaqs.map((item, i) => (
        <Accordion
          key={item.q}
          disableGutters
          elevation={0}
          square
          sx={{ bgcolor: 'transparent', borderTop: 1, borderColor: 'sky.line', '&::before': { display: 'none' } }}
        >
          <AccordionSummary
            id={`faq-${i}-header`}
            aria-controls={`faq-${i}-content`}
            expandIcon={<Box component="span" aria-hidden="true" sx={{ fontSize: 20, color: 'sky.ink' }}>+</Box>}
            sx={{
              px: 0,
              minHeight: 72,
              '& .MuiAccordionSummary-content': { my: 2.5 },
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': { transform: 'rotate(45deg)' },
              '&:hover .rt': { color: 'sky.accent' },
            }}
          >
            <Box className="rt" component="span" sx={{ fontFamily: fonts.serif, fontSize: 18, letterSpacing: '.1em' }}>
              {item.q}
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0, pb: 3.5, fontSize: 14, lineHeight: 2, color: 'sky.body' }}>
            {item.a}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
