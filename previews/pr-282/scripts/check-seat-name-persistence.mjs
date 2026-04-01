import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const rootDir = resolve(process.cwd());
const host = '127.0.0.1';
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

const server = createServer(async (req, res) => {
  try {
    const rawPath = req.url?.split('?')[0] || '/';
    const relativePath = rawPath === '/' ? 'index.html' : rawPath.slice(1);
    const filePath = join(rootDir, relativePath);
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

async function run() {
  await new Promise((r) => server.listen(0, host, r));
  const address = server.address();
  const port = address && typeof address === 'object' ? address.port : 0;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  page.on('pageerror', (err) => console.error(`[pageerror] ${err.message}`));

  try {
    const url = `http://${host}:${port}/index.html`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const seatInput = page.locator('#left-rows-container .desk-box[data-side="left"][data-r="0"][data-c="0"] .desk-input').first();
    await seatInput.waitFor({ state: 'visible', timeout: 60000 });

    const testName = `Kiem tra luu ten ${Date.now()}`;
    await seatInput.fill(testName);
    await page.evaluate(() => window.handleManualSave('e2e-check'));

    const savedData = await page.evaluate(() => localStorage.getItem('classApp_v28') || '');
    if (!savedData.includes(testName)) throw new Error('localStorage chưa chứa tên vừa nhập');

    await page.reload({ waitUntil: 'domcontentloaded' });
    const reloadedSeatInput = page.locator('#left-rows-container .desk-box[data-side="left"][data-r="0"][data-c="0"] .desk-input').first();
    await reloadedSeatInput.waitFor({ state: 'visible', timeout: 60000 });

    const persistedInDiagram = await page.evaluate((expectedName) => {
      const values = Array.from(document.querySelectorAll('#left-rows-container .desk-input, #right-rows-container .desk-input')).map((el) => el.value.trim());
      return values.includes(expectedName);
    }, testName);

    if (!persistedInDiagram) {
      throw new Error(`Không tìm thấy tên "${testName}" trên sơ đồ sau khi tải lại.`);
    }
    console.log(`PASS: Đã lưu và tải lại đúng tên "${testName}".`);
  } finally {
    await context.close();
    await browser.close();
    await new Promise((r) => server.close(r));
  }
}

run().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
});
