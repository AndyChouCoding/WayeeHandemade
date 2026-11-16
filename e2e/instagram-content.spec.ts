import { expect, test } from '@playwright/test';

const demo = process.env.INSTAGRAM_DEMO === 'true';

test.describe('Instagram demo content', () => {
  test.skip(!demo, 'Run with the approved local Instagram demo tenant.');

  test('published articles render curated copy and verified images', async ({ page }) => {
    await page.goto('/journal');
    await expect(page.getByText('記錄工作室日常、作品背後的故事，以及每一次一起慢慢創作的時光。')).toBeVisible();
    await expect(page.getByRole('link', { name: /一起完成一幅畫：小小畫聚紀錄/ })).toBeVisible();
    await page.goto('/journal/ig-demo-collaborative-painting-day');
    await expect(page.getByRole('heading', { name: '一起完成一幅畫：小小畫聚紀錄' })).toBeVisible();
    await expect(page.getByText('示範資料，價格與內容以工作室公告為準。')).toBeVisible();
    await expect(page.getByRole('link', { name: '查看 Instagram 原始貼文' })).toHaveAttribute('href', /instagram\.com/);
    const images = page.getByRole('img', { name: '一起完成一幅畫：小小畫聚紀錄' });
    await expect(images).toHaveCount(4);
    for (let index = 0; index < 4; index++) {
      expect(await images.nth(index).evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  });

  test('published products show simulated fields and cleaned carousel', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.getByText('一針一線、一筆一點完成的手作器物，每件都保留獨一無二的細節。')).toBeVisible();
    await expect(page.getByText('客訂羊毛氈小羊公仔', { exact: true }).first()).toBeVisible();
    await page.goto('/shop/ig-demo-plaster-painting');
    await expect(page.getByRole('heading', { name: '親子石膏彩繪作品' })).toBeVisible();
    await expect(page.getByText('$480', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('石膏、壓克力顏料', { exact: true })).toBeVisible();
    await expect(page.getByText('約 3–7 天', { exact: true })).toBeVisible();
    const images = page.getByRole('img', { name: '親子石膏彩繪作品' });
    await expect(images).toHaveCount(3);
    for (let index = 0; index < 3; index++) {
      expect(await images.nth(index).evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  });

  test('demo courses and official contact details appear on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/booking');
    for (const name of ['曼陀羅點點杯墊（示範）', '共同創作畫聚（示範）', '兒童羊毛氈體驗（示範）']) {
      await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByText('示範資料，價格與內容以工作室公告為準。').first()).toBeVisible();
    await expect(page.getByText('新北市樹林區大有路126號')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://www.instagram.com/wayee.studio/');
    await expect(page.getByRole('link', { name: 'LINE', exact: true })).toHaveAttribute('href', 'https://line.me/R/ti/p/%40012kvgzw');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });
});
