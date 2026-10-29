import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import BookingExperience from '@/components/booking/BookingExperience';
import Faq from '@/components/booking/Faq';
import PageHeader from '@/components/PageHeader';
import Split from '@/components/Split';
import Wrap, { secPadding } from '@/components/Wrap';

export const metadata: Metadata = { title: '預約' };

export default function BookingPage() {
  return (
    <>
      <PageHeader index="BOOKING" title="預約" en="make time for your hands">
        <p style={{ margin: 0 }}>選擇喜歡的手作服務與可預約時間，留一段時間給雙手。</p>
      </PageHeader>

      <BookingExperience />

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
