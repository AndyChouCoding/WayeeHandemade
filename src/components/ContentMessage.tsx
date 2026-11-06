import Typography from '@mui/material/Typography';
export default function ContentMessage({ error, empty }: { error: string | null; empty: string }) {
  return <Typography role={error ? 'alert' : 'status'} sx={{ py: 3 }}>{error ? '內容暫時無法載入，請稍後重新整理。' : empty}</Typography>;
}
