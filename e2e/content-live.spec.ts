import { expect, test, type Page } from '@playwright/test';
const live = process.env.CMS_LIVE === 'true';
const password = process.env.CMS_TEST_PASSWORD;
async function signIn(page: Page, role = 'owner') {
  await page.goto('/admin');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(`${role}@cms-acceptance.test`);
  await page.getByRole('textbox', { name: '密碼', exact: true }).fill(password!);
  await page.getByRole('button', { name: '登入', exact: true }).click();
  await expect(page.getByRole('button', { name: '登出', exact: true })).toBeVisible();
}
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=', 'base64');
test.describe('merchant content live acceptance', () => {
  test.skip(!live || !password, 'Run AndyStudio scripts/test-content-live.cjs with the storefront checkout.');
  for (const kind of ['posts', 'products'] as const) test(`${kind}: create, image upload, publish, edit and withdraw on the real storefront`, async ({ page, context }) => {
    await signIn(page);
    const product = kind === 'products';
    await page.getByRole('link', { name: product ? '商品' : '文章', exact: true }).click();
    await page.getByRole('button', { name: product ? '新增商品' : '新增文章' }).click();
    const dialog = page.getByRole('dialog');
    const title = product ? '驗收手作杯' : '驗收工作室日誌';
    const slug = product ? 'acceptance-cup' : 'acceptance-story';
    await dialog.getByRole('textbox', { name: product ? '商品名稱' : '文章標題', exact: true }).fill(title);
    await dialog.getByRole('textbox', { name: '網址名稱', exact: true }).fill(slug);
    await dialog.getByRole('textbox', { name: '分類', exact: true }).fill('手作');
    await dialog.getByRole('textbox', { name: '摘要', exact: true }).fill('實際後台發布內容');
    await dialog.getByRole('textbox', { name: '內容（Markdown）', exact: true }).fill('# 手作故事\n\n**溫柔日常**\n\n<script>window.cmsUnsafe=true</script>\n\n[危險](javascript:alert)');
    if (product) {
      await dialog.getByRole('spinbutton', { name: '價格', exact: true }).fill('1200');
      await dialog.getByRole('textbox', { name: '材質', exact: true }).fill('陶土');
      await dialog.getByRole('textbox', { name: '尺寸', exact: true }).fill('8 公分');
      await dialog.getByRole('textbox', { name: '製作期', exact: true }).fill('兩週');
    }
    await dialog.locator('input[type=file]').setInputFiles({ name: 'image.png', mimeType: 'image/png', buffer: png });
    await expect(dialog.getByRole('img', { name: '圖片 1', exact: true })).toBeVisible();
    if (product) {
      await dialog.locator('input[type=file]').setInputFiles({ name: 'second.png', mimeType: 'image/png', buffer: png });
      await expect(dialog.getByRole('img', { name: '圖片 2', exact: true })).toBeVisible();
      await dialog.getByRole('button', { name: '圖片 2 前移' }).click();
    }
    await dialog.getByRole('button', { name: '儲存草稿' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(title, { exact: true })).toBeVisible();
    const customer = await context.newPage();
    const route = product ? '/shop' : '/journal';
    await customer.goto(`${route}/${slug}`);
    await expect(customer.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: product ? '上架' : '發布', exact: true }).click();
    await expect(page.getByText('手作 · 已發布')).toBeVisible();
    await customer.goto(`${route}/${slug}`);
    await expect(customer.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(customer.getByRole('heading', { name: '手作故事', exact: true })).toBeVisible();
    await expect(customer.getByText('<script>window.cmsUnsafe=true</script>', { exact: true })).toBeVisible();
    expect(await customer.evaluate(() => (window as unknown as { cmsUnsafe?: boolean }).cmsUnsafe)).toBeUndefined();
    await expect(customer.locator('a[href^="javascript:"]')).toHaveCount(0);
    await expect(customer.getByRole('img', { name: title }).first()).toBeVisible();
    expect(await customer.getByRole('img', { name: title }).first().evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    if (product) {
      await expect(customer.getByText('$1,200', { exact: true }).first()).toBeVisible();
      await expect(customer.getByRole('button', { name: '線上購買尚未開放' })).toBeDisabled();
    }
    await customer.goto(route);
    await expect(customer.getByText(title, { exact: true }).first()).toBeVisible();
    await customer.goto('/');
    await expect(customer.getByText(title, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '編輯', exact: true }).click();
    await page.getByRole('textbox', { name: product ? '商品名稱' : '文章標題', exact: true }).fill(title + '更新');
    await page.getByRole('button', { name: '儲存草稿' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await customer.goto(`${route}/${slug}`);
    await expect(customer.getByRole('heading', { name: title + '更新' })).toHaveCount(0);
    await page.getByRole('button', { name: product ? '上架' : '發布', exact: true }).click();
    await customer.goto(`${route}/${slug}`);
    await expect(customer.getByRole('heading', { name: title + '更新', exact: true })).toBeVisible();
    await page.getByRole('button', { name: '下架', exact: true }).click();
    await expect(page.getByText('手作 · 草稿')).toBeVisible();
    await customer.goto(`${route}/${slug}`);
    await expect(customer.getByRole('heading', { name: title + '更新' })).toHaveCount(0);
    await page.getByRole('button', { name: '封存', exact: true }).click();
    await expect(page.getByText('手作 · 已封存')).toBeVisible();
    await customer.close();
  });
  test('viewer cannot edit; editor cannot publish; mobile admin fits viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, 'viewer');
    await page.getByRole('link', { name: '文章', exact: true }).click();
    await expect(page.getByRole('button', { name: '新增文章' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '發布', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: '登出', exact: true }).click();
    await signIn(page, 'editor');
    await page.getByRole('link', { name: '文章', exact: true }).click();
    await expect(page.getByRole('button', { name: '新增文章' })).toBeVisible();
    await expect(page.getByRole('button', { name: '發布', exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });
  test('existing real booking remains usable with CMS enabled', async ({ page }) => {
    await page.goto('/booking');
    await expect(page.getByText('CMS 預約回歸', { exact: true }).first()).toBeVisible();
    await page.getByRole('textbox', { name: '姓名', exact: true }).fill('CMS 驗收客人');
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill('customer@cms-acceptance.test');
    await page.getByLabel(/^預約日期/).fill(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
    const times = page.getByRole('combobox', { name: '可預約時段' });
    await expect(times).toBeEnabled(); await times.selectOption({ index: 1 });
    await page.getByRole('button', { name: '送出預約', exact: true }).click();
    await expect(page.getByRole('textbox', { name: '預約管理碼', exact: true })).toBeVisible();
  });
});
