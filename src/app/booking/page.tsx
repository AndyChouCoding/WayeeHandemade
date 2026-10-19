import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import BookingForm from '@/components/booking/BookingForm';
import Faq from '@/components/booking/Faq';
import PageHeader from '@/components/PageHeader';
import Placeholder from '@/components/Placeholder';
import Split from '@/components/Split';
import Wrap, { secPadding } from '@/components/Wrap';
import { services } from '@/data/services';
import { fonts } from '@/theme/theme';

export const metadata: Metadata = { title: '預約' };

const idx = ['01', '02', '03'];

export default function BookingPage() {
  return (
    <>
      <PageHeader index="BOOKING" title="預約" en="make time for your hands">
        <p style={{ margin: 0 }}>[預約說明：課程與客製的流程、工作室位置、預約須知]</p>
      </PageHeader>

      {/* Services */}
      <Wrap component="section" aria-label="預約項目" sx={{ ...secPadding, display: 'flex', flexDirection: 'column', gap: { xs: '72px', sm: '104px' } }}>
        {services.map((s, i) => (
          <Box key={s.id} id={s.id} sx={{ scrollMarginTop: '100px' }}>
            <Split sx={{ alignItems: 'start', gridTemplateColumns: { md: 'repeat(2, minmax(0,1fr))' } }}>
              <Placeholder deep={i % 2 === 1} label="課程照片" sx={{ aspectRatio: '4 / 3', order: { md: i % 2 } }} />
              <Stack sx={{ gap: 3 }}>
                <Typography variant="idx">{idx[i]} — {s.id.toUpperCase()}</Typography>
                <Box component="h2" sx={{ m: 0, fontFamily: fonts.serif, fontWeight: 400, fontSize: 30, letterSpacing: '.14em' }}>
                  {s.title}
                </Box>
                <Typography sx={{ color: 'sky.body' }}>{s.summary}</Typography>
                <Box component="dl" sx={{ m: 0, borderBottom: 1, borderColor: 'sky.line' }}>
                  {s.details.map((d) => (
                    <Box key={d.label} sx={{ display: 'grid', gridTemplateColumns: '96px minmax(0,1fr)', py: 2, borderTop: 1, borderColor: 'sky.line', fontSize: 14 }}>
                      <Box component="dt" sx={{ letterSpacing: '.2em', color: 'sky.muted' }}>{d.label}</Box>
                      <Box component="dd" sx={{ m: 0, letterSpacing: '.1em' }}>{d.value}</Box>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Split>
          </Box>
        ))}
      </Wrap>

      {/* Form */}
      <Box component="section" id="form" sx={{ bgcolor: 'sky.bgSoft', borderTop: 1, borderBottom: 1, borderColor: 'sky.line' }}>
        <Wrap sx={secPadding}>
          <Split>
            <Stack sx={{ gap: '20px' }}>
              <Typography variant="idx">FORM</Typography>
              <Typography variant="sectionTitle" sx={{ letterSpacing: '.12em' }}>
                留下你的
                <br />
                預約資訊。
              </Typography>
              <Typography variant="body2" sx={{ color: 'sky.muted', mt: 1 }}>
                [填寫後會以 Email 確認時間與費用]
              </Typography>
            </Stack>
            <BookingForm />
          </Split>
        </Wrap>
      </Box>

      {/* FAQ */}
      <Wrap component="section" sx={secPadding}>
        <Split>
          <Stack sx={{ gap: '20px' }}>
            <Typography variant="idx">FAQ</Typography>
            <Typography variant="sectionTitle" sx={{ letterSpacing: '.12em' }}>常見問題</Typography>
          </Stack>
          <Faq />
        </Split>
      </Wrap>
    </>
  );
}
