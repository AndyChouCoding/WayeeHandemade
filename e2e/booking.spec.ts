import { expect, test, type Page } from '@playwright/test';

const tenant = { name: '測試工作室', slug: 'test', timezone: 'Asia/Taipei', currency: 'TWD', minLeadMinutes: 0, maxAdvanceDays: 365, cancelCutoffMinutes: 60, requireConfirmation: false };
const services = [{ id: 'service-a', name: '羊毛氈體驗', description: '一起慢慢戳羊毛', durationMin: 60, priceAmount: 800, currency: 'TWD' }, { id: 'service-b', name: '曼陀羅', description: '點點畫', durationMin: 90, priceAmount: 1200, currency: 'TWD' }];
const staff = [{ id: 'teacher-a', displayName: '小雨', title: '老師', serviceIds: ['service-a'] }, { id: 'teacher-b', displayName: '小晴', title: '老師', serviceIds: ['service-b'] }];
const date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
const otherDate = new Date(Date.now() + 8 * 86400000).toISOString().slice(0, 10);
const slot = (day: string, teacher = 'teacher-a') => ({ staffId: teacher, start: `${day}T02:00:00.000Z`, end: `${day}T03:00:00.000Z`, startLocal: `${day}T10:00` });
async function mock(page: Page, empty = false) {
  await page.route('**/api/booking/**', async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.split('/api/booking/')[1];
    const data = path === 'studio' ? tenant : path === 'services' ? empty ? [] : services : path === 'staff' ? staff : path === 'availability' ? { timezone: tenant.timezone, slots: [slot(url.searchParams.get('from')!)] } : { code: 'UNEXPECTED_REQUEST' };
    await route.fulfill({ json: data });
  });
}

test('reads catalog, sends actual slot and people note, blocks double submit, preserves management code', async ({ page }) => {
  await mock(page);
  let calls = 0;
  await page.route('**/api/booking/bookings', async (route) => {
    calls++;
    const body = route.request().postDataJSON();
    expect(body).toMatchObject({ serviceId: 'service-a', staffId: 'teacher-a', start: `${date}T02:00:00.000Z`, customer: { name: '測試客人', email: 'guest@example.test' } });
    expect(body.note).toContain('需求人數：3 人');
    expect(body).not.toHaveProperty('people');
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.fulfill({ status: 201, json: { manageToken: 't'.repeat(43), booking: { id: 'booking-a', serviceName: '羊毛氈體驗', staff: staff[0], startLocal: `${date}T10:00`, endLocal: `${date}T11:00`, status: 'confirmed', priceAmount: 800, currency: 'TWD', cancellable: true, cancelDeadlineLocal: `${date}T09:00` } } });
  });
  await page.goto('/booking');
  await page.getByRole('textbox', { name: '姓名', exact: true }).fill('測試客人');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('guest@example.test');
  await page.getByRole('spinbutton', { name: '需求人數', exact: true }).fill('3');
  await page.getByLabel(/^預約日期/).fill(date);
  await page.getByRole('combobox', { name: '可預約時段' }).selectOption(`${date}T02:00:00.000Z|teacher-a`);
  await page.getByRole('button', { name: '送出預約', exact: true }).click();
  await expect(page.getByRole('button', { name: '正在送出…' })).toBeDisabled();
  await page.locator('#form form').evaluate((form) => (form as HTMLFormElement).requestSubmit());
  await expect(page.getByRole('textbox', { name: '預約管理碼', exact: true })).toHaveValue('t'.repeat(43));
  expect(calls).toBe(1);
  expect(page.url()).not.toContain('tttt');
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('409 refreshes slots and does not claim success', async ({ page }) => {
  await mock(page);
  await page.route('**/api/booking/bookings', (route) => route.fulfill({ status: 409, json: { code: 'SLOT_UNAVAILABLE' } }));
  await page.goto('/booking');
  await page.getByRole('textbox', { name: '姓名', exact: true }).fill('客人');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('guest@example.test');
  await page.getByLabel(/^預約日期/).fill(date);
  await page.getByRole('combobox', { name: '可預約時段' }).selectOption(`${date}T02:00:00.000Z|teacher-a`);
  await page.getByRole('button', { name: '送出預約', exact: true }).click();
  await expect(page.getByText('這個時段剛被預約，請重新選擇可預約時段。')).toBeVisible();
  await expect(page.getByRole('button', { name: '送出預約', exact: true })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: '預約管理碼', exact: true })).toHaveCount(0);
});

