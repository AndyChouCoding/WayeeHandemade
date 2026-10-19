import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { shopInfo } from '@/data/shopInfo';
import { fonts } from '@/theme/theme';
import Split from '../Split';
import Wrap, { secPadding } from '../Wrap';

export default function ShopInfo() {
  return (
    <Box component="section" sx={{ bgcolor: 'sky.bgSoft', borderTop: 1, borderColor: 'sky.line' }}>
      <Wrap sx={secPadding}>
        <Split>
          <Stack sx={{ gap: '20px' }}>
            <Typography variant="idx">NOTICE</Typography>
            <Typography variant="sectionTitle" sx={{ letterSpacing: '.12em' }}>購物須知</Typography>
          </Stack>
          <Stack sx={{ borderBottom: 1, borderColor: 'sky.line' }}>
            {shopInfo.map((item) => (
              <Box
                key={item.title}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: '140px minmax(0,1fr)' },
                  gap: { xs: '6px', sm: 3 },
                  alignItems: 'baseline',
                  py: { xs: '22px', sm: '28px' },
                  borderTop: 1,
                  borderColor: 'sky.line',
                }}
              >
                <Box component="span" sx={{ fontFamily: fonts.serif, fontSize: 19, letterSpacing: '.14em' }}>{item.title}</Box>
                <Box component="span" sx={{ fontSize: 14, lineHeight: 1.9, color: 'sky.muted' }}>{item.body}</Box>
              </Box>
            ))}
          </Stack>
        </Split>
      </Wrap>
    </Box>
  );
}
