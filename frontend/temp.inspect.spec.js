const { test } = require('@playwright/test');

test('inspect deployed app', async ({ page }) => {
  page.on('console', msg => console.log('CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR', err.message));
  page.on('response', res => {
    const url = res.url();
    if (url.includes('manifest') || url.includes('sw.js') || url.includes('/api/')) {
      console.log('RESPONSE', res.status(), url);
    }
  });
  await page.goto('https://tierraluna.vercel.app/', { waitUntil: 'networkidle' });
  console.log('BODY', await page.textContent('body'));
});
