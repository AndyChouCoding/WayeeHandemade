'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LineButton from '../LineButton';
import Split from '../Split';
import Wrap, { secPadding } from '../Wrap';
import BookingForm from './BookingForm';
import { ServiceList } from './ServiceCatalog';
import { useCatalog } from './useCatalog';

export default function BookingExperience() {
  const { data, error, retry } = useCatalog();
  if (error) return <Wrap sx={secPadding}><Stack spacing={2}><Alert severity="warning">{error}</Alert><LineButton onClick={retry}>重新載入服務</LineButton></Stack></Wrap>;
  if (!data) return <Wrap sx={secPadding}><Typography role="status">正在載入預約服務…</Typography></Wrap>;
  return <>
    <Wrap component="section" aria-label="預約項目" sx={secPadding}><ServiceList services={data.services} detailed /></Wrap>
    <Box component="section" id="form" sx={{ bgcolor: 'sky.bgSoft', borderTop: 1, borderBottom: 1, borderColor: 'sky.line' }}>
      <Wrap sx={secPadding}><Split>
        <Stack spacing={3}><Typography variant="idx">FORM</Typography><Typography variant="sectionTitle">留下你的<br />預約資訊。</Typography><Typography>選擇服務、老師與可預約時間，送出後請保存管理碼。</Typography><LineButton href="/booking/manage">查詢或取消預約</LineButton></Stack>
        <BookingForm catalog={data} />
      </Split></Wrap>
    </Box>
  </>;
}
