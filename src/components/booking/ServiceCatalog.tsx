'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatPrice, type Service } from '@/lib/booking';
import LineButton from '../LineButton';
import ServiceRow from '../ServiceRow';
import Placeholder from '../Placeholder';
import Split from '../Split';
import { fonts } from '@/theme/theme';
import { useCatalog } from './useCatalog';

export function ServiceList({ services, detailed = false }: { services: Service[]; detailed?: boolean }) {
  if (!services.length) return <Typography role="status">目前沒有開放預約的服務，請稍後再來看看。</Typography>;
  if (detailed) return <Stack spacing={{ xs: 9, sm: 13 }}>{services.map((service, i) => <Box key={service.id} id={service.id} sx={{ scrollMarginTop: 100 }}>
    <Split sx={{ alignItems: 'start', gridTemplateColumns: { md: 'repeat(2, minmax(0,1fr))' } }}>
      <Placeholder deep={i % 2 === 1} label="課程照片" sx={{ aspectRatio: '4 / 3', order: { md: i % 2 } }} />
      <Stack spacing={3}>
        <Typography variant="idx">{String(i + 1).padStart(2, '0')} — HANDMADE</Typography>
        <Box component="h2" sx={{ m: 0, fontFamily: fonts.serif, fontWeight: 400, fontSize: 30, letterSpacing: '.14em' }}>{service.name}</Box>
        <Typography sx={{ color: 'sky.body', whiteSpace: 'pre-wrap' }}>{service.description}</Typography>
        <Box component="dl" sx={{ m: 0, borderBottom: 1, borderColor: 'sky.line' }}>
          {[{ label: '時長', value: `${service.durationMin} 分鐘` }, { label: '費用', value: formatPrice(service.priceAmount, service.currency) }].map((detail) => <Box key={detail.label} sx={{ display: 'grid', gridTemplateColumns: '96px minmax(0,1fr)', py: 2, borderTop: 1, borderColor: 'sky.line', fontSize: 14 }}>
            <Box component="dt" sx={{ letterSpacing: '.2em', color: 'sky.muted' }}>{detail.label}</Box><Box component="dd" sx={{ m: 0 }}>{detail.value}</Box>
          </Box>)}
        </Box>
      </Stack>
    </Split>
  </Box>)}</Stack>;
  return <Stack>{services.map((service, i) => <Box key={service.id}>
    <ServiceRow service={{ id: service.id, title: service.name, summary: `${service.durationMin} 分鐘 · ${formatPrice(service.priceAmount, service.currency)}`, details: [] }} last={i === services.length - 1} />
  </Box>)}</Stack>;
}

export default function ServiceCatalog() {
  const { data, error, retry } = useCatalog();
  if (error) return <Stack spacing={2}><Alert severity="warning">{error}</Alert><LineButton onClick={retry}>重新載入服務</LineButton></Stack>;
  if (!data) return <Typography role="status">正在載入預約服務…</Typography>;
  return <ServiceList services={data.services} />;
}
