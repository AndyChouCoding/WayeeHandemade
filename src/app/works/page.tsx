import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import LineButton from '@/components/LineButton';
import PageHeader from '@/components/PageHeader';
import Split from '@/components/Split';
import WorksGallery from '@/components/works/WorksGallery';
import Wrap, { secPadding } from '@/components/Wrap';

export const metadata: Metadata = { title: '作品' };

export default function WorksPage() {
  return (
    <>
      <PageHeader index="WORKS" title="作品" en="works & pieces">
        <p style={{ margin: 0 }}>[作品頁介紹：這裡收錄的作品類型、創作的時間與想法]</p>
      </PageHeader>

      <Wrap component="section" sx={secPadding}>
        <WorksGallery />
      </Wrap>

      <Box component="section" sx={{ bgcolor: 'sky.bgSoft', borderTop: 1, borderColor: 'sky.line' }}>
        <Wrap sx={secPadding}>
          <Split sx={{ alignItems: 'center' }}>
            <Stack sx={{ gap: '20px' }}>
              <Typography variant="idx">CUSTOM</Typography>
              <Typography variant="sectionTitle" sx={{ letterSpacing: '.12em' }}>
                想要一件
                <br />
                只屬於你的？
              </Typography>
            </Stack>
            <Stack sx={{ gap: 4, alignItems: 'flex-start' }}>
              <Typography sx={{ color: 'sky.body' }}>[客製說明：可以依照喜好調整的部分、大約的製作時間]</Typography>
              <LineButton href="/booking#custom">客製化諮詢 <span aria-hidden="true">→</span></LineButton>
            </Stack>
          </Split>
        </Wrap>
      </Box>
    </>
  );
}