test('slow old dates cannot replace a new selection; changing service clears teacher and slot', async ({ page }) => {
  await mock(page);
  await page.route('**/api/booking/availability?**', async (route) => {
    const url = new URL(route.request().url());
    const day = url.searchParams.get('from')!;
    if (day === date) await new Promise((resolve) => setTimeout(resolve, 600));
    await route.fulfill({ json: { timezone: tenant.timezone, slots: day === otherDate ? [] : [slot(day)] } }).catch(() => {});
  });
  await page.goto('/booking');
  await page.getByLabel(/^預約日期/).fill(date);
  await page.getByLabel(/^預約日期/).fill(otherDate);
  await expect(page.getByText('這一天沒有可預約時段，請選其他日期或老師。')).toBeVisible();
  await page.waitForTimeout(800);
  await expect(page.getByRole('combobox', { name: '可預約時段' })).toBeDisabled();
  await page.getByRole('combobox', { name: '老師', exact: true }).selectOption('teacher-a');
  await page.getByRole('combobox', { name: '預約項目', exact: true }).selectOption('service-b');
  await expect(page.getByRole('combobox', { name: '老師', exact: true })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: '老師', exact: true }).locator('option[value="teacher-a"]')).toHaveCount(0);
});

test('empty catalog and API failure offer honest fallback and retry', async ({ page }) => {
  await mock(page, true);
  await page.goto('/booking');
  await expect(page.getByText('目前沒有開放預約的服務，請稍後再來看看。')).toBeVisible();
  await expect(page.getByRole('button', { name: '送出預約' })).toHaveCount(0);
  await page.route('**/api/booking/studio', (route) => route.fulfill({ status: 502, json: { code: 'UPSTREAM_UNAVAILABLE' } }));
  await page.reload();
  await expect(page.getByText('暫時無法連線，請稍後重試。')).toBeVisible();
  await expect(page.getByRole('button', { name: '重新載入服務' })).toBeVisible();
});

test('invalid or expired management code and cancellation cutoff never show stale booking', async ({ page }) => {
  await page.route('**/api/booking/manage', (route) => route.fulfill({ status: 404, json: {} }));
  await page.goto('/booking/manage');
  await page.getByRole('textbox', { name: '預約管理碼', exact: true }).fill('x'.repeat(43));
  await page.getByRole('button', { name: '查詢預約' }).click();
  await expect(page.getByText('找不到預約，管理碼可能有誤或預約已結束。')).toBeVisible();
  await page.route('**/api/booking/manage', (route) => route.fulfill({ json: { id: 'a', serviceName: '羊毛氈', staff: staff[0], startLocal: `${date}T10:00`, endLocal: `${date}T11:00`, status: 'confirmed', priceAmount: 800, currency: 'TWD', cancellable: true, cancelDeadlineLocal: `${date}T09:00` } }));
  await page.getByRole('button', { name: '查詢預約' }).click();
  await page.getByRole('button', { name: '取消預約', exact: true }).click();
  await page.route('**/api/booking/manage/cancel', (route) => route.fulfill({ status: 409, json: { code: 'CANCEL_CUTOFF_PASSED' } }));
  await page.getByRole('button', { name: '確定取消', exact: true }).click();
  await expect(page.getByText('已超過線上取消期限，請聯絡工作室。')).toBeVisible();
  await expect(page.getByRole('button', { name: '取消預約', exact: true })).toHaveCount(0);
});
