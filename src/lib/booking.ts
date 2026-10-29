export type Tenant = {
  name: string; slug: string; timezone: string; currency: string;
  minLeadMinutes: number; maxAdvanceDays: number; cancelCutoffMinutes: number; requireConfirmation: boolean;
};
export type Service = { id: string; name: string; description: string; durationMin: number; priceAmount: number; currency: string };
export type Staff = { id: string; displayName: string; title: string; serviceIds: string[] };
export type Slot = { staffId: string; start: string; end: string; startLocal: string };
export type Availability = { timezone: string; slots: Slot[] };
export type Booking = {
  id: string; serviceName: string; staff: { id: string; displayName: string };
  start: string; end: string; startLocal: string; endLocal: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  priceAmount: number; currency: string; cancellable: boolean; cancelDeadlineLocal: string;
};
export type CreatedBooking = { booking: Booking; manageToken: string };
export type Catalog = { tenant: Tenant; services: Service[]; staff: Staff[] };

export class BookingError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

export function errorMessage(error: unknown, action: 'read' | 'book' | 'manage' = 'read'): string {
  if (error instanceof BookingError) {
    if (error.status === 429) return '操作次數較多，請稍後再試。';
    if (error.status === 404) return action === 'manage' ? '找不到預約，管理碼可能有誤或預約已結束。' : '目前尚未開放線上預約，請聯絡工作室。';
    if (error.code === 'CANCEL_CUTOFF_PASSED') return '已超過線上取消期限，請聯絡工作室。';
    if (error.code === 'BOOKING_NOT_ACTIVE') return '這筆預約已無法取消，請重新查詢最新狀態。';
    if (error.status === 409) return '這個時段剛被預約，請重新選擇可預約時段。';
    if (error.status === 400) return '資料格式不正確，請檢查姓名、Email 與預約內容。';
    if (error.code === 'NOT_CONFIGURED') return '線上預約尚未設定完成，請聯絡工作室。';
  }
  return action === 'book'
    ? '暫時無法確認送出結果。請先聯絡工作室確認是否已收到預約，避免重複送出。'
    : '暫時無法連線，請稍後重試。';
}

/** No automatic retries: a timed-out mutation may already have succeeded. */
export async function bookingRequest<T>(path: string, options: { body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  const timeout = AbortSignal.timeout(20_000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
  const response = await fetch(`/api/booking/${path}`, {
    method: options.body === undefined ? 'GET' : 'POST',
    headers: options.body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store', credentials: 'omit', signal,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new BookingError(response.status, typeof data?.code === 'string' ? data.code : 'REQUEST_FAILED');
  if (data === null) throw new BookingError(502, 'INVALID_RESPONSE');
  return data as T;
}

// AndyStudio intentionally stores TWD in whole dollars (unlike ISO's two decimals).
export function formatPrice(amount: number, currency: string): string {
  const digits = currency === 'TWD' || currency === 'JPY' ? 0 : 2;
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount / 10 ** digits);
}

export function localDate(now: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (key: string) => parts.find((p) => p.type === key)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function bookingNote(people: number, message: string): string {
  if (!Number.isSafeInteger(people) || people < 1 || people > 999) throw new Error('請填寫 1–999 的整數人數。');
  const note = `需求人數：${people} 人（人數及團體費用待工作室確認）${message.trim() ? '\n' + message.trim() : ''}`;
  if (note.length > 1000) throw new Error('備註過長，請縮短內容。');
  return note;
}

export const bookingStatuses: Record<Booking['status'], string> = {
  pending: '待工作室確認', confirmed: '已確認', cancelled: '已取消', completed: '已完成', no_show: '未到場',
};
